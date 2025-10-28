// supabase edge function: classify + store results in guest_messages
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Language code to full name mapping for better OpenAI prompts
const LANGUAGE_NAMES: Record<string, string> = {
  de: "German",
  en: "English",
  es: "Spanish",
  fr: "French",
  it: "Italian",
  pt: "Portuguese",
  nl: "Dutch",
  pl: "Polish",
  ru: "Russian",
  uk: "Ukrainian",
  bg: "Bulgarian",
  ro: "Romanian",
  cs: "Czech",
  sk: "Slovak",
  hu: "Hungarian",
  el: "Greek",
  sv: "Swedish",
  da: "Danish",
  no: "Norwegian",
  fi: "Finnish",
  zh: "Chinese",
  ja: "Japanese",
  ko: "Korean",
  th: "Thai",
  vi: "Vietnamese",
  id: "Indonesian",
  ms: "Malay",
  hi: "Hindi",
  ar: "Arabic",
  he: "Hebrew",
  tr: "Turkish",
};

function getLanguageName(code: string): string {
  return LANGUAGE_NAMES[code.toLowerCase()] || code;
}

// Allowed coarse departments
const ALLOWED_DEPARTMENTS = new Set([
  "reservation",
  "check-in-out",
  "room-access",
  "housekeeping",
  "maintenance",
  "amenities",
  "food-beverage",
  "billing-payment",
  "wifi-tech",
  "transport-parking",
  "hotel-info",
  "local-recommendations",
  "safety-security",
  "lost-and-found",
  "special-requests",
  "other",
]);

function coarseDepartment(topic: string): string {
  const t = (topic || "").toLowerCase().trim();
  return ALLOWED_DEPARTMENTS.has(t) ? t : "other";
}

async function runOpenAI(
  systemMessage: string,
  prompt: string,
  maxTokens: number,
  temperature: number,
  apiKey: string
): Promise<string> {
  const payload = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    max_tokens: maxTokens,
    temperature,
  };

  const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!aiRes.ok) {
    throw new Error(
      `OpenAI API error: ${aiRes.status} - ${await aiRes.text()}`
    );
  }

  const data = await aiRes.json();
  return data?.choices?.[0]?.message?.content?.trim() || "";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const requestBody = await req.json();
    const {
      task,
      text,
      targetLanguage,
      message_id,
      original_language,
      context,
    } = requestBody;

    if (!task || !text) {
      return new Response(
        JSON.stringify({
          error: "Missing 'task' or 'text'",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({
          error: "OpenAI API key not configured",
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    let result = null;
    let results: any = {};

    // ---------------- FULL PIPELINE ----------------
    if (task === "full_pipeline") {
      const sentimentPrompt = `Classify the sentiment of the message below.

Rules:
- Choose exactly one: positive, negative, or neutral (lowercase).
- Polite complaints are negative even if courteous.
- Purely factual requests or scheduling are neutral.
- Gratitude/praise is positive.
- Handle negation and sarcasm.
- Output ONLY the label.

Message:
"""${text}"""`;

      const urgencyPrompt = `Classify the urgency of the hotel guest message below.

Output ONLY: URGENT, HIGH, MEDIUM, or LOW.

Message:
"""${text}"""`;

      const topicsSystem = `
You are a classifier that assigns a COARSE topic and a more DETAILED subtopic from a FIXED list.
Return ONLY a JSON object with 'topic' and 'subtopic' keys.
If no specific subtopic is identified, set 'subtopic' to null.
Do not invent new categories.

Allowed topics:
["reservation","check-in-out","room-access","housekeeping","maintenance","amenities",
 "food-beverage","billing-payment","wifi-tech","transport-parking","hotel-info",
 "local-recommendations","safety-security","lost-and-found","special-requests","other"]

Allowed subtopics (examples, not exhaustive):
- reservation: new-booking, modify-booking, cancel-booking, booking-inquiry
- check-in-out: early-check-in, late-check-out, check-in-process, check-out-process
- room-access: keycard-issue, locked-out, safe-access
- housekeeping: extra-towels, room-cleaning, minibar-restock, laundry-service, turndown-service
- maintenance: AC-issue, plumbing-issue, electrical-issue, TV-issue, broken-furniture, pest-control
- amenities: gym-access, pool-hours, spa-booking, business-center, concierge-service
- food-beverage: room-service-order, restaurant-reservation, bar-inquiry, dietary-restrictions, breakfast-time
- billing-payment: payment-dispute, invoice-request, credit-card-issue, refund-status
- wifi-tech: internet-speed, connection-issue, password-request, device-pairing
- transport-parking: taxi-request, shuttle-service, airport-transfer, parking-availability, valet-service
- hotel-info: hotel-hours, policy-inquiry, directions-within-hotel, general-inquiry
- local-recommendations: restaurant-recommendation, attraction-recommendation, tour-booking, local-event-info
- safety-security: emergency-situation, security-concern, lost-child, medical-emergency
- lost-and-found: lost-item, found-item, item-inquiry
- special-requests: extra-bed, crib, accessibility-needs, celebration-arrangement, pet-policy-inquiry
- other: general-feedback, complaint, compliment, suggestion

Return ONLY a JSON object like: {"topic": "topic-name", "subtopic": "subtopic-name" or null}.`;

      const topicsPrompt = `
Message: "There's smoke smell in my room!" → {"topic": "safety-security", "subtopic": "emergency-situation"}
Message: "The room smells bad, looks like it wasn't cleaned." → {"topic": "housekeeping", "subtopic": "room-cleaning"}
Message: "Water is leaking from the bathroom ceiling." → {"topic": "maintenance", "subtopic": "plumbing-issue"}
Message: "My keycard doesn't work and I'm locked out." → {"topic": "room-access", "subtopic": "keycard-issue"}
Message: "What's the wifi password? It's very slow." → {"topic": "wifi-tech", "subtopic": "password-request"}
Message: "I was charged twice for the minibar, please check." → {"topic": "billing-payment", "subtopic": "payment-dispute"}
Message: "What time is breakfast and where's the gym?" → {"topic": "hotel-info", "subtopic": "general-inquiry"}
Message: "I need a taxi to the airport." → {"topic": "transport-parking", "subtopic": "taxi-request"}
Message: "Can I get a late checkout?" → {"topic": "check-in-out", "subtopic": "late-check-out"}
Message: "I want to cancel my reservation for tomorrow." → {"topic": "reservation", "subtopic": "cancel-booking"}
Message: "Can you recommend a good Italian restaurant nearby?" → {"topic": "local-recommendations", "subtopic": "restaurant-recommendation"}
Message: "I need extra towels for my room." → {"topic": "housekeeping", "subtopic": "extra-towels"}
Message: "My TV is not working." → {"topic": "maintenance", "subtopic": "TV-issue"}
Message: "I lost my wallet in the lobby." → {"topic": "lost-and-found", "subtopic": "lost-item"}
Message: "Can I get a crib for my baby?" → {"topic": "special-requests", "subtopic": "crib"}
Message: "I have a general question about my stay." → {"topic": "other", "subtopic": null}

Now classify this message:

Message: """${text}"""`;

      // Get full language name for better translation
      const targetLangName = getLanguageName(targetLanguage || "en");

      const [sentiment, urgency, topicsRaw, translation] = await Promise.all([
        runOpenAI(
          "You are a strict one-word sentiment classifier for hotel/guest messages. Output EXACTLY one lowercase label from {positive, negative, neutral}. No punctuation, no extra words.",
          sentimentPrompt,
          50,
          0.1,
          openaiApiKey
        ),
        runOpenAI(
          "You are a highly accurate urgency classifier. Output EXACTLY one of {URGENT, HIGH, MEDIUM, LOW}. No extra words.",
          urgencyPrompt,
          50,
          0.1,
          openaiApiKey
        ),
        runOpenAI(topicsSystem, topicsPrompt, 100, 0, openaiApiKey),
        original_language &&
        targetLanguage &&
        original_language.toLowerCase() !== targetLanguage.toLowerCase()
          ? runOpenAI(
              "You are a professional translator. Provide only the translated text without any additional commentary or formatting.",
              `Translate the following text into ${targetLangName}. Only return the translated text, nothing else: "${text}"`,
              500,
              0.3,
              openaiApiKey
            )
          : null,
      ]);

      let topicsObj = {
        topic: "other",
        subtopic: null,
      };
      try {
        topicsObj = JSON.parse(topicsRaw);
      } catch (_) {
        console.error("Failed to parse topics JSON:", topicsRaw);
      }

      results = {
        sentiment,
        urgency,
        topic: topicsObj.topic, // Store as single string
        subtopic: topicsObj.subtopic, // Store as single string (can be null)
        translated_text: translation,
        is_translated: !!translation,
        target_language: translation ? targetLanguage : null, // Store ISO code
      };

      result = JSON.stringify(results);
    }

    // ---------------- TRANSLATE ONLY ----------------
    if (task === "translate") {
      // Get full language name for better translation
      const targetLangName = getLanguageName(targetLanguage || "en");

      result = await runOpenAI(
        "You are a professional translator. Provide only the translated text without any additional commentary or formatting.",
        `Translate the following text into ${targetLangName}. Only return the translated text, nothing else: "${text}"`,
        500,
        0.3,
        openaiApiKey
      );

      results = {
        translated_text: result,
        is_translated:
          original_language &&
          targetLanguage &&
          original_language.toLowerCase() !== targetLanguage.toLowerCase(),
        target_language: targetLanguage, // Store ISO code
      };
    }

    // ---------------- ANSWER QUESTION ----------------
    if (task === "answer_question") {
      let qaContext = context || "";

      // If hotel_id is provided, fetch from DB
      if (requestBody.hotel_id) {
        const { data: qaRows, error: qaError } = await supabase
          .from("qa_recommendations")
          .select("question, answer")
          .eq("hotel_id", requestBody.hotel_id)
          .eq("is_active", true);

        if (qaError) {
          return new Response(
            JSON.stringify({
              error: "Failed to fetch Q&A from database",
              details: qaError.message,
            }),
            {
              status: 500,
              headers: {
                ...corsHeaders,
                "Content-Type": "application/json",
              },
            }
          );
        }

        // Build context from DB rows
        qaContext = (qaRows || [])
          .map((row) => `Q: ${row.question}\nA: ${row.answer}`)
          .join("\n\n");
      }

      if (!qaContext) {
        return new Response(
          JSON.stringify({
            error: "No Q&A context available (provide hotel_id or context)",
          }),
          {
            status: 400,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      const qaSystem = `You are a helpful hotel assistant.
Use the provided Q&A context to answer guest questions clearly and politely.
If the answer is not found in the context, say you don't know instead of inventing information.`;

      const prompt = `Context:\n${qaContext}\n\nQuestion: ${text}\nAnswer:`;

      result = await runOpenAI(qaSystem, prompt, 500, 0.7, openaiApiKey);

      results = {
        answer: result,
      };
    }

    // ---------------- DB UPDATE ----------------
    let dbUpdate: any = {
      ok: false,
      note: "No message_id provided",
    };

    if (message_id) {
      console.log("📝 [EDGE FUNCTION] Updating database with results:", {
        message_id,
        results,
      });

      const patch = {
        ...results,
        ai_analysis_completed: true,
        updated_at: new Date().toISOString(),
      };

      console.log("📝 [EDGE FUNCTION] Patch object:", patch);

      const { data: updData, error: updErr } = await supabase
        .from("guest_messages")
        .update(patch)
        .eq("id", message_id)
        .select();

      if (updErr) {
        console.error("❌ [EDGE FUNCTION] Database update failed:", {
          error: updErr,
          message_id,
          patch,
        });
      } else {
        console.log("✅ [EDGE FUNCTION] Database updated successfully:", {
          message_id,
          updatedData: updData,
        });
      }

      dbUpdate = updErr
        ? {
            ok: false,
            error: updErr.message,
          }
        : {
            ok: true,
            rows: updData,
          };
    } else {
      console.warn(
        "⚠️ [EDGE FUNCTION] No message_id provided, skipping database update"
      );
    }

    console.log("🎉 [EDGE FUNCTION] Returning response:", {
      task,
      hasResult: !!result,
      hasResults: !!results,
      dbUpdate,
    });

    return new Response(
      JSON.stringify({
        task,
        result,
        results,
        dbUpdate,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});

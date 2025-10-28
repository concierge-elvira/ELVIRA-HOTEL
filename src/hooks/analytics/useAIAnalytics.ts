import { useOptimizedQuery } from "../api/useOptimizedQuery";
import { supabase } from "../../services/supabase";
import type {
  GuestMessageAnalytics,
  TopicCount,
  SubtopicCount,
  SentimentData,
  GuestMessageData,
  UrgencyData,
  MessageWithGuest,
  TopicTrendData,
} from "../../types/analytics";

interface AIAnalyticsResponse {
  analytics: GuestMessageAnalytics;
}

async function fetchAIAnalytics(
  hotelId: string | undefined
): Promise<AIAnalyticsResponse> {
  if (!hotelId) {
    throw new Error("Hotel ID is required");
  }

  // Fetch guest messages with guest information
  const { data: messages, error } = await supabase
    .from("guest_messages")
    .select(
      `
      id,
      message_text,
      topics,
      subtopics,
      sentiment,
      urgency,
      created_at,
      guest_id,
      guests!inner (
        id,
        guest_name,
        guest_personal_data (
          first_name,
          last_name,
          guest_email
        )
      )
    `
    )
    .eq("hotel_id", hotelId)
    .eq("sender_type", "guest")
    .order("created_at", { ascending: false });

  if (error) throw error;

  // Transform messages with guest data
  const messagesWithGuests: MessageWithGuest[] = (messages || []).map(
    (msg: {
      id: string;
      message_text: string;
      topics: string[] | null;
      subtopics: string | null;
      sentiment: string | null;
      urgency: string | null;
      created_at: string;
      guest_id: string | null;
      guests: {
        id: string;
        guest_name: string;
        guest_personal_data: {
          first_name: string;
          last_name: string;
          guest_email: string;
        } | null;
      } | null;
    }) => ({
      id: msg.id,
      message_text: msg.message_text,
      topics: msg.topics,
      subtopics: msg.subtopics,
      sentiment: msg.sentiment,
      urgency: msg.urgency,
      created_at: msg.created_at,
      guest_id: msg.guest_id,
      guest_name: msg.guests?.guest_personal_data
        ? `${msg.guests.guest_personal_data.first_name || ""} ${
            msg.guests.guest_personal_data.last_name || ""
          }`.trim()
        : msg.guests?.guest_name || "Unknown Guest",
      guest_email: msg.guests?.guest_personal_data?.guest_email || null,
    })
  );

  const totalMessages = messagesWithGuests.length;
  const analyzedMessages = messagesWithGuests.filter(
    (m) => m.topics && m.topics.length > 0
  ).length;

  // Calculate topic counts for Pareto chart
  const topicMap = new Map<string, number>();
  const topicSubtopicsMap = new Map<string, Map<string, number>>();

  messagesWithGuests.forEach((msg) => {
    if (msg.topics && Array.isArray(msg.topics) && msg.topics.length > 0) {
      msg.topics.forEach((topic: string) => {
        if (topic) {
          // Filter out empty strings
          topicMap.set(topic, (topicMap.get(topic) || 0) + 1);

          // Track subtopics for each topic
          if (msg.subtopics) {
            const subtopics = msg.subtopics.split(",").map((s) => s.trim());

            if (!topicSubtopicsMap.has(topic)) {
              topicSubtopicsMap.set(topic, new Map<string, number>());
            }
            const subtopicMap = topicSubtopicsMap.get(topic)!;

            subtopics.forEach((subtopic: string) => {
              if (subtopic) {
                subtopicMap.set(subtopic, (subtopicMap.get(subtopic) || 0) + 1);
              }
            });
          }
        }
      });
    }
  });

  const sortedTopics = Array.from(topicMap.entries())
    .filter(([topic]) => topic && topic.trim() !== "") // Filter out empty topics
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15); // Top 15 topics

  let cumulativeCount = 0;
  const topTopics: TopicCount[] = sortedTopics.map(([topic, count]) => {
    cumulativeCount += count;
    const percentage = (count / totalMessages) * 100;
    const cumulativePercentage = (cumulativeCount / totalMessages) * 100;

    // Get subtopics for this topic
    const subtopicMap = topicSubtopicsMap.get(topic);
    const subtopics: SubtopicCount[] = [];

    if (subtopicMap) {
      const sortedSubtopics = Array.from(subtopicMap.entries()).sort(
        (a, b) => b[1] - a[1]
      );

      let subCumulativeCount = 0;
      sortedSubtopics.forEach(([subtopic, subCount]) => {
        subCumulativeCount += subCount;
        const subPercentage = (subCount / count) * 100;
        const subCumulativePercentage = (subCumulativeCount / count) * 100;

        subtopics.push({
          subtopic,
          count: subCount,
          percentage: subPercentage,
          cumulativePercentage: subCumulativePercentage,
        });
      });
    }

    return {
      topic,
      count,
      percentage,
      cumulativePercentage,
      subtopics,
    };
  });

  // Calculate subtopic counts for Pareto chart (all subtopics aggregated)
  const subtopicMap = new Map<string, number>();
  messagesWithGuests.forEach((msg) => {
    if (msg.subtopics) {
      const subtopics = msg.subtopics.split(",").map((s) => s.trim());
      subtopics.forEach((subtopic: string) => {
        if (subtopic) {
          subtopicMap.set(subtopic, (subtopicMap.get(subtopic) || 0) + 1);
        }
      });
    }
  });

  const sortedSubtopics = Array.from(subtopicMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15); // Top 15 subtopics

  let cumulativeSubCount = 0;
  const topSubtopics: SubtopicCount[] = sortedSubtopics.map(
    ([subtopic, count]) => {
      cumulativeSubCount += count;
      const percentage = (count / totalMessages) * 100;
      const cumulativePercentage = (cumulativeSubCount / totalMessages) * 100;
      return {
        subtopic,
        count,
        percentage,
        cumulativePercentage,
      };
    }
  );

  // Calculate sentiment distribution
  const sentimentMap = new Map<string, number>();
  messagesWithGuests.forEach((msg) => {
    if (msg.sentiment) {
      sentimentMap.set(
        msg.sentiment,
        (sentimentMap.get(msg.sentiment) || 0) + 1
      );
    }
  });

  const sentimentDistribution: SentimentData[] = Array.from(
    sentimentMap.entries()
  ).map(([sentiment, count]) => ({
    sentiment: sentiment.charAt(0).toUpperCase() + sentiment.slice(1),
    count,
  }));

  // Calculate urgency distribution
  const urgencyMap = new Map<string, number>();
  messagesWithGuests.forEach((msg) => {
    if (msg.urgency) {
      urgencyMap.set(msg.urgency, (urgencyMap.get(msg.urgency) || 0) + 1);
    }
  });

  const urgencyDistribution: UrgencyData[] = Array.from(urgencyMap.entries())
    .map(([urgency, count]) => ({
      urgency: urgency.charAt(0).toUpperCase() + urgency.slice(1),
      count,
    }))
    .sort((a, b) => {
      const order = { High: 0, Medium: 1, Low: 2 };
      return (
        (order[a.urgency as keyof typeof order] || 3) -
        (order[b.urgency as keyof typeof order] || 3)
      );
    });

  // Calculate average sentiment score
  const sentimentScores: { [key: string]: number } = {
    positive: 1,
    neutral: 0,
    negative: -1,
  };
  const totalSentimentScore = messagesWithGuests.reduce((sum, msg) => {
    return sum + (sentimentScores[msg.sentiment?.toLowerCase() || ""] || 0);
  }, 0);
  const averageSentiment =
    messagesWithGuests.length > 0
      ? totalSentimentScore / messagesWithGuests.length
      : 0;

  // Group messages by guest
  const guestMap = new Map<string, GuestMessageData>();
  messagesWithGuests.forEach((msg) => {
    if (msg.guest_id) {
      const existing = guestMap.get(msg.guest_id);
      if (existing) {
        existing.messageCount++;
        if (new Date(msg.created_at) > new Date(existing.lastMessageDate)) {
          existing.lastMessageDate = msg.created_at;
        }
        if (msg.topics) {
          msg.topics.forEach((topic) => {
            if (!existing.topTopics.includes(topic)) {
              existing.topTopics.push(topic);
            }
          });
        }
      } else {
        guestMap.set(msg.guest_id, {
          guestId: msg.guest_id,
          guestName: msg.guest_name || "Unknown Guest",
          email: msg.guest_email || "",
          messageCount: 1,
          lastMessageDate: msg.created_at,
          averageSentiment: msg.sentiment || "neutral",
          topTopics: msg.topics || [],
        });
      }
    }
  });

  const messagesByGuest = Array.from(guestMap.values()).sort(
    (a, b) => b.messageCount - a.messageCount
  );

  // Generate timeline data - group by day
  const timelineMap = new Map<
    string,
    {
      date: string;
      topicCounts: Map<string, number>;
      sentimentCounts: { positive: number; neutral: number; negative: number };
      urgencyCounts: { high: number; medium: number; low: number };
      totalMessages: number;
    }
  >();

  messagesWithGuests.forEach((msg) => {
    const dateKey = new Date(msg.created_at).toISOString().split("T")[0];

    if (!timelineMap.has(dateKey)) {
      timelineMap.set(dateKey, {
        date: dateKey,
        topicCounts: new Map<string, number>(),
        sentimentCounts: { positive: 0, neutral: 0, negative: 0 },
        urgencyCounts: { high: 0, medium: 0, low: 0 },
        totalMessages: 0,
      });
    }

    const dayData = timelineMap.get(dateKey)!;
    dayData.totalMessages++;

    // Count topics
    if (msg.topics && Array.isArray(msg.topics)) {
      msg.topics.forEach((topic: string) => {
        dayData.topicCounts.set(
          topic,
          (dayData.topicCounts.get(topic) || 0) + 1
        );
      });
    }

    // Count sentiment
    const sentiment = msg.sentiment?.toLowerCase() || "neutral";
    if (sentiment === "positive") dayData.sentimentCounts.positive++;
    else if (sentiment === "negative") dayData.sentimentCounts.negative++;
    else dayData.sentimentCounts.neutral++;

    // Count urgency
    const urgency = msg.urgency?.toLowerCase() || "low";
    if (urgency === "high") dayData.urgencyCounts.high++;
    else if (urgency === "medium") dayData.urgencyCounts.medium++;
    else dayData.urgencyCounts.low++;
  });

  // Convert to array and get top topics for timeline
  const topTopicNames = topTopics.slice(0, 5).map((t) => t.topic);

  const topicTrends = Array.from(timelineMap.values())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((day) => {
      const dataPoint: TopicTrendData = {
        date: day.date,
        totalMessages: day.totalMessages,
        positive: day.sentimentCounts.positive,
        neutral: day.sentimentCounts.neutral,
        negative: day.sentimentCounts.negative,
        urgencyHigh: day.urgencyCounts.high,
        urgencyMedium: day.urgencyCounts.medium,
        urgencyLow: day.urgencyCounts.low,
      };

      // Add top topics as separate keys
      topTopicNames.forEach((topicName) => {
        dataPoint[topicName] = day.topicCounts.get(topicName) || 0;
      });

      return dataPoint;
    });

  const analytics: GuestMessageAnalytics = {
    totalMessages,
    analyzedMessages,
    averageSentiment,
    topTopics,
    topSubtopics,
    sentimentDistribution,
    messagesByGuest,
    topicTrends,
    urgencyDistribution,
  };

  return { analytics };
}

export function useAIAnalytics(hotelId: string | undefined) {
  return useOptimizedQuery<AIAnalyticsResponse>({
    queryKey: ["ai-analytics", hotelId],
    queryFn: () => fetchAIAnalytics(hotelId),
    enabled: !!hotelId,
  });
}

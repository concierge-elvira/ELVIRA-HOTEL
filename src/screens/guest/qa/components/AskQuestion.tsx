/**
 * Ask Question Component
 *
 * Allows guests to ask custom questions using natural language
 * Uses OpenAI analyzer edge function to provide intelligent answers
 */

import React, { useState } from "react";
import { Send } from "lucide-react";
import { getGuestSupabaseClient } from "../../../../services/guestSupabase";

interface AskQuestionProps {
  hotelId: string;
}

export const AskQuestion: React.FC<AskQuestionProps> = ({ hotelId }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAsk = async () => {
    if (!question.trim()) return;

    setIsLoading(true);
    setError(null);
    setAnswer("");

    try {
      const supabase = getGuestSupabaseClient();

      // Call OpenAI analyzer edge function
      const { data, error: invokeError } = await supabase.functions.invoke(
        "openai-analyzer",
        {
          body: {
            task: "answer_question",
            text: question.trim(),
            hotel_id: hotelId,
          },
        }
      );

      if (invokeError) {
        throw new Error("Failed to get answer");
      }

      // Extract answer from response
      // The edge function returns the answer in both data.result and data.results.answer
      const answerText =
        data?.results?.answer ||
        data?.result ||
        "Sorry, I couldn't find an answer to your question.";
      setAnswer(answerText);
    } catch (err) {
      console.error("Error asking question:", err);
      setError("Failed to get an answer. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 p-3">
      <h3 className="text-sm font-semibold text-gray-900 mb-2">
        Ask a Question
      </h3>

      {/* Input */}
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your question here..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
        <button
          onClick={handleAsk}
          disabled={isLoading || !question.trim()}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">Ask</span>
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Answer */}
      {answer && (
        <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{answer}</p>
        </div>
      )}
    </div>
  );
};

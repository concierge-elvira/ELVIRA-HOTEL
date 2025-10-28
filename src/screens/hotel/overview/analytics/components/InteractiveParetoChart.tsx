import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { ParetoChart } from "../../../../../components/analytics";
import { CHART_COLORS } from "../../../../../components/analytics/constants";
import type { TopicCount } from "../../../../../types/analytics";

interface InteractiveParetoChartProps {
  topics: TopicCount[];
}

export function InteractiveParetoChart({
  topics,
}: InteractiveParetoChartProps) {
  const [selectedTopic, setSelectedTopic] = useState<TopicCount | null>(null);

  // Check if we have valid data
  if (!topics || topics.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg font-medium mb-2">No Topic Data Available</p>
        <p className="text-sm">
          Guest messages need to be analyzed by AI to show topic trends. Topics
          will appear here once messages are processed.
        </p>
      </div>
    );
  }

  const handleBarClick = (data: { name: string }) => {
    if (!selectedTopic) {
      // User clicked on a topic, drill down to subtopics
      const topic = topics.find((t) => t.topic === data.name);
      if (topic && topic.subtopics.length > 0) {
        setSelectedTopic(topic);
      }
    }
  };

  const handleBack = () => {
    setSelectedTopic(null);
  };

  // Prepare data for the current view
  const chartData = selectedTopic
    ? selectedTopic.subtopics.map((sub) => ({
        name: sub.subtopic,
        value: sub.count,
        percentage: sub.percentage,
        cumulativePercentage: sub.cumulativePercentage,
      }))
    : topics.map((topic) => ({
        name: topic.topic,
        value: topic.count,
        percentage: topic.percentage,
        cumulativePercentage: topic.cumulativePercentage,
      }));

  return (
    <div className="relative">
      {/* Header with breadcrumb */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {selectedTopic && (
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Topics
            </button>
          )}
        </div>
        <div className="text-sm text-gray-600">
          {selectedTopic ? (
            <span>
              Showing subtopics for:{" "}
              <span className="font-semibold text-gray-900">
                {selectedTopic.topic}
              </span>
            </span>
          ) : (
            <span className="text-gray-500 italic">
              Click on a topic bar to view its subtopics
            </span>
          )}
        </div>
      </div>

      {/* Pareto Chart */}
      <div
        onClick={(e) => {
          // Find the clicked bar
          const target = e.target as HTMLElement;
          const barElement = target.closest(".recharts-bar-rectangle");
          if (barElement) {
            const index = Array.from(
              barElement.parentElement?.children || []
            ).indexOf(barElement);
            if (index >= 0 && chartData[index]) {
              handleBarClick(chartData[index]);
            }
          }
        }}
        style={{ cursor: selectedTopic ? "default" : "pointer" }}
      >
        <ParetoChart
          data={chartData}
          height={350}
          barColor={selectedTopic ? CHART_COLORS.blue : CHART_COLORS.primary}
          lineColor={CHART_COLORS.red}
        />
      </div>

      {/* Info message */}
      {!selectedTopic && chartData.length > 0 && (
        <div className="mt-3 p-2 bg-emerald-50 border border-emerald-200 rounded-lg">
          <p className="text-xs text-emerald-800">
            <span className="font-semibold">💡 Tip:</span> Click on any topic
            bar to drill down and see its specific subtopics.
          </p>
        </div>
      )}
    </div>
  );
}

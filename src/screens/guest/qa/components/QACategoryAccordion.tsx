/**
 * Q&A Category Accordion Component
 *
 * Displays Q&A items grouped by category in an expandable accordion format
 */

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Database } from "../../../../types/database";

type QARecommendation =
  Database["public"]["Tables"]["qa_recommendations"]["Row"];

interface QACategoryAccordionProps {
  category: string;
  items: QARecommendation[];
}

export const QACategoryAccordion: React.FC<QACategoryAccordionProps> = ({
  category,
  items,
}) => {
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenItemId(openItemId === id ? null : id);
  };

  // Get badge count
  const itemCount = items.length;

  return (
    <div className="mb-2">
      {/* Category Header - No container, just text and badge */}
      <div className="flex items-center gap-3 px-1 py-2">
        <span className="font-semibold text-gray-900 uppercase text-sm">
          {category}
        </span>
        <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
          {itemCount}
        </span>
      </div>

      {/* Category Items */}
      <div className="space-y-1">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden"
          >
            {/* Question */}
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full flex items-start justify-between p-2.5 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex-1 pr-3">
                <p className="text-sm font-medium text-gray-900">
                  {item.question}
                </p>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 shrink-0 mt-0.5 transition-transform ${
                  openItemId === item.id ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Answer */}
            {openItemId === item.id && item.answer && (
              <div className="px-2.5 pb-2.5 pt-0 border-t border-gray-100">
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

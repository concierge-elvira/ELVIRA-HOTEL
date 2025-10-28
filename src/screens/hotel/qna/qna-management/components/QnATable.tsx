import { useMemo, useState } from "react";
import {
  Table,
  type TableColumn,
  StatusBadge,
} from "../../../../../components/ui";
import {
  useQARecommendations,
  useUpdateQARecommendation,
} from "../../../../../hooks/qna/useQARecommendations";
import { useHotelContext } from "../../../../../hooks";
import type { Database } from "../../../../../types/database";

type QARecommendationRow =
  Database["public"]["Tables"]["qa_recommendations"]["Row"];

interface QnATableData extends Record<string, unknown> {
  id: string;
  status: string;
  isActive: boolean;
  category: string;
  question: string;
  answer: string;
  created: string;
  type: string;
}

interface QnATableProps {
  searchValue: string;
  onView: (qaItem: QARecommendationRow) => void;
}

export function QnATable({ searchValue, onView }: QnATableProps) {
  // Sorting state
  const [sortColumn, setSortColumn] = useState<string | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Get hotel ID from context
  const { hotelId } = useHotelContext();

  // Fetch Q&A recommendations data
  const {
    data: qnaItems = [],
    isLoading,
    error,
  } = useQARecommendations(hotelId || undefined);

  // Get the mutations
  const updateQARecommendation = useUpdateQARecommendation();

  // Handler for row click
  const handleRowClick = (row: QnATableData) => {
    const qaItem = qnaItems.find((q) => q.id === row.id);
    if (qaItem) {
      onView(qaItem);
    }
  };

  // Handler for sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Transform and filter Q&A data
  const qnaData = useMemo(() => {
    const transformedData: QnATableData[] = qnaItems.map((item) => ({
      id: item.id,
      status: item.is_active ? "Active" : "Inactive",
      isActive: item.is_active,
      category: item.category || "N/A",
      type: item.type || "N/A",
      question: item.question || "N/A",
      answer: item.answer || "N/A",
      created: item.created_at
        ? new Date(item.created_at).toLocaleDateString()
        : "N/A",
    }));

    // Apply search filter
    let filtered = transformedData;
    if (searchValue.trim()) {
      const searchLower = searchValue.toLowerCase();
      filtered = transformedData.filter(
        (item) =>
          item.category.toLowerCase().includes(searchLower) ||
          item.question.toLowerCase().includes(searchLower) ||
          item.answer.toLowerCase().includes(searchLower) ||
          item.type.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    if (sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = (a as Record<string, unknown>)[sortColumn];
        const bValue = (b as Record<string, unknown>)[sortColumn];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        let comparison = 0;
        if (typeof aValue === "number" && typeof bValue === "number") {
          comparison = aValue - bValue;
        } else {
          const aStr = String(aValue).toLowerCase();
          const bStr = String(bValue).toLowerCase();
          comparison = aStr.localeCompare(bStr);
        }

        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    return filtered;
  }, [qnaItems, searchValue, sortColumn, sortDirection]);

  // Define table columns for Q&A
  const columns: TableColumn<QnATableData>[] = [
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (_value, row) => (
        <StatusBadge
          status={row.isActive ? "active" : "inactive"}
          onToggle={async (newStatus) => {
            await updateQARecommendation.mutateAsync({
              id: row.id,
              updates: { is_active: newStatus },
            });
          }}
        />
      ),
    },
    {
      key: "category",
      label: "Category",
      sortable: true,
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
    },
    {
      key: "question",
      label: "Question",
      sortable: true,
    },
    {
      key: "answer",
      label: "Answer",
      sortable: true,
    },
    {
      key: "created",
      label: "Created",
      sortable: true,
    },
  ];

  return (
    <div className="mt-6">
      {searchValue && (
        <p className="text-sm text-gray-600 mb-4">
          Searching for: "{searchValue}"
        </p>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">
            Error loading Q&A items: {error.message}
          </p>
        </div>
      )}

      {/* Q&A Table */}
      <Table
        columns={columns}
        data={qnaData}
        loading={isLoading}
        emptyMessage="No Q&A items found. Add new questions and answers to get started."
        itemsPerPage={10}
        onRowClick={handleRowClick}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
      />
    </div>
  );
}

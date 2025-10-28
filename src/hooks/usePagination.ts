import { useState, useMemo } from "react";

interface UsePaginationProps {
  data: unknown[];
  itemsPerPage?: number;
}

interface UsePaginationReturn<T> {
  currentPage: number;
  totalPages: number;
  paginatedData: T[];
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
}

export function usePagination<T>({
  data,
  itemsPerPage: initialItemsPerPage = 10,
}: UsePaginationProps): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex) as T[];
  }, [data, currentPage, itemsPerPage]);

  const handleSetPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  };

  const handleSetItemsPerPage = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return {
    currentPage,
    totalPages,
    paginatedData,
    itemsPerPage,
    setCurrentPage: handleSetPage,
    setItemsPerPage: handleSetItemsPerPage,
    goToNextPage,
    goToPreviousPage,
  };
}

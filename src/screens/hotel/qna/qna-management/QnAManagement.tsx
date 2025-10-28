import { useState } from "react";
import { QnATable, QAModal, type QAFormData } from "./components";
import { Button, ConfirmationModal } from "../../../../components/ui";
import {
  useCreateQARecommendation,
  useUpdateQARecommendation,
  useDeleteQARecommendation,
} from "../../../../hooks/qna/useQARecommendations";
import { useHotelContext } from "../../../../hooks";
import type { Database } from "../../../../types/database";

type QARecommendation =
  Database["public"]["Tables"]["qa_recommendations"]["Row"];

interface QnAManagementProps {
  searchValue: string;
}

export function QnAManagement({ searchValue }: QnAManagementProps) {
  const { hotelId } = useHotelContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
    "create"
  );
  const [selectedQA, setSelectedQA] = useState<QARecommendation | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [qaToDelete, setQAToDelete] = useState<QARecommendation | null>(null);

  const createQA = useCreateQARecommendation();
  const updateQA = useUpdateQARecommendation();
  const deleteQA = useDeleteQARecommendation();

  const handleAdd = () => {
    setModalMode("create");
    setSelectedQA(null);
    setIsModalOpen(true);
  };

  const handleView = (qaItem: QARecommendation) => {
    setModalMode("view");
    setSelectedQA(qaItem);
    setIsModalOpen(true);
  };

  const handleEditFromView = () => {
    setModalMode("edit");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedQA(null);
  };

  const handleSubmit = async (data: QAFormData) => {
    if (!hotelId) return;

    try {
      if (modalMode === "create") {
        await createQA.mutateAsync({
          hotel_id: hotelId,
          question: data.question,
          answer: data.answer,
          category: data.category,
          type: data.type,
          is_active: data.isActive,
        });
      } else if (modalMode === "edit" && selectedQA) {
        await updateQA.mutateAsync({
          id: selectedQA.id,
          updates: {
            question: data.question,
            answer: data.answer,
            category: data.category,
            type: data.type,
            is_active: data.isActive,
          },
        });
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting Q&A:", error);
    }
  };

  const handleDelete = () => {
    if (selectedQA) {
      setQAToDelete(selectedQA);
      setIsModalOpen(false);
      setIsDeleteConfirmOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!qaToDelete || !hotelId) return;

    try {
      await deleteQA.mutateAsync({
        id: qaToDelete.id,
        hotelId,
      });
      setIsDeleteConfirmOpen(false);
      setQAToDelete(null);
      handleCloseModal();
    } catch (error) {
      console.error("Error deleting Q&A:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Q&A Management
          </h2>
          <p className="text-gray-500">
            Manage frequently asked questions and their answers for guests.
          </p>
        </div>
        <Button variant="primary" size="md" onClick={handleAdd}>
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Q&A
        </Button>
      </div>

      <QnATable searchValue={searchValue} onView={handleView} />

      <QAModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        qaItem={selectedQA}
        onSubmit={handleSubmit}
        onEdit={modalMode === "view" ? handleEditFromView : undefined}
        onDelete={modalMode === "view" ? () => handleDelete() : undefined}
      />

      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Q&A"
        message={`Are you sure you want to delete this Q&A item? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}

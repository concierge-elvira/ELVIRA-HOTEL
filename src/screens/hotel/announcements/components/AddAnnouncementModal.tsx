import { useState, useEffect } from "react";
import { Modal, Input, Button } from "../../../../components/ui";
import {
  useCreateAnnouncement,
  useUpdateAnnouncement,
} from "../../../../hooks/announcements/useAnnouncements";
import { useHotelContext } from "../../../../hooks/useHotelContext";
import { useAuth } from "../../../../hooks/useAuth";
import type { Database } from "../../../../types/database";

type Announcement = Database["public"]["Tables"]["announcements"]["Row"];

interface AddAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: Announcement | null;
}

export function AddAnnouncementModal({
  isOpen,
  onClose,
  editData = null,
}: AddAnnouncementModalProps) {
  const { user } = useAuth();
  const { hotelId } = useHotelContext();
  const createAnnouncement = useCreateAnnouncement();
  const updateAnnouncement = useUpdateAnnouncement();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  // Populate form when editing
  useEffect(() => {
    if (editData) {
      setFormData({
        title: editData.title,
        description: editData.description,
      });
    } else {
      setFormData({ title: "", description: "" });
    }
  }, [editData]);

  const [errors, setErrors] = useState({
    title: "",
    description: "",
  });

  const validateForm = () => {
    const newErrors = {
      title: "",
      description: "",
    };

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return !newErrors.title && !newErrors.description;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!hotelId || !user?.id) {
return;
    }

    try {
      if (editData) {
        // Update existing announcement
        await updateAnnouncement.mutateAsync({
          id: editData.id,
          updates: {
            title: formData.title.trim(),
            description: formData.description.trim(),
          },
        });
      } else {
        // Create new announcement
        await createAnnouncement.mutateAsync({
          title: formData.title.trim(),
          description: formData.description.trim(),
          hotel_id: hotelId,
          created_by: user.id,
          is_active: true,
        });
      }

      // Reset form and close modal
      setFormData({ title: "", description: "" });
      setErrors({ title: "", description: "" });
      onClose();
    } catch (error) {
}
  };

  const handleClose = () => {
    setFormData({ title: "", description: "" });
    setErrors({ title: "", description: "" });
    onClose();
  };

  const isEditMode = !!editData;
  const isPending =
    createAnnouncement.isPending || updateAnnouncement.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? "Edit Announcement" : "Add Announcement"}
    >
      <div className="space-y-4">
        {/* Title Input */}
        <Input
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter announcement title"
          error={errors.title}
          disabled={isPending}
          leftIcon={
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
              />
            </svg>
          }
        />

        {/* Description Textarea */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Enter announcement description"
            disabled={isPending}
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
              errors.description
                ? "border-red-500"
                : "border-gray-300 hover:border-gray-400"
            } ${isPending ? "bg-gray-50" : ""}`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isPending}>
            {isPending ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {isEditMode ? "Updating..." : "Adding..."}
              </>
            ) : isEditMode ? (
              "Update Announcement"
            ) : (
              "Add Announcement"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

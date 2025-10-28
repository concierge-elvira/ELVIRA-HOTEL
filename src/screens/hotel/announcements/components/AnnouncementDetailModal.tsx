import { useState } from "react";
import { Modal, ModalFooter } from "../../../../components/ui";
import {
  ItemBasicInfoDisplay,
  ItemDescriptionDisplay,
  ItemMetadataDisplay,
} from "../../../../components/ui/forms";
import { useUpdateAnnouncement } from "../../../../hooks/announcements/useAnnouncements";
import type { Database } from "../../../../types/database";

type Announcement = Database["public"]["Tables"]["announcements"]["Row"];

interface AnnouncementDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcement: Announcement | null;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function AnnouncementDetailModal({
  isOpen,
  onClose,
  announcement,
  onEdit,
  onDelete,
}: AnnouncementDetailModalProps) {
  const updateAnnouncement = useUpdateAnnouncement();
  const [isUpdating, setIsUpdating] = useState(false);

  if (!announcement) return null;

  const handleStatusToggle = async (newStatus: boolean) => {
    setIsUpdating(true);
    try {
      await updateAnnouncement.mutateAsync({
        id: announcement.id,
        updates: { is_active: newStatus },
      });
    } catch (error) {
} finally {
      setIsUpdating(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Announcement Details"
      size="md"
    >
      <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto">
        {/* Status Badge */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
          <span className="text-sm font-medium text-gray-700">Status</span>
          <button
            onClick={() => handleStatusToggle(!announcement.is_active)}
            disabled={isUpdating}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              announcement.is_active
                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } ${
              isUpdating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {announcement.is_active ? "Active" : "Inactive"}
          </button>
        </div>

        {/* Basic Info */}
        <ItemBasicInfoDisplay
          name={announcement.title}
          category="Announcement"
          hotelRecommended={false}
          hideRecommendedIcon
        />

        {/* Description */}
        <ItemDescriptionDisplay description={announcement.description} />

        {/* Metadata */}
        <ItemMetadataDisplay
          createdAt={announcement.created_at}
          updatedAt={announcement.updated_at}
        />
      </div>

      {/* Footer Actions */}
      <ModalFooter
        onClose={onClose}
        onEdit={onEdit}
        onDelete={onDelete}
        showEdit={!!onEdit}
        showDelete={!!onDelete}
        isLoading={isUpdating}
      />
    </Modal>
  );
}

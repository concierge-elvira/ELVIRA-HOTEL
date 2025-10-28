import { useState } from "react";
import { Users, UserPlus } from "lucide-react";
import { Modal } from "../../../../../components/ui/modals/Modal";
import { Button } from "../../../../../components/ui/buttons/Button";
import { ParticipantItem, AddParticipantsView } from "./group-participants";

interface Participant {
  staff_id: string;
  hotel_staff: {
    id: string;
    department: string | null;
    hotel_staff_personal_data: {
      first_name: string;
      last_name: string;
      email: string;
    } | null;
  };
}

interface StaffMember {
  id: string;
  employee_id: string;
  position: string;
  department: string;
  hotel_staff_personal_data?: {
    first_name: string;
    last_name: string;
    email: string;
  } | null;
}

interface GroupParticipantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupName: string;
  participants: Participant[];
  currentUserId: string;
  creatorId: string;
  availableStaff: StaffMember[];
  onRemoveParticipant: (participantId: string) => Promise<void>;
  onAddParticipants: (staffIds: string[]) => Promise<void>;
}

export function GroupParticipantsModal({
  isOpen,
  onClose,
  groupName,
  participants,
  currentUserId,
  creatorId,
  availableStaff,
  onRemoveParticipant,
  onAddParticipants,
}: GroupParticipantsModalProps) {
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [isAddingView, setIsAddingView] = useState(false);

  const isCreator = currentUserId === creatorId;

  const handleRemove = async (participantId: string) => {
    if (!isCreator || participantId === creatorId) return;

    try {
      setRemovingId(participantId);
      await onRemoveParticipant(participantId);
    } catch (error) {
} finally {
      setRemovingId(null);
    }
  };

  const handleAdd = async (staffIds: string[]) => {
    try {
      await onAddParticipants(staffIds);
      setIsAddingView(false);
    } catch (error) {
throw error;
    }
  };

  // Filter out current participants from available staff
  const participantIds = new Set(participants.map((p) => p.staff_id));
  const filteredAvailableStaff = availableStaff.filter(
    (staff) => !participantIds.has(staff.id)
  );

  const handleClose = () => {
    setIsAddingView(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={groupName} size="md">
      {isAddingView ? (
        <AddParticipantsView
          availableStaff={filteredAvailableStaff}
          onAdd={handleAdd}
          onCancel={() => setIsAddingView(false)}
        />
      ) : (
        <>
          {/* Header Info */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    {participants.length}{" "}
                    {participants.length === 1 ? "participant" : "participants"}
                  </p>
                </div>
              </div>

              {/* Add Participant Button - Only for creator */}
              {isCreator && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsAddingView(true)}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              )}
            </div>
          </div>

          {/* Participants List */}
          <div className="space-y-3 max-h-[60vh] overflow-y-auto mb-6">
            {participants
              .sort((a, b) => {
                // Creator first
                if (a.staff_id === creatorId) return -1;
                if (b.staff_id === creatorId) return 1;
                // Then alphabetically
                const aName = a.hotel_staff.hotel_staff_personal_data
                  ? `${a.hotel_staff.hotel_staff_personal_data.first_name} ${a.hotel_staff.hotel_staff_personal_data.last_name}`
                  : "Unknown";
                const bName = b.hotel_staff.hotel_staff_personal_data
                  ? `${b.hotel_staff.hotel_staff_personal_data.first_name} ${b.hotel_staff.hotel_staff_personal_data.last_name}`
                  : "Unknown";
                return aName.localeCompare(bName);
              })
              .map((participant) => (
                <ParticipantItem
                  key={participant.staff_id}
                  participant={participant}
                  isCreator={isCreator}
                  creatorId={creatorId}
                  currentUserId={currentUserId}
                  removingId={removingId}
                  onRemove={handleRemove}
                />
              ))}
          </div>

          {/* Footer */}
          <div className="flex justify-end">
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}

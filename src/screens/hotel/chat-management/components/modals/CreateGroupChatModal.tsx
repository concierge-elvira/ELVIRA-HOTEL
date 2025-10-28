import React, { useState, useMemo } from "react";
import { Search, Check, Users } from "lucide-react";
import { Modal } from "../../../../../components/ui/modals";
import { Button } from "../../../../../components/ui/buttons";

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

interface CreateGroupChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffMembers: StaffMember[];
  currentUserId: string;
  onCreateGroup: (
    groupName: string,
    selectedStaffIds: string[]
  ) => Promise<void>;
}

export const CreateGroupChatModal: React.FC<CreateGroupChatModalProps> = ({
  isOpen,
  onClose,
  staffMembers,
  currentUserId,
  onCreateGroup,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStaffIds, setSelectedStaffIds] = useState<Set<string>>(
    new Set()
  );
  const [groupName, setGroupName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Filter out current user and filter by search
  const filteredStaff = useMemo(() => {
    return staffMembers
      .filter((staff) => staff.id !== currentUserId)
      .filter((staff) => {
        if (!searchQuery) return true;
        const fullName = `${
          staff.hotel_staff_personal_data?.first_name || ""
        } ${staff.hotel_staff_personal_data?.last_name || ""}`.toLowerCase();
        const position = staff.position.toLowerCase();
        const department = staff.department.toLowerCase();
        const query = searchQuery.toLowerCase();
        return (
          fullName.includes(query) ||
          position.includes(query) ||
          department.includes(query)
        );
      });
  }, [staffMembers, currentUserId, searchQuery]);

  const toggleStaffSelection = (staffId: string) => {
    setSelectedStaffIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(staffId)) {
        newSet.delete(staffId);
      } else {
        newSet.add(staffId);
      }
      return newSet;
    });
  };

  const handleCreate = async () => {
    if (!groupName.trim() || selectedStaffIds.size < 2) return;

    setIsCreating(true);
    try {
      await onCreateGroup(groupName.trim(), Array.from(selectedStaffIds));
      // Reset and close
      setGroupName("");
      setSelectedStaffIds(new Set());
      setSearchQuery("");
      onClose();
    } catch (error) {
} finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    if (isCreating) return; // Prevent closing while creating
    setGroupName("");
    setSelectedStaffIds(new Set());
    setSearchQuery("");
    onClose();
  };

  if (!isOpen) return null;

  const canCreate =
    groupName.trim() && selectedStaffIds.size >= 2 && !isCreating;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Nuevo grupo"
      size="md"
      closeOnOverlayClick={!isCreating}
    >
      {/* Group Name Input */}
      <div className="mb-4">
        <div className="flex items-center gap-3">
          {/* Group Icon */}
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <Users className="w-7 h-7 text-emerald-600" />
          </div>
          {/* Input */}
          <input
            type="text"
            placeholder="Nombre del grupo"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            maxLength={50}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar contactos"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Selected Count */}
      {selectedStaffIds.size > 0 && (
        <div className="mb-4 px-4 py-2 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-lg">
          {selectedStaffIds.size} participante
          {selectedStaffIds.size !== 1 ? "s" : ""} seleccionado
          {selectedStaffIds.size !== 1 ? "s" : ""}
        </div>
      )}

      {/* Staff List */}
      <div className="mb-6 max-h-[400px] overflow-y-auto border border-gray-200 rounded-lg">
        <div className="p-2">
          <p className="px-4 py-2 text-xs text-gray-500 uppercase tracking-wider">
            Todos los contactos
          </p>
          {filteredStaff.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No se encontraron miembros del personal
            </div>
          ) : (
            filteredStaff.map((staff) => {
              const isSelected = selectedStaffIds.has(staff.id);
              const fullName =
                `${staff.hotel_staff_personal_data?.first_name || ""} ${
                  staff.hotel_staff_personal_data?.last_name || ""
                }`.trim() || "Sin nombre";

              return (
                <button
                  key={staff.id}
                  onClick={() => toggleStaffSelection(staff.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors rounded-lg"
                >
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                      <span className="text-emerald-700 font-semibold text-lg">
                        {fullName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {/* Checkbox overlay */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-emerald-500 bg-opacity-80 rounded-full flex items-center justify-center">
                        <Check className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900">{fullName}</p>
                    <p className="text-sm text-gray-500">
                      {staff.position} • {staff.department}
                    </p>
                  </div>

                  {/* Checkbox */}
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      isSelected
                        ? "bg-emerald-500 border-emerald-500"
                        : "border-gray-300"
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3">
        <Button variant="outline" onClick={handleClose} disabled={isCreating}>
          Cancelar
        </Button>
        <Button
          onClick={handleCreate}
          disabled={!canCreate}
          loading={isCreating}
        >
          Crear grupo
        </Button>
      </div>

      {selectedStaffIds.size > 0 && selectedStaffIds.size < 2 && (
        <p className="mt-2 text-xs text-center text-gray-500">
          Selecciona al menos 2 participantes
        </p>
      )}
    </Modal>
  );
};

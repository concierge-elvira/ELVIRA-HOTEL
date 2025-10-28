import { useState, useMemo } from "react";
import { Search, Check, UserPlus } from "lucide-react";
import { Button } from "../../../../../../components/ui/buttons/Button";

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

interface AddParticipantsViewProps {
  availableStaff: StaffMember[];
  onAdd: (staffIds: string[]) => Promise<void>;
  onCancel: () => void;
}

export function AddParticipantsView({
  availableStaff,
  onAdd,
  onCancel,
}: AddParticipantsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isAdding, setIsAdding] = useState(false);

  const filteredStaff = useMemo(() => {
    return availableStaff.filter((staff) => {
      if (!searchQuery) return true;
      const fullName = `${staff.hotel_staff_personal_data?.first_name || ""} ${
        staff.hotel_staff_personal_data?.last_name || ""
      }`.toLowerCase();
      const position = staff.position.toLowerCase();
      const department = staff.department.toLowerCase();
      const query = searchQuery.toLowerCase();
      return (
        fullName.includes(query) ||
        position.includes(query) ||
        department.includes(query)
      );
    });
  }, [availableStaff, searchQuery]);

  const toggleSelection = (staffId: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(staffId)) {
        newSet.delete(staffId);
      } else {
        newSet.add(staffId);
      }
      return newSet;
    });
  };

  const handleAdd = async () => {
    if (selectedIds.size === 0) return;

    setIsAdding(true);
    try {
      await onAdd(Array.from(selectedIds));
      setSearchQuery("");
      setSelectedIds(new Set());
    } catch (error) {
} finally {
      setIsAdding(false);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar staff..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        {selectedIds.size > 0 && (
          <p className="text-sm text-emerald-600 mt-2">
            {selectedIds.size} selected
          </p>
        )}
      </div>

      {/* Staff List */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {filteredStaff.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <UserPlus className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No staff members available</p>
          </div>
        ) : (
          filteredStaff.map((staff) => {
            const personalData = staff.hotel_staff_personal_data;
            const fullName = personalData
              ? `${personalData.first_name} ${personalData.last_name}`
              : "Unknown";
            const initials = personalData
              ? getInitials(personalData.first_name, personalData.last_name)
              : "??";
            const isSelected = selectedIds.has(staff.id);

            return (
              <button
                key={staff.id}
                onClick={() => toggleSelection(staff.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
                  isSelected
                    ? "bg-emerald-50 border-2 border-emerald-500"
                    : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
                    <span className="text-sm font-semibold text-white">
                      {initials}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {fullName}
                    </p>
                    {staff.department && (
                      <p className="text-xs text-gray-500 truncate">
                        {staff.department}
                      </p>
                    )}
                  </div>
                </div>

                {/* Checkbox */}
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    isSelected
                      ? "bg-emerald-600 border-emerald-600"
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

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="secondary"
          onClick={onCancel}
          disabled={isAdding}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleAdd}
          disabled={selectedIds.size === 0 || isAdding}
          className="flex-1"
        >
          {isAdding
            ? "Adding..."
            : `Add ${selectedIds.size > 0 ? `(${selectedIds.size})` : ""}`}
        </Button>
      </div>
    </div>
  );
}

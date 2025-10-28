import { useState } from "react";
import { Input } from "../../../../../components/ui";
import { LoadingState } from "../../../../../components/ui/states";
import { useAuth } from "../../../../../hooks/useAuth";

interface StaffMember {
  id: string;
  employee_id: string;
  position: string;
  department: string;
  status: string;
  hotel_staff_personal_data?: {
    first_name: string;
    last_name: string;
    email: string;
  } | null;
}

interface StaffListProps {
  staffMembers: StaffMember[];
  selectedStaffId: string | null;
  onSelectStaff: (staffId: string) => void;
  isLoading: boolean;
}

export function StaffList({
  staffMembers,
  selectedStaffId,
  onSelectStaff,
  isLoading,
}: StaffListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

  // Filter out current user and apply search
  const filteredStaff = staffMembers
    .filter((staff) => staff.id !== user?.id) // Don't show current user
    .filter((staff) => {
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

  if (isLoading) {
    return (
      <div className="p-4">
        <LoadingState message="Loading staff..." />
      </div>
    );
  }

  return (
    <>
      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <Input
          type="text"
          placeholder="Search staff..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Staff List */}
      <div className="flex-1 overflow-y-auto">
        {filteredStaff.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            No staff members found
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredStaff.map((staff) => {
              const personalData = staff.hotel_staff_personal_data;
              const fullName = personalData
                ? `${personalData.first_name} ${personalData.last_name}`
                : "Unknown";
              const initials = personalData
                ? `${personalData.first_name?.[0] || ""}${
                    personalData.last_name?.[0] || ""
                  }`
                : "??";

              return (
                <button
                  key={staff.id}
                  onClick={() => {
onSelectStaff(staff.id);
                  }}
                  className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                    selectedStaffId === staff.id ? "bg-emerald-50" : ""
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                      selectedStaffId === staff.id
                        ? "bg-emerald-600"
                        : "bg-emerald-500"
                    }`}
                  >
                    {initials}
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900 text-sm">
                      {fullName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {staff.position}
                    </div>
                  </div>

                  {/* Online indicator (placeholder - can be enhanced with presence) */}
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

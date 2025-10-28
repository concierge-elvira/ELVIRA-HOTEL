interface ParticipantItemProps {
  participant: {
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
  };
  isCreator: boolean;
  creatorId: string;
  currentUserId: string;
  removingId: string | null;
  onRemove: (participantId: string) => void;
}

export function ParticipantItem({
  participant,
  isCreator,
  creatorId,
  currentUserId,
  removingId,
  onRemove,
}: ParticipantItemProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const personalData = participant.hotel_staff.hotel_staff_personal_data;
  const fullName = personalData
    ? `${personalData.first_name} ${personalData.last_name}`
    : "Unknown";
  const initials = personalData
    ? getInitials(personalData.first_name, personalData.last_name)
    : "??";
  const isParticipantCreator = participant.staff_id === creatorId;
  const isCurrentUser = participant.staff_id === currentUserId;
  const canRemove = isCreator && !isParticipantCreator && !isCurrentUser;

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
          <span className="text-sm font-semibold text-white">{initials}</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium text-gray-900 truncate">
              {fullName}
            </p>
            {isParticipantCreator && (
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full shrink-0">
                Creator
              </span>
            )}
            {isCurrentUser && !isParticipantCreator && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full shrink-0">
                You
              </span>
            )}
          </div>
          {participant.hotel_staff.department && (
            <p className="text-xs text-gray-500 truncate">
              {participant.hotel_staff.department}
            </p>
          )}
          {personalData?.email && (
            <p className="text-xs text-gray-400 truncate">
              {personalData.email}
            </p>
          )}
        </div>
      </div>

      {/* Remove Button */}
      {canRemove && (
        <button
          onClick={() => onRemove(participant.staff_id)}
          disabled={removingId === participant.staff_id}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-2"
          title="Remove from group"
        >
          {removingId === participant.staff_id ? (
            <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6"
              />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}

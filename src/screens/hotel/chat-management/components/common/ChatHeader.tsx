import type { ChatUser } from "../types";

interface ChatHeaderProps {
  participant?: ChatUser;
  onlineCount?: number;
  showVideoCall?: boolean;
  showPhoneCall?: boolean;
  onVideoCall?: () => void;
  onPhoneCall?: () => void;
  onInfo?: () => void;
  onAvatarClick?: () => void;
}

export function ChatHeader({
  participant,
  onlineCount,
  showVideoCall = false,
  showPhoneCall = false,
  onVideoCall,
  onPhoneCall,
  onInfo,
  onAvatarClick,
}: ChatHeaderProps) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "online":
        return "bg-green-400";
      case "away":
        return "bg-yellow-400";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case "online":
        return "Online";
      case "away":
        return "Away";
      case "offline":
        return "Offline";
      default:
        return "Unknown";
    }
  };

  if (!participant) {
    return (
      <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-center">
        <p className="text-gray-500">Select a conversation to start chatting</p>
      </div>
    );
  }

  return (
    <div className="h-16 border-b border-gray-200 bg-white px-4 flex items-center justify-between">
      {/* Left Side - Participant Info */}
      <div className="flex items-center space-x-3">
        {/* Avatar with Status */}
        <div className="relative">
          <button
            onClick={onAvatarClick}
            disabled={!onAvatarClick}
            className={`focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-full ${
              onAvatarClick
                ? "cursor-pointer hover:opacity-80 transition-opacity"
                : ""
            }`}
          >
            {participant.avatar ? (
              <img
                src={participant.avatar}
                alt={participant.name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-medium">
                {participant.name.charAt(0).toUpperCase()}
              </div>
            )}
          </button>
          <div
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(
              participant.status
            )}`}
          ></div>
        </div>

        {/* Name and Status */}
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="font-medium text-gray-900">{participant.name}</h2>

            {participant.roomNumber && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                Room {participant.roomNumber}
              </span>
            )}

            {participant.department && (
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                {participant.department}
              </span>
            )}

            {participant.role && (
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                {participant.role}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>{getStatusText(participant.status)}</span>
            {onlineCount !== undefined && (
              <>
                <span>•</span>
                <span>{onlineCount} online</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right Side - Actions */}
      <div className="flex items-center space-x-2">
        {showPhoneCall && onPhoneCall && (
          <button
            onClick={onPhoneCall}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Voice call"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z" />
            </svg>
          </button>
        )}

        {showVideoCall && onVideoCall && (
          <button
            onClick={onVideoCall}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Video call"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z" />
            </svg>
          </button>
        )}

        {onInfo && (
          <button
            onClick={onInfo}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Info"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

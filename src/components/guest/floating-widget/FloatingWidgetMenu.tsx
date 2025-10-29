/**
 * Floating Widget Menu Component
 *
 * Container for the bell button and action buttons
 * Manages the menu state and animations
 */

import React, { useState } from "react";
import { Clock, MessageCircle } from "lucide-react";
import { FloatingBellButton } from "./FloatingBellButton";
import { FloatingActionButton } from "./FloatingActionButton";
import { GuestChatScreen } from "../../../screens/guest/chat";
import { useGuestNotification } from "../../../contexts/guest/GuestNotificationContext";

interface FloatingWidgetMenuProps {
  onClockClick?: () => void;
  onMessageClick?: () => void;
  requestCount?: number;
  messageCount?: number;
}

export const FloatingWidgetMenu: React.FC<FloatingWidgetMenuProps> = ({
  onClockClick = () => console.log("Clock clicked"),
  onMessageClick,
  requestCount = 0,
  messageCount = 0,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { shouldShakeBell, shouldShakeClock } = useGuestNotification();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleActionClick = (action: () => void) => {
    action();
    setIsOpen(false); // Close menu after action
  };

  const handleMessageClick = () => {
    setIsChatOpen(true);
    setIsOpen(false); // Close menu when opening chat
    if (onMessageClick) {
      onMessageClick();
    }
  };

  // Show message count: 0 when chat is open, otherwise show actual count
  const displayMessageCount = isChatOpen ? 0 : messageCount;

  const actions = [
    {
      icon: MessageCircle,
      label: "Messages",
      onClick: () => handleActionClick(handleMessageClick),
      bgColor: "bg-blue-500",
      shouldShake: false, // Messages don't shake for order updates
      badgeCount: isOpen ? displayMessageCount : 0, // Show message count only when menu is open
    },
    {
      icon: Clock,
      label: "Room Service",
      onClick: () => handleActionClick(onClockClick),
      bgColor: "bg-purple-500",
      shouldShake: shouldShakeClock, // Shake when order status changes
      badgeCount: 0, // Clock doesn't show badge
    },
  ];

  return (
    <>
      <div className="fixed bottom-20 right-6 z-[45]">
        {/* Backdrop overlay when open */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Action buttons */}
        <div className="relative">
          {actions.map((action, index) => (
            <FloatingActionButton
              key={action.label}
              icon={action.icon}
              label={action.label}
              onClick={action.onClick}
              bgColor={action.bgColor}
              index={index}
              isVisible={isOpen}
              shouldShake={action.shouldShake}
              badgeCount={action.badgeCount}
            />
          ))}

          {/* Main bell button */}
          <FloatingBellButton
            isOpen={isOpen}
            onClick={handleToggle}
            shouldShake={shouldShakeBell}
            notificationCount={isOpen ? requestCount : displayMessageCount}
          />
        </div>
      </div>

      {/* Guest Chat Screen */}
      <GuestChatScreen
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </>
  );
};

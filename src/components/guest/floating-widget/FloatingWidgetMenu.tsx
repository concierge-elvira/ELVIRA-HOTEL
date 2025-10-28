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

interface FloatingWidgetMenuProps {
  onClockClick?: () => void;
  onMessageClick?: () => void;
  hasNotifications?: boolean;
}

export const FloatingWidgetMenu: React.FC<FloatingWidgetMenuProps> = ({
  onClockClick = () => console.log("Clock clicked"),
  onMessageClick,
  hasNotifications = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

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

  const actions = [
    {
      icon: MessageCircle,
      label: "Messages",
      onClick: () => handleActionClick(handleMessageClick),
      bgColor: "bg-blue-500",
    },
    {
      icon: Clock,
      label: "Room Service",
      onClick: () => handleActionClick(onClockClick),
      bgColor: "bg-purple-500",
    },
  ];

  return (
    <>
      <div className="fixed bottom-20 right-6 z-50">
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
            />
          ))}

          {/* Main bell button */}
          <FloatingBellButton
            isOpen={isOpen}
            onClick={handleToggle}
            hasNotifications={hasNotifications}
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

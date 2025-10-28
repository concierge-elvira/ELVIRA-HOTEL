import { Button } from "../../../../../../components/ui";

interface NavigationControlsProps {
  onPrevious: () => void;
  onNext: () => void;
}

export function NavigationControls({
  onPrevious,
  onNext,
}: NavigationControlsProps) {
  return (
    <div className="flex items-center space-x-1">
      <Button
        variant="secondary"
        size="sm"
        onClick={onPrevious}
        className="px-2"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </Button>
      <Button variant="secondary" size="sm" onClick={onNext} className="px-2">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </Button>
    </div>
  );
}

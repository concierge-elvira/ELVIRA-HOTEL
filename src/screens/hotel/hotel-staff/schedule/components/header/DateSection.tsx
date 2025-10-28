import { Button } from "../../../../../../components/ui";

interface DateSectionProps {
  currentDate: Date;
  onToday: () => void;
}

export function DateSection({ currentDate, onToday }: DateSectionProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="flex items-center space-x-4">
      <h2 className="text-2xl font-bold text-gray-900">
        {formatDate(currentDate)}
      </h2>
      <Button variant="secondary" size="sm" onClick={onToday}>
        Today
      </Button>
    </div>
  );
}

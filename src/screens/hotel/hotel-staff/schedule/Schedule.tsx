import { Calendar } from "./components";

interface ScheduleProps {
  searchValue: string;
}

export function Schedule({ searchValue }: ScheduleProps) {
  return (
    <div className="p-6">
      <Calendar searchValue={searchValue} />
    </div>
  );
}

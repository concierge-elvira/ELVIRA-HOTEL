interface ControlPanelProps {
  searchValue?: string;
}

export function ControlPanel({ searchValue }: ControlPanelProps) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Control Panel
      </h2>
      <p className="text-gray-500">
        Advanced system settings, permissions, and administrative controls.
      </p>
      {searchValue && (
        <p className="text-sm text-gray-600 mt-2">
          Searching for: "{searchValue}"
        </p>
      )}
    </div>
  );
}

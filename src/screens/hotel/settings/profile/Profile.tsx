interface ProfileProps {
  searchValue?: string;
}

export function Profile({ searchValue }: ProfileProps) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Profile Settings
      </h2>
      <p className="text-gray-500">
        Manage hotel profile information, contact details, and basic settings.
      </p>
      {searchValue && (
        <p className="text-sm text-gray-600 mt-2">
          Searching for: "{searchValue}"
        </p>
      )}
    </div>
  );
}

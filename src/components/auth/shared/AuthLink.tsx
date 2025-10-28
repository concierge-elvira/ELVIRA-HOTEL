interface AuthLinkProps {
  onClick: () => void;
  children: React.ReactNode;
}

export function AuthLink({ onClick, children }: AuthLinkProps) {
  return (
    <div className="mt-6 text-center">
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        {children}
      </button>
    </div>
  );
}

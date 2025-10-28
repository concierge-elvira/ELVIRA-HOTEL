interface AuthCardProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
}

export function AuthCard({ children, onSubmit }: AuthCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <form onSubmit={onSubmit} className="space-y-6">
        {children}
      </form>
    </div>
  );
}

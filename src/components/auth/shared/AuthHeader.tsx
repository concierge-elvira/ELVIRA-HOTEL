interface AuthHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthHeader({ icon, title, subtitle }: AuthHeaderProps) {
  return (
    <div className="text-center mb-8">
      <div className="mx-auto h-16 w-16 bg-emerald-500 rounded-full flex items-center justify-center mb-6">
        {icon}
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
      <p className="text-sm text-gray-600">{subtitle}</p>
    </div>
  );
}

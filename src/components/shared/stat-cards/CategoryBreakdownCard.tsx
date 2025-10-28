interface CategoryItem {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

interface CategoryBreakdownCardProps {
  title: string;
  categories: CategoryItem[];
  loading?: boolean;
}

export function CategoryBreakdownCard({
  title,
  categories,
  loading = false,
}: CategoryBreakdownCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-6 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
        {title}
      </div>
      <div className="space-y-3">
        {categories.map((category, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`w-8 h-8 rounded-full ${category.color} bg-opacity-10 flex items-center justify-center`}
              >
                <div className={category.color}>{category.icon}</div>
              </div>
              <span className="text-sm font-medium text-gray-700">
                {category.label}
              </span>
            </div>
            <span className={`text-lg font-bold ${category.color}`}>
              {category.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

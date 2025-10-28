interface AuthInputProps {
  id: string;
  name: string;
  type: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  autoComplete?: string;
  maxLength?: number;
  style?: React.CSSProperties;
}

export function AuthInput({
  id,
  name,
  type,
  label,
  placeholder,
  value,
  onChange,
  required = false,
  autoComplete,
  maxLength,
  style,
}: AuthInputProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider"
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-base"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        style={style}
      />
    </div>
  );
}

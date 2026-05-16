import { type InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({ label, error, className = "", id, ...props }: Props) {
  const inputId = id ?? props.name;
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-semibold text-stone-800">{label}</span>
      <input
        id={inputId}
        className={`w-full rounded-lg border border-stone-300 px-3 py-2.5 text-stone-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 ${className}`}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

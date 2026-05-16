import { type ButtonHTMLAttributes } from "react";

const variants = {
  primary: "bg-brand text-white hover:bg-brand-dark shadow-sm",
  secondary: "bg-stone-900 text-white hover:bg-stone-800",
  outline: "border-2 border-brand bg-white text-brand hover:bg-brand-light",
  danger: "bg-red-700 text-white hover:bg-red-600",
} as const;

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
};

export function Button({ variant = "primary", className = "", children, ...props }: Props) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-bold italic tracking-tight transition disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

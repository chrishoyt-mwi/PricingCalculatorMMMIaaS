import * as React from "react";
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "ghost" };
export function Button({ className = "", variant = "default", ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium shadow-sm transition";
  const styles = variant === "ghost" ? "bg-transparent hover:bg-slate-100 text-slate-700" : "bg-slate-900 hover:bg-slate-800 text-white";
  return <button className={`${base} ${styles} ${className}`} {...props} />;
}

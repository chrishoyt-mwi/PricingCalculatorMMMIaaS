import * as React from "react";
export function Card({ className = "", children }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`bg-white border border-slate-200 rounded-2xl ${className}`}>{children}</div>;
}
export function CardHeader({ className = "", children }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`px-5 pt-5 ${className}`}>{children}</div>;
}
export function CardTitle({ className = "", children }: React.PropsWithChildren<{ className?: string }>) {
  return <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;
}
export function CardContent({ className = "", children }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`px-5 pb-5 ${className}`}>{children}</div>;
}

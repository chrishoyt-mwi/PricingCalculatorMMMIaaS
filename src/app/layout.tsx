import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MetricWorks Pricing & Estimator",
  description: "MMM IaaS pricing and interactive estimator",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

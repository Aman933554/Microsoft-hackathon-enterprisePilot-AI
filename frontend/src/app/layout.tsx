import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "../components/Sidebar";

export const metadata: Metadata = {
  title: "AI-Native Enterprise OS",
  description: "Next Generation Dashboard for AI Agents",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="app-container">
          <Sidebar />
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

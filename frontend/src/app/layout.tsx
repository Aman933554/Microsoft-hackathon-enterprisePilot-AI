import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { AppLayout } from "../components/AppLayout";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "AI-Native Enterprise Operating System | AI Agents Orchestrator",
  description: "World-class enterprise SaaS platform for AI agents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={`${GeistSans.className} bg-background text-foreground antialiased min-h-screen flex relative`}>
          {/* Subtle radial gradient overlay for premium feel */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-blue/5 via-background to-background z-[-1]"></div>
          <AppLayout>
            {children}
          </AppLayout>
        </body>
      </html>
    </ClerkProvider>
  );
}

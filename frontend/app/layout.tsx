import type { Metadata } from "next";
import "./globals.css";
import ToastProvider from '../components/providers/toast-provider';

export const metadata: Metadata = {
  title: "Sales AI Trainer - Practice Voice Conversations with AI",
  description: "Improve your sales skills with AI-powered voice conversation practice and real-time feedback",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}

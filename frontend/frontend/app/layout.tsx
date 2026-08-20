import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "PR Scout",
  description: "AI-assisted PR opportunity research and matching",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-4">
            <Link href="/" className="font-bold text-gray-900">
              PR Scout
            </Link>

            <p className="text-sm text-gray-500">
              AI-assisted PR research
            </p>
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}
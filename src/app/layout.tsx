import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gerald | Portfolio",
  description: "Professional AI Automation Specialist, Technical VA, Web Developer, and Digital Marketer helping businesses scale through advanced systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="noise" />
        {children}
      </body>
    </html>
  );
}

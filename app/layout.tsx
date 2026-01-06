import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "OmniTool",
  description: "La tua suite professionale di utility digitali.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Unit Converter",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={`${inter.variable} font-sans antialiased text-white`}>
        {children}
      </body>
    </html>
  );
}

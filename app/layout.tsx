import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hola soy Mini Kari",
  description: "Tu asistente IA de recursos humanos",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" }
    ],
    apple: "/icon.png",
  },
  openGraph: {
    title: "Hola soy Mini Kari",
    description: "Tu asistente IA de recursos humanos",
    images: ["/icon.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hola soy Mini Kari",
    description: "Tu asistente IA de recursos humanos",
    images: ["/icon.png"],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

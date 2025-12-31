import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lauda Dhia Raka | Systems Architect & Creative Developer",
  description:
    "Full-Stack Engineer specializing in Multi-Agent Systems, Applied AI, and Game Development. Building intelligent systems that push boundaries.",
  keywords: [
    "Full-Stack Developer",
    "Multi-Agent Systems",
    "AI Engineer",
    "Game Developer",
    "TypeScript",
    "React",
    "Next.js",
    "Machine Learning",
  ],
  authors: [{ name: "Lauda Dhia Raka" }],
  creator: "Lauda Dhia Raka",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://laudadhiaraka.dev",
    title: "Lauda Dhia Raka | Systems Architect & Creative Developer",
    description:
      "Full-Stack Engineer specializing in Multi-Agent Systems, Applied AI, and Game Development.",
    siteName: "Lauda Dhia Raka Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lauda Dhia Raka | Systems Architect & Creative Developer",
    description:
      "Full-Stack Engineer specializing in Multi-Agent Systems, Applied AI, and Game Development.",
    creator: "@laudadhiaraka",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            @import "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4";
          `
        }} />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
        style={{
          backgroundColor: '#0a0a0b',
          color: '#fafafa',
          width: '100%',
          minHeight: '100vh',
          margin: 0,
          padding: 0,
        }}
      >
        <div className="noise-overlay" />
        {children}
      </body>
    </html>
  );
}

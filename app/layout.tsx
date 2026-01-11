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
  title: "Rayan Reynaldo | Mid Level Full-Stack Engineer",
  description: "Mid Level Full-Stack Engineer with 9+ years of experience in building scalable web applications. Expert in React, Next.js, Node.js, Laravel, Python, and modern web technologies.",
  keywords: ["Full-Stack Developer", "Software Engineer", "React", "Next.js", "Node.js", "Laravel", "TypeScript", "Python", "PostgreSQL"],
  authors: [{ name: "Rayan Reynaldo" }],
  creator: "Rayan Reynaldo",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rvrdev.github.io",
    title: "Rayan Reynaldo | Mid Level Full-Stack Engineer",
    description: "Mid Level Full-Stack Engineer with 9+ years of experience in building scalable web applications.",
    siteName: "Rayan Reynaldo Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rayan Reynaldo | Mid Level Full-Stack Engineer",
    description: "Mid Level Full-Stack Engineer with 9+ years of experience in building scalable web applications.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

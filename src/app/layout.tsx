import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/lib/Providers";
import { ScrollToTop } from "@/components/modules/Shared/ScrollToTop";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "SkillSync: A Collaborative Learning Platform for Peer-to-Peer Skill Sharing",
  description:
    "Create a Collaborative Learning Platform where users can connect to teach or learn specific skills. The platform will allow users to create profiles, list skills they can teach, and request sessions for skills they want to learn. The application will include session scheduling, user management, and a review system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ScrollToTop />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

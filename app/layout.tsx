import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteEnhancer from "./SiteEnhancer";
import MobileBuffEnhancer from "./MobileBuffEnhancer";
import MobileExpansion from "./MobileExpansion";
import AbilityRegistryMerger from "./AbilityRegistryMerger";
import StagePhotoReplacer from "./StagePhotoReplacer";

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SFI // Объект №‑13 «Доктор»",
  description:
    "Зашифрованное досье SFI на Объект №‑13 «Доктор» и протокол MOR‑13.",
  icons: {
    icon: `${publicBasePath}/favicon.svg`,
    shortcut: `${publicBasePath}/favicon.svg`,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#050707",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <SiteEnhancer />
        <MobileBuffEnhancer />
        <MobileExpansion />
        <AbilityRegistryMerger />
        <StagePhotoReplacer />
      </body>
    </html>
  );
}

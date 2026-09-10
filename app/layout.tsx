import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "VASY",
    template: "%s · VASY",
  },
  description: "Dijital Mirasınızı Geleceğe Taşıyın",
  applicationName: "VASY",
  icons: {
    icon: "/vasy_icon.png",
    apple: "/vasy_icon.png",
  },
  openGraph: {
    title: "VASY",
    description: "Dijital Mirasınızı Geleceğe Taşıyın",
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: "/vasy_icon.png",
        alt: "VASY",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#ECF0F1",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className={`${inter.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,500,0..1,0&display=block"
        />
      </head>
      <body className="flex min-h-full flex-col bg-canvas font-sans text-on-surface">
        {children}
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "PreFeed - Social Media Preview & Approval",
    template: "%s | PreFeed",
  },
  description:
    "Pixel-perfect social media previews. Share review links with clients. Collect feedback. Approve posts without per-seat fees.",
  keywords: [
    "social media approval",
    "content review",
    "social media preview",
    "client collaboration",
    "content calendar",
  ],
  authors: [{ name: "PreFeed" }],
  creator: "PreFeed",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "PreFeed",
    title: "PreFeed - Social Media Preview & Approval",
    description:
      "Share pixel-perfect social media previews with clients. No per-seat fees.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PreFeed",
    description: "Social media preview and approval without per-seat chaos.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050505",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}

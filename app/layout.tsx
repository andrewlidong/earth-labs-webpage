import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const DESCRIPTION =
  "The archive agent — AI that turns exploration PDFs (well reports, core descriptions, surveys) into structured, queryable subsurface data. Point it at your file server. Get answers.";

export const metadata: Metadata = {
  metadataBase: new URL("https://earth-labs.ai"),
  title: "earth-labs.ai",
  description: DESCRIPTION,
  openGraph: {
    title: "earth-labs.ai",
    description: DESCRIPTION,
    siteName: "earth-labs",
    url: "https://earth-labs.ai",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "earth-labs.ai",
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}

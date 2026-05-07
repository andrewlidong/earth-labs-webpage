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

export const metadata: Metadata = {
  metadataBase: new URL("https://earth-labs.ai"),
  title: "earth-labs — foundation models for Earth's crust",
  description:
    "JENNIFER-H2 is the first multi-modal foundation model for subsurface exploration. We aim to be the ERA5 of the Earth's crust.",
  openGraph: {
    title: "earth-labs",
    description:
      "Foundation models for Earth's crust. Probabilistic zero-shot inversion of subsurface properties.",
    siteName: "earth-labs",
    type: "website",
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

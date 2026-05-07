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
    "JENNIFER-H2 is the first multi-modal foundation model for subsurface exploration — probabilistic zero-shot inversion of crust properties from seismic, well-log, and gravity data. Building the ERA5 of the Earth's crust.",
  openGraph: {
    title: "earth-labs — foundation models for Earth's crust",
    description:
      "JENNIFER-H2: a multi-modal foundation model for subsurface exploration. Probabilistic zero-shot inversion of crust properties from seismic, well-log, and gravity data.",
    siteName: "earth-labs",
    url: "https://earth-labs.ai",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "earth-labs — foundation models for Earth's crust",
    description:
      "JENNIFER-H2: a multi-modal foundation model for subsurface exploration. Probabilistic zero-shot inversion of crust properties from seismic, well-log, and gravity data.",
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

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Imprevista — Software doesn't have gatekeepers anymore",
    template: "%s | Imprevista",
  },
  description:
    "A product studio built on one argument: a product needs a real problem and a real edge — permission is no longer on the list.",
  openGraph: {
    title: "Imprevista — Software doesn't have gatekeepers anymore",
    description:
      "A product studio built on one argument: a product needs a real problem and a real edge — permission is no longer on the list.",
    siteName: "Imprevista",
    url: "https://imprevista.com",
  },
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
      >
        <ThemeProvider>
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

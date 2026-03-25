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
    default: "Imprevista — 10x Data. 10x Skill. 10x Niche.",
    template: "%s | Imprevista",
  },
  description:
    "Tools that synthesize overlooked data, accelerate mastery, and solve narrow problems with surgical precision.",
  openGraph: {
    title: "Imprevista — 10x Data. 10x Skill. 10x Niche.",
    description:
      "Tools that synthesize overlooked data, accelerate mastery, and solve narrow problems with surgical precision.",
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

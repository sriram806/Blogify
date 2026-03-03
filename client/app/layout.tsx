import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/Components/Navbar/Header";
import Footer from "@/Components/Footer/Footer";
import { AuthProvider } from "@/Components/Auth/AuthProvider";
import SmoothScroll from "@/Components/Utils/SmoothScroll";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Blogify — Share Ideas, Stories & Knowledge",
    template: "%s | Blogify",
  },
  description:
    "Blogify is a modern blogging platform where you can read, write, and share insightful articles on technology, lifestyle, programming, and more.",
  keywords: [
    "Blogify",
    "blog platform",
    "tech blog",
    "write blogs",
    "articles",
    "programming blogs",
  ],
  authors: [{ name: "Blogify Team" }],
  creator: "Blogify",
  metadataBase: new URL("https://blogify.vercel.app"), // change to your domain
  openGraph: {
    title: "Blogify — Share Ideas, Stories & Knowledge",
    description:
      "Explore high-quality articles on tech, design, productivity, and more on Blogify.",
    url: "https://blogify.vercel.app",
    siteName: "Blogify",
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          <SmoothScroll>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </SmoothScroll>
        </AuthProvider>
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCurrentUser } from "@/lib/user-utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cipher Market",
  description: "A private, secure marketplace using Monero.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-gray-100 flex flex-col min-h-screen relative overflow-x-hidden`}>
        {/* Floating particles background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full opacity-40 animate-ping"></div>
          <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-cyan-400 rounded-full opacity-30 animate-bounce"></div>
          <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 bg-indigo-400 rounded-full opacity-50 animate-pulse"></div>
          <div className="absolute bottom-1/3 right-2/3 w-2 h-2 bg-blue-300 rounded-full opacity-35 animate-ping"></div>
          <div className="absolute top-1/2 left-1/6 w-1 h-1 bg-purple-300 rounded-full opacity-45 animate-bounce"></div>
        </div>
        
        <Header user={user} />
        <main className="flex-1 relative z-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}


'use client'

import "@/styles/globals.css";
import { ThemeProvider } from "@/hooks/ThemeContext";
import Toggle from "@/components/common/Toggle";

import { Geist } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import { ItemViewProvider } from "@/context/useItemView";
import { useEffect } from "react";

const geist = Geist({ subsets: ["latin"] });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export default function RootLayout({ children }) {

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.cookie = 'first_open=false; path=/; max-age=31536000' // 1 year
    }
  }, [])
  
  return (
    <html lang="en">
      <body className={`${geist.className} ${playfair.variable}`}>
        <ThemeProvider>
          <ItemViewProvider>
            <div className="fixed bottom-1 right-1 text-center p-4 bg-emerald-800 text-white py-2 w-40 h-auto rounded-xl text-xs z-[100]">
              <Toggle />
            </div>
            <main>{children}</main>
          </ItemViewProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

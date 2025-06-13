import "@/styles/globals.css";
import { ThemeProvider } from "@/hooks/ThemeContext";
import Toggle from "@/components/common/Toggle";

import { Geist } from "next/font/google";
import { Playfair_Display } from "next/font/google";

const geist = Geist({ subsets: ["latin"] });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata = {
  title: "Kinderly",
  description: "Kindness App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geist.className} ${playfair.variable}`}>
        <ThemeProvider>
        <div className="fixed top-1 right-1 text-center p-4 bg-emerald-800 text-white py-2 w-40 rounded-xl text-xs z-[100]">
          <Toggle />
        </div>
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}

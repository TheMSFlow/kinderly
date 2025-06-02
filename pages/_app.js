import "@/styles/globals.css";

import { Geist } from "next/font/google";
import { Playfair_Display } from "next/font/google";


const geist = Geist({ subsets: ["latin"] });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export default function App({ Component, pageProps }) {
  return (
    <main className={`${geist.className} ${playfair.variable}`}>
      <Component {...pageProps} />
    </main>
  );
}

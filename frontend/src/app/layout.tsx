import Navbar from "@/components/shared/Navbar"
import { Suspense } from "react";
import { Playfair_Display, Lato } from "next/font/google";

import "./globals.css";



const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
});

const RootLayout = ({ children }: {children: React.ReactNode}) => {
  return (
    <html lang="en" >
       <body className={`${playfair.variable} ${lato.variable}`}>
    <div>
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
      {children}
    </div>
        </body>
    </html>
  )
}

export default RootLayout

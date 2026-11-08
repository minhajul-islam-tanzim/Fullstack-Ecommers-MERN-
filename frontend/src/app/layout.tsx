import Navbar from "@/components/shared/Navbar"
import { Suspense } from "react";
import { Playfair_Display, Poppins } from "next/font/google";

import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-heading",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
});


const RootLayout = ({ children }: {children: React.ReactNode}) => {
  return (
    <html lang="en" >
       <body className={`${playfair.variable} ${poppins.variable}`}>
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

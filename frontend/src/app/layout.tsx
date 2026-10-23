import Navbar from "@/components/shared/Navbar"
import { Suspense } from "react";

import "./globals.css";


const RootLayout = ({ children }: {children: React.ReactNode}) => {
  return (
    <html lang="en" >
        <body>    
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

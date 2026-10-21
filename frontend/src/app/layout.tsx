import Navbar from "@/components/shared/Navbar"
import "./globals.css";


const RootLayout = ({ children }: {children: React.ReactNode}) => {
  return (
    <html lang="en">
        <body>    
    <div>
      <Navbar />
      {children}
    </div>
        </body>
    </html>
  )
}

export default RootLayout


import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar"; 



export const metadata = {
  title: "Interactive Quiz",
  description: "AAAAAAAAAA ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-200 text-[#2b275d]">
      
          <Navbar /> 
          {children}
      
      </body>
    </html>
  );
}
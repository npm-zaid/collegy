import { Geist, Geist_Mono,Sora } from "next/font/google";
import "./globals.css";
import Navbar from "@/common/Navbar";
import NewsBanner from "@/common/NewsBanner";
import Footer from "@/common/Footer";
import SmoothScroll from "@/common/SmoothScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata = {
  title: "Collegy",
  description: "India's #1 Platform for College Admissions",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      
    >
      <body className={`${geistSans.variable} ${geistMono.variable} ${sora.variable} h-full antialiased min-h-full flex flex-col`}>
        <SmoothScroll>
        <NewsBanner />
        <Navbar />
        {children}
        <Footer />
        </SmoothScroll>
        
      </body>
    </html>
  );
}

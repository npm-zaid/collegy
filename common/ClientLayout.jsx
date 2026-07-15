"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import NewsBanner from "./NewsBanner";
import Footer from "./Footer";
import SmoothScroll from "./SmoothScroll";
import LeadCaptureModal from "../components/LeadCaptureModal";
import TransitionWrapper from "./TransitionWrapper";



export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <SmoothScroll>
      <TransitionWrapper>

      <LeadCaptureModal />
      <NewsBanner />
      <Navbar />
       

      {children}
      <Footer />
      </TransitionWrapper>
    </SmoothScroll>
  );
}
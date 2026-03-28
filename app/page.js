import Image from "next/image";
import Navbar from "@/components/Navbar";
import NewsBanner from "@/components/NewsBanner";
import Hero from "@/components/Hero";


export default function Home() {
  return (
    <>
      <div className="h-screen bg-white">
      
        <NewsBanner />
        <Navbar />
        <Hero />
      </div>
    </>
  );
}

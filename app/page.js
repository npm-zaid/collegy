import Image from "next/image";
import Hero from "@/components/Hero";
import Webinar from "@/components/Webinar";
import AiCollegePredictor from "@/components/Aicollegepredictor";
import FAQ from "@/components/FAQ";


export default function Home() {
  return (
    <>
      <div className=" bg-gradient-to-br from-indigo-50 via-blue-50 to-blue-100">
        <Hero />
        <Webinar />
        <FAQ/>
       
      </div>
    </>
  );
}

import Image from "next/image";
import Hero from "../components/Hero";
import Webinar from "../components/Webinar";
import AiCollegePredictor from "../components/Aicollegepredictor";
import FAQ from "../components/FAQ";
import News from "../components/News";
import WhyChooseUs from "../components/WhyChooseUs";
import Ribbons from '../common/Ribbons'
import CollegyDashboard from '../components/CollegyDashboard'
import Mission from "../components/Mission";

export default function Home() {
  return (
    <>
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-blue-50 to-blue-100">
         <Ribbons
    baseThickness={30}
    colors={["#2667ff"]}
    speedMultiplier={0.5}
    maxAge={500}
    enableFade={false}
    enableShaderEffect={false}
  />
        <Hero />
      <Mission/>
        <CollegyDashboard/>
       
      </div>
    </>
  );
}

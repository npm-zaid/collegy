import Hero from "../components/Hero";
import Ribbons from '../common/Ribbons'
import CollegyDashboard from '../components/CollegyDashboard'
import Mission from "../components/Mission";
import NewsCuttings from "../components/NewsCuttings";

import VideoReviews from "../components/VideoReviews";
import StudentWallOfProof from "../components/StudentWallOfProof";
import ExpertsReview from "../components/ExpertsReview";
import Awards from "../components/Awards";
import WhyChooseUs from "../components/WhyChooseUs";
import FAQ from "../components/FAQ";

export default function Home() {
  return (
    <>
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-blue-50 to-blue-100">
         {/* <Ribbons
    baseThickness={30}
    colors={["#2667ff"]}
    speedMultiplier={0.5}
    maxAge={500}
    enableFade={false}
    enableShaderEffect={false}
  /> */}
        <Hero />
      <Mission/>
      <CollegyDashboard/>
      <VideoReviews/> 
      <StudentWallOfProof/>    
      <NewsCuttings/>
      <ExpertsReview/>
      <Awards/>
      <WhyChooseUs/>
       <FAQ/>
 
       
      </div>
    </>
  );
}

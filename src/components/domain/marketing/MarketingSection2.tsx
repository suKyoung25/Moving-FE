import MarketingContent from "./MarketingContent";
import Lottie from "lottie-react";
import TruckAnimation from "@/components/effects/truck.json";

// components/MarketingSection2.tsx
export default function MarketingSection2() {
   return (
      <section className="scroll-snap-start relative h-screen overflow-hidden">
         <div className="bg-primary-blue-300 absolute inset-0 h-full w-full">
            <MarketingContent
               titleText="비교이사"
               subtitleText="이사 견적 비교의<br/>기준이 됩니다."
               descText="내 조건에 맞는 기사님을<br/>빠르게 비교하고 합리적인 견적을&nbsp;<br class='md:hidden' />한 눈에 확인하세요."
            />
         </div>
         <div className="absolute bottom-18 w-full md:bottom-4">
            <div className="relative mx-auto h-full w-full max-w-350">
               <div className="absolute right-0 bottom-0 w-62.5 md:w-[55%]">
                  <Lottie
                     animationData={TruckAnimation}
                     loop={true}
                     autoplay={true}
                     className="h-full w-full"
                  />
               </div>
            </div>
         </div>
      </section>
   );
}

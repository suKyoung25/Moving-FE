import Lottie from "lottie-react";
import MarketingContent from "./MarketingContent";
import locationAnimation from "@/components/effects/location.json";

// components/MarketingSection3.tsx
export default function MarketingSection3() {
   return (
      <section className="scroll-snap-start relative h-screen overflow-hidden">
         <div className="bg-primary-blue-300 absolute inset-0 h-full w-full">
            <MarketingContent
               titleText="지역 기반 매칭"
               subtitleText="내 동네 전문가,<br/>바로 연결"
               descText="사는 곳, 이삿날, 집 유형까지 고려한<br>정확한 매칭으로 실패 없는<br />이사를 시작하세요."
            />
         </div>
         <div className="absolute bottom-16 w-full md:bottom-4">
            <div className="relative mx-auto h-full w-full max-w-350">
               <div className="absolute right-0 -bottom-3 w-55 md:w-[45%]">
                  <Lottie
                     animationData={locationAnimation}
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

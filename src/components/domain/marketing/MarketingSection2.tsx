import MarketingContent from "./MarketingContent";
import Lottie from "lottie-react";
import TruckAnimation from "@/components/effects/truck.json";
import { useTranslations } from "next-intl";

// components/MarketingSection2.tsx
export default function MarketingSection2() {
   const t = useTranslations("Landing");

   const titleText = t("compareMoving.title");
   const subtitleText = `${t("compareMoving.subtitle1")}<br/>${t("compareMoving.subtitle2")}`;
   const descText = `${t("compareMoving.desc1")}<br/>${t("compareMoving.desc2")}&nbsp;<br class="md:hidden" />${t("compareMoving.desc3")}`;

   return (
      <section className="scroll-snap-start relative h-screen overflow-hidden">
         <div className="bg-primary-blue-300 absolute inset-0 h-full w-full">
            <MarketingContent
               titleText={titleText}
               subtitleText={subtitleText}
               descText={descText}
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

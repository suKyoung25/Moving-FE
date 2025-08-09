import Lottie from "lottie-react";
import MarketingContent from "./MarketingContent";
import locationAnimation from "@/components/effects/location.json";
import { useTranslations } from "next-intl";

// components/MarketingSection3.tsx
export default function MarketingSection3() {
   const t = useTranslations("Landing");

   const titleText = t("locationMatching.title");
   const subtitleText = `${t("locationMatching.subtitle1")}<br/>${t("locationMatching.subtitle2")}`;
   const descText = `${t("locationMatching.desc1")}<br/>${t("locationMatching.desc2")}<br />${t("locationMatching.desc3")}`;

   return (
      <section className="scroll-snap-start relative h-screen overflow-hidden">
         <div className="bg-primary-blue-300 absolute inset-0 h-full w-full">
            <MarketingContent
               titleText={titleText}
               subtitleText={subtitleText}
               descText={descText}
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

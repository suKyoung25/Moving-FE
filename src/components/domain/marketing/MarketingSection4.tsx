import Lottie from "lottie-react";
import MarketingContent from "./MarketingContent";
import reviewAnimation from "@/components/effects/review.json";
import { useTranslations } from "next-intl";

// components/MarketingSection4.tsx
export default function MarketingSection4() {
   const t = useTranslations("Landing");

   // 다국어 메시지 조각을 합쳐 HTML 태그 포함 문자열로 만듭니다.
   const titleText = t("reviewBased.title");
   const subtitleText = `${t("reviewBased.subtitle1")}<br/>${t("reviewBased.subtitle2")}`;
   const descText = `${t("reviewBased.desc1")}<br/>${t("reviewBased.desc2")}&nbsp;<br class="md:hidden" />${t("reviewBased.desc3")}`;

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
               <div className="absolute right-6 -bottom-3 w-40 md:w-[35%]">
                  <Lottie
                     animationData={reviewAnimation}
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

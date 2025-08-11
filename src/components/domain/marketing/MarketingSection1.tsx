"use client";

import { useRef, useEffect, useMemo } from "react";
import gsap from "gsap";
import Link from "next/link";
import { HiOutlineExternalLink } from "react-icons/hi";
import { useTranslations } from "next-intl";

export default function MarketingSection1() {
   const t = useTranslations("Landing");
   const heroImageRef = useRef<HTMLDivElement>(null);

   // bannerNumber는 useMemo로 관리 (랜덤 한번 생성)
   const bannerNumber = useMemo(() => Math.floor(Math.random() * 3) + 1, []);

   // 다국어 문자열 조합 함수 (bannerNumber에 따라 다르게 처리)
   const getTitleText = () => {
      switch (bannerNumber) {
         case 1:
            return `${t("banner1.title1")}<br/>${t("banner1.title2")}&nbsp;<br class="md:hidden" />${t("banner1.title3")}`;
         case 2:
            return `${t("banner2.title1")}<br/>${t("banner2.title2")}&nbsp;<br class="md:hidden" />${t("banner2.title3")}`;
         case 3:
            return `${t("banner3.title1")}&nbsp;<br/>${t("banner3.title2")}&nbsp;<br class="md:hidden" />${t("banner3.title3")}`;
         default:
            return `${t("banner2.title1")}<br/>${t("banner2.title2")}&nbsp;<br class="md:hidden" />${t("banner2.title3")}`;
      }
   };

   const getSubtitleText = () => {
      switch (bannerNumber) {
         case 1:
            return `${t("banner1.subtitle1")}&nbsp;<br class="md:hidden" />${t("banner1.subtitle2")}`;
         case 2:
            return `${t("banner2.subtitle1")}<br />${t("banner2.subtitle2")}`;
         case 3:
            return `${t("banner3.subtitle1")}<br/>${t("banner3.subtitle2")}`;
         default:
            return `${t("banner2.subtitle1")}<br />${t("banner2.subtitle2")}`;
      }
   };

   const titleText = getTitleText();
   const subtitleText = getSubtitleText();

   const bannerImage = `/images/banners/banner${bannerNumber}.jpg`;

   useEffect(() => {
      if (heroImageRef.current) {
         gsap.fromTo(
            heroImageRef.current,
            { scale: 1.8, opacity: 0 },
            { duration: 2, scale: 1, opacity: 1, ease: "power2.out" },
         );
      }

      gsap.from(".fade-in", {
         duration: 1,
         y: 50,
         opacity: 0,
         stagger: 0.2,
         delay: 0.5,
         ease: "power2.out",
      });
   }, []);

   return (
      <section className="scroll-snap-start relative h-screen overflow-hidden">
         <div
            ref={heroImageRef}
            className="hero-image absolute inset-0 h-full w-full"
         >
            <img
               src={bannerImage}
               alt={t("bannerImageAlt", { number: bannerNumber })}
               className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 h-full w-full bg-black/50" />
         </div>

         <div className="mx-auto max-w-350">
            {/* 설명 영역 */}
            <div className="font-inherit absolute z-10 flex flex-col gap-5 px-5 pt-30 md:top-1/2 md:-translate-y-1/2 md:gap-6 md:px-10 md:pt-0 lg:gap-7">
               <h2
                  dangerouslySetInnerHTML={{ __html: titleText }}
                  className="font-paperlogy text-5xl leading-tight font-semibold text-white md:text-6xl lg:text-7xl"
               />
               <p
                  dangerouslySetInnerHTML={{ __html: subtitleText }}
                  className="font-paperlogy text-3xl leading-8 text-white md:text-4xl md:leading-10 lg:text-5xl lg:leading-14"
               />
               <Link
                  href={"/mover-search"}
                  className="bg-primary-blue-300 mt-4 flex w-fit items-center gap-1.5 rounded-4xl p-5 font-bold text-white transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:bg-[#007ae8] hover:shadow-md md:mt-6 md:text-xl lg:mt-8"
               >
                  {t("browseService")}
                  <HiOutlineExternalLink className="text-xl" />
               </Link>
            </div>
         </div>
      </section>
   );
}

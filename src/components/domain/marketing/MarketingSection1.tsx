// components/Section1.tsx
"use client";

import { useRef, useEffect, useMemo } from "react";
import gsap from "gsap";
import Link from "next/link";
import { HiOutlineExternalLink } from "react-icons/hi";

export default function MarketingSection1() {
   const heroImageRef = useRef<HTMLDivElement>(null);

   // 랜덤한 배너를 생성합니다.
   const { bannerNumber, bannerImage, titleText, subtitleText } =
      useMemo(() => {
         const bannerNumber = Math.floor(Math.random() * 3) + 1; // 1~3
         const bannerImage = `/images/banners/banner${bannerNumber}.jpg`;

         let titleText = "";
         let subtitleText = "";

         switch (bannerNumber) {
            case 1:
               titleText = `이삿날에도,<br/>걱정 없이&nbsp;<br class="md:hidden" />깔끔하게`;
               subtitleText = `믿을 수 있는,&nbsp;<br class="md:hidden" />전문가 매칭 서비스`;
               break;
            case 2:
               titleText =
                  '새집처럼,<br/>언제 어디서나&nbsp;<br class="md:hidden" />깔끔하게';
               subtitleText = "당신의 공간,<br />전문가의 손길로 바뀝니다";
               break;
            case 3:
               titleText = `예약한 모든 짐,&nbsp;<br/>책임감을 가지고&nbsp;<br class="md:hidden" />확실하게`;
               subtitleText = "처음부터 끝까지,<br/>안심할 수 있도록";
               break;
            default:
               titleText = "새집처럼,\n언제 어디서나\n깔끔하게";
               subtitleText = "당신의 공간,\n전문가의 손길로 바뀝니다";
         }

         return { bannerNumber, bannerImage, titleText, subtitleText };
      }, []);

   useEffect(() => {
      if (heroImageRef.current) {
         gsap.fromTo(
            heroImageRef.current,
            {
               scale: 1.8,
               opacity: 0,
            },
            {
               duration: 2,
               scale: 1,
               opacity: 1,
               ease: "power2.out",
            },
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
               alt={`무빙 배너 이미지 ${bannerNumber}`}
               className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 h-full w-full bg-black/50" />
         </div>

         <div className="mx-auto max-w-350">
            {/* 설명 영역 */}
            <div className="font-inherit absolute z-10 flex flex-col gap-5 px-5 pt-30 md:top-1/2 md:-translate-y-1/2 md:gap-6 md:px-10 md:pt-0 lg:gap-7">
               <h2
                  dangerouslySetInnerHTML={{
                     __html: titleText,
                  }}
                  className="font-paperlogy text-5xl leading-tight font-semibold text-white md:text-6xl lg:text-7xl"
               />
               <p
                  dangerouslySetInnerHTML={{
                     __html: subtitleText,
                  }}
                  className="font-paperlogy text-3xl leading-8 text-white md:text-4xl md:leading-10 lg:text-5xl lg:leading-14"
               />
               <Link
                  href={"/mover-search"}
                  className="bg-primary-blue-300 mt-4 flex w-fit items-center gap-1.5 rounded-4xl p-5 font-bold text-white transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:bg-[#007ae8] hover:shadow-md md:mt-6 md:text-xl lg:mt-8"
               >
                  서비스 둘러보기
                  <HiOutlineExternalLink className="text-xl" />
               </Link>
            </div>
         </div>
      </section>
   );
}

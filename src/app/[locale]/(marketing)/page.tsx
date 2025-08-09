"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import Image from "next/image";
import scrollIcon from "@/assets/images/scrollIcon.png";
import MarketingSection1 from "@/components/domain/marketing/MarketingSection1";
import otherLogo from "@/assets/images/otherLogo.png";
import logo from "@/assets/images/logo.svg";
import MarketingSection2 from "@/components/domain/marketing/MarketingSection2";
import MarketingSection3 from "@/components/domain/marketing/MarketingSection3";
import MarketingSection4 from "@/components/domain/marketing/MarketingSection4";
import MarketingSection5 from "@/components/domain/marketing/MarketingSection5";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollToPlugin);

const TOTAL_SECTIONS = 5;

export default function MarketingPage() {
   const t = useTranslations("Landing");

   const [currentSection, setCurrentSection] = useState(0);
   const [isScrolling, setIsScrolling] = useState(false);
   const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
   const lastScrollTimeRef = useRef(0);
   const wheelDeltaRef = useRef(0);

   const scrollToSection = useCallback(
      (sectionIndex: number) => {
         if (sectionIndex < 0 || sectionIndex >= TOTAL_SECTIONS) return;
         if (isScrolling && sectionIndex === currentSection) return;

         setIsScrolling(true);
         setCurrentSection(sectionIndex);

         gsap.to("#scrollContainer", {
            duration: 1.2,
            scrollTo: { y: sectionIndex * window.innerHeight },
            ease: "power2.inOut",
            onComplete: () => {
               setIsScrolling(false);
               // 스크롤 완료 후 잠시 대기
               setTimeout(() => {
                  lastScrollTimeRef.current = 0;
               }, 100);
            },
         });
      },
      [isScrolling, currentSection],
   );

   useEffect(() => {
      const wheelHandler = (e: WheelEvent) => {
         e.preventDefault();

         const now = Date.now();
         const timeDiff = now - lastScrollTimeRef.current;

         // 너무 빠른 연속 스크롤 방지 (50ms 간격)
         if (timeDiff < 50) return;

         // 스크롤 델타 누적
         wheelDeltaRef.current += e.deltaY;

         // 디바운싱: 스크롤이 멈춘 후 150ms 후에 실행
         if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
         }

         scrollTimeoutRef.current = setTimeout(() => {
            if (isScrolling) return;

            const delta = wheelDeltaRef.current;
            wheelDeltaRef.current = 0; // 리셋

            // 임계값 설정 (너무 작은 스크롤은 무시)
            if (Math.abs(delta) < 10) return;

            let targetSection = currentSection;

            if (delta > 0 && currentSection < TOTAL_SECTIONS - 1) {
               targetSection = currentSection + 1;
            } else if (delta < 0 && currentSection > 0) {
               targetSection = currentSection - 1;
            }

            if (targetSection !== currentSection) {
               lastScrollTimeRef.current = now;
               scrollToSection(targetSection);
            }
         }, 150); // 150ms 디바운스
      };

      const keyHandler = (e: KeyboardEvent) => {
         if (isScrolling) return;

         const now = Date.now();
         const timeDiff = now - lastScrollTimeRef.current;

         // 키보드도 연속 입력 방지
         if (timeDiff < 300) return;

         if (e.key === "ArrowDown" && currentSection < TOTAL_SECTIONS - 1) {
            lastScrollTimeRef.current = now;
            scrollToSection(currentSection + 1);
         } else if (e.key === "ArrowUp" && currentSection > 0) {
            lastScrollTimeRef.current = now;
            scrollToSection(currentSection - 1);
         }
      };

      // 터치 이벤트 추가
      let touchStartY = 0;
      let touchEndY = 0;

      const touchStartHandler = (e: TouchEvent) => {
         touchStartY = e.touches[0].clientY;
      };

      const touchEndHandler = (e: TouchEvent) => {
         if (isScrolling) return;

         touchEndY = e.changedTouches[0].clientY;
         const diff = touchStartY - touchEndY;

         // 최소 스와이프 거리
         if (Math.abs(diff) < 50) return;

         const now = Date.now();
         const timeDiff = now - lastScrollTimeRef.current;

         if (timeDiff < 500) return; // 터치는 좀 더 길게

         if (diff > 0 && currentSection < TOTAL_SECTIONS - 1) {
            lastScrollTimeRef.current = now;
            scrollToSection(currentSection + 1);
         } else if (diff < 0 && currentSection > 0) {
            lastScrollTimeRef.current = now;
            scrollToSection(currentSection - 1);
         }
      };

      // 이벤트 리스너 등록
      document.addEventListener("wheel", wheelHandler, { passive: false });
      document.addEventListener("keydown", keyHandler);
      document.addEventListener("touchstart", touchStartHandler, {
         passive: true,
      });
      document.addEventListener("touchend", touchEndHandler, { passive: true });

      return () => {
         document.removeEventListener("wheel", wheelHandler);
         document.removeEventListener("keydown", keyHandler);
         document.removeEventListener("touchstart", touchStartHandler);
         document.removeEventListener("touchend", touchEndHandler);

         if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
         }
      };
   }, [currentSection, isScrolling, scrollToSection]);

   // 페이지 로드 시 초기화
   useEffect(() => {
      // 초기 애니메이션
      gsap.from(".fade-in", {
         duration: 1,
         y: 50,
         opacity: 0,
         stagger: 0.2,
         ease: "power2.out",
      });
   }, []);

   return (
      <div>
         {/* 전체 헤더  */}
         <div className="fixed top-5 left-5 z-30 flex w-full justify-center md:top-10 md:left-10">
            <div className="relative w-full max-w-350">
               {/* 로고1 */}
               <Image
                  src={otherLogo}
                  alt={t("logo1Alt")}
                  width={90}
                  className={`absolute top-0 left-0 transition-opacity duration-500 md:w-29 ${
                     currentSection === 4 ? "opacity-0" : "opacity-100"
                  }`}
               />
               {/* 로고2 */}
               <Image
                  src={logo}
                  alt={t("logo2Alt")}
                  width={90}
                  className={`absolute top-0 left-0 transition-opacity duration-500 md:w-29 ${
                     currentSection === 4 ? "opacity-100" : "opacity-0"
                  }`}
               />
            </div>
         </div>

         {/* 사이드 네비게이션 */}

         <div
            className={`fixed top-1/2 z-50 flex w-full -translate-y-1/2 justify-center transition-opacity duration-500 ${
               currentSection === 4
                  ? "pointer-events-none opacity-0"
                  : "opacity-100"
            }`}
         >
            <div className="relative w-full max-w-350">
               <div className="absolute top-1/2 right-10 hidden -translate-y-1/2 flex-col items-end space-y-4 md:flex">
                  {[...Array(TOTAL_SECTIONS)].map((_, i) => (
                     <div
                        key={i}
                        className={`side-nav-item h-1 w-3 cursor-pointer transition-all duration-300 ${
                           i === currentSection
                              ? "w-5 bg-white"
                              : "bg-white opacity-50 hover:bg-white hover:opacity-80"
                        }`}
                        onClick={() => scrollToSection(i)}
                        aria-label={t("sideNavItemAria", { index: i + 1 })}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                           if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              scrollToSection(i);
                           }
                        }}
                     />
                  ))}
               </div>
            </div>
         </div>

         {/* 스크롤 인디케이터 */}
         <div
            className={`animate-slow-bounce fixed bottom-8 left-1/2 z-20 -translate-x-1/2 transform text-3xl text-white transition-opacity duration-500 ${
               currentSection === 4
                  ? "pointer-events-none opacity-0"
                  : "pointer-events-auto opacity-100"
            }`}
            onClick={() => {
               if (currentSection < TOTAL_SECTIONS - 1) {
                  scrollToSection(currentSection + 1);
               }
            }}
         >
            <Image
               src={scrollIcon}
               alt={t("scrollIconAlt")}
               width={58}
               height={58}
               className="cursor-pointer md:size-17"
            />
         </div>

         <div
            id="scrollContainer"
            className="scroll-snap-y scroll-snap-mandatory scrollbar-hide relative h-screen overflow-y-auto"
            style={{ scrollBehavior: "auto" }} // CSS scroll-behavior 비활성화
         >
            {/* 마케팅 영역 1  */}
            <MarketingSection1 />
            {/* 마케팅 영역 2  */}
            <MarketingSection2 />
            {/* 마케팅 영역 3  */}
            <MarketingSection3 />
            {/*마케팅 영역 4 */}
            <MarketingSection4 />
            {/*마케팅 영역 5 */}
            <MarketingSection5 />
         </div>
      </div>
   );
}

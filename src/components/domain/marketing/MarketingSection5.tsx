import Link from "next/link";

// components/MarketingSection4.tsx
export default function MarketingSection5() {
   return (
      <section className="scroll-snap-start relative h-screen overflow-hidden">
         <div className="absolute inset-0 h-full w-full bg-white">
            <div className="mx-auto max-w-350">
               <div className="font-inherit absolute z-10 flex flex-col gap-5 px-5 pt-30 md:top-1/2 md:-translate-y-1/2 md:gap-7 md:px-10 md:pt-0 lg:gap-9">
                  <Link href={"/mover-search"}>서비스 둘러보기</Link>
                  <Link href={"/support"}>견적계산기</Link>
                  <Link href={"/support"}>문의하기</Link>
               </div>
            </div>
         </div>
      </section>
   );
}

import MarketingContent from "./MarketingContent";

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
      </section>
   );
}

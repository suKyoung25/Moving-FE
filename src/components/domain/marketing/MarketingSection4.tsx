import MarketingContent from "./MarketingContent";

// components/MarketingSection4.tsx
export default function MarketingSection4() {
   return (
      <section className="scroll-snap-start relative h-screen overflow-hidden">
         <div className="bg-primary-blue-300 absolute inset-0 h-full w-full">
            <MarketingContent
               titleText="실제 후기 기반"
               subtitleText="진짜 이사한 사람들의<br/>이야기만 보여드립니다."
               descText={`직접 이사를 경험한 고객의<br/>리뷰를 기반으로 신뢰도 높은&nbsp;<br class='md:hidden' />기사님만 추천해드려요.`}
            />
         </div>
      </section>
   );
}

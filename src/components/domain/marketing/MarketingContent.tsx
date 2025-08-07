export default function MarketingContent({
   titleText,
   subtitleText,
   descText,
}: {
   titleText: string;
   subtitleText: string;
   descText: string;
}) {
   return (
      <div className="mx-auto max-w-350">
         {/* 설명 영역 */}
         <div className="font-inherit absolute z-10 flex flex-col gap-5 px-5 pt-30 md:top-1/2 md:-translate-y-1/2 md:gap-7 md:px-10 md:pt-0 lg:gap-9">
            <h2
               dangerouslySetInnerHTML={{
                  __html: titleText,
               }}
               className="font-paperlogy text-6xl leading-tight font-semibold md:text-7xl lg:text-8xl"
            />
            <h3
               dangerouslySetInnerHTML={{
                  __html: subtitleText,
               }}
               className="font-paperlogy text-4xl leading-10 md:text-5xl md:leading-15 lg:text-6xl lg:leading-16"
            />
            <p
               dangerouslySetInnerHTML={{
                  __html: descText,
               }}
               className="font-paperlogy text-base leading-6 md:text-xl md:leading-8 lg:text-2xl lg:leading-9"
            />
         </div>
      </div>
   );
}

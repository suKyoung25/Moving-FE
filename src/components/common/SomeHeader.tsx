import React, { Suspense } from "react";
import ReviewTabs from "./HeaderTabs";

type TabsProps = {
   tab1Label: string;
   tab2Label: string;
};

// 서브 헤더 탭 메뉴 tablLabel은 ?tab=1, tab2Label은 ?tab=2 사용 reviews/page.tsx 참조
export default function SomeHeader({ tab1Label, tab2Label }: TabsProps) {
   return (
      <Suspense fallback={null}>
         <ReviewTabs tab1Label={tab1Label} tab2Label={tab2Label} />
      </Suspense>
   );
}

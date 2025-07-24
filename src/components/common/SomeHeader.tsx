import React, { Suspense } from "react";
import HeaderTabs from "./HeaderTabs";
import { useTranslations } from "next-intl";

type TabsProps = {
   page: string;
};

// 서브 헤더 탭 메뉴 page 에 각자 사용하는 페이지 입력 ex) MyQuotes.Client or MyQuotes.Mover
export default function SomeHeader({ page }: TabsProps) {
   const t = useTranslations(page);

   let tab1Label = "";
   let tab2Label = "";

   if (page === "Reviews") {
      tab1Label = t("writableReviews");
      tab2Label = t("myReviews");
   } else if (page === "MyQuotes.Client") {
      tab1Label = t("pendingQuotes");
      tab2Label = t("receivedQuotes");
   } else if (page === "MyQuotes.Mover") {
      tab1Label = t("sentQuotes");
      tab2Label = t("rejectedRequests");
   } else {
      tab1Label = "";
      tab2Label = "";
   }

   return (
      <Suspense fallback={null}>
         <HeaderTabs tab1Label={tab1Label} tab2Label={tab2Label} />
      </Suspense>
   );
}

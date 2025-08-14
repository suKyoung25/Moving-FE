"use client";
import PaperPlane from "@/components/effects/PaperPlane";
import { useTranslations } from "next-intl";
import { useState } from "react";

// 문의 전송 버튼 컴포넌트
export default function SupportSubmitButton({
   isPending,
}: {
   isPending: boolean;
}) {
   const t = useTranslations("Support");

   const [isHover, setIsHover] = useState(false);

   return (
      <button
         type="submit"
         disabled={isPending}
         className="hover:bg-black-400 hover:[&>span]:text-primary-blue-300 flex items-center rounded-full border-1 px-10 py-3.5 transition-all duration-1000 ease-in-out hover:border-0 hover:[&>span:after]:w-0"
         onMouseEnter={() => setIsHover(true)}
         onMouseLeave={() => setIsHover(false)}
      >
         <span className="text-16-semibold after:bg-primary-blue-300 relative flex text-center transition-all duration-3000 ease-in-out after:absolute after:top-0 after:-right-2 after:h-1 after:w-1 after:rounded-full after:content-['']">
            {/* 전송 중일 때 텍스트 변경 */}
            {isPending ? t("sendingInquiry") : t("sendInquiry")}
         </span>
         {isHover && (
            <span>
               <PaperPlane active={isHover} />
            </span>
         )}
      </button>
   );
}

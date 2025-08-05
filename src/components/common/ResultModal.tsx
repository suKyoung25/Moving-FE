"use client";

import Image from "next/image";
import xIcon from "@/assets/images/xIcon.svg";

type ResultModalProps = {
   isOpen: boolean;
   message: string;
   buttonText?: string;
   onClose: () => void;
   onClick: () => void;
};

// 메시지를 표시하는 모달 컴포넌트
export default function ResultModal({
   isOpen,
   message,
   buttonText,
   onClose,
   onClick,
}: ResultModalProps) {
   // 배경 영역 클릭 시 닫기
   const handleClosed = (e: React.MouseEvent<HTMLDivElement>) => {
      if (
         e.target instanceof HTMLElement &&
         e.target.classList.contains("isClosed")
      ) {
         onClose();
      }
   };

   if (!isOpen) return null;

   return (
      <div
         onClick={handleClosed}
         className="isClosed fixed top-0 left-0 z-50 min-h-full w-full overflow-hidden bg-black/50"
      >
         <div className="absolute top-1/2 left-1/2 mx-auto flex w-4/5 max-w-80 -translate-x-1/2 -translate-y-1/2 flex-col gap-6 rounded-3xl bg-white px-4 py-6 md:max-w-100 md:gap-10">
            {/* 닫기 버튼 */}
            <div className="flex justify-end">
               <button type="button" onClick={onClose}>
                  <Image src={xIcon} alt="close" width={24} height={24} />
               </button>
            </div>

            {/* 메시지 출력 */}
            <div className="text-center font-medium md:text-lg">{message}</div>

            {/* 확인 버튼 */}
            <button
               type="button"
               onClick={onClick}
               className="bg-primary-blue-300 hover:bg-primary-blue-200 mx-4 rounded-2xl p-4 font-semibold text-white max-md:text-sm"
            >
               {buttonText ?? "확인"}
            </button>
         </div>
      </div>
   );
}

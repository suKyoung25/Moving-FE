"use client";

import React, { useEffect, useState } from "react";

// 견적 요청 진행 상태 표시 바
export default function ProgressBar({ currentStep }: { currentStep: number }) {
   const [progress, setProgress] = useState(0);

   // 현재 단계에 따라 ProgressBar 업데이트
   useEffect(() => {
      setProgress((currentStep + 1) * 25);
   }, [currentStep]);

   return (
      <>
         {currentStep !== 4 && (
            <div className="w-full space-y-4 py-4 lg:space-y-6 lg:py-8">
               <h1 className="text-lg font-semibold lg:text-2xl">견적 요청</h1>
               <div
                  className="bg-line-200 h-[6px] w-full rounded-full lg:h-2"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={progress}
               >
                  <div
                     className="bg-primary-blue-300 h-[6px] rounded-full transition-all duration-300 lg:h-2"
                     style={{ width: `${progress}%` }}
                  />
               </div>
            </div>
         )}
      </>
   );
}

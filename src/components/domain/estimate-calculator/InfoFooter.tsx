import React from "react";
import { HiCalculator } from "react-icons/hi";
import { LuMessageSquareWarning } from "react-icons/lu";
import Image from "next/image";
import gptIcon from "@/assets/images/gptIcon.svg";

export default function InfoFooter() {
   return (
      <section className="mx-auto max-w-6xl text-left">
         <h2 className="mb-4 text-lg font-semibold">견적 안내</h2>
         <div className="text-black-400 grid grid-cols-1 gap-4 rounded-xl bg-gray-50 p-6 text-sm md:grid-cols-3">
            <div className="flex items-start gap-2">
               <HiCalculator className="mt-1 h-5 w-5 text-gray-500" />
               <div>
                  <p className="text-14-medium">기본 견적</p>
                  <p className="text-12-regular mt-1">
                     거리, 이사유형, 날짜 등 기본 요소로 계산
                  </p>
               </div>
            </div>
            <div className="flex items-start gap-2">
               <Image
                  src={gptIcon}
                  alt="gptIcon"
                  width={16}
                  height={16}
                  className="mt-1 ml-0.5"
               />
               <div>
                  <p className="text-14-medium">AI 견적</p>
                  <p className="text-12-regular mt-1">
                     시장 동향과 다양한 변수를 AI가 분석
                  </p>
               </div>
            </div>
            <div className="items-MdStart flex gap-2">
               <LuMessageSquareWarning className="mt-1 h-4 w-4 text-gray-500" />
               <div>
                  <p className="text-14-medium">참고사항</p>
                  <p className="text-12-regular mt-1">
                     실제 견적은 현장 상황에 따라 달라질 수 있습니다
                  </p>
               </div>
            </div>
         </div>
      </section>
   );
}

"use client";

import React, { useState } from "react";
import { InputFieldProps } from "@/lib/types/profile.types";
import { regions } from "@/constants";

//주석: serviceType인지 Area인지 boolean으로 분기처리
function ButtonInputField({
   name,
   isServiceType,
   isArea,
   text,
   validator, // 주석: 유효성 검사 함수
   defaultValue,
   onValidChange, // 주석: 시작하기 버튼의 활성화 관련
}: InputFieldProps) {
   const [value, setValue] = useState<string | string[]>(
      defaultValue ?? (isServiceType || isArea ? [] : ""),
   );
   const [error, setError] = useState("");

   //버튼 중복선택 함수
   const handleToggle = (type: string) => {
      if (!Array.isArray(value)) return;

      const updated = value.includes(type)
         ? value.filter((item) => item !== type) // 한번 더 누르면 선택 해제
         : [...value, type]; // 선택 추가

      setValue(updated);

      if (validator) {
         const result = validator(updated);

         setError(result.success ? "" : result.message);
         onValidChange?.(name, result.success);
      }
   };

   //(소형이사, 가정이사, 사무실이사) Input의 경우
   if (isServiceType) {
      const serviceTypes = ["소형이사", "가정이사", "사무실이사"];
      const selectedValues = Array.isArray(value) ? value : []; // value가 배열인지 보장 (중복선택 가능)

      return (
         <div className="text-16-semibold lg:text-20-semibold flex flex-col gap-6 leading-8">
            <div>
               {text}
               <span className="text-blue-300"> *</span>
               {error && (
                  <div className="mt-0.5 text-base leading-6.5 font-medium text-red-500">
                     {error}
                  </div>
               )}
            </div>

            <div className="flex gap-3">
               {serviceTypes.map((type) => {
                  const isSelected = selectedValues.includes(type);
                  return (
                     <React.Fragment key={type}>
                        <button
                           type="button"
                           onClick={() => handleToggle(type)}
                           className={`text-14-medium flex justify-center rounded-full border px-5 py-2.5 leading-6.5 ${isSelected ? "border-primary-blue-300 text-primary-blue-300 bg-primary-blue-50" : "bg-bg-200 border border-gray-100"}`}
                        >
                           {type}
                        </button>
                        {isSelected && (
                           <input //주석: button에는 name으로 연결시킬 수 없어서 hidden input 사용
                              type="hidden"
                              name="type"
                              value={type}
                           />
                        )}
                     </React.Fragment>
                  );
               })}
            </div>
         </div>
      );
   }

   //(서울, 경기, 인천...) Input인 경우
   if (isArea) {
      const selectedValues = Array.isArray(value) ? value : []; // 주석: value가 배열인지 보장 (중복선택 가능)

      return (
         <div className="text-16-semibold lg:text-20-semibold flex flex-col gap-6 leading-8">
            <div>
               {text}
               <span className="text-blue-300"> *</span>
               {error && (
                  <div className="mt-0.5 text-base leading-6.5 font-medium text-red-500">
                     {error}
                  </div>
               )}
            </div>
            <div className="grid w-[90%] grid-cols-5 gap-x-2 gap-y-3 lg:gap-x-3.5 lg:gap-y-4.5">
               {regions.map((region) => {
                  const isSelected = selectedValues.includes(region);
                  return (
                     <React.Fragment key={region}>
                        <button
                           type="button"
                           onClick={() => handleToggle(region)}
                           className={`bg-bg-200 text-14-medium flex justify-center rounded-full border border-gray-100 px-3 py-2.5 leading-7 lg:px-5 ${isSelected ? "border-primary-blue-300 text-primary-blue-300 bg-primary-blue-50" : "bg-bg-200 border border-gray-100"}`}
                        >
                           {region}
                        </button>
                        {isSelected && (
                           <input //주석: button에는 name으로 연결시킬 수 없어서 hidden input 사용
                              type="hidden"
                              name="region"
                              value={region}
                           />
                        )}
                     </React.Fragment>
                  );
               })}
            </div>
         </div>
      );
   }
}

export default ButtonInputField;

"use client";

import React from "react";
import { FieldValue, InputFieldProps } from "@/lib/types/mover.types";
import { moveType, regions, serviceTypeMap } from "@/constants";
import { Controller, Path } from "react-hook-form";
import ErrorText from "../auth/ErrorText";
import { labelToEnumMap } from "@/lib/utils/profile.util";

//주석: serviceType인지 serviceArea인지 boolean으로 분기처리
function ButtonInputField<T extends Record<string, FieldValue>>({
   name,
   text,
   control,
   isServiceType,
   isArea,
   error,
}: InputFieldProps<T>) {
   //각 버튼들 상수화
   const serviceTypes = moveType;
   const areaOptions = regions;

   const options = isServiceType ? serviceTypes : isArea ? areaOptions : [];

   if (!control) return null;

   return (
      <div className="text-16-semibold lg:text-20-semibold flex flex-col gap-6 leading-8">
         <div>
            {text}
            <span className="text-blue-300"> *</span>
            {error && <ErrorText error={error.message} position="left" />}
         </div>

         <Controller<T, Path<T>>
            name={name}
            control={control}
            render={({ field }) => {
               const selectedValues = Array.isArray(field.value)
                  ? isServiceType // 서비스 종류의 경우, enum("SMALL") > 한글 라벨("소형이사")로 변환
                     ? (field.value as string[]).map(
                          (value) =>
                             serviceTypeMap[
                                value as keyof typeof serviceTypeMap
                             ],
                       )
                     : (field.value as string[]) // 서비스 지역의 경우, 변환 필요 없이 이미 한글임
                  : [];

               const toggleOption = (option: string) => {
                  // 버튼 토클
                  const updatedLabels = selectedValues.includes(option)
                     ? selectedValues.filter((item) => item !== option)
                     : [...selectedValues, option];

                  // 백엔드와 통신을 위해 enum으로 다시 변환
                  const updatedValue = isServiceType
                     ? updatedLabels.map((label) => labelToEnumMap[label])
                     : updatedLabels;

                  field.onChange(updatedValue);
               };

               return (
                  <div
                     className={
                        isArea
                           ? "grid w-[90%] grid-cols-5 gap-x-2 gap-y-3 lg:gap-x-3.5 lg:gap-y-4.5"
                           : "flex gap-3"
                     }
                  >
                     {options.map((option) => {
                        const isSelected = selectedValues.includes(option);
                        return (
                           <button
                              key={option}
                              type="button"
                              onClick={() => toggleOption(option)}
                              className={`text-14-medium flex justify-center rounded-full border px-3 py-2.5 leading-6.5 transition ${
                                 isSelected
                                    ? "border-primary-blue-300 text-primary-blue-300 bg-primary-blue-50"
                                    : "bg-bg-200 border-gray-100 text-gray-700"
                              } ${isArea ? "lg:px-5" : "px-5"}`}
                           >
                              {option}
                           </button>
                        );
                     })}
                  </div>
               );
            }}
         />
      </div>
   );
}

export default ButtonInputField;

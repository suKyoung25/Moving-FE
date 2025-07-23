"use client";

import React from "react";
import { FieldValue, InputFieldProps } from "@/lib/types/profile.types";
import { regions } from "@/constants";
import { Controller, Path } from "react-hook-form";
import ErrorText from "../auth/ErrorText";

//주석: serviceType인지 Area인지 boolean으로 분기처리
function ButtonInputField<T extends Record<string, FieldValue>>({
   name,
   text,
   control,
   isServiceType,
   isArea,
   error,
}: InputFieldProps<T>) {
   const serviceTypes = ["소형이사", "가정이사", "사무실이사"];
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
               const selectedValues = (field.value as string[]) || [];

               const toggleOption = (option: string) => {
                  const updated = selectedValues.includes(option)
                     ? selectedValues.filter((item) => item !== option)
                     : [...selectedValues, option];

                  field.onChange(updated);
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

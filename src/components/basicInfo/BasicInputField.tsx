"use client";

import { BasicInfoInputProps } from "@/lib/types";
import React, { useEffect, useState } from "react";

//기본정보 수정페이지 기본input 컴포넌트화
function BasicInputField({
   name,
   text,
   placeholder,
   validator,
   onValidChange, // 주석: 시작하기 버튼의 활성화 관련
   existedValue: initialValue,
   onValueChange,
   serverError,
}: BasicInfoInputProps) {
   // const [value, setValue] = useState<string>("");
   const [error, setError] = useState("");
   // const [moverError, setMoverError] = useState("");

   // //기존의 기본정보가 변경되면 input 값 업데이트
   // useEffect(() => {
   //    setValue(initialValue);
   // }, [initialValue]);

   const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
   ) => {
      const newVal = e.target.value;
      // setValue(newVal);
      onValueChange?.(name, newVal); //상위로 전달

      if (validator) {
         const result = validator(newVal);

         if (result.success) {
            onValidChange?.(name, result.success);
            setError("");
         } else {
            onValidChange?.(name, result.success);
            setError(result.message);
         }
      }
   };

   // ✅ 백엔드에서 받는 오류 메시지
   useEffect(() => {
      if (serverError) {
         setError("");
      }
   }, [serverError]);

   // 표시할 메시지 결정 (서버 우선)
   const displayError = serverError || error;

   return (
      <div className="flex flex-col gap-4 leading-8">
         <div className="text-16-semibold lg:text-20-semibold">{text}</div>
         <input
            name={name}
            value={initialValue}
            onChange={handleChange}
            type="text"
            className={`mg:h-13 bg-bg-200 h-13 w-full rounded-2xl pl-3.5 placeholder:text-gray-300 lg:h-16 ${error ? "border border-red-500" : ""}`}
            placeholder={placeholder}
         />

         {error && (
            <div className="mt-2 self-end text-base leading-6.5 font-medium text-red-500">
               {error}
            </div>
         )}
      </div>
   );
}

export default BasicInputField;

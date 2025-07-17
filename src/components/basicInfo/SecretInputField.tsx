"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import visibilityOff from "@/assets/images/visibilityOffIcon.svg";
import visibilityOn from "@/assets/images/visibilityIcon.svg";
import { BasicInfoInputProps } from "@/lib/types";

//기본정보 수정페이지 비밀번호input 컴포넌트화
function SecretInputField({
   name,
   text,
   placeholder,
   validator,
   onValidChange, // 주석: 시작하기 버튼의 활성화 관련
   onChange,
   onValueChange,
   serverError,
}: BasicInfoInputProps) {
   const [value, setValue] = useState<string>("");
   const [error, setError] = useState("");
   const [showPassword, setShowPassword] = useState(false);
   const [isHandleChange, setIsHandelChange] = useState(false);

   // 백엔드에서 받는 오류 메시지
   useEffect(() => {
      if (serverError && isHandleChange === false) {
         setError(serverError || error);
      }
   }, [serverError, error, isHandleChange]);

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsHandelChange(true);

      // 사용자 입력이 시작되면 서버 에러 초기화
      setError("");

      const newVal = e.target.value;
      setValue(newVal);

      if (onChange) {
         onChange(e);
      }

      if (validator) {
         const result = validator(newVal);
         onValueChange?.(name, newVal);

         if (result.success) {
            onValidChange?.(name, result.success);
            setError("");
         } else {
            onValidChange?.(name, result.success);
            setError(result.message);
         }
      }
   };

   return (
      <div className="relative flex flex-col gap-4 leading-8">
         <div className="text-16-semibold lg:text-20-semibold">{text}</div>
         <input
            name={name}
            value={value}
            onChange={handleChange}
            type={showPassword ? "text" : "password"}
            className={`bg-bg-200 mg:h-13 h-13 w-full rounded-2xl pl-3.5 placeholder:text-gray-300 lg:h-16 ${error ? "border border-red-500" : ""}`}
            placeholder={placeholder}
         />
         <Image
            className="absolute lg:top-16.5 lg:right-3"
            src={showPassword ? visibilityOn : visibilityOff}
            alt={showPassword ? "비밀번호 보기" : "비밀번호 숨김"}
            onClick={() => setShowPassword((prev) => !prev)}
         />

         {error && (
            <div className="mt-2 self-end text-base leading-6.5 font-medium text-red-500">
               {error}
            </div>
         )}
      </div>
   );
}

export default SecretInputField;

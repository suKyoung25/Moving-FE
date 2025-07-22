"use client";

import React, { useState } from "react";
import Image from "next/image";
import visibilityOff from "@/assets/images/visibilityOffIcon.svg";
import visibilityOn from "@/assets/images/visibilityIcon.svg";
import { FieldValues } from "react-hook-form";
import { BasicInfoInputProps } from "@/lib/types";
import ErrorText from "../auth/ErrorText";

//기본정보 수정페이지 비밀번호input 컴포넌트화
function SecretInputField<T extends FieldValues>({
   name,
   text,
   placeholder,
   register,
   error,
}: BasicInfoInputProps<T>) {
   const [isVisible, setIsVisible] = useState(false);

   const toggleEyeIcon = () => setIsVisible((prev) => !prev);

   return (
      <div className="relative flex flex-col gap-4 leading-8">
         <div className="text-16-semibold lg:text-20-semibold">{text}</div>
         <input
            type={isVisible ? "text" : "password"}
            placeholder={placeholder}
            {...register(name)}
            name={name}
            className={`bg-bg-200 mg:h-13 h-13 w-full rounded-2xl pl-3.5 placeholder:text-gray-300 lg:h-16 ${error ? "border border-red-500" : ""}`}
         />
         <Image
            className="absolute lg:top-16.5 lg:right-3"
            src={isVisible ? visibilityOn : visibilityOff}
            alt={isVisible ? "비밀번호 보기" : "비밀번호 숨김"}
            onClick={toggleEyeIcon}
         />

         {error && <ErrorText error={error} />}
      </div>
   );
}

export default SecretInputField;

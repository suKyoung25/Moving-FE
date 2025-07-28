"use client";

import React from "react";
import ErrorText from "../auth/ErrorText";
import Image from "next/image";
import openedEye from "@/assets/images/visibilityIcon.svg";
import closedEye from "@/assets/images/visibilityOffIcon.svg";
import { ClientProfileUpdateData } from "@/lib/types";
import { FieldValues } from "react-hook-form";

// ✅ react-hook-form 적용한 Input
export default function ProfilePasswordInput<T extends FieldValues>({
   name,
   label,
   placeholder,
   register,
   error,
}: ClientProfileUpdateData<T>) {
   // ✅ 아이콘으로 비밀번호 <-> 글자 처리
   const [isVisible, setIsVisible] = React.useState(false);

   const toggleEyeIcon = () => setIsVisible((prev) => !prev);

   return (
      <section className="flex w-full flex-col gap-2 lg:max-w-160 lg:gap-4">
         <label
            htmlFor={name}
            className="text-black-300 text-16-semibold lg:text-20-semibold"
         >
            {label}
         </label>

         <div className="relative w-full">
            {/* ✅ 입력창 */}
            <input
               id={name}
               type={isVisible ? "text" : "password"}
               placeholder={placeholder}
               {...register(name)}
               className={`${error ? "border-secondary-red-200 focus:border-secondary-red-200 border" : ""} text-black-400 bg-bg-200 h-14 w-full rounded-2xl p-3.5 lg:h-16`}
            />

            {/* ✅ 눈 아이콘 */}
            <button
               type="button"
               onClick={toggleEyeIcon}
               className="absolute top-1/2 right-3 -translate-y-1/2"
            >
               <Image
                  src={isVisible ? openedEye : closedEye}
                  alt="비밀번호 토글 아이콘"
                  width={24}
                  height={24}
               />
            </button>
         </div>

         {error && <ErrorText error={error} />}
      </section>
   );
}

"use client";
import { FaAsterisk } from "react-icons/fa";
import { useState } from "react";
import { SupportInputProps } from "@/lib/types/index";

export default function SupportInput({
   name,
   label,
   important,
   textarea,
   fileupload,
   validate,
   fileValidate,
   setValidationState,
}: SupportInputProps) {
   // 텍스트 값 상태
   const [text, setText] = useState("");
   // 포커스 상태
   const [isFocused, setIsFocused] = useState(false);
   // 파일 선택 여부
   const [fileSelected, setFileSelected] = useState(false);
   // 에러 메시지 상태
   const [errorMsg, setErrorMsg] = useState<string | null>("");
   // 레이블 및 밑줄 활성화 기준 상태
   const isActive = isFocused || text.length > 0 || fileSelected;

   // 텍스트 및 텍스트에어리어 change 핸들러
   const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
   ) => {
      const value = e.target.value;
      setText(value);

      // 입력값이 없으면 에러 제거 및 필수 여부에 따라 상태 업데이트
      if (value.length === 0) {
         setErrorMsg(null);
         setValidationState?.(name, !important);
         return;
      }

      // 유효성 함수가 있으면 검사
      if (validate) {
         const result = validate(value);
         if (!result.success) {
            setErrorMsg(result.error.issues[0].message);
            setValidationState(name, false);
         } else {
            setErrorMsg(null);
            setValidationState(name, true);
         }
      }
   };

   // 파일 업로드 핸들러
   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;

      if (!files || files.length === 0) {
         setFileSelected(false);
         setErrorMsg(null);
         setValidationState?.(name, !important);
         return;
      }

      const file = files[0];

      if (fileValidate) {
         const result = fileValidate(file);

         if (!result.success) {
            setErrorMsg(result.error.issues[0].message);
            setValidationState?.(name, false);
         } else {
            setErrorMsg(null);
            setValidationState?.(name, true);
         }
      } else {
         setValidationState?.(name, true);
      }

      setFileSelected(true);
   };

   // input/textarea 공통 props
   const commonProps = {
      name,
      autoComplete: "off",
      onFocus: () => setIsFocused(true),
      onBlur: () => setIsFocused(false),
      className: `w-full pt-0 pb-1.5 md:pb-3 border-b ${
         isFocused ? "border-primary-blue-300" : "border-gray-400"
      } transition-all duration-300`,
   };

   return (
      <div
         className={`text-14-medium md:text-18-medium w-full pt-2 md:pt-4 ${errorMsg && "[&_*]:border-red-500 [&_*]:text-red-500"}`}
      >
         <div
            className={`flex ${isActive ? "items-center" : "items-end"} gap-0.5`}
         >
            <span
               className={`${isActive ? "text-primary-blue-300 opacity-100" : "opacity-0"} transition-opacity duration-500`}
            >
               {label}
            </span>
            <FaAsterisk
               className={`${important ? "block" : "hidden"} h-2 w-2 text-red-500`}
            />
         </div>
         {fileupload ? (
            <input {...commonProps} type="file" onChange={handleFileChange} />
         ) : textarea ? (
            <textarea
               {...commonProps}
               rows={isFocused ? 8 : 1}
               value={text}
               onChange={handleChange}
               placeholder={isFocused ? `` : label}
            />
         ) : (
            <input
               {...commonProps}
               type="text"
               value={text}
               onChange={handleChange}
               placeholder={isFocused ? `` : label}
            />
         )}
         {/* 에러 메시지 출력 */}
         <div
            className={` ${!isFocused || errorMsg ? "text-red-500 opacity-100" : "opacity-0"} text-12-medium md:text-16-medium mt-1.5 min-h-5 transition-opacity duration-300 md:min-h-7`}
         >
            {errorMsg ?? ""}
         </div>
      </div>
   );
}

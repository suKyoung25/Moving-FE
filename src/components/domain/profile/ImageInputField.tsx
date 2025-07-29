"use client";

import { FieldValue, InputFieldProps } from "@/lib/types";
import React, { useRef, useState } from "react";
import { Controller } from "react-hook-form";
import profileUploader from "@/assets/images/profileUploaderIcon.svg";
import Image from "next/image";

//프로필 이미지 input인 경우
function ImageInputField<T extends Record<string, FieldValue>>({
   name,
   text,
   control,
}: InputFieldProps<T>) {
   const fileInputRef = useRef<HTMLInputElement | null>(null);
   const [previewUrl, setPreviewUrl] = useState<string | null>(null); //이미지 미리보기

   return (
      <div className="text-16-semibold lg:text-20-semibold flex flex-col gap-4">
         <div>{text}</div>

         <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => {
               // field.value가 string (기존 url)이면 previewUrl 업데이트
               React.useEffect(() => {
                  if (
                     typeof field.value === "string" &&
                     field.value !== previewUrl
                  ) {
                     setPreviewUrl(field.value);
                  }
               }, [field.value]);

               return (
                  <>
                     {/* UI 상에선 숨기기 input */}
                     <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={(e) => {
                           const file = e.target.files?.[0];
                           if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                 setPreviewUrl(reader.result as string);
                              };
                              reader.readAsDataURL(file);

                              field.onChange(file); // S3 업로드는 하지 않고, 파일을 form에 저장
                           }
                        }}
                     />

                     {/* 커스텀 업로드 버튼 (SVG 사용) */}
                     {previewUrl ? null : (
                        <div>
                           <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="w-fit"
                           >
                              <Image
                                 src={profileUploader}
                                 alt="이미지 업로드 버튼"
                                 width={160}
                                 height={160}
                              />
                           </button>
                        </div>
                     )}

                     {/* 이미지 미리보기 */}
                     {previewUrl && (
                        <Image
                           src={previewUrl || (field.value as string)}
                           alt="미리보기"
                           width={160}
                           height={160}
                           className="cursor-pointer rounded-lg object-cover"
                           onClick={() => fileInputRef.current?.click()} // 클릭 시 파일 선택창 열기
                        />
                     )}

                     {fieldState.error && (
                        <p className="text-sm text-red-500">
                           {fieldState.error.message}
                        </p>
                     )}
                  </>
               );
            }}
         />
      </div>
   );
}

export default ImageInputField;

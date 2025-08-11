"use client";

import { FieldValue, InputFieldProps } from "@/lib/types";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useWatch } from "react-hook-form";
import profileUploader from "@/assets/images/profileUploaderIcon.svg";
import Image from "next/image";
import ImageEditModal from "./ImageEditModal";
import { ControllerRenderProps, Path } from "react-hook-form";

function ImageInputField<T extends Record<string, FieldValue>>({
   name,
   text,
   control,
}: InputFieldProps<T>) {
   const fileInputRef = useRef<HTMLInputElement | null>(null);
   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
   const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(
      null,
   );
   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
   const [isDragOver, setIsDragOver] = useState(false);
   const watchedValue = useWatch({ name, control });

   // DB 이미지를 불러오기 위해 사용
   useEffect(() => {
      if (typeof watchedValue === "string" && watchedValue !== previewUrl) {
         setPreviewUrl(watchedValue);
      }
   }, [watchedValue, previewUrl]);

   // 선택한 파일은 RHF에 저장하고 수정 모달을 띄움
   const handleFileSelection = (
      file: File,
      field: ControllerRenderProps<T, Path<T>>,
   ) => {
      const reader = new FileReader();
      reader.onloadend = () => {
         const imageUrl = reader.result as string; // 선택한 이미지를 url 변환
         setOriginalImageUrl(imageUrl);
         setIsEditModalOpen(true);
      };
      reader.readAsDataURL(file);
      field.onChange(file);
   };

   // 이미지 드래그가 끝난 후 실행
   const handleDrop = (
      e: React.DragEvent,
      field: ControllerRenderProps<T, Path<T>>,
   ) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) {
         handleFileSelection(file, field);
      }
   };

   // 새로운 이미지를 선택
   const handleFileInputChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      field: ControllerRenderProps<T, Path<T>>,
   ) => {
      const file = e.target.files?.[0];
      if (file) {
         handleFileSelection(file, field);
      }
   };

   const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(true);
   };

   const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
   };

   // 이미지 수정
   const handleEditConfirm = async (
      croppedImageUrl: string,
      field: ControllerRenderProps<T, Path<T>>,
   ) => {
      setPreviewUrl(croppedImageUrl);

      field.onChange(croppedImageUrl);

      setIsEditModalOpen(false);
   };

   // 기존 이미지 삭제
   const handleDelete = (field: ControllerRenderProps<T, Path<T>>) => {
      setPreviewUrl(null);
      setOriginalImageUrl(null);
      field.onChange("");
      if (fileInputRef.current) {
         fileInputRef.current.value = "";
      }
   };

   return (
      <div className="text-16-semibold lg:text-20-semibold flex flex-col gap-4">
         <div>{text}</div>

         <Controller
            name={name}
            control={control}
            render={({ field }) => (
               <>
                  {/* UI 상에서는 안보이는 이미지 업로드 버튼 */}
                  <input
                     type="file"
                     accept="image/*"
                     ref={fileInputRef}
                     className="hidden"
                     onChange={(e) => handleFileInputChange(e, field)}
                  />

                  {/* 미리보기가 있을 경우, 없을 경우 분기 처리*/}
                  {previewUrl ? (
                     <div className="relative mb-4 flex flex-row gap-4">
                        <div className={`relative h-40 w-40`}>
                           <img
                              src={previewUrl}
                              alt="미리보기"
                              className={`h-40 w-40 rounded-full object-cover`}
                           />
                        </div>

                        <button
                           type="button"
                           onClick={() => handleDelete(field)}
                           className="text-black-400 hover:bg-bg-200 absolute bottom-35 left-35 mt-1 ml-1 h-8 rounded-full bg-gray-100 px-3 py-1 text-sm"
                        >
                           X
                        </button>
                     </div>
                  ) : (
                     <div
                        className={`relative mb-4 h-40 w-40 rounded-full border-2 border-dashed text-center transition-colors ${
                           isDragOver
                              ? "border-blue-400 bg-blue-50"
                              : "border-gray-300 hover:border-gray-400"
                        } `}
                        onDrop={(e) => handleDrop(e, field)}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                     >
                        <button
                           type="button"
                           onClick={() => fileInputRef.current?.click()}
                        >
                           <Image
                              src={profileUploader}
                              alt="이미지 업로드 버튼"
                              className="overflow-hidden rounded-full"
                           />
                        </button>
                     </div>
                  )}

                  {/* 이미지 수정 모달 */}
                  {originalImageUrl && (
                     <ImageEditModal
                        imageUrl={originalImageUrl}
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        onConfirm={(croppedImageUrl) =>
                           handleEditConfirm(croppedImageUrl, field)
                        }
                     />
                  )}
               </>
            )}
         />
      </div>
   );
}

export default ImageInputField;

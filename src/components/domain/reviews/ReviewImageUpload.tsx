"use client";

import React, { useEffect, useRef, useState } from "react";
import { Controller, useWatch } from "react-hook-form";
import {
   ControllerRenderProps,
   Control,
   FieldValues,
   Path,
} from "react-hook-form";
import { base64ToFile } from "@/lib/utils/profile.util";
import ImageEditModal from "@/components/domain/profile/ImageEditModal";
import Image from "next/image";

interface ReviewImageUploadProps<T extends FieldValues = FieldValues> {
   name: Path<T>;
   control: Control<T>;
   labelId: string;
   text: string;
   maxImages?: number;
}

function ReviewImageUpload<T extends FieldValues = FieldValues>({
   name,
   control,
   labelId,
   text,
   maxImages = 5,
}: ReviewImageUploadProps<T>) {
   const fileInputRef = useRef<HTMLInputElement | null>(null);
   const [previewUrls, setPreviewUrls] = useState<string[]>([]);
   const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(
      null,
   );
   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
   const [isDragOver, setIsDragOver] = useState(false);
   const [editingIndex, setEditingIndex] = useState<number>(-1);
   const watchedValue = useWatch({ name, control });

   // DB 이미지를 불러오기 위해 사용
   useEffect(() => {
      if (Array.isArray(watchedValue) && watchedValue.length > 0) {
         setPreviewUrls(watchedValue);
      }
   }, [watchedValue]);

   // 선택한 파일은 RHF에 저장하고 수정 모달을 띄움
   const handleFileSelection = (file: File) => {
      if (previewUrls.length >= maxImages) {
         alert(`이미지는 최대 ${maxImages}개까지 업로드 가능합니다.`);
         return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
         const imageUrl = reader.result as string;
         setOriginalImageUrl(imageUrl);
         setIsEditModalOpen(true);
      };
      reader.readAsDataURL(file);
   };

   // 이미지 드래그가 끝난 후 실행
   const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const droppedFile = e.dataTransfer.files?.[0];
      if (droppedFile && droppedFile.type.startsWith("image/")) {
         handleFileSelection(droppedFile);
      }
   };

   // 새로운 이미지를 선택
   const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
         handleFileSelection(selectedFile);
      }
   };

   // 드래그 오버 이벤트
   const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(true);
   };

   // 드래그 리브 이벤트
   const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
   };

   // 이미지 수정 확인
   const handleEditConfirm = (
      croppedImageUrl: string,
      field: ControllerRenderProps<T, Path<T>>,
   ) => {
      base64ToFile(croppedImageUrl, "review-image.png");

      if (editingIndex >= 0) {
         // 기존 이미지 수정
         const newUrls = [...previewUrls];
         newUrls[editingIndex] = croppedImageUrl;
         setPreviewUrls(newUrls);
         field.onChange(newUrls);
      } else {
         // 새 이미지 추가
         const newUrls = [...previewUrls, croppedImageUrl];
         setPreviewUrls(newUrls);
         field.onChange(newUrls);
      }

      setIsEditModalOpen(false);
      setOriginalImageUrl(null);
      setEditingIndex(-1);
   };

   // 이미지 삭제
   const handleDelete = (
      index: number,
      field: ControllerRenderProps<T, Path<T>>,
   ) => {
      const newUrls = previewUrls.filter((_, i) => i !== index);
      setPreviewUrls(newUrls);
      field.onChange(newUrls);
   };

   // 이미지 수정
   const handleEdit = (index: number) => {
      setOriginalImageUrl(previewUrls[index]);
      setEditingIndex(index);
      setIsEditModalOpen(true);
   };

   return (
      <div className="text-16-semibold lg:text-20-semibold flex flex-col gap-4">
         <label htmlFor={labelId}>{text}</label>

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
                     onChange={(e) => handleFileInputChange(e)}
                  />

                  {/* 이미지 미리보기 영역 */}
                  <div className="flex flex-wrap gap-4">
                     {previewUrls.map((url, index) => (
                        <div key={index} className="relative">
                           <Image
                              src={url}
                              alt={`리뷰 이미지 ${index + 1}`}
                              width={96}
                              height={96}
                              className="h-15 w-15 rounded-lg object-cover lg:h-20 lg:w-20"
                           />
                           <div className="absolute -top-2 -right-2 flex gap-1">
                              <button
                                 type="button"
                                 onClick={() => handleEdit(index)}
                                 className="bg-primary-blue-500 hover:bg-primary-blue-600 flex h-6 w-6 items-center justify-center rounded-full text-xs text-white"
                              >
                                 ✏️
                              </button>
                              <button
                                 type="button"
                                 onClick={() => handleDelete(index, field)}
                                 className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white hover:bg-red-600"
                              >
                                 ✕
                              </button>
                           </div>
                        </div>
                     ))}

                     {/* 이미지 추가 버튼 */}
                     {previewUrls.length < maxImages && (
                        <div
                           className={`flex h-15 w-15 cursor-pointer items-center justify-center rounded-full border-2 border-dashed transition-colors lg:h-20 lg:w-20 ${
                              isDragOver
                                 ? "border-blue-400 bg-blue-50"
                                 : "border-gray-300 hover:border-gray-400"
                           }`}
                           onDrop={(e) => handleDrop(e)}
                           onDragOver={handleDragOver}
                           onDragLeave={handleDragLeave}
                           onClick={() => fileInputRef.current?.click()}
                        >
                           <span className="text-2xl text-gray-500">+</span>
                        </div>
                     )}
                  </div>

                  {/* 이미지 수정 모달 */}
                  {originalImageUrl && (
                     <ImageEditModal
                        imageUrl={originalImageUrl}
                        isOpen={isEditModalOpen}
                        onClose={() => {
                           setIsEditModalOpen(false);
                           setOriginalImageUrl(null);
                           setEditingIndex(-1);
                        }}
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

export default ReviewImageUpload;

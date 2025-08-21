import { uploadToCloudinary } from "@/lib/api/auth/requests/updateProfileImage";
import React, { useState, useRef, useEffect } from "react";
import { IoCameraOutline } from "react-icons/io5";
import { useWatch, Controller } from "react-hook-form";
import { Control, FieldValues, Path } from "react-hook-form";
import { CiCirclePlus } from "react-icons/ci";
import { IoCloseCircleOutline } from "react-icons/io5";
interface ReviewImageUploadProps<T extends FieldValues = FieldValues> {
   name: Path<T>;
   control: Control<T>;
   maxImages?: number;
   labelId?: string;
   text?: string;
}

interface UploadedImage {
   id: number;
   url: string;
   file: File | null;
}

const ReviewImageUpload = <T extends FieldValues = FieldValues>({
   name,
   control,
   maxImages = 5,
}: ReviewImageUploadProps<T>) => {
   const [images, setImages] = useState<UploadedImage[]>([]);
   const [isDragOver, setIsDragOver] = useState(false);
   const fileInputRef = useRef<HTMLInputElement | null>(null);

   // ✅ 원본처럼 form value 감시
   const watchedValue = useWatch({ name, control });

   useEffect(() => {
      if (Array.isArray(watchedValue) && watchedValue.length > 0) {
         console.log("불러온 이미지 값:", watchedValue);
         const loadedImages = watchedValue.map((url: string) => ({
            id: Date.now() + Math.random(),
            url,
            file: null,
         }));
         setImages(loadedImages);
      }
   }, [watchedValue]);

   // ✅ 이미지 선택 & 업로드
   const handleFileSelect = (
      files: FileList | null,
      fieldOnChange: (value: string[]) => void,
   ) => {
      if (!files) return;

      const newFiles = Array.from(files).slice(0, maxImages - images.length);

      newFiles.forEach(async (file) => {
         if (file.type.startsWith("image/")) {
            try {
               const result = await uploadToCloudinary(file);

               const newImage = {
                  id: Date.now() + Math.random(),
                  url: result.secure_url,
                  file,
               };

               // state 업데이트
               setImages((prev) => {
                  const updated = [...prev, newImage];
                  // ✅ react-hook-form 값 업데이트
                  fieldOnChange(updated.map((img) => img.url));
                  return updated;
               });
            } catch (err) {
               console.error("Cloudinary 업로드 실패:", err);
            }
         }
      });
   };

   const handleDrop = (
      e: React.DragEvent,
      fieldOnChange: (value: string[]) => void,
   ) => {
      e.preventDefault();
      setIsDragOver(false);
      handleFileSelect(e.dataTransfer?.files, fieldOnChange);
   };

   const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(true);
   };

   const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
   };

   const deleteImage = (
      id: number,
      fieldOnChange: (value: string[]) => void,
   ) => {
      setImages((prev) => {
         const updated = prev.filter((img) => img.id !== id);
         // ✅ react-hook-form 값 동기화
         fieldOnChange(updated.map((img) => img.url));
         return updated;
      });
   };

   return (
      <div className="w-full">
         <Controller
            name={name}
            control={control}
            render={({ field }) => (
               <>
                  {/* 섹션 헤더 */}
                  <div className="text-16-semibold lg:text-20-semibold mb-4 flex items-center justify-between">
                     <label>
                        이미지 첨부{" "}
                        <span className="text-12-regular lg:text-14-regular text-gray-500">
                           (최대 {maxImages}개)
                        </span>
                     </label>
                     {images.length > 0 && (
                        <span className="text-12-regular text-gray-200">
                           {images.length}/{maxImages}
                        </span>
                     )}
                  </div>

                  <input
                     ref={fileInputRef}
                     type="file"
                     multiple
                     accept="image/*"
                     onChange={(e) =>
                        handleFileSelect(e.target.files, field.onChange)
                     }
                     className="hidden"
                  />

                  {/* 메인 업로드 영역 */}
                  <div
                     className={`relative rounded-xl border-2 border-dashed p-4 transition-all duration-200 ${
                        isDragOver
                           ? "border-blue-400 bg-blue-50"
                           : "border-gray-200 bg-gray-50 hover:border-gray-300"
                     }`}
                     onDrop={(e) => handleDrop(e, field.onChange)}
                     onDragOver={handleDragOver}
                     onDragLeave={handleDragLeave}
                  >
                     {images.length === 0 ? (
                        <div
                           className="cursor-pointer py-6 text-center"
                           onClick={() => fileInputRef.current?.click()}
                        >
                           <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow">
                              <IoCameraOutline
                                 className="text-gray-200"
                                 size={24}
                              />
                           </div>

                           <p className="text-14-regular text-gray-400">
                              리뷰에 도움이 되는 사진을 추가해 보세요
                           </p>
                        </div>
                     ) : (
                        <div className="space-y-3">
                           <div className="flex flex-wrap gap-2">
                              {images.map((image, index) => (
                                 <div key={image.id} className="group relative">
                                    <div className="h-16 w-16 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                                       <img
                                          src={image.url}
                                          alt={`첨부 이미지 ${index + 1}`}
                                          className="h-full w-full object-cover"
                                       />
                                    </div>
                                    <button
                                       type="button"
                                       onClick={() =>
                                          deleteImage(image.id, field.onChange)
                                       }
                                       className="bg-secondary-red-200 absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-white shadow-md transition-colors group-hover:scale-110 hover:bg-red-500"
                                       title="삭제"
                                    >
                                       <IoCloseCircleOutline size={20} />
                                    </button>
                                 </div>
                              ))}

                              {images.length < maxImages && (
                                 <button
                                    type="button"
                                    onClick={() =>
                                       fileInputRef.current &&
                                       fileInputRef.current.click()
                                    }
                                    className="group hover:border-primary-blue-300 flex h-16 w-16 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 transition-all duration-200 hover:bg-blue-50"
                                 >
                                    <CiCirclePlus
                                       className="group-hover:text-primary-blue-300 text-gray-300 transition-all duration-200"
                                       size={24}
                                    />
                                 </button>
                              )}
                           </div>
                        </div>
                     )}
                  </div>
               </>
            )}
         />
      </div>
   );
};

export default ReviewImageUpload;

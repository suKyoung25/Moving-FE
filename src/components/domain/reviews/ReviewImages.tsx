"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { CiImageOn } from "react-icons/ci";
import { GrPrevious, GrNext } from "react-icons/gr";

interface ReviewImagesProps {
   images: string[];
   className?: string;
   "aria-label"?: string;
}

export default function ReviewImages({
   images,
   className = "",
   "aria-label": ariaLabel,
}: ReviewImagesProps) {
   const t = useTranslations("Reviews");
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [currentIndex, setCurrentIndex] = useState(0);

   // 키보드 이벤트 처리
   useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
         if (!isModalOpen) return;

         switch (e.key) {
            case "Escape":
               setIsModalOpen(false);
               break;
            case "ArrowLeft":
               e.preventDefault();
               goToPrevious();
               break;
            case "ArrowRight":
               e.preventDefault();
               goToNext();
               break;
         }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
   }, [isModalOpen, currentIndex]);

   // 모달 열릴 때 body 스크롤 방지
   useEffect(() => {
      if (isModalOpen) {
         document.body.style.overflow = "hidden";
      } else {
         document.body.style.overflow = "unset";
      }

      return () => {
         document.body.style.overflow = "unset";
      };
   }, [isModalOpen]);

   if (!images || images.length === 0) {
      return null;
   }

   const openModal = (index: number) => {
      setCurrentIndex(index);
      setIsModalOpen(true);
   };

   const closeModal = () => {
      setIsModalOpen(false);
   };

   const goToNext = () => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
   };

   const goToPrevious = () => {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
   };

   const goToSlide = (index: number) => {
      setCurrentIndex(index);
   };

   return (
      <>
         {/* 겹쳐진 이미지 썸네일 */}
         <div
            className={`relative cursor-pointer ${className}`}
            onClick={() => openModal(0)}
            role="button"
            tabIndex={0}
            aria-label={ariaLabel}
            onKeyDown={(e) => {
               if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openModal(0);
               }
            }}
         >
            {/* 이미지 스택 - 최대 3개까지만 표시 */}
            <div className="relative h-15 w-15 lg:h-20 lg:w-20">
               {images
                  .slice(0, Math.min(3, images.length))
                  .map((image, index) => (
                     <div
                        key={index}
                        className={`absolute overflow-hidden rounded-lg border-2 border-white transition-transform hover:scale-105 ${
                           index === 0
                              ? "z-[3] h-15 w-15 lg:h-20 lg:w-20"
                              : index === 1
                                ? "top-1 left-1 z-[2] h-13 w-13 lg:top-1.5 lg:left-1.5 lg:h-18 lg:w-18"
                                : "top-2 left-2 z-[1] h-11 w-11 lg:top-3 lg:left-3 lg:h-16 lg:w-16"
                        }`}
                        style={{
                           transform: `translate(${index * 2}px, ${index * 2}px) rotate(${index * -2}deg)`,
                        }}
                     >
                        <Image
                           src={image}
                           alt={t("reviewImageAlt", { index: index + 1 })}
                           fill
                           className="object-cover"
                        />
                     </div>
                  ))}

               {/* 이미지 개수 표시 배지 */}
               {images.length > 1 && (
                  <div className="absolute right-0 left-0 z-10 flex h-full w-full flex-col items-center justify-center rounded-lg bg-black/50 text-white">
                     <CiImageOn size={32} className="lg:size-9" />
                  </div>
               )}
            </div>
         </div>

         {/* 이미지 모달 슬라이더 */}
         {isModalOpen && (
            <div
               className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
               onClick={closeModal}
               role="dialog"
               aria-modal="true"
               aria-labelledby="image-modal-title"
               aria-describedby="image-modal-description"
            >
               <div className="relative h-full w-full max-w-4xl">
                  <h2 id="image-modal-title" className="sr-only">
                     {t("imageModalTitle")}
                  </h2>
                  <p id="image-modal-description" className="sr-only">
                     {t("imageModalDescription")}
                  </p>
                  {/* 닫기 버튼
                  {images.length > 1 && (
                     <button
                        className="absolute top-6 right-6 z-10 text-white md:-right-2"
                        onClick={(e) => {
                           e.stopPropagation();
                           closeModal();
                        }}
                        aria-label={t("closeImageModal")}
                        title={t("closeImageModal")}
                     >
                        <RiCloseLargeLine size={40} />
                     </button>
                  )} */}
                  {/* 메인 이미지 */}
                  <div className="flex h-full items-center justify-center px-16">
                     <div className="relative max-h-[80vh] max-w-full">
                        <Image
                           src={images[currentIndex]}
                           alt={t("enlargedReviewImage")}
                           width={800}
                           height={600}
                           className="max-h-full max-w-full object-contain"
                           onClick={(e) => e.stopPropagation()}
                        />
                     </div>
                  </div>
                  {/* 이전/다음 버튼 (이미지가 1개보다 많을 때만 표시) */}
                  {images.length > 1 && (
                     <>
                        <button
                           className="absolute top-1/2 left-4 flex -translate-y-1/2 text-white md:-left-2"
                           onClick={(e) => {
                              e.stopPropagation();
                              goToPrevious();
                           }}
                           aria-label="Previous image"
                        >
                           <GrPrevious size={40} className="md:size-12" />
                        </button>

                        <button
                           className="absolute top-1/2 right-4 flex -translate-y-1/2 text-white md:-right-2"
                           onClick={(e) => {
                              e.stopPropagation();
                              goToNext();
                           }}
                           aria-label="Next image"
                        >
                           <GrNext size={40} className="md:size-12" />
                        </button>
                     </>
                  )}
                  {/* 이미지 인디케이터/썸네일 네비게이션 */}
                  {images.length > 1 && (
                     <div className="bg-opacity-50 absolute bottom-6 left-1/2 flex max-w-[90vw] -translate-x-1/2 gap-2 overflow-x-auto rounded-full bg-black px-4 py-3">
                        {images.map((image, index) => (
                           <button
                              key={index}
                              className={`relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                                 index === currentIndex
                                    ? "scale-110 border-white"
                                    : "border-transparent opacity-60 hover:opacity-80"
                              }`}
                              onClick={(e) => {
                                 e.stopPropagation();
                                 goToSlide(index);
                              }}
                              aria-label={`Go to image ${index + 1}`}
                           >
                              <Image
                                 src={image}
                                 alt={`Thumbnail ${index + 1}`}
                                 fill
                                 className="object-cover"
                              />
                           </button>
                        ))}
                     </div>
                  )}
                  {/* 이미지 카운터 */}
                  {images.length > 1 && (
                     <div className="text-16-medium bg-opacity-50 absolute top-6 left-1/2 -translate-x-1/2 rounded-full bg-black px-4 py-2 text-white">
                        {currentIndex + 1} / {images.length}
                     </div>
                  )}
               </div>
            </div>
         )}
      </>
   );
}

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

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
   const [selectedImage, setSelectedImage] = useState<string | null>(null);

   if (!images || images.length === 0) {
      return null;
   }

   return (
      <>
         <div
            className={`flex flex-wrap gap-2 ${className}`}
            aria-label={ariaLabel}
         >
            {images.slice(0, 4).map((image, index) => (
               <div
                  key={index}
                  className="relative h-15 w-15 cursor-pointer overflow-hidden rounded-lg lg:h-20 lg:w-20"
                  onClick={() => setSelectedImage(image)}
                  role="button"
                  tabIndex={0}
                  aria-label={t("reviewImageAlt", { index: index + 1 })}
                  onKeyDown={(e) => {
                     if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedImage(image);
                     }
                  }}
               >
                  <Image
                     src={image}
                     alt={t("reviewImageAlt", { index: index + 1 })}
                     fill
                     className="object-cover"
                  />
                  {index === 3 && images.length > 4 && (
                     <div
                        className="bg-opacity-50 absolute inset-0 flex items-center justify-center bg-black text-sm font-semibold text-white"
                        aria-label={t("additionalImagesCount", {
                           count: images.length - 4,
                        })}
                     >
                        +{images.length - 4}
                     </div>
                  )}
               </div>
            ))}
         </div>

         {/* 이미지 모달 */}
         {selectedImage && (
            <div
               className="bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-black"
               onClick={() => setSelectedImage(null)}
               role="dialog"
               aria-modal="true"
               aria-labelledby="image-modal-title"
               aria-describedby="image-modal-description"
            >
               <div className="relative max-h-[90vh] max-w-[90vw]">
                  <h2 id="image-modal-title" className="sr-only">
                     {t("imageModalTitle")}
                  </h2>
                  <p id="image-modal-description" className="sr-only">
                     {t("imageModalDescription")}
                  </p>
                  <Image
                     src={selectedImage}
                     alt={t("enlargedReviewImage")}
                     width={800}
                     height={600}
                     className="max-h-full max-w-full object-contain"
                  />
                  <button
                     className="absolute -top-4 -right-4 h-8 w-8 rounded-full bg-white text-black hover:bg-gray-200"
                     onClick={() => setSelectedImage(null)}
                     aria-label={t("closeImageModal")}
                     title={t("closeImageModal")}
                  >
                     ✕
                  </button>
               </div>
            </div>
         )}
      </>
   );
}

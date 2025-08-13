"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ReviewImagesProps {
   images: string[];
   className?: string;
}

export default function ReviewImages({
   images,
   className = "",
}: ReviewImagesProps) {
   const [selectedImage, setSelectedImage] = useState<string | null>(null);

   if (!images || images.length === 0) {
      return null;
   }

   return (
      <>
         <div className={`flex flex-wrap gap-2 ${className}`}>
            {images.slice(0, 4).map((image, index) => (
               <div
                  key={index}
                  className="relative h-15 w-15 cursor-pointer overflow-hidden rounded-lg lg:h-20 lg:w-20"
                  onClick={() => setSelectedImage(image)}
               >
                  <Image
                     src={image}
                     alt={`리뷰 이미지 ${index + 1}`}
                     fill
                     className="object-cover"
                  />
                  {index === 3 && images.length > 4 && (
                     <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center bg-black text-sm font-semibold text-white">
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
            >
               <div className="relative max-h-[90vh] max-w-[90vw]">
                  <Image
                     src={selectedImage}
                     alt="리뷰 이미지 확대보기"
                     width={800}
                     height={600}
                     className="max-h-full max-w-full object-contain"
                  />
                  <button
                     className="absolute -top-4 -right-4 h-8 w-8 rounded-full bg-white text-black hover:bg-gray-200"
                     onClick={() => setSelectedImage(null)}
                  >
                     ✕
                  </button>
               </div>
            </div>
         )}
      </>
   );
}

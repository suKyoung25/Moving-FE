"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import blackArrow from "@/assets/images/chevronDownBlackIcon.svg";
import more from "@/assets/images/moreGrayIcon.svg";

interface PaginationProps {
   page: number;
   totalPages: number;
   onPageChange: (page: number) => void;
}

function getPageRange(page: number, totalPages: number, maxPages: number) {
   const pages = [];
   let start = Math.max(1, page - Math.floor(maxPages / 2));
   const end = Math.min(totalPages, start + maxPages - 1);

   if (end - start + 1 < maxPages) {
      start = Math.max(1, end - maxPages + 1);
   }
   for (let i = start; i <= end; i++) {
      pages.push(i);
   }
   return pages;
}

export default function Pagination({
   page,
   totalPages,
   onPageChange,
}: PaginationProps) {
   const [maxPages, setMaxPages] = useState(3);

   // 반응형 maxPages
   useEffect(() => {
      function update() {
         setMaxPages(window.innerWidth >= 1440 ? 5 : 3);
      }
      update();
      window.addEventListener("resize", update);
      return () => window.removeEventListener("resize", update);
   }, []);

   if (totalPages <= 1) return null;

   const pagesToShow = getPageRange(page, totalPages, maxPages);
   const hasLeftDots = pagesToShow[0] > 2;
   const hasRightDots = pagesToShow[pagesToShow.length - 1] < totalPages - 1;

   return (
      <nav className="my-6 flex items-center justify-center gap-2 select-none">
         {/* 이전 */}
         <button
            className="rounded p-1.5 disabled:opacity-50 lg:p-3"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            aria-label="이전"
         >
            <Image
               src={blackArrow}
               width={24}
               height={24}
               alt="이전"
               style={{ transform: "rotate(90deg)" }}
            />
         </button>

         {/* 첫 페이지 */}
         {pagesToShow[0] > 1 && (
            <>
               <button
                  className={`text-16-semibold lg:text-18-semibold p-2.5 lg:p-3 ${page === 1 ? "text-black-400" : "text-gray-200"}`}
                  onClick={() => onPageChange(1)}
               >
                  1
               </button>
               {hasLeftDots && (
                  <span>
                     <Image src={more} width={13} height={3} alt="생략" />
                  </span>
               )}
            </>
         )}

         {/* 주요 페이지들 */}
         {pagesToShow.map((p) => (
            <button
               key={p}
               className={`text-16-semibold lg:text-18-semibold p-2.5 lg:p-3 ${p === page ? "text-black-400" : "text-gray-200"}`}
               onClick={() => onPageChange(p)}
            >
               {p}
            </button>
         ))}

         {/* 마지막 페이지 */}
         {pagesToShow[pagesToShow.length - 1] < totalPages && (
            <>
               {hasRightDots && (
                  <span>
                     <Image src={more} width={13} height={3} alt="생략" />
                  </span>
               )}
               <button
                  className={`text-16-semibold lg:text-18-semibold p-2.5 lg:p-3 ${page === totalPages ? "text-black-400" : "text-gray-200"}`}
                  onClick={() => onPageChange(totalPages)}
               >
                  {totalPages}
               </button>
            </>
         )}

         {/* 다음 */}
         <button
            className="rounded p-1.5 disabled:opacity-50 lg:p-3"
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
            aria-label="다음"
         >
            <Image
               src={blackArrow}
               width={24}
               height={24}
               alt="다음"
               style={{ transform: "rotate(-90deg)" }}
            />
         </button>
      </nav>
   );
}

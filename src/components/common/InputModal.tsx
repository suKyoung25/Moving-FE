"use client";

import Image from "next/image";
import React, { useEffect, useRef } from "react";
import close from "@/assets/images/xIcon.svg";
import SolidButton from "@/components/common/SolidButton";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";
import { useTranslations } from "next-intl";

interface InputModalProps {
   isOpen: boolean;
   onClose: () => void;
   title: string;
   children?: React.ReactNode;
   buttonTitle: string;
   isActive: boolean;
   isConfirmOpen?: boolean;
}

export default function InputModal({
   isOpen,
   onClose,
   title,
   children,
   buttonTitle,
   isActive,
   isConfirmOpen,
}: InputModalProps) {
   const t = useTranslations("Request");
   const modalRef = useRef<HTMLDivElement>(null);
   const firstFocusableRef = useRef<HTMLButtonElement>(null); // 최초 포커스용

   useOutsideClick(modalRef, () => {
      if (!isConfirmOpen) onClose();
   });

   // ESC 키 닫기 + 포커스 첫 요소
   useEffect(() => {
      if (isOpen) {
         // 스크롤 방지
         document.body.style.overflow = "hidden";
         // 첫 포커스
         setTimeout(() => {
            firstFocusableRef.current?.focus();
         }, 0);
      } else {
         document.body.style.overflow = "";
      }

      const handleKeyDown = (e: KeyboardEvent) => {
         if (e.key === "Escape") {
            onClose();
         }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
         window.removeEventListener("keydown", handleKeyDown);
      };
   }, [isOpen]);

   if (!isOpen) return null;

   return (
      <div
         className="fixed inset-0 z-40 flex items-end justify-center bg-black/50 md:items-center"
         role="dialog"
         aria-modal="true"
         aria-labelledby="modal-title"
      >
         <div
            ref={modalRef}
            className="w-full rounded-t-2xl bg-white px-6 pt-8 pb-10 shadow-lg md:max-w-94 md:rounded-2xl lg:max-w-152"
         >
            <div className="flex items-center justify-between">
               <div className="text-18-bold lg:text-24-semibold">{title}</div>
               <button
                  onClick={onClose}
                  aria-label={t("closeModal")}
                  ref={firstFocusableRef}
               >
                  <Image
                     src={close}
                     width={36}
                     height={36}
                     alt=""
                     className="h-6 w-6 lg:h-9 lg:w-9"
                  />
               </button>
            </div>
            <div className="py-6.5">{children}</div>
            <SolidButton disabled={!isActive} type="submit">
               {buttonTitle}
            </SolidButton>
         </div>
      </div>
   );
}

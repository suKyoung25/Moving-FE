"use client";

import Image from "next/image";
import React, { useRef } from "react";
import close from "@/assets/images/xIcon.svg";
import SolidButton from "@/components/common/SolidButton";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";

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
   const modalRef = useRef<HTMLDivElement>(null);

   useOutsideClick(modalRef, () => {
      if (!isConfirmOpen) onClose();
   });

   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/50 md:items-center">
         <div
            ref={modalRef}
            className="w-full rounded-t-2xl bg-white px-6 pt-8 pb-10 shadow-lg md:max-w-94 md:rounded-2xl lg:max-w-152"
         >
            <div className="flex items-center justify-between">
               <div className="text-18-bold lg:text-24-semibold">{title}</div>
               <button onClick={onClose}>
                  <Image
                     src={close}
                     width={36}
                     height={36}
                     alt="닫기"
                     className="h-6 w-6 lg:h-9 lg:w-9"
                  />
               </button>
            </div>
            <div className="py-6.5 lg:py-10">{children}</div>
            <SolidButton disabled={!isActive} type="submit">
               {buttonTitle}
            </SolidButton>
         </div>
      </div>
   );
}

import React from "react";
import InfoIcon from "@/assets/images/infoIcon.svg";
import Image from "next/image";

export default function ToastPopup({
   children,
   className,
}: {
   children: React.ReactNode;
   className?: string;
}) {
   return (
      <div
         className={`fixed top-16 left-1/2 z-50 -translate-x-1/2 opacity-100 transition-opacity duration-300 lg:top-[114px] ${className}`}
      >
         <div className="bg-primary-blue-100 outline-primary-blue-300 flex h-12 w-80 items-center justify-start gap-2 rounded-xl px-6 py-2.5 shadow-[2px_2px_10px_0px_rgba(46,46,46,0.04)] outline outline-offset-[-1px] md:w-155 md:gap-4 lg:h-[62px] lg:w-[955px]">
            <Image
               src={InfoIcon}
               alt="토스트 알림"
               className="aspect-square md:w-6"
            />
            <div className="text-primary-blue-300 font-semibold max-md:text-xs">
               {children}
            </div>
         </div>
      </div>
   );
}

"use client";

import { moveTypeOptions } from "@/constants";
import Image from "next/image";
import checkIcon from "@/assets/images/squareActiveIcon.svg";
import uncheckIcon from "@/assets/images/squareDefaultIcon.svg";
import { Props } from "./MoveTypeFilterSidebar";
import xIcon from "@/assets/images/xIcon.svg";
import { useTranslations } from "next-intl";
interface MoveTypeFilterModalProps extends Props {
   isOpen: boolean;
   onClose: () => void;
}

export default function MoveTypeFilterModal({
   moveType,
   onChangeMoveType,
   onToggleAllMoveTypes,
   isAllSelected,
   onToggleDesignated,
   isDesignated,
   isOpen,
   onClose,
}: MoveTypeFilterModalProps) {
   const t = useTranslations("ReceivedRequests");

   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 z-40 flex items-center justify-center lg:hidden">
         {/*  배경 클릭 시 닫힘 */}
         <div className="absolute inset-0 bg-black/50" onClick={onClose} />

         {/* ✨ 모달 박스 */}
         <div className="relative z-40 w-88 rounded-2xl bg-white px-6 py-4 md:w-94">
            {/* 헤더 */}
            <div className="mb-4 flex items-center justify-between">
               <div className="text-18-semibold">{t("modal.title")}</div>
               <button
                  type="button"
                  onClick={onClose}
                  className="text-16-medium text-gray-400"
                  aria-label={t("modal.closeAlt")}
               >
                  <Image src={xIcon} alt={t("modal.closeAlt")} width={24} />
               </button>
            </div>

            {/* 전체 선택 */}
            <div
               className="after:bg-line-200 relative flex cursor-pointer items-center justify-between py-3 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full"
               onClick={onToggleAllMoveTypes}
            >
               <span className="text-16-medium text-gray-300">
                  {t("modal.selectAll")} ({moveTypeOptions.length})
               </span>
               <Image
                  src={isAllSelected ? checkIcon : uncheckIcon}
                  alt={t("modal.selectAllAlt")}
                  width={32}
               />
            </div>

            {/* 항목들 */}
            {moveTypeOptions.map((option) => (
               <div
                  key={option.value}
                  className="after:bg-line-200 relative flex cursor-pointer items-center justify-between py-4 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full"
                  onClick={() => onChangeMoveType(option.value)}
               >
                  <span className="text-16-medium">
                     {t(`moveTypes.${option.value}`)}
                  </span>
                  <Image
                     src={
                        moveType.includes(option.value)
                           ? checkIcon
                           : uncheckIcon
                     }
                     alt={t("modal.singleSelectAlt", {
                        type: t(`moveTypes.${option.value}`),
                     })}
                     width={32}
                  />
               </div>
            ))}

            {/* 지정 견적 요청 */}
            <div
               className="mt-4 flex cursor-pointer items-center justify-between py-4"
               onClick={onToggleDesignated}
            >
               <span className="text-16-medium">
                  {t("modal.onlyDesignated")}
               </span>
               <Image
                  src={isDesignated ? checkIcon : uncheckIcon}
                  alt={t("modal.onlyDesignated")}
                  width={32}
               />
            </div>
         </div>
      </div>
   );
}

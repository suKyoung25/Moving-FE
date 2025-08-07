"use client";

import { moveTypeOptions } from "@/constants";
import Image from "next/image";
import React from "react";
import squareActiveIcon from "@/assets/images/squareActiveIcon.svg";
import squareDefaultIcon from "@/assets/images/squareDefaultIcon.svg";
import { useTranslations } from "next-intl";

export interface Props {
   moveType: string[];
   onChangeMoveType: (value: string) => void;
   onToggleAllMoveTypes: () => void;
   isAllSelected: boolean;
   isDesignated: boolean;
   onToggleDesignated: () => void;
}

export default function MoveTypeFilterSidebar({
   moveType,
   onChangeMoveType,
   onToggleAllMoveTypes,
   isAllSelected,
   isDesignated,
   onToggleDesignated,
}: Props) {
   const t = useTranslations("ReceivedRequests");

   return (
      <aside className="[&_div::after]:bg-line-100 flex w-1/4 flex-col [&_div]:relative [&_div]:py-4 [&_div::after]:absolute [&_div::after]:bottom-0 [&_div::after]:left-0 [&_div::after]:h-px [&_div::after]:w-full [&_div::after]:content-['']">
         <div className="mb-4 flex items-center justify-between">
            <h2 className="text-20-medium">{t("sidebar.moveTypeTitle")}</h2>
            <label
               className="flex cursor-pointer items-center"
               onClick={onToggleAllMoveTypes}
            >
               <Image
                  src={isAllSelected ? squareActiveIcon : squareDefaultIcon}
                  alt={t("sidebar.selectAllAlt")}
                  width={32}
                  height={20}
               />
               <span className="text-18-medium text-gray-300">
                  {t("sidebar.selectAll")}
               </span>
            </label>
         </div>
         {moveTypeOptions.map((option) => (
            <div
               key={option.value}
               className="flex cursor-pointer items-center justify-between"
               onClick={() => onChangeMoveType(option.value)}
            >
               <span className="text-18-medium">
                  {t(`moveTypes.${option.value}`)}
               </span>

               <Image
                  src={
                     moveType.includes(option.value)
                        ? squareActiveIcon
                        : squareDefaultIcon
                  }
                  alt={t("sidebar.singleSelectAlt", {
                     type: t(`moveTypes.${option.value}`),
                  })}
                  width={32}
                  height={20}
               />
            </div>
         ))}
         <div className="my-4">
            <h2 className="text-20-medium">{t("sidebar.filterTitle")}</h2>
         </div>
         <div
            className="flex cursor-pointer items-center justify-between"
            onClick={onToggleDesignated}
         >
            <span className="text-18-medium">
               {t("sidebar.onlyDesignated")}
            </span>
            <Image
               src={isDesignated ? squareActiveIcon : squareDefaultIcon}
               alt={t("sidebar.onlyDesignatedAlt")}
               width={32}
               height={20}
            />
         </div>
      </aside>
   );
}

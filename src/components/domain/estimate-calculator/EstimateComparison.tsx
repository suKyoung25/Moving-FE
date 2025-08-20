import React from "react";
import { FaEquals } from "react-icons/fa6";
import { IoCaretDown, IoCaretUp } from "react-icons/io5";
import LineDivider from "@/components/common/LineDivider";
import { useTranslations } from "next-intl";
import { AIEstimateType, PriceBreakdown } from "@/lib/types";
import { formatPrice } from "@/lib/utils/price.util";

interface EstimateComparisonProps {
   basicEstimate: PriceBreakdown;
   aiEstimate: AIEstimateType | null;
}

export default function EstimateComparison({
   basicEstimate,
   aiEstimate,
}: EstimateComparisonProps) {
   const t = useTranslations("Calculator.comparison");

   if (!aiEstimate) return null;

   const difference = aiEstimate.price - basicEstimate.total;
   const percentDiff = Math.abs((difference / basicEstimate.total) * 100);

   return (
      <section aria-labelledby="comparison-title">
         <LineDivider className="my-8" />
         <h2 id="comparison-title" className="text-18-semibold mb-4">
            {t("title")}
         </h2>
         <div className="mb-4 grid grid-cols-2 gap-4">
            <div
               className="rounded-lg bg-blue-50 p-3 text-center"
               role="region"
               aria-label={t("basic")}
            >
               <p className="text-black-400 mb-1 text-xs">{t("basic")}</p>
               <p className="text-primary-blue-300 text-lg font-bold">
                  {formatPrice(basicEstimate.total)}
                  {t("currency")}
               </p>
            </div>
            <div
               className="bg-primary-blue-500/10 rounded-lg p-3 text-center"
               role="region"
               aria-label={t("ai")}
            >
               <p className="text-black-400 mb-1 text-xs">{t("ai")}</p>
               <p className="text-primary-blue-500 text-lg font-bold">
                  {formatPrice(aiEstimate.price)}
                  {t("currency")}
               </p>
            </div>
         </div>

         <div
            className={`flex flex-col items-center gap-2 rounded-lg p-3 ${
               difference > 0
                  ? "bg-secondary-red-100 text-secondary-red-200"
                  : difference < 0
                    ? "bg-primary-blue-50 text-primary-blue-300"
                    : "text-black-400 bg-gray-50"
            }`}
            role="status"
            aria-live="polite"
            aria-label={`${t("difference")}: ${difference > 0 ? "증가" : difference < 0 ? "감소" : "동일"}`}
         >
            <p className="flex items-center gap-1 text-sm font-medium">
               {difference > 0 ? (
                  <IoCaretUp className="h-4 w-4" aria-hidden="true" />
               ) : difference < 0 ? (
                  <IoCaretDown className="h-4 w-4" aria-hidden="true" />
               ) : (
                  <FaEquals aria-hidden="true" />
               )}
               {difference !== 0 &&
                  ` ${formatPrice(Math.abs(difference))}${t("currency")}`}
               {difference !== 0 && ` (${percentDiff.toFixed(1)}%)`}
            </p>
            <p className="mt-1 text-xs">
               {difference > 0
                  ? t("aiHigher")
                  : difference < 0
                    ? t("aiLower")
                    : t("sameEstimate")}
            </p>
         </div>
      </section>
   );
}

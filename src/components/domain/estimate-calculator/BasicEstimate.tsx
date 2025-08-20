import React from "react";
import { PriceBreakdown } from "@/lib/types";
import LineDivider from "@/components/common/LineDivider";
import { useTranslations } from "next-intl";
import { formatPrice } from "@/lib/utils/price.util";

interface BasicEstimateProps {
   breakdown: PriceBreakdown;
}

export default function BasicEstimate({ breakdown }: BasicEstimateProps) {
   const t = useTranslations("Calculator.estimate");

   return (
      <>
         <h2 className="text-18-semibold mb-4">{t("basicPrice")}</h2>

         <div
            className="from-primary-blue-50 to-primary-blue-100 mb-4 rounded-lg bg-gradient-to-r p-4"
            role="region"
            aria-label={t("basicPrice")}
         >
            <div className="text-center">
               <p className="text-black-400 text-14-regular mb-1">
                  {t("estimatedCost")}
               </p>
               <p className="text-primary-blue-300 text-24-bold">
                  {formatPrice(breakdown.total)}
                  {t("currency")}
               </p>
            </div>
         </div>

         <div
            className="border-line-200 mb-4 rounded-xl border p-4"
            role="region"
            aria-label={t("estimateHistory")}
         >
            <h3 className="text-14-semibold mb-3 text-gray-700">
               {t("estimateHistory")}
            </h3>
            <div className="text-12-regular space-y-2">
               <div className="flex justify-between">
                  <span className="text-black-400">{t("basicFee")}</span>
                  <span>
                     {formatPrice(breakdown.basePrice)}
                     {t("currency")}
                  </span>
               </div>
               <div className="flex justify-between">
                  <span className="text-black-400">{t("distanceFee")}</span>
                  <span>
                     {formatPrice(breakdown.distanceFee)}
                     {t("currency")}
                  </span>
               </div>
               {breakdown.weekendSurcharge > 0 && (
                  <div className="text-primary-blue-500 flex justify-between">
                     <span>{t("weekendSurcharge")}</span>
                     <span>
                        +{formatPrice(breakdown.weekendSurcharge)}
                        {t("currency")}
                     </span>
                  </div>
               )}
               {breakdown.elevatorAdjustment > 0 && (
                  <div className="text-secondary-red-200 flex justify-between">
                     <span>{t("stairSurcharge")}</span>
                     <span>
                        +{formatPrice(breakdown.elevatorAdjustment)}
                        {t("currency")}
                     </span>
                  </div>
               )}
               {breakdown.itemAdjustment > 0 && (
                  <div className="text-secondary-red-200 flex justify-between">
                     <span>{t("itemMany")}</span>
                     <span>
                        +{formatPrice(breakdown.itemAdjustment)}
                        {t("currency")}
                     </span>
                  </div>
               )}
               {breakdown.itemAdjustment < 0 && (
                  <div className="flex justify-between text-teal-500">
                     <span>{t("itemFew")}</span>
                     <span>
                        {formatPrice(breakdown.itemAdjustment)}
                        {t("currency")}
                     </span>
                  </div>
               )}
               {breakdown.floorAdjustment > 0 && (
                  <div className="text-secondary-red-200 flex justify-between">
                     <span>{t("floorSurcharge")}</span>
                     <span>
                        +{formatPrice(breakdown.floorAdjustment)}
                        {t("currency")}
                     </span>
                  </div>
               )}
               <LineDivider />
               <div className="flex justify-between">
                  <span className="text-14-semibold">{t("total")}</span>
                  <span className="text-14-semibold">
                     {formatPrice(breakdown.total)}
                     {t("currency")}
                  </span>
               </div>
            </div>
         </div>
      </>
   );
}

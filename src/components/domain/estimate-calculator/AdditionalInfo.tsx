import React from "react";
import { FormData } from "@/lib/types";
import { IoDocumentText } from "react-icons/io5";
import { FaHome } from "react-icons/fa";
import { FaBuilding, FaCheck } from "react-icons/fa6";
import { useTranslations } from "next-intl";

interface AdditionalInfoProps {
   formData: FormData;
   onInputChange: (
      field: keyof FormData,
      value: string | number | boolean,
   ) => void;
}

export default function AdditionalInfo({
   formData,
   onInputChange,
}: AdditionalInfoProps) {
   const t = useTranslations("Calculator.additionalInfo");

   return (
      <section aria-labelledby="additional-info-title">
         <div className="mb-4 flex items-center gap-2">
            <IoDocumentText className="h-5 w-5" aria-hidden="true" />
            <h2 id="additional-info-title" className="text-18-semibold">
               {t("title")}
            </h2>
         </div>

         <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
               <label
                  htmlFor="elevator-select"
                  className="text-14-medium mb-2 block text-gray-700"
               >
                  {t("elevator")}
               </label>
               <select
                  id="elevator-select"
                  value={formData.hasElevator.toString()}
                  onChange={(e) =>
                     onInputChange("hasElevator", e.target.value === "true")
                  }
                  className="text-14-regular border-line-200 w-full appearance-none rounded-xl border p-3 outline-none"
                  aria-describedby="elevator-info"
               >
                  <option value="true">{t("elevatorYes")}</option>
                  <option value="false">{t("elevatorNo")}</option>
               </select>
               <div
                  id="elevator-info"
                  className="text-12-semibold text-primary-blue-500 mt-2 ml-2 flex items-center gap-1"
                  role="status"
                  aria-live="polite"
               >
                  <FaCheck className="h-3 w-3" aria-hidden="true" />
                  {formData.hasElevator === true
                     ? t("priceInfo.elevatorYes")
                     : t("priceInfo.elevatorNo")}
               </div>
            </div>

            <div>
               <label
                  htmlFor="item-amount-select"
                  className="text-14-medium mb-2 block text-gray-700"
               >
                  {t("itemCount")}
               </label>
               <select
                  id="item-amount-select"
                  value={formData.itemAmount}
                  onChange={(e) => onInputChange("itemAmount", e.target.value)}
                  className="text-14-regular border-line-200 w-full appearance-none rounded-xl border p-3 outline-none"
                  aria-describedby="item-amount-info"
               >
                  <option value="few">{t("itemCountFew")}</option>
                  <option value="normal">{t("itemCountMedium")}</option>
                  <option value="many">{t("itemCountMany")}</option>
               </select>
               <div
                  id="item-amount-info"
                  className="text-12-semibold text-primary-blue-500 mt-2 ml-2 flex items-center gap-1"
                  role="status"
                  aria-live="polite"
               >
                  <FaCheck className="h-3 w-3" aria-hidden="true" />
                  {formData.itemAmount === "few"
                     ? t("priceInfo.itemCountFew")
                     : formData.itemAmount === "normal"
                       ? t("priceInfo.itemCountMedium")
                       : t("priceInfo.itemCountMany")}
               </div>
            </div>

            <div>
               <label
                  htmlFor="floor-level-select"
                  className="text-14-medium mb-2 block text-gray-700"
               >
                  {t("floor")}
               </label>
               <select
                  id="floor-level-select"
                  value={formData.floorLevel}
                  onChange={(e) => onInputChange("floorLevel", e.target.value)}
                  className="text-14-regular border-line-200 w-full appearance-none rounded-xl border p-3 outline-none"
                  aria-describedby="floor-level-info"
               >
                  <option value="1-3">{t("floor1-3")}</option>
                  <option value="4-7">{t("floor4-7")}</option>
                  <option value="8+">{t("floor8+")}</option>
               </select>
               <div
                  id="floor-level-info"
                  className="text-12-semibold text-primary-blue-500 mt-2 ml-2 flex items-center gap-1"
                  role="status"
                  aria-live="polite"
               >
                  <FaCheck className="h-3 w-3" aria-hidden="true" />
                  {formData.floorLevel === "1-3"
                     ? t("priceInfo.floor1-3")
                     : formData.floorLevel === "4-7"
                       ? t("priceInfo.floor4-7")
                       : t("priceInfo.floor8+")}
               </div>
            </div>

            <div>
               <label className="text-14-medium mb-2 block text-gray-700">
                  {t("moveDate")}
               </label>
               <div
                  className="flex gap-2"
                  role="radiogroup"
                  aria-label="이사 날짜 선택"
               >
                  <div className="w-1/2">
                     <button
                        type="button"
                        onClick={() => onInputChange("isWeekend", false)}
                        className={`text-14-medium w-full flex-1 rounded-xl border py-3 ${
                           !formData.isWeekend
                              ? "border-primary-blue-300 bg-primary-blue-50"
                              : "border-line-200 bg-white hover:bg-gray-50"
                        }`}
                        role="radio"
                        aria-checked={!formData.isWeekend}
                        aria-describedby="weekday-info"
                     >
                        <div className="flex items-center justify-center gap-2">
                           <FaBuilding className="h-3.5" aria-hidden="true" />
                           {t("weekday")}
                        </div>
                     </button>
                     {formData.isWeekend !== undefined &&
                        !formData.isWeekend && (
                           <div
                              id="weekday-info"
                              className="text-12-semibold text-primary-blue-500 mt-2 ml-2 flex items-center gap-1"
                              role="status"
                              aria-live="polite"
                           >
                              <FaCheck className="h-3 w-3" aria-hidden="true" />
                              {t("priceInfo.weekday")}
                           </div>
                        )}
                  </div>

                  <div className="w-1/2">
                     <button
                        type="button"
                        onClick={() => onInputChange("isWeekend", true)}
                        className={`text-14-medium w-full flex-1 rounded-xl border py-3 ${
                           formData.isWeekend
                              ? "border-primary-blue-300 bg-primary-blue-50"
                              : "border-line-200 bg-white hover:bg-gray-50"
                        }`}
                        role="radio"
                        aria-checked={formData.isWeekend}
                        aria-describedby="weekend-info"
                     >
                        <div className="flex items-center justify-center gap-2">
                           <FaHome className="h-4.5 w-4" aria-hidden="true" />
                           {t("weekend")}
                        </div>
                     </button>
                     {formData.isWeekend !== undefined &&
                        formData.isWeekend && (
                           <div
                              id="weekend-info"
                              className="text-12-semibold text-primary-blue-500 mt-2 ml-2 flex items-center gap-1"
                              role="status"
                              aria-live="polite"
                           >
                              <FaCheck className="h-3 w-3" aria-hidden="true" />
                              {t("priceInfo.weekend")}
                           </div>
                        )}
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}

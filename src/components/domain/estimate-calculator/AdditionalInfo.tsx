import React from "react";
import { FormData } from "@/lib/types";
import { IoDocumentText } from "react-icons/io5";
import { FaHome } from "react-icons/fa";
import { FaBuilding, FaCheck } from "react-icons/fa6";
import { itemAmountLabels, floorLevelLabels } from "@/lib/utils";

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
   return (
      <section>
         <div className="mb-4 flex items-center gap-2">
            <IoDocumentText className="h-5 w-5" />
            <h2 className="text-18-semibold">추가 정보</h2>
         </div>

         <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
               <label className="text-14-medium mb-2 block text-gray-700">
                  엘리베이터 여부
               </label>
               <select
                  value={formData.hasElevator.toString()}
                  onChange={(e) =>
                     onInputChange("hasElevator", e.target.value === "true")
                  }
                  className="text-14-regular border-line-200 w-full appearance-none rounded-xl border p-3 outline-none"
               >
                  <option value="true">엘리베이터 있음</option>
                  <option value="false">계단 이용</option>
               </select>
               <div className="text-12-semibold text-primary-blue-500 mt-2 ml-2 flex items-center gap-1">
                  <FaCheck className="h-3 w-3" />
                  {formData.hasElevator === true
                     ? "기본 요금 적용"
                     : "할증료 15% 적용"}
               </div>
            </div>

            <div>
               <label className="text-14-medium mb-2 block text-gray-700">
                  짐의 양
               </label>
               <select
                  value={formData.itemAmount}
                  onChange={(e) => onInputChange("itemAmount", e.target.value)}
                  className="text-14-regular border-line-200 w-full appearance-none rounded-xl border p-3 outline-none"
               >
                  <option value="few">
                     {itemAmountLabels.few} (최소한의 짐)
                  </option>
                  <option value="normal">
                     {itemAmountLabels.normal} (일반적인 양)
                  </option>
                  <option value="many">
                     {itemAmountLabels.many} (많은 가구/짐)
                  </option>
               </select>
               <div className="text-12-semibold text-primary-blue-500 mt-2 ml-2 flex items-center gap-1">
                  <FaCheck className="h-3 w-3" />
                  {formData.itemAmount === "few"
                     ? "할인료 20% 적용"
                     : formData.itemAmount === "normal"
                       ? "기본 요금 적용"
                       : "할증료 30% 적용"}
               </div>
            </div>

            <div>
               <label className="text-14-medium mb-2 block text-gray-700">
                  층수
               </label>
               <select
                  value={formData.floorLevel}
                  onChange={(e) => onInputChange("floorLevel", e.target.value)}
                  className="text-14-regular border-line-200 w-full appearance-none rounded-xl border p-3 outline-none"
               >
                  <option value="1-3">{floorLevelLabels["1-3"]}</option>
                  <option value="4-7">{floorLevelLabels["4-7"]}</option>
                  <option value="8+">{floorLevelLabels["8+"]}</option>
               </select>
               <div className="text-12-semibold text-primary-blue-500 mt-2 ml-2 flex items-center gap-1">
                  <FaCheck className="h-3 w-3" />
                  {formData.floorLevel === "1-3"
                     ? "기본 요금 적용"
                     : formData.floorLevel === "4-7"
                       ? "할증료 10% 적용"
                       : "할증료 20% 적용"}
               </div>
            </div>

            <div>
               <label className="text-14-medium mb-2 block text-gray-700">
                  이사 날짜
               </label>
               <div className="flex gap-2">
                  <div className="w-1/2">
                     <button
                        type="button"
                        onClick={() => onInputChange("isWeekend", false)}
                        className={`text-14-medium w-full flex-1 rounded-xl border py-3 ${
                           !formData.isWeekend
                              ? "border-primary-blue-300 bg-primary-blue-50"
                              : "border-line-200 bg-white hover:bg-gray-50"
                        }`}
                     >
                        <div className="flex items-center justify-center gap-2">
                           <FaBuilding className="h-3.5" />
                           평일
                        </div>
                     </button>
                     {formData.isWeekend !== undefined &&
                        !formData.isWeekend && (
                           <div className="text-12-semibold text-primary-blue-500 mt-2 ml-2 flex items-center gap-1">
                              <FaCheck className="h-3 w-3" />
                              기본 요금 적용
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
                     >
                        <div className="flex items-center justify-center gap-2">
                           <FaHome className="h-4.5 w-4" />
                           주말
                        </div>
                     </button>
                     {formData.isWeekend !== undefined &&
                        formData.isWeekend && (
                           <div className="text-12-semibold text-primary-blue-500 mt-2 ml-2 flex items-center gap-1">
                              <FaCheck className="h-3 w-3" />
                              할증료 20% 적용
                           </div>
                        )}
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}

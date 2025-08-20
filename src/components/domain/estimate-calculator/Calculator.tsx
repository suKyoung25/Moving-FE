"use client";

import React, { useState, useCallback } from "react";
import { HiCalculator } from "react-icons/hi";
import { FormData, AIEstimateType } from "@/lib/types";
import { generateAIEstimate } from "@/lib/api/estimate-calculator/requests/generateAIEstimate";
import MoveTypeSelector from "./MoveTypeSelector";
import AddressInput from "./AddressInput";
import AdditionalInfo from "./AdditionalInfo";
import BasicEstimate from "./BasicEstimate";
import AIEstimate from "./AIEstimate";
import EstimateComparison from "./EstimateComparison";
import InfoFooter from "./InfoFooter";
import gptIcon from "@/assets/images/gptIcon.svg";
import Image from "next/image";
import LineDivider from "@/components/common/LineDivider";
import { useToast } from "@/context/ToastContext";
import { useTranslations } from "next-intl";
import { calculateBasicEstimate } from "@/lib/utils/price.util";

export default function Calculator() {
   const t = useTranslations("Calculator");
   const [formData, setFormData] = useState<FormData>({
      moveType: "",
      fromAddress: "",
      toAddress: "",
      moveDate: "",
      isWeekend: false,
      hasElevator: true,
      itemAmount: "normal",
      floorLevel: "1-3",
   });

   const [distance, setDistance] = useState<number>(0);
   const [aiEstimate, setAiEstimate] = useState<AIEstimateType | null>(null);
   const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
   const { showError } = useToast();

   const handleAddressChange = useCallback(
      (field: "fromAddress" | "toAddress", value: string) => {
         setFormData((prev) => ({ ...prev, [field]: value }));
      },
      [],
   );

   const handleDistanceChange = useCallback((newDistance: number) => {
      setDistance(newDistance);
   }, []);

   const handleInputChange = (
      field: keyof FormData,
      value: string | number | boolean,
   ) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
   };

   const handleGenerateAIEstimate = async () => {
      if (!formData.moveType || !distance) return;

      setIsGeneratingAI(true);
      try {
         const estimate = await generateAIEstimate(formData, distance);
         setAiEstimate(estimate);
      } catch {
         showError(t("estimate.error"));
      } finally {
         setIsGeneratingAI(false);
      }
   };

   const basicEstimate = calculateBasicEstimate(formData, distance);
   const isFormComplete =
      formData.moveType &&
      formData.fromAddress &&
      formData.toAddress &&
      distance > 0;

   return (
      <div
         className="mx-4 min-h-screen max-w-6xl px-4 py-8 md:mx-auto md:px-10"
         role="main"
         aria-labelledby="calculator-title"
      >
         <form
            className="grid grid-cols-1 gap-6 lg:mb-8 lg:grid-cols-[2fr_1fr]"
            role="form"
            aria-label="견적 계산기 폼"
         >
            <div className="space-y-6" role="group" aria-label="입력 정보">
               <MoveTypeSelector
                  selected={formData.moveType}
                  onTypeSelect={(type) => handleInputChange("moveType", type)}
               />

               <AddressInput
                  fromAddress={formData.fromAddress}
                  toAddress={formData.toAddress}
                  distance={distance}
                  onAddressChange={handleAddressChange}
                  onDistanceChange={handleDistanceChange}
               />

               <AdditionalInfo
                  formData={formData}
                  onInputChange={handleInputChange}
               />
            </div>

            <LineDivider className="my-2 lg:hidden" />

            <div className="space-y-6" role="group" aria-label="견적 결과">
               <div>
                  {isFormComplete ? (
                     <BasicEstimate breakdown={basicEstimate} />
                  ) : (
                     <>
                        <h2 className="text-18-semibold mb-4">
                           {t("basicEstimate")}
                        </h2>
                        <div
                           className="border-line-200 flex flex-col items-center gap-4 rounded-xl border py-8 text-gray-500"
                           role="status"
                           aria-live="polite"
                        >
                           <HiCalculator
                              className="text-black-100 mx-auto mb-3 h-12 w-12"
                              aria-hidden="true"
                           />
                           <p className="text-14-regular text-center">
                              {t("basicEstimateGuide1")}
                              <br />
                              {t("basicEstimateGuide2")}
                           </p>
                        </div>
                     </>
                  )}
               </div>

               <div>
                  {isFormComplete ? (
                     <AIEstimate
                        aiQuote={aiEstimate}
                        isLoading={isGeneratingAI}
                        onGenerate={handleGenerateAIEstimate}
                     />
                  ) : (
                     <>
                        <h2 className="text-18-semibold mb-4">
                           {t("aiEstimate")}
                        </h2>
                        <div
                           className="border-line-200 flex flex-col items-center gap-4 rounded-xl border py-8 text-gray-500"
                           role="status"
                           aria-live="polite"
                        >
                           <Image
                              src={gptIcon}
                              alt="gptIcon"
                              width={48}
                              height={48}
                           />
                           <p className="text-14-regular text-center">
                              {t("aiEstimateGuide1")}
                              <br />
                              {t("aiEstimateGuide2")}
                           </p>
                        </div>
                     </>
                  )}
               </div>
            </div>
         </form>

         {isFormComplete && aiEstimate && (
            <EstimateComparison
               basicEstimate={basicEstimate}
               aiEstimate={aiEstimate}
            />
         )}

         <LineDivider className="my-8" />
         <InfoFooter />
      </div>
   );
}

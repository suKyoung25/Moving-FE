"use client";

import React from "react";
import ProfileImage from "@/components/domain/profile/ProfileImage";
import ProfileFieldButton from "@/components/domain/profile/ProfileFieldButton";
import ClientProfileTitle from "./ClientProfileTitle";
import SolidButton from "../../common/SolidButton";
import { moveType, regions } from "@/constants";
import useClientProfilePostForm from "@/lib/hooks/useClientProfilePostForm";

export default function ClientProfilePostForm() {
   // ✅ 함수 등 모음
   const {
      isDisabled,
      isLoading,
      selectedServices,
      selectedRegions,
      handleServiceToggle,
      handleRegionToggle,
      onSubmit,
   } = useClientProfilePostForm();

   return (
      <form>
         {/* ✅ 이미지 */}
         <ProfileImage />

         <hr className="border-line-100 mb-5 lg:mb-8" />

         {/* ✅ 이용 서비스 */}
         <section>
            <ClientProfileTitle type="서비스" />

            {moveType.map((service) => (
               <ProfileFieldButton
                  category="서비스"
                  name="serviceType"
                  key={service}
                  value={service}
                  isSelected={selectedServices.includes(service)}
                  onClick={() => handleServiceToggle(service)}
               >
                  {service}
               </ProfileFieldButton>
            ))}
         </section>

         <hr className="border-line-100 mb-5 lg:mb-8" />

         {/* ✅ 내가 사는 지역 */}
         <section className="mb-8 lg:mb-14">
            <ClientProfileTitle type="지역" />

            <div className="grid w-70 grid-cols-5 gap-x-2 gap-y-3 lg:w-104 lg:gap-x-3.5 lg:gap-y-4.5">
               {regions.map((region) => (
                  <ProfileFieldButton
                     category="지역"
                     name="livingArea"
                     key={region}
                     value={region}
                     isSelected={selectedRegions.includes(region)}
                     onClick={() => handleRegionToggle(region)}
                  >
                     {region}
                  </ProfileFieldButton>
               ))}
            </div>
         </section>

         {/* ✅ 제출 버튼 */}
         <SolidButton disabled={isDisabled} onClick={onSubmit}>
            {isLoading ? "로딩 중..." : "시작하기"}
         </SolidButton>
      </form>
   );
}

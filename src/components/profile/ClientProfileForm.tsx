"use client";

import React, { useActionState, useEffect, useState } from "react";
import ProfileImage from "@/components/profile/ProfileImage";
import ProfileFieldButton from "@/components/profile/ProfileFieldButton";
import ClientProfileTitle from "./ClientProfileTitle";
import SolidButton from "../common/buttons/SolidButton";
import createClientProfile from "@/lib/actions/profile/create-client-profile.action";
import { moveType, regions } from "@/constants";
import { useRouter } from "next/navigation";

export default function ClientProfileForm() {
   // 상태 모음
   const router = useRouter();
   const [formState, formAction, isPending] = useActionState(
      createClientProfile,
      null,
   );
   const [selectedServices, setSelectedServices] = useState<string[]>([]);
   const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

   // 이용 서비스 선택
   const handleServiceToggle = (service: string) => {
      setSelectedServices((prev) =>
         prev.includes(service)
            ? prev.filter((s) => s !== service)
            : [...prev, service],
      );
   };

   // 내가 사는 지역 선택
   const handleRegionToggle = (region: string) => {
      setSelectedRegions((prev) =>
         prev.includes(region)
            ? prev.filter((r) => r !== region)
            : [...prev, region],
      );
   };

   // 버튼 비활성화 여부
   const isDisabled =
      isPending ||
      (selectedServices.length === 0 && selectedRegions.length === 0);

   // 프로필 생성 성공하면 mover-search로 이동
   useEffect(() => {
      if (formState?.success) {
         router.replace("/mover-search");
      }
   }, [formState?.success, router]);

   // 반환
   return (
      <form action={formAction} onSubmit={() => console.log("반환되는 중")}>
         {/* 이미지 */}
         <ProfileImage />

         <hr className="border-line-100 mb-5 lg:mb-8" />

         {/* 이용 서비스 */}
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

         {/* 내가 사는 지역 */}
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

         {/* 제출 버튼 */}
         <SolidButton type="submit" disabled={isDisabled}>
            {isPending ? "로딩 중..." : "시작하기"}
         </SolidButton>
      </form>
   );
}

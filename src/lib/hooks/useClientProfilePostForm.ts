import { useState } from "react";
import { useRouter } from "next/navigation";
import { tokenFetch } from "../utils/fetch-client";
import { MOVE_TYPES } from "@/constants";

export default function useClientProfilePostForm() {
   // ✅ 상태 모음
   const router = useRouter();
   const [selectedServices, setSelectedServices] = useState<string[]>([]);
   const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
   const [isLoading, setIsLoading] = useState(false);

   // ✅ 이용 서비스 선택
   const handleServiceToggle = (service: string) => {
      setSelectedServices((prev) => {
         const isSelected = prev.includes(service);

         return isSelected
            ? prev.filter((s) => s !== service)
            : [...prev, service];
      });
   };

   // ✅ 내가 사는 지역 선택
   const handleRegionToggle = (region: string) => {
      setSelectedRegions((prev) => {
         const isSelected = prev.includes(region);

         return isSelected
            ? prev.filter((r) => r !== region)
            : [...prev, region];
      });
   };

   // ✅ 버튼 활성화 여부: 나중에 이미지 조건도 넣어야 함
   const isDisabled =
      isLoading ||
      (selectedServices.length === 0 && selectedRegions.length === 0);

   // ✅ 보낼 자료
   const payload = {
      // profileImage: profileImage,
      serviceType: selectedServices.map(
         (type) => MOVE_TYPES[type as keyof typeof MOVE_TYPES],
      ),
      livingArea: selectedRegions,
   };

   // ✅ api 호출하고 프로필 생성 성공하면 mover-search로 이동: 이미지 부분 수정해야 함
   const onSubmit = async () => {
      setIsLoading(true);

      try {
         await tokenFetch("/profile/clients", {
            method: "PATCH",
            body: JSON.stringify(payload),
         });
         router.replace("/mover-search");
      } catch (error) {
         console.error("일반 프로필 등록 실패: ", error);
      } finally {
         setIsLoading(false);
      }
   };

   return {
      isLoading,
      isDisabled,
      selectedServices,
      selectedRegions,
      handleServiceToggle,
      handleRegionToggle,
      onSubmit,
   };
}

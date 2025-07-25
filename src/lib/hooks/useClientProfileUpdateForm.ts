import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MOVE_TYPES } from "@/constants";
import { AuthFetchError } from "../types";
import {
   clientProfileUpdateSchema,
   ClientProfileUpdateValue,
} from "../schemas";
import updateClientProfile from "../api/auth/requests/updateClientProfile";

export default function useClientProfileUpdateForm() {
   // ✅ 상태 모음
   const router = useRouter();
   const { user } = useAuth();
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

   // ✅ react-hook-form
   const {
      register,
      handleSubmit,
      setError,
      formState: { errors, isValid },
   } = useForm({
      mode: "onChange",
      resolver: zodResolver(clientProfileUpdateSchema),
      defaultValues: {
         name: user?.name,
         email: user?.email,
         phone: user?.phone,
      },
   });

   // ✅ api 호출하고 프로필 생성 성공하면 mover-search로 이동: 이미지 부분 수정해야 함
   const onSubmit = async (formData: ClientProfileUpdateValue) => {
      try {
         setIsLoading(true);

         const payload = {
            ...formData,
            // profileImage: profileImage,
            serviceType: selectedServices.map(
               (type) => MOVE_TYPES[type as keyof typeof MOVE_TYPES],
            ),
            livingArea: selectedRegions,
         };

         await updateClientProfile(payload);

         router.replace("/mover-search");
      } catch (error) {
         console.error("일반 프로필 수정 실패: ", error);

         // 서버 오류 처리
         const customError = error as AuthFetchError;

         if (customError?.status) {
            Object.entries(customError.body.data!).forEach(([key, message]) => {
               setError(key as keyof ClientProfileUpdateValue, {
                  type: "server",
                  message: String(message),
               });
            });
         } else {
            console.error("예기치 못한 오류 발생: ", customError?.body.message);
         }
      } finally {
         setIsLoading(false);
      }
   };

   return {
      register,
      errors,
      isValid,
      isLoading,
      selectedServices,
      selectedRegions,
      handleServiceToggle,
      handleRegionToggle,
      onSubmit,
      handleSubmit,
   };
}

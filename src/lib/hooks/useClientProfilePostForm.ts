"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MOVE_TYPES } from "@/constants";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { ClientProfilePostSchema, ClientProfilePostValue } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import updateProfileImage from "../api/auth/requests/updateProfileImage";
import updateClientProfile from "../api/auth/requests/updateClientProfile";
import { AuthFetchError } from "../types";

export default function useClientProfilePostForm() {
   // ✅ 상태 모음
   const router = useRouter();
   const [selectedServices, setSelectedServices] = useState<string[]>([]);
   const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const { refreshUser } = useAuth();

   // react-hook-form
   const {
      handleSubmit,
      setError,
      control,
      formState: { errors, isValid },
   } = useForm<ClientProfilePostValue>({
      resolver: zodResolver(ClientProfilePostSchema),
      mode: "onChange",
   });

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

   // ✅ api 호출하고 프로필 생성 성공하면 mover-search로 이동: 이미지 부분 수정해야 함
   const onSubmit = async (data: ClientProfilePostValue) => {
      setIsLoading(true);

      try {
         // 1. 이미지가 있으면 먼저 업로드
         let imageUrl: string | undefined;

         if (data.profileImage instanceof File) {
            const formData = new FormData();
            formData.append("image", data.profileImage);

            const res = await updateProfileImage(formData);

            imageUrl = res.url;
         }

         // 2. 보낼 자료
         const payload = {
            ...data,
            profileImage: imageUrl, // 이미지 경로 or undefined를 DB에 저장
            serviceType: selectedServices.map(
               (type) => MOVE_TYPES[type as keyof typeof MOVE_TYPES],
            ),
            livingArea: selectedRegions,
         };

         const res = await updateClientProfile(payload);

         if (res.isProfileCompleted) {
            alert("프로필이 등록되었습니다.");

            // user 상태 즉각 반영
            refreshUser();
            router.replace("/mover-search");
         }
      } catch (error) {
         console.error("일반 프로필 등록 실패: ", error);

         // 오류 처리: 객체로
         const customError = error as AuthFetchError;

         if (customError?.status) {
            Object.entries(customError.body.data!).forEach(([key, message]) => {
               setError(key as keyof ClientProfilePostValue, {
                  type: "server",
                  message: String(message),
               });
            });
         } else {
            console.error("예기치 못한 에러: ", customError?.body.message);
         }
      } finally {
         setIsLoading(false);
      }
   };

   return {
      isValid,
      isLoading,
      selectedServices,
      selectedRegions,
      handleServiceToggle,
      handleRegionToggle,
      onSubmit,
      handleSubmit,
      control,
      errors,
   };
}

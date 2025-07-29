"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthFetchError, Client, ClientMoveType } from "../types";
import {
   clientProfileUpdateSchema,
   ClientProfileUpdateValue,
} from "../schemas";
import updateClientProfile from "../api/auth/requests/updateClientProfile";
import { MOVE_TYPES, serviceTypeMap } from "@/constants";
import { labelToEnumMap } from "../utils/profile.util";

export default function useClientProfileUpdateForm() {
   // ✅ 상태 모음
   const router = useRouter();
   const { user, refreshUser } = useAuth();
   const [selectedServices, setSelectedServices] = useState<string[]>([]);
   const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [isInitialized, setIsInitialized] = useState(false); // 선택 초기화

   // ✅ react-hook-form
   const {
      register,
      handleSubmit,
      setError,
      setValue,
      formState: { errors, isValid },
   } = useForm({
      mode: "onChange",
      resolver: zodResolver(clientProfileUpdateSchema),
      defaultValues: {
         name: user?.name,
         email: user?.email,
         phone: user?.phone,
         newPasswordConfirmation: "",
         serviceType: [],
         livingArea: [],
      },
   });

   // ✅ 버튼 초깃값 선택되어 있게
   useEffect(() => {
      if (user && !isInitialized) {
         // 기본 정보 설정
         setValue("name", user.name || "");
         setValue("email", user.email || "");
         setValue("phone", user.phone || "");

         if (user?.userType === "client") {
            const client = user as Client;

            // 이용 서비스 BE -> FE로 이름 변환 (HOME -> 가정이사)
            const convertedServices = client.serviceType
               .map((type) => serviceTypeMap[type as ClientMoveType])
               .filter(Boolean);

            // 그리고 또 변환
            const enumServices = convertedServices
               .map((label) => labelToEnumMap[label])
               .filter((v): v is ClientMoveType => !!v);

            setSelectedServices(convertedServices);
            setSelectedRegions(client.livingArea);

            // react-hook-form에도 설정
            setValue("serviceType", enumServices);
            setValue("livingArea", client.livingArea);
         }

         setIsInitialized(true);
      }
   }, [user, setValue, isInitialized]);

   // ✅ 이용 서비스 선택
   const handleServiceToggle = (service: string) => {
      setSelectedServices((prev) => {
         const isSelected = prev?.includes(service);

         // 선택
         const newServices = isSelected
            ? prev.filter((s) => s !== service)
            : [...prev, service];

         // 가정이사 -> HOME
         const enumServices = newServices
            .map((label) => labelToEnumMap[label])
            .filter((v): v is ClientMoveType => !!v);

         // react-hook-form에 업데이트
         setValue("serviceType", enumServices, { shouldValidate: true });

         return newServices;
      });
   };

   // ✅ 내가 사는 지역 선택
   const handleRegionToggle = (region: string) => {
      setSelectedRegions((prev) => {
         const isSelected = prev?.includes(region);
         const newRegions = isSelected
            ? prev.filter((r) => r !== region)
            : [...prev, region];

         // react-hook-form에 업데이트
         setValue("livingArea", newRegions, { shouldValidate: true });

         return newRegions;
      });
   };

   // ✅ api 호출하고 프로필 생성 성공하면 mover-search로 이동: 이미지 부분 수정해야 함
   const onSubmit = async (formData: ClientProfileUpdateValue) => {
      try {
         setIsLoading(true);

         const payload = {
            ...formData,
            // profileImage: profileImage,
            serviceType: selectedServices
               .map((label) => labelToEnumMap[label])
               .filter(Boolean) as ClientMoveType[],
            livingArea: selectedRegions,
         };

         await updateClientProfile(payload);

         // user 상태 즉각 반영
         if (refreshUser) {
            await refreshUser();
         }

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

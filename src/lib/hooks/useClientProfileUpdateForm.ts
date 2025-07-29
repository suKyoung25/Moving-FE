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
import { serviceTypeMap } from "@/constants";
import { labelToEnumMap } from "../utils/profile.util";
import clientProfile from "../api/auth/requests/updateClientProfile";
import { MoveType } from "../types/client.types";

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
      watch,
      control,
      formState: { errors, isValid },
   } = useForm<ClientProfileUpdateValue>({
      mode: "onChange",
      resolver: zodResolver(clientProfileUpdateSchema),
      defaultValues: {
         name: user?.name,
         email: user?.email,
         phone: user?.phone,
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
   const handleServiceToggle = (service: MoveType) => {
      const current = watch("serviceType") || [];

      const updated = current.includes(service)
         ? current.filter((s) => s !== service)
         : [...current, service];

      setValue("serviceType", updated, { shouldValidate: true });
   };
   // ✅ 내가 사는 지역 선택
   const handleRegionToggle = (region: string) => {
      const current = watch("livingArea") || [];

      const updated = current.includes(region)
         ? current.filter((r) => r !== region)
         : [...current, region];

      setValue("livingArea", updated, { shouldValidate: true });
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

         await clientProfile.update(payload);

         // ✅ user 상태 즉각 반영
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
      watch,
      control,
   };
}

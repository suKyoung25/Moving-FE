"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthFetchError, Client, User } from "../types";
import {
   ClientProfileUpdateValue,
   updateClientProfileSchema,
} from "../schemas";
import clientProfile from "../api/auth/requests/updateClientProfile";
import { ServiceType } from "../types/client.types";
import updateProfileImage from "../api/auth/requests/updateProfileImage";
import { useToast } from "@/context/ToastConText";

export default function useClientProfileUpdateForm() {
   // ✅ 상태 모음
   const router = useRouter();
   const { user, refreshUser } = useAuth();
   const [isLoading, setIsLoading] = useState(false);
   const { showSuccess } = useToast();

   // ✅ 초깃값 보존 용도 기본값
   function getInitialValues(user: User | null): ClientProfileUpdateValue {
      if (user?.userType === "client") {
         const client = user as Client;
         return {
            name: client.name ?? "",
            phone: client.phone ?? "",
            profileImage: client.profileImage ?? "",
            serviceType: client.serviceType ?? [],
            livingArea: client.livingArea ?? [],
         };
      }

      return {
         name: "",
         phone: "",
         profileImage: "",
         serviceType: [],
         livingArea: [],
      };
   }

   const initialValues = useMemo<ClientProfileUpdateValue>(
      () => getInitialValues(user),
      [user],
   );

   // ✅ react-hook-form
   const {
      register,
      handleSubmit,
      setError,
      setValue,
      watch,
      control,
      formState: { errors, isValid },
      reset,
   } = useForm<ClientProfileUpdateValue>({
      mode: "onChange",
      resolver: zodResolver(updateClientProfileSchema(user?.provider)),
   });

   // ✅ 이용 서비스 선택
   const handleServiceToggle = (service: ServiceType) => {
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

   // ✅ 프로필 등록 -> 프로필 수정 페이지로 처음 이동하면 지역이 안 나와서 reset으로 useEffect 걺
   useEffect(() => {
      reset(initialValues);
   }, [initialValues, reset]);

   // ✅ api 호출하고 프로필 생성 성공하면 mover-search로 이동: 이미지 부분 수정해야 함
   const onSubmit = async (data: ClientProfileUpdateValue) => {
      setIsLoading(true);

      try {
         // 1. 이미지가 있으면 먼저 업로드
         let imageUrl: string | undefined;

         if (data.profileImage instanceof File) {
            const formData = new FormData();
            formData.append("image", data.profileImage);

            const res = await updateProfileImage(formData);
            imageUrl = res.url;
         } else {
            imageUrl = data.profileImage; // 타입 = string
         }

         // 2. 보낼 자료
         const payload = {
            ...data,
            profileImage: imageUrl, // 업로드된 이미지 URL 또는 undefined
            serviceType: watch("serviceType") || [],
            livingArea: watch("livingArea") || [],
         };

         await clientProfile.update(payload);
         showSuccess("프로필이 수정되었습니다."); // 알림 모달

         // Toast 알림과 상태 안 겹치게 User 상태 즉각 반영
         setTimeout(async () => {
            await refreshUser();
            setTimeout(() => {
               router.replace("/mover-search");
            }, 500);
         }, 1500);
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
      handleServiceToggle,
      handleRegionToggle,
      onSubmit,
      handleSubmit,
      watch,
      control,
   };
}

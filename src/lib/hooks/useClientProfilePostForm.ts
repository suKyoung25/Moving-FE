"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { ClientProfilePostValue, useClientProfileSchemas } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadToCloudinary } from "../api/auth/requests/updateProfileImage";
import { AuthFetchError } from "../types";
import { ServiceType } from "../types/client.types";
import clientProfile from "../api/auth/requests/updateClientProfile";
import { tokenSettings } from "../utils";
import { useToast } from "@/context/ToastContext";
import { useTranslations } from "next-intl";
import { base64ToFile } from "../utils/profile.util";

export default function useClientProfilePostForm() {
   const t = useTranslations("Profile");

   // ✅ 상태 모음
   const router = useRouter();
   const [isLoading, setIsLoading] = useState(false);
   const { refreshUser } = useAuth();
   const { showSuccess, showError } = useToast();
   const { clientProfilePostSchema } = useClientProfileSchemas();

   // react-hook-form
   const {
      handleSubmit,
      setError,
      setValue,
      watch,
      control,
      formState: { errors, isValid },
   } = useForm<ClientProfilePostValue>({
      resolver: zodResolver(clientProfilePostSchema),
      mode: "onChange",
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

   // ✅ api 호출하고 프로필 생성 성공하면 mover-search로 이동: 이미지 부분 수정해야 함
   const onSubmit = async (data: ClientProfilePostValue) => {
      setIsLoading(true);

      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 이미지 사이즈 제한 10MB

      try {
         // 1. 이미지가 있으면 먼저 업로드
         let imageUrl: string | undefined;

         if (
            typeof data.profileImage === "string" &&
            data.profileImage.startsWith("data:image")
         ) {
            // Base64 문자열이면 File 객체로 변환 후 업로드
            const file = base64ToFile(data.profileImage, "cropped.png");
            if (file.size > MAX_FILE_SIZE) {
               showError(
                  "이미지 크기가 10MB를 초과했습니다. 다른 이미지를 사용해 주세요",
               );
               setIsLoading(false);
               return;
            }

            // Cloudinary 직접 업로드
            const uploadResult = await uploadToCloudinary(file);
            imageUrl = uploadResult.secure_url;

            // //AWS s3의 경우
            // const formData = new FormData();
            // formData.append("image", data.profileImage);
            // const res = await updateProfileImage(formData);
            // imageUrl = res.url;
         }

         // 2. 보낼 자료
         const payload = {
            profileImage: imageUrl, // 이미지 경로 or undefined를 DB에 저장
            serviceType: watch("serviceType") || [],
            livingArea: watch("livingArea") || [],
         };

         const res = await clientProfile.post(payload);

         if (res.data.isProfileCompleted) {
            // 토큰 넣음
            if (res.data.accessToken) {
               tokenSettings.set(res.data.accessToken);
            }

            // 알림
            showSuccess(t("profileRegistered"));

            // Toast 알림과 상태 안 겹치게 User 상태 즉각 반영
            setTimeout(async () => {
               await refreshUser();
               setTimeout(() => {
                  router.replace("/mover-search");
               }, 100);
            }, 1500);
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
            console.error("예기치 못한 오류 발생: ", customError?.body.message);
         }
      } finally {
         setIsLoading(false);
      }
   };

   return {
      isValid,
      isLoading,
      handleServiceToggle,
      handleRegionToggle,
      onSubmit,
      handleSubmit,
      control,
      errors,
      watch,
   };
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthFetchError, Client, User } from "../types";
import { ClientProfileUpdateValue, useClientProfileSchemas } from "../schemas";
import clientProfile from "../api/auth/requests/updateClientProfile";
import { ServiceType } from "../types/client.types";
import { uploadToCloudinary } from "../api/auth/requests/updateProfileImage";
import { useToast } from "@/context/ToastConText";
import { useTranslations } from "next-intl";
import { updateUserProfileInChats } from "../firebase/firebaseChat";
import { base64ToFile } from "../utils/profile.util";

export default function useClientProfileUpdateForm() {
   const t = useTranslations("Profile");
   // ✅ 상태 모음
   const router = useRouter();
   const { user, refreshUser } = useAuth();
   const [isLoading, setIsLoading] = useState(false);
   const { showSuccess, showError } = useToast();
   const { updateClientProfileSchema } = useClientProfileSchemas();

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

            // //AWS로 업로드
            // const formData = new FormData();
            // formData.append("image", data.profileImage);
            // const res = await updateProfileImage(formData);
            // imageUrl = res.url;
         }

         // 2. 보낼 자료
         const payload = {
            ...data,
            profileImage: imageUrl, // 업로드된 이미지 URL 또는 undefined
            serviceType: watch("serviceType") || [],
            livingArea: watch("livingArea") || [],
         };

         await clientProfile.update(payload);
         showSuccess(t("profileUpdated")); // 알림창

         const currentUser = user as Client;

         // 이미지 변경 감지 개선
         const hasImageChanged = (() => {
            // 새로운 이미지가 업로드된 경우
            if (data.profileImage instanceof File && imageUrl) {
               return imageUrl !== currentUser.profileImage;
            }
            // 기존 이미지와 다른 문자열 이미지로 변경된 경우
            if (
               typeof data.profileImage === "string" &&
               data.profileImage !== currentUser.profileImage
            ) {
               return true;
            }
            return false;
         })();

         const hasNameChanged = data.name && data.name !== currentUser.name;

         if (hasImageChanged || hasNameChanged) {
            const finalImageUrl = (() => {
               if (data.profileImage instanceof File && imageUrl) {
                  return imageUrl; // 새로 업로드된 이미지
               }
               if (typeof data.profileImage === "string") {
                  return data.profileImage; // 기존 문자열 이미지
               }
               return undefined; // 변경사항 없음
            })();

            await updateUserProfileInChats(
               user!.id,
               data.name as string,
               hasImageChanged ? finalImageUrl : undefined,
            );
         }

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
         const message = customError?.body.message;

         // 비밀번호 등 프로필 수정 횟수 초과 오류 -> 알림창
         if (customError.status === 429) {
            if (message) showError(message);
         }

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

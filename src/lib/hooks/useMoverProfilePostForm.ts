"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthFetchError, MoveType } from "../types";
import {
   MoverProfileInput,
   useMoverProfileSchemas,
} from "../schemas/profile.schema";
import updateMoverProfile from "../api/auth/requests/updateMoverProfile";
import updateProfileImage, {
   uploadToCloudinary,
} from "../api/auth/requests/updateProfileImage";
import { useAuth } from "@/context/AuthContext";
import { tokenSettings } from "../utils";
import { useTranslations } from "next-intl";
import { useToast } from "@/context/ToastConText";
import { base64ToFile } from "../utils/profile.util";

function useMoverProfilePostForm() {
   const t = useTranslations("Profile");

   const router = useRouter();
   const [isLoading, setIsLoading] = useState(false);
   const { setUser } = useAuth();
   const { showSuccess, showError } = useToast();
   const { moverProfileSchema } = useMoverProfileSchemas();

   const {
      register,
      handleSubmit,
      setError,
      control,
      formState: { errors, isValid },
   } = useForm<MoverProfileInput>({
      resolver: zodResolver(moverProfileSchema),
      mode: "onChange",
   });

   const onSubmit = async (data: MoverProfileInput) => {
      setIsLoading(true);

      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 이미지 사이즈 제한 10MB

      try {
         // 이미지가 있으면 먼저 업로드
         let imageUrl: string | undefined;

         if (
            typeof data.image === "string" &&
            data.image.startsWith("data:image")
         ) {
            // Base64 문자열이면 File 객체로 변환 후 업로드
            const file = base64ToFile(data.image, "cropped.png");
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

            // AWS s3의 경우
            //   const formData = new FormData();
            // formData.append("image", file);
            // const res = await updateProfileImage(formData);
            // imageUrl = res.url; // 백엔드에서 반환한 s3 URL
         }

         // 이미지 처리 후 나머지 데이터 처리
         const processedData = {
            ...data,

            image: data.image instanceof File ? imageUrl : data.image, // 업로드된 이미지 URL 또는 undefined
            career: Number(data.career), // string > number로 변환
            serviceType: data.serviceType.map((type) => type as MoveType), //string[] > MoveType[]
         };

         const res = await updateMoverProfile(processedData); //  프로필 생성과 수정 로직 하나로 통일 함

         if (res.isProfileCompleted) {
            if (res.accessToken) {
               tokenSettings.set(res.accessToken);
            }

            setUser(res.data);

            setTimeout(() => {
               router.replace("/dashboard");
            }, 100); // user 상태 갱신: 미들웨어가 인식할 시간을 줌

            showSuccess(t("profileRegistered"));
         }
      } catch (error) {
         console.error("기사님 프로필 등록 실패: ", error);

         const customError = error as AuthFetchError;

         // 프론트로 에러 전달
         if (customError?.status) {
            Object.entries(customError.body.data!).forEach(([key, message]) => {
               setError(key as keyof MoverProfileInput, {
                  type: "server",
                  message: String(message),
               });
            });
         } else {
            console.error("예상치 못한 에러: ", customError?.body.message);
         }
      } finally {
         setIsLoading(false);
      }
   };

   return {
      register,
      errors,
      control,
      isValid,
      isLoading,
      handleSubmit,
      onSubmit,
   };
}

export default useMoverProfilePostForm;

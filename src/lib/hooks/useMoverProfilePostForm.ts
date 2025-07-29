"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthFetchError, MoveType } from "../types";
import {
   MoverProfileInput,
   MoverProfileSchema,
} from "../schemas/profile.schema";
import updateMoverProfile from "../api/auth/requests/updateMoverProfile";

function useMoverProfilePostForm() {
   const router = useRouter();
   const [isLoading, setIsLoading] = useState(false);

   const {
      register,
      handleSubmit,
      setError,
      control,
      formState: { errors, isValid },
   } = useForm<MoverProfileInput>({
      resolver: zodResolver(MoverProfileSchema),
      mode: "onChange",
   });

   const onSubmit = async (data: MoverProfileInput) => {
      setIsLoading(true);

      const processedData = {
         ...data,
         career: Number(data.career), // string > number로 변환
         serviceType: data.serviceType.map((type) => type as MoveType), //string[] > MoveType[]
      };

      try {
         const res = await updateMoverProfile(processedData); //  프로필 생성과 수정 로직 하나로 통일 함

         if (res.isProfileCompleted) {
            alert("프로필이 정상적으로 등록되었습니다."); //TODO: 토스트 알림으로 바꾸기

            router.push("/dashboard");
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

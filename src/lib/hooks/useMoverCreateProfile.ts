"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthFetchError } from "../types";
import {
   MoverProfileInput,
   MoverProfileSchema,
} from "../schemas/profile.schema";
import createProfile from "../api/auth/requests/createProfile";

function useMoverCreateProfile() {
   const router = useRouter();
   const [isLoading, setIsLoading] = useState(false);

   const {
      register,
      handleSubmit,
      setError,
      control,
      formState: { errors, isValid },
      setValue,
      watch,
   } = useForm<MoverProfileInput>({
      resolver: zodResolver(MoverProfileSchema),
      mode: "onChange",
   });

   const onSubmit = async (data: MoverProfileInput) => {
      setIsLoading(true);

      const processedData = {
         ...data,
         career: Number(data.career), // string > number로 변환
      };

      try {
         const res = await createProfile(processedData);

         if (res.data.user) {
            router.push("/dashboard"); //TODO: 마이페이지로 이동하는지 확인
         }
      } catch (error) {
         console.error("기사님 프로필 등록 실패: ", error);

         const customError = error as AuthFetchError;

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
      setValue,
      watch,
      isValid,
      isLoading,
      handleSubmit,
      onSubmit,
   };
}

export default useMoverCreateProfile;

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpFormSchema, SignUpFormValues } from "./../schemas/auth.schema";
import { defaultFetch } from "../utils/fetch-client";
import { AuthFetchError, UserType } from "../types";

export default function useSignUpForm() {
   // ✅ 상태 모음
   const router = useRouter();
   const { getUser } = useAuth();
   const [isLoading, setIsLoading] = useState(false);

   // ✅ react-hook-form
   const {
      register,
      handleSubmit,
      setError,
      formState: { errors, isValid },
   } = useForm({
      mode: "onChange",
      resolver: zodResolver(signUpFormSchema),
   });

   // ✅ 제출
   const onSubmit = (type: UserType) => async (data: SignUpFormValues) => {
      setIsLoading(true);

      const url = `/auth/signup/${type}`;

      try {
         const res = await defaultFetch(url, {
            method: "POST",
            body: JSON.stringify(data),
         });

         if (res.data.user && res.data.accessToken) {
            await getUser(res.data.user, res.data.accessToken);
            router.replace("/profile/create");
         }
      } catch (error) {
         console.error("일반 회원가입 실패: ", error);

         // 오류 처리: 객체로
         const customError = error as AuthFetchError;

         if (customError?.status) {
            Object.entries(customError.body.data!).forEach(([key, message]) => {
               setError(key as keyof SignUpFormValues, {
                  type: "server",
                  message: String(message),
               });
            });
         } else {
            console.error("예상치 못한 오류 발생: ", customError?.body.message);
         }
      } finally {
         setIsLoading(false);
      }
   };

   return {
      register,
      errors,
      isValid,
      onSubmit,
      isLoading,
      handleSubmit,
   };
}

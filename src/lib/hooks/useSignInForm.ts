"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInFormSchema, SignInFormValues } from "../schemas/auth.schema";
import { AuthFetchError, UserType } from "../types";
import createSignIn from "../api/auth/requests/createSignIn";

export default function useSignInForm() {
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
   } = useForm<SignInFormValues>({
      mode: "onChange",
      resolver: zodResolver(SignInFormSchema),
   });

   // ✅ 제출
   const onSubmit = (type: UserType) => async (data: SignInFormValues) => {
      setIsLoading(true);

      try {
         const res = await createSignIn(type, data);
         console.log("!!!", res);
         await getUser(res.data.user, res.data.accessToken);

         // ★ 프로필 등록 안 했으면 프로필 등록, 아니면 기사님 찾기로 이동
         if (res.data?.user?.isProfileCompleted === false) {
            router.push("/profile/create");
         } else {
            router.push("/mover-search");
         }
      } catch (error) {
         console.error("로그인 실패: ", error);

         // 오류 처리: 메시지로
         const customError = error as AuthFetchError;

         if (customError?.body.message) {
            const message = customError?.body.message;

            if (message === "사용자를 찾을 수 없습니다.") {
               setError("email", {
                  type: "server",
                  message: message,
               });
            } else if (message === "비밀번호가 일치하지 않습니다.") {
               setError("password", {
                  type: "server",
                  message: message,
               });
            }
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

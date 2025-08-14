"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInFormValues, useAuthSchemas } from "../schemas/auth.schema";
import { AuthFetchError, UserType } from "../types";
import createSignIn from "../api/auth/requests/createSignIn";
import { useToast } from "@/context/ToastConText";

export default function useSignInForm() {
   // ✅ 상태 모음
   const router = useRouter();
   const { getUser, refreshUser } = useAuth();
   const { showError } = useToast();
   const [isLoading, setIsLoading] = useState(false);
   const [isLoginBlock, setIsLoginBlock] = useState(false);
   const { signInFormSchema } = useAuthSchemas();

   // ✅ react-hook-form
   const {
      register,
      handleSubmit,
      setError,
      formState: { errors, isValid },
   } = useForm<SignInFormValues>({
      mode: "onChange",
      resolver: zodResolver(signInFormSchema),
   });

   // ✅ 제출
   const onSubmit = (type: UserType) => async (data: SignInFormValues) => {
      setIsLoading(true);

      try {
         const res = await createSignIn(type, data);
         await getUser(res.data.user, res.data.accessToken);

         // 가져온 사용자 정보 업데이트
         await refreshUser();

         // 프로필 등록 안 했으면 프로필 등록(라우트 가드), 아니면 받은 견적 페이지로 이동
         if (res.data?.user.isProfileCompleted) {
            // client는 "/mover-search"로 이동(라우터 가드),
            // mover는 "/received-requests"로 이동
            router.replace("/received-requests");
         }
      } catch (error) {
         console.error("로그인 실패: ", error);

         const customError = error as AuthFetchError;
         const message = customError?.body.message;

         // 오류 처리1: 로그인 횟수 제한에 걸릴 때
         if (customError?.status === 429) {
            if (message) showError(message);
            setIsLoginBlock(true);
         }

         // 오류 처리2: 메시지로
         if (customError?.body.message) {
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
      isLoginBlock,
   };
}

"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AuthFetchError } from "../types";
import {
   MoverBasicInfoInput,
   MoverBasicInfoSchema,
} from "../schemas/dashboard.schema";
import updateMoverBasicInfo from "../api/auth/requests/updateMoverInfo";
import { useToast } from "@/context/ToastConText";

function useMoverBasicInfo() {
   const { user, refreshUser } = useAuth();
   const router = useRouter();
   const [isLoading, setIsLoading] = useState(false);
   const { showSuccess, showError } = useToast();

   const {
      register,
      watch,
      trigger,
      handleSubmit,
      formState: { errors, isValid },
      setError,
      reset,
   } = useForm<MoverBasicInfoInput>({
      resolver: zodResolver(MoverBasicInfoSchema),
      context: {
         isLocal: user?.provider === "LOCAL", // 소셜인증 / 로컬인증에 따라 스키마가 달라짐
      },
      mode: "onChange",
      defaultValues: {
         name: user?.name || "",
         email: user?.email || "",
         phone: user?.phone || "",
         existedPassword: "",
         newPassword: "",
         newPasswordConfirmation: "",
      },
   });

   const newPassword = watch("newPassword");
   const newPasswordConfirmation = watch("newPasswordConfirmation");

   // 둘 중 하나가 바뀔 때 유효성 강제 검사
   useEffect(() => {
      trigger(["newPassword", "newPasswordConfirmation"]);
   }, [newPassword, newPasswordConfirmation, trigger]);

   //user 정보가 비동기적으로 들어오기 때문에
   useEffect(() => {
      if (user) {
         reset({
            name: user.name ?? "",
            email: user.email ?? "",
            phone: user.phone ?? "",
            existedPassword: "",
            newPassword: "",
            newPasswordConfirmation: "",
         });
      }
   }, [user, reset]);

   const onSubmit = async (data: MoverBasicInfoInput) => {
      setIsLoading(true);

      try {
         // 기본정보 수정
         const payload = {
            name: data.name,
            email: data.email,
            phone: data.phone,
            existedPassword: data.existedPassword,
            newPassword: data.newPassword,
            newPasswordConfirmation: data.newPasswordConfirmation,
         };

         // 비밀번호도 수정
         if (data.newPassword && data.newPasswordConfirmation) {
            Object.assign(payload, {
               newPassword: data.newPassword,
               newPasswordConfirmation: data.newPasswordConfirmation,
            });
         }

         const res = await updateMoverBasicInfo(payload);
         showSuccess("기본정보가 정상적으로 수정되었습니다.");

         setTimeout(async () => {
            await refreshUser();
            setTimeout(() => {
               router.replace("/dashboard");
            }, 500);
         }, 1500);
      } catch (error) {
         console.error("기사님 기본정보 수정 실패:", error);

         const customError = error as AuthFetchError;
         const message = customError?.body.message;

         // 비밀번호 등 프로필 수정 횟수 초과 오류 -> 알림창
         if (customError.status === 429) {
            if (message) showError(message);
         }

         if (customError?.status && customError.body?.data) {
            Object.entries(customError.body.data).forEach(([key, message]) => {
               setError(key as keyof MoverBasicInfoInput, {
                  type: "server",
                  message: String(message),
               });
            });
         } else {
            console.error("예상치 못한 에러: ", customError?.body?.message);
         }
      } finally {
         setIsLoading(false);
      }
   };
   return { register, errors, isValid, isLoading, handleSubmit, onSubmit };
}

export default useMoverBasicInfo;

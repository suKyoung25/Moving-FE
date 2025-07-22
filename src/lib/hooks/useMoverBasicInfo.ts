"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AuthFetchError } from "../types";
import {
   MoverBasicInfoInput,
   MoverBasicInfoSchema,
} from "../schemas/dashboard.schema";
import updateInfo from "../api/auth/requests/updateInfo";

function useMoverBasicInfo() {
   const { user } = useAuth();
   const router = useRouter();
   const [isLoading, setIsLoading] = useState(false);

   const {
      register,
      handleSubmit,
      formState: { errors, isValid },
      setError,
   } = useForm<MoverBasicInfoInput>({
      resolver: zodResolver(MoverBasicInfoSchema),
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

   const onSubmit = async (data: MoverBasicInfoInput) => {
      setIsLoading(true);

      try {
         const res = await updateInfo(data);

         if (res.data.accessToken && res.data.user) {
            router.push("/dashboard"); //TODO: 수정사항 repatch
         }
      } catch (error) {
         console.error("기사님 기본정보 수정 실패:", error);

         const customError = error as AuthFetchError;

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

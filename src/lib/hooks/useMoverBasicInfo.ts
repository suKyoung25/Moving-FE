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
import updateInfo from "../api/auth/requests/updateInfo";
import { tokenSettings } from "../utils";

function useMoverBasicInfo() {
   const { user, refreshUser } = useAuth();
   const router = useRouter();
   const [isLoading, setIsLoading] = useState(false);

   const {
      register,
      handleSubmit,
      formState: { errors, isValid },
      setError,
      reset,
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
         const res = await updateInfo(data);

         refreshUser();

         if (res) {
            router.push("/dashboard");
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

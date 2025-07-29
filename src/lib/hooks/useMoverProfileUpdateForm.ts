"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthFetchError, Mover, MoveType } from "../types";
import {
   MoverProfileInput,
   MoverProfileSchema,
} from "../schemas/profile.schema";
import { useAuth } from "@/context/AuthContext";
import { extractRegionNames } from "../utils/profile.util";
import updateMoverProfile from "../api/auth/requests/updateMoverProfile";

function useMoverProfileUpdateForm() {
   const router = useRouter();
   const [isLoading, setIsLoading] = useState(false);
   const { user, refreshUser } = useAuth();

   const {
      register,
      handleSubmit,
      setError,
      control,
      formState: { errors, isValid },
      reset,
   } = useForm<MoverProfileInput>({
      resolver: zodResolver(MoverProfileSchema),
      mode: "onChange",
      defaultValues: {
         nickName: "",
         career: "",
         introduction: "",
         description: "",
         serviceType: [],
         serviceArea: [],
      },
   });

   //user 정보가 비동기적으로 들어오기 때문에
   useEffect(() => {
      if (user?.userType === "mover") {
         const mover = user as Mover;

         const defaultValues = {
            nickName: mover.nickName ?? "",
            career: mover.career?.toString() ?? "",
            introduction: mover.introduction ?? "",
            description: mover.description ?? "",
            serviceType: mover.serviceType ?? [],
            serviceArea: extractRegionNames(mover.serviceArea),
         };

         reset(defaultValues);
      }
   }, [user, reset]);

   const onSubmit = async (data: MoverProfileInput) => {
      setIsLoading(true);

      const processedData = {
         ...data,
         career: Number(data.career), // string > number로 변환
         serviceType: data.serviceType.map((type) => type as MoveType), //string[] > MoveType[]
      };

      try {
         const res = await updateMoverProfile(processedData);

         if (res) {
            await refreshUser();
            alert("프로필이 정상적으로 수정되었습니다."); //TODO: 토스트 알림으로 바꾸기

            refreshUser();

            router.push("/dashboard");
         }
      } catch (error) {
         console.error("기사님 프로필 수정 실패: ", error);

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
      isValid,
      isLoading,
      handleSubmit,
      onSubmit,
   };
}

export default useMoverProfileUpdateForm;

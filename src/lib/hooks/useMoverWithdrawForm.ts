import { useForm } from "react-hook-form";
import { WithdrawFormSchema, WithdrawFormValues } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import deleteUserInfo from "../api/auth/requests/deleteMoverInfo";
import { AuthFetchError, UserType } from "../types";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export function useMoverWithdrawForm() {
   const [isLoading, setIsLoading] = useState(false);
   const router = useRouter();
   const { user, getUser, refreshUser, logout } = useAuth();

   const {
      register,
      handleSubmit,
      formState: { errors, isValid },
      setError,
   } = useForm<WithdrawFormValues>({
      resolver: zodResolver(WithdrawFormSchema),
      mode: "onChange",
   });

   const onSubmit = (type: UserType) => async (data: WithdrawFormValues) => {
      setIsLoading(true);

      const payload = {
         password: data.password,
         userId: user?.id!,
      };

      try {
         const res = await deleteUserInfo(type, payload);

         //디버깅
         console.log("회원 탈퇴 1");
         //디버깅
         console.log("회원 탈퇴 res", res);

         logout();

         //디버깅
         console.log("회원 탈퇴 2");

         await refreshUser();

         alert("정상적으로 회원탈퇴가 진행되었습니다"); // TODO: 토스트 알림 구현

         //디버깅
         console.log("회원 탈퇴 3");

         router.replace("/mover-search");
      } catch (error) {
         console.error("회원 탈퇴 실패:", error);

         const customError = error as AuthFetchError;

         if (customError?.body.message) {
            const message = customError?.body.message;

            console.log("프론트가 던지는 에러", message); //디버깅

            if (message === "비밀번호가 일치하지 않습니다.") {
               setError("password", {
                  type: "server",
                  message: "기존 비밀번호와 일치하지 않습니다",
               });
            }
         } else {
            console.error("예상치 못한 에러: ", customError?.body?.message);
         }
      } finally {
         setIsLoading(false);
      }
   };
   return { register, errors, isValid, isLoading, handleSubmit, onSubmit };
}

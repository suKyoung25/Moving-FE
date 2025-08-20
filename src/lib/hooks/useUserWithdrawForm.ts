import { useForm } from "react-hook-form";
import { useAuthSchemas, WithdrawFormValues } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import deleteUserInfo from "../api/auth/requests/deleteUserInfo";
import { AuthFetchError, UserType } from "../types";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { updateUserStatusOnWithdraw } from "../firebase/firebaseChat";

export function useUserWithdrawForm(onSuccess: () => void) {
   const [isLoading, setIsLoading] = useState(false);
   const { user, logout } = useAuth();
   const { showSuccess } = useToast();
   const { withdrawFormSchema } = useAuthSchemas();

   const {
      register,
      handleSubmit,
      formState: { errors, isValid },
      setError,
   } = useForm<WithdrawFormValues>({
      resolver: zodResolver(withdrawFormSchema),
      mode: "onChange",
   });

   const onSubmit = (type: UserType) => async (data: WithdrawFormValues) => {
      setIsLoading(true);

      if (!user) return;

      const payload = {
         password: data.password,
         userId: user.id,
      };

      try {
         const res = await deleteUserInfo(type, payload);

         if (res.message.includes("탈퇴")) {
            // 회원탈퇴 성공 후 Firebase 채팅방 처리
            try {
               await updateUserStatusOnWithdraw(user.id);
            } catch (firebaseError) {
               // Firebase 에러는 로그만 남기고 탈퇴 프로세스는 계속 진행
               console.error(
                  "채팅방 처리 중 오류 (탈퇴는 완료됨):",
                  firebaseError,
               );
            }
            onSuccess();

            showSuccess("정상적으로 회원탈퇴가 진행되었습니다");

            setTimeout(async () => {
               logout();
            }, 1500);
         }
      } catch (error) {
         console.error("회원 탈퇴 실패:", error);

         const customError = error as AuthFetchError;

         if (customError?.body.message) {
            const message = customError?.body.message;

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

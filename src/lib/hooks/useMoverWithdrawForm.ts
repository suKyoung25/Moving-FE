import { useForm } from "react-hook-form";
import { WithdrawFormSchema, WithdrawFormValues } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import deleteUserInfo from "../api/auth/requests/deleteMoverInfo";
import { AuthFetchError, UserType } from "../types";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastConText";

export function useMoverWithdrawForm(onSuccess: () => void) {
   const [isLoading, setIsLoading] = useState(false);
   const router = useRouter();
   const { user, logout } = useAuth();
   const { showSuccess } = useToast();

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

      if (!user) return;

      const payload = {
         password: data.password,
         userId: user.id,
      };

      try {
         const res = await deleteUserInfo(type, payload);

         if (res.message === "Mover 회원 삭제 성공") {
            onSuccess();

            showSuccess("정상적으로 회원탈퇴가 진행되었습니다");

            setTimeout(async () => {
               logout();
               setTimeout(() => {
                  router.replace("/mover-search");
               }, 500);
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

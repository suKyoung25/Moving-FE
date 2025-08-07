import { useForm } from "react-hook-form";
import { WithdrawFormSchema, WithdrawFormValues } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import deleteUserInfo from "../api/auth/requests/deleteMoverInfo";
import { AuthFetchError, UserType } from "../types";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastConText";

export function useUserWithdrawForm(onSuccess: () => void) {
   const [isLoading, setIsLoading] = useState(false);
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

         if (res.message.includes("탈퇴")) {
            onSuccess();

            showSuccess("정상적으로 회원탈퇴가 진행되었습니다");

            setTimeout(async () => {
               logout(); // 로그아웃하면 자동으로 mover-search로 이동하게 되어 있어서 router.replace를 쓰면 오히려 충돌이 날 수 있어 해당 코드 삭제했습니다. (이 주석 확인하시고 나서 지워 주세요.)
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

// 일반 회원가입에서 쓴 이메일로 소셜 로그인하려고 할 때

"use client";

import { useToast } from "@/context/ToastContext";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuthError() {
   const searchParams = useSearchParams();
   const router = useRouter();
   const { showError } = useToast();

   useEffect(() => {
      const error = searchParams.get("error");
      if (error) {
         // URL에서 오류 메시지 디코딩하고 토스트 알림 표시
         const decodedError = decodeURIComponent(error);
         showError(decodedError);

         // URL에서 error 파라미터 제거
         const newUrl = new URL(location.href);
         newUrl.searchParams.delete("error");
         router.replace(newUrl.pathname, { scroll: false });
      }
      // 여기는 없지만 BE에서 로그인 페이지로 이동하게 처리해 둠
   }, [searchParams, router, showError]);
}

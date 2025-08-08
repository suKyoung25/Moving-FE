"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import ResultModal from "@/components/common/ResultModal";

interface LoginRequiredModalProps {
   isOpen: boolean;
   onClose: () => void;
   message?: string; // 커스텀 메시지 (선택사항)
   translationNamespace?: string; // 번역 네임스페이스 (선택사항)
}

export default function LoginRequiredModal({
   isOpen,
   onClose,
   message,
   translationNamespace = "MoverSearch", // 기본값을 MoverSearch로 변경
}: LoginRequiredModalProps) {
   const t = useTranslations(translationNamespace);
   const router = useRouter();

   const handleLoginClick = () => {
      router.push("/sign-in/client");
      onClose(); // 모달 닫기
   };

   return (
      <ResultModal
         isOpen={isOpen}
         message={message || t("error.needLogin")}
         buttonText={t("goToLogin")}
         onClose={onClose}
         onClick={handleLoginClick}
      />
   );
}

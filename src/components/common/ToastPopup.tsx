/**
 * ToastPopup - 사용자 알림용 토스트 UI 컴포넌트
 *
 * 목적:
 * - 사용자에게 특정 액션의 성공 또는 실패 메시지를 간단하게 시각적으로 전달합니다.
 *
 * 특징:
 * - framer-motion 기반 애니메이션으로 부드러운 등장/퇴장 효과 제공
 * - 상단에서 내려와 3초간 표시 후 자동 사라짐
 * - 성공(success: true) 시 파란색 테마, 실패 시 빨간색 테마 적용
 *
 * Props:
 * @prop {string} text - 화면에 표시할 알림 텍스트
 * @prop {boolean} success - 성공 여부 (true: 파란색, false: 빨간색 테마)
 *
 * 기본 사용 예시:
 * ```tsx
 * const [toast, setToast] = useState<{ text: string; success: boolean } | null>(null);
 *
 * {toast && <ToastPopup text={toast.text} success={toast.success} />}
 * ```
 *
 * 주의 사항:
 * 동일한 메시지를 연속으로 띄우고 싶다면, `toast` 객체에 고유한 `id` 값을 포함하여 리렌더링을 유도해야 합니다.
 *
 * 고유 ID를 활용한 예시:
 * ```tsx
 * const [toast, setToast] = useState<{
 *   id: number;
 *   text: string;
 *   success: boolean;
 * } | null>(null);
 *
 * // 메시지 표시
 * setToast({
 *   id: Date.now(), // 또는 uuid()
 *   text: "저장 완료",
 *   success: true
 * });
 *
 * // 렌더링 시 key 부여
 * {toast && (
 *   <ToastPopup
 *     key={toast.id}
 *     text={toast.text}
 *     success={toast.success}
 *   />
 * )}
 * ```
 */

"use client";

import React, { useEffect, useState } from "react";
import { MdErrorOutline } from "react-icons/md";
import { FaRegCircleCheck } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";

interface ToastPopupProps {
   text: string;
   success: boolean;
}

export default function ToastPopup({ text, success }: ToastPopupProps) {
   const [visible, setVisible] = useState(true);

   useEffect(() => {
      const timer = setTimeout(() => {
         setVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
   }, []);

   const icon = success ? (
      <FaRegCircleCheck className="h-5 w-5 md:h-6 md:w-6" />
   ) : (
      <MdErrorOutline className="h-5 w-5 md:h-6 md:w-6" />
   );
   const bgColor = success ? "bg-primary-blue-100" : "bg-red-100";
   const borderColor = success ? "outline-primary-blue-300" : "outline-red-300";
   const textColor = success ? "text-primary-blue-300" : "text-red-500";

   return (
      <AnimatePresence>
         {visible && (
            <motion.div
               className="fixed top-16 left-1/2 z-40 -translate-x-1/2 lg:top-28"
               initial={{ opacity: 0, y: -10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 20 }}
               transition={{ duration: 0.5, ease: "easeInOut" }}
            >
               <div
                  className={`${bgColor} ${borderColor} flex items-center gap-1.5 rounded-xl px-4 py-2.5 outline outline-offset-[-1px] lg:gap-2 lg:px-5 lg:py-3`}
               >
                  <div className={textColor}>{icon}</div>
                  <div
                     className={`${textColor} text-14-medium lg:text-16-medium text-nowrap`}
                  >
                     {text}
                  </div>
               </div>
            </motion.div>
         )}
      </AnimatePresence>
   );
}

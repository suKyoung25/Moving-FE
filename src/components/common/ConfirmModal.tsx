/**
 * ConfirmModal - 사용자 확인 모달 컴포넌트
 *
 * 목적:
 * - 사용자에게 중요한 액션(예: 삭제, 취소 등)을 확인받기 위한 모달 UI 제공
 *
 * 특징:
 * - 외부 영역 클릭 시 자동으로 닫히는 기능 지원 (useOutsideClick 사용)
 * - X 버튼 클릭 시 모달 닫힘
 * - 타이틀, 설명, 확인 버튼 포함
 * - 모든 페이지/컴포넌트에서 재사용 가능하도록 설계됨
 *
 * Props:
 * @prop {boolean} isOpen - 모달 열림 여부
 * @prop {() => void} onClose - 닫기 동작을 처리할 콜백 함수
 * @prop {() => void} onConfirm - 확인 버튼 클릭 시 실행할 콜백 함수
 * @prop {string} title - 모달 상단 제목
 * @prop {string} description - 확인 메시지로 표시할 설명
 *
 * 기본 사용 예시:
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <ConfirmModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onConfirm={handleConfirm}
 *   title="삭제하시겠습니까?"
 *   description="이 작업은 되돌릴 수 없습니다."
 * />
 * ```
 *
 * 주의 사항:
 * - 외부 영역 클릭 시 닫힘을 방지하고 싶다면 useOutsideClick 훅 제거 또는 수정 필요
 * - key 값이 필요하지 않으며 조건부 렌더링을 통해 제어
 */

"use client";

import { useRef } from "react";
import Image from "next/image";
import xIcon from "@/assets/images/xIcon.svg";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";

interface ConfirmModalProps {
   isOpen: boolean;
   onClose: () => void;
   onConfirm: () => void;
   title: string;
   description: string;
}

export default function ConfirmModal({
   isOpen,
   onClose,
   onConfirm,
   title,
   description,
}: ConfirmModalProps) {
   const modalRef = useRef<HTMLDivElement>(null);

   useOutsideClick(modalRef, () => {
      onClose();
   });

   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
         <div
            ref={modalRef}
            className="flex w-80 flex-col gap-7.5 rounded-3xl bg-white px-4 py-6 lg:w-152 lg:gap-10 lg:rounded-4xl lg:px-6 lg:py-8"
         >
            <div className="flex items-center justify-between">
               <h2 className="text-18-bold lg:text-24-bold">{title}</h2>
               <button onClick={onClose}>
                  <Image
                     src={xIcon}
                     alt="닫기 버튼"
                     width={24}
                     height={24}
                     className="lg:size-9"
                  />
               </button>
            </div>
            <div>
               <p className="text-16-medium lg:text-18-medium text-center">
                  {description}
               </p>
            </div>
            <div className="w-full">
               <button
                  onClick={onConfirm}
                  className="bg-primary-blue-300 text-16-medium lg:text-18-medium h-13 w-full rounded-2xl text-white lg:h-16"
               >
                  확인하기
               </button>
            </div>
         </div>
      </div>
   );
}

import Image from "next/image";
import React from "react";
import close from "@/assets/images/xIcon.svg";
import SolidButton from "@/components/common/buttons/SolidButton";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClick: () => void;
  title: string;
  children?: React.ReactNode;
  buttonTitle: string;
  isActive: boolean;
}

export default function InputModal({
  isOpen,
  onClose,
  onClick,
  title,
  children,
  buttonTitle,
  isActive,
}: ReviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50">
      <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-lg md:max-w-94 lg:max-w-152 w-full pt-8 pb-10 px-6">
        <div className="flex justify-between items-center">
          <div className="text-18-bold lg:text-24-semibold">{title}</div>
          <button onClick={() => onClose()}>
            <Image
              src={close}
              width={36}
              height={36}
              alt="닫기"
              className="w-6 h-6 lg:w-9 lg:h-9"
            />
          </button>
        </div>
        <div className="py-6.5 lg:py-10">{children}</div>
        <SolidButton disabled={!isActive} onClick={onClick}>
          {buttonTitle}
        </SolidButton>
      </div>
    </div>
  );
}

import React from "react";

interface ChatMessageProps {
  message: string;
  type: "system" | "user";
  children?: React.ReactNode;
  onEditClick?: () => void;
}

// 시스템/유저 채팅 메세지 UI
export default function ChatMessage({
  message,
  type,
  children,
  onEditClick,
}: ChatMessageProps) {
  const baseStyle =
    "w-fit h-fit px-5 py-3 text-sm font-medium max-lg:max-w-62 lg:px-10 lg:py-5 lg:text-lg";

  // 시스템 메세지
  if (type === "system") {
    return (
      <div
        className={`${baseStyle} rounded-r-3xl rounded-bl-3xl bg-white text-black-400`}
      >
        {message}
        {children}
      </div>
    );
  }

  // 유저 메세지 (선택 완료 단계)
  return (
    <div className="flex flex-col items-end gap-2 self-end">
      <div
        className={`${baseStyle} rounded-l-3xl rounded-br-3xl bg-primary-blue-300 text-white`}
      >
        {message}
      </div>
      <button
        className="text-gray-500 font-medium underline max-lg:text-xs mr-2"
        onClick={onEditClick}
      >
        수정하기
      </button>
    </div>
  );
}

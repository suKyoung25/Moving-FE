import React from "react";

// 유저 채팅 메세지 UI Wrapper (선택 단계)
export default function ChatWrapper({
   children,
   className = "px-6 py-5 lg:p-8",
}: {
   children: React.ReactNode;
   className?: string;
}) {
   const base =
      "flex flex-col gap-4 self-end w-fit min-w-80 lg:max-w-156 lg:gap-6 bg-white rounded-l-3xl rounded-br-3xl";

   return <div className={`${base} ${className}`}>{children}</div>;
}

import React from "react";

export default function ChatWrapper({
  children,
  className = "p-4 lg:p-10 ",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const base =
    "flex flex-col gap-4 self-end w-fit lg:gap-6 bg-white rounded-l-3xl rounded-br-3xl";

  return <div className={`${base} ${className}`}>{children}</div>;
}

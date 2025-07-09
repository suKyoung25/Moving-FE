"use client";

import React, { useState } from "react";
import ErrorText from "./ErrorText";
import Image from "next/image";
import openedEye from "@/assets/images/visibilityIcon.svg";
import closedEye from "@/assets/images/visibilityOffIcon.svg";

interface Props {
  type: "text" | "password";
  id: string;
  name: string;
  value: string;
  label: string;
  placeholder: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export default function PasswordInput({
  id,
  name,
  label,
  value,
  placeholder,
  onChange,
  error,
}: Props) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleEyeIcon = () => setIsVisible((prev) => !prev);

  return (
    <section className="w-full flex flex-col gap-2 lg:gap-4">
      <label htmlFor={id}>{label}</label>

      <div className="relative w-full">
        <input
          type={isVisible ? "text" : "password"}
          id={id}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          className={`${error ? "border-secondary-red-200 focus:border-secondary-red-200" : "border-line-200 focus:border-primary-blue-300"}
          bg-white border rounded-2xl h-14 lg:h-16 p-3.5 text-black-400 w-full`}
        />
        <button
          type="button"
          onClick={toggleEyeIcon}
          className="absolute top-1/2 -translate-y-1/2 right-3"
        >
          <Image
            src={isVisible ? openedEye : closedEye}
            alt="비밀번호 토글 아이콘"
            width={24}
            height={24}
          />
        </button>
      </div>

      <ErrorText error={error} />
    </section>
  );
}

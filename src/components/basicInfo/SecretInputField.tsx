"use client";

import React, { useState } from "react";
import { InputFieldProps } from "@/lib/types/profile.types";
import Image from "next/image";
import visibilityOff from "@/assets/images/visibilityOffIcon.svg";
import visibilityOn from "@/assets/images/visibilityIcon.svg";

//기본정보 수정페이지 input 컴포넌트화
function SecretInputField({
  name,
  text,
  placeholder,
  height,
  defaultValue,
  validator,
  onValidChange, // 주석: 시작하기 버튼의 활성화 관련
}: InputFieldProps) {
  const [value, setValue] = useState<string | string[]>(defaultValue ?? "");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newVal = e.target.value;
    setValue(newVal);

    if (validator) {
      const result = validator(newVal);

      if (result.success) {
        onValidChange?.(name, result.success);
        setError("");
      } else {
        setError(result.message);
      }
    }
  };

  return (
    <div className="relative leading-[32px] flex flex-col gap-4">
      <div className="text-16-semibold lg:text-20-semibold">{text}</div>
      <input
        name={name}
        value={value}
        onChange={handleChange}
        type={showPassword ? "text" : "password"}
        className={`w-full ${height} placeholder:text-gray-300 rounded-2xl pl-3.5 bg-bg-200 ${error ? "border border-red-500" : ""}`}
        placeholder={placeholder}
      />
      <Image
        className="absolute lg:top-16.5 lg:right-3"
        src={showPassword ? visibilityOn : visibilityOff}
        alt={showPassword ? "비밀번호 보기" : "비밀번호 숨김"}
        onClick={() => setShowPassword((prev) => !prev)}
      />

      {error && (
        <div className="text-red-500 mt-2 text-base font-medium leading-[26px] self-end">
          {error}
        </div>
      )}
    </div>
  );
}

export default SecretInputField;

"use client";

import React, { useState } from "react";
import { InputFieldProps } from "@/lib/types/profile.types";
import { validateDetailDescription } from "@/lib/validations";

//상세 설명 (textArea) input인 경우
function TextAreaInputField({
  name,
  text,
  placeholder,
  height,
  defaultValue,
  onValidChange, // 주석: 시작하기 버튼의 활성화 관련
}: InputFieldProps) {
  const [value, setValue] = useState<string | string[]>(defaultValue ?? "");
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newVal = e.target.value;
    setValue(newVal);

    const result = validateDetailDescription(newVal);

    if (result.success) {
      onValidChange?.(name, result.success);
      setError("");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-16-semibold lg:text-20-semibold">
        {text}
        <span className="text-blue-300"> *</span>
      </div>
      <textarea
        name={name}
        value={value}
        onChange={handleChange}
        className={`w-full ${height} placeholder:text-gray-300 rounded-2xl pl-3.5 pt-3.5 bg-bg-200 ${error ? "border border-red-500" : ""}`}
        placeholder={placeholder}
      />
      {error && (
        <div className="text-red-500 mt-2 text-base font-medium leading-[26px]">
          {error}
        </div>
      )}
    </div>
  );
}

export default TextAreaInputField;

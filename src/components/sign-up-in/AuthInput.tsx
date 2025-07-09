import React from "react";
import ErrorText from "./ErrorText";

interface Props {
  type: "text" | "email";
  id: string;
  name: string;
  label: string;
  value: string;
  placeholder: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export default function AuthInput({
  type,
  id,
  name,
  label,
  value,
  placeholder,
  onChange,
  error,
}: Props) {
  return (
    <section className="w-full flex flex-col gap-2 lg:gap-4">
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className={`${error ? "border-secondary-red-200 focus:border-secondary-red-200" : "border-line-200 focus:border-primary-blue-300"}
          bg-white border rounded-2xl h-14 lg:h-16 p-3.5 text-black-400`}
      />

      <ErrorText error={error} />
    </section>
  );
}

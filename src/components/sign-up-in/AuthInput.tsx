"use client";

import React, { useState } from "react";
import ErrorText from "./ErrorText";
import { AuthValidationResult } from "@/lib/types/auth.type";

interface Props {
   type?: "text" | "email";
   name: string;
   label: string;
   placeholder: string;
   validator?: (value: string) => AuthValidationResult;
   onValidChange?: (key: string, isValid: boolean) => void;
   onValueChange?: (key: string, value: string) => void;
}

export default function AuthInput({
   type = "text",
   name,
   label,
   placeholder,
   validator,
   onValidChange,
   onValueChange,
}: Props) {
   const [value, setValue] = useState<string>("");
   const [error, setError] = useState("");

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      onValueChange?.(name, newValue);

      if (validator) {
         const result = validator(newValue);

         if (result.success) {
            onValidChange?.(name, true);
            setError("");
         } else {
            onValidChange?.(name, false);
            setError(result.message);
         }
      }
   };

   return (
      <section className="flex w-full flex-col gap-2 lg:gap-4">
         <label htmlFor={name}>{label}</label>
         <input
            type={type}
            id={name}
            name={name}
            value={value}
            placeholder={placeholder}
            onChange={handleChange}
            className={`${error ? "border-secondary-red-200 focus:border-secondary-red-200" : "border-line-200 focus:border-primary-blue-300"} text-black-400 h-14 rounded-2xl border bg-white p-3.5 lg:h-16`}
         />

         {error && <ErrorText error={error} />}
      </section>
   );
}

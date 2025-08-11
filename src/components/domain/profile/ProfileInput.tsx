"use client";

import React from "react";
import ErrorText from "../auth/ErrorText";
import { FieldValues } from "react-hook-form";
import { ClientProfileUpdateData } from "@/lib/types";

const style = "flex w-full flex-col gap-2 lg:gap-4";

// ✅ react-hook-form 적용한 Input
export default function ProfileInput<T extends FieldValues>({
   type = "text",
   name,
   label,
   placeholder,
   register,
   error,
   social,
}: ClientProfileUpdateData<T>) {
   const errorId = error ? `${name}-error` : undefined;

   return (
      <section
         className={social ? `${style} lg:max-w-160` : `${style} lg:max-w-full`}
      >
         <label
            htmlFor={name}
            className="text-black-300 text-16-semibold lg:text-20-semibold"
         >
            {label}
         </label>
         <input
            id={name}
            type={type}
            {...register(name)}
            placeholder={placeholder}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={`${error ? "border-secondary-red-200 focus:border-secondary-red-200 border" : ""} text-black-400 bg-bg-200 h-14 rounded-2xl p-3.5 lg:h-16`}
         />

         {error && <ErrorText error={error} />}
      </section>
   );
}

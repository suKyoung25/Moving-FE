"use client";

import React from "react";
import ErrorText from "./ErrorText";
import { FieldValues } from "react-hook-form";
import { AuthInputProps } from "@/lib/types";

export default function AuthInput<T extends FieldValues>({
   type = "text",
   name,
   label,
   placeholder,
   register,
   error,
}: AuthInputProps<T>) {
   return (
      <section className="flex w-full flex-col gap-2 lg:gap-4">
         <label htmlFor={name}>{label}</label>
         <input
            id={name}
            type={type}
            {...register(name)}
            placeholder={placeholder}
            className={`${error ? "border-secondary-red-200 focus:border-secondary-red-200" : "border-line-200 focus:border-primary-blue-300"} text-black-400 h-14 rounded-2xl border bg-white p-3.5 lg:h-16`}
         />

         {error && <ErrorText error={error} />}
      </section>
   );
}

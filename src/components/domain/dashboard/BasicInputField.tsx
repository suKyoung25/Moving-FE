"use client";

import { BasicInfoInputProps } from "@/lib/types";
import React from "react";
import { FieldValues } from "react-hook-form";
import ErrorText from "../auth/ErrorText";

function BasicInputField<T extends FieldValues>({
   name,
   text,
   placeholder,
   register,
   error,
   readOnly = false,
}: BasicInfoInputProps<T>) {
   return (
      <div className="flex flex-col leading-8">
         <div className="text-16-semibold lg:text-20-semibold">{text}</div>
         <input
            {...register(name)}
            name={name}
            type="text"
            placeholder={placeholder}
            readOnly={readOnly}
            className={`mg:h-13 bg-bg-200 mt-4 h-13 w-full rounded-2xl pl-3.5 placeholder:text-gray-300 lg:h-16 ${error ? "border border-red-500" : ""}`}
         />

         <ErrorText error={error} />
      </div>
   );
}

export default BasicInputField;

"use client";

import { BasicInfoInputProps } from "@/lib/types";
import React from "react";
import { FieldValues } from "react-hook-form";
import ErrorText from "../auth/ErrorText";

type A11yBasicInfoInputProps<T extends FieldValues> = BasicInfoInputProps<T> & {
   labelId?: string;
};

function BasicInputField<T extends FieldValues>({
   name,
   text,
   placeholder,
   register,
   error,
   readOnly = false,
   labelId,
}: A11yBasicInfoInputProps<T>) {
   const inputId = `${labelId}-input`;
   const errorId = `${labelId}-error`;

   return (
      <div className="flex flex-col leading-8">
         <label
            htmlFor={inputId}
            className="text-16-semibold lg:text-20-semibold"
         >
            {text}
         </label>
         <input
            {...register(name)}
            name={name}
            id={inputId}
            type="text"
            placeholder={placeholder}
            readOnly={readOnly}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={`mg:h-13 bg-bg-200 mt-4 h-13 w-full rounded-2xl pl-3.5 placeholder:text-gray-300 lg:h-16 ${error ? "border border-red-500" : ""}`}
         />

         <ErrorText error={error} />
      </div>
   );
}

export default BasicInputField;

"use client";

import { FaAsterisk } from "react-icons/fa";
import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { SupportFormSchema } from "@/lib/schemas";

interface SupportInputProps {
   name: keyof SupportFormSchema;
   label: string;
   important?: boolean;
   textarea?: boolean;
   fileupload?: boolean;
}

export default function SupportInput({
   name,
   label,
   important,
   textarea,
   fileupload,
}: SupportInputProps) {
   const [isFocused, setIsFocused] = useState(false);
   const {
      register,
      control,
      formState: { errors },
   } = useFormContext();
   const value = useWatch({ control, name });
   const error = errors[name]?.message as string | undefined;

   const hasValue = !!value;
   const isActive = isFocused || hasValue;

   const labelColor =
      error && !isFocused && !hasValue
         ? "text-secondary-red-200"
         : "text-primary-blue-300";

   const commonProps = {
      ...register(name),
      onFocus: () => setIsFocused(true),
      onBlur: () => setIsFocused(false),
      autoComplete: "off",
      className: `w-full pt-0 pb-1.5 md:pb-3 border-b ${
         error
            ? "border-secondary-red-200"
            : isFocused
              ? "border-primary-blue-300"
              : "border-gray-400"
      } transition-border duration-300 placeholder-gray-400`,
      placeholder: label,
   };

   return (
      <div
         className={`text-14-medium md:text-18-medium w-full pt-2 md:pt-4 ${
            error && "[&_*]:text-secondary-red-200"
         }`}
      >
         {/* floating label */}
         <div
            className={`flex ${isActive ? "items-center" : "items-end"} gap-0.5`}
         >
            <span
               className={`transition-opacity duration-500 ${
                  isActive ? `${labelColor} opacity-100` : "opacity-0"
               }`}
            >
               {label}
            </span>
            {important && (
               <FaAsterisk className="text-secondary-red-200 h-2 w-2" />
            )}
         </div>

         {/* input / textarea / file */}
         {fileupload ? (
            <input {...commonProps} type="file" />
         ) : textarea ? (
            <textarea {...commonProps} rows={isFocused ? 8 : 1} />
         ) : (
            <input {...commonProps} type="text" />
         )}

         {/* error */}
         <div className="text-12-medium md:text-16-medium text-secondary-red-200 mt-1.5 min-h-5 transition-opacity duration-300 md:min-h-7">
            {error ?? ""}
         </div>
      </div>
   );
}

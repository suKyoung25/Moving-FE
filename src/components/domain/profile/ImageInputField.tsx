"use client";

import { FieldValue, InputFieldProps } from "@/lib/types";
import React from "react";
import { Controller } from "react-hook-form";

//프로필 이미지 input인 경우
function ImageInputField<T extends Record<string, FieldValue>>({
   name,
   text,
   control,
}: InputFieldProps<T>) {
   return (
      <div className="text-16-semibold lg:text-20-semibold flex flex-col gap-4">
         <div>{text}</div>
         <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
               <>
                  <input
                     type="file"
                     accept="image/*"
                     onChange={(e) => field.onChange(e.target.files?.[0])}
                  />
                  {fieldState.error && (
                     <p className="text-sm text-red-500">
                        {fieldState.error.message}
                     </p>
                  )}
               </>
            )}
         />
      </div>
   );
}

export default ImageInputField;

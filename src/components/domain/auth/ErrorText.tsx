import React from "react";

interface Prop {
   error?: string;
   position?: "left" | "right";
}

export default function ErrorText({ error, position = "right" }: Prop) {
   const textAlignClass = position === "left" ? "text-left" : "text-right";

   return (
      <p
         className={`text-secondary-red-200 text-13-medium lg:text-16-medium ${textAlignClass} h-5 lg:h-6 ${error ? "opacity-100" : "opacity-0"}`}
      >
         {error ?? ""}
      </p>
   );
}

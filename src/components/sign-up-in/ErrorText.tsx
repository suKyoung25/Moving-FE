import React from "react";

interface Prop {
   error?: string;
}

export default function ErrorText({ error }: Prop) {
   if (!error) return;

   return (
      <p className="text-secondary-red-200 text-13-medium lg:text-16-medium text-right">
         {error}
      </p>
   );
}

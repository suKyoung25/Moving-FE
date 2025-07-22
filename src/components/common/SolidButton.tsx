import React from "react";

type SolidButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
   children: React.ReactNode;
   className?: string;
   type?: string;
};

export default function SolidButton({
   children,
   disabled,
   className = "w-full",
   type = "button",
   ...props
}: SolidButtonProps) {
   return (
      <button
         type={type}
         disabled={disabled}
         className={`text-16-semibold bg-primary-blue-300 hover:bg-primary-blue-200 lg:text-20-semibold h-13.5 rounded-2xl px-4 text-white transition duration-200 disabled:!cursor-not-allowed disabled:bg-gray-100 lg:h-16 ${className} `}
         {...props}
      >
         {children}
      </button>
   );
}

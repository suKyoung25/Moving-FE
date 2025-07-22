import React from "react";

type OutlinedButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
   children: React.ReactNode;
   className?: string;
   type?: string;
};

export default function OutlinedButton({
   children,
   disabled,
   className = "w-full",
   type = "button",
   ...props
}: OutlinedButtonProps) {
   return (
      <button
         type={type}
         disabled={disabled}
         className={`text-16-semibold border-primary-blue-300 text-primary-blue-300 hover:bg-primary-blue-50 lg:text-20-semibold h-13.5 rounded-2xl border-1 border-solid bg-transparent px-4 transition duration-200 disabled:!cursor-not-allowed disabled:border-gray-100 disabled:bg-transparent disabled:text-gray-100 lg:h-16 ${className} `}
         {...props}
      >
         {children}
      </button>
   );
}

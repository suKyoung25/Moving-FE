import React from "react";

type SolidButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export default function SolidButton({
  children,
  disabled,
  className = "w-full",
  ...props
}: SolidButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`
        px-4
        rounded-2xl
        text-white
        text-16-semibold
        transition
        duration-200
        bg-primary-blue-300
        hover:bg-primary-blue-200
        disabled:bg-gray-100
        h-13.5
        lg:h-16 lg:text-20-semibold
        disabled:!cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

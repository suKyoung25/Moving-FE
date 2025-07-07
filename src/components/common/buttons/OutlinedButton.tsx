import React from "react";

type OutlinedButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export default function OutlinedButton({
  children,
  disabled,
  className = "w-full",
  ...props
}: OutlinedButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`
        px-4
        rounded-2xl
        text-16-semibold
        transition
        duration-200
        bg-transparent
        border-1 border-solid
        border-primary-blue-300
        text-primary-blue-300
        hover:bg-primary-blue-50
        disabled:bg-transparent
        disabled:border-gray-100
        disabled:text-gray-100
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

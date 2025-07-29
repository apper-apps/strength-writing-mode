import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  label,
  error,
  className = "",
  containerClassName = "",
  ...props 
}, ref) => {
  return (
    <div className={cn("space-y-2", containerClassName)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          "w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
          "transition-colors duration-200",
          "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
          error && "border-red-500 focus:ring-red-500",
          "dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
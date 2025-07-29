import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  children, 
  variant = "primary", 
  size = "md", 
  className = "", 
  disabled = false,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 hover:scale-[1.02] focus:ring-primary-200 shadow-sm",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:scale-[1.02] focus:ring-gray-200 shadow-sm",
    accent: "bg-gradient-to-r from-accent-500 to-accent-600 text-gray-900 hover:from-accent-600 hover:to-accent-700 hover:scale-[1.02] focus:ring-accent-200 shadow-sm",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:scale-[1.02] focus:ring-gray-200",
    outline: "border-2 border-primary-500 text-primary-600 hover:bg-primary-50 hover:scale-[1.02] focus:ring-primary-200"
  };
  
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  };
  
  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
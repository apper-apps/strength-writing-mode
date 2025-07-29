import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  children, 
  variant = "default", 
  size = "sm",
  className = "", 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center font-medium rounded-full";
  
  const variants = {
    default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    primary: "bg-gradient-to-r from-primary-100 to-primary-50 text-primary-800 border border-primary-200",
    accent: "bg-gradient-to-r from-accent-100 to-accent-50 text-accent-800 border border-accent-200",
    success: "bg-gradient-to-r from-green-100 to-green-50 text-green-800 border border-green-200",
    warning: "bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 border border-yellow-200",
    error: "bg-gradient-to-r from-red-100 to-red-50 text-red-800 border border-red-200",
    free: "bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border border-gray-200",
    premium: "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border border-blue-200",
    master: "bg-gradient-to-r from-yellow-100 to-amber-50 text-amber-800 border border-amber-200"
  };
  
  const sizes = {
    xs: "px-2 py-1 text-xs",
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };
  
  return (
    <span
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;
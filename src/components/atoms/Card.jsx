import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  children, 
  className = "", 
  hover = false,
  gradient = false,
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "bg-white rounded-xl shadow-sm border border-gray-100",
        hover && "hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer",
        gradient && "bg-gradient-to-br from-white to-gray-50",
        "dark:bg-gray-800 dark:border-gray-700",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;
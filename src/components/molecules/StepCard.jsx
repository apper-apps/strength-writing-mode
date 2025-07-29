import React from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StepCard = ({ step, title, description, icon, isActive = false }) => {
  return (
    <Card 
      className={`p-6 text-center transition-all duration-300 ${
        isActive 
          ? "ring-2 ring-primary-500 shadow-lg bg-gradient-to-br from-primary-50 to-white" 
          : "hover:shadow-md"
      }`}
      hover={!isActive}
    >
      <div className="mb-4">
        <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 ${
          isActive 
            ? "bg-gradient-to-br from-primary-500 to-primary-600 text-white" 
            : "bg-gradient-to-br from-gray-100 to-gray-50 text-gray-600"
        }`}>
          <ApperIcon name={icon} className="w-6 h-6" />
        </div>
        <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm font-bold ${
          isActive 
            ? "bg-gradient-to-br from-accent-500 to-accent-600 text-gray-900" 
            : "bg-gradient-to-br from-gray-200 to-gray-100 text-gray-600"
        }`}>
          {step}
        </div>
      </div>
      
      <h3 className={`font-semibold mb-2 korean-text ${
        isActive ? "text-primary-900" : "text-gray-900"
      }`}>
        {title}
      </h3>
      
      {description && (
        <p className="text-sm text-gray-600 korean-text leading-relaxed">
          {description}
        </p>
      )}
    </Card>
  );
};

export default StepCard;
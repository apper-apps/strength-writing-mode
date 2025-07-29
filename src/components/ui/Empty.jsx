import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "데이터가 없습니다", 
  description = "표시할 내용이 없습니다", 
  actionText,
  onAction,
  iconName = "Inbox",
  className = "" 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] px-4 ${className}`}>
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name={iconName} className="w-10 h-10 text-gray-400" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 mb-6 korean-text">{description}</p>
        
        {actionText && onAction && (
          <button
            onClick={onAction}
            className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-3 rounded-lg font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-primary-200"
          >
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
};

export default Empty;
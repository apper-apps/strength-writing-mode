import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "오류가 발생했습니다", onRetry, className = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] px-4 ${className}`}>
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="AlertCircle" className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">문제가 발생했습니다</h3>
          <p className="text-gray-600 korean-text">{message}</p>
        </div>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-primary-200"
          >
            다시 시도
          </button>
        )}
      </div>
    </div>
  );
};

export default Error;
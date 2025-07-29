import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(() => {
    // Check for saved preference or default to system preference
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) return JSON.parse(saved);
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    // Save preference
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      const saved = localStorage.getItem("darkMode");
      if (saved === null) {
        setDarkMode(e.matches);
      }
    };
    
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
      title={darkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
    >
      <ApperIcon 
        name={darkMode ? "Sun" : "Moon"} 
        className="w-5 h-5" 
      />
    </button>
  );
};

export default DarkModeToggle;
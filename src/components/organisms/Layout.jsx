import React from "react";
import { useLocation } from "react-router-dom";
import Navigation from "./Navigation";

const Layout = ({ children }) => {
  const location = useLocation();
  const isLandingPage = location.pathname === "/" || location.pathname === "/landing";

  if (isLandingPage) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      <Navigation />
      
      {/* Main content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Mobile header spacer */}
        <div className="lg:hidden h-16" />
        
        {/* Content */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
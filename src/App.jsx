import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Landing from "@/components/pages/Landing";
import Dashboard from "@/components/pages/Dashboard";
import Courses from "@/components/pages/Courses";
import Community from "@/components/pages/Community";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:courseId" element={<Courses />} />
          <Route path="/community" element={<Community />} />
          <Route path="/community/post/:postId" element={<Community />} />
        </Routes>
      </Layout>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="z-50"
      />
    </BrowserRouter>
  );
}

export default App;
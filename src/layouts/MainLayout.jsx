import React from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Fixed Header */}
      <Header />

      {/* Main Content */}
      <main
        className="
          min-h-screen
          min-w-0
          pt-16
          lg:ml-64
        "
      >
        <div className="w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;

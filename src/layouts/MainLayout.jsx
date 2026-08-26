import React from "react";
import Sidebar from "../components/layout/Sidebar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#fafafa]">

      {/* Sidebar */}
      <Sidebar />

      {/* Page Content */}
      <main className="min-h-screen lg:ml-64">
        <Outlet />
      </main>

    </div>
  );
};

export default MainLayout;


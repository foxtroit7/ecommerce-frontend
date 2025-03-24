import React from "react";
import Sidebar from "./sidebar/Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{
          marginLeft: '250px',
          width: '100%',
          height: '100vh',
          overflowY: 'auto',
          backgroundColor: '#f8f9fa',
        }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;

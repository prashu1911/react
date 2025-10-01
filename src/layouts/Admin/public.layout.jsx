import React from "react";
import { Outlet } from "react-router-dom";

function AdminPublicLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default AdminPublicLayout;

import React from "react";
import { Outlet } from "react-router-dom";
import "flatpickr/dist/flatpickr.css";
import "../../assets/admin/scss/main.scss";

function AdminLayout() {
  return <Outlet />;
}

export default AdminLayout;

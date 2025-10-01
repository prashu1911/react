import React from "react";
import { Outlet } from "react-router-dom";

function ParticipantPublicLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default ParticipantPublicLayout;

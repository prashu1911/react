import React from "react";
import { Outlet} from "react-router-dom";
import { Header, Footer } from "components/Participant";
import AppLayout from "../App/index.layout";

function ParticipantPrivateLayout() {
 
  return (
      <AppLayout>
          <Header/>
          <Outlet />
          <Footer/>
      </AppLayout>
  );
}

export default ParticipantPrivateLayout;

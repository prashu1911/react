import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { AdminHeader, AdminSidebar } from "../../components/Admin";
import AppLayout from "../App/index.layout";
import ButtonColorInjector from "components/Admin/ButtonColorInjector";

function AdminPrivateLayout() {
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [sidebarOverlayVisible, setSidebarOverlayVisible] = useState(false);
  const [mainContentReduced, setMainContentReduced] = useState(false);
  const [menuFlipped, setMenuFlipped] = useState(false);
  const sidebarToggle = () => {
    setMenuCollapsed(!menuCollapsed);
    setSidebarOverlayVisible(!sidebarOverlayVisible);
    setMainContentReduced(!mainContentReduced);
    setMenuFlipped(!menuFlipped);
  };

  const resetClasses = () => {
    setMenuCollapsed(false);
    setSidebarOverlayVisible(false);
    setMainContentReduced(false);
    setMenuFlipped(false);
  };

  const checkWidthAndReset = () => {
    if (window.innerWidth < 1199) {
      resetClasses();
    }
  };

  useEffect(() => {
    window.addEventListener("resize", checkWidthAndReset);
    checkWidthAndReset();

    return () => {
      window.removeEventListener("resize", checkWidthAndReset);
    };
  }, []);

  // const handleOverlayClick = () => {
  //   setMenuCollapsed(false);
  //   setSidebarOverlayVisible(false);
  // };

  // const sidebarToggle = () => {
  //   const sidebar = document.querySelector(".sidebar");
  //   sidebar.classList.toggle("menuCollapse");
  //   document.querySelector(".sidebar-overlay").classList.toggle("show");

  //   // main content
  //   const mainContent = document.querySelector(".mainContent");
  //   mainContent.classList.toggle("reduceWidth");

  //   // menuBar
  //   const menuBar = document.querySelector(".menuBar");
  //   menuBar.classList.toggle("flip");

  //   // sidebar overlay
  //   const sidebarOverlay = document.querySelector(".sidebar-overlay");
  //   sidebarOverlay.addEventListener("click", () => {
  //     sidebar.classList.remove("menuCollapse");
  //     sidebarOverlay.classList.remove("show");
  //   });

  //   // sidebar menu
  //   // const sidebarMenu = document.querySelector(".sidebar_menu");
  //   // sidebarMenu.addEventListener("click", (event) => {
  //   //   if (event.target.classList.contains("toggleMenu")) {
  //   //     sidebar.classList.toggle("menuCollapse");
  //   //     sidebarOverlay.classList.toggle("show");
  //   //   } else if (!event.target.classList.contains("submenu")) {
  //   //     sidebar.classList.add("menuCollapse");
  //   //     sidebarOverlay.classList.remove("show");
  //   //   }
  //   // });
  // };

  // const resetClasses = () => {
  //   $('.menuBar, .sidebar, .mainContent, .sidebar-overlay').removeClass('flip menuCollapse reduceWidth show');
  // };
  // const checkWidthAndReset = () => {
  //     if ($(window).width() < 1199) resetClasses();
  // };
  // checkWidthAndReset();
  // $(window).resize(checkWidthAndReset);

  return (
    <div>
      <AppLayout>
      <AdminSidebar
        sidebarToggle={sidebarToggle}
        sidebarOverlayVisible={sidebarOverlayVisible}
        menuCollapsed={menuCollapsed}
      />
      <AdminHeader
        sidebarToggle={sidebarToggle}
        menuCollapsed={menuCollapsed}
        menuFlipped={menuFlipped}
      />
      <main
        className={`mainContent ${mainContentReduced ? "reduceWidth" : ""}`}
      >
        <ButtonColorInjector />
        <Outlet />
      </main>
      </AppLayout>
    </div>
  );
}

export default AdminPrivateLayout;

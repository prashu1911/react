import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import "../../assets/participant/scss/main.scss";
import participantRouteMap from "../../routes/Participant/participantRouteMap";

function ParticipantLayout() {
  const location = useLocation();

  useEffect(() => {
    // Create a mapping of routes to class names
    const routeToClassMap = {
      [participantRouteMap.TAKESURVEY.path]: "takeSurvey",
      [participantRouteMap.JUMPSEQUENCE.path]: "takeSurvey",
      [participantRouteMap.STARTSURVEY.path]: "startSurvey",
      [participantRouteMap.ALOGIN.path]: "pt-0",
      [participantRouteMap.PLOGIN.path]: "pt-0",
      [participantRouteMap.PROGRESSDASHBOARD.path]: "dashboard",
      [participantRouteMap.MYSURVEY.path]: "mySurvey",
      [participantRouteMap.FAQ.path]: "faq",
      [participantRouteMap.CONTACTUS.path]: "contactUs",
      [participantRouteMap.VIEWRESPONSE.path]: "viewResponse",
    };

    // Get the class name based on the current path
    const className = routeToClassMap[location?.pathname];

    // Dynamically remove all previously added classes
    const classListToRemove = Object.values(routeToClassMap);
    document.body.classList.remove(...classListToRemove);

    // Add the class if a matching path is found
    if (className) {
      document.body.classList.add(className);
    }

    // Cleanup function to remove the class on unmount or when the route changes
    return () => {
      document.body.classList.remove(...classListToRemove);
    };
  }, [location.pathname, participantRouteMap]);

  // main section height
  const [, setMainHeight] = useState(0);

  const calculateHeight = () => {
    const headerHeight = document?.querySelector(".header")?.offsetHeight;
    const footerHeight = document?.querySelector(".footer")?.offsetHeight;
    const totalHeight = headerHeight + footerHeight;
    const pageHeight = window?.innerHeight - totalHeight;
    setMainHeight(pageHeight);
  };

  useEffect(() => {
    calculateHeight();
    window.addEventListener("resize", calculateHeight);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", calculateHeight);
    };
  }, []);

  return <Outlet />;
}

export default ParticipantLayout;

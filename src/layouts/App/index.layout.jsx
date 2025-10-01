import React, { useEffect } from "react";
import { useLocation, generatePath, useParams, useNavigate } from "react-router-dom";
import { getCompletePathList } from "../../routes";
import { isPathMatched, getDefaultRoute } from "../../utils/auth.util";
import useAuth from "../../customHooks/useAuth/index";
import adminRouteMap from "../../routes/Admin/adminRouteMap";

function AppLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { getloginUserData } = useAuth();
  const reduxUserData = getloginUserData();

  const params = useParams();

  function getGeneratedPath(data) {
    try {
      return generatePath(data, params);
    } catch (error) {
      return data;
    }
  }

  const activeRoute = getCompletePathList().find((e) => {
    const routePath = getGeneratedPath(e?.path);
    const browserPath = location?.pathname;
    return routePath === browserPath;
  });

  const participateRoutes = [
    {
      menuID: 1,
      menuName: "STARTSURVEY",
      menuPath: "/participant/home",
    },
    {
      menuID: 2,
      menuName: "THANKYOU",
      menuPath: "/participant/thankyou",
    },
    {
      menuID: 3,
      menuName: "TAKESURVEY",
      menuPath: "/participant/take-survey",
    },
    {
      menuID: 4,
      menuName: "PROGRESSDASHBOARD",
      menuPath: "/participant/survey-dashboard",
    },
    {
      menuID: 5,
      menuName: "MYSURVEY",
      menuPath: "/participant/my-survey",
    },
    {
      menuID: 6,
      menuName: "SUMMARYREPORT",
      menuPath: "/participant/summary-report",
    },
    {
      menuID: 7,
      menuName: "DETAILEDREPORT",
      menuPath: "/participant/detailed-report",
    },
    {
      menuID: 8,
      menuName: "JUMPSEQUENCE",
      menuPath: "/participant/jumpSequence",
    },
    {
      menuID: 9,
      menuName: "VIEWRESPONSE",
      menuPath: "/participant/viewResponse",
    },
    {
      menuID: 10,
      menuName: "VIEWRESPONSESURVEY",
      menuPath: "/participant/view-response",
    },
  ];

  const isPrivate = activeRoute?.private;
  const menues = [
    ...(Array.isArray(reduxUserData?.menu) ? reduxUserData?.menu : []),
    ...(Array.isArray(reduxUserData?.menuPreference) ? reduxUserData?.menuPreference : []),
    ...((reduxUserData?.roleID === 9 && participateRoutes) || []), // Adding participant routes if the user is a participant
  ];

  const isValid = isPathMatched(menues, location?.pathname, isPrivate);
  // Check if the persist:metolius key exists and is not null or undefined
  const isPersistMetoliusEmpty = () => {
    const persistedData = localStorage.getItem("persist:metolius");
    return persistedData === null || persistedData === undefined || persistedData === "{}";
  };

  useEffect(() => {
    const token = reduxUserData?.apiToken;
    // if user is login , so he cannot go at login page again.so here i am redirectinng to his defailt route.
    if (location?.pathname === adminRouteMap?.LOGIN?.path && token && !isPersistMetoliusEmpty()) {
      const defaultRoute = getDefaultRoute(reduxUserData?.menu);
      navigate(`${defaultRoute}`);
    }

    // on manuale local storage change
    const handleStorageChange = () => {
      if (isPersistMetoliusEmpty()) {
        // Redirect to login page if localStorage is empty
        navigate(adminRouteMap?.LOGIN?.path);
      }
      return null;
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [location.pathname, navigate]);

  const token = reduxUserData?.apiToken;

  useEffect(() => {
    // user is not login.
    if (!token && isPrivate) {
      navigate(adminRouteMap?.LOGIN?.path);
    }

    // route not found.
    if (!activeRoute && !isValid?.status) {
      navigate(adminRouteMap?.PAGENOTFOUND?.path);
    }

    // user is login but page is unauthorized.
    // if (!isValid?.status && token) {
    // // if (token) {
    //   navigate(adminRouteMap?.UNAUTHORIZED?.path);
    // }
  }, [location.pathname]);

  return <>{isValid?.status && children}</>;
}

export default AppLayout;

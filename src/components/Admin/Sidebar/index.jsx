import { useEffect, useState } from "react";
import { Link, useResolvedPath, useLocation } from "react-router-dom";
import { Collapse } from "react-bootstrap";
import { useAuth } from "customHooks";
import adminRouteMap from "../../../routes/Admin/adminRouteMap";

const currentYear = new Date().getFullYear();
const menuDataCheck = [
  {
    menuName: "Dashboard",
  },
  {
    menuName: "Org Structure",
    subMenu: ["Company Management", "Department Management", "Participant Management"],
  },
  {
    menuName: "Survey",
    subMenu: ["Manage-surveys", "Resources", "View Assessment", "View Crosswalk"],
  },
  {
    menuName: "Reports",
    subMenu: ["Survey Analysis", "My Reports", "Random Response", "Comparsion Charts", "Participant Response"],
  },
  {
    menuName: "Distribution",
    subMenu: ["Assign & Send", "Schedule Log", "Participant Progress Report"],
  },
  {
    menuName: "Analytics",
    subMenu: ["Surveys Charting", "Demographic Trend Analysis"],
  },
  {
    menuName: "Intelligent Reports",
    subMenu: ["Create Template", "Saved Reports", "Template", "Reports", "Manage Dataset"],
  },
];
function AdminSidebar({ sidebarOverlayVisible, menuCollapsed, sidebarToggle }) {
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  const location = useLocation();
  const { pathname } = useResolvedPath();
  const [collapseState, setCollapseState] = useState({});
  const [menuData, setMenuData] = useState([]);

  // Toggle the collapse state for a given menu item
  const toggleCollapse = (menuID) => {
    setCollapseState((prevState) => {
      const isCurrentlyCollapsed = prevState[menuID];

      // If the clicked menu is currently collapsed, we're toggling it off
      if (isCurrentlyCollapsed) {
        // Find the currently active menu based on pathname
        const activeMenu = menuData.find(
          (menu) => menu.subMenu && menu.subMenu.some((sub) => sub.menuPath === pathname)
        );

        // Create new state with all menus collapsed except the active one
        const newState = {};
        menuData.forEach((menu) => {
          newState[menu.menuID] = activeMenu && menu.menuID === activeMenu.menuID;
        });

        return newState;
      } else {
        // If the clicked menu is not collapsed, collapse only this menu
        const newState = {};
        menuData.forEach((menu) => {
          newState[menu.menuID] = menu.menuID === menuID;
        });

        return newState;
      }
    });
  };
  function filterMenu(menu, menuCheck) {
    return menuCheck
      .map((menuItemCheck) => {
        const matchedMenu = menu?.find((menuItem) => menuItem?.menuName === menuItemCheck?.menuName);
        if (!matchedMenu) return null;
        const filteredSubMenu =
          matchedMenu?.subMenu?.length > 0 && Array.isArray(menuItemCheck?.subMenu)
            ? matchedMenu?.subMenu?.filter((subMenuItem) => menuItemCheck?.subMenu?.includes(subMenuItem?.menuName))
            : [];
        return {
          menuName: matchedMenu?.menuName,
          menuDisplayName: matchedMenu?.menuDisplayName || matchedMenu?.menuName,
          menuID: matchedMenu?.menuID,
          menuLevel: matchedMenu?.menuLevel,
          menuLevelID: matchedMenu?.menuLevelID,
          menuPath: matchedMenu?.menuPath,
          menuIcon: matchedMenu?.menuIcon,
          subMenu: filteredSubMenu,
        };
      })
      .filter(Boolean);
  }

  useEffect(() => {
    // Load menu data from local storage
    if (userData && userData?.menu) {
      let filteredMenu = filterMenu(userData?.menu, menuDataCheck);
      // Sort filteredMenu based on the index in userData.menu
      filteredMenu = filteredMenu.sort((a, b) => {
        const aIdx = userData.menu.findIndex((item) => item.menuName === a.menuName);
        const bIdx = userData.menu.findIndex((item) => item.menuName === b.menuName);
        return aIdx - bIdx;
      });
      const updatedMenuData = filteredMenu.map((menu) => {
        let menuIcon = "";
        if (menu?.menuName === "Dashboard" && menu?.menuIcon === "-") {
          menuIcon = "dashboard";
        }
        if (menu?.menuName === "Dashboard") {
          menu.menuPath = "/dashboard";
        }

        if (menu?.menuName === "Org Structure" && menu?.menuIcon === "-") {
          menuIcon = "users-group";
        }

        if (menu?.menuName === "Survey" && menu?.menuIcon === "-") {
          menuIcon = "notelist";
        }
        if (menu?.menuName === "Reports" && menu?.menuIcon === "-") {
          menuIcon = "report";
        }
        if (menu?.menuName === "Distribution" && menu?.menuIcon === "-") {
          menuIcon = "loop-alt3";
        }
        if (menu?.menuName === "Analytics" && menu?.menuIcon === "-") {
          menuIcon = "analytics";
        }
        if (menu?.menuName === "Intelligent Reports" && menu?.menuIcon === "-") {
          menuIcon = "reports";
        }

        return {
          ...menu,
          menuIcon,
          menuDisplayName: menu?.menuDisplayName,
          menuPath: menu?.menuPath ? `${menu?.menuPath}` : "",
          subMenu: menu?.subMenu
            ? menu?.subMenu?.map((sub) => ({
                ...sub,
                menuPath: sub?.menuPath ? `${sub?.menuPath}` : "",
              }))
            : [],
        };
      });
      setMenuData(updatedMenuData);
    }
  }, [pathname]);

  useEffect(() => {
    // Auto-expand menu items that contain the current path
    menuData.forEach((menu) => {
      if (menu.subMenu && menu?.subMenu?.some((sub) => sub?.menuPath === pathname)) {
        setCollapseState((prevState) => ({
          ...prevState,
          [menu?.menuID]: true,
        }));
      }
    });
  }, [pathname, menuData]);

  const handleLogout = () => {
    localStorage.clear();
  };

  const renderMenuItems = (items) => {
    return items?.map((item) => {
      const isActive = location?.pathname === item?.menuPath;

      return (
        <li key={item?.menuID} className={isActive ? "active" : ""}>
          {item?.subMenu && item?.subMenu?.length > 0 ? (
            <>
              <Link
                className={`toggleMenu ${collapseState[item?.menuID] ? "active" : ""}`}
                onClick={() => toggleCollapse(item?.menuID)}
              >
                <em className={`icon-${item?.menuIcon}`} />
                <span>{item?.menuDisplayName}</span>
              </Link>
              <Collapse in={collapseState[item?.menuID]}>
                <ul className="submenu">{renderMenuItems(item?.subMenu)}</ul>
              </Collapse>
            </>
          ) : (
            <Link to={item?.menuPath} className={isActive ? "active" : ""}>
              <em className={`icon-${item?.menuIcon}`} />
              <span>
                {/* {item?.menuDisplayName == "Saved Reports"
                  ? "Reports"
                  : item?.menuDisplayName == "Create Template"
                  ? "Templates"
                  : item?.menuDisplayName} */}
                {item?.menuDisplayName}
              </span>
            </Link>
          )}
        </li>
      );
    });
  };

  return (
    <>
      <aside
        className={`sidebar ${menuCollapsed ? "menuCollapse" : ""} ${userData && userData?.companyConfig?.menu_color}`}
      >
        <ul className="sidebar_menu list-unstyled mb-0" id="mainMenu">
          {menuData && menuData?.length > 0 ? renderMenuItems(menuData) : <li>No Menu Available</li>}
        </ul>
        <div className="sidebar_foot">
          <ul className="list-unstyled mb-0">
            <li>
              <Link to="/default-settings">
                <em className="icon-settings" />
                <span>Default Settings</span>
              </Link>
            </li>
            <li>
              <a href="https://knowledgebase.metoliusaa.com/kb" target="_blank" rel="noopener noreferrer">
                <em className="icon-help" />
                <span>Knowledge Base</span>
              </a>
            </li>
            <li>
              <Link to={adminRouteMap?.LOGIN?.path} onClick={handleLogout}>
                <em className="icon-power-off" />
                <span>Log Out</span>
              </Link>
            </li>
          </ul>
          <div className="startChat">
            <div className="d-flex align-items-center">
              <Link to="#!" className="ripple-effect startChat_btn">
                <span>Start Here!</span> <em className="icon-help" />
              </Link>
              <Link to="#!" className="startChat_icon ripple-effect">
                <em className="icon-chat" />
              </Link>
            </div>
            <p className="copyRight mb-0">Metolius V5.0 © {currentYear}, All Rights Reserved.</p>
          </div>
        </div>
      </aside>
      <div onClick={sidebarToggle} className={`sidebar-overlay ${sidebarOverlayVisible ? "show" : ""}`} />
    </>
  );
}

export default AdminSidebar;

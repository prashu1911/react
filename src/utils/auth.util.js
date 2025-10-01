import adminRouteMap from "../routes/Admin/adminRouteMap";

// Function to check if the path exists in the menu or its submenus
export const isPathMatched = (menuArray, path, isPrivate) => {
  
  // if route is public 
  if (!isPrivate) {
    return {
      status: true,
    };
  }

  // Loop through each menu item and check if the menu path matches the given path
  if (menuArray && menuArray.length > 0) {
    for (let menu of menuArray) {
      // Ensure we check for exact matches and do a strict comparison
      if (menu?.menuPath === path) {
        return {
          status: true,
        };
      }

      // If the menu has submenus, check in the submenus as well
      if (menu?.subMenu?.length > 0) {
        // Recursive call to check in submenus
        const result = isPathMatched(menu?.subMenu, path, isPrivate);
        // If sub-menu matches, return the result
        if (result.status) {
          return result;
        }
      }
    }
  }

  return {
    status: false,
  };
};



//  function for finding the default route based on the given dynamic menu structure, we can follow this logic:
// 1. We first loop through the top-level menu items.
// 2. If the menuPath of a top-level menu is not "-", return that menuPath.
// 3. If the menuPath is "-", we then check the subMenu for valid menu paths. We recursively loop through the subMenu items.
// 4.If we find a valid menuPath (i.e., a path that is not "-"), we return that menuPath.
// 5.If no valid path is found after iterating through all menu items, we return /login.

export const getDefaultRoute = (menu) => {
  // Helper function to recursively check menus
  const findValidRoute = (menuItems) => {
    for (let item of menuItems) {
      // If the menu has a valid path, return it
      if (item?.menuPath !== "-" && item?.menuPath) {
        return item?.menuPath;
      }
      // Otherwise, check the subMenus if any
      if (item?.subMenu && item?.subMenu?.length > 0) {
        let subMenuPath = findValidRoute(item?.subMenu);
        if (subMenuPath) {
          return subMenuPath;
        }
      }
    }
    return null;  // No valid path found
  }
  // Start from the top-level menu
  let route = Array.isArray(menu) ? findValidRoute(menu) : false;

  // If no route is found, default to /login
  return route || adminRouteMap?.LOGIN?.path;
}


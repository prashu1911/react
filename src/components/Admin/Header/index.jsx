import React, { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "customHooks";
import ImageElement from "../../ImageElement";
import adminRouteMap from "../../../routes/Admin/adminRouteMap";
import { ChangePasswordModel } from "./Model";
import { COMPANY_LOGO } from "config";
import { USER_LOGO } from "config";

function AdminHeader({ sidebarToggle, menuFlipped }) {
  let navigate = useNavigate();
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();

  // modal
  const [showResetPassword, setShowResetPassword] = useState(false);
  const resetPasswordClose = () => setShowResetPassword(false);
  const resetPasswordShow = () => setShowResetPassword(true);
  const [sideMenuBar, setSideMenuBar] = useState([]);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const onConfirmAlertModal = () => {
    setIsAlertVisible(false);
    return true;
  };
  const submitPassword = () => {
    setShowResetPassword(false);
    setIsAlertVisible(true);
  };

  // profile dropdown
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  // Map URLs to dropdown items
  const urlToMenuItemMap = {
    [adminRouteMap?.MYUSAGE?.path]: "myUsage",
    [adminRouteMap?.PROFILE?.path]: "profile",
    [adminRouteMap?.ACCOUNTINFORMATION?.path]: "accountInfo",
    [adminRouteMap?.ADMINMANAGEMENT?.path]: "adminManagement",
    "#!": "defaultSettings",
    [adminRouteMap.LOGIN?.path]: "logout",
  };
  const defaultIcons = {
    Profile: "icon-profile",
    "Default Settings": "icon-settings",
    "My Usage": "icon-my-usage",
    "Admin Management": "icon-administrator",
    "Account Information": "icon-reports",
  };

  useEffect(() => {
    const path = location.pathname;
    const menuData = userData?.menuPreference || [];
    console.log("menu Data", menuData);

    const activeMenuItem = menuData?.find((item) => item?.menuUrl === path)?.menuName || urlToMenuItemMap[path] || null;

    if (activeMenuItem) {
      setActiveItem(activeMenuItem);
      localStorage.setItem("activeDropdownItem", activeMenuItem);
    }
    const updatedMenu = menuData.map((item) => {
      if (item?.menuIcon === "-") {
        return {
          ...item,
          menuIcon: defaultIcons[item?.menuName] || "icon-default",
        };
      }
      return item;
    });
    setSideMenuBar(updatedMenu);
  }, [location?.pathname]);

  const handleToggle = (isOpen) => {
    setOpen(isOpen);
  };

  const handleMenuItemClick = (item) => {
    setActiveItem(item);
    localStorage.setItem("activeDropdownItem", item);
    setOpen(false);
  };
  const handleLogout = () => {
    localStorage.clear();
    navigate(adminRouteMap.LOGIN.path);
  };

  return (
    <>
      <header className="header">
        <div className="w-100 d-flex justify-content-between">
          <div className="header_left">
            <Link to={adminRouteMap?.DASHBOARD?.path} className="d-sm-block d-none">
              {/* <ImageElement previewSource="../../assets/admin-images/logo.svg" /> */}
              <ImageElement
                previewSource={`${COMPANY_LOGO}/${
                  userData?.companyConfig?.logo ? userData?.companyConfig?.logo : "demo_logo.svg"
                }`}
                styling={{ width: "100%" }}
              />{" "}
            </Link>
            <button
              type="button"
              className={`menuBar shadown-none border-0 bg-transparent ${menuFlipped ? "flip" : ""}`}
              onClick={sidebarToggle}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14.744" height="14.176" viewBox="0 0 14.744 14.176">
                <g id="Group_238196" data-name="Group 238196" transform="translate(-264.333 -41)">
                  <path
                    id="Path_264762"
                    className="path1"
                    data-name="Path 264762"
                    d="M14.519,11.916,19.04,7.4a1.146,1.146,0,0,0-1.621-1.621l-5.988,5.988a1.08,1.08,0,0,0,0,1.528l5.988,5.988a1.146,1.146,0,0,0,1.621-1.621l-4.521-4.521A.864.864,0,0,1,14.519,11.916Z"
                    transform="translate(259.701 35.561)"
                    opacity="0.5"
                  />
                  <path
                    id="Path_264763"
                    className="path2"
                    data-name="Path 264763"
                    d="M8.519,11.916,13.04,7.4a1.146,1.146,0,1,0-1.621-1.621L5.431,11.763a1.08,1.08,0,0,0,0,1.528l5.988,5.988a1.146,1.146,0,0,0,1.621-1.621L8.519,13.139A.864.864,0,0,1,8.519,11.916Z"
                    transform="translate(259.219 35.561)"
                    opacity="0.8"
                  />
                </g>
              </svg>
            </button>
            <Link to={adminRouteMap?.DASHBOARD?.path} className="d-sm-none d-block">
              {/* <ImageElement previewSource="../../assets/admin-images/logo.svg" /> */}
              <ImageElement
                previewSource={`${COMPANY_LOGO}/${
                  userData?.companyConfig?.logo ? userData?.companyConfig?.logo : "demo_logo.svg"
                }`}
                styling={{ width: "100%" }}
              />
            </Link>
          </div>
          <div className="header_right d-flex align-items-center">
            <Dropdown className="notificationDropdown">
              <Dropdown.Toggle className="shadow-none border-0 bg-transparent" as="button">
                <svg xmlns="http://www.w3.org/2000/svg" width="20.221" height="22.6" viewBox="0 0 20.221 22.6">
                  <g id="Group_238197" data-name="Group 238197" transform="translate(-124.163 -182.974)">
                    <path
                      id="Path_4698"
                      data-name="Path 4698"
                      d="M135,199.8a.6.6,0,0,0-.516-.3h-4.116a.595.595,0,0,0-.514.895,2.97,2.97,0,0,0,5.143,0A.6.6,0,0,0,135,199.8Z"
                      transform="translate(1.851 3.695)"
                      fill="#0968ac"
                    />
                    <path
                      id="Path_4699"
                      data-name="Path 4699"
                      d="M143.592,200.566a11.277,11.277,0,0,1-2.255-6.171v-4.169a7.726,7.726,0,0,0-15.452,0v4.169a11.277,11.277,0,0,1-2.255,6.171.6.6,0,0,0,.465.966h19.032a.6.6,0,0,0,.465-.966Z"
                      transform="translate(0.663 0.474)"
                      fill="#0968ac"
                      opacity="0.4"
                    />
                  </g>
                </svg>
                <span className="indicator active" />
              </Dropdown.Toggle>
              <Dropdown.Menu className="d-none">
                <div className="dropdown_head d-flex align-items-center justify-content-between">
                  <div className="title">
                    Notifications <span>10 New</span>
                  </div>
                  <Link>View All</Link>
                </div>
                <div className="dropdown_list">
                  <div className="dropdown_list_item">
                    <ImageElement source="user.png" />
                    <div className="dropdown_list_item_cnt">
                      <p>
                        <strong>Gladys Dare</strong> commented on Echosystems and conservation
                      </p>
                      <span>1m ago</span>
                    </div>
                  </div>
                  <div className="dropdown_list_item">
                    <ImageElement source="user.png" />
                    <div className="dropdown_list_item_cnt">
                      <p>
                        <strong>Rosina Wisoky</strong> followed you
                      </p>
                      <span>20m ago</span>
                    </div>
                  </div>
                  <div className="dropdown_list_item">
                    <div className="icon">
                      <em className="icon-check" />
                    </div>
                    <div className="dropdown_list_item_cnt">
                      <p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum, fugiat?</p>
                      <span>1h ago</span>
                    </div>
                  </div>
                  <div className="dropdown_list_item">
                    <ImageElement source="user.png" />
                    <div className="dropdown_list_item_cnt">
                      <p>
                        <strong>Sunny Graham</strong> voted for research peat-based carbon capture
                      </p>
                      <span>2h ago</span>
                    </div>
                  </div>
                  <div className="dropdown_list_item">
                    <ImageElement source="user.png" />
                    <div className="dropdown_list_item_cnt">
                      <p>
                        <strong>Gladys Dare</strong> commented on Echosystems and conservation
                      </p>
                      <span>1m ago</span>
                    </div>
                  </div>
                  <div className="dropdown_list_item">
                    <ImageElement source="user.png" />
                    <div className="dropdown_list_item_cnt">
                      <p>
                        <strong>Rosina Wisoky</strong> followed you
                      </p>
                      <span>20m ago</span>
                    </div>
                  </div>
                  <div className="dropdown_list_item">
                    <div className="icon">
                      <em className="icon-check" />
                    </div>
                    <div className="dropdown_list_item_cnt">
                      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum, fugiat?</p>
                      <span>1h ago</span>
                    </div>
                  </div>
                  <div className="dropdown_list_item">
                    <ImageElement source="user.png" />
                    <div className="dropdown_list_item_cnt">
                      <p>
                        <strong>Sunny Graham</strong> voted for research peat-based carbon capture
                      </p>
                      <span>2h ago</span>
                    </div>
                  </div>
                </div>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown className="profileDropdown" autoClose="true" show={open} onToggle={handleToggle}>
              <Dropdown.Toggle as="button" className="profile shadow-none border-0 bg-transparent">
              <img
  src={
    userData?.image
      ? userData.image.replace("com/storage", "com/v1/storage")
      : `${USER_LOGO}/${userData?.companyConfig?.user_icon || "demo_user.png"}`
  }
  alt="User"
    style={{
      height: "50px",
      width: "50px",
      border: "0.1px solid #ddd",    // ✅ Correct border
      borderRadius: "50%",           // ✅ For circle
      objectFit: "contain",          // ✅ Ensures image fits without distortion
      display: "block"               // ✅ Avoids extra spacing in some cases
    }}
/>


                <div className="profile_caption d-sm-block d-none">
                  <p className="mb-0 fw-semibold text-capitalize">{userData?.firstName || "Buddy"}</p>
                  <span className="text-truncate fw-medium text-capitalize">{userData?.roleName || "User"}</span>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {sideMenuBar?.map((item) =>
                  item?.menuPath && item?.menuPath !== "-" ? (
                    <Link
                      key={item?.menuID}
                      className={`dropdown-item ${activeItem === urlToMenuItemMap[item?.menuPath] ? "active" : ""}`}
                      onClick={() => handleMenuItemClick(urlToMenuItemMap[item?.menuPath])}
                      to={`${item?.menuPath}`}
                    >
                      <em className={item?.menuIcon} />
                      {item?.menuName}
                    </Link>
                  ) : (
                    <Link key={item?.menuID} className="dropdown-item non-clickable-menu-item">
                      <em className={item?.menuIcon} />
                      {item?.menuName}
                    </Link>
                  )
                )}
                <Dropdown.Item
                  onClick={() => {
                    handleMenuItemClick("changePassword");
                    resetPasswordShow();
                  }}
                >
                  <em className="icon-change-password" />
                  Change Password
                </Dropdown.Item>
                {/* <Dropdown.Divider /> */}
                {/* <Link
                  className="dropdown-item pb-lg-4 pb-3"
                  to={adminRouteMap?.LOGIN?.path}
                  onClick={handleLogout}
                >
                  <em className="icon-logout" />
                  Logout
                </Link> */}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        <ChangePasswordModel
          showResetPassword={showResetPassword}
          resetPasswordClose={resetPasswordClose}
          submitPassword={submitPassword}
          isAlertVisible={isAlertVisible}
          onConfirmAlertModal={onConfirmAlertModal}
          setIsAlertVisible={setIsAlertVisible}
        />
      </header>
    </>
  );
}

export default AdminHeader;

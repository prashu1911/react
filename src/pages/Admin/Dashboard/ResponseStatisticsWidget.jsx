import React, { useEffect, useState } from "react";
import { Button, Col,  Form, Nav, Tab } from "react-bootstrap";
import { commonService } from "services/common.service";
import { useAuth } from "customHooks";
import SurveyStstus from "./Chart/SurveyStstus";
import DesktopBrowser from "./DesktopBrowser";
import MobileBrowser from "./MobileBrowser";
import OperatingBrowser from "./OperatingBrowser";
import { ADMIN_MANAGEMENT } from "apiEndpoints/AdminManagement/adminManagement";

const ResponseStatisticsWidget = React.memo(({  }) => {
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();

  const [DesktopData, setDesktopData] = useState([])
  const [MobileData, setMobileData] = useState([])
  const [OSData, setOSData] = useState([])

  useEffect(() => {
    fetchResponseStatistics('desktop',setDesktopData);
    fetchResponseStatistics('mobile',setMobileData);
    fetchResponseStatistics('os',setOSData);
  }, []);

  const fetchResponseStatistics = async (filter, setFunction) => {    
    try {
      const response = await commonService({
        apiEndPoint: ADMIN_MANAGEMENT.getDashboardResponseStatistics,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        bodyData:{
          "roleID": userData?.roleID,
          "companyMasterID": userData.companyMasterID,
          "companyID": userData.companyID,
          filterType:filter
      }
      });
      if (response?.status) {
        setFunction(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching elements:", error);
    }
  };

  return (
    <Col xxl={4} sm={6}>
      <div className="cardBox bg-white h-100">
        <div className="pageTitle mb-3 pb-1 flex-wrap">
          <h2 className="mb-0">Response Statistics</h2>
        </div>
        <Tab.Container id="left-tabs-example" defaultActiveKey="desktop">
          <Nav variant="pills" className="browserTab mb-3">
            <Nav.Item>
              <Nav.Link eventKey="desktop">Desktop</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="mobile">Mobile</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="operating">OS</Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="desktop"><DesktopBrowser data={DesktopData}/></Tab.Pane>
            <Tab.Pane eventKey="mobile"><MobileBrowser data={MobileData}/></Tab.Pane>
            <Tab.Pane eventKey="operating"><OperatingBrowser data={OSData}/></Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
    </Col>
  );
});

export default ResponseStatisticsWidget;

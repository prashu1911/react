import React, { useEffect, useState } from "react";
import { Button, Col,  Form } from "react-bootstrap";
import { commonService } from "services/common.service";
import { useAuth } from "customHooks";
import SurveyStstus from "./Chart/SurveyStstus";
import CompanyDetails from "./Chart/CompanyDetails";
import { Link } from "react-router-dom";
import { SelectField } from "components";
import { ADMIN_MANAGEMENT } from "apiEndpoints/AdminManagement/adminManagement";
import MultiSelectDropdown from "./MultiSelectDropdown";

const CompanyDetailsWidget = React.memo(({ widgetData }) => {
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();


  const [CompanyDetailsData, setCompanyDetailsData] = useState([])
  const [CompaniesList, setCompaniesList] = useState([])
  const [SelectedCompany, setSelectedCompany] = useState([]);

  useEffect(() => {
    fetchCompanyDetails();
  }, [SelectedCompany]);
  useEffect(() => {    
    fetchCompanies();
  }, []);
  useEffect(() => {    
    if (CompaniesList?.length>0) {
      const newArray = CompaniesList?.filter(item =>
        widgetData?.widget_data?.companyIDs?.includes(item.value)
      );
      setSelectedCompany(newArray);      
    }
  }, [widgetData, CompaniesList]);

  const fetchCompanies = async () => {
    try {
      const response = await commonService({
        apiEndPoint: ADMIN_MANAGEMENT.getCompanyList(userData?.companyMasterID),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        setCompaniesList(response.data.data.map(company => ({
          value: company.companyID,
          label: company.comapnyName  // Fix typo: comapnyName → companyName
        })));
      }
    } catch (error) {
      console.error("Error fetching elements:", error);
    }
  };

  const fetchCompanyDetails = async () => {    
    if (SelectedCompany.length<=0) return;
    try {
      const response = await commonService({
        apiEndPoint: ADMIN_MANAGEMENT.getDashboardCompanyDetail,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        bodyData:{
          "companies": SelectedCompany.map(item => item.value),
      }
      });
      if (response?.status) {
        updateCompanyDetails()
        setCompanyDetailsData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching elements:", error);
    }
  };
  const updateCompanyDetails = async () => {    
    if (SelectedCompany.length<=0) return;
    try {
      const response = await commonService({
        apiEndPoint: ADMIN_MANAGEMENT.updateDashboardCompanyDetail,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        bodyData:{
          "companies": SelectedCompany.map(item => item.value),
          dashboardID: widgetData?.dashboard_id,
          widgetID: widgetData?.widget_id,
      }
      });
      if (response?.status) {
      }
    } catch (error) {
      console.error("Error fetching elements:", error);
    }
  };

  return (
    <Col xs={12}>
      <div className="cardBox bg-white h-100">
        <div className="d-flex align-item-center justify-content-between pageTitle mb-2 pb-1 flex-wrap">
          <h2 className="mb-0">Company Details</h2>
          <div style={{width:'20rem'}}>
          <MultiSelectDropdown
              extraClass="w-100"
              value={SelectedCompany}
              onChange={setSelectedCompany}
              placeholder="Select Surveys"
              options={CompaniesList}
              isMulti={true}
            />

          </div>
        </div>
        <CompanyDetails data={CompanyDetailsData} />
      </div>
    </Col>
  );
});

export default CompanyDetailsWidget;

import React, { useEffect, useState } from 'react';
import { Nav, Tab } from 'react-bootstrap';
import { commonService } from 'services/common.service';
import { COMMANAPI } from 'apiEndpoints/OrgStructure/OrgStructure.dashboard';
import { decodeHtmlEntities } from 'utils/common.util';
import { RESOURSE_MANAGEMENT } from 'apiEndpoints/ResourseManagement';
import { useAuth } from 'customHooks';
import logger from 'helpers/logger';
import SurveysTemplates from './SurveysTemplates';
import QuestionBank from './QuestionBank';
import ResponseBlocks from './ResponseBlocks';
import Introductions from './Introductions';
import EmailTemplates from './EmailTemplates';
import RandomResponse from './RandomResponse';

import { Breadcrumb } from '../../../../components';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { selectCompanyData, selectCompany } from '../../../../redux/ManageSurveySlice/index.slice';

export default function Resources() {
    const { getloginUserData } = useAuth();
    const dispatch = useDispatch();
    const selectedReduxCompanyID = useSelector(selectCompanyData);
    const userData = getloginUserData();
    const [companyOptions, setCompanyOptions] = useState([]);
    const [searchFormData, setSearchFormData] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [formData, setFormData] = useState({});

    const fetchOptionDetails = async (path, type) => {
      const response = await commonService({
        apiEndPoint: COMMANAPI.getComman(path),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        if (type === "company") {
          const companies = Object?.values(response?.data?.data)?.map((company) => ({
            value: company?.companyID,
            label: decodeHtmlEntities(company?.companyName),
          }));
          setCompanyOptions(companies);
          
          // If we have a selected company in Redux, use it
          if (selectedReduxCompanyID) {
            const preSelected = companies.find(comp => comp.value === selectedReduxCompanyID);
            if (preSelected) {
              setSelectedCompany(preSelected.value);
            }
          }
        }
      }
    };

    const handleCompanyChange = (selectedOption) => {
      const value = selectedOption ? selectedOption.value : null;
      setSelectedCompany(value);
      dispatch(selectCompany(value));
    };

    const getSearchFormData = async () =>{
        try {
        const response = await commonService({
            apiEndPoint: RESOURSE_MANAGEMENT.getSearchFormData,
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData?.apiToken}`,
            },
        })
        if(response?.status){
            setSearchFormData((
              Object?.values(response?.data?.data)?.map((company) => ({
                value: company?.libraryElementID,
                label: decodeHtmlEntities(company?.value),
              }))
            ))
        }
        } catch (error) {
            logger(error);
        }
    }

    useEffect(() => {
      const initializeData = async () => {
        if (userData?.companyMasterID) {
          await fetchOptionDetails(
            `company?companyMasterID=${userData?.companyMasterID}`,
            "company"
          );
        }
      };
      getSearchFormData();
      initializeData();
    }, [userData]);

    // Update selected company when Redux value changes
    useEffect(() => {
      if (selectedReduxCompanyID && companyOptions.length > 0) {
        const preSelected = companyOptions.find(comp => comp.value === selectedReduxCompanyID);
        if (preSelected) {
          setSelectedCompany(preSelected.value);
          // Also update formData to ensure child components have the latest company
          setFormData(prev => ({
            ...prev,
            companyID: preSelected.value
          }));
        }
      }
    }, [selectedReduxCompanyID, companyOptions]);

    // Update formData when selectedCompany changes
    useEffect(() => {
      if (selectedCompany) {
        setFormData(prev => ({
          ...prev,
          companyID: selectedCompany
        }));
      }
    }, [selectedCompany]);

    // breadcrumb
    const breadcrumb = [
        {
            path: "#!",
            name: "Surveys",
        },
        {
            path: "#",
            name: "Resources",
        },
    ];

    return ( 
        <>
        {/* head title start */}
        <section className="commonHead">
            <h1 className='commonHead_title'>Welcome Back!</h1>
            <Breadcrumb breadcrumb={breadcrumb} />
        </section>
        {/* head title end */}
        <div className="pageContent resourcePage">
            <div className="pageTitle">
                <h2 className="mb-0">Resources</h2>
            </div>
            <Tab.Container id="left-tabs-example" defaultActiveKey="surveys">
                <Nav variant="pills" className="commonTab filter">
                    <Nav.Item>
                        <Nav.Link eventKey="surveys">Surveys Templates</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="question">Question Bank</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="response">Response Blocks</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="Introductions">Introductions</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="Email">Email Templates</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="Random">Random Response</Nav.Link>
                    </Nav.Item>
                </Nav> 
                <Tab.Content>
                    <Tab.Pane eventKey="surveys">
                        <SurveysTemplates 
                            companyOptions={companyOptions} 
                            searchOptions={searchFormData}
                            selectedCompany={selectedCompany}
                            onCompanyChange={handleCompanyChange}
                        />
                    </Tab.Pane>
                    <Tab.Pane eventKey="question">
                        <QuestionBank 
                            companyOptions={companyOptions} 
                            searchOptions={searchFormData}
                            selectedCompany={selectedCompany}
                            onCompanyChange={handleCompanyChange}
                        />
                    </Tab.Pane>
                    <Tab.Pane eventKey="response">
                        <ResponseBlocks 
                            companyOptions={companyOptions} 
                            searchOptions={searchFormData}
                            selectedCompany={selectedCompany}
                            onCompanyChange={handleCompanyChange}
                        />
                    </Tab.Pane>
                    <Tab.Pane eventKey="Introductions">
                        <Introductions 
                            companyOptions={companyOptions} 
                            searchOptions={searchFormData}
                            selectedCompany={selectedCompany}
                            onCompanyChange={handleCompanyChange}
                        />
                    </Tab.Pane>
                    <Tab.Pane eventKey="Email">
                        <EmailTemplates 
                            companyOptions={companyOptions} 
                            searchOptions={searchFormData}
                            selectedCompany={selectedCompany}
                            onCompanyChange={handleCompanyChange}
                        />
                    </Tab.Pane>
                    <Tab.Pane eventKey="Random">
                        <RandomResponse 
                            companyOptions={companyOptions} 
                            searchOptions={searchFormData}
                            selectedCompany={selectedCompany}
                            onCompanyChange={handleCompanyChange}
                        />
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </div>
        </>
    );
}
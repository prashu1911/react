/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { commonService } from "services/common.service";
import { COMMANAPI } from "apiEndpoints/OrgStructure/OrgStructure.dashboard";
import { useAuth } from "customHooks";
import { decodeHtmlEntities } from "utils/common.util";
import { DEFAULT_SETTINGS } from "apiEndpoints/DefaultSettings";
import { SURVEYS_MANAGEMENT } from "apiEndpoints/SurveysManagement";
import { showSuccessToast } from "helpers/toastHelper";

import {
  Button,
  InputField,
  SweetAlert,
  SelectField,
  Breadcrumb,
  ModalComponent,
} from "../../../components";
import SystemGeneratedEmails from "./SystemGeneratedEmails/index.page";
import ColorPalette from "./ColorPalette/index.page";
import Charts from "./Charts/index.page";
import FAQ from "./FAQ/index.page";
import OtherSettings from "./OtherSettings/index.page";
import LogoSettings from "./LogoSettings/index.page";
import AnonymityThreshold from "./AnonymityThreshold/index.page";

export default function DefaultSettings() {
  const [companyOptions, setCompanyOptions] = useState([]);
  const { getloginUserData, dispatcLoginUserData } = useAuth();
  const userData = getloginUserData();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [defaultSetting, setDefaultSetting] = useState(null);
  const [activeTab, setActiveTab] = useState("defaultSystemTab");
  const [isUpdateAllSetting, setIsUpdateAllSetting] = useState(false);
  const [isReportOutBtn, setIsReportOutBtn] = useState(false);
  const [isDynamicOutput, setIsDynamicOutput] = useState(false);
  const [isAssesmentLayout, setIsAssesmentLayout] = useState(false);

  // Function to handle tab clicks
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  useEffect(() => {
    const activeContent = document.getElementById(activeTab);
    if (activeContent) {
      const topPosition =
        activeContent.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: topPosition - 80, // Adjust 50px as needed for the offset
        behavior: "smooth", // Enable smooth scroll
      });
    }
  }, [activeTab]);

  const getAllSettings = async (companyId) => {
    try {
      const { data } = await commonService({
        apiEndPoint: DEFAULT_SETTINGS.getAllSettings,
        queryParams: {
          company_master_id: userData?.companyMasterID,
          company_id: companyId,
        },
        toastType: {
          success: false,
          error: false,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      setDefaultSetting(data);
      dispatcLoginUserData({
        ...userData,
        logo: data?.logo?.content_1,
      });
    } catch (error) {
      console.error(error, "error");
    }
  };

  useEffect(() => {
    if (selectedCompany) {
      getAllSettings(selectedCompany?.value);
    }
  }, [selectedCompany, isUpdateAllSetting]);
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
        let dataArray = Object?.values(response?.data?.data);
        setCompanyOptions(
          // eslint-disable-next-line no-shadow
          dataArray?.map((company) => ({
            value: company?.companyID,
            label: decodeHtmlEntities(company?.companyName),
          }))
        );
      }
    } else {
      console.error("error");
    }
  };

  const updateResultOutput = async (resultOutput) => {
    setIsReportOutBtn(true);
    try {
      const { data } = await commonService({
        apiEndPoint: DEFAULT_SETTINGS.updateDefaultSettingResultOutput,
        bodyData: {
          company_master_id: userData?.companyMasterID,
          company_id: selectedCompany?.value,
          result_output: resultOutput,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (data) {
        setIsUpdateAllSetting((p) => !p);
        showSuccessToast("result output updated!");
      }
    } catch (error) {
      console.error(error, "error");
    } finally {
      setIsReportOutBtn(false);
    }
  };

  const updateDynamicOutput = async (bodyObj) => {
    setIsDynamicOutput(true);
    try {
      const { data } = await commonService({
        apiEndPoint: DEFAULT_SETTINGS.updateDefaultSettingDynamicOutput,
        bodyData: {
          ...bodyObj,
          company_master_id: userData?.companyMasterID,
          company_id: selectedCompany?.value,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (data) {
        setIsUpdateAllSetting((p) => !p);
        showSuccessToast("dynamic output updated!");
      }
    } catch (error) {
      console.error(error, "error");
    } finally {
      setIsDynamicOutput(false);
    }
  };

  const updateAssesmentLayout = async (bodyObj) => {
    setIsAssesmentLayout(true);
    try {
      const { data } = await commonService({
        apiEndPoint: DEFAULT_SETTINGS.updateDefaultSettingLayout,
        bodyData: {
          company_master_id: userData?.companyMasterID,
          company_id: selectedCompany?.value,
          ...bodyObj,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (data) {
        setIsUpdateAllSetting((p) => !p);
        showSuccessToast("assessment layout updated!");
      }
    } catch (error) {
      console.error(error, "error");
    } finally {
      setIsAssesmentLayout(false);
    }
  };

  useEffect(() => {
    if (userData?.companyMasterID) {
      fetchOptionDetails(`company`, "company");
    }
  }, []);

  // add modal
  const [showAddDep, setShowAddDep] = useState(false);
  const adddepClose = () => setShowAddDep(false);

  // edit modal
  const [showEditDep, setShowEditDep] = useState(false);
  const editdepClose = () => setShowEditDep(false);

  // copy comment modal
  const [showCopyComment, setshowCopyComment] = useState(false);
  const copyCommentClose = () => setshowCopyComment(false);

  // email modal
  const [showEmail, setshowEmail] = useState(false);
  const emailClose = () => setshowEmail(false);
  const emailShow = () => setshowEmail(true);

  // search add introduction modal
  const [showSearch, setshowSearch] = useState(false);
  const searchClose = () => setshowSearch(false);

  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const onConfirmAlertModal = () => {
    setIsAlertVisible(false);
    return true;
  };
  const deleteModal = () => {
    setIsAlertVisible(true);
  };

  // breadcrumb
  const breadcrumb = [
    {
      path: "#!",
      name: "Surveys",
    },

    {
      path: "#!",
      name: "Default Settings",
    },
  ];

  // State to track the active tab

  const tabs = [
    { id: "defaultSystemTab", title: "Default System Generated Emails" },
    { id: "anonymityThresholdTab", title: "Anonymity Threshold" },
    { id: "colorPaletteTab", title: "Scalar Color Palette Default" },
    { id: "chartOptionsTab", title: "Default Chart Options" },
    { id: "faqHelpTab", title: "Faq And Help Contact Settings" },
    { id: "defaultSettingsTab", title: "Other Default Settings" },
    { id: "logoSettingsTab", title: "Logo Settings" },
  ];

  /// default chart options Tab

  const [chartTypeOptions, setChartTypeOptions] = useState([]);
  const [legendOptions, setLegendOptions] = useState([]);
  const [dataLabelOptions, setDataLabelOptions] = useState([]);
  const [fontSizeOptions, setfontSizeOptions] = useState([]);
  const [labelColor, setLabelColor] = useState("");
  const [switchAccess, setSwitchAccess] = useState(false);
  const [scalerOpacity, setScalerOpacity] = useState(100);
  const [isDefaultColor, setIsDefaultColor] = useState(false);
  const [isDefaultChartOptions, setIsDefaultChartOption] = useState(false);

  const updateDefaultColor = async (bodyObj) => {
    setIsDefaultColor(true);
    try {
      const response = await commonService({
        apiEndPoint: DEFAULT_SETTINGS?.setDefaultColor,
        bodyData: {
          company_master_id: userData?.companyMasterID,
          company_id: selectedCompany?.value,
          ...bodyObj,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        showSuccessToast("default color updated!");
      }
    } catch (error) {
      console.error("Error fetching score data:", error);
    } finally {
      setIsDefaultColor(false);
    }
  };

  const updateDefaultChartOptions = async (bodyObj) => {
    setIsDefaultChartOption(true);
    try {
      const response = await commonService({
        apiEndPoint: DEFAULT_SETTINGS?.updateChartOption,
        bodyData: {
          company_master_id: userData?.companyMasterID,
          company_id: selectedCompany?.value,
          ...bodyObj,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        showSuccessToast("chart option updated!");
      }
    } catch (error) {
      console.error("Error fetching score data:", error);
    } finally {
      setIsDefaultChartOption(false);
    }
  };

  const fetchChartOptions = async (action) => {
    try {
      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT?.getDefaultChartSettings,
        queryParams: {
          action,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        let defaultChartOptions = response?.data?.data?.chartType?.map(
          (item) => ({
            value: item?.id,
            label: item?.name,
          })
        );

        const filteredChartOptions = defaultChartOptions

        const defaultDataLabelOptions = response?.data?.data?.dataLabel?.map(
          (item) => ({
            value: item?.id,
            label: item?.name,
          })
        );
        const defaultLegendOptions = response?.data?.data?.legend?.map(
          (item) => ({
            value: item?.id,
            label: item?.name,
          })
        );
        const defaultFontOptions = response?.data?.data?.fontSize?.map(
          (item) => ({
            value: item?.id,
            label: item?.name,
          })
        );

        setLegendOptions(defaultLegendOptions);
        setChartTypeOptions(filteredChartOptions);
        setDataLabelOptions(defaultDataLabelOptions);
        setfontSizeOptions(defaultFontOptions);
      }
    } catch (error) {
      console.error("Error fetching score data:", error);
    }
  };

  useEffect(() => {
    fetchChartOptions("get_chart_option_dropdowns");
  }, [userData]);

  return (
    <>
      {/* head title start */}
      <section className="commonHead">
        <h1 className="commonHead_title">Welcome Back!</h1>
        <Breadcrumb breadcrumb={breadcrumb} />
      </section>
      {/* head title end */}
      <div className="pageContent createsurveyPage">
        <div className="pageTitle d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div className="d-flex align-items-center">
            <h2 className="mb-0">Default Settings </h2>
          </div>
        </div>
        <div className="defaultSetting">
          <SelectField
            placeholder="Company Name"
            onChange={(e) => setSelectedCompany(e)}
            options={companyOptions}
          />
          <div className="noteText fs-6 mt-xxl-2 mt-1">
            Note: Default Settings email templates are required to publish your
            assessment. When assessment-level email templates have not been
            created, Default Settings templates will be used.
          </div>
        </div>
        {selectedCompany && selectedCompany?.value && (
          <div className="surveyTab">
            <div className="d-xl-flex">
              <ul className="list-unstyled mb-xl-0 mb-3 surveyTab_left">
                {tabs.map((tab) => (
                  <li
                    key={tab.id}
                    className={`${activeTab === tab.id ? "active" : ""}`}
                    onClick={() => handleTabClick(tab.id)}
                  >
                    <a href="#!">
                      <h3 className="mb-0">{tab.title}</h3>
                    </a>
                  </li>
                ))}
              </ul>
              <div className="surveyTab_right">
                <SystemGeneratedEmails
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  emailShow={emailShow}
                  userData={userData}
                  selectedCompany={selectedCompany}
                  initialData={defaultSetting?.system_generated_email}
                />
                <AnonymityThreshold
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  selectedCompany={selectedCompany}
                  userData={userData}
                  initialData={defaultSetting?.threshold}
                />
                <ColorPalette
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  deleteModal={deleteModal}
                  initialData={defaultSetting?.color_details}
                  defaultPaletteId={
                    defaultSetting?.default_scalar_color_palette_id
                      ?.color_palette_id
                  }
                  selectedCompany={selectedCompany}
                  userData={userData}
                />
                <Charts
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  companyOptions={companyOptions}
                  chartTypeOptions={chartTypeOptions}
                  labelColor={labelColor}
                  legendOptions={legendOptions}
                  fontSizeOptions={fontSizeOptions}
                  dataLabelOptions={dataLabelOptions}
                  switchAccess={switchAccess}
                  scalarOpacity={scalerOpacity}
                  setSwitchAccess={setSwitchAccess}
                  setScalerOpacity={setScalerOpacity}
                  setLabelColor={setLabelColor}
                  defaultPalletId={
                    defaultSetting?.default_chart_color_palette_id
                      ?.color_palette_id || 0
                  }
                  isDefaultColor={isDefaultColor}
                  updateDefaultColor={updateDefaultColor}
                  updateDefaultChartOptions={updateDefaultChartOptions}
                  isDefaultChartOptions={isDefaultChartOptions}
                  defaultChartOptions={defaultSetting?.chart_option}
                  initialData={defaultSetting?.color_details}
                  selectedCompany={selectedCompany}
                  userData={userData}
                  defaultScalarPaletteId={
                    defaultSetting?.default_scalar_color_palette_id
                      ?.color_palette_id
                  }
                />
                <FAQ
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  deleteModal={deleteModal}
                  selectedCompany={selectedCompany}
                  userData={userData}
                  faqData={defaultSetting?.faq}
                  contactData={defaultSetting?.contact}
                />
                <OtherSettings
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  companyOptions={companyOptions}
                  resultOutput={defaultSetting?.result_output || []}
                  updateResultOutput={updateResultOutput}
                  isReportOutBtn={isReportOutBtn}
                  dynamicOutput={defaultSetting?.dynamic_outcome_label || {}}
                  updateDynamicOutput={updateDynamicOutput}
                  isDynamicOutput={isDynamicOutput}
                  updateAssesmentLayout={updateAssesmentLayout}
                  isAssesmentLayout={isAssesmentLayout}
                  assessmentLayout={defaultSetting?.assessment_layout}
                />
                <LogoSettings
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  companyId={selectedCompany?.value}
                  setIsUpdateAllSetting={setIsUpdateAllSetting}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* add department */}
      <ModalComponent
        modalHeader="Add Department"
        show={showAddDep}
        onHandleCancel={adddepClose}
      >
        <Form>
          <Row className="rowGap">
            <Col lg={6}>
              <Form.Group className="form-group">
                <Form.Label>
                  Company Name<sup>*</sup>
                </Form.Label>
                <SelectField
                  placeholder="Company Name"
                  options={companyOptions}
                />
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="form-group">
                <Form.Label>
                  Department Name<sup>*</sup>
                </Form.Label>
                <InputField type="text" placeholder="Department Name" />
              </Form.Group>
            </Col>
            <Col>
              <div className="form-btn d-flex gap-2 justify-content-end">
                <Button
                  variant="secondary"
                  className="ripple-effect"
                  onClick={adddepClose}
                >
                  Cancel
                </Button>
                <Button variant="primary" className="ripple-effect">
                  Add Department
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </ModalComponent>
      {/* edit department */}
      <ModalComponent
        modalHeader="Edit Department"
        show={showEditDep}
        onHandleCancel={editdepClose}
      >
        <Form>
          <Row className="rowGap">
            <Col lg={6}>
              <Form.Group className="form-group">
                <Form.Label>
                  Company Name<sup>*</sup>
                </Form.Label>
                <SelectField
                  defaultValue={companyOptions[1]}
                  placeholder="Company Name"
                  options={companyOptions}
                />
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="form-group">
                <Form.Label>
                  Department Name<sup>*</sup>
                </Form.Label>
                <InputField
                  type="text"
                  placeholder="Department Name"
                  defaultValue="Business Analysis"
                />
              </Form.Group>
            </Col>
            <Col>
              <div className="form-btn d-flex gap-2 justify-content-end">
                <Button
                  variant="secondary"
                  className="ripple-effect"
                  onClick={editdepClose}
                >
                  Cancel
                </Button>
                <Button variant="primary" className="ripple-effect">
                  Update Department
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </ModalComponent>
      {/* copy comments modal  */}
      <ModalComponent
        modalHeader="Copy Comments"
        show={showCopyComment}
        onHandleCancel={copyCommentClose}
      >
        <Form action="">
          <Row className="row rowGap">
            <Col lg={6}>
              <Form.Group className="form-group">
                <Form.Label>
                  Assessment Name<sup>*</sup>
                </Form.Label>
                <SelectField
                  defaultValue={companyOptions[1]}
                  placeholder="Assessment Name"
                  options={companyOptions}
                />
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="form-group">
                <Form.Label>
                  Report Name<sup>*</sup>
                </Form.Label>
                <SelectField
                  defaultValue={companyOptions[1]}
                  placeholder="Report Name"
                  options={companyOptions}
                />
              </Form.Group>
            </Col>
          </Row>
          <div className="form-btn d-flex justify-content-end gap-2">
            <Button
              variant="secondary"
              className="ripple-effect"
              onClick={emailClose}
            >
              Cancel
            </Button>
            <Button variant="primary" className="ripple-effect">
              Copy to Report
            </Button>
          </div>
        </Form>
      </ModalComponent>
      {/* email template modal */}
      <ModalComponent
        modalHeader="Email Template"
        show={showEmail}
        onHandleCancel={emailClose}
      >
        <Form action="">
          <Row className="row rowGap align-items-end">
            <Col lg={10}>
              <Form.Group className="form-group">
                <Form.Label>
                  Email Group<sup>*</sup>
                </Form.Label>
                <SelectField
                  defaultValue={companyOptions[1]}
                  placeholder="Email Group"
                  options={companyOptions}
                />
              </Form.Group>
            </Col>
            <Col lg={2} className="d-flex justify-content-end">
              <Button variant="primary" className="ripple-effect px-3 py-2">
                Search
              </Button>
            </Col>
          </Row>
        </Form>
      </ModalComponent>
      {/* search add introduction modal */}
      <ModalComponent
        modalHeader="Search and Add - Introduction"
        show={showSearch}
        onHandleCancel={searchClose}
      >
        <Form action="">
          <Row className="row rowGap align-items-end">
            <Col lg={5}>
              <Form.Group className="form-group">
                <Form.Label>
                  Survey Type<sup>*</sup>
                </Form.Label>
                <SelectField
                  defaultValue={companyOptions[1]}
                  placeholder="Survey Type"
                  options={companyOptions}
                />
              </Form.Group>
            </Col>
            <Col lg={5}>
              <Form.Group className="form-group">
                <Form.Label>
                  Keywords<sup>*</sup>
                </Form.Label>
                <InputField
                  type="text"
                  placeholder="Keywords"
                  defaultValue="Keywords"
                />
              </Form.Group>
            </Col>
            <Col lg={2} className="d-flex justify-content-end">
              <Button variant="primary" className="ripple-effect px-3 py-2">
                Search
              </Button>
            </Col>
          </Row>
        </Form>
      </ModalComponent>

      <SweetAlert
        title="Are you sure?"
        text="You want to delete this data!"
        show={isAlertVisible}
        icon="warning"
        onConfirmAlert={onConfirmAlertModal}
        showCancelButton
        cancelButtonText="Cancel"
        confirmButtonText="Yes"
        setIsAlertVisible={setIsAlertVisible}
        isConfirmedTitle="Deleted!"
        isConfirmedText="Your file has been deleted."
      />
    </>
  );
}

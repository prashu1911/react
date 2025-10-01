import React, { useEffect, useRef, useState } from "react";
import { Form, Col, Row, Collapse, Dropdown, Spinner } from "react-bootstrap";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "customHooks";
import { commonService } from "services/common.service";
import { DragDropContext, Droppable, Draggable, useMouseSensor } from "react-beautiful-dnd";
import ReactDOM from "react-dom";
import { ADMIN_MANAGEMENT } from "apiEndpoints/AdminManagement/adminManagement";
import ConfigureFavorability from "./Modal/ConfigureFavorability";
import LogoReport from "./form/LogoReport";
import ResponseRate from "./form/ResponseRate";
import FavorabilityIndex from "./form/FavorabilityIndex";
import GeneralChart from "./form/GeneralChart";
import TornadoChart from "./form/TornadoChart";
import ErrorBarChart from "./form/ErrorBarChart";
import TargetChart from "./form/TargetChart";
import DisplayDatasetProperties from "./form/DisplayDatasetProperties";
// import HeatMap from './form/HeatMap';
import WordCloud from "./form/WordCloud";
import InformationGraphicBlock from "./form/InformationGraphicBlock";
import SupportingDocuments from "./form/SupportingDocuments";
import OpenEndResponses from "./form/OpenEndedResponses";
import GenerateCardCenter from "./GenerateCardCenter";
import adminRouteMap from "../../../../routes/Admin/adminRouteMap";
import DataPointControlTable from "./ReportDataTable/DataPointControlTable";
import ObjectControlTable from "./ReportDataTable/ObjectControlTable";
import QuestionControlTable from "./ReportDataTable/QuestionControlTable";
import DepartmentResponseRate from "./form/DepartmentResponseRate";
import ChangeOrderIcon from "../../../../assets/admin/images/arrow-down-up.svg";
import {
  Breadcrumb,
  Button,
  DataTableComponent,
  FallBackLoader,
  ImageElement,
  InputField,
  ModalComponent,
  SelectField,
  SweetAlert,
} from "../../../../components";
import HeatMap from "./form/HeatMap";
import { showErrorToast } from "helpers/toastHelper";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { getIRNavigationState, setIRNavigationState, updateIRReportData } from "../../../../redux/IRReportData/index.slice";
import { useDispatch } from "react-redux";
import Proximity from "./form/Proximity";
import PdfGenerator from "./downloadpdf";
import { useSelector } from "react-redux";

export default function ReportGenerator() {
  const { getloginUserData } = useAuth();
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const pdfComponentRef = useRef();
  const userData = getloginUserData();
  const [headingText, setheadingText] = useState("Report");
  const [ShowTemplateDropDown, setShowTemplateDropDown] = useState(true);
  const [ShowDatasetDropDown, setShowDatasetDropDown] = useState(true);
  const [DisableName, setDisableName] = useState(false);
  const [ReportId, setReportId] = useState();
  const [ReportSaved, setReportSaved] = useState(1);
  const [TemplateFlag, setTemplateFlag] = useState();
  const [SectionData, setSectionData] = useState(null);
  const [editReportNameInput, seteditReportNameInput] = useState("");
  const [DatasetFilterData, setDatasetFilterData] = useState([]);
  const dropdownToggleRef = useRef(null);
  const location = useLocation();
  const navigationState = useSelector(getIRNavigationState);

  const type = navigationState?.type 
  const reportID = navigationState?.reportID;
  const reportName = navigationState?.reportName;
  const companyName = navigationState?.companyName;
  const companyId = navigationState?.companyId;
  const assessmentName = navigationState?.assessmentName;
  const assessmentId = navigationState?.assessmentId;
  const templateName = navigationState?.templateName;
  const templateId = navigationState?.templateId;
  const datasetName = navigationState?.datasetName;
  const datasetId = navigationState?.datasetId;
  const from = navigationState?.from;


  const [generatedCharts, setGeneratedCharts] = useState([]);
  const [generateInitialPdf, setGenerateInitialPdf] = useState(false);
  const [downloadExistPdf, setDownloadExistPdf] = useState(null);
  // const [updatedSectionId, setUpdatedSectionId] = useState(null);

  const getAllWidgetsDetails = (data) => {
    setGeneratedCharts(data);
    setGenerateInitialPdf(false);
  };

  





  // breadcrumb
  const breadcrumb = [
    {
      path: "#!",
      name: "Intelligent Report",
    },

    {
      path: "#",
      name: headingText,
    },
  ];

  const [isCollapsed2, setIsCollapsed2] = useState(false);

  const [open, setOpen] = useState(true);
  const [commonCollapse, setCommonCollapse] = useState(null);
  const commonToggleCollapse = (collapseId) => {
    setCommonCollapse(commonCollapse?.SectionId === collapseId?.SectionId ? null : collapseId);
    setIsCollapsed2(true);
  };

  // benchmark Options
  const benchmarkOptions = [
    { value: "WSA 2024 Overall", label: "WSA 2024 Overall" },
    {
      value: "Administrative, Support, Waste Management and Remediation Services",
      label: "Administrative, Support, Waste Management and Remediation Services",
    },
    { value: "Agriculture, Fishing and Hunting", label: "Agriculture, Fishing and Hunting" },
    { value: "Arts, Entertainment, and Recreation", label: "Arts, Entertainment, and Recreation" },
    { value: "Banking Only (No Insurance)", label: "Banking Only (No Insurance)" },
  ];

  const [DeleteSectionModal, setDeleteSectionModal] = useState(false);
  const DeleteSectionModalClose = () => setDeleteSectionModal(false);

  const [EditNameModal, setEditNameModal] = useState(false);
  const editNameModalClose = () => setEditNameModal(false);
  const editNameModalShow = () => setEditNameModal(true);

  const [showManageDataset, setShowManageDataset] = useState(false);
  const manageDatasetClose = () => setShowManageDataset(false);
  const manageDatasetShow = () => setShowManageDataset(true);

  const [showDataPointControl, setShowDataPointControl] = useState(false);
  const dataPointControlClose = () => setShowDataPointControl(false);
  const dataPointControlShow = () => setShowDataPointControl(true);

  const [showQuestionControl, setShowQuestionControl] = useState(false);
  const questionControlClose = () => setShowQuestionControl(false);
  const questionControlShow = () => setShowQuestionControl(true);

  const [showConfigurationModal, setShowConfigurationModal] = useState(false);
  const ConfigurationModalClose = () => setShowConfigurationModal(false);
  const ConfigurationModalShow = () => setShowConfigurationModal(true);

  const [showObjectControl, setShowObjectControl] = useState(false);
  const objectControlClose = () => setShowObjectControl(false);
  const objectControlShow = () => setShowObjectControl(true);

  const [benchmarkControl, setBenchmarkControl] = useState(false);
  const benchmarkClose = () => setBenchmarkControl(false);

  const [showDatasetFilter, setShowDatasetFilter] = useState(false);
  const datasetFilterClose = () => {
    setShowDatasetFilter(false);
    setShowManageDataset(true);
  };
  const datasetFilterShow = () => {
    setShowDatasetFilter(true);
    setShowManageDataset(false);
  };

  const reportManageDatasetColumns = [
    {
      title: "S.No.",
      dataKey: "no",
      columnHeaderClassName: "no-sorting w-1 text-center",
      render: (value, row, index) => {
        return <p style={{ width: "1.4rem", padding: 0, margin: 0 }}>{index + 1}</p>;
      },
    },
    {
      title: "Dataset Name",
      dataKey: "label",
      columnHeaderClassName: "no-sorting",
    },
    {
      title: "Description",
      dataKey: "description",
    },
    {
      title: "Action",
      dataKey: "action",
      columnHeaderClassName: "no-sorting",
      render: (value) => {
        return (
          <ul className="list-inline action mb-0">
            <li className="list-inline-item">
              <Link
                className="icon-primary"
                onClick={(e) => {
                  console.log(value);

                  e.preventDefault();
                  getDataset(value.value);
                }}
              >
                <em className="icon-eye" />
              </Link>
            </li>
            <li className="list-inline-item">
              {/* <Link to="#!" className="icon-danger" onClick={deleteModal}>
                  <em className="icon-delete"/>
                </Link> */}
            </li>
          </ul>
        );
      },
    },
  ];
  const reporDatasetFilterColumns = [
    {
      title: "S.No.",
      dataKey: "no",
      columnHeaderClassName: "no-sorting w-1 text-center",
    },
    {
      title: "Data Point",
      dataKey: "dataPoint",
      columnHeaderClassName: "no-sorting",
      render: (value) => {
        let filter = value.dataPoint;
        if (filter === "Manager_reportees") {
          filter = "Manager Reportees";
        }
        return filter;
      },
    },
    {
      title: "Filter",
      dataKey: "filter",
      columnHeaderClassName: "no-sorting",
      render: (value) => {
        let filter = value.filter;
        console.log("value", filter);
        if (filter === "D") {
          filter = "Direct";
        } else if (filter === "A") {
          filter = "All";
        }
        if (Array.isArray(value?.filter)) {
          filter = value?.filter[0]?.key;
        }
        return <div>{filter || "-"}</div>;
      },
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 991) {
        setIsCollapsed2(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [CompaniesList, setCompaniesList] = useState([]);
  const [SelectedCompany, setSelectedCompany] = useState(null);
  const [AssessmentList, setAssessmentList] = useState([]);
  const [SelectedAssessment, setSelectedAssessment] = useState(null);
  const [TamplateList, setTamplateList] = useState([]);
  const [SelectedTamplate, setSelectedTamplate] = useState(null);
  const [DatasetList, setDatasetList] = useState([]);
  const [ReportWidgetList, setReportWidgetList] = useState([]);
  const [WidgetList, setWidgetList] = useState();
  const [SelectedDataset, setSelectedDataset] = useState(null);
  const [ReportName, setReportName] = useState();
  const [dragwidgetList, setDragwidgetList] = useState(ReportWidgetList);
  const [ScrollToBottom, setScrollToBottom] = useState(false);
  const [DeleteSectionValue, setDeleteSectionValue] = useState({
    SectionName: null,
    SectionId: null,
  });
  const [loading, setloading] = useState(false);

  const handleReportChange = (event) => {
    setReportName(event.target.value);
  };

  const getDataset = async (datasetId) => {
    try {
      const response = await commonService({
        apiEndPoint: ADMIN_MANAGEMENT.getDataset(datasetId),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        const filterValue = response.data.data[0]?.filter_value;

        const datasetFilterData = [];

        let count = 1;

        for (const key in filterValue) {
          if (key === "demographic_filter") {
            datasetFilterData.push({
              no: count++,
              dataPoint: "Demographic: ",
              filter: filterValue[key]
                .map((item) => item.questionValue + ": " + item.responses.map((res) => res.responseValue).join(", "))
                .map((line) => <div key={line}>{line}</div>), // render each line in its own <div>
            });
          } else if (Array.isArray(filterValue[key])) {
            datasetFilterData.push({
              no: count++,
              dataPoint: key.charAt(0).toUpperCase() + key.slice(1),
              filter: filterValue[key].map((item) => item.name).join(", "),
            });
          } else {
            datasetFilterData.push({
              no: count++,
              dataPoint: key.charAt(0).toUpperCase() + key.slice(1),
              filter: filterValue[key],
            });
          }
        }

        setDatasetFilterData(datasetFilterData);

        datasetFilterShow();
      }
    } catch (error) {
      console.error("Error fetching elements:", error);
    }
  };

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
        setCompaniesList(
          response.data.data.map((company) => ({
            value: company.companyID,
            label: company.comapnyName, // Fix typo: comapnyName → companyName
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching elements:", error);
    }
  };
  const fetchAssessment = async (companyID) => {
    try {
      const response = await commonService({
        apiEndPoint: ADMIN_MANAGEMENT.getAssessmentList(companyID.value),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        setAssessmentList(
          response.data.data.map((company) => ({
            value: company.assessment_id,
            label: company.assessment_name,
          }))
        );

        if (assessmentId) {
          if (response.data.data.find((a) => a.assessment_id === assessmentId)) {
            setSelectedAssessment({
              label: assessmentName,
              value: assessmentId,
            });
          }
        }
      }
    } catch (error) {
      console.error("Error fetching elements:", error);
    }
  };
  const fetchSectionData = async (sectionId, flag) => {
    try {
      const response = await commonService({
        apiEndPoint: ADMIN_MANAGEMENT.getIRSectionData(sectionId, TemplateFlag, flag),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        return response.data.data;
      }
    } catch (error) {
      console.error("Error fetching elements:", error);
    }
  };

  const createTemplate = async () => {
    if (!SelectedCompany?.value) {
      showErrorToast("Please select a company.");
      return;
    }

    if (!SelectedAssessment?.value) {
      showErrorToast("Please select an assessment.");
      return;
    }

    if (!ReportName?.trim()) {
      showErrorToast("Please enter a valid report name.");
      return;
    }
    try {
      const response = await commonService({
        apiEndPoint: ADMIN_MANAGEMENT.createTemplate,
        bodyData: {
          assessmentID: SelectedAssessment?.value,
          companyMasterID: userData?.companyMasterID,
          companyID: SelectedCompany?.value,
          templateName: ReportName,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        toastType: {
          success: "Report Created Successfully",
          error: "Failed to Create Report",
        },
      });
      if (response?.status) {
        dispatch(setIRNavigationState({
          type: "editTemplate",
          from: "create",
          reportID: response.data.data,
          reportName: ReportName,
          companyName: SelectedCompany?.label,
          companyId: SelectedCompany?.value,
          assessmentName: SelectedAssessment?.label,
          assessmentId: SelectedAssessment?.value,
        }))
        setCompaniesList([]);
        setAssessmentList([]);
        setTamplateList([]);
        setDatasetList([]);
        setReportSaved(2);
      }
    } catch (error) {
      console.error("Error fetching elements:", error);
    }
  };
  const createReport = async () => {
    console.log("SelectedAssessment", SelectedDataset, DatasetList);

    if (!SelectedCompany?.value) {
      showErrorToast("Please select a company.");
      return;
    }

    if (!SelectedAssessment?.value) {
      showErrorToast("Please select an assessment.");
      return;
    }
    if (!SelectedTamplate?.value) {
      showErrorToast("Please select an Template.");
      return;
    }
    if (!SelectedDataset?.value) {
      showErrorToast("Please select an Dateset.");
      return;
    }

    if (!ReportName?.trim()) {
      showErrorToast("Please enter a valid report name.");
      return;
    }
    try {
      const response = await commonService({
        apiEndPoint: ADMIN_MANAGEMENT.createReport,
        bodyData: {
          assessmentID: SelectedAssessment?.value,
          companyMasterID: userData?.companyMasterID,
          companyID: SelectedCompany?.value,
          templateID: SelectedTamplate?.value,
          datasetID: SelectedDataset?.value,
          reportName: ReportName,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        toastType: {
          success: "Report Created Successfully",
          error: "Failed to Create Report",
        },
      });
      if (response?.status) {
        dispatch(setIRNavigationState({
          type: "savedreport",
          from: "create",
          reportID: response.data.data,
          reportName: ReportName,
          companyName: SelectedCompany?.label,
          companyId: SelectedCompany?.value,
          assessmentName: SelectedAssessment?.label,
          assessmentId: SelectedAssessment?.value,
          templateName: SelectedTamplate?.label,
          templateId: SelectedTamplate?.value,
          datasetName: SelectedDataset?.label,
          datasetId: SelectedDataset?.value,
        }))
        setCompaniesList([]);
        setAssessmentList([]);
        setTamplateList([]);
        setDatasetList([]);
        setReportSaved(2);
      }
    } catch (error) {
      console.error("Error fetching elements:", error);
    }
  };
  const updateSection = async (data) => {
    setloading(true);
    try {
      const response = await commonService({
        apiEndPoint: ADMIN_MANAGEMENT.updateSection,
        bodyData: {
          ...data,
          templateFlag: TemplateFlag,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        toastType: {
          success: "Updated Successfully",
          error: "Failed to updated",
        },
      });
      if (response?.status) {
        await fetchSectionData(data?.sectionID, TemplateFlag).then((res) => {
          dispatch(
            updateIRReportData({
              unsavedChanges: false,
              widgetTitle: null,
            })
          );
          setSectionData((prevData) => ({
            ...prevData,
            [data?.sectionID]: res,
          }));
          // setUpdatedSectionId(data?.sectionID);
        });
        setloading(false);
      }
      setloading(false);
    } catch (error) {
      setloading(false);
      console.error("Error fetching elements:", error);
    }
  };

  const updateSingleSection = async (sectionId) => {
    await fetchSectionData(sectionId, TemplateFlag).then((res) => {
      setSectionData({
        ...SectionData,
        [sectionId]: res,
      });
    });
  };

  const fetchTamplate = async (compnayID) => {
    try {
      const response = await commonService({
        apiEndPoint: ADMIN_MANAGEMENT.getTemplateList(SelectedAssessment?.value, compnayID?.value),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        setTamplateList(
          response.data.data.map((company) => ({
            value: company.templateID,
            label: company.templateName,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching elements:", error);
    }
  };

  const fetchDataset = async () => {
    try {
      const response = await commonService({
        apiEndPoint: ADMIN_MANAGEMENT.getDatasetList(SelectedAssessment?.value, true),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        setDatasetList(
          response.data.data.map((company) => ({
            value: company.dataset_id,
            label: company.name,
            description: company?.description,
          }))
        );
        if (datasetId) {
          if (response.data.data.find((a) => a.dataset_id == datasetId)) {
            setSelectedDataset({
              label: datasetName,
              value: datasetId,
            });
          }
        }
      }
    } catch (error) {
      console.error("Error fetching elements:", error);
    }
  };
  const updateAllSectionsData = async (sectionIDs, flag) => {
    try {
      // ✅ Fetch all section data concurrently using Promise.all
      const sectionDataArray = await Promise.all(
        sectionIDs.map(async (sectionId) => {
          const data = await fetchSectionData(sectionId, flag);
          return { sectionId, data };
        })
      );

      // ✅ Transform fetched data into an object where keys are sectionIDs
      const updatedSectionData = sectionDataArray.reduce((acc, item) => {
        acc[item.sectionId] = item.data;
        return acc;
      }, {});

      // ✅ Set all data at once
      setSectionData(updatedSectionData);
    } catch (error) {
      console.error("Error fetching section data:", error);
    }
  };
  const fetchReportWidgets = async (reportId, flag, type, sectionId) => {
    try {
      const response = await commonService({
        apiEndPoint: ADMIN_MANAGEMENT.getReportWidgetList(reportId, flag),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        setReportWidgetList(response.data.data);
        setDragwidgetList(response.data.data);

        if (type == "All") {
          const sectionIDs = response.data.data.map((item) => item.sectionID);
          updateAllSectionsData(sectionIDs, flag !== 0);
        } else if (type == "AddWidget") {
          updateSingleSection(sectionId)
        }

      }
    } catch (error) {
      console.error("Error fetching elements:", error);
    }
  };
  const fetchWidgetList = async () => {
    try {
      const response = await commonService({
        apiEndPoint: ADMIN_MANAGEMENT.getCompanyWidgetList(userData.companyMasterID, companyId),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        setWidgetList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching elements:", error);
    }
  };
  const fetchTamplateWidgetList = async () => {
    try {
      const response = await commonService({
        apiEndPoint: ADMIN_MANAGEMENT.getTemplateWidgetList(userData.companyMasterID, companyId),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        setWidgetList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching elements:", error);
    }
  };

  const addWidget = async (widgetID) => {
    try {
      const response = await commonService({
        apiEndPoint: ADMIN_MANAGEMENT?.addIRWidget,
        bodyData: {
          assessmentID: SelectedAssessment?.value,
          companyMasterID: userData?.companyMasterID,
          companyID: SelectedCompany?.value,
          templateFlag: TemplateFlag,
          widgetID,

          templateID: TemplateFlag ? ReportId : SelectedTamplate?.value,
          ...(!TemplateFlag && { reportID: ReportId }),
          ...(!TemplateFlag && { datasetID: SelectedDataset.value }),
        },

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        toastType: {
          success: "Widget Added Successfully",
          error: "Failed to add widget",
        },
      });
      if (response?.status) {
        console.log("ScrollToBottom", response?.data?.data?.sectionID);

        if (TemplateFlag) {
          fetchReportWidgets(ReportId, 1, "AddWidget", response?.data?.data?.sectionID);
          setScrollToBottom(response?.data?.data?.sectionID);
        } else {
          fetchReportWidgets(ReportId, 0, "AddWidget", response?.data?.data?.sectionID);
          setScrollToBottom(response?.data?.data?.sectionID);
        }
      }
    } catch (error) {
      console.error("Error fetching elements:", error);
    }
  };
  const changeSectionOrder = async (newOrder) => {
    try {
      const response = await commonService({
        apiEndPoint: ADMIN_MANAGEMENT.updateIRSectionOrder,
        bodyData: {
          primaryID: Number(reportID),
          sectionOrder: newOrder,
          templateFlag: TemplateFlag,
        },

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        toastType: {
          success: "Widget Added Successfully",
          error: "Failed to add widget",
        },
      });
      if (response?.status) {
        if (TemplateFlag) {
          fetchReportWidgets(ReportId, 1, "order");
        } else {
          fetchReportWidgets(ReportId, 0, "order");
        }
      }
    } catch (error) {
      console.error("Error fetching elements:", error);
    }
  };

  const deleteSection = async () => {
    if (DeleteSectionValue?.SectionId === commonCollapse?.SectionId) {
      setCommonCollapse(null);
    }
    try {
      const response = await commonService({
        apiEndPoint: ADMIN_MANAGEMENT.deleteIRSection(DeleteSectionValue?.SectionId, TemplateFlag),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        toastType: {
          success: "Section Deleted Successfully",
          error: "Failed to Delete Section",
        },
      });

      if (response?.status) {
        if (TemplateFlag) {
          fetchReportWidgets(ReportId, 1, "Delete");
        } else {
          fetchReportWidgets(ReportId, 0, "Delete");
        }
        return true;
      }
    } catch (error) {
      console.error("Error fetching elements:", error);
      return false;
    }
  };

  const updateLocationState = (newParams) => {
    const currentState = navigationState || {};

    // Merge and update the state
    const updatedState = {
      ...currentState,
      ...newParams,
    };

    dispatch(setIRNavigationState(updatedState))

    // navigate(location.pathname, { state: updatedState });
  };

  const editReportName = async () => {
    try {
      const response = await commonService({
        apiEndPoint: ADMIN_MANAGEMENT.editReportName,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        bodyData: {
          reportID,
          reportName: editReportNameInput,
        },
        toastType: {
          success: "Report Name Updated Successfully",
          error: "Failed to Update Report Name",
        },
      });

      if (response?.status) {
        updateLocationState({
          reportName: editReportNameInput,
        });
        setReportName(editReportNameInput);
        editNameModalClose();

        return true;
      }
    } catch (error) {
      console.error("Error fetching elements:", error);
      return false;
    }
  };
  const editTamplateName = async () => {
    try {
      const response = await commonService({
        apiEndPoint: ADMIN_MANAGEMENT.editTemplateName,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        bodyData: {
          templateID: reportID,
          templateName: editReportNameInput,
        },
        toastType: {
          success: "Report Name Updated Successfully",
          error: "Failed to Update Report Name",
        },
      });

      if (response?.status) {
        updateLocationState({
          reportName: editReportNameInput,
        });
        setReportName(editReportNameInput);
        editNameModalClose();

        return true;
      }
    } catch (error) {
      console.error("Error fetching elements:", error);
      return false;
    }
  };

  useEffect(() => {
    if (type === "savedreport") {
      setTemplateFlag(false);
      fetchReportWidgets(reportID, 0, "All");
      setSelectedAssessment({
        label: assessmentName,
        value: assessmentId,
      });
      setSelectedCompany({
        label: companyName,
        value: companyId,
      });
      setSelectedTamplate({
        label: templateName,
        value: templateId,
      });
      setSelectedDataset({
        label: datasetName,
        value: datasetId,
      });
      fetchWidgetList(companyId);
      if (from == "create") {
        setheadingText("Create Report");
      } else {
        setheadingText("Edit Report");
      }
      setDisableName(true);
      setReportName(reportName);
      setReportId(reportID);
      seteditReportNameInput(reportName);

      setOpen(true);
    } else if (type === "editTemplate") {
      setTemplateFlag(true);
      setSelectedCompany({
        label: companyName,
        value: companyId,
      });
      setSelectedAssessment({
        label: assessmentName,
        value: assessmentId,
      });
      fetchReportWidgets(reportID, 1, "All");
      fetchTamplateWidgetList(companyId);
      if (from == "create") {
        setheadingText("Create Template");
      } else {
        setheadingText("Edit Template");
      }
      setShowDatasetDropDown(false);
      setDisableName(true);
      setShowTemplateDropDown(false);
      setReportName(reportName);
      setReportId(reportID);
      seteditReportNameInput(reportName);
      setOpen(true);
    } else if (type === "createReport") {

      if (companyId && companyName && assessmentId && assessmentName && datasetName && datasetId) {
        setSelectedCompany({
          label: companyName,
          value: companyId,
        });
        setSelectedAssessment({
          label: assessmentName,
          value: assessmentId,
        });
        setSelectedDataset({
          label: datasetName,
          value: datasetId,
        });
      }

      setTemplateFlag(false);
      fetchCompanies();
      setheadingText("Create Report");
    } else if (type === "createTemplate") {
      setTemplateFlag(true);
      fetchCompanies();
      setShowTemplateDropDown(false);
      setShowDatasetDropDown(false);
      setheadingText("Create Template");
    }
  }, [ReportSaved]);

  useEffect(() => {
    if (SelectedCompany) {
      if (type === "createReport" || type === "createTemplate") {
        setSelectedAssessment(null);
        setSelectedDataset(null);
        setDatasetList([]);
        setTamplateList([]);
        fetchAssessment(SelectedCompany);
      }
    }
  }, [SelectedCompany]);

  useEffect(() => {
    if (SelectedAssessment) {
      if (type === "createReport" || type === "createTemplate") {
        setSelectedDataset(null);
        setSelectedTamplate(null);
        setDatasetList([]);
        setTamplateList([]);
        fetchDataset(SelectedAssessment);
        fetchTamplate(SelectedCompany);
      }
    }
  }, [SelectedAssessment]);
  useEffect(() => {
    dispatch(
      updateIRReportData({
        unsavedChanges: false,
        widgetTitle: null,
      })
    );
  }, [commonCollapse]);

  const onConfirmAlertModal = () => {
    DeleteSectionModalClose();
    deleteSection();
  };
  const onConfirmEditNameModal = () => {
    if (TemplateFlag) {
      return editTamplateName(editReportNameInput);
    } else {
      return editReportName(editReportNameInput);
    }
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(dragwidgetList);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setDragwidgetList(items);

    // If you want array of widgetIDs in new order
    const newOrderWidgetIDs = items.map((item) => item.sectionID);
    changeSectionOrder(newOrderWidgetIDs);
  };

  const DraggedItemPortal = ({ children }) => {
    const mount = document.getElementById("drag-root") || document.body;
    return ReactDOM.createPortal(children, mount);
  };

  const centerRef = useRef(null);
  const rightRef = useRef(null);
  const [rightHeight, setRightHeight] = useState(0);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (rightRef.current) {
        console.log(rightRef.current.offsetHeight);

        setRightHeight(rightRef.current.offsetHeight);
      }
    });

    if (rightRef.current) {
      resizeObserver.observe(rightRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [commonCollapse]); // Update height when sidebar changes

  // Scroll to the top function
  const scrollToTop = () => {
    // Scroll the generateCardRef to the top
    if (centerRef.current) {
      centerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
    // Scroll the body to the top
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* head title start */}
      <section className="commonHead">
        <h1 className="commonHead_title">Welcome Back!</h1>
        <Breadcrumb breadcrumb={breadcrumb} />
      </section>
      {/* head title end */}
      <div className="collpseFilter">
        <div
          className="pageTitle d-flex align-items-center justify-content-between collpseFilter_title mb-0"
          onClick={() => setOpen(!open)}
          aria-controls="reportGen-collapse"
          aria-expanded={open}
        >
          <h2 className="mb-0">{headingText}</h2>
          <em className="icon-drop-down toggleIcon" />
        </div>
        <Collapse in={open}>
          <div id="reportGen-collapse">
            <Form className="formCard bg-transparent m-0">
              <div className="d-flex align-items-end flex-wrap gap-2">
                <Row className="g-2 w-100 flex-wrap d-flex">
                  <Col className="flex-grow-1">
                    <Form.Group className="form-group mb-0">
                      <Form.Label>Company</Form.Label>
                      <SelectField
                        isDisabled={CompaniesList?.length === 0}
                        value={SelectedCompany}
                        onChange={setSelectedCompany}
                        placeholder="Select Company Name"
                        options={CompaniesList}
                        styles={{
                          control: (base) => ({
                            ...base,
                            width: "100%",
                            minHeight: "2.5rem",
                          }),
                          valueContainer: (base) => ({
                            ...base,
                            overflow: "hidden",
                          }),
                          singleValue: (base) => ({
                            ...base,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }),
                        }}
                      />
                    </Form.Group>
                  </Col>

                  <Col className="flex-grow-1">
                    <Form.Group className="form-group mb-0 ">
                      <Form.Label>Survey</Form.Label>
                      <SelectField
                        isDisabled={AssessmentList?.length === 0}
                        value={SelectedAssessment}
                        onChange={setSelectedAssessment}
                        placeholder="Select Survey Name"
                        options={AssessmentList}
                        styles={{
                          control: (base) => ({
                            ...base,
                            width: "100%",
                            minHeight: "2.5rem",
                          }),
                          valueContainer: (base) => ({
                            ...base,
                            overflow: "hidden",
                          }),
                          singleValue: (base) => ({
                            ...base,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }),
                        }}
                      />
                    </Form.Group>
                  </Col>

                  {ShowTemplateDropDown && (
                    <Col className="flex-grow-1">
                      <Form.Group className="form-group mb-0">
                        <Form.Label>Template</Form.Label>
                        <SelectField
                          isDisabled={TamplateList?.length === 0}
                          value={SelectedTamplate}
                          onChange={setSelectedTamplate}
                          placeholder="Select Template Name"
                          options={TamplateList}
                          styles={{
                            control: (base) => ({
                              ...base,
                              width: "100%",
                              minHeight: "2.5rem",
                            }),
                            valueContainer: (base) => ({
                              ...base,
                              overflow: "hidden",
                            }),
                            singleValue: (base) => ({
                              ...base,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }),
                          }}
                        />
                      </Form.Group>
                    </Col>
                  )}

                  {ShowDatasetDropDown && (
                    <Col className="flex-grow-1">
                      <Form.Group className="form-group mb-0">
                        <div className="d-flex flex-wrap justify-content-between">
                          <Form.Label className="w-auto">Dataset</Form.Label>
                          {DatasetList?.length > 0 && (
                            <Link
                              onClick={(e) => {
                                e.preventDefault();
                                manageDatasetShow();
                              }}
                              className="link-primary"
                            >
                              Manage
                            </Link>
                          )}
                        </div>
                        <SelectField
                          isDisabled={DatasetList?.length === 0}
                          value={SelectedDataset}
                          onChange={setSelectedDataset}
                          placeholder="Select Dataset Name"
                          options={DatasetList}
                          styles={{
                            control: (base) => ({
                              ...base,
                              width: "100%",
                              minHeight: "2.5rem",
                            }),
                            valueContainer: (base) => ({
                              ...base,
                              overflow: "hidden",
                            }),
                            singleValue: (base) => ({
                              ...base,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }),
                          }}
                        />
                      </Form.Group>
                    </Col>
                  )}

                  <Col className="flex-grow-1">
                    <Form.Group className="form-group mb-0">
                      <div className="d-flex flex-wrap justify-content-between">
                        <Form.Label className="w-auto">
                          {headingText === "Edit Template" || headingText === "Create Template" ? "Template" : "Report"}
                        </Form.Label>
                        {type !== "createReport" && type !== "createTemplate" && (
                          <div style={{ cursor: "pointer" }} onClick={editNameModalShow} className="link-primary">
                            Edit Name
                          </div>
                        )}
                      </div>
                      <InputField
                        style={{ height: "2.27rem" }}
                        disabled={DisableName}
                        value={ReportName}
                        onChange={handleReportChange}
                        type="text"
                        placeholder={
                          headingText === "Edit Template" || headingText === "Create Template"
                            ? "Template Name"
                            : "Report Name"
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* {type == "createReport" || type == "createTemplate" && */}
                {(type === "createReport" || type === "createTemplate") && (
                  <Button
                    style={{ marginLeft: "auto", marginTop: "1rem" }}
                    onClick={() => {
                      if (TemplateFlag) {
                        createTemplate();
                      } else {
                        createReport();
                      }
                    }}
                    variant="primary ripple-effect"
                  >
                    {TemplateFlag ? "Create Template" : "Create Report"}
                  </Button>
                )}
              </div>
            </Form>
          </div>
        </Collapse>
      </div>
      <div className="pageContent reportGenerator">
        {type !== "createReport" && type !== "createTemplate" && (
          <div className="filter pt-0 d-flex  justify-content-between flex-wrap gap-2">
            <ul
              style={{ display: "flex", alignSelf: "flex-end", width: "100%", alignItems: "center" }}
              className="list-unstyled d-flex mb-0 flex-wrap gap-2"
            >
              {ReportWidgetList?.length > 0 && (
                <li>
                  <Dropdown className="commonDropdown" align="end">
                    <Dropdown.Toggle
                      as="div"
                      style={{
                        padding: 0,
                        border: "none",
                        background: "transparent",
                        backgroundColor: "#fff",
                        color: "#fff",
                        display: "flex",
                      }}
                    >
                      <Button
                        variant="primary ripple-effect"
                        style={{
                          padding: "8px 12px",
                          border: "none",
                          borderRadius: "6px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img src={ChangeOrderIcon} alt="Change Order" width="20" height="20" />
                      </Button>
                    </Dropdown.Toggle>

                    <Dropdown.Menu
                      style={{
                        minWidth: "300px",
                        maxHeight: "400px",
                        overflowY: "auto",
                        padding: "16px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        borderRadius: "8px",
                      }}
                    >
                      <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Droppable droppableId="widgetList" direction="vertical">
                          {(provided) => (
                            <ul
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              style={{
                                listStyle: "none",
                                padding: 0,
                                margin: 0,
                              }}
                            >
                              {dragwidgetList?.map((item, index) => (
                                <Draggable key={item.sectionID} draggableId={item.sectionID.toString()} index={index}>
                                  {(provided, snapshot) => {
                                    const content = (
                                      <li
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{
                                          ...provided.draggableProps.style,
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "10px",
                                          padding: "10px 12px",
                                          marginBottom: "10px",
                                          border: "1px solid #dee2e6",
                                          borderRadius: "6px",
                                          backgroundColor: snapshot.isDragging ? "#f0f8ff" : "#fff",
                                          boxShadow: snapshot.isDragging ? "0 4px 10px rgba(0,0,0,0.1)" : "none",
                                          cursor: "grabbing",
                                          zIndex: 9999,
                                        }}
                                      >
                                        <em className="icon icon-drag text-muted" />
                                        <span
                                          style={{
                                            flex: 1,
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                          }}
                                        >
                                          {item?.widgetTag === "std_page_break" ? "Page Break" : item.section_title}
                                        </span>
                                      </li>
                                    );

                                    return snapshot.isDragging ? (
                                      <DraggedItemPortal>{content}</DraggedItemPortal>
                                    ) : (
                                      content
                                    );
                                  }}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </ul>
                          )}
                        </Droppable>
                      </DragDropContext>
                    </Dropdown.Menu>
                  </Dropdown>
                </li>
              )}

              <li style={{ marginLeft: "auto" }}>
                <Dropdown className="commonDropdown" align="end">
                  <Dropdown.Toggle ref={dropdownToggleRef}>Add widget</Dropdown.Toggle>
                  <Dropdown.Menu style={{}}>
                    {WidgetList?.map((item) => {
                      return (
                        <>
                          <button
                            onClick={() => {
                              addWidget(item.widget_id);
                              // ✅ Close dropdown
                              dropdownToggleRef.current?.click();
                            }}
                            className="dropdown-item"
                            type="button"
                          >
                            {item?.widget_name}
                          </button>
                        </>
                      );
                    })}
                  </Dropdown.Menu>
                </Dropdown>
              </li>
              <li>
                <Dropdown className="commonDropdown">
                  <Dropdown.Toggle>
                    <em className="icon-settings-outline" />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={ConfigurationModalShow}>
                      <em className="icon icon-summary-report" />
                      Configuration
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </li>
              {/* {!TemplateFlag && (
                  <li>
                    <Button onClick={handleDownloadPdf} variant="primary ripple-effect">
                      <em className="icon-eye me-2" /> Preview
                    </Button>
                  </li>
                )} */}

              <li>
                {(generatedCharts?.length > 0 && downloadExistPdf === null) || downloadExistPdf ? (
                  <PdfGenerator
                    ReportWidgetList={ReportWidgetList}
                    SectionData={SectionData}
                    generatedImages={generatedCharts || []}
                    downloadExistPdf={downloadExistPdf}
                    revertBack={(data) => {
                      setloading(false);
                      setDownloadExistPdf(false);
                    }}
                  />
                ) : null}
              </li>
              {SectionData && !TemplateFlag && (
                // <li>
                //   <Button
                //     variant="primary ripple-effect"
                //     disabled={generateInitialPdf || loading}
                //     onClick={handleGeneratePdf}
                //   >
                //     Generate Preview
                //   </Button>
                // </li>

                <li className="list-inline-item">
                  <Button variant="primary ripple-effect">
                    <a
                      href={`${adminRouteMap.REPORTPREVIEW.path}?reportid=${reportID}`}
                      className="icon-primary customATagButton"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontFamily: "Poppins, Arial, sans-serif !important", color: "#fff" }}
                    >
                      Preview
                    </a>
                  </Button>
                </li>
              )}
            </ul>
          </div>
        )}

        <div  className={`generateCard ${loading ? "loading-overlay" : ""}`} style={{ position: "relative" }}>
          {loading && (
            <div className="loading-spinner-overlay">
              <Spinner color="blue" animation="border" size="lg" />
              <div>Loading...</div>
              {/* <FallBackLoader customStyles={{ height: "100%", padding: "1rem", borderRadius: "50px" }} /> */}
            </div>
          )}

          <div  className="generateCard">
            <div className="generateCard_inner d-flex flex-lg-row flex-column" style={{ opacity: loading ? 0.4 : 1 }}>
              {SectionData && (
                <div
                  ref={centerRef}
                  style={{
                    padding: 0,
                    margin: 0,
                    // width: "100%",
                    minHeight: "800px",
                    overflowY: "scroll",
                    height: rightHeight, // ← sync height here
                  }}
                >
                  <GenerateCardCenter
                    centerRef={centerRef}
                    pdfComponentRef={pdfComponentRef}
                    TemplateFlag={TemplateFlag}
                    ScrollToBottom={ScrollToBottom}
                    setScrollToBottom={setScrollToBottom}
                    setDeleteSectionValue={setDeleteSectionValue}
                    setDeleteSectionModal={setDeleteSectionModal}
                    SectionData={SectionData}
                    ReportWidgetList={ReportWidgetList}
                    setCommonCollapse={setCommonCollapse}
                    commonToggleCollapse={commonToggleCollapse}
                    commonCollapse={commonCollapse}
                    handleWidgetsDetails={getAllWidgetsDetails}
                    generatePdf={generateInitialPdf}
                    // updatedSectionId={updatedSectionId}
                  />
                  {ReportWidgetList?.length > 1 && (
                    <Link
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToTop();
                      }}
                      style={{
                        position: "sticky",
                        bottom: "3rem",
                        left: "calc(100% - 50px)",
                        padding: "10px",
                        backgroundColor: "#0968ac", // replace with your `color(500)` actual hex value
                        color: "#fff",
                        border: "none",
                        borderRadius: "50%",
                        cursor: "pointer",
                        height: "38px",
                        width: "38px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <em style={{ transform: "rotate(180deg)" }} className="icon-drop-down" />
                    </Link>
                  )}
                </div>
              )}
              {SectionData && commonCollapse && (
                <div
                  ref={rightRef}
                  style={{ display: "flex", flexDirection: "column" }}
                  className={`generateCard_right`}
                >
                  <div
                    onClick={() => {
                      setCommonCollapse(null);
                    }}
                    style={{ zIndex: 1, cursor: "pointer", marginLeft: "auto", marginBottom: "-1.4rem" }}
                    className="icon"
                  >
                    <em className="icon-close-circle" />
                  </div>
                  <div className="collapsedForm">
                    {commonCollapse?.collapseKey === "logoAndReportTitle" && (
                      <Collapse in={commonCollapse?.collapseKey === "logoAndReportTitle"}>
                        <Form>
                          <div className="reportTitle align-items-center mb-0">
                            <span>
                              {SectionData[commonCollapse?.SectionId]?.attributeData?.controlData?.controlTitle}
                            </span>
                          </div>
                          <LogoReport
                            updateSingleSection={updateSingleSection}
                            TemplateFlag={TemplateFlag}
                            SectionId={commonCollapse?.SectionId}
                            SectionData={SectionData[commonCollapse?.SectionId]}
                            loading={loading}
                            setloading={setloading}
                          />
                        </Form>
                      </Collapse>
                    )}
                    {commonCollapse?.collapseKey === "responseRate" && (
                      <Collapse in={commonCollapse?.collapseKey === "responseRate"}>
                        <Form>
                          <div className="reportTitle align-items-center mb-0 float-right">
                            <span>
                              {SectionData[commonCollapse?.SectionId]?.attributeData?.controlData?.controlTitle}
                            </span>
                          </div>
                          <ResponseRate
                            updateSection={updateSection}
                            SectionId={commonCollapse?.SectionId}
                            SectionData={SectionData[commonCollapse?.SectionId]}
                            dataPointControlShow={dataPointControlShow}
                          />
                        </Form>
                      </Collapse>
                    )}
                    {commonCollapse?.collapseKey === "departmentresponseRate" && (
                      <Collapse in={commonCollapse?.collapseKey === "departmentresponseRate"}>
                        <Form>
                          <div
                            style={{ marginRight: "1.3rem" }}
                            className="reportTitle align-items-center mb-0 float-right"
                          >
                            <span>
                              {SectionData[commonCollapse?.SectionId]?.attributeData?.controlData?.controlTitle}
                            </span>
                          </div>
                          <DepartmentResponseRate
                            updateSection={updateSection}
                            SectionId={commonCollapse?.SectionId}
                            SectionData={SectionData[commonCollapse?.SectionId]}
                            dataPointControlShow={dataPointControlShow}
                          />
                        </Form>
                      </Collapse>
                    )}
                    {commonCollapse?.collapseKey === "favorabilityIndex" && (
                      <Collapse in={commonCollapse?.collapseKey === "favorabilityIndex"}>
                        <Form>
                          <div className="reportTitle align-items-center mb-0 float-right">
                            <span>
                              {SectionData[commonCollapse?.SectionId]?.attributeData?.controlData?.controlTitle}
                            </span>
                          </div>
                          <FavorabilityIndex
                            TemplateFlag={TemplateFlag}
                            companyID={companyId}
                            reportID={reportID}
                            assessmentID={assessmentId || 0}
                            updateSection={updateSection}
                            SectionId={commonCollapse?.SectionId}
                            SectionData={SectionData[commonCollapse?.SectionId]}
                            objectControlShow={objectControlShow}
                            dataPointControlShow={dataPointControlShow}
                            ConfigurationModalShow={ConfigurationModalShow}
                          />
                        </Form>
                      </Collapse>
                    )}
                    {commonCollapse?.collapseKey === "proximity" && (
                      <Collapse in={commonCollapse?.collapseKey === "proximity"}>
                        <Form>
                          <div className="reportTitle align-items-center mb-0 float-right">
                            <span>
                              {SectionData[commonCollapse?.SectionId]?.attributeData?.controlData?.controlTitle}
                            </span>
                          </div>
                          <Proximity
                            TemplateFlag={TemplateFlag}
                            companyID={companyId}
                            reportID={reportID}
                            assessmentID={assessmentId || 0}
                            updateSection={updateSection}
                            SectionId={commonCollapse?.SectionId}
                            SectionData={SectionData[commonCollapse?.SectionId]}
                            objectControlShow={objectControlShow}
                            dataPointControlShow={dataPointControlShow}
                            ConfigurationModalShow={ConfigurationModalShow}
                          />
                        </Form>
                      </Collapse>
                    )}
                    {commonCollapse?.collapseKey === "favorabilityByIntention" && (
                      <Collapse in={commonCollapse?.collapseKey === "favorabilityByIntention"}>
                        <Form>
                          <div className="reportTitle align-items-center mb-0 float-right">
                            <span>
                              {SectionData[commonCollapse?.SectionId]?.attributeData?.controlData?.controlTitle}
                            </span>
                          </div>
                          <FavorabilityIndex
                            byIntention
                            TemplateFlag={TemplateFlag}
                            companyID={companyId}
                            reportID={reportID}
                            assessmentID={assessmentId || 0}
                            updateSection={updateSection}
                            SectionId={commonCollapse?.SectionId}
                            SectionData={SectionData[commonCollapse?.SectionId]}
                            objectControlShow={objectControlShow}
                            dataPointControlShow={dataPointControlShow}
                            ConfigurationModalShow={ConfigurationModalShow}
                          />
                        </Form>
                      </Collapse>
                    )}
                    {commonCollapse?.collapseKey === "generalChart" && (
                      <Collapse in={commonCollapse?.collapseKey === "generalChart"}>
                        <Form>
                          <div className="reportTitle align-items-center mb-0 float-right">
                            <span>
                              {SectionData[commonCollapse?.SectionId]?.attributeData?.controlData?.controlTitle}
                            </span>
                          </div>
                          <GeneralChart
                            updateSection={updateSection}
                            SectionId={commonCollapse?.SectionId}
                            SectionData={SectionData[commonCollapse?.SectionId]}
                            objectControlShow={objectControlShow}
                            dataPointControlShow={dataPointControlShow}
                          />
                        </Form>
                      </Collapse>
                    )}
                    {commonCollapse?.collapseKey === "tornadoChart" && (
                      <Collapse in={commonCollapse?.collapseKey === "tornadoChart"}>
                        <Form>
                          <div className="reportTitle align-items-center mb-0 float-right">
                            <span>
                              {SectionData[commonCollapse?.SectionId]?.attributeData?.controlData?.controlTitle}
                            </span>
                          </div>
                          <TornadoChart
                            updateSection={updateSection}
                            SectionId={commonCollapse?.SectionId}
                            SectionData={SectionData[commonCollapse?.SectionId]}
                            objectControlShow={objectControlShow}
                            dataPointControlShow={dataPointControlShow}
                          />
                        </Form>
                      </Collapse>
                    )}
                    {commonCollapse?.collapseKey === "errorBarChart" && (
                      <Collapse in={commonCollapse?.collapseKey === "errorBarChart"}>
                        <Form>
                          <div className="reportTitle align-items-center mb-0 float-right">
                            <span>
                              {SectionData[commonCollapse?.SectionId]?.attributeData?.controlData?.controlTitle}
                            </span>
                          </div>
                          <ErrorBarChart
                            updateSection={updateSection}
                            SectionId={commonCollapse?.SectionId}
                            SectionData={SectionData[commonCollapse?.SectionId]}
                            objectControlShow={objectControlShow}
                            dataPointControlShow={dataPointControlShow}
                          />
                        </Form>
                      </Collapse>
                    )}
                    {commonCollapse?.collapseKey === "targetChart" && (
                      <Collapse in={commonCollapse?.collapseKey === "targetChart"}>
                        <Form>
                          <div className="reportTitle align-items-center mb-0 float-right">
                            <span>
                              {SectionData[commonCollapse?.SectionId]?.attributeData?.controlData?.controlTitle}
                            </span>
                          </div>
                          <TargetChart
                            updateSection={updateSection}
                            SectionId={commonCollapse?.SectionId}
                            SectionData={SectionData[commonCollapse?.SectionId]}
                            objectControlShow={objectControlShow}
                            dataPointControlShow={dataPointControlShow}
                          />
                        </Form>
                      </Collapse>
                    )}
                    {commonCollapse?.collapseKey === "datasetProperties" && (
                      <Collapse in={commonCollapse?.collapseKey === "datasetProperties"}>
                        <Form>
                          <div className="reportTitle align-items-center mb-0 float-right">
                            <span>
                              {SectionData[commonCollapse?.SectionId]?.attributeData?.controlData?.controlTitle}
                            </span>
                          </div>
                          <DisplayDatasetProperties
                            updateSection={updateSection}
                            SectionId={commonCollapse?.SectionId}
                            SectionData={SectionData[commonCollapse?.SectionId]}
                          />
                        </Form>
                      </Collapse>
                    )}
                    {commonCollapse?.collapseKey === "heatMap" && (
                      <Collapse in={true}>
                        <Form>
                          <div className="reportTitle align-items-center mb-0 float-right">
                            <span>
                              {SectionData[commonCollapse?.SectionId]?.attributeData?.controlData?.controlTitle}
                            </span>
                          </div>
                          <HeatMap
                            updateSection={updateSection}
                            SectionId={commonCollapse?.SectionId}
                            SectionData={SectionData[commonCollapse?.SectionId]}
                            objectControlShow={objectControlShow}
                            dataPointControlShow={dataPointControlShow}
                          />
                        </Form>
                      </Collapse>
                    )}
                    {commonCollapse?.collapseKey === "wordCloud" && (
                      <Collapse in={commonCollapse?.collapseKey === "wordCloud"}>
                        <Form>
                          <div className="reportTitle align-items-center mb-0 float-right">
                            <span>
                              {SectionData[commonCollapse?.SectionId]?.attributeData?.controlData?.controlTitle}
                            </span>
                          </div>
                          <WordCloud
                            updateSection={updateSection}
                            SectionId={commonCollapse?.SectionId}
                            SectionData={SectionData[commonCollapse?.SectionId]}
                            dataPointControlShow={dataPointControlShow}
                            questionControlShow={questionControlShow}
                          />
                        </Form>
                      </Collapse>
                    )}
                    {commonCollapse?.collapseKey === "pageBreak" && (
                      <Collapse in={commonCollapse?.collapseKey === "pageBreak"}>
                        <Form>
                          <div className="reportTitle align-items-center mb-0 float-right">
                            <span>
                              {SectionData[commonCollapse?.SectionId]?.attributeData?.controlData?.controlTitle}
                            </span>
                          </div>
                        </Form>
                      </Collapse>
                    )}
                    {commonCollapse?.collapseKey === "informationGraphic" && (
                      <Collapse in={commonCollapse?.collapseKey === "informationGraphic"}>
                        <Form>
                          <div className="reportTitle align-items-center mb-0 float-right">
                            <span>
                              {SectionData[commonCollapse?.SectionId]?.attributeData?.controlData?.controlTitle}
                            </span>
                          </div>
                          <InformationGraphicBlock
                            updateSection={updateSection}
                            SectionId={commonCollapse?.SectionId}
                            SectionData={SectionData[commonCollapse?.SectionId]}
                          />
                        </Form>
                      </Collapse>
                    )}
                    {commonCollapse?.collapseKey === "openEndedResponses" && (
                      <Collapse in={commonCollapse?.collapseKey === "openEndedResponses"}>
                        <Form>
                          <div className="reportTitle align-items-center mb-0 float-right">
                            <span>
                              {SectionData[commonCollapse?.SectionId]?.attributeData?.controlData?.controlTitle}
                            </span>
                          </div>
                          <OpenEndResponses
                            TemplateFlag={TemplateFlag}
                            updateSection={updateSection}
                            SectionId={commonCollapse?.SectionId}
                            SectionData={SectionData[commonCollapse?.SectionId]}
                            dataPointControlShow={dataPointControlShow}
                            questionControlShow={questionControlShow}
                          />
                        </Form>
                      </Collapse>
                    )}
                    {commonCollapse?.collapseKey === "supportingDocuments" && (
                      <Collapse in={commonCollapse?.collapseKey === "supportingDocuments"}>
                        <Form>
                          <div className="reportTitle align-items-center mb-0 float-right">
                            <span>
                              {SectionData[commonCollapse?.SectionId]?.attributeData?.controlData?.controlTitle}
                            </span>
                          </div>
                          <SupportingDocuments
                            updateSection={updateSection}
                            updateSingleSection={updateSingleSection}
                            TemplateFlag={TemplateFlag}
                            SectionId={commonCollapse?.SectionId}
                            SectionData={SectionData[commonCollapse?.SectionId]}
                          />
                        </Form>
                      </Collapse>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* edit Report name modal */}
      <ModalComponent
        modalHeader={TemplateFlag ? "Edit Template Name" : "Edit Report Name"}
        show={EditNameModal}
        onHandleCancel={editNameModalClose}
      >
        <Form>
          <Row className="rowGap">
            <Col xs={12}>
              <Form.Group className="form-group">
                <Form.Label>
                  {TemplateFlag ? "Template" : "Report"} Name<sup>*</sup>
                </Form.Label>
                <InputField
                  value={editReportNameInput}
                  onChange={(event) => {
                    seteditReportNameInput(event.target.value);
                  }}
                  type="text"
                  placeholder={`${TemplateFlag ? "Template" : "Report"} name`}
                />
              </Form.Group>
            </Col>
            <Col xs={12}>
              <div className="form-btn d-flex gap-2 justify-content-end">
                <Button variant="secondary" className="ripple-effect" onClick={editNameModalClose}>
                  Cancel
                </Button>
                <Button variant="primary" className=" ripple-effect" onClick={onConfirmEditNameModal}>
                  Change Name
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </ModalComponent>
      {/* manage dataset modal */}
      <ModalComponent modalHeader="Manage Dataset" show={showManageDataset} onHandleCancel={manageDatasetClose}>
        <div style={{ maxHeight: "500px", overflowY: "scroll" }}>
          <DataTableComponent showFooter={false} data={DatasetList} columns={reportManageDatasetColumns} />
        </div>
        <div style={{ marginTop: "1rem", marginBottom: "-1rem" }} className="d-flex justify-content-end">
          <Button variant="secondary" className="ripple-effect" onClick={manageDatasetClose}>
            Cancel
          </Button>
        </div>
      </ModalComponent>
      {/* dataset filter modal */}
      <ModalComponent
        size={"lg"}
        modalHeader="Manage Dataset"
        show={showDatasetFilter}
        onHandleCancel={datasetFilterClose}
      >
        <DataTableComponent showFooter={false} data={DatasetFilterData} columns={reporDatasetFilterColumns} />
        <div className="d-flex justify-content-end">
          <Button variant="secondary" className="ripple-effect" onClick={datasetFilterClose}>
            Cancel
          </Button>
        </div>
      </ModalComponent>
      {/* dataset filter modal */}
      <ModalComponent
        modalHeader="Data Point Control Panel"
        size="lg"
        show={showDataPointControl}
        onHandleCancel={dataPointControlClose}
      >
        <p className="mb-2">Company, Department, Participant, Reference Data and Benchmark Selection</p>
        <p>
          <span className="noteText fw-medium">IMPORTANT NOTICE: </span>Be careful to not overload your graph with too
          many data points. Visualization will not render properly.
        </p>
        <DataPointControlTable />
        <div className="d-flex justify-content-end gap-2">
          <Button variant="primary" className="ripple-effect">
            Save
          </Button>
          <Button variant="secondary" className="ripple-effect" onClick={dataPointControlClose}>
            Cancel
          </Button>
        </div>
      </ModalComponent>
      <ModalComponent
        modalHeader="Object Control Panel"
        size="lg"
        show={showObjectControl}
        onHandleCancel={objectControlClose}
      >
        <p className="mb-2">Outcome, Intention and Question Selection</p>
        <ObjectControlTable />
        <div className="d-flex justify-content-end gap-2">
          <Button variant="primary" className="ripple-effect">
            Save
          </Button>
          <Button variant="secondary" className="ripple-effect" onClick={objectControlClose}>
            Cancel
          </Button>
        </div>
      </ModalComponent>
      {/* Question Control Panel modal */}
      <ModalComponent
        modalHeader="Question Control Panel"
        size="lg"
        show={showQuestionControl}
        onHandleCancel={questionControlClose}
      >
        <p className="mb-2">OEQ Question Selection</p>
        <QuestionControlTable />
        <div className="d-flex justify-content-end gap-2">
          <Button variant="primary" className="ripple-effect">
            Save
          </Button>
          <Button variant="secondary" className="ripple-effect" onClick={questionControlClose}>
            Cancel
          </Button>
        </div>
      </ModalComponent>
      {/* Configuration modal */}
      <ModalComponent
        modalHeader="Configuration"
        size="lg"
        show={showConfigurationModal}
        onHandleCancel={ConfigurationModalClose}
      >
        {/* <button className='mb-2'>Configure Favourablity</button> */}
        {showConfigurationModal && (
          <ConfigureFavorability
            ConfigurationModalClose={ConfigurationModalClose}
            companyID={companyId}
            TemplateFlag={TemplateFlag}
            reportID={reportID}
            assessmentID={assessmentId || 0}
            updateSection={updateSection}
          />
        )}
      </ModalComponent>
      {/* Benchmark Configuration modal */}
      <ModalComponent modalHeader="Benchmark Configuration" show={benchmarkControl} onHandleCancel={benchmarkClose}>
        <Form>
          <Form.Group className="form-group mb-0">
            <SelectField
              placeholder="Select Department"
              defaultValue={benchmarkOptions[0]}
              isMulti
              options={benchmarkOptions}
            />
          </Form.Group>
          <div className="d-flex justify-content-end gap-2 mt-3">
            <Button variant="primary" className="ripple-effect">
              Save
            </Button>
            <Button variant="secondary" className="ripple-effect" onClick={benchmarkClose}>
              Cancel
            </Button>
          </div>
        </Form>
      </ModalComponent>

      <SweetAlert
        title="Are you sure?"
        text={`Delete  ${DeleteSectionValue.SectionName}  Section`}
        show={DeleteSectionModal}
        icon="warning"
        onConfirmAlert={onConfirmAlertModal}
        showCancelButton
        cancelButtonText="Cancel"
        confirmButtonText="Yes"
        setIsAlertVisible={setDeleteSectionModal}
        otherErrDisplayMode={true}
      />
    </>
  );
}

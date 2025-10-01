import React, { useState, useEffect, useRef } from "react";
import { Col, Collapse, Row, Form, Nav, Tab, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { commonService } from "services/common.service";
import { SURVEYS_MANAGEMENT } from "apiEndpoints/SurveysManagement";
import { COMMANAPI } from "apiEndpoints/OrgStructure/OrgStructure.dashboard";
import { useAuth } from "customHooks";
import {
  decodeHtmlEntities,
  getChartTypeByID,
  getDataLabelsByID,
  getFontOptionsByID,
  getLgendsByID,
  revertOutcomeData,
  transformOutcomeData,
} from "utils/common.util";
import { Participant } from "apiEndpoints/Participant";
// eslint-disable-next-line import/no-extraneous-dependencies
import html2canvas from "html2canvas";
import { REPORTS_MANAGEMENT } from "apiEndpoints/ReportsManagement";
import { useChartSettings } from "customHooks/useChartSettings";
import adminRouteMap from "routes/Admin/adminRouteMap";
import { showSuccessToast } from "helpers/toastHelper";
import Aggregate from "./Aggregate";
import {
  Button,
  SelectField,
  Breadcrumb,
  InputField,
  ModalComponent,
  ReactDataTable,
  SweetAlert,
  Loader,
  FallBackLoader,
} from "../../../../components";
import Configuration from "../../../../components/Configuration";
import { decimalOptions } from "./CollapseFilterOptions/CommonSelectFieldOptions";
import CommonBarChartAnnotation from "../CommonBarChartAnnotation/index";
import Outcomes from "./Outcomes";
import Intentions from "./Intentions";
import RatingQuestions from "./RatingQuestions";
import InfoGatheringQuestions from "./InfoGatheringQuestions";
import DrillDownQuestions from "./DrillDownQuestions";
import SignificantDifference from "./SignificantDifference";
import toast from "react-hot-toast";
import { getAssessmentCharting, resetAssessmentCharting, updateAssessmentCharting } from "../../../../redux/AssesmentCharting/index.slice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setIRNavigationState } from "../../../../redux/IRReportData/index.slice";

export default function Charting() {
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  const navigate = useNavigate()
  const { saveChartSettings } = useChartSettings();

  const [companyOptions, setCompanyOptions] = useState([]);
  const [surveyOptions, setSurveyOptions] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [selectedSurveyId, setSelectedSurveyId] = useState("");

  const [selectedScaleRange, setSelectedScaleRange] = useState("Default");

  const [departmentOptions, setDepartmentOptions] = useState([]);

  const [managerOptions, setManagerOptions] = useState([]);
  const [quickComapre, setQuickComapre] = useState(false);

  const [filterSubsetOptions, setFilterSubsetOptions] = useState([]);
  const [participantOptions, setParticipantOptions] = useState([]);
  const [outcomeOptions, setOutcomeOptions] = useState([]);
  const [intentionsOptions, setIntentionsOptions] = useState([]);
  const [demographicsQuestionListOptions, setDemographicsQuestionListOptions] =
    useState([]);
  const [score, setScore] = useState({});
  const [getfiltersubset, setGetfiltersubset] = useState(false);

  const [selectedOutcomeIds, setSelectedOutcomeIds] = useState([]);
  const [questionOptions, setQuestionOptions] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [selectedIntentionIds, setSelectedIntentionIds] = useState([]);
  const [scalerrangelist, setScalerrangelist] = useState([]);
  const [benchmarklist, setBenchmarklist] = useState([]);

  const [selectedSurveyName, setSelectedSurveyName] = useState("");
  const [activeTab, setActiveTab] = useState("aggregate");
  const [renderChart, setRenderChart] = useState(false);
  const [chartType, setChartType] = useState(2);
  const [legendPosition, setLegendPosition] = useState("bottom");
  const [labelPosition, setLabelPosition] = useState("none");
  const [fontSize, setFontSize] = useState(12);
  const [switchAxis, setSwitchAxis] = useState(false);
  const [labelColorState, setLabelColorState] = useState("#000000"); // default black
  const [annotationOpacity, setAnnotationOpacity] = useState(100); // default to fully opaque
  const [outcomes, setOutcomes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [values, setValue] = useState([]);
  const [outcomeCategories, setOutcomeCategories] = useState([]);
  const [outcomeValues, setOutcomeValue] = useState([]);

  const [DrillDownQuestionsData, setDrillDownQuestionsData] = useState([]);
  const [significantDifferenceValue, setSignificantDifferenceValue] =
    useState(90);

  // const [insertBenchmarkData, setInsertBenchmarkData] = useState(false);
  const [saveBenchmarkListData, setSaveBenchmarkListData] = useState(false);
  const [showCrosstabData, setShowCrosstabData] = useState(false);

  const [viewLoader, setViewLoader] = useState(false);
  // Add state for selected survey name
  // Add handler for scale range change
  // Add state for "From" and "To" values
  const [fromValue, setFromValue] = useState("0.00");
  const [toValue, setToValue] = useState("100.00");

  const [selectedDepartments, setSelectedDepartments] = useState(["0"]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedManagers, setSelectedManagers] = useState([]);
  const [outComeData, setOutComeData] = useState([]);
  const [outComeTableData, setOutCometableData] = useState([]);
  const [intentionTableData, setIntentiontableData] = useState([]);
  const [ questiontable,setQuestionTable]=useState([])

  const getAllOutcomes = () => {
    const allOutcomes = new Set();
    outComeTableData?.forEach((item) => {
      item?.outcomes?.forEach((outcome) => {
        allOutcomes.add(outcome.outcome_name);
      });
    });
    return Array.from(allOutcomes);
  };

  const getAllIntentions = () => {
    const allIntentions = new Set();

    intentionTableData?.forEach((item) => {
      item?.intentions?.forEach((intention) => {
        allIntentions.add(intention.intention_name);
      });
    });

    return Array.from(allIntentions);
  };
  const getAllquestions = () => {
    const allQuestions = new Set();

    questiontable?.forEach((item) => {
      item?.questions?.forEach((intention) => {
        allQuestions.add(intention.intention_name);
      });
    });

    return Array.from(allQuestions);
  };

  const outcomeNames =quickComapre?[]: getAllOutcomes();
  const intentionNames = getAllIntentions();
  const questionNames = getAllquestions()

  const [selectedBenchmarkList, setSelectedBenchmarkList] = useState([]);
  const benchmarkIds = selectedBenchmarkList?.map(
    (benchmark) => benchmark.value
  );

  const [selectedManagerReportees, setSelectedManagerReportees] = useState("A"); // Default to "All"
  const [selectedDemographicFilters, setSelectedDemographicFilters] = useState(
    []
  );

  const [intentionCategories, setIntentionCategories] = useState([]);
  const [intentionValues, setIntentionValue] = useState([]);

  const [ratingCategories, setRatingCategories] = useState([]);
  const [ratingValue, setRatingValue] = useState([]);

  // -------------------------------------------------------
  // charting set up options
  // chart type, legend position, data label position, font size options

  const [chartTypeOptions, setChartOptions] = useState([]);

  const [legendOptions, setLegendOptions] = useState([]);

  const [dataLabelOptions, setDataLabelOptions] = useState([]);

  const [drilldownLegendOptions, setDrilldownLegendOptions] = useState([]);
  const [drilldownChartOptions, setDrilldownChartOptions] = useState([]);
  const [drilldownDataLabelOptions, setDrilldownDataLabelOptions] = useState(
    []
  );

  const [quickComapreData, setQuickComapreData] = useState([]);

  const [quickComapreOutcome, setQuickComapreOutcome] = useState(false);
  const [quickComapreOutcomeData, setQuickComapreOutcomeData] = useState([]);

  const [quickComapreIntemtion, setQuickComapreIntemtion] = useState(false);
  const [quickComapreIntemtionData, setQuickComapreIntemtionData] = useState(
    []
  );

  const [quickComapreRating, setQuickComapreRating] = useState(false);
  const [quickComapreRatingData, setQuickComapreRatingData] = useState([]);

  const [ratingGrouuped, setRatingGrouuped] = useState(false);
const [sortOrder, setSortOrder] = useState("random"); // or "desc"

  const [fontSizeOptions] = useState([
    { value: 8, label: "8" },
    { value: 10, label: "10" },
    { value: 12, label: "12" },
    { value: 14, label: "14" },
    { value: 16, label: "16" },
  ]);

  // breadcrumb
  const breadcrumb = [
    {
      path: "#!",
      name: "Analytics",
    },
    {
      path: "#",
      name: "Charting",
    },
  ];
  const [datasetId, setDatasetId] = useState(null);
  const [selectedPaletteColorID, setSelectedPaletteColorID] = useState(
    score?.divergent?.[0]?.paletteID || 9
  );
  // collapse
  const [open, setOpen] = useState(true);
  const [significantOpen, setSignificantOpen] = useState(false);

  const [showChartingView, setShowChartingView] = useState(false);

  // Add state to track the "Show Crosstab In Report" switch
  const [showCrosstab, setShowCrosstab] = useState(true);

  // Add state to control the visibility of the charting view
  const [significantDifference, setSignificantDifference] = useState(false);
  const [filterAggregateData, setFilterAggregateData] = useState(false);
  const [filterOutcomeData, setFilterOutcomeData] = useState(false);
  console.log("filterOutcomeData", filterOutcomeData);

  const [filterIntentionData, setFilterIntentionData] = useState(false);

  const [compositeAggregateData, setCompositeAggregateData] = useState(false);

  const [informationGatheringData, setInformationGatheringData] =
    useState(false);
  const [drilldownData, setDrilldownData] = useState(false);

  const [compositeOutcomeData, setCompositeOutcomeData] = useState(false);
  const [compositeIntentionData, setCompositeIntentionData] = useState(false);

  // Update the collapse state definition to have a default value of null
  const [activeCollapse, setActiveCollapse] = useState(null);
  const toggleCollapse = (collapseId) => {
    if (!collapseId) return;
    setActiveCollapse(activeCollapse === collapseId ? null : collapseId);
  };
  const dispatch = useDispatch()
  useEffect(() => {
    return () => {
      // ✅ Called on unmount or navigation away
      dispatch(resetAssessmentCharting());
    };
  }, []);
  // create dataset modal
  const [saveDataset, setSaveDataset] = useState(false);
  const saveDatasetClose = () => {setSaveDataset(false); setDatasetName('')}
  const saveDatasetShow = () => setSaveDataset(true);

  const [colors, setColors] = useState([]);
  const [showNegative, setShowNegative] = useState(false);

  const [decimalValue, setDecimalValue] = useState("2");

  // Add state for selected control group index
  const [selectedControlGroupIdx, setSelectedControlGroupIdx] = useState(null);
  const [renderScalar, setRenderScalar] = useState(false);
  const [lastSignificanceAction, setLastSignificanceAction] = useState("");

  const [drilldownSelectedColorPallet, setDrilldownSelectedColorPallet] =
    useState([]);
  const [drilldownColors, setDrilldownColors] = useState([]);
  const [drilldownChartType, setDrilldownChartType] = useState("");
  const [drilldownLegendPosition, setDrilldownLegendPosition] = useState("");
  const [drilldownLabelPosition, setDrilldownLabelPosition] = useState("");
  const [drilldownFontSize, setDrilldownFontSize] = useState(12);
  const [drilldownLabelColorState, setDrilldownLabelColorState] = useState("");
  const [drilldownAnnotationOpacity, setDrilldownAnnotationOpacity] =
    useState(100);
  const [drilldownswitchAxis, setDrilldownSwitchAxis] = useState(false);

  const [IGQuestionsData, setIGQuestionsData] = useState([]);
  const [IGSelectedColorPallet, setIGSelectedColorPallet] = useState([]);
  const [IGColors, setIGColors] = useState([]);
  const [IGChartType, setIGChartType] = useState("");
  const [IGLegendPosition, setIGLegendPosition] = useState("");
  const [IGLabelPosition, setIGLabelPosition] = useState("");
  const [IGFontSize, setIGFontSize] = useState(12);
  const [IGLabelColorState, setIGLabelColorState] = useState("#000000");
  const [IGAnnotationOpacity, setIGAnnotationOpacity] = useState(100);
  const [IGDataLabelOptions, setIGDataLabelOptions] = useState([]);
  const [IGSwitchAxis, setIGSwitchAxis] = useState(false);

  // Ref for chart export
  const aggregateChartRef = useRef(null);
  const outcomeChartRef = useRef(null);
  const intentionChartRef = useRef(null);
  const ratingChartRef = useRef(null);
  const infoChartRef = useRef(null);
  const drillDownChartRef = useRef(null);

  const handleOrder = () => {
    setSortOrder((prev) =>
      prev === "asc" ? "desc" : prev === "desc" ? "random" : "asc"
    );
  };



  // Download handlers
  const handleDownloadPNG = async () => {
    let currentRef = null;
  
    if (activeTab === "aggregate") currentRef = aggregateChartRef.current;
    else if (activeTab === "outcome") currentRef = outcomeChartRef.current;
    else if (activeTab === "intention") currentRef = intentionChartRef.current;
    else if (activeTab === "rating") currentRef = ratingChartRef.current;
    else if (activeTab === "IG") currentRef = infoChartRef.current;
    else if (activeTab === "DD") currentRef = drillDownChartRef.current;
  
    if (currentRef) {
      // Inject export style
      const styleEl = document.createElement("style");
      styleEl.id = "chart-export-style";
      styleEl.innerHTML = `.chart-container { height: 100% !important; }`;
      document.head.appendChild(styleEl);
  
      const canvas = await html2canvas(currentRef, {
        backgroundColor: "white",
      });
  
      // Cleanup style
      document.getElementById("chart-export-style")?.remove();
  
      const link = document.createElement("a");
      link.download = `${activeTab}-chart.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };
  

  const handleDownloadSVG = async () => {
    let currentRef = null;
  
    if (activeTab === "aggregate") currentRef = aggregateChartRef.current;
    else if (activeTab === "outcome") currentRef = outcomeChartRef.current;
    else if (activeTab === "intention") currentRef = intentionChartRef.current;
    else if (activeTab === "rating") currentRef = ratingChartRef.current;
    else if (activeTab === "IG") currentRef = infoChartRef.current;
    else if (activeTab === "DD") currentRef = drillDownChartRef.current;
  
    if (currentRef) {
      // Inject export style
      const styleEl = document.createElement("style");
      styleEl.id = "chart-export-style";
      styleEl.innerHTML = `.chart-container { height: 100% !important; }`;
      document.head.appendChild(styleEl);
  
      const canvas = await html2canvas(currentRef, {
        backgroundColor: "white",
        scale: 1,
      });
  
      // Cleanup style
      document.getElementById("chart-export-style")?.remove();
  
      const imgData = canvas.toDataURL("image/png");
      const svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
          <image href="${imgData}" x="0" y="0" width="${canvas.width}" height="${canvas.height}" />
        </svg>
      `;
  
      const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
  
      const link = document.createElement("a");
      link.href = url;
      link.download = `${activeTab}-chart.svg`;
      link.click();
  
      URL.revokeObjectURL(url);
    }
  };
  

  const handleDownloadCSV = () => {
    let csv = "Category,Value\n";
    let tabCategories = [];
    let tabValues = [];

    // Handle quick compare data for each tab
    if (
      activeTab === "aggregate" &&
      quickComapre &&
      quickComapreData?.length > 0
    ) {
      quickComapreData.forEach((item) => {
        tabCategories = item.categories;
        tabValues = item.values;

        // Generate CSV content for quick compare data
        if (Array.isArray(tabCategories) && Array.isArray(tabValues)) {
          for (let i = 0; i < tabCategories?.length; i += 1) {
            const category = tabCategories[i];
            const value = tabValues[i];

            if (typeof value === "object" && value !== null) {
              // Handle grouped values (e.g., objects)
              const groupedValues = Object.entries(value)
                .map(([key, val]) => `${key}: ${val}`)
                .join("; ");
              csv += `"${category}","${groupedValues}"\n`;
            } else {
              // Handle simple values
              csv += `"${category}","${value}"\n`;
            }
          }
        }
      });
    } else if (
      activeTab === "outcome" &&
      quickComapreOutcome &&
      quickComapreOutcomeData?.length > 0
    ) {
      quickComapreOutcomeData.forEach((item) => {
        tabCategories = item.outcomeCategories;
        tabValues = item.outcomeValues;

        // Generate CSV content for quick compare outcome data
        if (Array.isArray(tabCategories) && Array.isArray(tabValues)) {
          for (let i = 0; i < tabCategories.length; i += 1) {
            const category = tabCategories[i];
            const value = tabValues[i];

            if (typeof value === "object" && value !== null) {
              const groupedValues = Object.entries(value)
                .map(([key, val]) => `${key}: ${val}`)
                .join("; ");
              csv += `"${category}","${groupedValues}"\n`;
            } else {
              csv += `"${category}","${value}"\n`;
            }
          }
        }
      });
    } else if (
      activeTab === "intention" &&
      quickComapreIntemtion &&
      quickComapreIntemtionData?.length > 0
    ) {
      quickComapreIntemtionData.forEach((item) => {
        tabCategories = item.intentionCategories;
        tabValues = item.intentionValues;

        // Generate CSV content for quick compare intention data
        if (Array.isArray(tabCategories) && Array.isArray(tabValues)) {
          for (let i = 0; i < tabCategories?.length; i += 1) {
            const category = tabCategories[i];
            const value = tabValues[i];

            if (typeof value === "object" && value !== null) {
              const groupedValues = Object.entries(value)
                .map(([key, val]) => `${key}: ${val}`)
                .join("; ");
              csv += `"${category}","${groupedValues}"\n`;
            } else {
              csv += `"${category}","${value}"\n`;
            }
          }
        }
      });
    } else if (
      activeTab === "rating" &&
      quickComapreRating &&
      quickComapreRatingData?.length > 0
    ) {
      quickComapreRatingData.forEach((item) => {
        tabCategories = item.ratingCategories;
        tabValues = item.ratingValue;

        // Generate CSV content for quick compare rating data
        if (Array.isArray(tabCategories) && Array.isArray(tabValues)) {
          for (let i = 0; i < tabCategories?.length; i += 1) {
            const category = tabCategories[i];
            const value = tabValues[i];

            if (typeof value === "object" && value !== null) {
              const groupedValues = Object.entries(value)
                .map(([key, val]) => `${key}: ${val}`)
                .join("; ");
              csv += `"${category}","${groupedValues}"\n`;
            } else {
              csv += `"${category}","${value}"\n`;
            }
          }
        }
      });
    } else {
      // Default data handling for non-quick compare cases
      switch (activeTab) {
        case "aggregate":
          tabCategories = categories;
          tabValues = values;
          break;
        case "outcome":
          tabCategories = outcomeCategories;
          tabValues = outcomeValues;
          break;
        case "intention":
          tabCategories = intentionCategories;
          tabValues = intentionValues;
          break;
        case "rating":
          tabCategories = ratingCategories.map((item) => item.name); // Extract names for rating
          tabValues = ratingValue;
          break;
        default:
          console.error("Invalid tab selected for CSV download");
          return;
      }

      // Generate CSV content for default data
      if (Array.isArray(tabCategories) && Array.isArray(tabValues)) {
        for (let i = 0; i < tabCategories.length; i += 1) {
          const category = tabCategories[i];
          const value = tabValues[i];

          if (typeof value === "object" && value !== null) {
            const groupedValues = Object.entries(value)
              .map(([key, val]) => `${key}: ${val}`)
              .join("; ");
            csv += `"${category}","${groupedValues}"\n`;
          } else {
            csv += `"${category}","${value}"\n`;
          }
        }
      }
    }

    // Create and download the CSV file
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${activeTab}-chart.csv`;
    link.click();
  };

  const [IGPaletteColorID, setIGPaletteColorID] = useState(
  score?.divergent?.[0]?.paletteID || 9
);

const [drillDownPaletteColorID, setDrillDownPaletteColorID] = useState(
  score?.divergent?.[0]?.paletteID || 10
);
  const handleDrilldownChartTypeChange = (type) => {
    setDrilldownChartType(type?.value);
  };

  const handleDrilldownLegendPositionChange = (position) => {
    setDrilldownLegendPosition(position?.value);
  };

  const handleDrilldownLabelPositionChange = (position) => {
    setDrilldownLabelPosition(position?.value);
  };

  const handleDrilldownFontSizeChange = (size) => {
    setDrilldownFontSize(size?.value);
  };

  const handleDrilldownLabelColorChange = (event) => {
    setDrilldownLabelColorState(event.target.value);
  };

  const handleDrilldownOpacityChange = (event) => {
    setDrilldownAnnotationOpacity(event.target.value);
  };

  const handleDrilldownChartColorChange = (colorData) => {
    setDrilldownSelectedColorPallet(colorData);
  setDrillDownPaletteColorID(colorData.colorPaletteID);

    const colorCodeArray = colorData?.colors?.map((item) => item.colorCode);
    setDrilldownColors(colorCodeArray);
    setColors(colorCodeArray)
  };

  const handleDrilldownSwitchAxisChange = (event) => {
    setDrilldownSwitchAxis(event.target.checked);
    setDrilldownLabelPosition("center"); // Using drilldownLabelPosition instead of labelPosition
    // if (event.target.checked) {
    //   setDrilldownDataLabelOptions([
    //     { value: "center", label: "Center" },
    //     { value: "none", label: "None" },
    //   ]);
    // } else {
    //   setDrilldownDataLabelOptions([
    //     { value: "top", label: "Top" },
    //     { value: "bottom", label: "Bottom" },
    //     { value: "center", label: "Center" },
    //     { value: "none", label: "None" },
    //   ]);
    // }
  };

  const handleIGChartTypeChange = (type) => {
    setIGChartType(type?.value);
  };

  const handleIGLegendPositionChange = (position) => {
    setIGLegendPosition(position?.value);
  };

  const handleIGLabelPositionChange = (position) => {
    setIGLabelPosition(position?.value);
  };

  const handleIGFontSizeChange = (size) => {
    setIGFontSize(size?.value);
  };

  const handleIGLabelColorChange = (event) => {
    setIGLabelColorState(event.target.value);
  };

  const handleIGOpacityChange = (event) => {
    setIGAnnotationOpacity(event.target.value);
  };

  const handleIGChartColorChange = (colorData) => {
    setIGSelectedColorPallet(colorData);
  setIGPaletteColorID(colorData.colorPaletteID);

    const colorCodeArray = colorData?.colors?.map((item) => item.colorCode);
    setIGColors(colorCodeArray);
  };

  const handleIGSwitchAxisChange = (event) => {
    // dispatch(updateAssessmentCharting({ switchAxis: event.target.checked }));

    setIGSwitchAxis(event.target.checked);
    setIGLabelPosition("center");

    // if (event.target.checked) {
    //   setIGDataLabelOptions([
    //     { value: "center", label: "Center" },
    //     { value: "none", label: "None" },
    //   ]);
    // } else {
    //   setIGDataLabelOptions([
    //     { value: "top", label: "Top" },
    //     { value: "bottom", label: "Bottom" },
    //     { value: "center", label: "Center" },
    //     { value: "none", label: "None" },
    //   ]);
    // }
  };

  // Update crosstab columns definition
  const crosstabColumns = [
    {
      title: "#",
      dataKey: "number",
      data: "number",
      columnHeaderClassName: "no-sorting w-1 text-center",
    },
    {
      title: "Question",
      dataKey: "question",
      data: "question",
      columnHeaderClassName: "no-sorting",
      rowspan: (row) => row.rowspan || 1
    },
    {
      title: "Response",
      dataKey: "response_name",
      data: "response_name",
      columnHeaderClassName: "no-sorting",
    },
    {
      title: "Count",
      dataKey: "response_user_count",
      data: "response_user_count",
      columnHeaderClassName: "no-sorting text-center",
    },
    {
      title: "Total",
      dataKey: "total_user_count",
      data: "total_user_count",
      columnHeaderClassName: "no-sorting text-center",
    },
    {
      title: "%",
      dataKey: "percentage",
      data: "percentage",
      columnHeaderClassName: "no-sorting text-center",
    },
  ];

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
        if (response?.data?.data && typeof response.data.data === 'object') {
          const companies = Object.values(response.data.data).map((company) => ({
            value: company?.companyID,
            label: decodeHtmlEntities(company?.companyName),
          }));
          setCompanyOptions(companies);
        } else {
          console.warn('response.data.data is null or not an object:', response?.data?.data);
          setCompanyOptions([]); // optional fallback
        }
        
      }
    }
  };

  const fetchSurvey = async (companyID) => {
    const response = await commonService({
      apiEndPoint: SURVEYS_MANAGEMENT.surveyList,
      queryParams: { companyID },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });
    if (response?.status) {
      setSurveyOptions(
        response?.data?.data?.map((item) => ({
          value: item?.surveyID,
          label: item?.surveyName,
        }))
      );
    }
  };

  const [scalarConfiguration, setScalarConfiguration] = useState([]);



  // Update fetchAssessmentChart to accept subsetType
  const fetchAssessmentChart = async (
    assessmentID,
    action,
    companyID = null,
    subsetType = "FCSS"
  ) => {
    try {
      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT.surveyAssessmentChart,
        queryParams: {
          action,
          assessmentID,
          ...(companyID && { companyID }),
          ...(action === "outcome_list_dropdown" && { isIG: activeTab=="IG"?true: false }),
          ...(action === "get_filter_subset_list" && { subsetType }), // Use passed subsetType
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        console.log("OUT LIST: ", response?.data)
        // eslint-disable-next-line default-case
        switch (action) {
          case "scalar_configuration":
            setScalarConfiguration(response?.data?.data);
            setRenderChart((prev) => !prev);
            break;
          case "get_scale_range_list":
            setScalerrangelist(
              response?.data?.data?.map((scale) => ({
                value: scale.id,
                label: scale.range,
              }))
            );
            break;
          case "list_benchmark":
            setBenchmarklist(
              (response?.data?.data || []).map((bench) => ({
                value: bench.dataset_id,
                label: bench.name,
              }))
            );
            
            break;
          case "department_list_dropdown":
            setDepartmentOptions((prev) => [
              // ...prev,
              ...response?.data?.data?.map((dept) => ({
                value: dept.department_id,
                label: dept.department_name,
              })),
            ]);
            setSelectedDepartments(['0'])

            break;
          case "manager_list_dropdown":
            setManagerOptions(
              response?.data?.data?.map((manager) => ({
                value: manager.user_id,
                label: manager.name,
              }))
            );
            break;
          case "get_benchmark":
            setManagerOptions(
              response?.data?.data?.map((manager) => ({
                value: manager.user_id,
                label: manager.name,
              }))
            );
            break;
          case "get_filter_subset_list":
            setFilterSubsetOptions(
              response?.data?.data?.map((set) => ({
                value: set.subsetID,
                label: set.name,
              }))
            );
            break;
          case "user_list_dropdown":
            setParticipantOptions(
              response?.data?.data?.map((user) => ({
                value: user.user_id,
                label: user.user_name,
              }))
            );
            break;
          case "outcome_list_dropdown":
            // eslint-disable-next-line no-case-declarations
            const mappedOutcomes = response?.data?.data?.map((outcome) => ({
              value: outcome.outcome_id,
              label: outcome.outcome_value,
            }));
            let newMappedOutcomes = [];
            if(mappedOutcomes?.length === 0 && outcomes?.length > 0){
              newMappedOutcomes = outcomes?.map((outcome) => ({
                value: outcome?.outcome_id,
                label: outcome?.outcome_name
              }))
              setOutcomeOptions(newMappedOutcomes)
            } else {
              setOutcomeOptions(mappedOutcomes);
            }

            // If outcomes change, we need to reset selected outcomes
            if (intentionsOptions?.length === 0 && (newMappedOutcomes?.length > 0 || mappedOutcomes?.length > 0)) {
              // eslint-disable-next-line no-use-before-define
              fetchIntentionList(
                assessmentID,
                selectedCompanyId,
                newMappedOutcomes?.length > 0 ? newMappedOutcomes.map((item) => item.value) : mappedOutcomes?.map((item) => item.value)
              );
            }

            // setSelectedOutcomeIds([]);
            break;
          case "demographic_question_list":
            // Update to handle full demographics data structure
            setDemographicsQuestionListOptions(
              response?.data?.data?.map((item) => {
                // For branched questions, include level IG
                if (item.is_branch) {
                  return {
                    value: `${item.question_id}_${item.level}`,
                    label: item.question,
                    isBranch: true,
                    level: item.level,
                    responses: item.responses,
                    questionId: item.question_id,
                  };
                }
                // For non-branched questions
                return {
                  value: item.question_id,
                  label: item.question,
                  isBranch: false,
                  responses: item.responses,
                  questionId: item.question_id,
                };
              })
            );
            break;
        }
      }
    } catch (error) {
      console.error("Error fetching assessment chart data:", error);
    }
  };

  

  const fetchSubsetListData = async (subsetID) => {
    try {
      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT?.surveyAssessmentChart,
        queryParams: {
          action: "get_filter_subset",
          subsetID,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        setGetfiltersubset(response?.data?.data);
        console.log(response?.data?.data)

        const getfiltersubset = response?.data?.data;
     
            // Departments
           // Departments
if (Array.isArray(getfiltersubset.departments)) {
  setSelectedDepartments(getfiltersubset.departments.map(String));
}

// Users
if (Array.isArray(getfiltersubset.users)) {
  setSelectedUsers(getfiltersubset.users.map(String));
}

// Managers
if (Array.isArray(getfiltersubset.managers)) {
  setSelectedManagers(getfiltersubset.managers.map(String));
}

// Manager Reportees
if (Array.isArray(getfiltersubset.managerReportees)) {
  setSelectedManagerReportees(getfiltersubset.managerReportees.map(String));
}

            // Demographic Filters
            if (Array.isArray(getfiltersubset.demographicFilters)) {
              // Map demographicFilters to UI format
              const mapped = getfiltersubset.demographicFilters.map((filter) => {
                // Find the question definition from demographicsQuestionListOptions
                const question = demographicsQuestionListOptions?.find(
                  (q) =>
                    String(q.questionId) === String(filter.questionId) ||
                    String(q.value) === String(filter.questionId)
                );
                // Map responses to selectedOptions format
                const selectedOptions =
                  Array.isArray(filter.responses) && question && question.responses
                    ? question.responses
                        .filter((resp) =>
                          filter.responses.includes(resp.response_id || resp.value)
                        )
                        .map((resp) => ({
                          value: resp.response_id ?? resp.value,
                          label: resp.value,
                        }))
                    : [];
                return {
                  questionId: filter.questionId,
                  questionValue: question?.label || "",
                  isBranch: filter.isBranch,
                  responses: question?.responses || [],
                  selectedOptions,
                };
              });
              setSelectedDemographicFilters(mapped);
            }
          }
    } catch (error) {
      console.error("Error fetching score data:", error);
    }
  };

  const fetchIntentionList = async (
    assessmentID,
    companyID = null,
    outcomeIDs = [],
    action = "intention_list_dropdown",
    intentionIDs = []
  ) => {
    try {
      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT.surveyAssessmentChartIntention,
        bodyData: {
          action,
          assessmentID: parseInt(assessmentID, 10),
          ...(companyID && { companyID: parseInt(companyID, 10) }),
          outcomeIDs: outcomeIDs.map((id) => parseInt(id, 10)),
          ...(action === "question_list_dropdown" && {
            intentionIDs: intentionIDs.map((id) => parseInt(id, 10)),
          }),
          isIG:activeTab=="IG"?false: false,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        // eslint-disable-next-line default-case
        switch (action) {
          case "intention_list_dropdown":
            // eslint-disable-next-line no-case-declarations
            const fetchedIntentions = response?.data?.data?.map(
              (intentions) => ({
                value: intentions.intention_id,
                label: intentions.intention_value,
              })
            );

            console.log("fetchedIntentions",fetchedIntentions)

            setIntentionsOptions(fetchedIntentions);
            if (questionOptions?.length === 0) {
              fetchIntentionList(
                assessmentID,
                selectedCompanyId,
                selectedOutcomeIds,
                "question_list_dropdown",
                fetchedIntentions.map((item) => item.value)
              );
            }
            break;
          case "question_list_dropdown":
            // eslint-disable-next-line no-case-declarations
            const fetchedQuestions = response?.data?.data?.map((question) => ({
              value: question.inter_question_id,
              label: question.question_number+") "+question.question,
            }));
            console.log(response?.data?.data,"questionxx")
            setQuestionOptions(fetchedQuestions);
            break;
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  useEffect(()=>{
if(activeTab=="IG"){
  fetchAssessmentChart(selectedSurveyId, "outcome_list_dropdown");

}
  },[activeTab])

  useEffect(()=>{
    if(activeTab=='IG'){
      fetchIntentionList( selectedSurveyId,
      selectedCompanyId,
        selectedOutcomeIds,
        "question_list_dropdown",
        selectedIntentionIds)
    }
  },[selectedIntentionIds])

  useEffect(()=>{
    if(activeTab=='IG'){
      fetchIntentionList( selectedSurveyId,
      selectedCompanyId,
        selectedOutcomeIds,
        "intention_list_dropdown",
        selectedIntentionIds)
    }
  },[selectedOutcomeIds])

  const handleIntentionChange = (selectedIntentions) => {
    const intentionIDs = selectedIntentions.map((intention) => intention.value);
    setSelectedIntentionIds(intentionIDs);
    fetchIntentionList(
      selectedSurveyId,
      selectedCompanyId,
      selectedOutcomeIds,
      "question_list_dropdown",
      intentionIDs
    );
  };


  const fetchScore = async () => {
    try {
      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT?.getScalar,
        queryParams: {
          companyMasterID: userData?.companyMasterID,
          companyID: selectedCompanyId
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      
      if (response?.status) {
        setScore(response?.data?.scalar);
        console.log("DEFAULT COLOR: ", response?.data)
        let defaultColor = response?.data?.scalar?.defaultColor[1];
        const colorCodeArray = defaultColor?.colors?.map(
          (item) => item.colorCode
        );
        setColors(colorCodeArray);
        setDrilldownColors(colorCodeArray)
        setIGColors(colorCodeArray)
        dispatch(updateAssessmentCharting({
          defaultColor:defaultColor,
          // values: result.value
        }));
        setRenderChart((prev) => !prev);
      }
    } catch (error) {
      console.error("Error fetching score data:", error);
    }
  };

  const fetchOutcome = async (companyID, surveyID) => {
    try {
      const response = await commonService({
        apiEndPoint: Participant.surveyQuestionList,
        queryParams: {
          companyID,
          surveyID,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        console.log("OUTCOMES: ", response?.data)
        setOutcomes(response.data.outcomes); // Set outcomes data
        
      }
    } catch (error) {
      console.error("Error fetching outcomes:", error);
    }
  };

  useEffect(() => {
    if(selectedSurveyId?.length > 0){
      console.log("OUTCOMES FROM API", outcomes)
      fetchAssessmentChart(selectedSurveyId, "outcome_list_dropdown");
    }
  },[outcomes, selectedSurveyId])

  const fetchfilterAggregateChart = async (
    selectedSurveyIdData,
    selectedCompanyIdData,
    dataFilters = {}
  ) => {
    try {
      console.log("userData?.apiToken", userData?.apiToken)
      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT.filterAggregateChart,
        bodyData: {
          masterCompanyID: userData?.companyMasterID,
          companyID: Number(selectedCompanyIdData),
          assessmentID: Number(selectedSurveyIdData),
          negativeValue: showNegative,
          decimalPoints: Number(decimalValue),
          scaleMin:
            Object.keys(dataFilters).length > 0
              ? parseFloat(dataFilters.scaleMin)
              : parseFloat(fromValue),
          scaleMax:
            Object.keys(dataFilters).length > 0
              ? parseFloat(dataFilters.scaleMax)
              : parseFloat(toValue),
          action: "get_filter_aggregate",

          dataFilters,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        console.log("DATA AGGREGATE: ", response?.data?.data)
        setFilterAggregateData(response?.data?.data);
        setOutComeData(response?.data?.data.map((val) => ({ [val.info_name]: Number(val.value) })) || []);

        // const result = extractCategoryAndValueArray(response?.data?.data);
        const result = transformDataAggregate(response?.data?.data);

         if(reduxSwitchAxis){
          const result2 = transformOutcomeData(result.category,result.value)
          setCategories(result2?.outcomeCategories)
          setValue(result2?.outcomeValues)
         }else{
          setCategories(result?.category);
     
        console.log("RESULT: ",result)
        setValue(result?.value);
         }
        setRenderChart((prev) => !prev);
        setShowChartingView(true);
      }
      setViewLoader(false);
    } catch (error) {
      setViewLoader(false);
      console.error("Error fetching filter aggregate chart data:", error);
    }
  };

  function transformData(data, key1, key2) {

    const category = data.map((item) => item.info_name);
    console.log(categories,"cate mine")
    const value = data.map((item) => {
      const outcomesMap = {};
      item[key1].forEach((outcome) => {
        let val = parseFloat(outcome.value);
        // // Apply scale range validation
        // if (val < parseFloat(fromValue)) val = parseFloat(fromValue);
        // if (val > parseFloat(toValue)) val = parseFloat(toValue);
        // Apply decimal points formatting
        outcomesMap[outcome[key2]] = val.toFixed(decimalValue || 0);
      });
      return outcomesMap;
    });
    return { category, value };
  }

  function transformDataAggregate(data) {
    console.log("Transform agg data: ", data)
    const category = data.map((item) => (item?.info_name=="Aggregate")?"Survey aggregate":item?.info_name);
    const value = data.map((item) => ({"Aggregate":item.value}));
    console.log("CATEGORY VALUE: ", category, value)
    return { category, value };
  }

  const fetchfilterOutcomeChart = async (
    selectedSurveyIdData,
    selectedCompanyIdData,
    dataFilters = {}
  ) => {
    try {
      // alert(dataFilters?.outcomes?.length)
      // if(dataFilters?.outcomes?.length==0){
      //   setViewLoader(false)
      //   return toast.error('Atleast one question should be selected')
      // }
      if (dataFilters?.outcomes?.length === 0) {
        if (outcomeOptions[0]?.value) {
          dataFilters.outcomes = outcomeOptions?.map((item) => item.value);
        }
      }
      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT.filterAggregateChart,
        bodyData: {
          masterCompanyID: userData?.companyMasterID,
          companyID: Number(selectedCompanyIdData),
          assessmentID: Number(selectedSurveyIdData),
          negativeValue: showNegative,
          decimalPoints: Number(decimalValue),
          scaleMin:
            Object.keys(dataFilters).length > 0
              ? parseFloat(dataFilters.scaleMin)
              : parseFloat(fromValue),
          scaleMax:
            Object.keys(dataFilters).length > 0
              ? parseFloat(dataFilters.scaleMax)
              : parseFloat(toValue),
          action: "get_filter_outcome",
          dataFilters,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        const transformed = response?.data?.data.map((item) => ({
          ...item,
          info_name: item.info_name === "Aggregate" ? "Overall" : item.info_name,
        }));
          const result = transformData(
          transformed,
          "outcomes",
          "outcome_name"
        );

        console.log("OUTCOME chart DATA: ", result)

        setFilterOutcomeData(transformed);
        setOutCometableData(transformed)

      if(reduxSwitchAxis){
        const result2 = reduxSwitchAxis
        ? revertOutcomeData(result.category, result.value)
        : transformOutcomeData(result.category, result.value);
      setOutcomeCategories(result2.outcomeCategories);
      setOutcomeValue(result2.outcomeValues);
      }
      else{
        setOutcomeCategories(result.category);
        setOutcomeValue(result.value);
      }
        setRenderChart((prev) => !prev);
        setShowChartingView(true);
      }
      setViewLoader(false);
    } catch (error) {
      setViewLoader(false);
      console.error("Error fetching filter aggregate chart data:", error);
    }
  };

  const fetchfilterIntentionChart = async (
    selectedSurveyIdData,
    selectedCompanyIdData,
    dataFilters = {}
  ) => {
    try {
      if (dataFilters?.intentions?.length === 0) {
        if (intentionsOptions[0]?.value) {
          dataFilters.intentions = intentionsOptions?.map((item) => item.value);
          dataFilters.outcomes = outcomeOptions?.map((item) => item.value);
        }
      }
      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT.filterAggregateChart,
        bodyData: {
          masterCompanyID: userData?.companyMasterID,
          companyID: Number(selectedCompanyIdData),
          assessmentID: Number(selectedSurveyIdData),
          negativeValue: showNegative,
          decimalPoints: Number(decimalValue),
          scaleMin:
            Object.keys(dataFilters)?.length > 0
              ? parseFloat(dataFilters.scaleMin)
              : parseFloat(fromValue),
          scaleMax:
            Object.keys(dataFilters)?.length > 0
              ? parseFloat(dataFilters.scaleMax)
              : parseFloat(toValue),
          action: "get_filter_intention",

          dataFilters,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        const transformed = response?.data?.data.map((item) => ({
          ...item,
          info_name: item.info_name === "Aggregate" ? "Overall" : item.info_name,
        }));
          const result = transformData(
          transformed,
          "intentions",
          "intention_name"
        );
        setFilterIntentionData(response?.data?.data);
        setIntentiontableData(transformed)
        if(reduxSwitchAxis){
          console.log('000000')
          const result2 = 
          transformOutcomeData(result.category, result.value);
        setIntentionCategories(result2.outcomeCategories);
        setIntentionValue(result2.outcomeValues);
        }
       else{
        console.log('0000')
        setIntentionCategories(result.category);
        setIntentionValue(result.value);
  
       }
     
        setRenderChart((prev) => !prev);
        setShowChartingView(true);
      }
      setViewLoader(false);
    } catch (error) {
      setViewLoader(false);
      console.error("Error fetching filter aggregate chart data:", error);
    }
  };

  function transformNestedData(input) {
    const category = input.map((item) => item.info_name=="Aggregate"?"Overall":item?.info_name);
    const value = input.map((item) => {
      const obj = {};
      item.questions.forEach((q) => {
        let val = parseFloat(q.value);
        // Apply scale range validation
        if (val < parseFloat(fromValue)) val = parseFloat(fromValue);
        if (val > parseFloat(toValue)) val = parseFloat(toValue);
        // Apply decimal points formatting
        obj[q.question_no] = val.toFixed(decimalValue);
      });
      return obj;
    });
    return { category, value };
  }

  // useEffect(()=>{
  //   if(ratingValue?.length&&selectedi){
  //    if(ratingValue?.length>1){
  //     fetchCompositeRatingChart()
  //    }
  //    else{
  //     fetchfilterRatingChart()
  //    }
  //   }
  // },[decimalValue])

  const fetchfilterRatingChart = async (
    selectedSurveyIdData,
    selectedCompanyIdData,
    dataFilters = {}
  ) => {
    try {
      if (dataFilters?.questions?.length === 0) {
        if (questionOptions[0]?.value) {
          dataFilters.intentions = intentionsOptions?.map((item) => item.value);
          dataFilters.outcomes = outcomeOptions?.map((item) => item.value);
          dataFilters.questions = questionOptions?.map((item) => item.value);
        }
      }
      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT.filterAggregateChart,
        bodyData: {
          masterCompanyID: userData?.companyMasterID,
          companyID: Number(selectedCompanyIdData),
          assessmentID: Number(selectedSurveyIdData),
          negativeValue: showNegative,
          decimalPoints: Number(decimalValue),
          scaleMin:
            Object.keys(dataFilters).length > 0
              ? parseFloat(dataFilters.scaleMin)
              : parseFloat(fromValue),
          scaleMax:
            Object.keys(dataFilters).length > 0
              ? parseFloat(dataFilters.scaleMax)
              : parseFloat(toValue),
          action: "get_filter_question",

          dataFilters,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        const result = transformNestedData(response?.data?.data);
        setQuestionTable(response?.data?.data,"result")
        if(switchAxis){
          const result2 = reduxSwitchAxis
        ? revertOutcomeData(result.category, result.value)
        : transformOutcomeData(result.category, result.value);
        // console.log
      setRatingCategories(result2.outcomeCategories);
      setRatingValue(result2.outcomeValues);
        setRenderChart((prev) => !prev);
        }else{
          setRatingCategories(result?.category);
          console.log(result)
          setRatingValue(result?.value);
        }
        setShowChartingView(true);
      }
      setViewLoader(false);
    } catch (error) {
      setViewLoader(false);
      console.error("Error fetching filter aggregate chart data:", error);
    }
  };

  function getPaletteByID(data, paletteID) {
    // Convert paletteID to string to ensure consistent comparison
    const targetID = String(paletteID);

    // List of all collection types to search
    const collectionTypes = [
      "sequential",
      "divergent",
      "dataVisualization",
      "myColors",
      "defaultColor",
    ];

    // Iterate through each collection type
    for (const collectionType of collectionTypes) {
      // Skip if this collection doesn't exist in the data
      if (!data[collectionType] || !Array.isArray(data[collectionType])) {
        // eslint-disable-next-line no-continue
        continue;
      }

      // Search for the palette in this collection
      const foundPalette = data[collectionType].find(
        (palette) =>
          String(palette.paletteID) === targetID ||
          String(palette.PaletteID) === targetID
      );

      // Return the palette if found
      if (foundPalette) {
        return {
          ...foundPalette,
          collectionType, // Include the collection type for reference
        };
      }
    }

    // Return null if no palette with the given ID was found
    return null;
  }

  const fetchfilterIGChart = async (
    selectedSurveyIdData,
    selectedCompanyIdData,
    dataFilters = {}
  ) => {
    try {
      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT.filterAggregateChart,
        bodyData: {
          masterCompanyID: userData?.companyMasterID,
          companyID: Number(selectedCompanyIdData),
          assessmentID: Number(selectedSurveyIdData),
          negativeValue: showNegative,
          decimalPoints: Number(decimalValue),
          scaleMin:
            Object.keys(dataFilters).length > 0
              ? parseFloat(dataFilters.scaleMin)
              : parseFloat(fromValue),
          scaleMax:
            Object.keys(dataFilters).length > 0
              ? parseFloat(dataFilters.scaleMax)
              : parseFloat(toValue),
          action: "get_ig_chart_data",

          dataFilters,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      const response2 = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT?.getScalar,
        queryParams: {
          companyMasterID: userData?.companyMasterID,
          companyID: selectedCompanyId
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        setInformationGatheringData(response?.data?.data);
        let finalChartData = [];

        for (let oneRow of response?.data?.data?.chartData) {
          const colorsData = getPaletteByID(
            score,
            oneRow?.chartOptions?.paletteColorID
          );
          oneRow.colors = colorsData;
          oneRow.questionID = oneRow?.question_id;
          oneRow.questionName = oneRow?.question;
          oneRow.chartOptions.chartType = IGChartType
            oneRow.chartOptions.lableColor = IGLabelColorState

          const colorCodeArray = colorsData?.colors?.map(
            (item) => item.colorCode
          );
          if (oneRow?.chartOptions?.chartType === 1) {
            oneRow.chartOptions.chartType = 2;
          }
          let defaultColor = response2?.data?.scalar?.defaultColor[1];
          const colorCodeArray2 = defaultColor?.colors?.map(
            (item) => item.colorCode
          );
          oneRow.colorsArray = colorCodeArray2;
          finalChartData.push(oneRow);
          console.log("FINAL CHART DDATA: ", finalChartData)
        }

        console.log("FINAL CHART DDATA: ", finalChartData)

        setIGQuestionsData(finalChartData);

        const globalcolorData = getPaletteByID(
          score,
          response?.data?.data?.chartOptions?.paletteColorID
        );
        const globalcolorCodeArray = globalcolorData?.colors?.map(
          (item) => item.colorCode
        );
        let defaultColor = response2?.data?.scalar?.defaultColor[1];
        const colorCodeArray2 = defaultColor?.colors?.map(
          (item) => item.colorCode
        );
        setIGSelectedColorPallet(defaultColor);
        console.log('seelctedig',defaultColor)
        setIGColors(colorCodeArray2);
        console.log(response?.data?.data?.chartOptions,"igchart")
        if (response?.data?.data?.chartOptions?.chartType === 1) {
          response.data.data.chartOptions.chartType = 2;
        }

        // setIGChartType(response.data.data.chartOptions.chartType || "");
        // setIGLegendPosition(response.data.data.chartOptions.legend || "");
        // setIGLabelPosition(response.data.data.chartOptions.dataLabel || "");
        // setIGFontSize(response.data.data.chartOptions.fontSize || 12);
        // // setIGLabelColorState(response.data.data.chartOptions.lableColor || "");
        // setIGAnnotationOpacity(
        //   response.data.data.chartOptions.scalarOpacity ?? 100
        // );

        setShowChartingView(true);
      }

      setViewLoader(false);
    } catch (error) {
      setViewLoader(false);
      console.error("Error fetching filter aggregate chart data:", error);
    }
  };

  const fetchfilterDriilDownChart = async (
    selectedSurveyIdData,
    selectedCompanyIdData,
    dataFilters = {}
  ) => {
    try {
      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT.filterAggregateChart,
        bodyData: {
          masterCompanyID: userData?.companyMasterID,
          companyID: Number(selectedCompanyIdData),
          assessmentID: Number(selectedSurveyIdData),
          negativeValue: showNegative,
          decimalPoints: Number(decimalValue),
          scaleMin:
            Object.keys(dataFilters).length > 0
              ? parseFloat(dataFilters.scaleMin)
              : parseFloat(fromValue),
          scaleMax:
            Object.keys(dataFilters).length > 0
              ? parseFloat(dataFilters.scaleMax)
              : parseFloat(toValue),
          action: "get_drilldown_chart",

          dataFilters,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      const response2 = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT?.getScalar,
        queryParams: {
          companyMasterID: userData?.companyMasterID,
          companyID: selectedCompanyId
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        setDrilldownData(response?.data?.data);
        let finalChartData = [];

        for (let oneRow of response?.data?.data?.chartData) {
          const colorsData = getPaletteByID(
            score,
            oneRow?.chartOptions?.paletteColorID
          );
          oneRow.colors = colorsData;
          oneRow.questionID = oneRow?.question_id;
          oneRow.questionName = oneRow?.question;

          const colorCodeArray = colorsData?.colors?.map(
            (item) => item.colorCode
          );
            oneRow.chartOptions.chartType = drilldownChartType
            oneRow.chartOptions.lableColor = drilldownLabelColorState;

          
          let defaultColor = response2?.data?.scalar?.defaultColor[1];
        const colorCodeArray2 = defaultColor?.colors?.map(
          (item) => item.colorCode
        );
          oneRow.colorsArray = colorCodeArray2;
          finalChartData.push(oneRow);
        }
        let defaultColor = response2?.data?.scalar?.defaultColor[1];
        const colorCodeArray2 = defaultColor?.colors?.map(
          (item) => item.colorCode
        );
        setDrillDownQuestionsData(finalChartData);
        setDrilldownColors(colorCodeArray2)
        // console.log(drillDownPaletteColorID,drilldownColors,colorCodeArray2,"new")
        const globalcolorData = getPaletteByID(
          score,
          response?.data?.data?.chartOptions?.paletteColorID
        );

        const globalcolorCodeArray = globalcolorData?.colors?.map(
          (item) => item.colorCode
        );

        setDrilldownSelectedColorPallet(defaultColor);
        setDrilldownColors(globalcolorCodeArray);
        if (response?.data?.data?.chartOptions?.chartType === 1) {
          response.data.data.chartOptions.chartType = 2;
        }
        // setDrilldownChartType(response.data.data.chartOptions.chartType || "");
        // setDrilldownLegendPosition(
        //   response.data.data.chartOptions.legend || ""
        // );
        // setDrilldownLabelPosition(
        //   response.data.data.chartOptions.dataLabel || ""
        // );
        // setDrilldownFontSize(response.data.data.chartOptions.fontSize || 12);
        // setDrilldownLabelColorState(
        //   response.data.data.chartOptions.lableColor || ""
        // );
        // setDrilldownAnnotationOpacity(
        //   response.data.data.chartOptions.scalarOpacity ?? 100
        // );

        setShowChartingView(true);
      }
      setViewLoader(false);
    } catch (error) {
      setViewLoader(false);
      console.error("Error fetching filter aggregate chart data:", error);
    }
  };

  const fetchCompositeAggregateChart = async (
    selectedSurveyIdData,
    selectedCompanyIdData,
    dataFilters = {}
  ) => {
    try {
      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT.filterAggregateChart,
        bodyData: {
          masterCompanyID: userData?.companyMasterID,
          companyID: Number(selectedCompanyIdData),
          assessmentID: Number(selectedSurveyIdData),
          negativeValue: showNegative,
          decimalPoints: Number(decimalValue),
          scaleMin:
            Object.keys(dataFilters).length > 0
              ? parseFloat(dataFilters.scaleMin)
              : parseFloat(fromValue),
          scaleMax:
            Object.keys(dataFilters).length > 0
              ? parseFloat(dataFilters.scaleMax)
              : parseFloat(toValue),
          action: "get_composite_aggregate",

          dataFilters,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        const transformed = response?.data?.data.map((item) => ({
          ...item,
          info_name: item.info_name === "Department Overall" ? "Overall" : item.info_name,
        }));
        setCompositeAggregateData(transformed);
        setOutComeData(response?.data?.data.map((val) => ({ [val.info_name?.replace("Department Overall","Overall")]: Number(val.value) })) || []);

        const result = transformDataAggregate(transformed);

        if(reduxSwitchAxis){
          const result2 = reduxSwitchAxis
          ? revertOutcomeData(result.category, result.value)
          : transformOutcomeData(result.category, result.value);
        setCategories(result2.outcomeCategories);
        setValue(result2.outcomeValues);
        console.log(result2,'result2')

        }
        else{
          const result2 =transformOutcomeData(result.category, result.value);
          const result3 =transformOutcomeData(result2.outcomeCategories, result2.outcomeValues);

          console.log(result2,'result2')
        setCategories(result3.outcomeCategories);
        setValue(result3.outcomeValues);
        }
        dispatch(updateAssessmentCharting({
          categories: result.category,
          values: result.value
        }));
        setRenderChart((prev) => !prev);
        setShowChartingView(true);
      }
      setViewLoader(false);
    } catch (error) {
      setViewLoader(false);
      console.error("Error fetching filter aggregate chart data:", error);
    }
  };
  const fetchCompositeOutcomeChart = async (
    selectedSurveyIdData,
    selectedCompanyIdData,
    dataFilters = {}
  ) => {
    try {
      // if(dataFilters?.outcomes?.length==0){
      //   setViewLoader(false)
      //   return toast.error('Atleast one question should be selected')
      // }
      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT.filterAggregateChart,
        bodyData: {
          masterCompanyID: userData?.companyMasterID,
          companyID: Number(selectedCompanyIdData),
          assessmentID: Number(selectedSurveyIdData),
          negativeValue: showNegative,
          decimalPoints: Number(decimalValue),
          scaleMin:
            Object.keys(dataFilters).length > 0
              ? parseFloat(dataFilters.scaleMin)
              : parseFloat(fromValue),
          scaleMax:
            Object.keys(dataFilters).length > 0
              ? parseFloat(dataFilters.scaleMax)
              : parseFloat(toValue),
          action: "get_composite_outcome",

          dataFilters,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        const transformed = response?.data?.data.map((item) => ({
          ...item,
          info_name: item.info_name === "Department Overall" ? "Overall" : item.info_name,
        }));
        setCompositeOutcomeData(response?.data?.data);
        setOutCometableData(transformed)
        if (response?.status) {
          const result = transformData(
            transformed,
            "outcomes",
            "outcome_name"
          );
          if(reduxSwitchAxis){
            const result2 = reduxSwitchAxis
            ? revertOutcomeData(result.category, result.value)
            : transformOutcomeData(result.category, result.value);
          setOutcomeCategories(result2.outcomeCategories);
          setOutcomeValue(result2.outcomeValues);
          }
          else{
            setOutcomeCategories(result.category);
              setOutcomeValue(result.value);
          }
          setRenderChart((prev) => !prev);
          setShowChartingView(true);
        }
        setShowChartingView(true);
      }
      setViewLoader(false);
    } catch (error) {
      setViewLoader(false);
      console.error("Error fetching filter aggregate chart data:", error);
    }
  };

  const fetchCompositeIntentionChart = async (
    selectedSurveyIdData,
    selectedCompanyIdData,
    dataFilters = {}
  ) => {
    try {
      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT.filterAggregateChart,
        bodyData: {
          masterCompanyID: userData?.companyMasterID,
          companyID: Number(selectedCompanyIdData),
          assessmentID: Number(selectedSurveyIdData),
          negativeValue: showNegative,
          decimalPoints: Number(decimalValue),
          scaleMin:
            Object.keys(dataFilters).length > 0
              ? parseFloat(dataFilters.scaleMin)
              : parseFloat(fromValue),
          scaleMax:
            Object.keys(dataFilters).length > 0
              ? parseFloat(dataFilters.scaleMax)
              : parseFloat(toValue),
          action: "get_composite_intention",

          dataFilters,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        const transformed = response?.data?.data.map((item) => ({
          ...item,
          info_name: item.info_name === "Department Overall" ? "Overall" : item.info_name,
        }));
        setCompositeIntentionData(response?.data?.data);
        setIntentiontableData(transformed)

        const result = transformData(
          transformed,
          "intentions",
          "intention_name"
        );
        console.log("tranfom",response?.data?.data)
        if(reduxSwitchAxis){
          const result2 
          = transformOutcomeData(result.category, result.value);
          setIntentionCategories(result2.outcomeCategories);
          setIntentionValue(result2.outcomeValues);
        }
        else{
          setIntentionCategories(result.category);
      setIntentionValue(result.value);
        }

        setRenderChart((prev) => !prev);
        setShowChartingView(true);
      }
      setViewLoader(false);
    } catch (error) {
      setViewLoader(false);
      console.error("Error fetching filter aggregate chart data:", error);
    }
  };

  const fetchCompositeRatingChart = async (
    selectedSurveyIdData,
    selectedCompanyIdData,
    dataFilters = {}
  ) => {
    try {
      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT.filterAggregateChart,
        bodyData: {
          masterCompanyID: userData?.companyMasterID,
          companyID: Number(selectedCompanyIdData),
          assessmentID: Number(selectedSurveyIdData),
          negativeValue: showNegative,
          decimalPoints: Number(decimalValue),
          scaleMin:
            Object.keys(dataFilters).length > 0
              ? parseFloat(dataFilters.scaleMin)
              : parseFloat(fromValue),
          scaleMax:
            Object.keys(dataFilters).length > 0
              ? parseFloat(dataFilters.scaleMax)
              : parseFloat(toValue),
          action: "get_composite_question",

          dataFilters,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        const transformed = response?.data?.data.map((item) => ({
          ...item,
          info_name: item.info_name === "Department Overall" ? "Overall" : item.info_name,
        }));
        const result = transformNestedData(transformed);
        setQuestionTable(transformed)
        if(switchAxis){
          const result2 = reduxSwitchAxis
        ? revertOutcomeData(result.category, result.value)
        : transformOutcomeData(result.category, result.value);
      setRatingCategories(result2.outcomeCategories);
      setRatingValue(result2.outcomeValues);
        setRenderChart((prev) => !prev);
        }else{
          setRatingCategories(result?.category);
          setRatingValue(result?.value);
        }
        setShowChartingView(true);
      }
      setViewLoader(false);
    } catch (error) {
      setViewLoader(false);
      console.error("Error fetching filter aggregate chart data:", error);
    }
  };

  function transformDataQuickCompare(data) {
    const value = [];
  
    const categoriesData = [
      ...new Set(
        data.map((item) =>
          ["demographic-user", "manager-user", "participant-user", "department-user","user-department","user-manager","demographic-department","demographic-manager",'user-demographic'].includes(item.data_type)
            ? "survey aggregate"
            : item.data_type
        )
      ),
    ];
  
    categoriesData.forEach((category) => {
      const filtered = data.filter((item) => {
        const type =
          ["demographic-user", "manager-user", "participant-user", "department-user","user-department","user-manager","demographic-department","demographic-manager",'user-demographic'].includes(item.data_type)
            ? "survey aggregate"
            : item.data_type;
        return type === category;
      });
  
      const valueObj = {};
      filtered.forEach((item) => {
        const formattedName = item.info_name.replace(/\s+/g, " ");
        valueObj[formattedName] = item.value;
      });
  
      value.push(valueObj);
    });
  
    return { categories: categoriesData, values: value };
  }
  

  function transformDataQuickCompareOutcomes(data) {
    const category = [];
    const value = [];

    data.forEach((item) => {
      category.push(item.info_name);

      const outcomeValuesQuickCompare = {};
      item.outcomes.forEach((outcome) => {
        outcomeValuesQuickCompare[outcome.outcome_name] = parseFloat(
          outcome.value
        );
      });

      value.push(outcomeValuesQuickCompare);
    });

    return { outcomeCategories: category, outcomeValues: value };
  }

  function transformDataQuickCompareIntentions(data) {
    const category = [];
    const value = [];

    data.forEach((item) => {
      category.push(item.info_name);

      const outcomeValuesQuickCompare = {};
      item.intentions.forEach((intention) => {
        outcomeValuesQuickCompare[intention.intention_name] = parseFloat(
          intention.value
        );
      });

      value.push(outcomeValuesQuickCompare);
    });

    return { intentionCategories: category, intentionValues: value };
  }
  
  const fetchQuickCompareAggregateChart = async (
    selectedSurveyIdData,
    selectedCompanyIdData,
    dataFilters = {}
  ) => {
    try {
      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT.filterAggregateChart,
        bodyData: {
          masterCompanyID: userData?.companyMasterID,
          companyID: Number(selectedCompanyIdData),
          assessmentID: Number(selectedSurveyIdData),
          negativeValue: showNegative,
          decimalPoints: Number(decimalValue),
          scaleMin:
            Object.keys(dataFilters).length > 0
              ? parseFloat(dataFilters.scaleMin)
              : parseFloat(fromValue),
          scaleMax:
            Object.keys(dataFilters).length > 0
              ? parseFloat(dataFilters.scaleMax)
              : parseFloat(toValue),
          action: "get_quick_compare_aggregate",

          dataFilters,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        setQuickComapre(true);
        let finalData = [];
        for (let oneRow of response?.data?.data) {

          const modifiedArray = oneRow.map((oneRo) => ({
            ...oneRo,
            info_name: oneRo.info_name?.replace("Department Overall", "Overall")
            // .replace('Demographic-User',"Survey Aggregate"),
          }));
        
          // console.log(modifiedArray, "uuuuuux");
          // console.log([...oneRow,],"uuuuuu")
          const result = transformDataQuickCompare(modifiedArray);
          finalData.push(result);
          if(!reduxSwitchAxis){
            console.log(reduxSwitchAxis,"sxi")
            const transformedData = finalData.map((item) => {
              const result = transformOutcomeData(
                item.categories,
                item.values
              );
              return {
                categories: result.outcomeCategories,
                values: result.outcomeValues,
              };
            });
            setQuickComapreData(transformedData);
          }
          else{
            console.log(reduxSwitchAxis,"sxi")
  
            setQuickComapreData(finalData);
  
          }
        }

        
        
        // setQuickComapreData(finalData);
        setOutComeData(finalData)
        setRenderChart((prev) => !prev);
        setShowChartingView(true);
      }
      setViewLoader(false);
    } catch (error) {
      setViewLoader(false);
      console.error("Error fetching filter aggregate chart data:", error);
    }
  };


  const fetchQuickCompareOutcomeChart = async (
    selectedSurveyIdData,
    selectedCompanyIdData,
    dataFilters = {}
  ) => {
    try {
      // if(dataFilters?.outcomes?.length==0){
      //   setViewLoader(false)
      //   return toast.error('Atleast one question should be selected')
      // }
      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT.filterAggregateChart,
        bodyData: {
          masterCompanyID: userData?.companyMasterID,
          companyID: Number(selectedCompanyIdData),
          assessmentID: Number(selectedSurveyIdData),
          negativeValue: showNegative,
          decimalPoints: Number(decimalValue),
          scaleMin:
            Object.keys(dataFilters).length > 0
              ? parseFloat(dataFilters.scaleMin)
              : parseFloat(fromValue),
          scaleMax:
            Object.keys(dataFilters).length > 0
              ? parseFloat(dataFilters.scaleMax)
              : parseFloat(toValue),
          action: "get_quick_compare_outcome",
          dataFilters,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        let finalData = [];
        for (let oneRow of response?.data?.data) {
          const modifiedArray = oneRow.map((oneRo) => ({
            ...oneRo,
            info_name: oneRo.info_name?.replace("Department Overall", "Overall"),
          }));
          const result = transformDataQuickCompareOutcomes(modifiedArray);
          finalData.push(result);
        }
        setQuickComapreOutcome(true);
        setQuickComapreOutcomeData(finalData);
        setOutCometableData(finalData)

        setShowChartingView(true);
      }
      setViewLoader(false);
    } catch (error) {
      setViewLoader(false);
      console.error("Error fetching filter aggregate chart data:", error);
    }
  };

  const fetchQuickCompareIntentionChart = async (
    selectedSurveyIdData,
    selectedCompanyIdData,
    dataFilters = {}
  ) => {
    try {
      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT.filterAggregateChart,
        bodyData: {
          masterCompanyID: userData?.companyMasterID,
          companyID: Number(selectedCompanyIdData),
          assessmentID: Number(selectedSurveyIdData),
          negativeValue: showNegative,
          decimalPoints: Number(decimalValue),
          scaleMin:
            Object.keys(dataFilters).length > 0
              ? parseFloat(dataFilters.scaleMin)
              : parseFloat(fromValue),
          scaleMax:
            Object.keys(dataFilters).length > 0
              ? parseFloat(dataFilters.scaleMax)
              : parseFloat(toValue),
          action: "get_quick_compare_intention",

          dataFilters,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        setQuickComapreIntemtion(true);
        let finalData = [];
        for (let oneRow of response?.data?.data) {
          const modifiedArray = oneRow.map((oneRo) => ({
            ...oneRo,
            info_name: oneRo.info_name?.replace("Department Overall", "Overall"),
          }));
          const result = transformDataQuickCompareIntentions(modifiedArray);
          finalData.push(result);
        }
        if(reduxSwitchAxis){
          console.log(reduxSwitchAxis,"sxi")
          const transformedData = finalData.map((item) => {
            const result = transformOutcomeData(
              item.intentionCategories,
              item.intentionValues
            );
            return {
              intentionCategories: result.outcomeCategories,
              intentionValues: result.outcomeValues,
            };
          });
          setQuickComapreIntemtionData(transformedData);
        }
        else{
          console.log(reduxSwitchAxis,"sxi")

          setQuickComapreIntemtionData(finalData);

        }
        setShowChartingView(true);
      }
      setViewLoader(false);
    } catch (error) {
      setViewLoader(false);
      console.error("Error fetching filter aggregate chart data:", error);
    }
  };

  function transformDataQuickCompareRating(data) {
    const category = [];
    const value = [];

    data.forEach((item) => {
      category.push(item.info_name);

      const outcomeValuesRatings = {};
      item.questions.forEach((questionData) => {
        const uniqueKey = `${questionData.question} [${questionData.question_id}]`;
        outcomeValuesRatings[uniqueKey] = parseFloat(questionData.value);
      });

      value.push(outcomeValuesRatings);
    });

    return { ratingCategories: category, ratingValue: value };
  }

  const fetchQuickCompareRatingChart = async (
    selectedSurveyIdData,
    selectedCompanyIdData,
    dataFilters = {}
  ) => {
    try {
      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT.filterAggregateChart,
        bodyData: {
          masterCompanyID: userData?.companyMasterID,
          companyID: Number(selectedCompanyIdData),
          assessmentID: Number(selectedSurveyIdData),
          negativeValue: showNegative,
          decimalPoints: Number(decimalValue),
          scaleMin:
            Object.keys(dataFilters).length > 0
              ? parseFloat(dataFilters.scaleMin)
              : parseFloat(fromValue),
          scaleMax:
            Object.keys(dataFilters).length > 0
              ? parseFloat(dataFilters.scaleMax)
              : parseFloat(toValue),
          action: "get_quick_compare_question",

          dataFilters,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        setShowChartingView(true);

        let finalData = [];
        for (let oneRow of response?.data?.data) {
          const result = transformDataQuickCompareRating(oneRow);
          finalData.push(result);
        }

        setQuickComapreRating(true);
        setQuickComapreOutcome(true)
        setQuickComapre(true)
        setQuickComapreIntemtion(true)
        setQuickComapreRatingData(finalData);
      }
      setViewLoader(false);
    } catch (error) {
      setViewLoader(false);
      console.error("Error fetching filter aggregate chart data:", error);
    }
  };

  const [reportName, setReportName] = useState("");
  const [openingComment, setOpeningComment] = useState("");
  const [closingComment, setClosingComment] = useState("");

  // Add new state for chart view type
  const [chartViewType, setChartViewType] = useState("FILTER");
 

  // Add callback function to update palette ID
  const handlePaletteColorChange = (colorData) => {
    setSelectedPaletteColorID(colorData.colorPaletteID);
    // eslint-disable-next-line no-use-before-define
    handleChartColorChange(colorData);
  };
  const handleSaveReport = async () => {
    try {
      // Get the appropriate chart data based on active tab
      let chartData;
      if (activeTab === "aggregate") {
        if (chartViewType === "FILTER") {

          chartData = filterAggregateData;
        } else if (chartViewType === "COMPARE") {

          chartData = quickComapre?quickComapreData: compositeAggregateData;
        }
      } else if (activeTab === "outcome") {
        if (chartViewType === "FILTER") {
          chartData = filterOutcomeData;
        } else if (chartViewType === "COMPARE") {
          chartData =quickComapreOutcome?quickComapreOutcomeData: compositeOutcomeData;
        }
      } else if (activeTab === "intention") {
        if (chartViewType === "FILTER") {
          chartData = filterIntentionData;
        } else if (chartViewType === "COMPARE") {
          chartData =quickComapreIntemtion?quickComapreIntemtionData: compositeIntentionData
        }
      }

      const payload = {
        reportName,
        openingComment,
        closingComment,
        masterCompanyID: userData?.companyMasterID,
        companyID: parseInt(selectedCompanyId, 10),
        assessmentID: parseInt(selectedSurveyId, 10),
        negativeValue: showNegative,
        decimalPoints: parseInt(decimalValue, 10),
        scaleMin: parseFloat(fromValue) || 0.0,
        scaleMax: parseFloat(toValue) || 5.0,
        isPreview: false,
        chartType: chartViewType, // Use chartViewType instead of hardcoded "FILTER"
        order: "ASC",
        reportType: activeTab.toUpperCase(),
        dataFilters: {
          outcomes: selectedOutcomeIds || [],
          // intentions: [1], // "INTENTION CHART"
          intentions: selectedIntentionIds || [],
          departments: selectedDepartments || [],
          users: selectedUsers || [],
          managers: selectedManagers || [],
          managerReportees: selectedManagerReportees || "D",
          benchmarks: benchmarkIds || [],
          references: [],
          demographicFilters:
            selectedDemographicFilters?.map((filter) => ({
              questionId: filter.questionId,
              questionValue: filter.questionValue,
              isBranch: filter.isBranch,
              responses:
                filter.selectedOptions?.map((opt) => ({
                  responseId: opt.value,
                  responseValue: opt.label,
                })) || [],
            })) || [],
        },
        chartData,
        chartOptions: {
          chartType: parseInt(chartType, 10) || 1,
          legend: parseInt(legendPosition, 10) || 1,
          switchAxis: switchAxis || false,
          scalarOpacity: parseInt(annotationOpacity, 10) || 100,
          fontSize: parseInt(fontSize, 10) || 3,
          lableColor: labelColorState || "#696666",
          paletteColorID: parseInt(selectedPaletteColorID),
          colors:colors,
          showCrosstab:showCrosstab,
          dataLabel:labelPosition,
          isQuickCompare:(quickComapre||quickComapreIntemtion||quickComapreOutcome)?true:false,


        },
        scalar: scalarConfiguration,
      };

      const response = await commonService({
        apiEndPoint: REPORTS_MANAGEMENT.singleChartReport,
        bodyData: payload,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        showSuccessToast("Report saved successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error saving report:", error);
      return false;
    }
  };

  const handlePreviewReport = async () => {
    try {
      let chartData;
      // return alert(chartViewType)


      // Determine chart data based on active tab and view type
      if (activeTab === "aggregate") {
        if (chartViewType === "FILTER") {

          chartData = filterAggregateData;
        } else if (chartViewType === "COMPARE") {

          chartData = quickComapre?quickComapreData: compositeAggregateData;
        }
      } else if (activeTab === "outcome") {
        if (chartViewType === "FILTER") {
          chartData = filterOutcomeData;
        } else if (chartViewType === "COMPARE") {
          chartData =quickComapreOutcome?quickComapreOutcomeData: compositeOutcomeData;
        }
      } else if (activeTab === "intention") {
        if (chartViewType === "FILTER") {
          chartData = filterIntentionData;
        } else if (chartViewType === "COMPARE") {
          chartData =quickComapreIntemtion?quickComapreIntemtionData: compositeIntentionData
        }
      }


      // return console.log(chartData,filterAggregateData,compositeIntentionData,filterIntentionData,chartViewType,activeTab)

      // if(!openingComment){
      //   return toast.error('Fill Opening Comment')
      // }
      // if(!closingComment){
      //   return toast.error('Fill Closing Comment')
      // }

      const payload = {
        reportName,
        openingComment,
        closingComment,
        masterCompanyID: userData?.companyMasterID,
        companyID: parseInt(selectedCompanyId, 10),
        assessmentID: parseInt(selectedSurveyId, 10),
        negativeValue: showNegative,
        decimalPoints: parseInt(decimalValue, 10),
        scaleMin: parseFloat(fromValue) || 0.0,
        scaleMax: parseFloat(toValue) || 5.0,
        isPreview: true,
        chartType: chartViewType,
        order: "ASC",
        reportType: activeTab.toUpperCase(),
        dataFilters: {
          outcomes: selectedOutcomeIds || [],
          intentions: selectedIntentionIds || [],
          departments: selectedDepartments || [],
          users: selectedUsers || [],
          managers: selectedManagers || [],
          managerReportees: selectedManagerReportees || "D",
          benchmarks: benchmarkIds || [],
          references: [],
          demographicFilters:
            selectedDemographicFilters?.map((filter) => ({
              questionId: filter.questionId,
              questionValue: filter.questionValue,
              isBranch: filter.isBranch,
              responses:
                filter.selectedOptions?.map((opt) => ({
                  responseId: opt.value,
                  responseValue: opt.label,
                })) || [],
            })) || [],
        },
        chartData,
        chartOptions: {
          chartType: parseInt(chartType, 10) || 1,
          legend: parseInt(legendPosition, 10) || 1,
          switchAxis: switchAxis || false, // Include switch axis state
          scalarOpacity: parseInt(annotationOpacity, 10) || 100,
          fontSize: parseInt(fontSize, 10) || 3,
          lableColor: labelColorState || "#696666",
          paletteColorID: parseInt(selectedPaletteColorID),
          colors:colors,
          dataLabel:labelPosition,
          showCrosstab:showCrosstab,
          isQuickCompare:(quickComapre||quickComapreIntemtion||quickComapreOutcome)?true:false,


        },
        scalar: scalarConfiguration,
      };

      const response = await commonService({
        apiEndPoint: REPORTS_MANAGEMENT.singleChartReport,
        bodyData: payload,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        const chartSettings = {
          Data: response.data?.data,
          key: "single-chart-report-preview",
        };

        saveChartSettings(chartSettings);
        localStorage.setItem("companyId", selectedCompanyId.toString()); // store as string

        window.open(adminRouteMap?.SINGLECHARTREPORTPREVIEW?.path, "_blank");
      }
    } catch (error) {
      console.error("Error saving report:", error);
    }
  };

  const handleSaveSummaryChartReport = async () => {
    try {
      const payload = {
        reportName,
        openingComment,
        closingComment,
        masterCompanyID: userData?.companyMasterID,
        companyID: parseInt(selectedCompanyId, 10),
        assessmentID: parseInt(selectedSurveyId, 10),
        negativeValue: showNegative,
        decimalPoints: parseInt(decimalValue, 10),
        scaleMin: parseFloat(fromValue) || 0.0,
        scaleMax: parseFloat(toValue) || 5.0,
        isPreview: false,
        chartType: "FILTER",
        action: "SUMMARY",
        order: "ASC",
        reportType: activeTab.toUpperCase(),
        dataFilters: {
          outcomes: selectedOutcomeIds || [],
          intentions: selectedIntentionIds || [],
          departments: selectedDepartments || [],
          users: selectedUsers || [],
          managers: selectedManagers || [],
          managerReportees: selectedManagerReportees || "D",
          benchmarks: benchmarkIds || [],
          references: [],
          demographicFilters:
            selectedDemographicFilters?.map((filter) => ({
              questionId: filter.questionId,
              questionValue: filter.questionValue,
              isBranch: filter.isBranch,
              responses:
                filter.selectedOptions?.map((opt) => ({
                  responseId: opt.value,
                  responseValue: opt.label,
                })) || [],
            })) || [],
        },

        chartOptions: {
          chartType: parseInt(chartType, 10) || 1,
          legend: parseInt(legendPosition, 10) || 1,
          switchAxis: switchAxis || false,
          scalarOpacity: parseInt(annotationOpacity, 10) || 100,
          fontSize: parseInt(fontSize, 10) || 3,
          lableColor: labelColorState || "#696666",
          paletteColorID: parseInt(selectedPaletteColorID),
          colors:colors,
          showCrosstab:showCrosstab,
          dataLabel:labelPosition,


        },
        scalar: scalarConfiguration,
      };

      const response = await commonService({
        apiEndPoint: REPORTS_MANAGEMENT.summaryChartReport,
        bodyData: payload,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        showSuccessToast("Report saved successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error saving report:", error);
      return false;
    }
  };

  const handleSaveDetailChartReport = async () => {
    try {
      const payload = {
        reportName,
        openingComment,
        closingComment,
        masterCompanyID: userData?.companyMasterID,
        companyID: parseInt(selectedCompanyId, 10),
        assessmentID: parseInt(selectedSurveyId, 10),
        negativeValue: showNegative,
        decimalPoints: parseInt(decimalValue, 10),
        scaleMin: parseFloat(fromValue) || 0.0,
        scaleMax: parseFloat(toValue) || 5.0,
        isPreview: false,
        chartType: "FILTER",
        isOEQ: true,
        isRBOEQ: true,
        action: "DETAIL",
        order: "ASC",
        reportType: activeTab.toUpperCase(),
        dataFilters: {
          outcomes: selectedOutcomeIds || [],
          intentions: selectedIntentionIds || [],
          departments: selectedDepartments || [],
          users: selectedUsers || [],
          managers: selectedManagers || [],
          managerReportees: selectedManagerReportees || "D",
          benchmarks: benchmarkIds || [],
          references: [],
          demographicFilters:
            selectedDemographicFilters?.map((filter) => ({
              questionId: filter.questionId,
              questionValue: filter.questionValue,
              isBranch: filter.isBranch,
              responses:
                filter.selectedOptions?.map((opt) => ({
                  responseId: opt.value,
                  responseValue: opt.label,
                })) || [],
            })) || [],
        },

        chartOptions: {
          chartType: parseInt(chartType, 10) || 1,
          legend: parseInt(legendPosition, 10) || 1,
          switchAxis: switchAxis || false,
          scalarOpacity: parseInt(annotationOpacity, 10) || 100,
          fontSize: parseInt(fontSize, 10) || 3,
          lableColor: labelColorState || "#696666",
          paletteColorID: parseInt(selectedPaletteColorID),
          colors:colors,
          showCrosstab:showCrosstab,
          dataLabel:labelPosition,


        },
        scalar: scalarConfiguration,
      };

      const response = await commonService({
        apiEndPoint: REPORTS_MANAGEMENT.detailedChartReport,
        bodyData: payload,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        showSuccessToast("Report saved successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error saving report:", error);
      return false;
    }
  };

  const handleSummaryPreviewReport = async () => {
    try {
      const payload = {
        reportName,
        openingComment,
        closingComment,
        masterCompanyID: userData?.companyMasterID,
        companyID: parseInt(selectedCompanyId, 10),
        assessmentID: parseInt(selectedSurveyId, 10),
        negativeValue: showNegative,
        decimalPoints: parseInt(decimalValue, 10),
        scaleMin: parseFloat(fromValue) || 0.0,
        scaleMax: parseFloat(toValue) || 5.0,
        isPreview: true,
        chartType: "FILTER",
        action: "SUMMARY",
        order: "ASC",
        reportType: activeTab.toUpperCase(),
        dataFilters: {
          outcomes: selectedOutcomeIds || [],
          intentions: selectedIntentionIds || [],
          departments: selectedDepartments || [],
          users: selectedUsers || [],
          managers: selectedManagers || [],
          managerReportees: selectedManagerReportees || "D",
          benchmarks: benchmarkIds || [],
          references: [],
          demographicFilters:
            selectedDemographicFilters?.map((filter) => ({
              questionId: filter.questionId,
              questionValue: filter.questionValue,
              isBranch: filter.isBranch,
              responses:
                filter.selectedOptions?.map((opt) => ({
                  responseId: opt.value,
                  responseValue: opt.label,
                })) || [],
            })) || [],
        },

        chartOptions: {
          chartType: parseInt(chartType, 10) || 1,
          legend: parseInt(legendPosition, 10) || 1,
          switchAxis: switchAxis || false,
          scalarOpacity: parseInt(annotationOpacity, 10) || 100,
          fontSize: parseInt(fontSize, 10) || 3,
          lableColor: labelColorState || "#696666",
          paletteColorID: parseInt(selectedPaletteColorID),
          colors:colors,
          dataLabel:labelPosition,
          showCrosstab:showCrosstab
        },
        scalar: scalarConfiguration,
      };

      const response = await commonService({
        apiEndPoint: REPORTS_MANAGEMENT.summaryChartReport,
        bodyData: payload,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        const chartSettings = {
          Data: response.data?.data,
          key: "summary-report-preview",
        };
        saveChartSettings(chartSettings);
        localStorage.setItem("companyId", selectedCompanyId.toString()); // store as string
        window.open(adminRouteMap?.SUMMARYREPORTPREVIEW?.path, "_blank");
      }
    } catch (error) {
      console.error("Error saving report:", error);
    }
  };

  const handleDetailsPreviewReport = async () => {
    try {
      const payload = {
        reportName,
        openingComment,
        closingComment,
        masterCompanyID: userData?.companyMasterID,
        companyID: parseInt(selectedCompanyId, 10),
        assessmentID: parseInt(selectedSurveyId, 10),
        negativeValue: showNegative,
        decimalPoints: parseInt(decimalValue, 10),
        scaleMin: parseFloat(fromValue) || 0.0,
        scaleMax: parseFloat(toValue) || 5.0,
        isPreview: true,
        chartType: "FILTER",
        action: "DETAIL",
        order: "ASC",
        isOEQ: true,
        isRBOEQ: true,
        reportType: activeTab.toUpperCase(),
        dataFilters: {
          departments: selectedDepartments || [],
          users: selectedUsers || [],
          intentions:selectedIntentionIds||[],
          managers: selectedManagers || [],
          managerReportees: selectedManagerReportees || "D",
          benchmarks: benchmarkIds || [],
          references: [],
          demographicFilters:
            selectedDemographicFilters?.map((filter) => ({
              questionId: filter.questionId,
              questionValue: filter.questionValue,
              isBranch: filter.isBranch,
              responses:
                filter.selectedOptions?.map((opt) => ({
                  responseId: opt.value,
                  responseValue: opt.label,
                })) || [],
            })) || [],
        },

        chartOptions: {
          chartType: parseInt(chartType, 10) || 1,
          legend: parseInt(legendPosition, 10) || 1,
          switchAxis: switchAxis || false,
          scalarOpacity: parseInt(annotationOpacity, 10) || 100,
          fontSize: parseInt(fontSize, 10) || 3,
          lableColor: labelColorState || "#696666",
          paletteColorID: parseInt(selectedPaletteColorID),
          colors:colors,
          showCrosstab:showCrosstab
          ,          dataLabel:labelPosition,


        },
        scalar: scalarConfiguration,
      };

      const response = await commonService({
        apiEndPoint: REPORTS_MANAGEMENT.detailedChartReport,
        bodyData: payload,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        showSuccessToast("Preview report successfully");
        if (response?.status) {
          const chartSettings = {
            Data: response.data?.data,
            key: "deatiled-chart-report-preview",
          };
          saveChartSettings(chartSettings);
          localStorage.setItem("companyId", selectedCompanyId.toString()); // store as string

          window.open(adminRouteMap?.DETAILCHARTREPORT?.path, "_blank");
        }
      }
    } catch (error) {
      console.error("Error saving report:", error);
    }
  };

  const handleIGSaveReport = async () => {
    try {
      const payload = {
        reportName,
        openingComment,
        closingComment,
        masterCompanyID: userData?.companyMasterID,
        companyID: parseInt(selectedCompanyId, 10),
        assessmentID: parseInt(selectedSurveyId, 10),
        negativeValue: showNegative,
        decimalPoints: parseInt(decimalValue, 10),
        scaleMin: parseFloat(fromValue) || 0.0,
        scaleMax: parseFloat(toValue) || 5.0,
        isPreview: false,
        // chartType: chartViewType, // Use chartViewType instead of hardcoded "FILTER"
        order: "ASC",
        action: "IG",
        reportType: activeTab.toUpperCase(),
        dataFilters: {
          outcomes: selectedOutcomeIds || [],
          // intentions: [1], // "INTENTION CHART"
          intentions: selectedIntentionIds || [],
          departments: selectedDepartments || [],
          users: selectedUsers || [],
          managers: selectedManagers || [],
          managerReportees: selectedManagerReportees || "D",
          benchmarks: benchmarkIds || [],
          references: [],
          demographicFilters:
            selectedDemographicFilters?.map((filter) => ({
              questionId: filter.questionId,
              questionValue: filter.questionValue,
              isBranch: filter.isBranch,
              responses:
                filter.selectedOptions?.map((opt) => ({
                  responseId: opt.value,
                  responseValue: opt.label,
                })) || [],
            })) || [],
        },
        chartData: informationGatheringData,
        chartOptions: {
          chartType: parseInt(chartType, 10) || 1,
          legend: parseInt(legendPosition, 10) || 1,
          switchAxis: switchAxis || false,
          scalarOpacity: parseInt(annotationOpacity, 10) || 100,
          fontSize: parseInt(fontSize, 10) || 3,
          lableColor: labelColorState || "#696666",
          paletteColorID: parseInt(selectedPaletteColorID),
          showCrosstab:showCrosstab,
          dataLabel:labelPosition,


        },
        scalar: scalarConfiguration,
      };

      const response = await commonService({
        apiEndPoint: REPORTS_MANAGEMENT.igChartReport,
        bodyData: payload,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        showSuccessToast("Report saved successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error saving report:", error);
      return false;
    }
  };

  const handleIGPreviewReport = async () => {
    try {
      const payload = {
        reportName,
        openingComment,
        closingComment,
        masterCompanyID: userData?.companyMasterID,
        companyID: parseInt(selectedCompanyId, 10),
        assessmentID: parseInt(selectedSurveyId, 10),
        negativeValue: showNegative,
        decimalPoints: parseInt(decimalValue, 10),
        scaleMin: parseFloat(fromValue) || 0.0,
        scaleMax: parseFloat(toValue) || 5.0,
        isPreview: true,
        // chartType: chartViewType, // Use chartViewType instead of hardcoded "FILTER"
        order: "ASC",
        action: "IG",
        reportType: activeTab.toUpperCase(),
        dataFilters: {
          outcomes: selectedOutcomeIds || [],
          // intentions: [1], // "INTENTION CHART"
          intentions: selectedIntentionIds || [],
          departments: selectedDepartments || [],
          users: selectedUsers || [],
          managers: selectedManagers || [],
          managerReportees: selectedManagerReportees || "D",
          benchmarks: benchmarkIds || [],
          references: [],
          demographicFilters:
            selectedDemographicFilters?.map((filter) => ({
              questionId: filter.questionId,
              questionValue: filter.questionValue,
              isBranch: filter.isBranch,
              responses:
                filter.selectedOptions?.map((opt) => ({
                  responseId: opt.value,
                  responseValue: opt.label,
                })) || [],
            })) || [],
        },
        chartData: informationGatheringData,
        chartOptions: {
          chartType: parseInt(chartType, 10) || 1,
          legend: parseInt(legendPosition, 10) || 1,
          switchAxis: switchAxis || false,
          scalarOpacity: parseInt(annotationOpacity, 10) || 100,
          fontSize: parseInt(fontSize, 10) || 3,
          lableColor: labelColorState || "#696666",
          paletteColorID: parseInt(IGPaletteColorID , 10),
          colors:colors,
          showCrosstab:showCrosstab,
          dataLabel:labelPosition,

        },
        scalar: scalarConfiguration,
      };

      const response = await commonService({
        apiEndPoint: REPORTS_MANAGEMENT.igChartReport,
        bodyData: payload,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        const chartSettings = {
          Data: response.data?.data,
          key: "ig-chart-report-preview",
        };

        saveChartSettings(chartSettings);

        window.open(adminRouteMap?.IGCHARTREPORT?.path, "_blank");
      }
    } catch (error) {
      console.error("Error saving report:", error);
    }
  };

  const handleDDSaveReport = async () => {
    try {
      const payload = {
        reportName,
        openingComment,
        closingComment,
        masterCompanyID: userData?.companyMasterID,
        companyID: parseInt(selectedCompanyId, 10),
        assessmentID: parseInt(selectedSurveyId, 10),
        negativeValue: showNegative,
        decimalPoints: parseInt(decimalValue, 10),
        scaleMin: parseFloat(fromValue) || 0.0,
        scaleMax: parseFloat(toValue) || 5.0,
        isPreview: false,
        // chartType: chartViewType, // Use chartViewType instead of hardcoded "FILTER"
        order: "ASC",
        action: "DD",
        reportType: activeTab.toUpperCase(),
        dataFilters: {
          outcomes: selectedOutcomeIds || [],
          // intentions: [1], // "INTENTION CHART"
          intentions: selectedIntentionIds || [],
          departments: selectedDepartments || [],
          users: selectedUsers || [],
          managers: selectedManagers || [],
          managerReportees: selectedManagerReportees || "D",
          benchmarks: benchmarkIds || [],
          references: [],
          demographicFilters:
            selectedDemographicFilters?.map((filter) => ({
              questionId: filter.questionId,
              questionValue: filter.questionValue,
              isBranch: filter.isBranch,
              responses:
                filter.selectedOptions?.map((opt) => ({
                  responseId: opt.value,
                  responseValue: opt.label,
                })) || [],
            })) || [],
        },
        chartData: drilldownData,
        chartOptions: {
          chartType: parseInt(chartType, 10) || 1,
          legend: parseInt(legendPosition, 10) || 1,
          switchAxis: switchAxis || false,
          scalarOpacity: parseInt(annotationOpacity, 10) || 100,
          fontSize: parseInt(fontSize, 10) || 3,
          lableColor: labelColorState || "#696666",
          paletteColorID: parseInt(selectedPaletteColorID),
          colors:colors,
          showCrosstab:showCrosstab,
          dataLabel:labelPosition,

        },
        scalar: scalarConfiguration,
      };

      const response = await commonService({
        apiEndPoint: REPORTS_MANAGEMENT.drillDownChartReport,
        bodyData: payload,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        showSuccessToast("Report saved successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error saving report:", error);
      return false;
    }
  };

  const handleDDPreviewReport = async () => {
    try {
      const payload = {
        reportName,
        openingComment,
        closingComment,
        masterCompanyID: userData?.companyMasterID,
        companyID: parseInt(selectedCompanyId, 10),
        assessmentID: parseInt(selectedSurveyId, 10),
        negativeValue: showNegative,
        decimalPoints: parseInt(decimalValue, 10),
        scaleMin: parseFloat(fromValue) || 0.0,
        scaleMax: parseFloat(toValue) || 5.0,
        isPreview: true,
        // chartType: chartViewType, // Use chartViewType instead of hardcoded "FILTER"
        order: "ASC",
        action: "DD",
        reportType: activeTab.toUpperCase(),
        dataFilters: {
          outcomes: selectedOutcomeIds || [],
          // intentions: [1], // "INTENTION CHART"
          intentions: selectedIntentionIds || [],
          departments: selectedDepartments || [],
          users: selectedUsers || [],
          managers: selectedManagers || [],
          managerReportees: selectedManagerReportees || "D",
          benchmarks: benchmarkIds || [],
          references: [],
          demographicFilters:
            selectedDemographicFilters?.map((filter) => ({
              questionId: filter.questionId,
              questionValue: filter.questionValue,
              isBranch: filter.isBranch,
              responses:
                filter.selectedOptions?.map((opt) => ({
                  responseId: opt.value,
                  responseValue: opt.label,
                })) || [],
            })) || [],
        },
        chartData: drilldownData,
        chartOptions: {
          chartType: parseInt(drilldownChartType, 10) || 1,
          legend: parseInt(drilldownLegendPosition, 10) || 1,
          switchAxis: drilldownswitchAxis || false,
          scalarOpacity: parseInt(drilldownAnnotationOpacity, 10) || 100,
          fontSize: parseInt(drilldownFontSize, 10) || 3,
          lableColor: drilldownLabelColorState|| "#696666",
          paletteColorID: parseInt(drillDownPaletteColorID, 10),
          showCrosstab:showCrosstab,
          dataLabel:labelPosition,

        },
        scalar: scalarConfiguration,
      };

      const response = await commonService({
        apiEndPoint: REPORTS_MANAGEMENT.drillDownChartReport,
        bodyData: payload,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        const chartSettings = {
          Data: response.data?.data,
          key: "dd-chart-report-preview",
        };

        saveChartSettings(chartSettings);

        window.open(adminRouteMap?.DDCHARTREPORTPREVIEW?.path, "_blank");
      }
    } catch (error) {
      console.error("Error saving report:", error);
    }
  };

  const saveBenchmarkdata = async (
    companyID,
    surveyID,
    benchmarkName,
    benchmarkData,
    benchmarkID = null // Add optional benchmarkID parameter
  ) => {
    try {
      const payload = {
        masterCompanyID: userData?.companyMasterID,
        companyID,
        assessmentID: surveyID,
        action: benchmarkID ? "update_benchmark" : "save_benchmark",
        benchmarkName,
        benchmarkData,
        ...(benchmarkID && { benchmarkID: parseInt(benchmarkID, 10) }), // Ensure benchmarkID is integer
      };

      const response = await commonService({
        apiEndPoint: benchmarkID
          ? SURVEYS_MANAGEMENT.updateBenchMarkData
          : SURVEYS_MANAGEMENT.filterAggregateChart,
        bodyData: payload,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        if (benchmarkID) {
          fetchAssessmentChart(surveyID, "list_benchmark");
          showSuccessToast("Benchmark updated successfully");
        } else {
          fetchAssessmentChart(surveyID, "list_benchmark");
          showSuccessToast("Benchmark saved successfully");
        }
      }
    } catch (error) {
      console.error("Error saving/updating benchmark data:", error);
    }
  };
  // Add validation states
  const [datasetNameError, setDatasetNameError] = useState("");
  const [datasetDescriptionError, setDatasetDescriptionError] = useState("");

  const saveIRDataset = async (
    datasetName,
    datasetDescription,
    dataFilters
  ) => {
    // Reset validation errors
    setDatasetNameError("");
    setDatasetDescriptionError("");

    // Validate inputs
    let hasError = false;

    if (!datasetName || datasetName.trim() === "") {
      setDatasetNameError("Dataset name is required");
      hasError = true;
    }

    // if (!datasetDescription || datasetDescription.trim() === "") {
    //   setDatasetDescriptionError("Dataset description is required");
    //   hasError = true;
    // }

    if (hasError) {
      return; // Stop execution if validation fails
    }

    try {
      const payload = {
        assessmentID: parseInt(selectedSurveyId, 10),
        companyID: parseInt(selectedCompanyId, 10),
        masterCompanyID: userData?.companyMasterID,
        datasetName,
        datasetDescription,
        dataFilters,
      };

      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT.saveDataset,
        bodyData: payload,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        // Handle success (e.g., show notification)
        showSuccessToast("Dataset saved successfully");
        setDatasetId(response.data); // Store the dataset ID
        setsaveDatasetStatus(true)
        setDatasetDescription("");

        saveDatasetClose(); // Close modal on success
      }

      // eslint-disable-next-line no-use-before-define
      // eslint-disable-next-line no-use-before-define
    } catch (error) {
      console.error("Error saving dataset:", error);
    }
  };

  const saveFilterSubset = async (
    subsetName,
    dataFilters,
    subsetType = "FCSS"
  ) => {
    try {
      const payload = {
        action: "save_filter_subset",
        masterCompanyID: userData?.companyMasterID,
        companyID: parseInt(selectedCompanyId, 10),
        assessmentID: parseInt(selectedSurveyId, 10),
        name: subsetName,
        dataFilters: {
          ...dataFilters,
          demographicFilters: dataFilters.demographicFilters?.map((filter) => ({
            questionId: filter.questionId,
            isBranch: filter.isBranch,
            responses: filter.responses,
          })),
        },
        subsetType,
      };

      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT.filterAggregateChart,
        bodyData: payload,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        toast.success(`${subsetType === "CCSS" ? "Compare" : "Filter"} Subset saved successfully`);
        console.log("SUBSET SAVED DATA: ", response?.data);
        // Refresh the filter subset options list
        if (selectedSurveyId) {
          fetchAssessmentChart(selectedSurveyId, "get_filter_subset_list", null, subsetType);
        }
        return response?.data?.data;
      }
    } catch (error) {
      console.error("Error saving filter subset:", error);
      throw error;
    }
  };

  const fetchCrossTab = async (companyID, surveyID) => {
    try {
      const payload = {
        masterCompanyID: userData?.companyMasterID,
        companyID: parseInt(companyID, 10), // Ensure companyID is an integer
        assessmentID: parseInt(surveyID, 10), // Ensure surveyID is an integer
        negativeValue: true,
        decimalPoints: 2,
        scaleMin: 0.001,
        scaleMax: 5.001,
        action: "get_cross_tab_data",
        dataFilters: {
          departments: [0],
          users: [],
          managers: [],
          managerReportees: "D", // D - Direct | A - All
        },
      };

      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT.filterAggregateChart,
        bodyData: payload,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        console.log("CROSS TAB: ", response?.data?.data)
        setShowCrosstabData(response?.data?.data);
      }
    } catch (error) {
      console.error("Error fetching benchmark data:", error);
    }
  };

  const fetchSaveBenchMark = async (companyID, surveyID, dataFilters) => {
    try {
      const payload = {
        masterCompanyID: userData?.companyMasterID,
        companyID: parseInt(companyID, 10), // Ensure companyID is an integer
        assessmentID: parseInt(surveyID, 10), // Ensure surveyID is an integer
        negativeValue: true,
        decimalPoints: 2,
        scaleMin: 0.001,
        scaleMax: 5.001,
        action: "get_benchmark_data",
        dataFilters:{
          demographicFilters:selectedDemographicFilters?.map((item) => ({
            ...item,
            responses: item.responses.map((res) => ({
              ...res,
              responseId: res.response_id,
              responseValue:res.value

            }))
          })),
          departments:selectedDepartments,
          users:selectedUsers,
          managers:selectedManagers,
          managerReportees:selectedManagerReportees
        }, // Use the dataFilters directly from the component
      };

      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT.filterAggregateChart,
        bodyData: payload,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        setSaveBenchmarkListData(response?.data?.data||[]);
      }
    } catch (error) {
      console.error("Error fetching benchmark data:", error);
    }
  };

  useEffect(() => {
    if (userData?.companyMasterID) {
      fetchOptionDetails(
        `company?companyMasterID=${userData?.companyMasterID}`,
        "company"
      );
    }
    fetchScore();

    // eslint-disable-next-line no-use-before-define
    fetchChartOptions("get_chart_option_dropdowns","DA");
    // eslint-disable-next-line no-use-before-define
    fetchChartOptionsDemographics("get_chart_option_dropdowns", "DRILLDOWN");

    const styleId = "pulse-keyframes-style";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.innerHTML = `
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }
  }, [userData,selectedCompanyId]);

  // Update the company select handler
  const handleCompanyChange = (option) => {
    setSelectedCompanyId(option.value);
    fetchSurvey(option.value);
  };

  // Handle survey selection
  const handleSurveyChange = (option) => {
    setSelectedSurveyId(option.value);
    setSelectedSurveyName(option.label); // Set the selected survey name
    fetchOutcome(selectedCompanyId, option.value); // Fetch outcomes
    // Fetch all required dropdowns
    fetchAssessmentChart(option.value, "scalar_configuration");
    fetchAssessmentChart(option.value, "demographic_question_list");
    
    fetchAssessmentChart(option.value, "get_filter_subset_list", null, "FCSS"); // Always FCSS for aggregate

    fetchAssessmentChart(option.value, "get_scale_range_list");
    fetchAssessmentChart(option.value, "list_benchmark");

    fetchAssessmentChart(
      option.value,
      "department_list_dropdown",
      selectedCompanyId
    );
    fetchAssessmentChart(
      option.value,
      "manager_list_dropdown",
      selectedCompanyId
    );

    fetchAssessmentChart(option.value, "user_list_dropdown", selectedCompanyId);

    // eslint-disable-next-line no-use-before-define
    if (showCrosstab) {
      fetchCrossTab(selectedCompanyId, option.value);
    }
  };

  // Add state to track if the range is custom
  const [isCustomRange, setIsCustomRange] = useState(false);
  const handleScaleRangeChange = (option) => {
    setSelectedScaleRange(option.value);

    // Prefill "From" and "To" values based on the selected range
    const selectedRange = scalerrangelist.find(
      (scale) => scale.value === option.value
    );
    if (selectedRange) {
      if (selectedRange.label === "Default") {
        // Set default values for the Default option
        setFromValue("0.00");
        setToValue("100.00");
      } else {
        const rangeParts = selectedRange.label.split(" to ");
        setFromValue(rangeParts[0] || ""); // Set "From" value
        setToValue(rangeParts[1] || ""); // Set "To" value
      }
    }

    // Enable "From" and "To" inputs only for "Custom" range
    setIsCustomRange(option.value === -1); // -1 corresponds to "Custom"
  };

  // Add effect to set default scale range when scalerrangelist is loaded
  useEffect(() => {
    if (scalerrangelist?.length > 0) {
      const defaultOption = scalerrangelist.find(option => option.label === "Default");
      if (defaultOption) {
        setSelectedScaleRange(defaultOption.value);
        // Always set From and To values to 0.00 and 100.00 at the start
        setFromValue("0.00");
        setToValue("100.00");
      }
    }
  }, [scalerrangelist]);


  useEffect(() => {
    console.log("scalerrange: ", scalerrangelist)
  }, [scalerrangelist]);
  // Add handlers for scalar configuration
  const handleScalarChange = (newConfig) => {
    setScalarConfiguration(newConfig);
  };

  const handleUpdateScalarConfiguration = async (payload) => {
    try {
      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT.updateSurveyAssessmentChart,
        method: "PUT",
        bodyData: payload,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        toastType: {
          success: true,
          error: true,
        },
      });
      if (response?.status) {
        // Optionally refresh the configuration data
        fetchAssessmentChart(selectedSurveyId, "scalar_configuration");
      }
    } catch (error) {
      console.error("Error updating scalar configuration:", error);
    }
  };

  const handleOutcomeChange = (selectedOutcomes) => {
    const outcomeIDs = selectedOutcomes.map((outcome) => outcome.value);
    setSelectedOutcomeIds(outcomeIDs);
    if (selectedSurveyId) {
      fetchIntentionList(selectedSurveyId, selectedCompanyId, outcomeIDs);
    }
  };
  const switchAxisFromRedux = useSelector(getAssessmentCharting)?.switchAxis;

  const handleChartColorChange = (colorData) => {
    // Update chart colors here

    // TODO: Update chart with new colors
    const colorCodeArray = colorData?.colors?.map((item) => item.colorCode);
    setColors(colorCodeArray);
    // setDrilldownColors(colorCodeArray)
    // setDrilldownSelectedColorPallet(colorData);
    // setDrillDownPaletteColorID(colorData.colorPaletteID);
    setIGColors(colorCodeArray)
    setDrilldownColors(colorCodeArray)
    // setIGPaletteColorID()
    let tempData = [];
    for (let oneRowData of IGQuestionsData) {
   
      
      oneRowData.colorsArray = colorCodeArray;
      tempData.push(oneRowData);
    }

    setRenderChart((prev) => !prev);
    setDrilldownColors(colorCodeArray)
    setRenderScalar((prev) => !prev);
    setIGQuestionsData(tempData);
    setRenderChart((prev) => !prev);

    if(true){
      let tempData = [];
      for (let oneRowData of DrillDownQuestionsData) {
    
        oneRowData.colorsArray = colorCodeArray;
        tempData.push(oneRowData);
      }
  
      setRenderChart((prev) => !prev);
      setRenderScalar((prev) => !prev);
      setDrillDownQuestionsData(tempData);
    }
  };
const reduxSwitchAxis = useSelector(getAssessmentCharting)?.switchAxis;
const reduxChartData = useSelector(getAssessmentCharting);




const handleSwitchAxisChangeforaggregate = (event) => {
  if (activeTab === "outcome") {
    if (quickComapreOutcome && quickComapreOutcomeData?.length > 0) {
      // Handle quick compare outcome data
      if (!switchAxis) {
        const transformedData = quickComapreOutcomeData.map((item) => {
          const result = transformOutcomeData(
            item.outcomeCategories,
            item.outcomeValues
          );
          return {
            outcomeCategories: result.outcomeCategories,
            outcomeValues: result.outcomeValues,
          };
        });
        setQuickComapreOutcomeData(transformedData);
      } else {
        const transformedData = quickComapreOutcomeData.map((item) => {
          const result = revertOutcomeData(
            item.outcomeCategories,
            item.outcomeValues
          );
          return {
            outcomeCategories: result.outcomeCategories,
            outcomeValues: result.outcomeValues,
          };
        });
        setQuickComapreOutcomeData(transformedData);
      }
    } else {
      // Handle default outcome data
      // eslint-disable-next-line no-lonely-if
      if (!switchAxis) {
        const result = transformOutcomeData(outcomeCategories, outcomeValues);
        setOutcomeCategories(result?.outcomeCategories);
        setOutcomeValue(result?.outcomeValues);
        console.log("Transformed Outcome Data:", result);
      } else {
        const result = revertOutcomeData(outcomeCategories, outcomeValues);
        setOutcomeCategories(result?.outcomeCategories);
        setOutcomeValue(result?.outcomeValues);
        console.log("Reverted Outcome Data:", result);
      }
    }
  } else if (activeTab === "intention") {
    if (quickComapreIntemtion && quickComapreIntemtionData?.length > 0) {
      // Handle quick compare intention data
      if (!switchAxis) {
        const transformedData = quickComapreIntemtionData.map((item) => {
          const result = transformOutcomeData(
            item.intentionCategories,
            item.intentionValues
          );
          return {
            intentionCategories: result.outcomeCategories,
            intentionValues: result.outcomeValues,
          };
        });
        setQuickComapreIntemtionData(transformedData);
      } else {
        const transformedData = quickComapreIntemtionData.map((item) => {
          const result = revertOutcomeData(
            item.intentionCategories,
            item.intentionValues
          );
          return {
            intentionCategories: result.outcomeCategories,
            intentionValues: result.outcomeValues,
          };
        });
        setQuickComapreIntemtionData(transformedData);
      }
    } else {
      // Handle default intention data
      // eslint-disable-next-line no-lonely-if
      if (!switchAxis) {
        const result = transformOutcomeData(
          intentionCategories,
          intentionValues
        );
        setIntentionCategories(result?.outcomeCategories);
        setIntentionValue(result?.outcomeValues);
      } else {
        const result = revertOutcomeData(
          intentionCategories,
          intentionValues
        );
        setIntentionCategories(result?.outcomeCategories);
        setIntentionValue(result?.outcomeValues);
      }
    }
  } else if (activeTab === "aggregate") {
    if (quickComapre && quickComapreData?.length > 0) {
      // Handle quick compare data
      if (!switchAxis) {
        const transformedData = quickComapreData.map((item) => {
          const result = transformOutcomeData(item.categories, item.values);
          return {
            categories: result.outcomeCategories,
            values: result.outcomeValues,
          };
        });
        setQuickComapreData(transformedData);
      } else {
        const transformedData = quickComapreData.map((item) => {
          const result = revertOutcomeData(item.categories, item.values);
          return {
            categories: result.outcomeCategories,
            values: result.outcomeValues,
          };
        });
        setQuickComapreData(transformedData);
      }
    } else {
      // Handle default data
      // eslint-disable-next-line no-lonely-if
      if (!switchAxis) {
        const result = transformOutcomeData(categories, values);
        console.log("CATEGORIES: ", result)
        setCategories(result?.outcomeCategories);
        setValue(result?.outcomeValues);
        setRenderChart((prev) => !prev);
      } else {
        const result = revertOutcomeData(categories, values);
        console.log("CATEGORIES: ", result)
        setCategories(result?.outcomeCategories);
        setValue(result?.outcomeValues);
        setRenderChart((prev) => !prev);
      }
    }
  } else if (activeTab === "rating") {
    if (quickComapreRating && quickComapreRatingData?.length > 0) {
      // Handle quick compare rating data
      if (!switchAxis) {
        const transformedData = quickComapreRatingData.map((item) => {
          const result = transformOutcomeData(
            item.ratingCategories,
            item.ratingValue
          );
          return {
            ratingCategories: result.outcomeCategories,
            ratingValue: result.outcomeValues,
          };
        });
        setQuickComapreRatingData(transformedData);
      } else {
        const transformedData = quickComapreRatingData.map((item) => {
          const result = revertOutcomeData(
            item.ratingCategories,
            item.ratingValue
          );
          return {
            ratingCategories: result.outcomeCategories,
            ratingValue: result.outcomeValues,
          };
        });
        setQuickComapreRatingData(transformedData);
      }
    } else {
      // Handle default rating data
      // eslint-disable-next-line no-lonely-if
      if (!switchAxis) {
        const result = transformOutcomeData(ratingCategories, ratingValue);
        setRatingCategories(result?.outcomeCategories);
        setRatingValue(result?.outcomeValues);
        setRenderChart((prev) => !prev);
      } else {
        const result = revertOutcomeData(ratingCategories, ratingValue);
        setRatingCategories(result?.outcomeCategories);
        setRatingValue(result?.outcomeValues);
        setRenderChart((prev) => !prev);
      }
    }
  }

  setSwitchAxis(event.target.checked);
  // setLabelPosition("center");
  // if (event.target.checked) {
  //   setDataLabelOptions([
  //     { value: "center", label: "Center" },
  //     { value: "none", label: "None" },
  //     { value: "top", label: "Top" },
  //     { value: "bottom", label: "Bottom" },
  //     { value: "center", label: "Center" },
  //     { value: "none", label: "None" },
  //   ]);
  // } else {
  //   setDataLabelOptions([
  //     { value: "top", label: "Top" },
  //     { value: "bottom", label: "Bottom" },
  //     { value: "center", label: "Center" },
  //     { value: "none", label: "None" },
  //   ]);
  // }
};


const handleSwitchAxisChange = (event) => {
  console.log('changing aixs', event, reduxSwitchAxis,chartType);
  setSwitchAxis(event.target.checked);
  dispatch(updateAssessmentCharting({ switchAxis: event.target.checked }));

  // setLabelPosition("center");
  // if (event.target.checked) {
  //   setDataLabelOptions([
  //     { value: "center", label: "Center" },
  //     { value: "none", label: "None" },
  //   ]);
  // } else {
  //   setDataLabelOptions([
  //     { value: "top", label: "Top" },
  //     { value: "bottom", label: "Bottom" },
  //     { value: "center", label: "Center" },
  //     { value: "none", label: "None" },
  //   ]);
  // }

  if (quickComapreOutcome && quickComapreOutcomeData?.length > 0) {
    const updated = quickComapreOutcomeData.map((item) => {
      const result = reduxSwitchAxis
        ? revertOutcomeData(item.outcomeCategories, item.outcomeValues)
        : transformOutcomeData(item.outcomeCategories, item.outcomeValues);
      return {
        outcomeCategories: result.outcomeCategories,
        outcomeValues: result.outcomeValues,
      };
    });
    setQuickComapreOutcomeData(updated);
    dispatch(updateAssessmentCharting({ quickComapreOutcomeData: updated }));
  } else {
    const result = reduxSwitchAxis
      ? revertOutcomeData(outcomeCategories, outcomeValues)
      : transformOutcomeData(outcomeCategories, outcomeValues);
    setOutcomeCategories(result.outcomeCategories);
    setOutcomeValue(result.outcomeValues);
    dispatch(updateAssessmentCharting({
      outcomeCategories: result.outcomeCategories,
      outcomeValues: result.outcomeValues
    }));
  }

  if (quickComapreIntemtion && quickComapreIntemtionData?.length > 0) {
    const updated = quickComapreIntemtionData.map((item) => {
      const result = reduxSwitchAxis
        ? revertOutcomeData(item.intentionCategories, item.intentionValues)
        : transformOutcomeData(item.intentionCategories, item.intentionValues);
      return {
        intentionCategories: result.outcomeCategories,
        intentionValues: result.outcomeValues,
      };
    });
    setQuickComapreIntemtionData(updated);
    dispatch(updateAssessmentCharting({ quickComapreIntemtionData: updated }));
  } else {
    const result = reduxSwitchAxis
      ? revertOutcomeData(intentionCategories, intentionValues)
      : transformOutcomeData(intentionCategories, intentionValues);
    setIntentionCategories(result.outcomeCategories);
    setIntentionValue(result.outcomeValues);
    dispatch(updateAssessmentCharting({
      intentionCategories: result.outcomeCategories,
      intentionValues: result.outcomeValues
    }));
  }

  if (quickComapre && quickComapreData?.length > 0) {
    const updated = quickComapreData.map((item) => {
      const result = reduxSwitchAxis
        ? revertOutcomeData(item.categories, item.values)
        : transformOutcomeData(item.categories, item.values);
      return {
        categories: result.outcomeCategories,
        values: result.outcomeValues,
      };
    });
    setQuickComapreData(updated);
    dispatch(updateAssessmentCharting({ quickComapreData: updated }));
  } else {
    const result = reduxSwitchAxis
      ? revertOutcomeData(categories, values)
      : transformOutcomeData(categories, values);
    setCategories(result.outcomeCategories);
    setValue(result.outcomeValues);
    setRenderChart((prev) => !prev);
    dispatch(updateAssessmentCharting({
      categories: result.outcomeCategories,
      values: result.outcomeValues
    }));
  }

  if (quickComapreRating && quickComapreRatingData?.length > 0) {
    const updated = quickComapreRatingData.map((item) => {
      const result = reduxSwitchAxis
        ? revertOutcomeData(item.ratingCategories, item.ratingValue)
        : transformOutcomeData(item.ratingCategories, item.ratingValue);
      return {
        ratingCategories: result.outcomeCategories,
        ratingValue: result.outcomeValues,
      };
    });
    setQuickComapreRatingData(updated);
    dispatch(updateAssessmentCharting({ quickComapreRatingData: updated }));
  } else {
    const result = reduxSwitchAxis
      ? revertOutcomeData(ratingCategories, ratingValue)
      : transformOutcomeData(ratingCategories, ratingValue);
    setRatingCategories(result.outcomeCategories);
    setRatingValue(result.outcomeValues);
    
  }
};

useEffect(()=>{
  if(selectedCompanyId&&selectedSurveyId){
    fetchDefaultChartData()

  }
},[selectedCompanyId,selectedSurveyId])
  


  const handleChartTypeChange = (type) => {
    setChartType(type?.value);
  };

  const handleLegendPosistionChange = (position) => {
    setLegendPosition(position?.value);
  };

  const handleLablePosistionChange = (position) => {
    // alert(position.value)
    setLabelPosition(position?.value);
  };

  const handleFontSizeChange = (size) => {
    setFontSize(size?.value || 12);
  };

  // eslint-disable-next-line no-shadow

  

  const handleLabelColorChange = (event) => {
    setLabelColorState(event.target.value);
  };

  const handleOpacityChange = (event) => {
    setAnnotationOpacity(event.target.value);
  };

  // Add this handler
  const handleCrosstabToggle = (e) => {
    setShowCrosstab(e.target.checked);
    if (e.target.checked && selectedCompanyId && selectedSurveyId) {
      fetchCrossTab(selectedCompanyId, selectedSurveyId);
    }
  };

  // Add this function to process crosstab data
  const processCrosstabData = (data) => {
    if (!data) return [];

    let processedData = [];
    let counter = 1;

    data.forEach((item) => {
      // For branched questions, include level in question name
      const questionText = item.is_branch
        ? `${item.question} (Level ${item.filter_level})`
        : item.question;

      // Create a row for each response
      item.responses.forEach((response, index) => {
        processedData.push({
          number: index === 0 ? counter++ : '', // Only show number in first row
          question: index === 0 ? questionText : '', // Only show question in first row
          response_name: response.response_name,
          response_user_count: response.response_user_count,
          total_user_count: response.total_user_count,
          percentage: `${response.response_percentage}%`,
          rowspan: index === 0 ? item.responses.length : 0 // Set rowspan for first row only
        });
      });
    });

    return processedData;
  };

  const countRef = useRef(0);

  const handleView = (
    dataFilters = {
      departments: ["0"],
      users: [],
      managers: [],
      managerReportees: "D",
      demographicFilters: [],
      benchmarks: [],
      references: [],
      outcomes: [],
      intentions: [],
      questions: [],
      scaleMin: 0.0,
      scaleMax: 0.0,
      isOutcomes: false,
      isIntentions: false,
      isRatingQuestions: false,
      isInfoGathering: false,
      isDrillDown: false,
      isAggregate: false,
      isComposite: false,
      isQuickCompare: false,
      quickCompareBase: null,
    }
  ) => {
    // if(!selectedOutcomeIds?.length){
    //   toast.error('At least one outcome should be selected')
    // }
      // if (countRef.current === 0) {
      //   window.alert('count');
      //   setChartViewType("FILTER");
      //   countRef.current = countRef.current + 1;
      // }
    
    setViewLoader(true);
    console.log('quetions',dataFilters)
    if(!chartType){
      setChartType(1)
    }

    const selectedRange = scalerrangelist?.[0] || null;
    if (selectedRange) {
      console.log("SELECTED RANGE: ", selectedRange)
      // Use parseFloat to ensure we maintain float values
      const from = parseFloat("0.00");
      const to = parseFloat("100.00");
      
      console.log("From: ", from, to);
      setFromValue(parseFloat(from.toFixed(2)));
      setToValue(parseFloat(to.toFixed(2)));

      // Set float values for API with 2 decimal places
      dataFilters.scaleMin = parseFloat(from.toFixed(2));
      dataFilters.scaleMax = parseFloat(to.toFixed(2)); 

      setFromValue(from);
      setToValue(to);

      dataFilters.scaleMin = from;
      dataFilters.scaleMax = to;
    }
  
    // QuickCompare: only if flag and quickCompareBase are set
    if (dataFilters.isQuickCompare && dataFilters.quickCompareBase) {
      // setChartViewType("FILTER");
      // dispatch(updateAssessmentCharting({ isCompareTab:false }));

      if (activeTab === "aggregate") {
        fetchQuickCompareAggregateChart(
          selectedSurveyId,
          parseInt(selectedCompanyId, 10),
          dataFilters
        );
      } else if (activeTab === "outcome") {
        fetchQuickCompareOutcomeChart(
          selectedSurveyId,
          parseInt(selectedCompanyId, 10),
          dataFilters
        );
      } else if (activeTab === "intention") {
        fetchQuickCompareIntentionChart(
          selectedSurveyId,
          parseInt(selectedCompanyId, 10),
          dataFilters
        );
      } else if (activeTab === "rating") {

        
          fetchQuickCompareRatingChart(
            selectedSurveyId,
            parseInt(selectedCompanyId, 10),
            dataFilters
          );
        
      }
    }
    // Composite: only if flag is set and NOT quickCompare
    else if (dataFilters.isComposite) {
      if (activeTab === "aggregate") {
        fetchCompositeAggregateChart(
          selectedSurveyId,
          parseInt(selectedCompanyId, 10),
          dataFilters
        );
      } else if (activeTab === "outcome") {
        fetchCompositeOutcomeChart(
          selectedSurveyId,
          parseInt(selectedCompanyId, 10),
          dataFilters
        );
      } else if (activeTab === "intention") {
        fetchCompositeIntentionChart(
          selectedSurveyId,
          parseInt(selectedCompanyId, 10),
          dataFilters
        );
      } else if (activeTab === "rating") {
        fetchCompositeRatingChart(
          selectedSurveyId,
          parseInt(selectedCompanyId, 10),
          dataFilters
        );
      }
    }
    // Handle composite chart
    else if (dataFilters.isDrillDown) {
      fetchfilterDriilDownChart(
        selectedSurveyId,
        parseInt(selectedCompanyId, 10),
        dataFilters
      );
    } else if (dataFilters.isInfoGathering) {
      
      fetchfilterIGChart(
        selectedSurveyId,
        parseInt(selectedCompanyId, 10),
        dataFilters
      );
    } else if (dataFilters.isRatingQuestions) {
      fetchfilterRatingChart(
        selectedSurveyId,
        parseInt(selectedCompanyId, 10),
        dataFilters
      );
    } else if (dataFilters.isIntentions) {
      fetchfilterIntentionChart(
        selectedSurveyId,
        parseInt(selectedCompanyId, 10),
        dataFilters
      );
    } else if (dataFilters.isOutcomes) {
      fetchfilterOutcomeChart(
        selectedSurveyId,
        parseInt(selectedCompanyId, 10),
        dataFilters
      );
    } else if (dataFilters.isAggregate) {
      // Add this condition
      fetchfilterAggregateChart(
        selectedSurveyId,
        parseInt(selectedCompanyId, 10),
        dataFilters
      );
    } else {
      // Call all chart fetches for other tabs
            // setChartViewType("FILTER");


      fetchfilterAggregateChart(
        selectedSurveyId,
        parseInt(selectedCompanyId, 10),
        dataFilters
      );
      fetchfilterOutcomeChart(
        selectedSurveyId,
        parseInt(selectedCompanyId, 10),
        dataFilters
      );
      fetchfilterIntentionChart(
        selectedSurveyId,
        parseInt(selectedCompanyId, 10),
        dataFilters
      );
      fetchfilterRatingChart(
        selectedSurveyId,
        parseInt(selectedCompanyId, 10),
        dataFilters
      );
      fetchfilterIGChart(
        selectedSurveyId,
        parseInt(selectedCompanyId, 10),
        dataFilters
      );
      fetchfilterDriilDownChart(
        selectedSurveyId,
        parseInt(selectedCompanyId, 10),
        dataFilters
      );
    }

    if (Object.keys(dataFilters).length === 0) {
      fetchAssessmentChart(
        selectedSurveyId,
        "user_list_dropdown",
        selectedCompanyId,
        dataFilters
      );
    }
  };

  // useEffect(()=>{
  //   if(selectedCompanyId){
  //     handleView()

  //   }
  // },[showNegative])
  const handleClearAll = () => {
    setSelectedCompanyId("");
    setSelectedSurveyId("");
    setShowChartingView(false);
  };

  const handleDecimalChange = (value) => {
    setDecimalValue(value?.value);
    dispatch(    updateAssessmentCharting({decimal:value?.value})  )
  };

  const fetchDefaultChartData = async () => {
    try {
      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT?.getDefaultChartSettings,
        queryParams: {
          action: "default_chart_options",
          companyID: selectedCompanyId,
          companyMasterID: userData?.companyMasterID,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        const defaultChartData = response?.data?.data;
        console.log("DEFAULT CHART DATA: ", defaultChartData)

        // setChartType(2);
        setLegendPosition(defaultChartData?.legend);
        setIGLegendPosition(defaultChartData?.legend)
        setDrilldownLabelPosition(defaultChartData?.dataLabel)
        setDrilldownLegendPosition(defaultChartData?.legend)
        setLabelPosition(defaultChartData?.dataLabel);
        if(defaultChartData?.fontSize==1){
          setFontSize(8);
          setIGFontSize(8)
          setDrilldownFontSize(8)

        }
        if(defaultChartData?.fontSize==2){
          setFontSize(10);
          setIGFontSize(10)
          setDrilldownFontSize(10)

        }
        if(defaultChartData?.fontSize==3){
          setFontSize(12);
          setIGFontSize(12)
          setDrilldownFontSize(12)

        }
        if(defaultChartData?.fontSize==4){
          setFontSize(14);
          setIGFontSize(14)
          setDrilldownFontSize(14)

        }
        if(defaultChartData?.fontSize==5){
          setFontSize(16);
          setIGFontSize(16)
          setDrilldownFontSize(16)

        }
        setLabelColorState(defaultChartData?.lableColor||"#0000");
        setDrilldownLabelColorState(defaultChartData?.lableColor||"#0000")
        setIGLabelColorState(defaultChartData?.lableColor||"#0000")
        setIGChartType(defaultChartData?.chartType)
        if(defaultChartData?.chartType==4||defaultChartData?.chartType==6){
          setDrilldownChartType(1)
        }
        else{
          setDrilldownChartType(defaultChartData?.chartType)
        }
        setChartType(defaultChartData?.chartType)
        setIGLabelPosition(defaultChartData?.dataLabel)
        setDrilldownLabelPosition(defaultChartData?.dataLabel)
        setDrilldownSwitchAxis(defaultChartData?.switchAxis)
        setIGSwitchAxis(defaultChartData?.switchAxis)
        setIGAnnotationOpacity(defaultChartData?.scalarOpacity)
        setDrilldownAnnotationOpacity(defaultChartData?.scalarOpacity)
        dispatch(updateAssessmentCharting({ switchAxis: defaultChartData?.switchAxis }));
        setSwitchAxis(defaultChartData?.switchAxis)
        setAnnotationOpacity(defaultChartData?.scalarOpacity)
        setSelectedPaletteColorID(defaultChartData?.paletteColorID)
        
        console.log(defaultChartData?.paletteColorID,"new")
        setDrillDownPaletteColorID(defaultChartData?.paletteColorID)
        setIGPaletteColorID(defaultChartData?.paletteColorID)
      }
    } catch (error) {
      console.error("Error fetching score data:", error);
    }
  };
  const fetchChartOptions = async (action,type) => {
    try {
      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT?.getDefaultChartSettings,
        queryParams: {
          action,
          type
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

        const filteredChartOptions = defaultChartOptions.filter(
          (item) => item.label !== "Combo"
        );

        const defaultDataLabelOptions = response?.data?.data?.dataLabel?.map(
          (item) => ({
            value: item?.id,
            label: item?.name,
          })
        );
        // const defaultfontSizeOptions = response?.data?.data?.fontSize?.map(
        //   (item) => ({
        //     value: item?.id,
        //     label: item?.name,
        //   })
        // );
        const defaultLegendOptions = response?.data?.data?.legend?.map(
          (item) => ({
            value: item?.id,
            label: item?.name,
          })
        );

        setLegendOptions(defaultLegendOptions);
        // setFontSizeOptions(defaultfontSizeOptions);
        setChartOptions(filteredChartOptions);
        setDataLabelOptions(defaultDataLabelOptions);
      }
      // setViewLoader(false)
    } catch (error) {
      setViewLoader(false)
      console.error("Error fetching score data:", error);
    }
  };

  const fetchChartOptionsDemographics = async (action, type) => {
    try {
      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT?.getDefaultChartSettings,
        queryParams: {
          action,
          type,
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

        let filteredChartOptions = defaultChartOptions.filter(
          (item) => item.label !== "Stacked Bar"
        );

        // filteredChartOptions = [...filteredChartOptions, {value: 6, label: 'Spider'}]

        console.log("FILTERED CHART OPTIONS: ", filteredChartOptions)

        const defaultDataLabelOptions = response?.data?.data?.dataLabel?.map(
          (item) => ({
            value: item?.id,
            label: item?.name,
          })
        );
        // const defaultfontSizeOptions = response?.data?.data?.fontSize?.map(
        //   (item) => ({
        //     value: item?.id,
        //     label: item?.name,
        //   })
        // );
        const defaultLegendOptions = response?.data?.data?.legend?.map(
          (item) => ({
            value: item?.id,
            label: item?.name,
          })
        );

        // setFontSizeOptions(defaultfontSizeOptions);
        setDrilldownLegendOptions(defaultLegendOptions);
        setDrilldownChartOptions(filteredChartOptions);
        setDrilldownDataLabelOptions(defaultDataLabelOptions);
      }
    } catch (error) {
      console.error("Error fetching score data:", error);
    }
  };

  // Add this effect to fetch correct subset list when tab changes
  useEffect(() => {
    if (selectedSurveyId && selectedCompanyId) {
      let subsetType = "FCSS";
      if (activeTab === "IG") {
        subsetType = "IGSS";
      } else if (activeTab === "DD") {
        subsetType = "DDSS";
      }
      fetchAssessmentChart(
        selectedSurveyId,
        "get_filter_subset_list",
        null,
        subsetType
      );
    }
  }, [activeTab, selectedSurveyId, selectedCompanyId,]);

  // Add state for dataset modal fields
  const [datasetName, setDatasetName] = useState("");
  const [saveDatasetstatus,setsaveDatasetStatus]=useState(false)
  const [datasetDescription, setDatasetDescription] = useState("");

  // Helper to get current dataFilters (same as handleView)
  const getCurrentDataFilters = () => ({
    departments: Array.isArray(selectedDepartments)
      ? selectedDepartments.filter((v) => v !== null && v !== undefined)
      : [],
    users: Array.isArray(selectedUsers)
      ? selectedUsers.filter((v) => v !== null && v !== undefined)
      : [],
    managers: Array.isArray(selectedManagers)
      ? selectedManagers.filter((v) => v !== null && v !== undefined)
      : [],
    managerReportees: selectedManagerReportees || "D",
    demographicFilters: Array.isArray(selectedDemographicFilters)
      ? selectedDemographicFilters.map((filter) => ({
          ...filter,
          responses: Array.isArray(filter.selectedOptions)
            ? filter.selectedOptions
                .filter((r) => r && r.value !== null && r.value !== undefined)
                .map((r) => r.value)
            : [],
        }))
      : [],
    benchmarks: Array.isArray(selectedBenchmarkList)
      ? selectedBenchmarkList.filter((v) => v !== null && v !== undefined)
      : [],
    references: [],
    outcomes: Array.isArray(selectedOutcomeIds)
      ? selectedOutcomeIds.filter((v) => v !== null && v !== undefined)
      : [],
    intentions: Array.isArray(selectedIntentionIds)
      ? selectedIntentionIds.filter((v) => v !== null && v !== undefined)
      : [],
    questions: Array.isArray(questionOptions)
      ? questionOptions
          .filter((q) => q && q.value !== null && q.value !== undefined)
          .map((q) => q.value)
      : [],
    // Add any other fields as needed
  });

  // Add this function to clear all filters (but not company/survey selection)
  const handleClearFilters = () => {
    setSelectedDepartments(["0"]);
    setSelectedUsers([]);
    setSelectedManagers([]);
    setSelectedManagerReportees("A");
    setSelectedDemographicFilters([]);
    setSelectedBenchmarkList([]); // Ensure benchmark list is cleared
    setSelectedOutcomeIds([]);
    setSelectedIntentionIds([]);

    // Reset quick compare related states
    // resetQuickCompareStates();
  };

  // Add state for significant difference selection (default 90)

  const handleChartTypeChangeChild = (value, index) => {
    const tempData = [...DrillDownQuestionsData];
    const oneRowData = { ...tempData[index] }; // create a shallow copy if needed
    oneRowData.chartOptions.chartType = value?.value;

    tempData[index] = oneRowData;
    setDrillDownQuestionsData(tempData);
  };

  const handleLegendPositionChangeChild = (value, index) => {
    const tempData = [...DrillDownQuestionsData];
    const oneRowData = { ...tempData[index] }; // create a shallow copy if needed
    oneRowData.chartOptions.legend = value?.value;
    tempData[index] = oneRowData;
    setDrillDownQuestionsData(tempData);
  };

  const handleLablePosistionChangeChild = (value, index) => {
    const tempData = [...DrillDownQuestionsData];
    const oneRowData = { ...tempData[index] }; // create a shallow copy if needed
    oneRowData.chartOptions.dataLabel = value?.value;
    tempData[index] = oneRowData;
    setDrillDownQuestionsData(tempData);
  };

  const handleFontSizeChangeChild = (value, index) => {
    const tempData = [...DrillDownQuestionsData];
    const oneRowData = { ...tempData[index] }; // create a shallow copy if needed
    oneRowData.chartOptions.fontSize = value?.value;
    tempData[index] = oneRowData;
    setDrillDownQuestionsData(tempData);
  };

  const handleSwitchAxisChangeChild = (value, index) => {
    const tempData = [...DrillDownQuestionsData];
    const oneRowData = { ...tempData[index] }; // create a shallow copy if needed
    oneRowData.chartOptions.switchAxis = value ? "yAxis" : "xAxis";
    tempData[index] = oneRowData;
    setDrillDownQuestionsData(tempData);
  };

  const handleLabelColorChangeChild = (value, index) => {
    const tempData = [...DrillDownQuestionsData];
    const oneRowData = { ...tempData[index] }; // create a shallow copy if needed
    oneRowData.chartOptions.lableColor = value;
    tempData[index] = oneRowData;
    setDrillDownQuestionsData(tempData);
  };

  const handlehandleOpacityChangeChild = (value, index) => {
    const tempData = [...DrillDownQuestionsData];
    const oneRowData = { ...tempData[index] }; // create a shallow copy if needed
    oneRowData.chartOptions.scalarOpacity = value;

    tempData[index] = oneRowData;
    setDrillDownQuestionsData(tempData);
  };

  const handleChartColorChangeChild = (value, index) => {
    const tempData = [...DrillDownQuestionsData];
    const oneRowData = { ...tempData[index] }; // create a shallow copy if needed
    oneRowData.colors = value;
    const colorCodeArray = value?.colors?.map((item) => item.colorCode);
    oneRowData.colorsArray = colorCodeArray;
    tempData[index] = oneRowData;
    setDrillDownQuestionsData(tempData);
    setRenderChart((prev) => !prev);
  };

  const handleDrilldownApplyAll = () => {
    let tempData = [];
    for (let oneRowData of DrillDownQuestionsData) {
      oneRowData.chartOptions.chartType = drilldownChartType;
      oneRowData.chartOptions.dataLabel = drilldownLabelPosition;
      oneRowData.chartOptions.fontSize = drilldownFontSize;
      oneRowData.chartOptions.lableColor = drilldownLabelColorState;
      oneRowData.chartOptions.legend = drilldownLegendPosition;
      oneRowData.chartOptions.scalarOpacity = drilldownAnnotationOpacity;
      oneRowData.chartOptions.switchAxis = drilldownswitchAxis
        ? "xAxis"
        : "yAxis"; // Assuming you still want to use the `switchAxis` state for DD too.
      oneRowData.colors = drilldownSelectedColorPallet;
      const colorCodeArray = drilldownSelectedColorPallet?.colors?.map(
        (item) => item.colorCode
      );
      oneRowData.colorsArray =colors;
      tempData.push(oneRowData);
    }

    setRenderChart((prev) => !prev);
    setRenderScalar((prev) => !prev);
    setDrillDownQuestionsData(tempData);
  };

  // Update chart type for a particular item in IGQuestionsData
  const handleIGChartTypeChangeChild = (value, index) => {
    const tempData = [...IGQuestionsData];
    const oneRowData = { ...tempData[index] }; // shallow copy
    oneRowData.chartOptions.chartType = value?.value;
    tempData[index] = oneRowData;
    setIGQuestionsData(tempData);
  };

  const handleIGLegendPositionChangeChild = (value, index) => {
    const tempData = [...IGQuestionsData];
    const oneRowData = { ...tempData[index] }; // shallow copy
    oneRowData.chartOptions.legend = value?.value;
    tempData[index] = oneRowData;
    setIGQuestionsData(tempData);
  };

  const handleIGLabelPositionChangeChild = (value, index) => {
    const tempData = [...IGQuestionsData];
    const oneRowData = { ...tempData[index] }; // shallow copy
    oneRowData.chartOptions.dataLabel = value?.value;
    tempData[index] = oneRowData;
    setIGQuestionsData(tempData);
  };

  const handleIGFontSizeChangeChild = (value, index) => {
    const tempData = [...IGQuestionsData];
    const oneRowData = { ...tempData[index] }; // shallow copy
    oneRowData.chartOptions.fontSize = value?.value;
    tempData[index] = oneRowData;
    setIGQuestionsData(tempData);
  };

  const handleIGSwitchAxisChangeChild = (value, index) => {
    const tempData = [...IGQuestionsData];
    const oneRowData = { ...tempData[index] }; // shallow copy
    oneRowData.chartOptions.switchAxis = value ? "yAxis" : "xAxis";
    tempData[index] = oneRowData;
    setIGQuestionsData(tempData);
  };

  const handleIGLabelColorChangeChild = (value, index) => {
    const tempData = [...IGQuestionsData];
    const oneRowData = { ...tempData[index] }; // shallow copy
    oneRowData.chartOptions.lableColor = value;
    tempData[index] = oneRowData;
    setIGQuestionsData(tempData);
  };

  const handleIGOpacityChangeChild = (value, index) => {
    const tempData = [...IGQuestionsData];
    const oneRowData = { ...tempData[index] }; // shallow copy
    oneRowData.chartOptions.scalarOpacity = value;
    tempData[index] = oneRowData;
    setIGQuestionsData(tempData);
  };

  const handleIGChartColorChangeChild = (value, index) => {
    const tempData = [...IGQuestionsData];
    const oneRowData = { ...tempData[index] }; // shallow copy
    oneRowData.colors = value;
    const colorCodeArray = value?.colors?.map((item) => item.colorCode);
    oneRowData.colorsArray = colorCodeArray;
    tempData[index] = oneRowData;
    setIGQuestionsData(tempData);
    setRenderChart((prev) => !prev);
  };

  const handleIGApplyAll = () => {
    let tempData = [];
    for (let oneRowData of IGQuestionsData) {
      oneRowData.chartOptions.chartType = IGChartType;
      oneRowData.chartOptions.dataLabel = IGLabelPosition;
      oneRowData.chartOptions.fontSize = IGFontSize;
      oneRowData.chartOptions.lableColor = IGLabelColorState;
      oneRowData.chartOptions.legend = IGLegendPosition;
      oneRowData.chartOptions.scalarOpacity = IGAnnotationOpacity;
      oneRowData.chartOptions.switchAxis = IGSwitchAxis ? "xAxis" : "yAxis"; // note: "xAxix" may be a typo in your original code
      oneRowData.colors = IGSelectedColorPallet;
      const colorCodeArray = IGSelectedColorPallet?.colors?.map(
        (item) => item.colorCode
      );
      oneRowData.colorsArray =colors;
      tempData.push(oneRowData);
      console.log(oneRowData,"onerow")
    }

    setRenderChart((prev) => !prev);
    setRenderScalar((prev) => !prev);
    setIGQuestionsData(tempData);
  };

  useEffect(()=>{
    if(activeTab=='IG'){
      // console.log(IGLabelColorState,"colorstate",labelColorState)
      handleIGApplyAll()
    }
    if(activeTab=="DD"){
      handleDrilldownApplyAll()
    }
  },[activeTab])

  // Add this effect to reset on tab change
  useEffect(() => {
    setSelectedControlGroupIdx(null);
    setLastSignificanceAction("");
    setSignificantDifference([]); // Clear results on tab change
  }, [activeTab]);


 

  const resetQuickCompareStates = () => {
    setQuickComapre(false);
    setQuickComapreData([]);
    setQuickComapreOutcome(false);
    setQuickComapreOutcomeData([]);
    setQuickComapreIntemtion(false);
    setQuickComapreIntemtionData([]);
    setQuickComapreRating(false);
    setQuickComapreRatingData([]);
  };

  const isSignificantDifferenceVisible = (currentTab) => {
    // Change this array to include tabs where you want to hide the dropdown entirely
    const hiddenTabs = ["rating", "IG", "DD"];
    return !hiddenTabs.includes(currentTab);
  };

  // Add this new handler
  const handleCollapseChange = (collapseId) => {
    if (collapseId === "aggregateFilter") {
      setChartViewType("FILTER");
    } else if (collapseId === "quickCompare") {
      setChartViewType("COMPARE");
    }
    // Don't change chartViewType when other collapses (like "reports") are selected
  };

  useEffect(() => {
    console.log("switchAxis", switchAxis)
  },[switchAxis])

  // Add function to save chart options to localStorage
  const saveChartOptionsToStorage = () => {
    const chartOptions = {
      chartType,
      legendPosition,
      labelPosition,
      fontSize,
      switchAxis,
      labelColorState,
      annotationOpacity,
      showNegative,
      sortOrder,
      colors
    };
    localStorage.setItem('chartOptions', JSON.stringify(chartOptions));
  };

  // Add function to load chart options from localStorage
  const loadChartOptionsFromStorage = () => {
    const savedOptions = localStorage.getItem('chartOptions');
    if (savedOptions) {
      const options = JSON.parse(savedOptions);
      setChartType(options.chartType);
      setLegendPosition(options.legendPosition);
      setLabelPosition(options.labelPosition);
      setFontSize(options.fontSize || 12);
      setSwitchAxis(options.switchAxis);
      setLabelColorState(options.labelColorState);
      setAnnotationOpacity(options.annotationOpacity);
      setShowNegative(options.showNegative);
      setSortOrder(options.sortOrder);
      setColors(options.colors);
    }
  };

  // Add useEffect to load saved options on component mount
  // useEffect(() => {
  //   loadChartOptionsFromStorage();
  // }, []);

  // Add useEffect to save options whenever they change
  useEffect(() => {
    saveChartOptionsToStorage();
  }, [chartType, legendPosition, labelPosition, fontSize, switchAxis, labelColorState, annotationOpacity, showNegative, sortOrder, colors]);

  return (
    <>
      {/* head title start */}
      <section className="commonHead">
        <h1 className="commonHead_title">Welcome Back!</h1>
        <Breadcrumb breadcrumb={breadcrumb} />
      </section>
      {/* head title end */}
      <div className="collpseFilter" style={{paddingBottom:10}}>
        <div
          className="pageTitle d-flex align-items-center justify-content-between collpseFilter_title mb-0"
          onClick={() => setOpen(!open)}
          aria-controls="charting-setUp"
          aria-expanded={open}
        >
          <h2 className="mb-0">Charting Set Up</h2>
          <em className="icon-drop-down toggleIcon" />
        </div>
        
        <Collapse in={open}>
          <div id="charting-setUp">
            <Form className="formCard bg-transparent m-0">
              <Row className="align-items-end gy-3 gx-2">
                <Col lg={6}>
                  <Row className="g-2">
                    <Col sm={6}>
                      <Form.Group className="form-group mb-0">
                        <Form.Label>
                          Company Name <sup>*</sup>
                        </Form.Label>
                        <SelectField
                          placeholder="Select Company"
                          options={companyOptions}
                          onChange={handleCompanyChange}
                          value={
                            companyOptions.find(
                              (option) => option.value === selectedCompanyId
                            ) || null
                          }
                        />
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <Form.Group className="form-group mb-0">
                        <Form.Label>
                          Surveys <sup>*</sup>
                        </Form.Label>
                        <SelectField
                          placeholder="Select Survey"
                          options={surveyOptions}
                          isDisabled={!selectedCompanyId}
                          onChange={handleSurveyChange}
                          value={
                            surveyOptions.find(
                              (option) => option.value === selectedSurveyId
                            ) || null
                          }
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
                <Col lg={6}>
                  <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap">
                    {showChartingView && (
                      <div className="d-flex align-items-center gap-2 flex-sm-nowrap flex-wrap collapseBtn">
                        <Link
                          href="#!"
                          className="btn btn-light setupToggle gap-2"
                          aria-controls="advanced"
                          onClick={() => toggleCollapse("advanced")}
                          aria-expanded={activeCollapse === "advanced"}
                        >
                          {" "}
                          Advanced Set Up
                          <em className="icon-drop-down toggleIcon" />
                        </Link>
                        <Link
                          href="#!"
                          className="btn btn-light setupToggle ripple-effect gap-2"
                          onClick={() => toggleCollapse("scaler")}
                          aria-expanded={activeCollapse === "scaler"}
                          aria-controls="scaler"
                        >
                          Scalar Set Up
                          <em className="icon-drop-down toggleIcon" />
                        </Link>
                      </div>
                    )}
                      {/* {viewLoader&&<Loader/>} */}
                    {selectedSurveyId !== "" &&
                    selectedCompanyId !== "" &&
                    outcomeOptions?.length > 0 &&
                    intentionsOptions?.length > 0 &&
                    questionOptions?.length > 0 ? (
                      <>
                   
                          <Button
            onClick={() => {          
                dispatch(updateAssessmentCharting({ isCompareTab:false }));
                handleView({
                  departments: ["0"],
                  users: [],
                  managers: [],
                  managerReportees: "D",
                  demographicFilters: [],
                  benchmarks: [],
                  references: [],
                  outcomes: [],
                  intentions: [],
                  questions: [],
                  scaleMin: 0.0,
                  scaleMax: 0.0,
                  isOutcomes: false,
                  isIntentions: false,
                  isRatingQuestions: false,
                  isInfoGathering: false,
                  isDrillDown: false,
                  isAggregate: false,
                  isComposite: false,
                  isQuickCompare: false,
                  quickCompareBase: null, // explicitly set as empty
              
                });
                                                      }}
                        >
                          <em className="icon-eye me-2" />
                            View
                          </Button>
                      </>
                    ) : (
                      selectedSurveyId !== "" &&
                      selectedCompanyId !== "" && (
                        <Spinner style={{color:'#007bff',marginLeft:10}} animation="border" size="md" />

                      )
                    )}
                  </div>
                </Col>
                <Collapse className="col-12" in={activeCollapse === "advanced"}>
                  <Row className="g-2 align-items-baseline" id="advanced">
                    <Col lg={3} md={6}>
                      <Form.Group className="form-group mb-0">
                        <Form.Label>Decimal Points</Form.Label>
                        <SelectField
                          placeholder="Select Company"
                          options={decimalOptions}
                          onChange={(value) => handleDecimalChange(value)}
                          value={
                            decimalOptions.find(
                              (option) => option?.value === decimalValue
                            ) || null
                          }
                        />
                      </Form.Group>
                    </Col>
                    <Col xxl={4} lg={5} md={6}>
                      <Row className="g-2 align-items-center">
                        <Col sm={6}>
                          <Form.Group className="form-group mb-0">
                            <Form.Label>Scale Range</Form.Label>
                            <SelectField
                            disabled={true}
                              placeholder="Select Range"
                              options={scalerrangelist}
                              onChange={handleScaleRangeChange}
                              value={scalerrangelist.find(
                                (option) => option.value === selectedScaleRange
                              )}
                            />
                          </Form.Group>
                        </Col>
                        <Col sm={6}>
                          <div className="d-flex align-items-center gap-2">
                            <Form.Group className="form-group mb-0">
                              <Form.Label>From</Form.Label>
                              <InputField
                                placeholder="0.00"
                                value={fromValue} // Bind "From" value
                                onChange={(e) => setFromValue(e.target.value)} // Update state on change
                                disabled={!isCustomRange} // Enable only for "Custom"
                              />
                            </Form.Group>
                            <Form.Group className="form-group mb-0">
                              <Form.Label>To</Form.Label>
                              <InputField
                                placeholder="100.00"
                                value={toValue} // Bind "To" value
                                onChange={(e) => setToValue(e.target.value)} // Update state on change
                                disabled={!isCustomRange} // Enable only for "Custom"
                              />
                            </Form.Group>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                    <Col xxl={2} sm={3}>
                      <Form.Group className="form-group mb-0">
                        <Form.Label className="mb-2">
                          Negative Values
                        </Form.Label>
                        <div className="switchBtn">
                          <InputField
                            type="checkbox"
                            id="negativeValue"
                            onChange={(e) => {setShowNegative(e.target.checked); 
                              dispatch(                            
                                  updateAssessmentCharting({negativeValue:e.target.checked})
                            )
                            }}
                          />
                          <Form.Label htmlFor="negativeValue" />
                        </div>
                      </Form.Group>
                    </Col>

                    <Col md={3}>
                      <Form.Group className="form-group mb-0">
                        <Form.Label className="mb-2 text-nowrap">
                          Show Crosstab In Report
                        </Form.Label>
                        <div className="switchBtn">
                          <InputField
                            type="checkbox"
                            id="showCrosstabSwitch"
                            checked={showCrosstab} // Bind state
                            onChange={handleCrosstabToggle} // Update state on toggle
                          />
                          <Form.Label htmlFor="showCrosstabSwitch" />
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                </Collapse>
                <Collapse className="col-12" in={activeCollapse === "scaler"}>
                  <div id="scaler">
                    <Configuration
                      scalarConfiguration={scalarConfiguration}
                      onScalarChange={handleScalarChange}
                      colors={colors}
                      onUpdate={handleUpdateScalarConfiguration}
                      companyMasterID={userData?.companyMasterID}
                      companyID={selectedCompanyId}
                      assessmentID={selectedSurveyId}
                    />
                  </div>
                </Collapse>
              </Row>
            </Form>
          </div>
        </Collapse>
      </div>
      {showChartingView && ( // Conditionally render the charting view
        <div className="pageContent chartingView">
          <div className="pageTitle d-flex align-items-center justify-content-between gap-2">
            <h2>
              Surveys Name:{" "}
              <span className="fw-normal">
                {selectedSurveyName || "No Survey Selected"}
              </span>
            </h2>
            {/* <div className="d-flex gap-2">
              <Link
                href="#!"
                onClick={handleClearAll}
                className="btn btn-secondary ripple-effect"
              >
                <em className="icon-clear me-1" /> Clear All
              </Link>
            </div> */}
          </div>

          <Tab.Container
            id="left-tabs-example"
            activeKey={activeTab}
            onSelect={(key) => {
              if (key) {
                setActiveTab(key);
                setRenderChart((prev) => !prev); // Trigger re-render of chart
                setSortOrder("random");
              }
            }}
          >
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
              <Nav variant="pills" className="commonTab">
                <Nav.Item>
                  <Nav.Link eventKey="aggregate">Aggregate</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="outcome">Outcomes</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="intention">Intentions</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="rating">Rating Questions</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="IG">Info Gathering Questions</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="DD">Drilldown Chart</Nav.Link>
                </Nav.Item>
              </Nav>
              <div className="d-flex align-items-center gap-2 flex-wrap collapseBtn">
                <Link
                  href="#!"
                  className="btn btn-light ripple-effect "
                  onClick={saveDatasetShow}
                >
                  Save Dataset
                </Link>
                {isSignificantDifferenceVisible(activeTab) && (
                  <Link
                    href="#!"
                    className="btn btn-light gap-2 bg-toggleSky"
                    onClick={() => setSignificantOpen(!significantOpen)}
                    aria-controls="significant"
                    aria-expanded={significantOpen}
                  >
                    Significant Difference{" "}
                    <em className="icon icon-drop-down" />
                  </Link>
                )}
              </div>
            </div>
            {isSignificantDifferenceVisible(activeTab) && (
              <Collapse in={significantOpen}>
                <div id="significant" className="significantTable">
                  <Form className="formCard mb-3">
                    <h3 className="significantTable_title mb-lg-3 mb-2">
                      Significant Difference
                    </h3>
                    <SignificantDifference
                      activeTab={activeTab}
                      setSelectedControlGroupIdx={setSelectedControlGroupIdx}
                      selectedControlGroupIdx={selectedControlGroupIdx}
                      lastSignificanceAction={lastSignificanceAction}
                      setLastSignificanceAction={setLastSignificanceAction}
                      compositeAggregateData={compositeAggregateData}
                      compositeOutcomeData={compositeOutcomeData}
                      compositeIntentionData={compositeIntentionData}
                      userData={userData}
                      setViewLoader={setViewLoader}
                      setSignificantDifference={setSignificantDifference}
                      significantDifferenceValue={significantDifferenceValue}
                      setSignificantDifferenceValue={
                        setSignificantDifferenceValue
                      }
                      significantDifference={significantDifference}
                    />
                  </Form>
                </div>
              </Collapse>
            )}
            {<Tab.Content>
              <Tab.Pane eventKey="aggregate">
                {activeTab === "aggregate" && (
                  <Aggregate
                    departmentOptions={departmentOptions}
                    benchmarklist={benchmarklist}
                    managerOptions={managerOptions}
                    participantOptions={participantOptions}
                    demographicsQuestionListOptions={
                      demographicsQuestionListOptions
                    }
                    selectedBenchmarkList={selectedBenchmarkList}
                    setSelectedBenchmarkList={setSelectedBenchmarkList}
                    selectedDepartments={selectedDepartments}
                    selectedUsers={selectedUsers}
                    selectedManagers={selectedManagers}
                    selectedManagerReportees={selectedManagerReportees}
                    selectedDemographicFilters={selectedDemographicFilters}
                    setSelectedDepartments={setSelectedDepartments}
                    setSelectedUsers={setSelectedUsers}
                    setSelectedManagers={setSelectedManagers}
                    setSelectedManagerReportees={setSelectedManagerReportees}
                    setSelectedDemographicFilters={
                      setSelectedDemographicFilters
                    }
                    selectedOutcomeIds={selectedOutcomeIds}
                    filterSubsetOptions={filterSubsetOptions}
                    saveBenchmarkdata={saveBenchmarkdata}
                    saveFilterSubset={saveFilterSubset} // Add this prop
                    saveBenchmarkListData={saveBenchmarkListData}
                    score={score}
                    chartTypeOptions={chartTypeOptions}
                    legendOptions={legendOptions}
                    dataLabelOptions={dataLabelOptions}
                    fontSizeOptions={fontSizeOptions}
                    handleChartColorChange={handleChartColorChange}
                    handleChartTypeChange={handleChartTypeChange}
                    chartType={chartType}
                    handleLegendPosistionChange={handleLegendPosistionChange}
                    legendPosition={legendPosition}
                    handleLablePosistionChange={handleLablePosistionChange}
                    labelPosition={labelPosition}
                    handleFontSizeChange={handleFontSizeChange}
                    fontSize={fontSize || 12}
                    handleSwitchAxisChange={handleSwitchAxisChange}
                    switchAxis={reduxSwitchAxis}
                    handleLabelColorChange={handleLabelColorChange}
                    labelColorState={labelColorState}
                    handleOpacityChange={handleOpacityChange}
                    annotationOpacity={annotationOpacity}
                    outcomes={outcomes}
                    getfiltersubset={getfiltersubset}
                    selectedCompanyId={selectedCompanyId} // Pass selectedCompanyId
                    selectedSurveyId={selectedSurveyId} // Pass selectedSurveyId
                    fetchSaveBenchMark={fetchSaveBenchMark} // Pass fetchSaveBenchMark
                    handleView={handleView}
                    viewLoader={viewLoader}
                    onCompareTabOpen={() => {
                      if (selectedSurveyId) {
                        fetchAssessmentChart(
                          selectedSurveyId,
                          "get_filter_subset_list",
                          null,
                          "CCSS"
                        );
                      }
                    }} onFilterTabOpen={() => {
                      if (selectedSurveyId) {
                        fetchAssessmentChart(
                          selectedSurveyId,
                          "get_filter_subset_list",
                          null,
                          "FCSS"
                        );
                      }
                    }}
                    chartViewType={chartViewType}
                    fetchSubsetListData={fetchSubsetListData} // <-- Pass the function here
                    handleClearFilters={handleClearFilters}
                    resetQuickCompareStates={resetQuickCompareStates}
                    handleDownloadPNG={handleDownloadPNG}
                    handleDownloadSVG={handleDownloadSVG}
                    handleDownloadCSV={handleDownloadCSV}
                    setReportName={setReportName}
                    setOpeningComment={setOpeningComment}
                    setClosingComment={setClosingComment}
                    reportName={reportName}
                    openingComment={openingComment}
                    closingComment={closingComment}
                    handleSaveReport={handleSaveReport}
                    handlePreviewReport={handlePreviewReport}
                    handlePaletteColorChange={handlePaletteColorChange}
                    handleOrder={handleOrder}
                    handleSaveSummaryChartReport={handleSaveSummaryChartReport}
                    handleSaveDetailChartReport={handleSaveDetailChartReport}
                    handleDetailsPreviewReport={handleDetailsPreviewReport}
                    handleSummaryPreviewReport={handleSummaryPreviewReport}
                    activeTab={activeTab}
                    activeCollapse={activeCollapse}
                    onCollapseChange={handleCollapseChange}
                  />
                )}

                {activeTab === "aggregate" && quickComapre ? (
                  quickComapreData?.length > 0 ? (
                    <>
                      {/* Chart with ref for download */}
                      {viewLoader?<FallBackLoader/>:<div ref={aggregateChartRef}>
                        {quickComapreData.map((item, index) => (
                          <CommonBarChartAnnotation
                            key={index}
                            scalarConfigurationPropData={scalarConfiguration}
                            categories={item?.categories}
                            values={item?.values}
                            dynamicHeight={true}

                            activeTab={activeTab}
                            colorsChart={colors}
                            renderChart={renderChart}
                            switchAxis={false}
                            labelColorState={labelColorState}
                            annotationOpacity={Number(
                              (annotationOpacity / 100).toFixed(2)
                            )}
                            showNegative={showNegative}
                            chartType={getChartTypeByID(
                              chartType,
                              chartTypeOptions,
                              true
                            )}
                            legendPosition={
                              getLgendsByID(legendPosition, legendOptions) ||
                              "bottom"
                            }
                            labelPosition={
                              getDataLabelsByID(
                                labelPosition,
                                dataLabelOptions
                              ) || "top"
                            }
                            fontSize={
                              getFontOptionsByID(fontSize, fontSizeOptions) ||
                              "12"
                            }
                            sortOrder={sortOrder}
                          />
                        ))}
                      </div>}
                    </>
                  ) : null
                ) : (
                  <>
                    {/* Chart with ref for download */}
                    <div ref={aggregateChartRef}>
                      {viewLoader?<FallBackLoader/>:<CommonBarChartAnnotation
                        scalarConfigurationPropData={scalarConfiguration}
                        categories={categories|| []}
  values={values|| []}
                        aggregate={true}
                        activeTab={activeTab}
                        colorsChart={colors}
                        renderChart={renderChart}
                        dynamicHeight={true}

                        switchAxis={false}
                        labelColorState={labelColorState}
                        annotationOpacity={Number(
                          (annotationOpacity / 100).toFixed(2)
                        )}
                        showNegative={showNegative}
                        chartType={getChartTypeByID(
                          chartType,
                          chartTypeOptions,
                          true
                        )}
                        legendPosition={
                          getLgendsByID(legendPosition, legendOptions) ||
                          "bottom"
                        }
                        labelPosition={
                          getDataLabelsByID(labelPosition, dataLabelOptions) ||
                          "top"
                        }
                        fontSize={
                          getFontOptionsByID(fontSize, fontSizeOptions) || "12"
                        }
                        sortOrder={sortOrder}
                      />}
                    </div>
                  </>
                )}
              </Tab.Pane>
              <Tab.Pane eventKey="outcome">
                {activeTab === "outcome" && (
                  <Outcomes
                    departmentOptions={departmentOptions}
                    managerOptions={managerOptions}
                    participantOptions={participantOptions}
                    demographicsQuestionListOptions={
                      demographicsQuestionListOptions
                    }
                    outcomeOptions={outcomeOptions}
                    score={score}
                    selectedDepartments={selectedDepartments}
                    selectedUsers={selectedUsers}
                    selectedManagers={selectedManagers}
                    selectedManagerReportees={selectedManagerReportees}
                    selectedDemographicFilters={selectedDemographicFilters}
                    setSelectedDepartments={setSelectedDepartments}
                    setSelectedUsers={setSelectedUsers}
                    setSelectedManagers={setSelectedManagers}
                    setSelectedManagerReportees={setSelectedManagerReportees}
                    setSelectedDemographicFilters={
                      setSelectedDemographicFilters
                    }
                    chartTypeOptions={chartTypeOptions}
                    legendOptions={legendOptions}
                    dataLabelOptions={dataLabelOptions}
                    fontSizeOptions={fontSizeOptions}
                    benchmarklist={benchmarklist}
                    selectedBenchmarkList={selectedBenchmarkList}
                    setSelectedBenchmarkList={setSelectedBenchmarkList}
                    saveBenchmarkdata={saveBenchmarkdata}
                    saveFilterSubset={saveFilterSubset}
                    saveBenchmarkListData={saveBenchmarkListData}
                    filterSubsetOptions={filterSubsetOptions}
                    selectedCompanyId={selectedCompanyId}
                    selectedSurveyId={selectedSurveyId}
                    fetchSaveBenchMark={fetchSaveBenchMark}
                    handleView={handleView}
                    viewLoader={viewLoader}
                    handlePaletteColorChange={handlePaletteColorChange}
                    outcomes={outcomes}
                    onCompareTabOpen={() => {
                      if (selectedSurveyId) {
                        fetchAssessmentChart(
                          selectedSurveyId,
                          "get_filter_subset_list",
                          null,
                          "CCSS"
                        );
                      }
                    }} onFilterTabOpen={() => {
                      if (selectedSurveyId) {
                        fetchAssessmentChart(
                          selectedSurveyId,
                          "get_filter_subset_list",
                          null,
                          "FCSS"
                        );
                      }
                    }}
                   
                    fetchSubsetListData={fetchSubsetListData} // <-- Pass the function here
                    handleClearFilters={handleClearFilters}
                    handleChartTypeChange={handleChartTypeChange}
                    chartType={chartType}
                    handleLegendPosistionChange={handleLegendPosistionChange}
                    legendPosition={legendPosition}
                    handleLablePosistionChange={handleLablePosistionChange}
                    labelPosition={labelPosition}
                    handleFontSizeChange={handleFontSizeChange}
                    fontSize={fontSize || 12}
                    handleSwitchAxisChange={handleSwitchAxisChange}
                    switchAxis={reduxSwitchAxis}
                    handleLabelColorChange={handleLabelColorChange}
                    labelColorState={labelColorState}
                    handleOpacityChange={handleOpacityChange}
                    annotationOpacity={annotationOpacity}
                    handleChartColorChange={handleChartColorChange}
                    resetQuickCompareStates={resetQuickCompareStates}
                    handleDownloadPNG={handleDownloadPNG}
                    handleDownloadSVG={handleDownloadSVG}
                    handleDownloadCSV={handleDownloadCSV}
                    handleOrder={handleOrder}
                    setReportName={setReportName}
                    setOpeningComment={setOpeningComment}
                    setClosingComment={setClosingComment}
                    reportName={reportName}
                    openingComment={openingComment}
                    closingComment={closingComment}
                    handleSaveReport={handleSaveReport}
                    handlePreviewReport={handlePreviewReport}
                    activeTab={activeTab}
                    activeCollapse={activeCollapse}
                    onCollapseChange={handleCollapseChange}
                  />
                )}

                {activeTab === "outcome" && quickComapreOutcome ? (
                  quickComapreOutcomeData?.length > 0 ? (
                    quickComapreOutcomeData.map((item) => (
                      <>
                        {/* Chart with ref for download */}
                        {/* {JSON.stringify(item)} */}
                        {viewLoader?<FallBackLoader/>:<div ref={outcomeChartRef}>
                          <CommonBarChartAnnotation
                            scalarConfigurationPropData={scalarConfiguration}
                            categories={item?.outcomeCategories}
                            values={item?.outcomeValues}
                            activeTab={activeTab}
                            colorsChart={colors}
                            renderChart={renderChart}
                            dynamicHeight={true}

                            switchAxis={false}
                            labelColorState={labelColorState}
                            annotationOpacity={Number(
                              (annotationOpacity / 100).toFixed(2)
                            )}
                            showNegative={showNegative}
                            chartType={getChartTypeByID(
                              chartType,
                              chartTypeOptions,
                              true
                            )}
                            legendPosition={
                              getLgendsByID(legendPosition, legendOptions) ||
                              "bottom"
                            }
                            labelPosition={
                              getDataLabelsByID(
                                labelPosition,
                                dataLabelOptions
                              ) || "top"
                            }
                            fontSize={
                              getFontOptionsByID(fontSize, fontSizeOptions) ||
                              "12"
                            }
                            sortOrder={sortOrder}
                          />
                        </div>}
                      </>
                    ))
                  ) : null
                ) : (
                  <>
                    <div ref={outcomeChartRef}>
                     {viewLoader?<FallBackLoader/>: <CommonBarChartAnnotation
                        scalarConfigurationPropData={scalarConfiguration}
                        categories={outcomeCategories}
                        values={outcomeValues}
                        activeTab={activeTab}
                        dynamicHeight={true}

                        colorsChart={colors}
                        renderChart={renderChart}
                        switchAxis={false}
                        labelColorState={labelColorState}
                        annotationOpacity={Number(
                          (annotationOpacity / 100).toFixed(2)
                        )}
                        showNegative={showNegative}
                        chartType={getChartTypeByID(
                          chartType,
                          chartTypeOptions,
                          true
                        )}
                        legendPosition={
                          getLgendsByID(legendPosition, legendOptions) ||
                          "bottom"
                        }
                        labelPosition={
                          getDataLabelsByID(labelPosition, dataLabelOptions) ||
                          "top"
                        }
                        fontSize={
                          getFontOptionsByID(fontSize, fontSizeOptions) || "12"
                        }
                        sortOrder={sortOrder}
                      />}
                    </div>
                  </>
                )}
              </Tab.Pane>
              <Tab.Pane eventKey="intention">
                {activeTab === "intention" && (
                  <Intentions
                    departmentOptions={departmentOptions}
                    dynamicHeight={true}
                    managerOptions={managerOptions}
                    participantOptions={participantOptions}
                    demographicsQuestionListOptions={
                      demographicsQuestionListOptions
                    }
                    handlePaletteColorChange={handlePaletteColorChange}
                    outcomeOptions={outcomeOptions}
                    score={score}
                    chartTypeOptions={chartTypeOptions}
                    benchmarklist={benchmarklist}
                    selectedBenchmarkList={selectedBenchmarkList}
                    setSelectedBenchmarkList={setSelectedBenchmarkList}
                    legendOptions={legendOptions}
                    dataLabelOptions={dataLabelOptions}
                    fontSizeOptions={fontSizeOptions}
                    intentionsOptions={intentionsOptions}
                    onOutcomeChange={handleOutcomeChange}
                    onIntentionChange={handleIntentionChange}
                    handleView={handleView}
                    viewLoader={viewLoader}
                    selectedDepartments={selectedDepartments}
                    selectedUsers={selectedUsers}
                    selectedCompanyId={selectedCompanyId}
                    selectedSurveyId={selectedSurveyId}
                    selectedManagers={selectedManagers}
                    selectedManagerReportees={selectedManagerReportees}
                    selectedDemographicFilters={selectedDemographicFilters}
                    setSelectedDepartments={setSelectedDepartments}
                    setSelectedUsers={setSelectedUsers}
                    setSelectedManagers={setSelectedManagers}
                    setSelectedManagerReportees={setSelectedManagerReportees}
                    setSelectedDemographicFilters={
                      setSelectedDemographicFilters
                    }
                    outcomes={outcomes}
                    saveFilterSubset={saveFilterSubset}
                    filterSubsetOptions={filterSubsetOptions}
                    onCompareTabOpen={() => {
                      if (selectedSurveyId) {
                        fetchAssessmentChart(
                          selectedSurveyId,
                          "get_filter_subset_list",
                          null,
                          "CCSS"
                        );
                      }
                    }} onFilterTabOpen={() => {
                      if (selectedSurveyId) {
                        fetchAssessmentChart(
                          selectedSurveyId,
                          "get_filter_subset_list",
                          null,
                          "FCSS"
                        );
                      }
                    }}
                    fetchSubsetListData={fetchSubsetListData} // <-- Pass the function here
                    handleClearFilters={handleClearFilters}
                    handleChartTypeChange={handleChartTypeChange}
                    chartType={chartType}
                    handleLegendPosistionChange={handleLegendPosistionChange}
                    legendPosition={legendPosition}
                    handleLablePosistionChange={handleLablePosistionChange}
                    labelPosition={labelPosition}
                    handleFontSizeChange={handleFontSizeChange}
                    fontSize={fontSize || 12}
                    handleSwitchAxisChange={handleSwitchAxisChange}
                    switchAxis={reduxSwitchAxis}
                    handleLabelColorChange={handleLabelColorChange}
                    labelColorState={labelColorState}
                    handleOpacityChange={handleOpacityChange}
                    annotationOpacity={annotationOpacity}
                    handleChartColorChange={handleChartColorChange}
                    resetQuickCompareStates={resetQuickCompareStates}
                    handleDownloadPNG={handleDownloadPNG}
                    handleDownloadSVG={handleDownloadSVG}
                    handleDownloadCSV={handleDownloadCSV}
                    handleOrder={handleOrder}
                    setReportName={setReportName}
                    setOpeningComment={setOpeningComment}
                    setClosingComment={setClosingComment}
                    reportName={reportName}
                    openingComment={openingComment}
                    closingComment={closingComment}
                    handleSaveReport={handleSaveReport}
                    handlePreviewReport={handlePreviewReport}
                    activeTab={activeTab}
                    activeCollapse={activeCollapse}
                    onCollapseChange={handleCollapseChange}
                  />
                )}

                {activeTab === "intention" && quickComapreIntemtion ? (
                  quickComapreIntemtionData?.length > 0 ? (
                    quickComapreIntemtionData.map((item) => (
                      <>
                        <div ref={intentionChartRef}>
                          {viewLoader?<FallBackLoader/>:<CommonBarChartAnnotation
                            scalarConfigurationPropData={scalarConfiguration}
                            categories={item?.intentionCategories}
                            values={item?.intentionValues}
                            activeTab={activeTab}
                            colorsChart={colors}
                            renderChart={renderChart}
                            dynamicHeight={true}

                            switchAxis={false}
                            labelColorState={labelColorState}
                            annotationOpacity={Number(
                              (annotationOpacity / 100).toFixed(2)
                            )}
                            showNegative={showNegative}
                            chartType={getChartTypeByID(
                              chartType,
                              chartTypeOptions,
                              true
                            )}
                            legendPosition={
                              getLgendsByID(legendPosition, legendOptions) ||
                              "bottom"
                            }
                            labelPosition={
                              getDataLabelsByID(
                                labelPosition,
                                dataLabelOptions
                              ) || "top"
                            }
                            fontSize={
                              getFontOptionsByID(fontSize, fontSizeOptions) ||
                              "12"
                            }
                            sortOrder={sortOrder}
                          />}
                        </div>
                      </>
                    ))
                  ) : null
                ) : (
                  <>
                    <div ref={intentionChartRef}>
                      {viewLoader?<FallBackLoader/>:<CommonBarChartAnnotation
                        scalarConfigurationPropData={scalarConfiguration}
                        categories={intentionCategories}
                        dynamicHeight={true}

                        values={intentionValues}
                        activeTab={activeTab}
                        colorsChart={colors}
                        renderChart={renderChart}
                        switchAxis={false}
                        labelColorState={labelColorState}
                        annotationOpacity={Number(
                          (annotationOpacity / 100).toFixed(2)
                        )}
                        showNegative={showNegative}
                        chartType={getChartTypeByID(
                          chartType,
                          chartTypeOptions,
                          true
                        )}
                        legendPosition={
                          getLgendsByID(legendPosition, legendOptions) ||
                          "bottom"
                        }
                        labelPosition={
                          getDataLabelsByID(labelPosition, dataLabelOptions) ||
                          "top"
                        }
                        fontSize={
                          getFontOptionsByID(fontSize, fontSizeOptions) || "12"
                        }
                        sortOrder={sortOrder}
                      />}
                    </div>
                  </>
                )}
              </Tab.Pane>
              <Tab.Pane eventKey="rating">
                {activeTab === "rating" && (
                  <RatingQuestions
                    departmentOptions={departmentOptions}
                    managerOptions={managerOptions}
                    demographicsQuestionListOptions={
                      demographicsQuestionListOptions
                    }
                    participantOptions={participantOptions}
                    selectedDepartments={selectedDepartments}
                    selectedUsers={selectedUsers}
                    selectedManagers={selectedManagers}
                    selectedManagerReportees={selectedManagerReportees}
                    selectedDemographicFilters={selectedDemographicFilters}
                    setSelectedDepartments={setSelectedDepartments}
                    setSelectedUsers={setSelectedUsers}
                    setSelectedManagers={setSelectedManagers}
                    setSelectedManagerReportees={setSelectedManagerReportees}
                    setSelectedDemographicFilters={
                      setSelectedDemographicFilters
                    }
                    benchmarklist={benchmarklist}
                    selectedBenchmarkList={selectedBenchmarkList}
                    setSelectedBenchmarkList={setSelectedBenchmarkList}
                    outcomeOptions={outcomeOptions}
                    intentionsOptions={intentionsOptions}
                    onOutcomeChange={handleOutcomeChange} // Add this line
                    onIntentionChange={handleIntentionChange}
                    score={score}
                    onCompareTabOpen={() => {
                      if (selectedSurveyId) {
                        fetchAssessmentChart(
                          selectedSurveyId,
                          "get_filter_subset_list",
                          null,
                          "CCSS"
                        );
                      }
                    }} onFilterTabOpen={() => {
                      if (selectedSurveyId) {
                        fetchAssessmentChart(
                          selectedSurveyId,
                          "get_filter_subset_list",
                          null,
                          "FCSS"
                        );
                      }
                    }}
                    chartTypeOptions={chartTypeOptions}
                    legendOptions={legendOptions}
                    dataLabelOptions={dataLabelOptions}
                    fontSizeOptions={fontSizeOptions}
                    questionOptions={questionOptions}
                    handleView={handleView}
                    outcomes={outcomes}
                    viewLoader={viewLoader}
                    saveFilterSubset={saveFilterSubset}
                    filterSubsetOptions={filterSubsetOptions}
                    selectedCompanyId={selectedCompanyId}
                    selectedSurveyId={selectedSurveyId}
                    fetchSubsetListData={fetchSubsetListData}
                    getfiltersubset={getfiltersubset}
                    handleClearFilters={handleClearFilters}
                    handleChartTypeChange={handleChartTypeChange}

                    chartType={chartType}
                    handleLegendPosistionChange={handleLegendPosistionChange}
                    legendPosition={legendPosition}
                    handleLablePosistionChange={handleLablePosistionChange}
                    labelPosition={labelPosition}
                    handleFontSizeChange={handleFontSizeChange}
                    fontSize={fontSize || 12}
                    handleSwitchAxisChange={handleSwitchAxisChange}
                    switchAxis={reduxSwitchAxis}
                    handleLabelColorChange={handleLabelColorChange}
                    labelColorState={labelColorState}
                    handleOpacityChange={handleOpacityChange}
                    annotationOpacity={annotationOpacity}
                    handleChartColorChange={handleChartColorChange}
                    resetQuickCompareStates={resetQuickCompareStates}
                    handleDownloadPNG={handleDownloadPNG}
                    handleDownloadSVG={handleDownloadSVG}
                    handleDownloadCSV={handleDownloadCSV}
                    handleOrder={handleOrder}
                    setReportName={setReportName}
                    setOpeningComment={setOpeningComment}
                    setClosingComment={setClosingComment}
                    reportName={reportName}
                    openingComment={openingComment}
                    closingComment={closingComment}
                    handleSaveReport={handleSaveReport}
                    handlePreviewReport={handlePreviewReport}
                  />
                )}

                {activeTab === "rating" && quickComapreRating ? (
                  quickComapreRatingData?.length > 0 ? (
                    quickComapreRatingData.map((item) => (
                      <>
                        {" "}
                        <div ref={ratingChartRef}>
                          {/* Chart with ref for download */}
                          {viewLoader?<FallBackLoader/>:<CommonBarChartAnnotation
                            scalarConfigurationPropData={scalarConfiguration}
                            categories={item?.ratingCategories}
                            values={item?.ratingValue}
                            activeTab={activeTab}
                            colorsChart={colors}
                            renderChart={renderChart}
                            switchAxis={false}
                            labelColorState={labelColorState}
                            annotationOpacity={Number(
                              (annotationOpacity / 100).toFixed(2)
                            )}
                            showNegative={showNegative}
                            chartType={getChartTypeByID(
                              chartType,
                              chartTypeOptions,
                              true
                            )}
                            legendPosition={
                              getLgendsByID(legendPosition, legendOptions) ||
                              "bottom"
                            }
                            labelPosition={
                              getDataLabelsByID(
                                labelPosition,
                                dataLabelOptions
                              ) || "top"
                            }
                            fontSize={
                              getFontOptionsByID(fontSize, fontSizeOptions) ||
                              "12"
                            }
                            sortOrder={sortOrder}
                          />}
                        </div>
                      </>
                    ))
                  ) : null
                ) : (
                  <>
                    <div ref={ratingChartRef}>
                      {viewLoader?<FallBackLoader/>:<CommonBarChartAnnotation
                        scalarConfigurationPropData={scalarConfiguration}
                        categories={ratingCategories}
                        values={ratingValue}
                        activeTab={activeTab}
                        colorsChart={colors}
                        
                        renderChart={renderChart}
                        dynamicHeight={true}

                        switchAxis={false}
                        labelColorState={labelColorState}
                        annotationOpacity={Number(
                          (annotationOpacity / 100).toFixed(2)
                        )}
                        showNegative={showNegative}
                        chartType={getChartTypeByID(
                          chartType,
                          chartTypeOptions,
                          true
                        )}
                        legendPosition={
                          getLgendsByID(legendPosition, legendOptions) ||
                          "bottom"
                        }
                        labelPosition={
                          getDataLabelsByID(labelPosition, dataLabelOptions) ||
                          "top"
                        }
                        fontSize={
                          getFontOptionsByID(fontSize, fontSizeOptions) || "12"
                        }
                        graphFrom={activeTab}
                        sortOrder={sortOrder}
                      />}
                    </div>
                  </>
                )}
              </Tab.Pane>
              <Tab.Pane eventKey="IG">
                {activeTab === "IG" && (
                  <>
                    <InfoGatheringQuestions
                      demographicsQuestionListOptions={
                        demographicsQuestionListOptions
                      }
                      departmentOptions={departmentOptions}
                      managerOptions={managerOptions}
                      participantOptions={participantOptions}
                      score={score}
                      chartTypeOptions={chartTypeOptions}
                      handleDownloadSVG={handleDownloadSVG}

                      legendOptions={legendOptions}
                      dataLabelOptions={dataLabelOptions}
                      fontSizeOptions={fontSizeOptions}
                      handleView={handleView}
                      viewLoader={viewLoader}
                      selectedDepartments={selectedDepartments}
                      selectedUsers={selectedUsers}
                      selectedManagers={selectedManagers}
                      selectedManagerReportees={selectedManagerReportees}
                      selectedDemographicFilters={selectedDemographicFilters}
                      setSelectedDepartments={setSelectedDepartments}
                      setSelectedUsers={setSelectedUsers}
                      setSelectedManagers={setSelectedManagers}
                      setSelectedManagerReportees={setSelectedManagerReportees}
                      setSelectedDemographicFilters={
                        setSelectedDemographicFilters
                      }
                      benchmarklist={benchmarklist}
                      selectedBenchmarkList={selectedBenchmarkList}
                      setSelectedBenchmarkList={setSelectedBenchmarkList}
                      outcomeOptions={outcomeOptions}
                      intentionsOptions={intentionsOptions}
                      outcomes={outcomes}
                      onOutcomeChange={handleOutcomeChange} // Add this line
                      onIntentionChange={handleIntentionChange}
                      questionOptions={questionOptions}
                      saveFilterSubset={saveFilterSubset}
                      filterSubsetOptions={filterSubsetOptions}
                      selectedCompanyId={selectedCompanyId}
                      selectedSurveyId={selectedSurveyId}
                      fetchSubsetListData={fetchSubsetListData} // <-- Pass the function here
                      handleClearFilters={handleClearFilters}
                      handleChartColorChange={handleChartColorChange}
                      IGQuestionsData={IGQuestionsData}
                      scalarConfiguration={scalarConfiguration}
                      colorsChart={colors}
                      renderChart={renderChart}
                      handleIGChartTypeChangeChild={
                        handleIGChartTypeChangeChild
                      }
                      handleIGLegendPositionChangeChild={
                        handleIGLegendPositionChangeChild
                      }
                      handleIGLabelPositionChangeChild={
                        handleIGLabelPositionChangeChild
                      }
                      handleIGFontSizeChangeChild={handleIGFontSizeChangeChild}
                      handleIGSwitchAxisChangeChild={
                        handleIGSwitchAxisChangeChild
                      }
                      handleIGLabelColorChangeChild={
                        handleIGLabelColorChangeChild
                      }
                      handleIGOpacityChangeChild={handleIGOpacityChangeChild}
                      handleIGChartColorChangeChild={
                        handleIGChartColorChangeChild
                      }
                      renderScalar={renderScalar}
                      handleIGChartTypeChange={handleIGChartTypeChange}
                      handleIGLegendPositionChange={
                        handleIGLegendPositionChange
                      }
                      handleIGLabelPositionChange={handleIGLabelPositionChange}
                      handleIGFontSizeChange={handleIGFontSizeChange}
                      handleIGLabelColorChange={handleIGLabelColorChange}
                      handleIGOpacityChange={handleIGOpacityChange}
                      handleIGChartColorChange={handleIGChartColorChange}
                      handleIGSwitchAxisChange={handleIGSwitchAxisChange}
                      handleIGApplyAll={handleIGApplyAll}
                      IGSelectedColorPallet={IGSelectedColorPallet}
                      IGChartType={IGChartType}
                      IGLegendPosition={IGLegendPosition}
                      IGLabelPosition={IGLabelPosition}
                      // handleDownloadSVG={handleDownloadSVG}
                      IGFontSize={IGFontSize}
                      IGLabelColorState={IGLabelColorState}
                      IGAnnotationOpacity={IGAnnotationOpacity}
                      IGDataLabelOptions={IGDataLabelOptions}
                      IGSwitchAxis={IGSwitchAxis}
                      IGColors={IGColors}
                      infoChartRef={infoChartRef}
                      handleDownloadPNG={handleDownloadPNG}
                      handleOrder={handleOrder}
                      sortOrder={sortOrder}
                      activeTab={activeTab}
                      setReportName={setReportName}
                      setOpeningComment={setOpeningComment}
                      setClosingComment={setClosingComment}
                      reportName={reportName}
                      openingComment={openingComment}
                      closingComment={closingComment}
                      handleIGSaveReport={handleIGSaveReport}
                      handleIGPreviewReport={handleIGPreviewReport}
                      childAxis={true}
                    />
                  </>
                )}
              </Tab.Pane>
              <Tab.Pane eventKey="DD">
                {activeTab === "DD" && (
                  <>
                    <DrillDownQuestions
                      demographicsQuestionListOptions={
                        demographicsQuestionListOptions
                      }
                      departmentOptions={departmentOptions}
                      managerOptions={managerOptions}
                      participantOptions={participantOptions}
                      score={score}
                      handleDownloadSVG={handleDownloadSVG}

                      chartTypeOptions={drilldownChartOptions}
                      legendOptions={drilldownLegendOptions}
                      dataLabelOptions={drilldownDataLabelOptions}
                      fontSizeOptions={fontSizeOptions}
                      handleView={handleView}
                      viewLoader={viewLoader}
                      selectedDepartments={selectedDepartments}
                      selectedUsers={selectedUsers}
                      selectedManagers={selectedManagers}
                      selectedManagerReportees={selectedManagerReportees}
                      selectedDemographicFilters={selectedDemographicFilters}
                      setSelectedDepartments={setSelectedDepartments}
                      setSelectedUsers={setSelectedUsers}
                      setSelectedManagers={setSelectedManagers}
                      setSelectedManagerReportees={setSelectedManagerReportees}
                      setSelectedDemographicFilters={
                        setSelectedDemographicFilters
                      }
                      benchmarklist={benchmarklist}
                      selectedBenchmarkList={selectedBenchmarkList}
                      setSelectedBenchmarkList={setSelectedBenchmarkList}
                      outcomeOptions={outcomeOptions}
                      intentionsOptions={intentionsOptions}
                      onOutcomeChange={handleOutcomeChange} // Add this line
                      questionOptions={questionOptions}
                      onIntentionChange={handleIntentionChange}
                      DrillDownQuestionsData={DrillDownQuestionsData}
                      categories={categories}
                      values={values}
                      outcomes={outcomes}
                      saveFilterSubset={saveFilterSubset}
                      filterSubsetOptions={filterSubsetOptions}
                      selectedCompanyId={selectedCompanyId}
                      selectedSurveyId={selectedSurveyId}
                      fetchSubsetListData={fetchSubsetListData} // <-- Pass the function here
                      handleClearFilters={handleClearFilters}
                      scalarConfiguration={scalarConfiguration}
                      colorsChart={colors}
                      renderChart={renderChart}
                      handleChartTypeChangeChild={handleChartTypeChangeChild}
                      handleLegendPositionChange={
                        handleLegendPositionChangeChild
                      }
                      handleLablePosistionChange={
                        handleLablePosistionChangeChild
                      }
                      handleFontSizeChange={handleFontSizeChangeChild}
                      handleSwitchAxisChange={handleSwitchAxisChangeChild}
                      handleLabelColorChange={handleLabelColorChangeChild}
                      handleOpacityChange={handlehandleOpacityChangeChild}
                      handleChartColorChangeChild={handleChartColorChangeChild}
                      handleDrilldownChartTypeChange={
                        handleDrilldownChartTypeChange
                      }
                      handleDrilldownLegendPositionChange={
                        handleDrilldownLegendPositionChange
                      }
                      handleDrilldownLabelPositionChange={
                        handleDrilldownLabelPositionChange
                      }
                      handleDrilldownFontSizeChange={
                        handleDrilldownFontSizeChange
                      }
                      handleDrilldownLabelColorChange={
                        handleDrilldownLabelColorChange
                      }
                      handleDrilldownOpacityChange={
                        handleDrilldownOpacityChange
                      }
                      handleDrilldownChartColorChange={
                        handleDrilldownChartColorChange
                      }
                      handleDrilldownSwitchAxisChange={
                        handleDrilldownSwitchAxisChange
                      }
                      drilldownSelectedColorPallet={
                        drilldownSelectedColorPallet
                      }
                      drilldownColors={colors}
                      drilldownChartType={drilldownChartType}
                      drilldownLegendPosition={drilldownLegendPosition}
                      drilldownLabelPosition={drilldownLabelPosition}
                      drilldownFontSize={drilldownFontSize}
                      drilldownLabelColorState={drilldownLabelColorState}
                      drilldownAnnotationOpacity={drilldownAnnotationOpacity}
                      handleDrilldownApplyAll={handleDrilldownApplyAll}
                      drilldownswitchAxis={drilldownswitchAxis}
                      renderScalar={renderScalar}
                      drillDownChartRef={drillDownChartRef}
                      handleDownloadPNG={handleDownloadPNG}
                      handleOrder={handleOrder}
                      sortOrder={sortOrder}
                      activeTab={activeTab}
                      setReportName={setReportName}
                      setOpeningComment={setOpeningComment}
                      setClosingComment={setClosingComment}
                      reportName={reportName}
                      openingComment={openingComment}
                      closingComment={closingComment}
                      handleDDSaveReport={handleDDSaveReport}
                      handleDDPreviewReport={handleDDPreviewReport}
                    />
                  </>
                )}
              </Tab.Pane>
            </Tab.Content>}
          </Tab.Container>
          <div style={{ display: 'flex', width: '100%' }}>
  {(activeTab === "aggregate"&&!quickComapre) && (
    <div className="p-4" style={{ width: '100%' }}>
      <div className="overflow-x-auto" style={{ width: '100%' }}>
        <table className="min-w-full bg-white border border-gray-200" style={{ width: '100%' }}>
          <thead>
            <tr style={{ backgroundColor: "rgb(243, 244, 246)" }}>
              <th className="border border-gray-200 px-4 py-2 font-bold">
                Outcomes / Participant
              </th>
              <th className="border border-gray-200 px-4 py-2 font-bold">
                Survey Aggregate
              </th>
            </tr>
          </thead>
          <tbody>
            {outComeData.map((data, index) => {
              const [key, value] = Object.entries(data)[0];
              return (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="border border-gray-200 px-4 py-2 font-medium">{key}</td>
                  <td className="border border-gray-200 px-4 py-2">{value}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  )}

  {(activeTab === "outcome"&&!quickComapreOutcome) && (
    <div className="p-4" style={{ width: '100%' }}>
      <div className="overflow-x-auto" style={{ width: '100%' }}>
        <table className="min-w-full bg-white border border-gray-200" style={{ width: '100%' }}>
          <thead>
            <tr style={{ backgroundColor: "rgb(243, 244, 246)" }}>
              <th className="border border-gray-200 px-4 py-2 font-bold">
                Outcomes / Participant
              </th>
              {outcomeNames.map((name, index) => (
                <th key={index} className="border border-gray-200 px-4 py-2 font-bold">
                  {name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {outComeTableData.map((item, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="border border-gray-200 px-4 py-2 font-medium">{item.info_name}</td>
                {outcomeNames.map((outcomeName, colIndex) => {
                  const outcomeObj = item.outcomes.find(o => o.outcome_name === outcomeName);
                  return (
                    <td key={colIndex} className="border border-gray-200 px-4 py-2">
                      {outcomeObj ? outcomeObj.value : "-"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )}

  {(activeTab === "intention"&&!quickComapreIntemtion) && (
    <div className="p-4" style={{ width: '100%' }}>
      <div className="overflow-x-auto" style={{ width: '100%' }}>
        <table className="min-w-full bg-white border border-gray-200" style={{ width: '100%' }}>
          <thead>
            <tr style={{ backgroundColor: "rgb(243, 244, 246)" }}>
              <th className="border border-gray-200 px-4 py-2 font-bold">
                Outcomes / Participant
              </th>
              {intentionNames.map((name, index) => (
                <th key={index} className="border border-gray-200 px-4 py-2 font-bold">
                  {name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {intentionTableData.map((item, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="border border-gray-200 px-4 py-2 font-medium">{item.info_name}</td>
                {intentionNames.map((intentionName, colIndex) => {
                  const outcomeObj = item.intentions.find(o => o.intention_name === intentionName);
                  return (
                    <td key={colIndex} className="border border-gray-200 px-4 py-2">
                      {outcomeObj ? outcomeObj.value : "-"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )}
 {
  (activeTab === "rating"&&!quickComapreRating) && (() => {
    const groupedByIntention = {};

    // Group questions by intention_value and info_name
    questiontable.forEach(({ info_name, questions }) => {
      questions.forEach(q => {
        const key = (q.intention_value || '').trim();
        if (!groupedByIntention[key]) groupedByIntention[key] = {};
        if (!groupedByIntention[key][info_name]) groupedByIntention[key][info_name] = [];
        groupedByIntention[key][info_name].push(q);
      });
    });

    const intentionKeys = Object.keys(groupedByIntention);

    // Get ordered question numbers per intention group
    const questionOrder = {};
    intentionKeys.forEach(key => {
      const allQs = Object.values(groupedByIntention[key]).flat();
      const qNos = [...new Set(allQs.map(q => q.question_no))].sort((a, b) =>
        a.toString().localeCompare(b.toString(), undefined, { numeric: true })
      );
      questionOrder[key] = qNos;
    });

    const allInfoNames = [...new Set(questiontable.map(d => d.info_name))];

    return (
      <div className="p-4 overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-center text-sm">
          <thead className="bg-blue-900 text-white">
          <tr style={{ backgroundColor: "rgb(243, 244, 246)" }}>
          <th className="border border-gray-300 px-2 py-1" style={{ color: 'black' }}>Intentions</th>
              {intentionKeys.map((key, i) => (
                <th
                  key={i}
                  className="border border-gray-300 px-2 py-1"
                  style={{ color: 'black' }}
                  colSpan={questionOrder[key].length}
                >
                  {key || ''}
                </th>
              ))}
            </tr>
          </thead>

          {/* Average rows */}
          {allInfoNames.map((infoName, idx) => (
            <tr key={`avg-${idx}`} className={idx % 2 === 0 ? "bg-gray-100" : "bg-white"}>
              <td className="border border-gray-300 px-2 py-1 font-medium">{infoName}</td>
              {intentionKeys.map(key => {
                const questions = groupedByIntention[key][infoName] || [];
                const avg = questions.length
                  ? (questions.reduce((sum, q) => sum + parseFloat(q.value), 0) / questions.length).toFixed(2)
                  : "-";
                return (
                  <td
                    key={`${infoName}-${key}-avg`}
                    colSpan={questionOrder[key].length}
                    className="border border-gray-300 px-2 py-1"
                  >
                    {avg}
                  </td>
                );
              })}
            </tr>
          ))}

          {/* Question number row */}
          <tr className="bg-blue-50 font-semibold">
            <td className="border border-gray-300 px-2 py-1">Questions</td>
            {intentionKeys.map(key =>
              questionOrder[key].map((qNo, i) => (
                <td key={`${key}-qno-${i}`} className="border border-gray-300 px-2 py-1 underline">
                  {qNo}
                </td>
              ))
            )}
          </tr>

          {/* Value rows */}
          {allInfoNames.map((infoName, rowIdx) => (
            <tr key={`values-${rowIdx}`} className={rowIdx % 2 === 0 ? "bg-gray-100" : "bg-white"}>
              <td className="border border-gray-300 px-2 py-1">{infoName}</td>
              {intentionKeys.map(key => {
                const valuesMap = {};
                (groupedByIntention[key][infoName] || []).forEach(q => {
                  valuesMap[q.question_no] = q.value;
                });

                return questionOrder[key].map((qNo, i) => (
                  <td key={`${infoName}-${key}-val-${i}`} className="border border-gray-300 px-2 py-1">
                    {valuesMap[qNo] || "-"}
                  </td>
                ));
              })}
            </tr>
          ))}
        </table>
      </div>
    );
  })()
}


</div>

                

          {showCrosstab && (
            <div className="formCard mt-5" style={{backgroundColor:'#f3f4f6',  
              border: '1px solid #dcdcdc', // lighter than #2e2e2e
            }} >
              <h4 className="mb-3">Crosstab Results</h4>
              <ReactDataTable
                showFooter={false}
                isPaginate={false}
                data={processCrosstabData(showCrosstabData)}
                columns={crosstabColumns}
                isCrosstab={true}
              />
            </div>
          )}
        </div>
      )}
    <SweetAlert
  title="Dataset Saved Successfully!"
  text="Do you want to continue to the IR Chart to create a report with this dataset?"
  show={saveDatasetstatus}
  icon="success"
  onConfirmAlert={() => {
    setsaveDatasetStatus(false);
    dispatch(setIRNavigationState({
      type: "createReport",
      companyName: companyOptions.find(option => option.value === selectedCompanyId)?.label,
      companyId: selectedCompanyId,
      assessmentName: selectedSurveyName,
      assessmentId: selectedSurveyId,
      datasetName: datasetName,
      datasetId: datasetId?.data,
    }))
    navigate(`${adminRouteMap.REPORTGENERATOR.path}`);
    return true;
  }}
  showCancelButton
  cancelButtonText="Cancel"
  confirmButtonText="Yes"
  setIsAlertVisible={setsaveDatasetStatus}
  isConfirmedTitle="Go To IR"
  isConfirmedText="Navigating to IR"
/>

      {/* create dataset modal */}
      <ModalComponent
        modalHeader="Create Dataset"
        size="sm"
        show={saveDataset}
        onHandleCancel={saveDatasetClose}
      >
        <Form>
          <Form.Group className="form-group mb-3">
            <Form.Label>Dataset Name</Form.Label>
            <InputField
              type="text"
              placeholder="Master Company"
              value={datasetName}
              onChange={(e) => {
                setDatasetName(e.target.value);
                setDatasetNameError(""); // Clear error on change
              }}
              isInvalid={!!datasetNameError}
            />
            {datasetNameError && (
              <Form.Control.Feedback type="invalid">
                {datasetNameError}
              </Form.Control.Feedback>
            )}
          </Form.Group>
          <Form.Group className="form-group mb-3">
            <Form.Label>Description</Form.Label>
            <InputField
              as="textarea"
              rows={4}
              extraClass="h-auto"
              placeholder="Company Description"
              value={datasetDescription}
              onChange={(e) => {
                setDatasetDescription(e.target.value);
                setDatasetDescriptionError(""); // Clear error on change
              }}
              isInvalid={!!datasetDescriptionError}
            />
            {datasetDescriptionError && (
              <Form.Control.Feedback type="invalid">
                {datasetDescriptionError}
              </Form.Control.Feedback>
            )}
          </Form.Group>
          <div className="form-btn d-flex justify-content-end gap-2">
            <Button
              variant="secondary"
              className="ripple-effect"
              onClick={saveDatasetClose}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="ripple-effect"
              onClick={() => {
                saveIRDataset(
                  datasetName,
                  datasetDescription,
                  getCurrentDataFilters()
                );
              }}
            >
              Save Dataset
            </Button>
          </div>
        </Form>
      </ModalComponent>
    </>
  );
}

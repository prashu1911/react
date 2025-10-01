import React, { useState, useEffect } from "react";
import { Col, Collapse, Form, Row, Spinner } from "react-bootstrap";
import { commonService } from "services/common.service";
import { COMMANAPI } from "apiEndpoints/OrgStructure/OrgStructure.dashboard";
import { useAuth } from "customHooks";
import { decodeHtmlEntities } from "utils/common.util";
import { SURVEYS_MANAGEMENT } from "apiEndpoints/SurveysManagement";
import { useChartSettings } from "customHooks/useChartSettings";
import adminRouteMap from "routes/Admin/adminRouteMap";
import {
  Breadcrumb,
  Button,
  Loader,
  SelectField,
  SelectWithActions,
} from "../../../../components";
import CollapseAge from "./CollapseAge/index.page";
import ChartOptions from "../Charting/CollapseFilterOptions/ChartOptions";
import { CreateDatasetModal } from "./ModelComponents";
import toast from "react-hot-toast";

export default function DemographicTrendAnalysis() {
  // breadcrumb
  const breadcrumb = [
    {
      path: "#!",
      name: "Analytics",
    },

    {
      path: "#",
      name: "Demographic Trend Analysis",
    },
  ];

  const [chartTypeOptions, setChartOptions] = useState([]);

  const [legendOptions, setLegendOptions] = useState([]);

  const [dataLabelOptions, setDataLabelOptions] = useState([]);

  const [fontSizeOptions] = useState([
    { value: 8, label: "8" },
    { value: 10, label: "10" },
    { value: 12, label: "12" },
    { value: 14, label: "14" },
    { value: 16, label: "16" },
  ]);

  const { getloginUserData } = useAuth();
  const userData = getloginUserData();

  const { saveChartSettings } = useChartSettings();

  const [companyOptions, setCompanyOptions] = useState([]);
  const [surveyOptions, setSurveyOptions] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [selectedSurveyId, setSelectedSurveyId] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState([]);
  const [selectedManager, setSelectedManager] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [scalarConfiguration, setScalarConfiguration] = useState([]);
  // Collapse
  const [open, setOpen] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [trendOpen, setTrendOpen] = useState(true); // Set default to true
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [managerOptions, setManagerOptions] = useState([]);
  const [score, setScore] = useState({});
  const [demographicsQuestionListOptions, setDemographicsQuestionListOptions] =
    useState([]);
  const [colorCollpaseShow, setcolorCollpaseShow] = useState({
    mainColorCollapse: false,
    ageColorCollapse: false,
  });
  const [chartData, setChartData] = useState([]);
  const [chartType, setChartType] = useState();
  const [legendPosition, setLegendPosition] = useState("bottom");
  const [labelPosition, setLabelPosition] = useState("none");
  const [fontSize, setFontSize] = useState(10);
  const [switchAxis, setSwitchAxis] = useState(false);
  const [labelColorState, setLabelColorState] = useState("#000000"); // default black
  const [annotationOpacity, setAnnotationOpacity] = useState(100); // default to fully opaque
  const [colors, setColors] = useState([]);
  const [reporteesType, setReporteesType] = useState("A"); // Default to "All"
  const [renderChart, setRenderChart] = useState(false);
  const [renderScalar, setRenderScalar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedColorPallet, setSelectedColorPallet] = useState({});
  const [clearLoader, setClearLoader] = useState(false);
  const [runLoader, setRunLoader] = useState(false);
  // Add these new state variables after other useState declarations
  const [reportName, setReportName] = useState("");
  const [openingComment, setOpeningComment] = useState("");
  const [closingComment, setClosingComment] = useState("");
  const [filtersData, setFiltersData] = useState({});

  // Add useEffect to update filtersData when departments or managers change
  useEffect(() => {
    setFiltersData(prevData => ({
      ...prevData,
      departments: selectedDepartment.map(dept => ({
        id: dept.value,
        name: dept.label
      })),
      managers: selectedManager.map(manager => ({
        id: manager.value,
        name: manager.label
      })),
      reporteesType: reporteesType
    }));
  }, [selectedDepartment, selectedManager, reporteesType]);

  useEffect(() => {
    console.log("FILTERS DATA: ", filtersData)
  },[filtersData])

  const toggleCollapse = (collapseKey) => {
    setcolorCollpaseShow((prevState) => ({
      ...prevState,
      [collapseKey]: !prevState[collapseKey],
    }));
  };

  // create dataset modal
  const [saveDemoTrendReport, setSaveDemoTrendReport] = useState(false);
  const saveDemoTrendReportClose = () => {setSaveDemoTrendReport(false); setClosingComment(''); setOpeningComment(''); setReportName('')};
  const saveDemoTrendReportShow = () => setSaveDemoTrendReport(true);

  const fetchOptionDetails = async (path, type) => {
    setLoading(true);
    try {
      const response = await commonService({
        apiEndPoint: COMMANAPI.getComman(path),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        if (type === "company") {
          setCompanyOptions(
            Object?.values(response?.data?.data)?.map((company) => ({
              value: company?.companyID,
              label: decodeHtmlEntities(company?.companyName),
            }))
          );
        }
      }
      setLoading(false);
    } catch (err) {
      console.error("err", err);
    }
  };

  const fetchSurvey = async (companyID) => {
    setLoading(true);
    try {
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
      setLoading(false);
    } catch (err) {
      setLoading(false)
      console.error("err", err);
    }
  };

  const fetchAssessmentChart = async (
    assessmentID,
    action,
    companyID = null
  ) => {
    try {
      setLoading(true);
      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT.surveyAssessmentChart,
        queryParams: {
          action,
          assessmentID,
          ...(companyID && { companyID }),
          ...(action === "outcome_list_dropdown" && { isIG: false }),
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        // eslint-disable-next-line default-case
        switch (action) {
          case "scalar_configuration":
            setScalarConfiguration(response?.data?.data);
            break;
          case "department_list_dropdown":
            setDepartmentOptions(
              response?.data?.data?.map((dept) => ({
                value: dept.department_id,
                label: dept.department_name,
              }))
            );
            break;
          case "manager_list_dropdown":
            setManagerOptions(
              response?.data?.data?.map((manager) => ({
                value: manager.user_id,
                label: manager.name,
              }))
            );
            break;
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching assessment chart data:", error);
    }
  };

  const fetchDemographicQuestions = async (assessmentID) => {
    try {
      setLoading(true);
      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT.demogarphicQuestionlist,
        queryParams: { assessmentID },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        // console.log("DEMOGRAPHIC QUESTIONS: ", response?.data, assessmentID)
        setDemographicsQuestionListOptions(
          response?.data?.data?.map((item) => ({
            value: item.inter_question_id, // Changed from question_id to inter_question_id
            label: item.question,
            responses: item.responses,
          }))
        );
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching demographic questions:", error);
    }
  };

  const fetchScore = async () => {
    try {
      setLoading(true);
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
        let defaultColor = response?.data?.scalar?.defaultColor[1];
        const colorCodeArray = defaultColor?.colors?.map(
          (item) => item.colorCode
        );
        setColors(colorCodeArray);
            }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching score data:", error);
    }
  };

  const fetchChartOptions = async () => {
    try {
      setLoading(true);
      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT?.getDemographicChartOptions,
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
      setLoading(false);
    } catch (error) {
      console.error("Error fetching score data:", error);
    }
  };

  // Update the company select handler
  const handleCompanyChange = (option) => {
    setSelectedCompanyId(option.value);
    setSelectedSurveyId("");
    setChartData([]);
    setOpenFilter(false);
    fetchSurvey(option.value);
  };

  /**
   * Retrieves a color palette by its paletteID from the provided data structure
   * @param {Object} data - The complete color palette data object
   * @param {string} paletteID - The ID of the palette to retrieve
   * @returns {Object|null} The palette object if found, or null if not found
   */
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

  const fetchDemographicsResponse = async (initialPayload) => {
    const payload = initialPayload || {
      masterCompanyID: userData?.companyMasterID,
      companyID: selectedCompanyId,
      surveyID: parseInt(selectedSurveyId, 10),
      departmentID: selectedDepartment.map((dept) => parseInt(dept.value, 10)),
      type: reporteesType,
      managerID: selectedManager.map((manager) => parseInt(manager.value, 10)),
      question: selectedQuestions.map((question) => parseInt(question.value, 10)),
    };
  
    try {
      setLoading(true);
  
      // Fetch score data first
      const scoreResponse = await commonService({
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
  
      if (!scoreResponse?.status) {
        throw new Error("Failed to fetch scalar data");
      }
  
      const scoreData = scoreResponse?.data?.scalar;
      setScore(scoreData);
  
      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT.demogarphicResponses,
        bodyData: payload,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
  
      if (response?.status) {
        let finalChartData = [];
        let type = [3, 4, 6].includes(response?.data?.data?.chartOptions?.chartType) ? 1 : response?.data?.data?.chartOptions?.chartType;
  
        for (let oneRow of response?.data?.data?.chartData) {
          if (oneRow.responses) {
            oneRow.responses = oneRow.responses.filter(res => res.percentage !== "0.00");
          }
  
          if (oneRow.responses?.length > 0) {
            const colorsData = getPaletteByID(scoreData, oneRow?.chartOptions?.paletteColorID);
  
            oneRow.colors = colorsData;
            oneRow.chartOptions.chartType = type;
            oneRow.colorsArray =scoreResponse?.data?.scalar.defaultColor[1]?.colors?.map(item => item.colorCode);
  
            if (oneRow.chartOptions) {
              oneRow.chartOptions.switchAxis = oneRow.chartOptions.switchAxis === false ? "yAxis" : "xAxis";
              if (oneRow.chartOptions.labelColor) {
                oneRow.chartOptions.lableColor = oneRow.chartOptions.labelColor;
                delete oneRow.chartOptions.labelColor;
              }
            }
  
            finalChartData.push(oneRow);
          }
        }
  
        setChartData(finalChartData);
  
        const globalcolorData = getPaletteByID(scoreData, response?.data?.data?.chartOptions?.paletteColorID);
        setSelectedColorPallet(globalcolorData);
        setChartType(type);
        setLegendPosition(response?.data?.data?.chartOptions?.legend);
        setLabelPosition(response?.data?.data?.chartOptions?.dataLabel);
        setFontSize(response?.data?.data?.chartOptions?.fontSize);
        setLabelColorState(response?.data?.data?.chartOptions?.lableColor || labelColorState);
        setAnnotationOpacity(response?.data?.data?.chartOptions?.scalarOpacity);
        setOpen(true);
      }
  
      setLoading(false);
      setRunLoader(false);
    } catch (error) {
      console.error("Error fetching demographic responses with score:", error);
      setLoading(false);
      setRunLoader(false);
    }
  };
  

  const fetchDemographicsResponseOnClear = async (initialPayload) => {
    
    setClearLoader(true);
    setLoading(true);
    const payload = initialPayload || {
      masterCompanyID: userData?.companyMasterID,
      companyID: selectedCompanyId,
      surveyID: parseInt(selectedSurveyId, 10), // Ensure surveyID is an integer
      departmentID: [], // Ensure departmentID is an integer
      type: "A", // Use the dynamic value for type
      managerID: [], // Ensure managerID is an integer
      question: [], // This now sends inter_question_id
    };

    try {
      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT.demogarphicResponses,
        bodyData: payload,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        let finalChartData = [];
        let type =""
        if(response?.data?.data?.chartOptions?.chartType==3||response?.data?.data?.chartOptions?.chartType==4||response?.data?.data?.chartOptions?.chartType==6){
          type =1
        }else{
          type  = response?.data?.data?.chartOptions?.chartType
        }

        for (let oneRow of response?.data?.data?.chartData) {
          const colorsData = getPaletteByID(
            score,
            oneRow?.chartOptions?.paletteColorID
          );

          oneRow.colors = colorsData;
          oneRow.chartOptions.chartType=type

          const colorCodeArray = colorsData?.colors?.map(
            (item) => item.colorCode
          );
          oneRow.colorsArray = colorCodeArray;
          finalChartData.push(oneRow);
        }

        setChartData(finalChartData); // Store chartData in state

        const globalcolorData = getPaletteByID(
          score,
          response?.data?.data?.chartOptions?.paletteColorID
        );

        setSelectedColorPallet(globalcolorData);
        console.log(globalcolorData,"colrs")

        const globalcolorCodeArray = globalcolorData?.colors?.map(
          (item) => item.colorCode
        );
        // setColors(globalcolorCodeArray);
        setChartType(
          response?.data?.data?.chartOptions?.chartType
        );
        setLegendPosition(
          response?.data?.data?.chartOptions?.legend
        );
        setLabelPosition(
          response?.data?.data?.chartOptions?.dataLabel
        );
        setFontSize(response?.data?.data?.chartOptions?.fontSize);
        setLabelColorState(response?.data?.data?.chartOptions?.lableColor||labelColorState);
        setAnnotationOpacity(response?.data?.data?.chartOptions?.scalarOpacity);
      }

      setClearLoader(false);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching demographic responses:", error);
    }
  };

  useEffect(() => {
    // console.log("demographicsQuestionListOptions", demographicsQuestionListOptions)
  },[demographicsQuestionListOptions])

  const handleSurveyChange = (option) => {
    setSelectedSurveyId(option.value);
    // Clear department and manager selections when assessment changes
    setSelectedDepartment([]);
    setSelectedManager([]);
    setSelectedQuestions([])
    // Fetch required dropdowns when a survey is selected
    fetchAssessmentChart(option.value, "scalar_configuration");
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
    fetchDemographicQuestions(option.value);

    // Call fetchDemographicsResponse with initial empty arrays
    const payload = {
      masterCompanyID: userData?.companyMasterID,
      companyID: selectedCompanyId,
      surveyID: parseInt(option.value, 10),
      departmentID: [],
      type: reporteesType,
      managerID: [],
      question: [],
    };

    // Call the API with initial payload
    fetchDemographicsResponse(payload);
    setOpenFilter(true);
  };

  const handleRunClick = () => {
    setRunLoader(true);
    fetchDemographicsResponse(); // Trigger demographic response fetch on "Run" button click
  };

  useEffect(() => {
    if (userData?.companyMasterID) {
      fetchOptionDetails(
        `company?companyMasterID=${userData?.companyMasterID}`,
        "company"
      );
    }
    fetchScore();
    fetchChartOptions();
  }, [userData,selectedCompanyId]);

  const handleChartColorChange = (colorData) => {
    setSelectedColorPallet(colorData);

    const colorCodeArray = colorData?.colors?.map((item) => item.colorCode);
    setColors(colorCodeArray);
  };

  const handleChartTypeChange = (type) => {
    setChartType(type?.value);
  };

  const handleLegendPosistionChange = (position) => {
    setLegendPosition(position?.value);
  };

  const handleLablePosistionChange = (position) => {
    setLabelPosition(position?.value);
  };

  const handleFontSizeChange = (size) => {
    setFontSize(size?.value);
  };

  const handleSwitchAxisChange = (event) => {
    setSwitchAxis(event.target.checked);
    setLabelPosition("center");
    if (event.target.checked) {
      setDataLabelOptions([
        { value: "center", label: "Center" },
        { value: "none", label: "None" },
      ]);
    } else {
      setDataLabelOptions([
        { value: "top", label: "Top" },
        { value: "bottom", label: "Bottom" },
        { value: "center", label: "Center" },
        { value: "none", label: "None" },
      ]);
    }
  };

  const handleLabelColorChange = (event) => {
    setLabelColorState(event.target.value);
  };

  const handleOpacityChange = (event) => {
    setAnnotationOpacity(event.target.value);
  };

  const handleApplyAll = () => {
    let tempData = [];
    for (let oneRowData of chartData) {
      console.log('oneRowData', oneRowData)
      oneRowData.chartOptions.chartType = chartType;
      oneRowData.chartOptions.dataLabel = labelPosition;
      oneRowData.chartOptions.fontSize = fontSize;
      oneRowData.chartOptions.lableColor = labelColorState;
      oneRowData.chartOptions.legend = legendPosition;
      oneRowData.chartOptions.scalarOpacity = annotationOpacity;
      oneRowData.chartOptions.switchAxis = switchAxis ? "xAxis" : "yAxis";
      oneRowData.colors = selectedColorPallet;
      const colorCodeArray = selectedColorPallet?.colors?.map(
        (item) => item.colorCode
      );
      oneRowData.colorsArray = colors
      tempData.push(oneRowData);
    }

    setRenderChart((prev) => !prev);
    setRenderScalar((prev) => !prev);
    setChartData(tempData);
  };

  const handleChartTypeChangeChild = (value, index) => {
    const tempData = [...chartData];
    const oneRowData = { ...tempData[index] }; // create a shallow copy if needed
    oneRowData.chartOptions.chartType = value?.value;

    tempData[index] = oneRowData;

    setChartData(tempData);
  };

  const handleLegendPositionChangeChild = (value, index) => {
    const tempData = [...chartData];
    const oneRowData = { ...tempData[index] }; // create a shallow copy if needed
    oneRowData.chartOptions.legend = value?.value;
    tempData[index] = oneRowData;
    setChartData(tempData);
  };

  const handleLablePosistionChangeChild = (value, index) => {
    const tempData = [...chartData];
    const oneRowData = { ...tempData[index] }; // create a shallow copy if needed
    oneRowData.chartOptions.dataLabel = value?.value;
    tempData[index] = oneRowData;
    setChartData(tempData);
  };

  const handleFontSizeChangeChild = (value, index) => {
    const tempData = [...chartData];
    const oneRowData = { ...tempData[index] }; // create a shallow copy if needed
    oneRowData.chartOptions.fontSize = value?.value;
    tempData[index] = oneRowData;
    setChartData(tempData);
  };

  const handleSwitchAxisChangeChild = (value, index) => {
    const tempData = [...chartData];
    const oneRowData = { ...tempData[index] }; // create a shallow copy if needed
    oneRowData.chartOptions.switchAxis = value ? "yAxis" : "xAxis";

    tempData[index] = oneRowData;
    setChartData(tempData);
  };

  const handleLabelColorChangeChild = (value, index) => {
    const tempData = [...chartData];
    const oneRowData = { ...tempData[index] }; // create a shallow copy if needed
    oneRowData.chartOptions.lableColor = value;
    tempData[index] = oneRowData;
    setChartData(tempData);
  };

  const handlehandleOpacityChangeChild = (value, index) => {
    const tempData = [...chartData];
    const oneRowData = { ...tempData[index] }; // create a shallow copy if needed
    oneRowData.chartOptions.scalarOpacity = value;

    tempData[index] = oneRowData;
    setChartData(tempData);
  };

  const handleChartColorChangeChild = (value, index) => {
    const tempData = [...chartData];
    const oneRowData = { ...tempData[index] }; // create a shallow copy if needed
    oneRowData.colors = value;
    const colorCodeArray = value?.colors?.map((item) => item.colorCode);
    oneRowData.colorsArray = colorCodeArray;
    tempData[index] = oneRowData;
    setChartData(tempData);
    setRenderChart((prev) => !prev);
  };

  // Add this new function before the return statement
  const handleSaveReport = async () => {
  //  return console.log("SWITCH AXIS: ", switchAxis,selectedColorPallet,labelColorState)
    try {
      setLoading(true);
      const payload = {
        masterCompanyID: userData?.companyMasterID,
        companyID: selectedCompanyId,
        surveyID: parseInt(selectedSurveyId, 10),
        openingComment,
        closingComment,
        reportName,
        chartData: {
          chartOptions: {
            chartType,
            legend: legendPosition,
            switchAxis: switchAxis ? "xAxis" : "yAxis",
            scalarOpacity: parseInt(annotationOpacity)||0,
            fontSize,
            lableColor: "#ffffff",
            paletteColorID: parseInt((selectedColorPallet?.colorPaletteID||selectedColorPallet?.paletteID), 10),
          },
          chartData,
        },
      };

      console.log("payload", payload)

      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT.demogarphicReportSave,
        bodyData: payload,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        saveDemoTrendReportClose();
        setReportName('')
        // Add success notification here if needed
        toast.success("Dynamic Filter report saved successfully")
      }
      setLoading(false);
    } catch (error) {
      console.error("Error saving demographic report:", error);
      setLoading(false);
      // Add error notification here if needed
    }
  };

  const handlePreview = () => {
    localStorage.setItem("filtersData", JSON.stringify(filtersData));
    localStorage.setItem("sharedData", JSON.stringify(chartData));
    localStorage.setItem("sclarData", JSON.stringify(scalarConfiguration));
    localStorage.setItem("reportName", JSON.stringify(reportName));
    localStorage.setItem("openingComment", JSON.stringify(openingComment));
    localStorage.setItem("closingComment", JSON.stringify(closingComment));
    localStorage.setItem("chartTypeOptions", JSON.stringify(chartTypeOptions));
    localStorage.setItem("legendOptions", JSON.stringify(legendOptions));
    localStorage.setItem("dataLabelOptions", JSON.stringify(dataLabelOptions));
    localStorage.setItem("fontSizeOptions", JSON.stringify(fontSizeOptions));

    window.open("/preview-demographic-trend-analysis", "_blank");
  };

  const handleClear = () => {
    setSelectedDepartment([]);
    setSelectedManager([]);
    setSelectedQuestions([]);
    setReporteesType("A");
    fetchDemographicsResponseOnClear();
  };

  return (
    <>
      {/* head title start */}
      <section className="commonHead">
        <h1 className="commonHead_title">Welcome Back!</h1>
        <Breadcrumb breadcrumb={breadcrumb} />
      </section>
      {/* head title end */}
      <div className="pageContent demographicAnalysis">
        <div className="analyticsCollapse">
          <button
            type="button"
            className="analyticsCollapse_Header"
            onClick={() => setTrendOpen(!trendOpen)}
            aria-controls="demographicTrend"
            aria-expanded={trendOpen}
          >
            {" "}
            <span className="me-2">
              {" "}
              Analytics: Demographic Trend Analysis{" "}
            </span>{" "}
            <em className="icon-drop-down" />{" "}
          </button>
          <Collapse in={trendOpen}>
            <div id="demographicTrend">
              <Form>
                <div className="demographicFilter d-flex align-items-end">
                  <div className="demographicFilter_inner d-flex align-items-end">
                    <div className="companySelect">
                      <Form.Group className="form-group mb-0">
                        <Form.Label>
                          Company Name <sup>*</sup>
                        </Form.Label>
                        <SelectField
                          placeholder="Company Name"
                          options={companyOptions}
                          onChange={handleCompanyChange}
                        />
                      </Form.Group>
                    </div>
                    <div className="assessmentSelect">
                      <Form.Group className="form-group mb-0">
                        <Form.Label>
                          Assessment Name <sup>*</sup>
                        </Form.Label>
                        <SelectField
                          placeholder="Survey Name"
                          options={surveyOptions}
                          isDisabled={!selectedCompanyId}
                          onChange={handleSurveyChange} // Attach the handler
                          value={
                            surveyOptions.find(
                              (option) => option.value === selectedSurveyId
                            ) || null
                          }
                        />
                      </Form.Group>
                    </div>
                    <div className="d-flex">
                      <Button
                        className="chartOptionBtn ripple-effect"
                        onClick={() => setOpenFilter(!openFilter)}
                        aria-controls="default-chart-collapse"
                        aria-expanded={openFilter}
                        disabled={!selectedCompanyId || !selectedSurveyId}
                      >
                        {" "}
                        <span className="me-2">Filter </span>{" "}
                        <em className="icon-drop-down" />{" "}
                      </Button>
                    </div>
                  </div>
                  <div className="defaultChart d-flex justify-content-end">
                    <Button
                      type="button"
                      varient="primary"
                      className="ripple-effect"
                      onClick={saveDemoTrendReportShow}
                      disabled={!selectedCompanyId || !selectedSurveyId}
                    >
                      Save Report
                    </Button>
                  </div>
                </div>
                <Collapse in={openFilter}>
                  <div id="default-chart-collapse">
                    <div className="optionCollapse optionCollapseFilter mt-xl-4 mt-3">
                      <span className="borderArrow" />
                      <div className="optionCollapse_inner">
                        <Row className="gx-2 gy-md-3 gy-2 row mb-2">
                          <Col lg={3} sm={6}>
                          </Col>
                        </Row>

                        <Row className="gx-2 gy-md-3 gy-2 row">
  <Col lg={6} sm={6}>
    <Form.Group className="form-group mb-0">
      <Form.Label>Department</Form.Label>
      <SelectWithActions
        placeholder="Select Department"
        options={departmentOptions}
        isMulti
        onChange={(selected) => setSelectedDepartment(selected || [])}
        value={selectedDepartment || []}
        handleClearAll={() => setSelectedDepartment([])}
        handleSelectAll={() => setSelectedDepartment(departmentOptions)}
      />
    </Form.Group>
  </Col>

  <Col lg={6} sm={6}>
        <Form.Group className="form-group">
          <Form.Label className="d-flex gap-2 align-items-center w-100">
            Managers
            <div
              className="btn-group toggle-switch"
              role="group"
              aria-label="Manager Reportees Toggle"
              style={{
                marginTop: window.innerWidth > 768 ? -12 : 0,
                marginLeft: "auto",
              }}
            >
              <button
                type="button"
                className={`btn btn-xs px-2 py-1  ${
                  reporteesType === "A"
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                style={{ fontSize: "12px", height: "24px" }}
                onClick={() =>setReporteesType("A")}
              >
                All
              </button>
              <button
                type="button"
                className={`btn btn-xs px-2 py-1  ${
                  reporteesType === "D"
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                style={{ fontSize: "12px", height: "24px" }}
                onClick={() => setReporteesType("D")}
              >
                Direct
              </button>
            </div>
          </Form.Label>
          <SelectWithActions
            placeholder="Select Manager"
            isMulti
            options={managerOptions}
            onChange={(selected) => setSelectedManager(selected || [])}
            value={selectedManager || []}
            handleClearAll={() => setSelectedManager([])}
            handleSelectAll={() => setSelectedManager(managerOptions)}
          />
        </Form.Group>
      </Col>

  {selectedManager?.length>0&&
  <Col lg={2} sm={6}>
    <Form.Group className="form-group mb-0">
      <Form.Label className="mb-2">Manager Reportees</Form.Label>
      <div className="onlyradio flex-wrap ms-xl-2">
        <Form.Check
          inline
          label="All"
          name="reportees"
          type="radio"
          id="all"
          value="A"
          className="mb-0"
          defaultChecked
          onChange={(e) => setReporteesType(e.target.value)}
          checked={reporteesType === "A"}
        />
        <Form.Check
          inline
          label="Direct"
          name="reportees"
          type="radio"
          id="direct"
          value="D"
          className="mb-0"
          onChange={(e) => setReporteesType(e.target.value)}
          checked={reporteesType === "D"}
        />
      </div>
    </Form.Group>
  </Col>}
  <Col lg={12} sm={12}>
                            <Form.Group className="form-group mb-0">
                              <Form.Label>Demographic Question List</Form.Label>
                              <SelectWithActions
                                placeholder="Select Demographic Question List"
                                isMulti
                                options={demographicsQuestionListOptions}
                                onChange={(selected) =>
                                  setSelectedQuestions(selected || [])
                                }
                                value={selectedQuestions || []}
                                handleSelectAll={()=>setSelectedQuestions(demographicsQuestionListOptions)}
                                handleClearAll={()=>setSelectedQuestions([])}
                              />
                            </Form.Group>
                          </Col>
</Row>

                     
                        <div className="d-flex justify-content-end gap-2 mt-3">
                          <Button
                            className="chartOptionBtn ripple-effect"
                            onClick={() => setOpen(!open)}
                            aria-controls="default-chart-collapse"
                            aria-expanded={open}
                            disabled={!selectedCompanyId || !selectedSurveyId}
                          >
                            {" "}
                            <span className="me-2"> Default Chart Options </span>{" "}
                            <em className="icon-drop-down" />{" "}
                          </Button>
                          <Button
                            variant="secondary"
                            className="ripple-effect"
                            onClick={handleClear}
                          >
                            {" "}
                            {clearLoader ? (
                              <Spinner
                                animation="border"
                                size="sm"
                                className="me-2"
                              />
                            ) : (
                              <em className="icon-clear" />
                            )}
                            <span className="ms-2">Clear</span>
                          </Button>
                          <Button
                            varient="primary"
                            className="ripple-effect"
                            onClick={handleRunClick}
                          >
                            {runLoader ? (
                              <Spinner
                                animation="border"
                                size="sm"
                                className="me-2"
                              />
                            ) : (
                              <em className="icon-run" />
                            )}
                            <span className="ms-2">Run</span>{" "}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Collapse>
                <Collapse in={open}>
                  <div id="default-chart-collapse">
                    <div className="optionCollapse mt-xl-4 mt-3 p-0">
                      <span className="borderArrow" />
                      <div className="optionCollapse_inner">
                        <ChartOptions
                          score={score}
                          onColorChange={handleChartColorChange}
                          handleChartTypeChange={handleChartTypeChange}
                          chartTypeOptions={chartTypeOptions}
                          legendOptions={legendOptions}
                          dataLabelOptions={dataLabelOptions}
                          fontSizeOptions={fontSizeOptions}
                          chartType={chartType}
                          handleLegendPosistionChange={
                            handleLegendPosistionChange
                          }
                          legendPosition={legendPosition}
                          handleLablePosistionChange={
                            handleLablePosistionChange
                          }
                          labelPosition={labelPosition}
                          handleFontSizeChange={handleFontSizeChange}
                          fontSize={fontSize}
                          handleSwitchAxisChange={handleSwitchAxisChange}
                          switchAxis={false}
                          handleLabelColorChange={handleLabelColorChange}
                          labelColorState={labelColorState}
                          handleOpacityChange={handleOpacityChange}
                          annotationOpacity={annotationOpacity}
                          showApllyAll
                          handleApplyAll={handleApplyAll}
                          selectedColorPallet={selectedColorPallet}
                          switchAxixButtonShow={false}
                        />
                      </div>
                    </div>
                  </div>
                </Collapse>
              </Form>
            </div>
          </Collapse>
        </div>

        {loading ? (
          <Loader />
        ) : (
          chartData?.length > 0 && (
            <div className="demographicAnalysis_Body">
              <div>
                <div className="responseBox d-flex">
                  <div className="responseBox_left">
                    <h3 className="responseBox_title mb-0">Question</h3>
                  </div>
                  <div className="responseBox_right">
                    <div className="d-flex align-items-center justify-content-between">
                      <h3 className="responseBox_title mb-0">Response</h3>
                    </div>
                  </div>
                </div>
                <CollapseAge
                  colorCollpaseShow={colorCollpaseShow.ageColorCollapse}
                  toggleCollapse={() => toggleCollapse("ageColorCollapse")}
                  score={score}
                  chartData={chartData} // Pass chartData as a prop
                  scalarConfiguration={scalarConfiguration}
                  colorsChart={colors}
                  renderChart={renderChart}
                  showNegative={false}
                  chartTypeOptions={chartTypeOptions}
                  legendOptions={legendOptions}
                  dataLabelOptions={dataLabelOptions}
                  fontSizeOptions={fontSizeOptions}
                  handleChartTypeChange={handleChartTypeChangeChild}
                  handleLegendPositionChange={handleLegendPositionChangeChild}
                  handleLablePosistionChange={handleLablePosistionChangeChild}
                  handleFontSizeChange={handleFontSizeChangeChild}
                  handleSwitchAxisChange={handleSwitchAxisChangeChild}
                  handleLabelColorChange={handleLabelColorChangeChild}
                  handleOpacityChange={handlehandleOpacityChangeChild}
                  handleChartColorChange={handleChartColorChangeChild}
                  renderScalar={renderScalar}
                  loading={loading}
                />
              </div>
            </div>
          )
        )}
      </div>
      {saveDemoTrendReport ? (
        <CreateDatasetModal
          show={saveDemoTrendReport}
          onClose={saveDemoTrendReportClose}
          reportName={reportName}
          setReportName={setReportName}
          openingComment={openingComment}
          setOpeningComment={setOpeningComment}
          closingComment={closingComment}
          setClosingComment={setClosingComment}
          handlePreview={handlePreview}
          handleSaveReport={handleSaveReport}
        />
      ) : (
        ""
      )}
    </>
  );
}

import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import toast from "react-hot-toast";
import {
  Form,
  OverlayTrigger,
  Tooltip,
  Accordion,
  Button,
  Row,
  Col,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import Chart from "react-apexcharts";
import { SURVEYS_MANAGEMENT } from "apiEndpoints/SurveysManagement";
import { commonService } from "services/common.service";
import {
  InputField,
  ColorPellates,
  TextEditor,
  SelectField,
  RangeSlider,
  ModalComponent,
} from "../../../../../../components";
import PreviewModal from "../ModelComponent/PreviewModel";
import { chartsOptions } from "../../../Constants/ChartsConstant";
import ScatterChart from "pages/Admin/Surveys/Charts/ScatterChart";
import LineChart from "pages/Admin/Surveys/Charts/LineChart";
import ColumnChart from "pages/Admin/Surveys/Charts/ColumnChart";
import SpiderChart from "pages/Admin/Surveys/Charts/SpiderChart";
import BarChart from "pages/Admin/Surveys/Charts/BarChart";

const ScalarConfiguration = (
  {
    score,
    chartTypeOptions,
    legendOptions,
    fontSizeOptions,
    dataLabelOptions,
    userData,
    companyID,
  },
  ref
) => {
  const [scalarConfiguration, setScalarConfiguration] = useState([]);

  // const chartsOptionCopy = {
  //   column: chartsOptions.columnOptions,
  //   bar: chartsOptions.barOptions,
  //   line: chartsOptions.lineOptions,
  //   radar: chartsOptions.spiderOptions,
  //   scatter: chartsOptions.scatterOptions,
  // }

  const [RSChartColor, setRSChartColor] = useState([
    "#FF4D4D",
    "#FFD700",
    "#32CD32",
  ]);
  const [PDChartColor, setPDChartColor] = useState([
    "#FF4D4D",
    "#FFD700",
    "#32CD32",
  ]);

  const isEditPage = true;
  const ignoreCurrentDefault = true;

  const [renderChartsOptionsRS, setRenderChartsOptionsRS] = useState({
    column: chartsOptions.columnOptions,
    bar: chartsOptions.barOptions,
    line: chartsOptions.lineOptions,
    radar: chartsOptions.spiderOptions,
    scatter: chartsOptions.scatterOptions,
  });

  const [renderChartsOptionsRD, setRenderChartsOptionsRD] = useState({
    column: chartsOptions.columnOptions,
    bar: chartsOptions.barOptions,
    line: chartsOptions.lineOptions,
    radar: chartsOptions.spiderOptions,
    scatter: chartsOptions.scatterOptions,
  });

  const switchAxisData = {
    dataTypeOne: {
      xaxisCategory: ["Overall", "User 1", "User 2"],
      data: [
        {
          name: "Outcome 1",
          data: [40, 40, 40],
          zIndex: 10,
        },
        {
          name: "Outcome 2",
          data: [30, 30, 30],
          zIndex: 10,
        },
        {
          name: "Outcome 3",
          data: [30, 30, 30],
          zIndex: 10,
        },
      ],
    },
    dataTypeTwo: {
      xaxisCategory: ["Outcome 1", "Outcome 2", "Outcome 3"],
      data: [
        {
          name: "Overall",
          data: [40, 40, 40],
          zIndex: 10,
        },
        {
          name: "User 1",
          data: [30, 30, 30],
          zIndex: 10,
        },
        {
          name: "User 2",
          data: [30, 30, 30],
          zIndex: 10,
        },
      ],
    },
  };

  const scatterRenderDataTypes = {
    dataTypeOne: [
      {
        name: "Outcome A",
        data: [
          { x: "Overall", y: 40 },
          { x: "User 1", y: 50 },
          { x: "User 2", y: 70 },
        ],
      },
      {
        name: "Outcome B",
        data: [
          { x: "Overall", y: 30 },
          { x: "User 1", y: 60 },
          { x: "User 2", y: 90 },
        ],
      },
      {
        name: "Outcome C",
        data: [
          { x: "Overall", y: 30 },
          { x: "User 1", y: 60 },
          { x: "User 2", y: 90 },
        ],
      },
    ],
    dataTypeTwo: [
      {
        name: "Overall",
        data: [
          { x: "Outcome A", y: 40 },
          { x: "Outcome B", y: 50 },
          { x: "Outcome C", y: 70 },
        ],
      },
      {
        name: "User 1",
        data: [
          { x: "Outcome A", y: 30 },
          { x: "Outcome B", y: 60 },
          { x: "Outcome C", y: 90 },
        ],
      },
      {
        name: "User 2",
        data: [
          { x: "Outcome A", y: 30 },
          { x: "Outcome B", y: 60 },
          { x: "Outcome C", y: 90 },
        ],
      },
    ],
  };

  const [scatterDataRender, setScatterDataRender] = useState([
    {
      name: "Outcome A",
      data: [
        { x: "Overall", y: 40 },
        { x: "User 1", y: 50 },
        { x: "User 2", y: 70 },
      ],
    },
    {
      name: "Outcome B",
      data: [
        { x: "Overall", y: 30 },
        { x: "User 1", y: 60 },
        { x: "User 2", y: 90 },
      ],
    },
    {
      name: "Outcome C",
      data: [
        { x: "Overall", y: 30 },
        { x: "User 1", y: 60 },
        { x: "User 2", y: 90 },
      ],
    },
  ]);

  const [scatterDataRenderRD, setScatterDataRenderRD] = useState([
    {
      name: "Outcome A",
      data: [
        { x: "Overall", y: 40 },
        { x: "User 1", y: 50 },
        { x: "User 2", y: 70 },
      ],
    },
    {
      name: "Outcome B",
      data: [
        { x: "Overall", y: 30 },
        { x: "User 1", y: 60 },
        { x: "User 2", y: 90 },
      ],
    },
    {
      name: "Outcome C",
      data: [
        { x: "Overall", y: 30 },
        { x: "User 1", y: 60 },
        { x: "User 2", y: 90 },
      ],
    },
  ]);

  const [formData, setFormData] = useState({
    summary_report_name: "",
    summary_opening_comment: "",
    summary_closing_comment: "",
    detail_report_name: "",
    report_detail_opening_comment: "",
    report_detail_closing_comment: "",
    summary_chart_type: { value: "bar", label: "Bar" },

    summary_legend_position: { value: "left", label: "Left" },
    summary_font_size: { value: 8, label: "8" },
    summary_data_label: { value: "top", label: "Top" },
    summary_scalar_opacity: 0.1,
    summary_switch_axis: false,
    summary_db_color: "#000000",
    detail_chart_type: { value: "bar", label: "Bar" },
    detail_legend_position: { value: "left", label: "Left" },
    detail_font_size: { value: 8, label: "8" },
    detail_data_label: { value: "top", label: "Top" },
    detail_scalar_opacity: 0.1,
    detail_switch_axis: false,
    detail_db_color: "#000000",
    summaryColorPaletteID: "9",
    detailedColorPaletteID: "9",
  });

  const [summaryOptionsDetails, setSummaryOptionsDetails] = useState({
    chart: {
      type: formData?.summary_chart_type?.value,
      height: 350,
      toolbar: {
        show: false,
      },
      stacked: false,
    },
    markers: {
      size: 16,
      shape: "circle",
      hover: {
        size: 24,
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "solid",
      opacity: 1,
    },
    plotOptions: {
      bar: {
        dataLabels: {
          position: "top",
        },
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    colors: ["#FF4D4D", "#FFD700", "#32CD32"],
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "12px",
        colors: ["#000"],
      },
    },
    xaxis: {
      categories: ["Overall", "User 1", "User 2"],
      labels: {
        style: {
          fontSize: "14px",
        },
      },
    },
    yaxis: {
      max: 100,
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    grid: {
      show: false,
    },
    annotations: {
      yaxis: [
        {
          y: 0,
          y2: 40,
          borderColor: "#FFECEC",
          fillColor: "#FFECEC",
          opacity: 0.1,
          label: {
            text: "Very Low",
            position: "right",
            style: {
              color: "#FF4D4D",
              background: "none",
              fontSize: "14px",
            },
          },
        },
        {
          y: 40,
          y2: 60,
          borderColor: "#FFF9E5",
          fillColor: "#FFF9E5",
          opacity: 0.1,
          label: {
            text: "Low",
            position: "right",
            style: {
              color: "#FFD700",
              background: "none",
              fontSize: "14px",
            },
          },
        },
        {
          y: 60,
          y2: 80,
          borderColor: "#F1FFE5",
          fillColor: "#F1FFE5",
          opacity: 0.1,
          label: {
            text: "Average",
            position: "right",
            style: {
              color: "#32CD32",
              background: "none",
              fontSize: "14px",
            },
          },
        },
        {
          y: 80,
          y2: 100,
          borderColor: "#E6FFCC",
          fillColor: "#E6FFCC",
          opacity: 0.1,
          label: {
            text: "High",
            position: "right",
            style: {
              color: "#228B22",
              background: "none",
              fontSize: "14px",
            },
          },
        },
      ],
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      labels: {
        colors: ["#000"],
      },
    },
  });

  const [swappedSummaryOptionsDetails, setSwappedSummaryOptionsDetails] =
    useState({
      ...summaryOptionsDetails,
      plotOptions: {
        ...summaryOptionsDetails.plotOptions,
        bar: {
          ...summaryOptionsDetails.plotOptions.bar,
          horizontal: true,
        },
      },
      colors: ["#FF4D4D", "#FFD700", "#32CD32"],
      annotations: {
        xaxis: [
          {
            x: 0,
            x2: 40,
            borderColor: "#FFECEC",
            fillColor: "#FFECEC",
            opacity: 0.1,
            label: {
              text: "Very Low",
              position: "left",
              style: {
                color: "#FF4D4D",
                background: "none",
                fontSize: "14px",
              },
            },
          },
          {
            x: 40,
            x2: 60,
            borderColor: "#FFF9E5",
            fillColor: "#FFF9E5",
            opacity: 0.1,
            label: {
              text: "Low",
              position: "left",
              style: {
                color: "#FFD700",
                background: "none",
                fontSize: "14px",
              },
            },
          },
          {
            x: 60,
            x2: 80,
            borderColor: "#F1FFE5",
            fillColor: "#F1FFE5",
            opacity: 0.1,
            label: {
              text: "Average",
              position: "left",
              style: {
                color: "#32CD32",
                background: "none",
                fontSize: "14px",
              },
            },
          },
          {
            x: 80,
            x2: 100,
            borderColor: "#E6FFCC",
            fillColor: "blue",
            opacity: 0.1,
            label: {
              text: "High",
              position: "left",
              style: {
                color: "#228B22",
                background: "none",
                fontSize: "14px",
              },
            },
          },
        ],
      },
    });

  const [detailOptionsDetails, setDetailOptionsDetails] = useState({
    ...summaryOptionsDetails, // Copy initial structure from summary
    chart: {
      ...summaryOptionsDetails.chart,
      height: 600,
      type: formData?.detail_chart_type?.value,
    },
  });

  const [swappedDetailOptionsDetails, setSwappedDetailOptionsDetails] =
    useState({
      ...swappedSummaryOptionsDetails,
      chart: {
        ...swappedSummaryOptionsDetails.chart,
        height: 600,
        type: formData?.detail_chart_type?.value,
      },
    });

  const [summaySeriesData, setSummarySeriesData] = useState([
    {
      name: "Outcome 1",
      data: [40, 40, 40],
      zIndex: 10,
    },
    {
      name: "Outcome 2",
      data: [30, 30, 30],
      zIndex: 10,
    },
    {
      name: "Outcome 3",
      data: [30, 30, 30],
      zIndex: 10,
    },
  ]);

  const [summaySeriesDataRD, setSummarySeriesDataRD] = useState([
    {
      name: "Outcome 1",
      data: [40, 40, 40],
      zIndex: 10,
    },
    {
      name: "Outcome 2",
      data: [30, 30, 30],
      zIndex: 10,
    },
    {
      name: "Outcome 3",
      data: [30, 30, 30],
      zIndex: 10,
    },
  ]);
  const [showPreview, setshowPreview] = useState(false);
  // This is for current color pallet.
  const [currentColorPallet, setCurrentColorPallet] = useState({
    colorPaletteID: "",
    colors: [],
  });

  const [summaryColorPallet, setSummaryColorPallet] = useState({
    colorPaletteID: "",
    colors: [],
  });

  const [detailColorPallet, setDetailColorPallet] = useState({
    colorPaletteID: "",
    colors: [],
  });

  const [activeKey, setActiveKey] = useState("0");
  const [survey, setSurvey] = useState([]);
  const [surveyID, setSurveyID] = useState("");
  const [reportID, setReportID] = useState("");
  const [reportType, setReportType] = useState("");

  const [report, setReport] = useState([]);
  const [copyOpeningComment, setcopyOpeningComment] = useState("");
  const [copyClosingComment, setcopyClosingComment] = useState("");

  // copy comment modal
  const [showCopyComment, setShowCopyComment] = useState(false);
  const copyCommentClose = () => {
    setReport([]);
    setReportID("");
    setcopyOpeningComment("");
    setcopyClosingComment("");
    setSurveyID("");
    setShowCopyComment(false);
  };

  const copyCommentShow = (reportTypeData) => {
    setShowCopyComment(true);
    setReportType(reportTypeData);
  };

  const handleAccordionSelect = (key) => {
    setActiveKey(key); // Update the active key based on user's interaction
  };

  const fetchScalarSurvey = async () => {
    const response = await commonService({
      apiEndPoint: SURVEYS_MANAGEMENT.getSurveyScalar,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });
    if (response?.status) {
      if (response?.data?.scalar.length > 0) {
        let scalars = [];
        for (let iteratedData of response?.data?.scalar) {
          let scalarObj = {
            scalar_id: iteratedData?.scalarID,
            add_scalar_sequence: iteratedData?.scalarSequence,
            add_scalar_name: iteratedData?.scalarName,
            add_scalar_min_value: iteratedData?.scalarMinValue,
            add_scalar_max_value: iteratedData?.scalarMaxValue,
            add_scalar_color: iteratedData?.scalarColor,
          };
          scalars.push(scalarObj);
        }
        setScalarConfiguration(scalars);
      }
    } else {
      console.log("error");
    }
  };

  const fetchSurvey = async () => {
    const response = await commonService({
      apiEndPoint: SURVEYS_MANAGEMENT.getSurvey,
      queryParams: {
        companyID,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });
    if (response?.status) {
      setSurvey(
        response?.data?.data?.map((company) => ({
          value: company?.surveyID,
          label: company?.surveyName,
        }))
      );
    } else {
      console.log("error");
    }
  };

  const fetchReport = async (surveyData) => {
    const response = await commonService({
      apiEndPoint: SURVEYS_MANAGEMENT.getReport,
      queryParams: { surveyID: surveyData, reportType },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });
    if (response?.status) {
      if (response?.data?.reports?.length > 0) {
        setReport(
          response?.data?.reports?.map((reportData) => ({
            value: reportData?.reportID,
            label: reportData?.reportName,
          }))
        );
      } else {
        setReport([]);
        setReportID("");
      }
    } else {
      console.log("error");
      setReport([]);
      setReportID("");
    }
  };

  const fetchReportSummary = async (reportData) => {
    const response = await commonService({
      apiEndPoint: SURVEYS_MANAGEMENT.getReportSummary,
      queryParams: { reportID: reportData },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });
    if (response?.status) {
      setcopyOpeningComment(response?.data?.openingComment);
      setcopyClosingComment(response?.data?.closingComment);
    } else {
      console.log("error");
    }
  };

  const fetchDefaultChartDetails = async () => {
    const response = await commonService({
      apiEndPoint: SURVEYS_MANAGEMENT.getChart,
      queryParams: {
        companyMasterID: userData?.companyMasterID,
        companyID: companyID ?? "",
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });
    if (response?.status) {
      if (response?.data?.data) {
        const receivedData = response?.data?.data;
        const selectedChartType = chartTypeOptions.find(
          (ele) => ele.refValue === receivedData?.chartType
        ) ?? { value: "bar", label: "Bar" };
        const selectedLegend = legendOptions.find(
          (ele) => ele.refValue === receivedData?.legend
        ) ?? { value: "left", label: "Left" };
        const selectedFontsize = fontSizeOptions.find(
          (ele) => ele.refValue === receivedData?.fontSize
        ) ?? { value: 8, label: "8" };
        const selectedPaletteColor =
          typeof receivedData?.paletteColorID === "number"
            ? receivedData?.paletteColorID.toString()
            : "9";
        const selectedScalarOpacity =
          typeof receivedData?.scalarOpacity === "number"
            ? receivedData?.scalarOpacity
            : 1;

        setFormData((prev) => ({
          ...prev,
          summary_chart_type: selectedChartType,
          summary_legend_position: selectedLegend,
          summary_font_size: selectedFontsize,
          summary_switch_axis: receivedData.switchAxis,
          summary_db_color: receivedData?.labelColor ?? "#000000",
          detail_chart_type: selectedChartType,
          detail_legend_position: selectedLegend,
          detail_font_size: selectedFontsize,
          detail_switch_axis: receivedData.switchAxis,
          detail_db_color: receivedData?.labelColor ?? "#000000",
          summaryColorPaletteID: selectedPaletteColor,
          detailedColorPaletteID: selectedPaletteColor,
          summary_scalar_opacity: selectedScalarOpacity,
          detail_scalar_opacity: selectedScalarOpacity,
        }));
      }
    } else {
      console.log("error");
    }
  };
  useEffect(() => {
    fetchDefaultChartDetails();
  }, [companyID]);

  useEffect(() => {
    if (companyID) {
      fetchScalarSurvey();
      fetchSurvey();
    }
  }, [companyID]);

  useEffect(() => {
    if (score?.defaultColor) {
      setCurrentColorPallet({
        colorPaletteID: score?.defaultColor[0]?.PaletteID,
        colors: score?.defaultColor[0]?.colors,
      });

      setSummaryColorPallet({
        colorPaletteID: score?.defaultColor[0]?.PaletteID,
        colors: score?.defaultColor[0]?.colors,
      });
      // find the three color shown for outcomes . because we only showing three outcomes for sample.
      // eslint-disable-next-line no-use-before-define
      const returnColors = getColorCodes(score?.defaultColor[0]?.colors ?? []);
      // update data colors summary graph , because here we set default summary color pallets.
      // eslint-disable-next-line no-use-before-define
      updateDataColorsSummaryGraph(returnColors);

      setDetailColorPallet({
        colorPaletteID: score?.defaultColor[0]?.PaletteID,
        colors: score?.defaultColor[0]?.colors,
      });
    }
  }, [score]);

  const [errors, setErrors] = useState([]);

  // Handler to update the form data

  const handleTextAditor = (value, name) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const switchAxisReportSummary = (switchAxis, type) => {
    if (type === "RS") {
      if (switchAxis) {
        setRenderChartsOptionsRS((prev) => ({
          ...prev,
          column: {
            ...prev.column,
            xaxis: {
              ...prev.column.xaxis,
              categories: switchAxisData.dataTypeTwo.xaxisCategory,
            },
          },
          bar: {
            ...prev.bar,
            xaxis: {
              ...prev.bar.xaxis,
              categories: switchAxisData.dataTypeTwo.xaxisCategory,
            },
          },
          line: {
            ...prev.line,
            xaxis: {
              ...prev.line.xaxis,
              categories: switchAxisData.dataTypeTwo.xaxisCategory,
            },
          },
          radar: {
            ...prev.radar,
            xaxis: {
              ...prev.radar.xaxis,
              categories: switchAxisData.dataTypeTwo.xaxisCategory,
            },
          },
          scatter: {
            ...prev.scatter,
            xaxis: {
              ...prev.scatter.xaxis,
              categories: switchAxisData.dataTypeTwo.xaxisCategory,
            },
          },
        }));
        setSummarySeriesData(switchAxisData.dataTypeTwo.data);
        setScatterDataRender(scatterRenderDataTypes.dataTypeTwo);
      } else {
        setRenderChartsOptionsRS((prev) => ({
          ...prev,
          column: {
            ...prev.column,
            xaxis: {
              ...prev.column.xaxis,
              categories: switchAxisData.dataTypeOne.xaxisCategory,
            },
          },
          bar: {
            ...prev.bar,
            xaxis: {
              ...prev.bar.xaxis,
              categories: switchAxisData.dataTypeOne.xaxisCategory,
            },
          },
          line: {
            ...prev.line,
            xaxis: {
              ...prev.line.xaxis,
              categories: switchAxisData.dataTypeOne.xaxisCategory,
            },
          },
          radar: {
            ...prev.radar,
            xaxis: {
              ...prev.radar.xaxis,
              categories: switchAxisData.dataTypeOne.xaxisCategory,
            },
          },
          scatter: {
            ...prev.scatter,
            xaxis: {
              ...prev.scatter.xaxis,
              categories: switchAxisData.dataTypeOne.xaxisCategory,
            },
          },
        }));
        setSummarySeriesData(switchAxisData.dataTypeOne.data);
        setScatterDataRender(scatterRenderDataTypes.dataTypeOne);
      }
    } else if (type === "RD") {
      if (switchAxis) {
        setRenderChartsOptionsRD((prev) => ({
          ...prev,
          column: {
            ...prev.column,
            xaxis: {
              ...prev.column.xaxis,
              categories: switchAxisData.dataTypeTwo.xaxisCategory,
            },
          },
          bar: {
            ...prev.bar,
            xaxis: {
              ...prev.bar.xaxis,
              categories: switchAxisData.dataTypeTwo.xaxisCategory,
            },
          },
          line: {
            ...prev.line,
            xaxis: {
              ...prev.line.xaxis,
              categories: switchAxisData.dataTypeTwo.xaxisCategory,
            },
          },
          radar: {
            ...prev.radar,
            xaxis: {
              ...prev.radar.xaxis,
              categories: switchAxisData.dataTypeTwo.xaxisCategory,
            },
          },
          scatter: {
            ...prev.scatter,
            xaxis: {
              ...prev.scatter.xaxis,
              categories: switchAxisData.dataTypeTwo.xaxisCategory,
            },
          },
        }));
        setSummarySeriesDataRD(switchAxisData.dataTypeTwo.data);
        setScatterDataRenderRD(scatterRenderDataTypes.dataTypeTwo);
      } else {
        setRenderChartsOptionsRD((prev) => ({
          ...prev,
          column: {
            ...prev.column,
            xaxis: {
              ...prev.column.xaxis,
              categories: switchAxisData.dataTypeOne.xaxisCategory,
            },
          },
          bar: {
            ...prev.bar,
            xaxis: {
              ...prev.bar.xaxis,
              categories: switchAxisData.dataTypeOne.xaxisCategory,
            },
          },
          line: {
            ...prev.line,
            xaxis: {
              ...prev.line.xaxis,
              categories: switchAxisData.dataTypeOne.xaxisCategory,
            },
          },
          radar: {
            ...prev.radar,
            xaxis: {
              ...prev.radar.xaxis,
              categories: switchAxisData.dataTypeOne.xaxisCategory,
            },
          },
          scatter: {
            ...prev.scatter,
            xaxis: {
              ...prev.scatter.xaxis,
              categories: switchAxisData.dataTypeOne.xaxisCategory,
            },
          },
        }));
        setSummarySeriesDataRD(switchAxisData.dataTypeOne.data);
        setScatterDataRenderRD(scatterRenderDataTypes.dataTypeOne);
      }
    }
  };

  const handleSwitchChange = (e) => {
    const { name } = e.target;

    if (name === "summary_switch_axis") {
      setFormData((prevData) => ({
        ...prevData,
        summary_switch_axis: !prevData.summary_switch_axis,
        // summary_data_label: !prevData.summary_switch_axis
        //   ? { value: "center", label: "Center" }
        //   : prevData.summary_data_label,
      }));

      // Ensure colors are preserved when switching summary axis
      const currentColors = summaryOptionsDetails.colors;
      setSwappedSummaryOptionsDetails((prev) => ({
        ...prev,
        colors: currentColors,
      }));
      switchAxisReportSummary(!formData.summary_switch_axis, "RS");
    } else if (name === "detail_switch_axis") {
      setFormData((prevData) => ({
        ...prevData,
        detail_switch_axis: !prevData.detail_switch_axis,
        // detail_data_label: !prevData.detail_switch_axis
        //   ? { value: "center", label: "Center" }
        //   : prevData.detail_data_label,
      }));

      // Ensure colors are preserved when switching detail axis
      const currentColors = detailOptionsDetails.colors;
      setSwappedDetailOptionsDetails((prev) => ({
        ...prev,
        colors: currentColors,
      }));

      switchAxisReportSummary(!formData.detail_switch_axis, "RD");
    }
  };

  // Handle chart type change
  const handleChartTypeChange = (type) => {
    setSummaryOptionsDetails((prevOptions) => ({
      ...prevOptions,
      chart: {
        ...prevOptions.chart,
        type: type?.value,
      },
    }));
  };

  const updateFillOpacity = (newOpacity) => {
    // Update both normal and swapped options for summary chart
    setSummaryOptionsDetails((prevState) => ({
      ...prevState,
      annotations: {
        ...prevState.annotations,
        yaxis: [...prevState.annotations.yaxis].map((item) => ({
          ...item,
          opacity: newOpacity,
        })),
      },
    }));

    setSwappedSummaryOptionsDetails((prevState) => ({
      ...prevState,
      annotations: {
        ...prevState.annotations,
        xaxis: [...prevState.annotations.xaxis].map((item) => ({
          ...item,
          opacity: newOpacity,
        })),
      },
    }));

    setRenderChartsOptionsRS((prevState) => ({
      ...prevState,
      column: {
        ...prevState.column,
        annotations: {
          ...prevState.column.annotations,
          yaxis: [...prevState.column.annotations.yaxis].map((item) => ({
            ...item,
            opacity: newOpacity,
          })),
        },
      },
      bar: {
        ...prevState.bar,
        annotations: {
          ...prevState.bar.annotations,
          xaxis: [...prevState.bar.annotations.xaxis].map((item) => ({
            ...item,
            opacity: newOpacity,
          })),
        },
      },
      line: {
        ...prevState.line,
        annotations: {
          ...prevState.line.annotations,
          yaxis: [...prevState.line.annotations.yaxis].map((item) => ({
            ...item,
            opacity: newOpacity,
          })),
        },
      },
      // radar: {...prevState.radar,annotations: {
      //   ...prevState.radar.annotations,
      //   xaxis: [...prevState.radar.annotations.xaxis].map((item) => ({
      //     ...item,
      //     opacity: newOpacity,
      //   })),
      // },},
      scatter: {
        ...prevState.scatter,
        annotations: {
          ...prevState.scatter.annotations,
          yaxis: [...prevState.scatter.annotations.yaxis].map((item) => ({
            ...item,
            opacity: newOpacity,
          })),
        },
      },
    }));
  };

  const updateDataLabelsColors = (newColors) => {
    // Update both normal and swapped options for summary chart
    setSummaryOptionsDetails((prevState) => ({
      ...prevState,
      dataLabels: {
        ...prevState.dataLabels,
        style: {
          ...prevState.dataLabels.style,
          colors: newColors,
        },
      },
    }));

    setSwappedSummaryOptionsDetails((prevState) => ({
      ...prevState,
      dataLabels: {
        ...prevState.dataLabels,
        style: {
          ...prevState.dataLabels.style,
          colors: newColors,
        },
      },
    }));

    setRenderChartsOptionsRS((prevState) => ({
      ...prevState,
      column: {
        ...prevState.column,
        dataLabels: {
          ...prevState.column.dataLabels,
          style: {
            ...prevState.column.dataLabels.style,
            colors: newColors,
          },
        },
      },
      bar: {
        ...prevState.bar,
        dataLabels: {
          ...prevState.bar.dataLabels,
          style: {
            ...prevState.bar.dataLabels.style,
            colors: newColors,
          },
        },
      },
      line: {
        ...prevState.line,
        dataLabels: {
          ...prevState.line.dataLabels,
          style: {
            ...prevState.line.dataLabels.style,
            colors: newColors,
          },
        },
      },
      radar: {
        ...prevState.radar,
        dataLabels: {
          ...prevState.radar.dataLabels,
          style: {
            ...prevState.radar.dataLabels.style,
            colors: newColors,
          },
        },
      },
      scatter: {
        ...prevState.scatter,
        dataLabels: {
          ...prevState.scatter.dataLabels,
          style: {
            ...prevState.scatter.dataLabels.style,
            colors: newColors,
          },
        },
      },
    }));
  };

  const updateLegendPosition = (newPosition) => {
    // Update both normal and swapped options for summary chart
    setSummaryOptionsDetails((prevState) => ({
      ...prevState,
      legend: {
        ...prevState.legend,
        position:
          newPosition === "hidden" ? prevState.legend.position : newPosition,
        show: newPosition !== "hidden",
      },
    }));

    setSwappedSummaryOptionsDetails((prevState) => ({
      ...prevState,
      legend: {
        ...prevState.legend,
        position:
          newPosition === "hidden" ? prevState.legend.position : newPosition,
        show: newPosition !== "hidden",
      },
    }));

    setRenderChartsOptionsRS((prev) => ({
      ...prev,
      column: {
        ...prev.column,
        legend: {
          ...prev.column.legend,
          position:
            newPosition === "hidden"
              ? prev.column.legend.position
              : newPosition,
          show: newPosition !== "hidden",
        },
      },
      bar: {
        ...prev.bar,
        legend: {
          ...prev.bar.legend,
          position:
            newPosition === "hidden" ? prev.bar.legend.position : newPosition,
          show: newPosition !== "hidden",
        },
      },
      line: {
        ...prev.line,
        legend: {
          ...prev.line.legend,
          position:
            newPosition === "hidden" ? prev.line.legend.position : newPosition,
          show: newPosition !== "hidden",
        },
      },
      radar: {
        ...prev.radar,
        legend: {
          ...prev.radar.legend,
          position:
            newPosition === "hidden" ? prev.radar.legend.position : newPosition,
          show: newPosition !== "hidden",
        },
      },
      scatter: {
        ...prev.scatter,
        legend: {
          ...prev.scatter.legend,
          position:
            newPosition === "hidden"
              ? prev.scatter.legend.position
              : newPosition,
          show: newPosition !== "hidden",
        },
      },
    }));
  };

  const updateDataLabelsFontSize = (newFontSize) => {
    // Update both normal and swapped options for summary chart
    setSummaryOptionsDetails((prevState) => ({
      ...prevState,
      dataLabels: {
        ...prevState.dataLabels,
        style: {
          ...prevState.dataLabels.style,
          fontSize: newFontSize,
        },
      },
    }));

    setSwappedSummaryOptionsDetails((prevState) => ({
      ...prevState,
      dataLabels: {
        ...prevState.dataLabels,
        style: {
          ...prevState.dataLabels.style,
          fontSize: newFontSize,
        },
      },
    }));

    setRenderChartsOptionsRS((prevState) => ({
      ...prevState,
      column: {
        ...prevState.column,
        dataLabels: {
          ...prevState.column.dataLabels,
          style: {
            ...prevState.column.dataLabels.style,
            fontSize: newFontSize,
          },
        },
      },
      bar: {
        ...prevState.bar,
        dataLabels: {
          ...prevState.bar.dataLabels,
          style: {
            ...prevState.bar.dataLabels.style,
            fontSize: newFontSize,
          },
        },
      },
      line: {
        ...prevState.line,
        dataLabels: {
          ...prevState.line.dataLabels,
          style: {
            ...prevState.line.dataLabels.style,
            fontSize: newFontSize,
          },
        },
      },
      radar: {
        ...prevState.radar,
        dataLabels: {
          ...prevState.radar.dataLabels,
          style: {
            ...prevState.radar.dataLabels.style,
            fontSize: newFontSize,
          },
        },
      },
      scatter: {
        ...prevState.scatter,
        dataLabels: {
          ...prevState.scatter.dataLabels,
          style: {
            ...prevState.scatter.dataLabels.style,
            fontSize: newFontSize,
          },
        },
      },
    }));
  };

  const updateBarDataLabelsPosition = (newPosition) => {
    // Update both normal and swapped states for summary chart
    setSummaryOptionsDetails((prevState) => ({
      ...prevState,
      dataLabels: {
        ...prevState.dataLabels,
        enabled: newPosition !== "none",
        position: newPosition,
      },
      plotOptions: {
        ...prevState.plotOptions,
        bar: {
          ...prevState.plotOptions.bar,
          dataLabels: {
            ...prevState.plotOptions.bar.dataLabels,
            position:
              newPosition !== "none"
                ? newPosition
                : prevState.plotOptions.bar.dataLabels.position,
          },
        },
      },
    }));

    setSwappedSummaryOptionsDetails((prevState) => ({
      ...prevState,
      dataLabels: {
        ...prevState.dataLabels,
        enabled: newPosition !== "none",
        position: "center", // Force center position when swapped
      },
      plotOptions: {
        ...prevState.plotOptions,
        bar: {
          ...prevState.plotOptions.bar,
          dataLabels: {
            ...prevState.plotOptions.bar.dataLabels,
            position: "center", // Force center position when swapped
          },
        },
      },
    }));

    setRenderChartsOptionsRS((prevState) => ({
      ...prevState,
      column: {
        ...prevState.column,
        dataLabels: {
          ...prevState.column.dataLabels,
          enabled: newPosition !== "none",
          position: newPosition,
        },
      },
      bar: {
        ...prevState.bar,
        dataLabels: {
          ...prevState.bar.dataLabels,
          enabled: newPosition !== "none",
          position: newPosition,
        },
      },
      line: {
        ...prevState.line,
        dataLabels: {
          ...prevState.line.dataLabels,
          enabled: newPosition !== "none",
          position: newPosition,
        },
      },
      radar: {
        ...prevState.radar,
        dataLabels: {
          ...prevState.radar.dataLabels,
          enabled: newPosition !== "none",
          position: newPosition,
        },
      },
      scatter: {
        ...prevState.scatter,
        dataLabels: {
          ...prevState.scatter.dataLabels,
          enabled: newPosition !== "none",
          position: newPosition,
        },
      },
    }));
  };

  const updateDetailChartSettings = {
    chartType: (type) => {
      setDetailOptionsDetails((prevOptions) => ({
        ...prevOptions,
        chart: {
          ...prevOptions.chart,
          type: type?.value,
        },
      }));
    },

    fillOpacity: (newOpacity) => {
      // Update both normal and swapped options for detail chart
      setDetailOptionsDetails((prevOptions) => ({
        ...prevOptions,
        annotations: {
          ...prevOptions.annotations,
          yaxis: [...prevOptions.annotations.yaxis].map((item) => ({
            ...item,
            opacity: newOpacity,
          })),
        },
      }));

      setSwappedDetailOptionsDetails((prevOptions) => ({
        ...prevOptions,
        annotations: {
          ...prevOptions.annotations,
          xaxis: [...prevOptions.annotations.xaxis].map((item) => ({
            ...item,
            opacity: newOpacity,
          })),
        },
      }));

      setRenderChartsOptionsRD((prevState) => ({
        ...prevState,
        column: {
          ...prevState.column,
          annotations: {
            ...prevState.column.annotations,
            yaxis: [...prevState.column.annotations.yaxis].map((item) => ({
              ...item,
              opacity: newOpacity,
            })),
          },
        },
        bar: {
          ...prevState.bar,
          annotations: {
            ...prevState.bar.annotations,
            xaxis: [...prevState.bar.annotations.xaxis].map((item) => ({
              ...item,
              opacity: newOpacity,
            })),
          },
        },
        line: {
          ...prevState.line,
          annotations: {
            ...prevState.line.annotations,
            yaxis: [...prevState.line.annotations.yaxis].map((item) => ({
              ...item,
              opacity: newOpacity,
            })),
          },
        },
        // radar: {...prevState.radar,annotations: {
        //   ...prevState.radar.annotations,
        //   xaxis: [...prevState.radar.annotations.xaxis].map((item) => ({
        //     ...item,
        //     opacity: newOpacity,
        //   })),
        // },},
        scatter: {
          ...prevState.scatter,
          annotations: {
            ...prevState.scatter.annotations,
            yaxis: [...prevState.scatter.annotations.yaxis].map((item) => ({
              ...item,
              opacity: newOpacity,
            })),
          },
        },
      }));
    },

    dataLabelsColors: (newColors) => {
      // Update both normal and swapped options for detail chart
      setDetailOptionsDetails((prevOptions) => ({
        ...prevOptions,
        dataLabels: {
          ...prevOptions.dataLabels,
          style: {
            ...prevOptions.dataLabels.style,
            colors: newColors,
          },
        },
      }));

      setSwappedDetailOptionsDetails((prevOptions) => ({
        ...prevOptions,
        dataLabels: {
          ...prevOptions.dataLabels,
          style: {
            ...prevOptions.dataLabels.style,
            colors: newColors,
          },
        },
      }));

      setRenderChartsOptionsRD((prevState) => ({
        ...prevState,
        column: {
          ...prevState.column,
          dataLabels: {
            ...prevState.column.dataLabels,
            style: {
              ...prevState.column.dataLabels.style,
              colors: newColors,
            },
          },
        },
        bar: {
          ...prevState.bar,
          dataLabels: {
            ...prevState.bar.dataLabels,
            style: {
              ...prevState.bar.dataLabels.style,
              colors: newColors,
            },
          },
        },
        line: {
          ...prevState.line,
          dataLabels: {
            ...prevState.line.dataLabels,
            style: {
              ...prevState.line.dataLabels.style,
              colors: newColors,
            },
          },
        },
        radar: {
          ...prevState.radar,
          dataLabels: {
            ...prevState.radar.dataLabels,
            style: {
              ...prevState.radar.dataLabels.style,
              colors: newColors,
            },
          },
        },
        scatter: {
          ...prevState.scatter,
          dataLabels: {
            ...prevState.scatter.dataLabels,
            style: {
              ...prevState.scatter.dataLabels.style,
              colors: newColors,
            },
          },
        },
      }));
    },

    legendPosition: (newPosition) => {
      // Update both normal and swapped options for detail chart
      setDetailOptionsDetails((prevOptions) => ({
        ...prevOptions,
        legend: {
          ...prevOptions.legend,
          position:
            newPosition === "hidden"
              ? prevOptions.legend.position
              : newPosition,
          show: newPosition !== "hidden",
        },
      }));

      setSwappedDetailOptionsDetails((prevOptions) => ({
        ...prevOptions,
        legend: {
          ...prevOptions.legend,
          position:
            newPosition === "hidden"
              ? prevOptions.legend.position
              : newPosition,
          show: newPosition !== "hidden",
        },
      }));

      setRenderChartsOptionsRD((prev) => ({
        ...prev,
        column: {
          ...prev.column,
          legend: {
            ...prev.column.legend,
            position:
              newPosition === "hidden"
                ? prev.column.legend.position
                : newPosition,
            show: newPosition !== "hidden",
          },
        },
        bar: {
          ...prev.bar,
          legend: {
            ...prev.bar.legend,
            position:
              newPosition === "hidden" ? prev.bar.legend.position : newPosition,
            show: newPosition !== "hidden",
          },
        },
        line: {
          ...prev.line,
          legend: {
            ...prev.line.legend,
            position:
              newPosition === "hidden"
                ? prev.line.legend.position
                : newPosition,
            show: newPosition !== "hidden",
          },
        },
        radar: {
          ...prev.radar,
          legend: {
            ...prev.radar.legend,
            position:
              newPosition === "hidden"
                ? prev.radar.legend.position
                : newPosition,
            show: newPosition !== "hidden",
          },
        },
        scatter: {
          ...prev.scatter,
          legend: {
            ...prev.scatter.legend,
            position:
              newPosition === "hidden"
                ? prev.scatter.legend.position
                : newPosition,
            show: newPosition !== "hidden",
          },
        },
      }));
    },

    fontSize: (newFontSize) => {
      // Update both normal and swapped options for detail chart
      setDetailOptionsDetails((prevOptions) => ({
        ...prevOptions,
        dataLabels: {
          ...prevOptions.dataLabels,
          style: {
            ...prevOptions.dataLabels.style,
            fontSize: newFontSize,
          },
        },
      }));

      setSwappedDetailOptionsDetails((prevOptions) => ({
        ...prevOptions,
        dataLabels: {
          ...prevOptions.dataLabels,
          style: {
            ...prevOptions.dataLabels.style,
            fontSize: newFontSize,
          },
        },
      }));

      setRenderChartsOptionsRD((prevState) => ({
        ...prevState,
        column: {
          ...prevState.column,
          dataLabels: {
            ...prevState.column.dataLabels,
            style: {
              ...prevState.column.dataLabels.style,
              fontSize: newFontSize,
            },
          },
        },
        bar: {
          ...prevState.bar,
          dataLabels: {
            ...prevState.bar.dataLabels,
            style: {
              ...prevState.bar.dataLabels.style,
              fontSize: newFontSize,
            },
          },
        },
        line: {
          ...prevState.line,
          dataLabels: {
            ...prevState.line.dataLabels,
            style: {
              ...prevState.line.dataLabels.style,
              fontSize: newFontSize,
            },
          },
        },
        radar: {
          ...prevState.radar,
          dataLabels: {
            ...prevState.radar.dataLabels,
            style: {
              ...prevState.radar.dataLabels.style,
              fontSize: newFontSize,
            },
          },
        },
        scatter: {
          ...prevState.scatter,
          dataLabels: {
            ...prevState.scatter.dataLabels,
            style: {
              ...prevState.scatter.dataLabels.style,
              fontSize: newFontSize,
            },
          },
        },
      }));
    },

    dataLabelsPosition: (newPosition) => {
      // Update both normal and swapped states for detail chart
      setDetailOptionsDetails((prevOptions) => ({
        ...prevOptions,
        dataLabels: {
          ...prevOptions.dataLabels,
          enabled: newPosition !== "none",
          position: newPosition,
        },
        plotOptions: {
          ...prevOptions.plotOptions,
          bar: {
            ...prevOptions.plotOptions.bar,
            dataLabels: {
              ...prevOptions.plotOptions.bar.dataLabels,
              position:
                newPosition !== "none"
                  ? newPosition
                  : prevOptions.plotOptions.bar.dataLabels.position,
            },
          },
        },
      }));

      setSwappedDetailOptionsDetails((prevOptions) => ({
        ...prevOptions,
        dataLabels: {
          ...prevOptions.dataLabels,
          enabled: newPosition !== "none",
          position: "center", // Force center position when swapped
        },
        plotOptions: {
          ...prevOptions.plotOptions,
          bar: {
            ...prevOptions.plotOptions.bar,
            dataLabels: {
              ...prevOptions.plotOptions.bar.dataLabels,
              position: "center", // Force center position when swapped
            },
          },
        },
      }));

      setRenderChartsOptionsRD((prevState) => ({
        ...prevState,
        column: {
          ...prevState.column,
          dataLabels: {
            ...prevState.column.dataLabels,
            enabled: newPosition !== "none",
            position: newPosition,
          },
        },
        bar: {
          ...prevState.bar,
          dataLabels: {
            ...prevState.bar.dataLabels,
            enabled: newPosition !== "none",
            position: newPosition,
          },
        },
        line: {
          ...prevState.line,
          dataLabels: {
            ...prevState.line.dataLabels,
            enabled: newPosition !== "none",
            position: newPosition,
          },
        },
        radar: {
          ...prevState.radar,
          dataLabels: {
            ...prevState.radar.dataLabels,
            enabled: newPosition !== "none",
            position: newPosition,
          },
        },
        scatter: {
          ...prevState.scatter,
          dataLabels: {
            ...prevState.scatter.dataLabels,
            enabled: newPosition !== "none",
            position: newPosition,
          },
        },
      }));
    },
  };

  const handleChangeReport = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Handle opacity for both summary and detail charts
    if (name === "summary_scalar_opacity") {
      const result = (value / 100).toFixed(1);
      updateFillOpacity(result);
    } else if (name === "detail_scalar_opacity") {
      const result = (value / 100).toFixed(1);
      updateDetailChartSettings.fillOpacity(result);
    }
  };

  // const isBarChart = (chartType) => {
  //   return chartType?.value === "bar";
  // };

  // Handle select field change
  const handleSelectChange = (selectedOption, name) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: selectedOption,
    }));

    // Summary chart handlers
    if (name === "summary_chart_type") {
      handleChartTypeChange(selectedOption);
      // if (!isBarChart(selectedOption)) {
      //   setFormData((prev) => ({
      //     ...prev,
      //     summary_switch_axis: false,
      //   }));
      // }
    } else if (name === "summary_legend_position") {
      updateLegendPosition(selectedOption?.value);
    } else if (name === "summary_font_size") {
      updateDataLabelsFontSize(`${selectedOption?.value}px`);
    } else if (name === "summary_data_label") {
      updateBarDataLabelsPosition(selectedOption?.value);
    }

    // Detail chart handlers
    if (name === "detail_chart_type") {
      updateDetailChartSettings.chartType(selectedOption);
      // if (!isBarChart(selectedOption)) {
      //   setFormData((prev) => ({
      //     ...prev,
      //     detail_switch_axis: false,
      //   }));
      // }
    } else if (name === "detail_legend_position") {
      updateDetailChartSettings.legendPosition(selectedOption?.value);
    } else if (name === "detail_font_size") {
      updateDetailChartSettings.fontSize(`${selectedOption?.value}px`);
    } else if (name === "detail_data_label") {
      updateDetailChartSettings.dataLabelsPosition(selectedOption?.value);
    }
  };

  const handleColorChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "summary_db_color") {
      updateDataLabelsColors([value]);
    } else if (name === "detail_db_color") {
      updateDetailChartSettings.dataLabelsColors([value]);
    }
  };

  const hasOverlappingRanges = (scalars) => {
    let isAnyOverlap = false;
    // Create a temporary structure to hold overlap messages for the current check
    const currentOverlapMessages = new Array(scalars.length)
      .fill(null)
      .map(() => ({}));

    for (let i = 0; i < scalars.length; i += 1) {
      const current = scalars[i];
      // Skip if min/max are not valid numbers for comparison or are empty
      if (
        current.add_scalar_min_value === "" ||
        current.add_scalar_max_value === "" ||
        isNaN(Number(current.add_scalar_min_value)) ||
        isNaN(Number(current.add_scalar_max_value))
      ) {
        continue;
      }
      for (let j = i + 1; j < scalars.length; j += 1) {
        const compare = scalars[j];
        if (
          compare.add_scalar_min_value === "" ||
          compare.add_scalar_max_value === "" ||
          isNaN(Number(compare.add_scalar_min_value)) ||
          isNaN(Number(compare.add_scalar_max_value))
        ) {
          continue;
        }

        if (
          Number(current.add_scalar_min_value) <=
            Number(compare.add_scalar_max_value) &&
          Number(current.add_scalar_max_value) >=
            Number(compare.add_scalar_min_value)
        ) {
          const message = "This range overlaps with another scalar";
          currentOverlapMessages[i].overlapping = message;
          currentOverlapMessages[j].overlapping = message;
          isAnyOverlap = true;
        }
      }
    }

    setErrors((prevErrors) => {
      // Ensure prevErrors has the same length as scalars, filling with {} if necessary for alignment
      const alignedPrevErrors = Array.from(
        { length: scalars.length },
        (_, k) => prevErrors[k] || {}
      );

      return alignedPrevErrors.map((existingError, index) => {
        const newError = { ...existingError }; // Preserve other errors
        // Set or clear the overlapping message based on the current check
        if (currentOverlapMessages[index]?.overlapping) {
          newError.overlapping = currentOverlapMessages[index].overlapping;
        } else {
          delete newError.overlapping;
        }
        return newError;
      });
    });
    return isAnyOverlap;
  };

  // Handle input changes
  const handleChange = (index, field, value) => {
    const updatedScalarConfiguration = [...scalarConfiguration];

    updatedScalarConfiguration[index][field] = value;
    updateAnnotationsSummaryGraph(updatedScalarConfiguration);
    setScalarConfiguration(updatedScalarConfiguration);
    // Only check for overlaps if we're changing min or max values
    if (field === "add_scalar_min_value" || field === "add_scalar_max_value") {
      const currentRow = updatedScalarConfiguration[index];

      // Check if current row has both min and max values
      if (currentRow.add_scalar_min_value && currentRow.add_scalar_max_value) {
        const isOverlapping = hasOverlappingRanges(updatedScalarConfiguration);

        if (isOverlapping) {
          // Always show toast for overlapping values
          toast.error("Overlapping min/max values detected!", {
            id: `overlapping-values-${index}`, // Unique ID for each row
          });
        } else {
          toast.remove(`overlapping-values-${index}`);
        }
      }
    }

    validateField(index, field, value);
  };

  // Validate fields
  const validateField = (index, field, value) => {
    let currentFieldError = "";
    let isFieldValid = true;

    // Scalar name validation
    if (field === "add_scalar_name") {
      if (!value) {
        currentFieldError = "Scalar name is required";
        isFieldValid = false;
      } else if (value.length > 25) {
        currentFieldError = "Scalar name must not exceed 25 characters";
        isFieldValid = false;
      }
    }
    // Min/Max value validation
    else if (
      field === "add_scalar_min_value" ||
      field === "add_scalar_max_value"
    ) {
      const fieldNameLabel =
        field === "add_scalar_min_value" ? "Minimum" : "Maximum";
      if (value === "" || value === null || value === undefined) {
        currentFieldError = `${fieldNameLabel} value is required`;
        isFieldValid = false;
      } else if (Number(value) <= 0) {
        currentFieldError = "Positive non-zero number required";
        isFieldValid = false;
      }
    }
    // Color validation
    else if (field === "add_scalar_color") {
      const trimmedValue = typeof value === "string" ? value.trim() : "";
      if (!trimmedValue) {
        currentFieldError = "Color is required";
        isFieldValid = false;
      } else if (!/^#[0-9A-F]{6}$/i.test(trimmedValue)) {
        currentFieldError = "Invalid color code";
        isFieldValid = false;
      }
    }

    setErrors((prevErrors) => {
      // It's good practice to create a new array and new objects for the parts being changed.
      const newErrors = prevErrors.map((err, i) =>
        i === index ? { ...(err || {}) } : err || {}
      );

      if (!newErrors[index]) {
        // Should be redundant due to map creating it if undefined
        newErrors[index] = {};
      }
      newErrors[index][field] = currentFieldError;
      return newErrors;
    });

    return isFieldValid;
  };

  // Check if all rows are valid before adding a new row
  const validateAllRowsBeforeAdding = () => {
    let isValid = true;
    let firstErrorFieldId = null;

    for (let index = 0; index < scalarConfiguration.length; index += 1) {
      const row = scalarConfiguration[index];

      const nameCheck = validateField(
        index,
        "add_scalar_name",
        row.add_scalar_name
      );
      if (!nameCheck && isValid) {
        isValid = false;
        firstErrorFieldId = `add_scalar_name_${index}`;
      }

      const minValueCheck = validateField(
        index,
        "add_scalar_min_value",
        row.add_scalar_min_value
      );
      if (!minValueCheck && isValid) {
        isValid = false;
        firstErrorFieldId = `add_scalar_min_value_${index}`;
      }

      const maxValueCheck = validateField(
        index,
        "add_scalar_max_value",
        row.add_scalar_max_value
      );
      if (!maxValueCheck && isValid) {
        isValid = false;
        firstErrorFieldId = `add_scalar_max_value_${index}`;
      }

      const colorCheck = validateField(
        index,
        "add_scalar_color",
        row.add_scalar_color
      );
      if (!colorCheck && isValid) {
        isValid = false;
        firstErrorFieldId = `add_scalar_color_${index}`;
      }
    }

    return { isValid, firstErrorFieldId };
  };

  const addRow = () => {
    if (validateAllRowsBeforeAdding()) {
      if (scalarConfiguration.length < 10) {
        setScalarConfiguration([
          ...scalarConfiguration,
          {
            scalar_id: "",
            add_scalar_sequence: scalarConfiguration?.length + 1,
            add_scalar_name: "",
            add_scalar_min_value: "",
            add_scalar_max_value: "",
            add_scalar_color: "#000000",
          },
        ]);
      }
    }
  };

  const deleteRow = (index) => {
    const updatedScalarConfiguration = scalarConfiguration
      .filter((_, i) => i !== index)
      .map((row, newIndex) => ({ ...row, add_scalar_sequence: newIndex + 1 })); // Re-sequence

    setScalarConfiguration(updatedScalarConfiguration);

    // Remove the corresponding error entry
    setErrors((prevErrors) => {
      const newErrors = prevErrors.filter((_, i) => i !== index);
      // Ensure the errors array has the same length as the new scalarConfiguration
      return Array.from(
        { length: updatedScalarConfiguration.length },
        (_, i) => newErrors[i] || {}
      );
    });
    hasOverlappingRanges(updatedScalarConfiguration); // Re-check for overlaps with the new configuration
  };

  useEffect(() => {
    if (currentColorPallet?.colors?.length > 0) {
      // eslint-disable-next-line no-use-before-define
      mapColorsToScalars(currentColorPallet);
    }
  }, [scalarConfiguration?.length, currentColorPallet?.colors?.length]);

  const mapColorsToScalars = (value) => {
    if (!value?.colors) return;

    const colors = value?.colors;

    // Map colors directly in sequence
    const updatedScalarConfig = scalarConfiguration?.map((scalar, index) => {
      // Only assign color if it exists in the palette
      if (index < colors.length) {
        return {
          ...scalar,
          scalar_id: colors[index]?.colorID || null,
          add_scalar_color: colors[index]?.colorCode || null,
        };
      }
      return scalar;
    });

    setScalarConfiguration(updatedScalarConfig);
    setCurrentColorPallet({
      colorPaletteID: value?.colorPaletteID,
      colors: value?.colors,
      paletteName: value?.paletteName,
    });

    // Update annotations for the graph
    updateAnnotationsSummaryGraph(updatedScalarConfig);
  };

  const handleSubmit = () => {
    const { isValid, firstErrorFieldId } = validateAllRowsBeforeAdding();

    // Check for overlapping ranges
    if (hasOverlappingRanges(scalarConfiguration)) {
      toast.dismiss();
      toast.error("Cannot save: Overlapping min/max scalar values detected!");

      // Find the first row with an overlapping error
      const firstOverlappingIndex = errors.findIndex(
        (error) => error?.overlapping
      );
      if (firstOverlappingIndex !== -1) {
        const el = document.getElementById(
          `scalar_row_${firstOverlappingIndex}`
        );
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }

      return { data: null, isValid: false };
    }

    // Stop here if rows are invalid
    if (!isValid) {
      toast.dismiss();
      toast.error("Please enter all the required things to continue");

      const el = document.getElementById(firstErrorFieldId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.focus?.();
      }

      return { data: null, isValid: false };
    }

    return {
      data: {
        ...formData,
        scalarConfiguration,
        currentColorPallet,
        summaryColorPallet,
        detailColorPallet,
        colorPaletteID: currentColorPallet?.colorPaletteID,
        scalarPaletteID: currentColorPallet?.colorPaletteID,
        summaryPaletteID: formData.summaryColorPaletteID,
        detailPaletteID: formData.detailedColorPaletteID,
      },
      isValid: true,
    };
  };

  // Forward the ref and expose handleSubmit
  useImperativeHandle(ref, () => ({
    handleSubmit,
  }));

  function findMaxY2(data) {
    let maxY2 = -Infinity;
    data.forEach((entry) => {
      // Update maxY2 if the current y2 is greater
      if (Number(entry.y2) > maxY2) {
        maxY2 = entry.y2;
      }
    });

    return maxY2;
  }

  function findMaxX2(data) {
    let maxX2 = -Infinity;
    data.forEach((entry) => {
      // Update maxX2 if the current y2 is greater
      if (Number(entry.x2) > maxX2) {
        maxX2 = entry.x2;
      }
    });

    return maxX2;
  }

  // This function is used to update the annotations of the graph. The annotations represent the values on the y-axis, and both the values and colors are dynamic.
  const updateAnnotationsSummaryGraph = (scalarConfigurationData) => {
    const newAnnotations = scalarConfigurationData.map((scalar) => ({
      y: Number(scalar.add_scalar_min_value),
      y2: Number(scalar.add_scalar_max_value),
      borderColor: scalar.add_scalar_color,
      fillColor: scalar.add_scalar_color,
      label: {
        text: scalar.add_scalar_name,
        position: "right",
        style: {
          color: scalar.add_scalar_color,
          background: "none",
          fontSize: "14px",
        },
      },
    }));

    const newSwappedAnnotations = scalarConfigurationData.map((scalar) => ({
      x: Number(scalar.add_scalar_min_value),
      x2: Number(scalar.add_scalar_max_value),
      borderColor: scalar.add_scalar_color,
      fillColor: scalar.add_scalar_color,
      label: {
        text: scalar.add_scalar_name,
        position: "top",
        style: {
          color: scalar.add_scalar_color,
          background: "none",
          fontSize: "14px",
        },
        offsetY: -35,
        rotate: 1,
      },
    }));

    // Update both summary and detail chart options simultaneously
    const maxY2 = findMaxY2(newAnnotations);
    const maxX2 = findMaxX2(newSwappedAnnotations);

    // Update summary chart
    setSummaryOptionsDetails((prevOptions) => ({
      ...prevOptions,
      yaxis: {
        ...prevOptions.yaxis,
        max: maxY2,
      },
      annotations: {
        ...prevOptions.annotations,
        yaxis: newAnnotations,
      },
    }));

    // Update detail chart
    setDetailOptionsDetails((prevOptions) => ({
      ...prevOptions,
      yaxis: {
        ...prevOptions.yaxis,
        max: maxY2,
      },
      annotations: {
        ...prevOptions.annotations,
        yaxis: newAnnotations,
      },
    }));

    // Update swapped options for both charts
    setSwappedSummaryOptionsDetails((prevOptions) => ({
      ...prevOptions,
      xaxis: {
        ...prevOptions.xaxis,
        max: maxX2,
      },
      annotations: {
        ...prevOptions.annotations,
        xaxis: newSwappedAnnotations,
      },
    }));

    setSwappedDetailOptionsDetails((prevOptions) => ({
      ...prevOptions,
      xaxis: {
        ...prevOptions.xaxis,
        max: maxX2,
      },
      annotations: {
        ...prevOptions.annotations,
        xaxis: newSwappedAnnotations,
      },
    }));
  };

  const updateDataColorsSummaryGraph = (color) => {
    setSummaryOptionsDetails((prevOptions) => ({
      ...prevOptions,
      colors: color,
    }));

    setRenderChartsOptionsRS((prev) => ({
      ...prev,
      column: { ...prev.column, colors: color },
      bar: { ...prev.bar, colors: color },
      line: { ...prev.line, colors: color },
      radar: { ...prev.radar, colors: color },
      scatter: { ...prev.scatter, colors: color },
    }));

    setRenderChartsOptionsRD((prev) => ({
      ...prev,
      column: { ...prev.column, colors: color },
      bar: { ...prev.bar, colors: color },
      line: { ...prev.line, colors: color },
      radar: { ...prev.radar, colors: color },
      scatter: { ...prev.scatter, colors: color },
    }));
  };

  function getColorCodes(data) {
    // Extract color IDs and their corresponding color codes
    const colorIDs = data.map((color) => parseInt(color.colorID));
    const colorCodes = data.map((color) => color.colorCode);

    // Calculate min, max, and average of color IDs
    const minColorID = Math.min(...colorIDs);
    const maxColorID = Math.max(...colorIDs);
    const avgColorID = Math.round(
      colorIDs.reduce((sum, id) => sum + id, 0) / colorIDs.length
    );

    // Find the corresponding color codes
    const minColorCode = colorCodes[colorIDs.indexOf(minColorID)];
    const maxColorCode = colorCodes[colorIDs.indexOf(maxColorID)];
    const avgColorCode = colorCodes[colorIDs.indexOf(avgColorID)];

    // Return an array with min, max, and avg color codes
    return [minColorCode, avgColorCode, maxColorCode];
  }

  const handleColorPallet = (value, type) => {
    const returnColors = getColorCodes(value?.colors);

    if (type === "summary") {
      // Update both normal and swapped options for summary
      updateDataColorsSummaryGraph(returnColors);
      setSwappedSummaryOptionsDetails((prev) => ({
        ...prev,
        colors: returnColors,
      }));
      setSummaryColorPallet({
        summaryColorPaletteID: value?.colorPaletteID,
        colorPaletteID: value?.colorPaletteID,
        colors: value?.colors,
      });
      setFormData((prevData) => ({
        ...prevData,
        summaryColorPaletteID: value?.colorPaletteID,
      }));
      setRSChartColor(returnColors);
    } else if (type === "detail") {
      // Update both normal and swapped options for detail
      setDetailOptionsDetails((prev) => ({
        ...prev,
        colors: returnColors,
      }));
      setSwappedDetailOptionsDetails((prev) => ({
        ...prev,
        colors: returnColors,
      }));
      setDetailColorPallet({
        detailColorPaletteID: value?.colorPaletteID,
        colorPaletteID: value?.colorPaletteID,
        colors: value?.colors,
      });
      setFormData((prevData) => ({
        ...prevData,
        detailedColorPaletteID: value?.colorPaletteID,
      }));
      setPDChartColor(returnColors);
    }
  };

  // Update initial swapped states to include colors
  useEffect(() => {
    if (currentColorPallet?.colors?.length > 0) {
      const returnColors = getColorCodes(currentColorPallet.colors);

      setSwappedSummaryOptionsDetails((prev) => ({
        ...prev,
        colors: returnColors,
      }));

      setSwappedDetailOptionsDetails((prev) => ({
        ...prev,
        colors: returnColors,
      }));
    }
  }, [currentColorPallet]);

  const copyToReport = () => {
    if (reportType === "Detail") {
      setFormData((prevData) => ({
        ...prevData,
        report_detail_opening_comment: copyOpeningComment,
        report_detail_closing_comment: copyClosingComment,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        summary_opening_comment: copyOpeningComment,
        summary_closing_comment: copyClosingComment,
      }));
    }

    copyCommentClose();
  };
  const [previewType, setPreviewType] = useState("Summary");

  const handleClick = (type) => {
    setPreviewType(type);
    setshowPreview(true);
  };

  const getPreviewData = () => {
    if (previewType === "Summary") {
      return {
        chartOptions:
          renderChartsOptionsRS[formData?.summary_chart_type?.value],
        seriesData:
          formData?.summary_chart_type?.value === "scatter"
            ? scatterDataRender
            : summaySeriesData,
        chartType:
           formData?.summary_chart_type?.value,
        reportName: formData?.summary_report_name,
        openingComment: formData?.summary_opening_comment,
        closingComment: formData?.summary_closing_comment,
      };
    } else {
      return {
        chartOptions: renderChartsOptionsRD[formData?.detail_chart_type?.value],
        seriesData:
          formData?.detail_chart_type?.value === "scatter"
            ? scatterDataRenderRD
            : summaySeriesDataRD,
        chartType:
           formData?.detail_chart_type?.value,
        reportName: formData?.detail_report_name,
        openingComment: formData?.report_detail_opening_comment,
        closingComment: formData?.report_detail_closing_comment,
      };
    }
  };

  // Add this function to filter data label options when axis is switched
  const getFilteredDataLabelOptions = (isAxisSwitched) => {
    if (isAxisSwitched) {
      return dataLabelOptions.filter((option) => option.value === "center");
    }
    return dataLabelOptions;
  };

  // Add this helper function near the top of the component

  // const renderCharts = (chartValue) => {
  //   return (
  //     <Chart
  //     key={chartValue + 1}
  //     options={
  //       renderChartsOptionsRS[chartValue]
  //     }
  //     series={chartValue === 'scatter' ?  scatterDataRender : summaySeriesData}
  //     type={chartValue === 'column' ? 'bar' : chartValue}
  //     height={350}
  //   />
  //   )

  // };

  // const renderReportDetailsChart = (chartValue) => {
  //   return (
  //     <Chart
  //     key={chartValue + 1}
  //     options={
  //       renderChartsOptionsRD[chartValue]
  //     }
  //     series={chartValue === 'scatter' ?  scatterDataRenderRD : summaySeriesDataRD}
  //     type={chartValue === 'column' ? 'bar' : chartValue}
  //     height={350}
  //   />
  //   )
  // }

  const renderChart = (chartType) => {
    let comp = null;

    const scalarOpacity = formData.detail_scalar_opacity
      ? (formData.detail_scalar_opacity / 1000).toFixed(2)
      : 0.1;
    const annotationXaxis = scalarConfiguration.map((annotation) => ({
      x: annotation.add_scalar_min_value,
      x2: annotation.add_scalar_max_value,
      borderColor: annotation.add_scalar_color,
      fillColor: annotation.add_scalar_color,
      opacity: scalarOpacity,
      label: {
        position: "top",
        // offsetY: -35,
        rotate: 1,
      },
    }));

    const annotationYaxis = scalarConfiguration.map((annotation) => ({
      y: annotation.add_scalar_min_value,
      y2: annotation.add_scalar_max_value,
      borderColor: annotation.add_scalar_color,
      fillColor: annotation.add_scalar_color,
      opacity: scalarOpacity,
      label: {
        position: "top",
        // offsetY: -35,
        rotate: 1,
      },
    }));

    const colorArr = PDChartColor.map((item) =>
      item.colorCode ? item.colorCode : item
    );

    switch (chartType) {
      case "bar":
        comp = (
          <BarChart
            legend={
              formData.detail_legend_position.value
                ? formData.detail_legend_position.value.toLowerCase()
                : "bottom"
            }
            fontSize={formData.detail_font_size.value ?? "8px"}
            dataLabels={
              formData.detail_data_label.value
                ? formData.detail_data_label.value
                : "top"
            }
            scalarOpacity={scalarOpacity}
            switchAxis={formData.detail_switch_axis}
            labelColor={
              formData.detail_db_color ? formData.detail_db_color : ["#000"]
            }
            scalarConfiguration={annotationXaxis}
            colorArr={colorArr}
          />
        );
        break;

      case "radar":
        comp = (
          <SpiderChart
            legend={
              formData.detail_legend_position.value
                ? formData.detail_legend_position.value.toLowerCase()
                : "bottom"
            }
            fontSize={formData.detail_font_size.value ?? "8px"}
            dataLabels={
              formData.detail_data_label.value
                ? formData.detail_data_label.value
                : "top"
            }
            scalarOpacity={
              formData.detail_scalar_opacity
                ? (formData.detail_scalar_opacity / 100).toFixed(1)
                : 0.1
            }
            switchAxis={formData.detail_switch_axis}
            labelColor={
              formData.detail_db_color ? formData.detail_db_color : ["#000"]
            }
            colorArr={colorArr}
          />
        );
        break;

      case "column":
        comp = (
          <ColumnChart
            legend={
              formData.detail_legend_position.value
                ? formData.detail_legend_position.value.toLowerCase()
                : "bottom"
            }
            fontSize={formData.detail_font_size.value ?? "8px"}
            dataLabels={
              formData.detail_data_label.value
                ? formData.detail_data_label.value
                : "top"
            }
            scalarOpacity={
              formData.detail_scalar_opacity
                ? (formData.detail_scalar_opacity / 100).toFixed(1)
                : 0.1
            }
            switchAxis={formData.detail_switch_axis}
            labelColor={
              formData.detail_db_color ? formData.detail_db_color : ["#000"]
            }
            scalarConfiguration={annotationYaxis}
            colorArr={colorArr}
          />
        );
        break;

      case "line":
        comp = (
          <LineChart
            legend={
              formData.detail_legend_position.value
                ? formData.detail_legend_position.value.toLowerCase()
                : "bottom"
            }
            fontSize={formData.detail_font_size.value ?? "8px"}
            dataLabels={
              formData.detail_data_label.value
                ? formData.detail_data_label.value
                : "top"
            }
            scalarOpacity={
              formData.detail_scalar_opacity
                ? (formData.detail_scalar_opacity / 100).toFixed(1)
                : 0.1
            }
            switchAxis={formData.detail_switch_axis}
            labelColor={
              formData.detail_db_color ? formData.detail_db_color : ["#000"]
            }
            scalarConfiguration={annotationYaxis}
            colorArr={colorArr}
          />
        );
        break;
      case "scatter":
        comp = (
          <ScatterChart
            legend={
              formData.detail_legend_position.value
                ? formData.detail_legend_position.value.toLowerCase()
                : "bottom"
            }
            fontSize={formData.detail_font_size.value ?? "8px"}
            dataLabels={
              formData.detail_data_label.value
                ? formData.detail_data_label.value
                : "top"
            }
            scalarOpacity={
              formData.detail_scalar_opacity
                ? (formData.detail_scalar_opacity / 100).toFixed(1)
                : 0.1
            }
            switchAxis={formData.detail_switch_axis}
            labelColor={
              formData.detail_db_color ? formData.detail_db_color : ["#000"]
            }
            scalarConfiguration={annotationYaxis}
            colorArr={colorArr}
          />
        );
        break;
      default:
        break;
    }

    return comp;
  };

  const renderSummaryChart = (chartType) => {
    let comp = null;

    const scalarOpacity = formData.summary_scalar_opacity
      ? (formData.summary_scalar_opacity / 1000).toFixed(2)
      : 0.1;
    const annotationXaxis = scalarConfiguration.map((annotation) => ({
      x: annotation.add_scalar_min_value,
      x2: annotation.add_scalar_max_value,
      borderColor: annotation.add_scalar_color,
      fillColor: annotation.add_scalar_color,
      opacity: scalarOpacity,
      label: {
        position: "top",
        // offsetY: -35,
        rotate: 1,
      },
    }));

    const annotationYaxis = scalarConfiguration.map((annotation) => ({
      y: annotation.add_scalar_min_value,
      y2: annotation.add_scalar_max_value,
      borderColor: annotation.add_scalar_color,
      fillColor: annotation.add_scalar_color,
      opacity: scalarOpacity,
      label: {
        position: "top",
        // offsetY: -35,
        rotate: 1,
      },
    }));

    const colorArr = RSChartColor.map((item) =>
      item.colorCode ? item.colorCode : item
    );

    switch (chartType) {
      case "bar":
        comp = (
          <BarChart
            legend={
              formData.summary_legend_position.value
                ? formData.summary_legend_position.value.toLowerCase()
                : "bottom"
            }
            fontSize={formData.summary_font_size.value ?? "8px"}
            dataLabels={
              formData.summary_data_label.value
                ? formData.summary_data_label.value.toLowerCase()
                : "top"
            }
            scalarOpacity={
              formData.summary_scalar_opacity
                ? (formData.summary_scalar_opacity / 100).toFixed(1)
                : 0.1
            }
            switchAxis={formData.summary_switch_axis}
            labelColor={
              formData.summary_db_color ? formData.summary_db_color : ["#000"]
            }
            scalarConfiguration={annotationXaxis}
            colorArr={colorArr}
          />
        );
        break;

      case "radar":
        comp = (
          <SpiderChart
            legend={
              formData.summary_legend_position.value
                ? formData.summary_legend_position.value.toLowerCase()
                : "bottom"
            }
            fontSize={formData.summary_font_size.value ?? "8px"}
            dataLabels={
              formData.summary_data_label.value
                ? formData.summary_data_label.value.toLowerCase()
                : "top"
            }
            scalarOpacity={
              formData.summary_scalar_opacity
                ? (formData.summary_scalar_opacity / 100).toFixed(1)
                : 0.1
            }
            switchAxis={formData.summary_switch_axis}
            labelColor={
              formData.summary_db_color ? formData.summary_db_color : ["#000"]
            }
            colorArr={colorArr}
          />
        );
        break;

      case "column":
        comp = (
          <ColumnChart
            legend={
              formData.summary_legend_position.value
                ? formData.summary_legend_position.value.toLowerCase()
                : "bottom"
            }
            fontSize={formData.summary_font_size.value ?? "8px"}
            dataLabels={
              formData.summary_data_label.value
                ? formData.summary_data_label.value.toLowerCase()
                : "top"
            }
            scalarOpacity={
              formData.summary_scalar_opacity
                ? (formData.summary_scalar_opacity / 100).toFixed(1)
                : 0.1
            }
            switchAxis={formData.summary_switch_axis}
            labelColor={
              formData.summary_db_color ? formData.summary_db_color : ["#000"]
            }
            scalarConfiguration={annotationYaxis}
            colorArr={colorArr}
          />
        );
        break;

      case "line":
        comp = (
          <LineChart
            legend={
              formData.summary_legend_position.value
                ? formData.summary_legend_position.value.toLowerCase()
                : "bottom"
            }
            fontSize={formData.summary_font_size.value ?? "8px"}
            dataLabels={
              formData.summary_data_label.value
                ? formData.summary_data_label.value.toLowerCase()
                : "top"
            }
            scalarOpacity={
              formData.summary_scalar_opacity
                ? (formData.summary_scalar_opacity / 100).toFixed(1)
                : 0.1
            }
            switchAxis={formData.summary_switch_axis}
            labelColor={
              formData.summary_db_color ? formData.summary_db_color : ["#000"]
            }
            scalarConfiguration={annotationYaxis}
            colorArr={colorArr}
          />
        );
        break;
      case "scatter":
        comp = (
          <ScatterChart
            legend={
              formData.summary_legend_position.value
                ? formData.summary_legend_position.value.toLowerCase()
                : "bottom"
            }
            fontSize={formData.summary_font_size.value ?? "8px"}
            dataLabels={
              formData.summary_data_label.value
                ? formData.summary_data_label.value.toLowerCase()
                : "top"
            }
            scalarOpacity={
              formData.summary_scalar_opacity
                ? (formData.summary_scalar_opacity / 100).toFixed(1)
                : 0.1
            }
            switchAxis={formData.summary_switch_axis}
            labelColor={
              formData.summary_db_color ? formData.summary_db_color : ["#000"]
            }
            scalarConfiguration={annotationYaxis}
            colorArr={colorArr}
          />
        );
        break;
      default:
        break;
    }

    return comp;
  };

  return (
    <>
      <div className="pageTitle">
        <h2>Scalar Configuration</h2>
      </div>
      <div className="generalsetting_inner d-block">
        <div className="scalarSec scalarappend">
          <div className="d-flex justify-content-between gap-2 mb-0 align-items-center">
            <div className="sequence title">Sequence</div>
            <div className="scalar title">Scalar Name</div>
            <div className="maximum title">Minimum</div>
            <div className="maximum title">Maximum</div>
            <div className="color title">
              Color
              <OverlayTrigger
                overlay={
                  <Tooltip id="tooltip-disabled">
                    Populate colors from color palette
                  </Tooltip>
                }
              >
                <span className="d-inline-block">
                  <em
                    disabled
                    style={{ pointerEvents: "none" }}
                    className="icon-info-circle ms-1"
                  />
                </span>
              </OverlayTrigger>
            </div>
            <div className="addeletebtn title justify-content-center">
              {" "}
              +/-{" "}
            </div>
          </div>
          {scalarConfiguration?.map((row, index) => (
            <div
              className="scalarappend_list d-flex justify-content-between gap-2 align-items-start"
              key={index}
              id={`scalar_row_${index}`}
            >
              {/* Scalar Sequence */}
              <Form.Group className="form-group sequence">
                <InputField
                  type="text"
                  name={`scalarConfiguration[${index}].add_scalar_sequence`}
                  placeholder="Sequence"
                  value={row.add_scalar_sequence}
                  readOnly
                />
              </Form.Group>

              {/* Scalar Name */}
              <Form.Group className="form-group scalar">
                <InputField
                  type="text"
                  name={`scalarConfiguration[${index}].add_scalar_name`}
                  id={`add_scalar_name_${index}`}
                  value={row.add_scalar_name}
                  placeholder="Enter Scalar Name"
                  onChange={(e) =>
                    handleChange(index, "add_scalar_name", e.target.value)
                  }
                />
                {errors[index]?.add_scalar_name && (
                  <div className="error text-danger">
                    {errors[index]?.add_scalar_name}
                  </div>
                )}
              </Form.Group>

              {/* Min Value */}
              <Form.Group className="form-group maximum">
                <InputField
                  type="number"
                  name={`scalarConfiguration[${index}].add_scalar_min_value`}
                  id={`add_scalar_min_value_${index}`}
                  value={row.add_scalar_min_value || ""}
                  placeholder="Enter Minimum value"
                  onChange={(e) =>
                    handleChange(index, "add_scalar_min_value", e.target.value)
                  }
                />
                {errors[index]?.add_scalar_min_value && (
                  <div className="error text-danger">
                    {errors[index]?.add_scalar_min_value}
                  </div>
                )}
                {errors[index]?.overlapping && (
                  <div className="error text-danger">
                    {errors[index]?.overlapping}
                  </div>
                )}
              </Form.Group>

              {/* Max Value */}
              <Form.Group className="form-group maximum">
                <InputField
                  type="number"
                  name={`scalarConfiguration[${index}].add_scalar_max_value`}
                  id={`add_scalar_max_value_${index}`}
                  placeholder="Enter Maximum value"
                  value={row.add_scalar_max_value || ""}
                  onChange={(e) =>
                    handleChange(index, "add_scalar_max_value", e.target.value)
                  }
                />
                {errors[index]?.add_scalar_max_value && (
                  <div className="error text-danger">
                    {errors[index]?.add_scalar_max_value}
                  </div>
                )}
              </Form.Group>

              {/* Color */}
              <div className="color">
                <InputField
                  type="color"
                  className="form-control-color"
                  value={row?.add_scalar_color || ""}
                  name={`scalarConfiguration[${index}].add_scalar_color`}
                  id={`add_scalar_color_${index}`}
                  onChange={(e) =>
                    handleChange(index, "add_scalar_color", e.target.value)
                  }
                />
                {errors[index]?.add_scalar_color && (
                  <div className="error text-danger">
                    {errors[index]?.add_scalar_color}
                  </div>
                )}
              </div>

              {/* Add and Delete Buttons */}
              <div className="addeletebtn d-flex gap-2">
                {index !== 8 ? (
                  <Link onClick={addRow} className="addbtn addscaler">
                    <span>+</span>
                  </Link>
                ) : (
                  ""
                )}

                <Link
                  onClick={() => deleteRow(index)}
                  className={`deletebtn deletebtnscaler ${
                    index === 0 ? "invisibledeletebtn" : ""
                  }`}
                >
                  <em className="icon-delete" />
                </Link>
              </div>
            </div>
          ))}
        </div>
        <Accordion onSelect={handleAccordionSelect}>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Scalar Color Palette</Accordion.Header>
            <Accordion.Body>
              <div>
                {activeKey === "0" && (
                  <ColorPellates
                    keyValue="scalrPalette"
                    data={score}
                    value={currentColorPallet?.colorPaletteID}
                    handleColorPicker={(value) => {
                      mapColorsToScalars(value);
                    }}
                    ignoreCurrentDefaultFlag={ignoreCurrentDefault}
                  />
                )}
              </div>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>Participant Report-Summary</Accordion.Header>
            <Accordion.Body>
              {/* <div className="d-flex justify-content-end">
                <Link
                  href=""
                  className="link-primary d-flex align-items-center mb-2"
                  onClick={() => copyCommentShow("Summary")}
                >
                  <OverlayTrigger
                    overlay={
                      <Tooltip id="tooltip-disabled">
                        Copy Comment from any of the existing reports.
                      </Tooltip>
                    }
                  >
                    <span className="d-flex align-items-center">
                      <em
                        disabled
                        style={{ pointerEvents: "none" }}
                        className="icon-info-circle me-1"
                      />
                    </span>
                  </OverlayTrigger>
                  Copy Comments
                </Link>
              </div> */}
              <Form.Group className="form-group mb-3">
                <Form.Label>
                  Report Name <sup>*</sup>
                </Form.Label>
                <InputField
                  type="text"
                  name="summary_report_name"
                  placeholder="Report Name"
                  onChange={handleChangeReport}
                />
              </Form.Group>
              <Form.Group className="form-group mb-3">
                <Form.Label>Opening Comment</Form.Label>
                <TextEditor
                  value={formData.summary_opening_comment}
                  onChange={(value) =>
                    handleTextAditor(value, "summary_opening_comment")
                  }
                />
              </Form.Group>
              <Form.Group className="form-group mb-3">
                <Form.Label>Closing Comment</Form.Label>
                <TextEditor
                  value={formData.summary_closing_comment}
                  onChange={(value) =>
                    handleTextAditor(value, "summary_closing_comment")
                  }
                />
              </Form.Group>

              <Accordion>
                <Accordion.Item eventKey="11">
                  <Accordion.Header> Chart Options </Accordion.Header>
                  <Accordion.Body>
                    <div className="d-sm-flex summarychart flex-wrap gap-2 mb-xl-4 mb-3 pb-xl-2 pb-0">
                      <Form.Group className="form-group">
                        <Form.Label>Chart Type:</Form.Label>

                        <SelectField
                          placeholder="Chart Type"
                          options={chartTypeOptions}
                          name="summary_chart_type"
                          onChange={(selectedOption) => {
                            handleSelectChange(
                              selectedOption,
                              "summary_chart_type"
                            );
                          }}
                          value={formData.summary_chart_type}
                        />
                      </Form.Group>
                      <Form.Group className="form-group">
                        <Form.Label>Legend:</Form.Label>
                        <SelectField
                          placeholder="Legend"
                          options={legendOptions}
                          name="summary_legend_position"
                          onChange={(selectedOption) =>
                            handleSelectChange(
                              selectedOption,
                              "summary_legend_position"
                            )
                          }
                          value={formData.summary_legend_position}
                        />
                      </Form.Group>
                      <Form.Group className="form-group">
                        <Form.Label>Font Size:</Form.Label>
                        <SelectField
                          placeholder="Font Size"
                          options={fontSizeOptions}
                          name="summary_font_size"
                          onChange={(selectedOption) =>
                            handleSelectChange(
                              selectedOption,
                              "summary_font_size"
                            )
                          }
                          value={formData.summary_font_size}
                        />
                      </Form.Group>

                      <Form.Group className="form-group">
                        <Form.Label>Data Label:</Form.Label>
                        <SelectField
                          placeholder="Data Label"
                          options={getFilteredDataLabelOptions(
                            formData.summary_switch_axis
                          )}
                          name="summary_data_label"
                          onChange={(selectedOption) =>
                            handleSelectChange(
                              selectedOption,
                              "summary_data_label"
                            )
                          }
                          // value={
                          //   formData.summary_switch_axis
                          //     ? { value: "center", label: "Center" }
                          //     : formData.summary_data_label
                          // }
                          value={formData.summary_data_label}
                        />
                      </Form.Group>
                      <Form.Group className="form-group">
                        <Form.Label>Scalar Color Opacity:</Form.Label>
                        <div>
                          <RangeSlider
                            value={formData.summary_scalar_opacity}
                            onChange={handleChangeReport}
                            min={0}
                            max={100}
                            name="summary_scalar_opacity"
                            placeholder="Adjust Opacity"
                            className="form-range"
                          />
                        </div>
                      </Form.Group>
                      <Form.Group className="form-group switchaxis d-flex align-items-center">
                        <Form.Label className="mb-0 me-2">
                          Switch Axis:
                        </Form.Label>
                        <div className="switchBtn">
                          <InputField
                            type="checkbox"
                            id="switchaxis1"
                            name="summary_switch_axis"
                            onChange={handleSwitchChange}
                            value={formData.summary_switch_axis}
                            disabled={false}
                          />
                          <label htmlFor="switchaxis1" />
                        </div>
                      </Form.Group>
                      <Form.Group className="form-group">
                        <div className="color w-100 d-flex align-items-center">
                          <Form.Label className="w-auto me-2 mb-0">
                            Data Label Color:
                          </Form.Label>
                          <InputField
                            className="form-control-color p-1"
                            type="color"
                            id="myColor6"
                            defaultValue="0968AC"
                            title="Choose a color"
                            name="summary_db_color"
                            onChange={handleColorChange}
                            value={formData.summary_db_color}
                          />
                        </div>
                      </Form.Group>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>

              <div>
                <Accordion>
                  <Accordion.Item eventKey="12">
                    <Accordion.Header> Chart Color Options </Accordion.Header>
                    <Accordion.Body>
                      {activeKey === "1" && (
                        <ColorPellates
                          keyValue="summaryPalette"
                          data={score}
                          value={summaryColorPallet?.colorPaletteID}
                          handleColorPicker={(value) => {
                            handleColorPallet(value, "summary");
                          }}
                        />
                      )}
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </div>
              <div className="mt-4" />
              {formData?.summary_chart_type?.value &&
                (formData.summary_switch_axis ||
                  !formData.summary_switch_axis) &&
                renderSummaryChart(formData?.summary_chart_type?.value)}

              <div className="d-flex justify-content-end mt-xl-4 mt-3">
                <Button
                  varian="primary"
                  className="ripple-effect"
                  onClick={() => handleClick("Summary")}
                >
                  Preview
                </Button>
              </div>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>Participant Report-Detailed </Accordion.Header>
            <Accordion.Body>
              {/* <div className="d-flex justify-content-end">
                <Link
                  href="#!"
                  className="link-primary d-flex align-items-center mb-2"
                  onClick={() => copyCommentShow("Detail")}
                >
                  <OverlayTrigger
                    overlay={
                      <Tooltip id="tooltip-disabled">
                        Copy Comment from any of the existing reports.
                      </Tooltip>
                    }
                  >
                    <span className="d-flex align-items-center">
                      <em
                        disabled
                        style={{ pointerEvents: "none" }}
                        className="icon-info-circle me-1"
                      />
                    </span>
                  </OverlayTrigger>
                  Copy Comments
                </Link>
              </div> */}
              <Form.Group className="form-group mb-3">
                <Form.Label>
                  Report Name <sup>*</sup>
                </Form.Label>
                <InputField
                  type="text"
                  name="detail_report_name"
                  placeholder="Report Name"
                  onChange={handleChangeReport}
                />
              </Form.Group>
              <Form.Group className="form-group mb-3">
                <Form.Label>Opening Comment</Form.Label>
                <TextEditor
                  value={formData?.report_detail_opening_comment}
                  onChange={(value) =>
                    handleTextAditor(value, "report_detail_opening_comment")
                  }
                />
              </Form.Group>
              <Form.Group className="form-group mb-3">
                <Form.Label>
                  Closing Comment<sup>*</sup>
                </Form.Label>
                <TextEditor
                  value={formData?.report_detail_closing_comment}
                  onChange={(value) =>
                    handleTextAditor(value, "report_detail_closing_comment")
                  }
                />
              </Form.Group>
              <Accordion>
                <Accordion.Item eventKey="15">
                  <Accordion.Header> Chart Options </Accordion.Header>
                  <Accordion.Body>
                    <div className="d-sm-flex summarychart flex-wrap gap-2 mb-xl-4 mb-3 pb-xl-2 pb-0">
                      <Form.Group className="form-group">
                        <Form.Label>Chart Type:</Form.Label>
                        <SelectField
                          placeholder="Chart Type"
                          options={chartTypeOptions}
                          name="detail_chart_type"
                          onChange={(selectedOption) => {
                            handleSelectChange(
                              selectedOption,
                              "detail_chart_type"
                            );
                          }}
                          value={formData.detail_chart_type}
                        />
                      </Form.Group>
                      <Form.Group className="form-group">
                        <Form.Label>Legend:</Form.Label>
                        <SelectField
                          placeholder="Legend"
                          options={legendOptions}
                          name="detail_legend_position"
                          onChange={(selectedOption) =>
                            handleSelectChange(
                              selectedOption,
                              "detail_legend_position"
                            )
                          }
                          value={formData.detail_legend_position}
                        />
                      </Form.Group>
                      <Form.Group className="form-group">
                        <Form.Label>Font Size:</Form.Label>
                        <SelectField
                          placeholder="Font Size"
                          options={fontSizeOptions}
                          name="detail_font_size"
                          onChange={(selectedOption) =>
                            handleSelectChange(
                              selectedOption,
                              "detail_font_size"
                            )
                          }
                          value={formData.detail_font_size}
                        />
                      </Form.Group>
                      <Form.Group className="form-group">
                        <Form.Label>Data Label:</Form.Label>
                        <SelectField
                          placeholder="Data Label"
                          options={getFilteredDataLabelOptions(
                            formData.detail_switch_axis
                          )}
                          name="detail_data_label"
                          onChange={(selectedOption) =>
                            handleSelectChange(
                              selectedOption,
                              "detail_data_label"
                            )
                          }
                          // value={
                          //   formData.detail_switch_axis
                          //     ? { value: "center", label: "Center" }
                          //     : formData.detail_data_label
                          // }
                          value={formData.detail_data_label}
                        />
                      </Form.Group>
                      <Form.Group className="form-group">
                        <Form.Label>Scalar Color Opacity:</Form.Label>
                        <div>
                          <RangeSlider
                            value={formData.detail_scalar_opacity}
                            onChange={handleChangeReport}
                            min={0}
                            max={100}
                            name="detail_scalar_opacity"
                            placeholder="Adjust Opacity"
                            className="form-range"
                          />
                        </div>
                      </Form.Group>
                      <Form.Group className="form-group switchaxis d-flex align-items-center">
                        <Form.Label className="mb-0 me-2">
                          Switch Axis:
                        </Form.Label>
                        <div className="switchBtn">
                          <InputField
                            type="checkbox"
                            id="switchaxis2"
                            name="detail_switch_axis"
                            onChange={handleSwitchChange}
                            value={formData.detail_switch_axis}
                            disabled={false}
                          />
                          <Form.Label htmlFor="switchaxis2" />
                        </div>
                      </Form.Group>
                      <Form.Group className="form-group">
                        <div className="color w-100 d-flex align-items-center">
                          <Form.Label className="w-auto me-2 mb-0">
                            Data Label Color:
                          </Form.Label>
                          <InputField
                            className="form-control-color"
                            type="color"
                            id="myColor6"
                            defaultValue="0968AC"
                            title="Choose a color"
                            name="detail_db_color"
                            onChange={handleColorChange}
                            value={formData.detail_db_color}
                          />
                        </div>
                      </Form.Group>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>

              <div>
                <Accordion>
                  <Accordion.Item eventKey="14">
                    <Accordion.Header> Chart Color Options </Accordion.Header>
                    <Accordion.Body>
                      {activeKey === "2" && (
                        <ColorPellates
                          keyValue="detailPalette"
                          data={score}
                          value={detailColorPallet?.colorPaletteID}
                          handleColorPicker={(value) => {
                            handleColorPallet(value, "detail");
                          }}
                        />
                      )}
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </div>

              <div className="mt-4" />
              {formData?.detail_chart_type?.value &&
                (formData.detail_switch_axis || !formData.detail_switch_axis) &&
                scalarConfiguration &&
                renderChart(formData?.detail_chart_type?.value)}
              <div className="d-flex justify-content-end mt-xl-4 mt-3">
                <Button
                  type="button" // Change type from "submit" to "button"
                  variant="primary"
                  className="ripple-effect"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default form submission
                    handleClick("Detail");
                  }}
                >
                  Preview
                </Button>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
      {showPreview && (
        <PreviewModal
          showPreview={showPreview}
          setshowPreview={setshowPreview}
          previewData={getPreviewData()}
          reportType={previewType}
          isEditPage={isEditPage}
          detailChart={renderChart}
          summaryChart={renderSummaryChart}
        />
      )}

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
                  Survey Name<sup>*</sup>
                </Form.Label>
                <SelectField
                  placeholder="Select Survey Name"
                  options={survey}
                  onChange={(selected) => {
                    setSurveyID(selected?.value);
                    fetchReport(selected?.value);
                  }}
                  value={survey.find((option) => option?.value === surveyID)}
                />
              </Form.Group>
            </Col>

            <Col lg={6}>
              <Form.Group className="form-group">
                <Form.Label>
                  Report Name<sup>*</sup>
                </Form.Label>
                <SelectField
                  placeholder="Select Report Name"
                  options={report}
                  onChange={(selected) => {
                    fetchReportSummary(selected?.value);
                    setReportID(selected?.value);
                  }}
                  value={report.find((option) => option?.value === reportID)}
                  isDisabled={report?.length === 0}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="row rowGap mt-2">
            <Col lg={12}>
              {reportID !== "" &&
                copyOpeningComment !== "" &&
                copyClosingComment !== "" && (
                  <div>
                    <div>
                      <h6>opening comment</h6>
                      <TextEditor
                        value={copyOpeningComment}
                        isEditable={false}
                      />
                    </div>

                    <div className="mt-3">
                      <h6>closing comment</h6>
                      <TextEditor
                        value={copyClosingComment}
                        isEditable={false}
                      />
                    </div>

                    <div className="d-flex justify-content-end mt-3">
                      <Button
                        variant="primary"
                        className="ripple-effect me-2"
                        onClick={copyToReport}
                      >
                        Copy to Report
                      </Button>

                      <Button
                        variant="secondary"
                        className="ripple-effect"
                        onClick={copyCommentClose}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
            </Col>
          </Row>
        </Form>
      </ModalComponent>
    </>
  );
};

export default forwardRef(ScalarConfiguration);

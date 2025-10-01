import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
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
import { SURVEYS_MANAGEMENT } from "apiEndpoints/SurveysManagement";
import { commonService } from "services/common.service";
import { htmlToPlainText } from "utils/common.util";

import BarChart from "pages/Admin/Surveys/Charts/BarChart";
import SpiderChart from "pages/Admin/Surveys/Charts/SpiderChart";
import ColumnChart from "pages/Admin/Surveys/Charts/ColumnChart";
import LineChart from "pages/Admin/Surveys/Charts/LineChart";
import ScatterChart from "pages/Admin/Surveys/Charts/ScatterChart";
import PreviewModal from "../../CreateSurvey/ModelComponent/PreviewModel";
import {
  InputField,
  ColorPellates,
  TextEditor,
  SelectField,
  RangeSlider,
  ModalComponent,
} from "../../../../../../components";
import BenchmarkComp from "../Components/BenchmarkComp";
import { useSurveyDataOnNavigations } from "customHooks";

const ScalarConfiguration = (
  {
    score,
    chartTypeOptions,
    legendOptions,
    fontSizeOptions,
    dataLabelOptions,
    userData,
    companyID,
    reviewData,
    refSurveyID,
  },
  ref
) => {
  const [scalarConfiguration, setScalarConfiguration] = useState([]);

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
  const isOverlappingRef = useRef(false);

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
    summary_scalar_opacity: 100,
    summary_switch_axis: false,
    summary_db_color: "#000000",
    detail_chart_type: { value: "bar", label: "Bar" },
    detail_legend_position: { value: "left", label: "Left" },
    detail_font_size: { value: 8, label: "8" },
    detail_data_label: { value: "top", label: "Top" },
    detail_scalar_opacity: 100,
    detail_switch_axis: false,
    detail_db_color: "#000000",
  });

  const ignoreCurrentDefault = true;
  // Add state for tracking palette names

  // const [summaryPaletteName, setSummaryPaletteName] = useState("");
  // const [detailPaletteName, setDetailPaletteName] = useState("");

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

  const [summaySeriesData] = useState([
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
  const [previewType, setPreviewType] = useState("Summary"); // Add this state

  const isEditPage = true;

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

  const chartRefValue = (cValue) => {
    const selChart = chartTypeOptions.find((ele) => ele.refValue === cValue);
    if (selChart) {
      return selChart;
    } else {
      return { value: "bar", label: "Bar" };
    }
  };

  const legendRefValue = (cValue) => {
    const selLegent = legendOptions.find((ele) => ele.refValue === cValue);
    if (selLegent) {
      return selLegent;
    } else {
      return { value: "left", label: "Left" };
    }
  };

  const fontSizeRefValue = (cValue) => {
    const selFontSize = fontSizeOptions.find((ele) => ele.refValue === cValue);
    if (selFontSize) {
      return selFontSize;
    } else {
      return { value: 8, label: "8" };
    }
  };

  const dataLabelRefValue = (cValue) => {
    const selDataLabel = dataLabelOptions.find(
      (ele) => ele.refValue === cValue
    );
    if (selDataLabel) {
      return selDataLabel;
    } else {
      return { value: "bottom", label: "Bottom" };
    }
  };

  useEffect(() => {
    if (companyID) {
      fetchSurvey();

      // Handle scalar configuration from survey_scalar
      if (reviewData?.survey_scalar?.length > 0) {
        const scalars = reviewData.survey_scalar.map((scalar) => ({
          scalar_id: scalar.scalarID,
          add_scalar_sequence: scalar.scalarSequence,
          add_scalar_name: scalar.scalarName,
          add_scalar_min_value: scalar.scalarMinValue,
          add_scalar_max_value: scalar.scalarMaxValue,
          add_scalar_color: scalar.scalarColor,
        }));
        setScalarConfiguration(scalars);
      }

      // Handle report configurations
      // eslint-disable-next-line no-shadow
      reviewData?.survey_report?.forEach((report) => {
        if (report.reportType === "Summary") {
          const filters = report.reportFilters;
          setFormData((prevData) => ({
            ...prevData,
            summary_report_name: report.reportName || "",
            summary_opening_comment: htmlToPlainText(
              report.summaryOpeningComment || ""
            ),
            summary_closing_comment: htmlToPlainText(
              report.summaryClosingComment || ""
            ),
            summary_chart_type: {
              value: chartRefValue(filters.summaryChartType).value,
              label: chartRefValue(filters.summaryChartType).label,
            },
            summary_legend_position: {
              value: legendRefValue(filters.summaryChartLegendPosition).value,
              label: legendRefValue(filters.summaryChartLegendPosition).label,
            },
            summary_font_size: {
              value: fontSizeRefValue(filters.summaryChartFontSize).value,
              label: fontSizeRefValue(filters.summaryChartFontSize).label,
            },
            summary_data_label: {
              value: dataLabelRefValue(filters.summaryChartDataLabelPosition)
                .value,
              label: dataLabelRefValue(filters.summaryChartDataLabelPosition)
                .label,
            },
            summary_scalar_opacity: Number(
              filters.summaryChartScalarOpacity || 10
            ),
            summary_switch_axis: filters.summaryChartAxis === "true",
            summary_db_color: filters.summaryChartDataLabelColor || "#000000",
          }));

          // Update summary chart options
          setSummaryOptionsDetails((prevOptions) => ({
            ...prevOptions,
            chart: {
              ...prevOptions.chart,
              type: filters.summaryChartType || "bar",
            },
            legend: {
              ...prevOptions.legend,
              position:
                (filters.summaryChartLegendPosition === "hidden"
                  ? "left"
                  : filters.summaryChartLegendPosition) || "left",
              show: filters.summaryChartLegendPosition !== "hidden",
            },
            dataLabels: {
              ...prevOptions.dataLabels,
              enabled: filters.summaryChartDataLabelPosition !== "none",
              position: filters.summaryChartDataLabelPosition || "top",
              style: {
                ...prevOptions.dataLabels.style,
                fontSize: `${filters.summaryChartFontSize || 8}px`,
                colors: [filters.summaryChartDataLabelColor || "#000000"],
              },
            },
            fill: {
              ...prevOptions.fill,
              opacity: Number(filters.summaryChartScalarOpacity || 100) / 100,
            },
            plotOptions: {
              ...prevOptions.plotOptions,
              bar: {
                ...prevOptions.plotOptions.bar,
                horizontal: filters.summaryChartAxis === "true",
                dataLabels: {
                  ...prevOptions.plotOptions.bar.dataLabels,
                  position: filters.summaryChartDataLabelPosition || "top",
                },
              },
            },
            annotations: {
              ...prevOptions.annotations,
              yaxis: [...prevOptions.annotations.yaxis].map((item) => ({
                ...item,
                opacity: filters.summary_scalar_opacity
                  ? (filters.summary_scalar_opacity / 100).toFixed(1)
                  : 0.1,
              })),
            },
          }));
        } else if (report.reportType === "Detailed") {
          const filters = report.reportFilters;
          setFormData((prevData) => ({
            ...prevData,
            detail_report_name: report.reportName || "",
            report_detail_opening_comment: htmlToPlainText(
              report.detailedOpeningComment || ""
            ),
            report_detail_closing_comment: htmlToPlainText(
              report.detailedClosingComment || ""
            ),
            detail_chart_type: {
              value: chartRefValue(filters.detailedChartType).value,
              label: chartRefValue(filters.detailedChartType).label,
            },
            detail_legend_position: {
              value: legendRefValue(filters.detailedChartLegendPosition).value,
              label: legendRefValue(filters.detailedChartLegendPosition).label,
            },
            detail_font_size: {
              value: fontSizeRefValue(filters.detailedChartFontSize).value,
              label: fontSizeRefValue(filters.detailedChartFontSize).label,
            },
            detail_data_label: {
              value: dataLabelRefValue(filters.detailedChartDataLabelPosition)
                .value,
              label: dataLabelRefValue(filters.detailedChartDataLabelPosition)
                .label,
            },
            detail_scalar_opacity: Number(
              filters.detailedChartScalarOpacity || 10
            ),
            detail_switch_axis: filters.detailedChartAxis === "true",
            detail_db_color: filters.detailedChartDataLabelColor || "#000000",
          }));

          // Update detail chart options
          setDetailOptionsDetails((prevOptions) => ({
            ...prevOptions,
            chart: {
              ...prevOptions.chart,
              type: filters.detailedChartType || "bar",
            },
            legend: {
              ...prevOptions.legend,
              position:
                (filters.detailedChartLegendPosition === "hidden"
                  ? "left"
                  : filters.detailedChartLegendPosition) || "left",
              show: filters.detailedChartLegendPosition !== "hidden",
            },
            dataLabels: {
              ...prevOptions.dataLabels,
              enabled: filters.detailedChartDataLabelPosition !== "none",
              position: filters.detailedChartDataLabelPosition || "top",
              style: {
                ...prevOptions.dataLabels.style,
                fontSize: `${filters.detailedChartFontSize || 8}px`,
                colors: [filters.detailedChartDataLabelColor || "#000000"],
              },
            },
            fill: {
              ...prevOptions.fill,
              opacity: Number(filters.detailedChartScalarOpacity || 100) / 100,
            },
            plotOptions: {
              ...prevOptions.plotOptions,
              bar: {
                ...prevOptions.plotOptions.bar,
                horizontal: filters.detailedChartAxis === "true",
                dataLabels: {
                  ...prevOptions.plotOptions.bar.dataLabels,
                  position: filters.detailedChartDataLabelPosition || "top",
                },
              },
            },
          }));
        }
      });
    }
  }, [companyID]);

  const updateDataColorsSummaryGraph = (color) => {
    setSummaryOptionsDetails((prevOptions) => ({
      ...prevOptions,
      colors: color.map((item) => (item.colorCode ? item.colorCode : item)),
    }));
  };

  const updateDataColorsDeatilGraph = (color) => {
    setDetailOptionsDetails((prevOptions) => ({
      ...prevOptions,
      colors: color,
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

  // Modify mapColorsToScalars to include palette name tracking
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

  // Modify handleColorPallet to include name checks
  const handleColorPallet = (value, type) => {
    const returnColors = getColorCodes(value?.colors);

    if (type === "summary") {
      // Update summary palette with name tracking
      updateDataColorsSummaryGraph(returnColors);
      setSwappedSummaryOptionsDetails((prev) => ({
        ...prev,
        colors: returnColors,
      }));
      setSummaryColorPallet({
        colorPaletteID: value?.colorPaletteID,
        colors: value?.colors,
        paletteName: value?.paletteName,
      });
      // setSummaryPaletteName(value?.paletteName);
      setFormData((prevData) => ({
        ...prevData,
        summaryColorPaletteID: value?.colorPaletteID, // Set summary-specific ID
      }));
      setRSChartColor(returnColors);
    } else if (type === "detail") {
      // Update detail palette with name tracking
      updateDataColorsDeatilGraph(returnColors);
      setDetailOptionsDetails((prev) => ({
        ...prev,
        colors: returnColors,
      }));
      setSwappedDetailOptionsDetails((prev) => ({
        ...prev,
        colors: returnColors,
      }));
      setDetailColorPallet({
        colorPaletteID: value?.colorPaletteID,
        colors: value?.colors,
        paletteName: value?.paletteName,
      });
      // setDetailPaletteName(value?.paletteName);
      setFormData((prevData) => ({
        ...prevData,
        detailedColorPaletteID: value?.colorPaletteID, // Set detail-specific ID
      }));
      setPDChartColor(returnColors);
    }
  };

  // Modify the useEffect that handles initial palette setup
  useEffect(() => {
    if (score?.defaultColor) {
      const colorFields = [
        "dataVisualization",
        "defaultColor",
        "divergent",
        "myColors",
        "sequential",
      ];

      // Function to find a color palette across all specified fields
      const findPalette = (paletteID, paletteName) => {
        for (const field of colorFields) {
          if (Array.isArray(score[field])) {
            const found = score[field].find(
              (color) =>
                Number(color.paletteID) === Number(paletteID) &&
                color.paletteName === paletteName
            );
            if (found) return found;
          }
        }
        return null;
      };

      if (
        reviewData &&
        reviewData?.survey_details &&
        reviewData?.survey_details?.colorPaletteID
      ) {
        // Set current color palette
        const currentColorPalette = reviewData?.survey_details?.colorPaletteID;

        const currentColor = findPalette(
          currentColorPalette,
          reviewData?.survey_details?.paletteName
        );

        const finalColorPalette = currentColor;

        setCurrentColorPallet({
          colorPaletteID: finalColorPalette?.paletteID,
          colors: finalColorPalette?.colors,
          paletteName: finalColorPalette?.paletteName,
        });
      } else {
        setCurrentColorPallet({
          colorPaletteID: score?.defaultColor[0]?.PaletteID,
          colors: score?.defaultColor[0]?.colors,
          paletteName: "defaultColor",
        });
      }

      if (
        reviewData &&
        reviewData?.survey_report &&
        reviewData?.survey_report[0] &&
        reviewData?.survey_report[0]?.reportFilters &&
        reviewData?.survey_report[0]?.reportFilters?.summaryColorPaletteID
      ) {
        // Find summary palette
        const summaryPaletteID =
          reviewData?.survey_report[0]?.reportFilters?.summaryColorPaletteID;
        const summaryPalette = findPalette(
          summaryPaletteID,
          reviewData?.survey_report[0]?.reportFilters?.paletteName
        );
        const finalSummaryPalette = summaryPalette;

        setSummaryColorPallet({
          colorPaletteID: finalSummaryPalette?.paletteID,
          colors: finalSummaryPalette?.colors,
          paletteName: finalSummaryPalette?.paletteName,
        });
        // setSummaryPaletteName(finalSummaryPalette?.paletteName);

        // Update colors if palettes are found
        if (finalSummaryPalette?.colors) {
          const summaryColors = getColorCodes(finalSummaryPalette.colors);
          updateDataColorsSummaryGraph(summaryColors);
          setRSChartColor(summaryColors);
        }
      } else {
        setSummaryColorPallet({
          colorPaletteID: score?.defaultColor[0]?.PaletteID,
          colors: score?.defaultColor[0]?.colors,
          paletteName: "defaultColor",
        });
        // setSummaryPaletteName("defaultColor");
        updateDataColorsSummaryGraph(score?.defaultColor[0]?.colors);
        setRSChartColor(score?.defaultColor[0]?.colors);
      }

      if (
        reviewData &&
        reviewData?.survey_report &&
        reviewData?.survey_report[1] &&
        reviewData?.survey_report[1]?.reportFilters &&
        reviewData?.survey_report[1]?.reportFilters?.detailedColorPaletteID
      ) {
        // Find detail palette
        const detailPaletteID =
          reviewData?.survey_report[1]?.reportFilters?.detailedColorPaletteID;
        const detailPalette = findPalette(
          detailPaletteID,
          reviewData?.survey_report[1]?.reportFilters?.paletteName
        );
        const finalDetailPalette = detailPalette;

        setDetailColorPallet({
          colorPaletteID: finalDetailPalette?.paletteID,
          colors: finalDetailPalette?.colors,
          paletteName: finalDetailPalette?.paletteName,
        });
        // setDetailPaletteName(finalDetailPalette?.paletteName);

        if (finalDetailPalette?.colors) {
          const detailColors = getColorCodes(finalDetailPalette.colors);
          updateDataColorsDeatilGraph(detailColors);
          setPDChartColor(detailColors);
        }
      } else {
        setDetailColorPallet({
          colorPaletteID: score?.defaultColor[0]?.PaletteID,
          colors: score?.defaultColor[0]?.colors,
          paletteName: "defaultColor",
        });
        // setDetailPaletteName(score?.defaultColor[0]?.colors);
        setPDChartColor(score?.defaultColor[0]?.colors);
      }
    }
  }, [score, reviewData]);

  const [errors, setErrors] = useState([]);

  // Handler to update the form data
  const handleChangeReport = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Handle opacity for both summary and detail charts
    if (name === "summary_scalar_opacity") {
      const result = (value / 100).toFixed(1);
      // eslint-disable-next-line no-use-before-define
      updateFillOpacity(result);
    } else if (name === "detail_scalar_opacity") {
      const result = (value / 100).toFixed(1);
      // eslint-disable-next-line no-use-before-define
      updateDetailChartSettings.fillOpacity(result);
    }
  };

  const handleTextAditor = (value, name) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    const isSummary = name === "summary_switch_axis";
    const chartType = isSummary ? "summary" : "detail";

    // Update form data
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked,
      // [`${chartType}_data_label`]: checked
      //   ? { value: "center", label: "Center" }
      //   : prevData[`${chartType}_data_label`],
    }));

    // Update swap state

    // Update chart options
    const setOptionsFunction = isSummary
      ? setSummaryOptionsDetails
      : setDetailOptionsDetails;
    const currentColors = isSummary
      ? summaryOptionsDetails.colors
      : detailOptionsDetails.colors;

    setOptionsFunction((prevOptions) => ({
      ...prevOptions,
      colors: currentColors,
      plotOptions: {
        ...prevOptions.plotOptions,
        bar: {
          ...prevOptions.plotOptions.bar,
          horizontal: checked,
          dataLabels: {
            ...prevOptions.plotOptions.bar.dataLabels,
            position: checked
              ? "center"
              : formData[`${chartType}_data_label`].value,
          },
        },
      },
    }));
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
    },
  };

  // Handle select field change
  const handleSelectChange = (selectedOption, name) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: selectedOption,
    }));

    // Summary chart handlers
    if (name === "summary_chart_type") {
      handleChartTypeChange(selectedOption);
      // eslint-disable-next-line no-use-before-define
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
      // eslint-disable-next-line no-use-before-define
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
    console.log("Checking scalars", scalars);
    for (let i = 0; i < scalars.length; i += 1) {
      const current = scalars[i];
      for (let j = i + 1; j < scalars.length; j += 1) {
        const compare = scalars[j];

        if (
          Number(current.add_scalar_min_value) <=
            Number(compare.add_scalar_max_value) &&
          Number(current.add_scalar_max_value) >=
            Number(compare.add_scalar_min_value)
        ) {
          // Set error for both overlapping rows
          setErrors((prev) => {
            const newErrors = [...prev];
            if (!newErrors[i]) newErrors[i] = {};
            if (!newErrors[j]) newErrors[j] = {};
            newErrors[i].overlapping =
              "This range overlaps with another scalar";
            newErrors[j].overlapping =
              "This range overlaps with another scalar";
            return newErrors;
          });
          return true;
        }
      }
    }
    // Clear overlapping errors if no overlaps found
    setErrors((prev) => {
      const newErrors = [...prev];
      newErrors.forEach((error) => {
        if (error) delete error.overlapping;
      });
      return newErrors;
    });
    return false;
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
    const updatedErrors = [...errors];
    let isValid = true; // assume we pass all validations

    if (!updatedErrors[index]) {
      updatedErrors[index] = {};
    }

    updatedErrors[index][field] = ""; // Reset error for the field

    // Scalar name validation
    if (field === "add_scalar_name" && !value) {
      updatedErrors[index][field] = "Scalar name is required";
      isValid = false;
    } else if (value.length > 25) {
      updatedErrors[index][field] = "Scalar name must not exceed 25 characters";
      isValid = false;
    }

    // Min/Max value validation
    if (
      (field === "add_scalar_min_value" || field === "add_scalar_max_value") &&
      Number(value) <= 0
    ) {
      updatedErrors[index][field] = "Positive non-zero number required";
      isValid = false;
    }

    // Color validation (optional, if you need to ensure a valid hex color)
    if (field === "add_scalar_color" && !/^#[0-9A-F]{6}$/i.test(value.trim())) {
      updatedErrors[index][field] = "Invalid color code";
      isValid = false;
    }

    setErrors(updatedErrors);
    return isValid;
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
    const updatedRows = scalarConfiguration.filter((_, i) => i !== index);
    setScalarConfiguration(updatedRows);
  };

  useEffect(() => {
    if (currentColorPallet?.colors?.length > 0) {
      // eslint-disable-next-line no-use-before-define
      mapColorsToScalars(currentColorPallet);
    }
  }, [scalarConfiguration?.length, currentColorPallet?.colors?.length]);

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

  // Add this useEffect to keep swappedSummaryOptionsDetails in sync
  useEffect(() => {
    setSwappedSummaryOptionsDetails(() => ({
      ...summaryOptionsDetails, // Copy all properties from summaryOptionsDetails
      plotOptions: {
        ...summaryOptionsDetails.plotOptions,
        bar: {
          ...summaryOptionsDetails.plotOptions.bar,
          horizontal: true, // Keep horizontal true for swapped view
        },
      },
      // Convert y-axis annotations to x-axis for horizontal view
      annotations: {
        xaxis:
          summaryOptionsDetails.annotations?.yaxis?.map((annotation) => ({
            x: annotation.y,
            x2: annotation.y2,
            borderColor: annotation.borderColor,
            fillColor: annotation.fillColor,
            label: {
              ...annotation.label,
              position: "top",
              offsetY: -35,
              rotate: 1,
            },
          })) || [],
      },
      // Maintain other specific swapped configurations
      xaxis: {
        ...summaryOptionsDetails.yaxis,
        position: "bottom",
      },
      yaxis: {
        ...summaryOptionsDetails.xaxis,
        labels: {
          ...summaryOptionsDetails.xaxis.labels,
          rotate: 0,
        },
      },
    }));
  }, [summaryOptionsDetails]);

  // Add this useEffect to keep swappedDetailOptionsDetails in sync
  useEffect(() => {
    setSwappedDetailOptionsDetails(() => ({
      ...detailOptionsDetails, // Copy all properties from detailOptionsDetails
      plotOptions: {
        ...detailOptionsDetails.plotOptions,
        bar: {
          ...detailOptionsDetails.plotOptions.bar,
          horizontal: true, // Keep horizontal true for swapped view
        },
      },
      // Convert y-axis annotations to x-axis for horizontal view
      annotations: {
        xaxis:
          detailOptionsDetails.annotations?.yaxis?.map((annotation) => ({
            x: annotation.y,
            x2: annotation.y2,
            borderColor: annotation.borderColor,
            fillColor: annotation.fillColor,
            label: {
              ...annotation.label,
              position: "top",
              offsetY: -35,
              rotate: 1,
            },
          })) || [],
      },
      // Maintain other specific swapped configurations
      xaxis: {
        ...detailOptionsDetails.yaxis,
        position: "bottom",
      },
      yaxis: {
        ...detailOptionsDetails.xaxis,
        labels: {
          ...detailOptionsDetails.xaxis.labels,
          rotate: 0,
        },
      },
    }));
  }, [detailOptionsDetails]);

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
  const handleClick = (type) => {
    setPreviewType(type);
    setshowPreview(true);
  };

  const getPreviewData = () => {
    if (previewType === "Summary") {
      return {
        chartOptions: formData.summary_switch_axis
          ? swappedSummaryOptionsDetails
          : summaryOptionsDetails,
        seriesData: summaySeriesData,
        chartType: formData?.summary_chart_type?.value,
        reportName: formData?.summary_report_name,
        openingComment: formData?.summary_opening_comment,
        closingComment: formData?.summary_closing_comment,
      };
    } else {
      return {
        chartOptions: formData.detail_switch_axis
          ? swappedDetailOptionsDetails
          : detailOptionsDetails,
        seriesData: summaySeriesData,
        chartType: formData?.detail_chart_type?.value,
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
  const isBarChart = (chartType) => {
    return chartType?.value === "bar";
  };

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
    <div className="pageTitle">
      <h2>Scalar Configuration</h2>
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
                {index !== 9 ? (
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
                {/* {currentColorPallet?.colorPaletteID} */}
                {activeKey === "0" && (
                  <ColorPellates
                    keyValue="scalarPalette"
                    data={score}
                    value={currentColorPallet?.colorPaletteID || ""}
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
              <div className="d-flex justify-content-end">
                {/* <Link
                  href=""
                  className="link-primary d-flex align-items-center mb-2"
                  onClick={(e) => {
                    e.preventDefault();
                    copyCommentShow("Summary");
                  }}
                >
                  Copy Comments
                </Link> */}
              </div>
              <Form.Group className="form-group mb-3">
                <Form.Label>Report Name</Form.Label>
                <InputField
                  type="text"
                  name="summary_report_name"
                  placeholder="Report Name"
                  onChange={handleChangeReport}
                  value={formData.summary_report_name}
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
                          // value={formData.summary_chart_type}
                          value={
                            chartTypeOptions.find(
                              (ele) =>
                                ele.value === formData.summary_chart_type.value
                            ) ?? formData.summary_chart_type
                          }
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
                            checked={formData.summary_switch_axis}
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
                            className="form-control-color"
                            type="color"
                            id="myColor6"
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
                      {/* {summaryColorPallet?.colorPaletteID} */}
                      {activeKey === "1" && (
                        <ColorPellates
                          keyValue="summaryPalette"
                          data={score}
                          value={summaryColorPallet?.colorPaletteID || ""}
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

              {/* <Chart
                options={
                  formData.summary_switch_axis
                    ? swappedSummaryOptionsDetails
                    : summaryOptionsDetails
                }
                series={summaySeriesData}
                type={formData?.summary_chart_type?.value}
                // type="radar"
                height={350}
              /> */}
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
              <div className="d-flex justify-content-end">
                {/* <Link
                  href="#!"
                  className="link-primary d-flex align-items-center mb-2"
                  onClick={(e) => {
                    e.preventDefault();
                    copyCommentShow("Detail");
                  }}
                >
                  Copy Comments
                </Link> */}
              </div>
              <Form.Group className="form-group mb-3">
                <Form.Label>Report Name</Form.Label>
                <InputField
                  type="text"
                  name="detail_report_name"
                  placeholder="Report Name"
                  onChange={handleChangeReport}
                  value={formData?.detail_report_name}
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
                <Accordion.Item eventKey="13">
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
                          // value={formData.detail_chart_type}
                          value={
                            chartTypeOptions.find(
                              (ele) =>
                                ele.value === formData.detail_chart_type.value
                            ) ?? formData.detail_chart_type
                          }
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
                            checked={formData.detail_switch_axis}
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
                {/* {detailColorPallet?.colorPaletteID} */}
                <Accordion>
                  <Accordion.Item eventKey="14">
                    <Accordion.Header> Chart Color Options </Accordion.Header>
                    <Accordion.Body>
                      {activeKey === "2" && (
                        <ColorPellates
                          keyValue="detailPalette"
                          data={score}
                          value={detailColorPallet?.colorPaletteID || ""}
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

              {/* <Chart
                options={
                  formData.detail_switch_axis
                    ? swappedDetailOptionsDetails
                    : detailOptionsDetails
                }
                series={summaySeriesData}
                type={formData?.detail_chart_type?.value}
                height={350}
              /> */}
              {formData?.detail_chart_type?.value &&
                (formData.detail_switch_axis || !formData.detail_switch_axis) &&
                scalarConfiguration &&
                renderChart(formData?.detail_chart_type?.value)}
              <div className="d-flex justify-content-end mt-xl-4 mt-3">
                <Button
                  varian="primary"
                  className="ripple-effect"
                  onClick={() => handleClick("Detail")}
                >
                  Preview
                </Button>
              </div>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="3">
            <Accordion.Header>Benchmark</Accordion.Header>
            <Accordion.Body>
              <BenchmarkComp companyID={companyID} surveyID={refSurveyID} />
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
    </div>
  );
};

export default forwardRef(ScalarConfiguration);

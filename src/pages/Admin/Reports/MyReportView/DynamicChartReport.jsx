import { Breadcrumb, Loader } from "components";
import { Link, useLocation } from "react-router-dom";
import { REPORTS_MANAGEMENT } from "apiEndpoints/ReportsManagement";
import { useAuth } from "customHooks";
import { useEffect, useState } from "react";
import { commonService } from "services/common.service";
import { SURVEYS_MANAGEMENT } from "apiEndpoints/SurveysManagement";
import { usePDF } from "react-to-pdf";
import adminRouteMap from "routes/Admin/adminRouteMap";
import DynamicDataMap from "./DynamicDataMap";
import toast from "react-hot-toast";
import Previewboxheader from "../Previews/Previewboxheader";
import Comments from "../Previews/Comments";
import ChartRenderer from "pages/Admin/Analytics/DemographicTrendAnalysis/CollapseAge/ChartRenderer";

export default function DynamicChartReport() {
  const location = useLocation();
  const { toPDF, targetRef } = usePDF({
    filename: "dynamic-report.pdf",
  });
  const { reportID } = location.state || {};
  const [showLoading, setShowLoading] = useState(true);

  // breadcrumb
  const breadcrumb = [
    {
      path: "#!",
      name: "Reports",
    },
    {
      path: `#!`,
      name: "My Reports",
    },

    {
      path: "#",
      name: "Dynamic Report",
    },
  ];

  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  const [reportName, setReportName] = useState("");

  const [scalerConfigration, setScalerConfigration] = useState({});

  const [chartTypeOptions, setChartTypeOptions] = useState([]);

  const [legendOptions, setLegendOptions] = useState([]);

  const [dataLabelOptions, setDataLabelOptions] = useState([]);
  const [comment, setComment] = useState({
    opening: "",
    closing: "",
  });
  const [isGraphData, setGraphData] = useState(false);

  const [reportTime, setReportTime] = useState("");

  const [dynamicGraphData, setDynamicGraphData] = useState([]);

  const [score, setScore] = useState("");

  const [fontSizeOptions] = useState([
    { value: 8, label: "8" },
    { value: 10, label: "10" },
    { value: 12, label: "12" },
    { value: 14, label: "14" },
    { value: 16, label: "16" },
  ]);

  function formatDateTime(date) {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    return (
      new Date(date).toLocaleString("en-US", options).replace(",", "") || ""
    );
  }

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

  const fetchColorDataBasedOnPalletId = (ID, scoreID) => {
    if (ID) {
      const colorsData = getPaletteByID(scoreID, ID);

      let colorCodeArray = colorsData?.colors?.map((item) => item.colorCode);

      return { colorCodeArray, colorsArr: colorsData };
    } else {
      return { colorCodeArray: [], colorsArr: [] };
    }
  };

  const fetchScore = async () => {
    try {
      const companyId = sessionStorage.getItem("companyId");
      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT?.getScalar,
        queryParams: {
          companyMasterID: userData?.companyMasterID,
          companyID: companyId,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
  
      if (response?.status) {
        setScore(response?.data?.scalar);
        await fetchReportById(response?.data?.scalar); // call fetchReportById with score
      } else {
        setShowLoading(false);
      }
    } catch (error) {
      console.error("Error fetching score data:", error);
      setShowLoading(false);
    }
  };
  

  const fetchReportById = async (scoreVal) => {
    try {
      const response = await commonService({
        apiEndPoint: REPORTS_MANAGEMENT.fetchReportById,
        queryParams: { reportID },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
  
      if (response?.status) {
        setScalerConfigration(response?.data?.data?.scalar);
        // console.log('mmmmmm',response?.data?.data)
        setComment({
          opening: response?.data?.data?.openingComment || "",
          closing: response?.data?.data?.closingComment || "",
        });
        if (response?.data?.data?.chartData?.chartData) {
          setDynamicGraphData(
            response?.data?.data?.chartData?.chartData?.map((val) => {
              const { colorCodeArray, colorsArr } =
                fetchColorDataBasedOnPalletId(
                  val?.chartOptions?.paletteColorID || 0,
                  scoreVal
                );
              return {
                ...val,
                colorsArr,
                colorCodeArray,
              };
            }) || []
          );
        }
  
        setReportTime(
          response?.data?.data?.dateTime
            ? formatDateTime(response?.data?.data?.dateTime)
            : ""
        );
        setReportName(response?.data?.data?.reportName || "");
        // window.alert(JSON.stringify(response))
        setGraphData(true);
      }
  
      setShowLoading(false);
    } catch (error) {
      console.error(error);
      setShowLoading(false);
      toast.error(JSON.stringify(error));
    }
  };
  

  const fetchChartOptions = async (action) => {
    try {
      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT?.getDefaultChartSettings,
        queryParams: {
          action,
          type:"DRILLDOWN"
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

        setLegendOptions(defaultLegendOptions);
        setChartTypeOptions(filteredChartOptions);
        setDataLabelOptions(defaultDataLabelOptions);
      }
    } catch (error) {
      console.error("Error fetching score data:", error);
    }
  };

  useEffect(() => {
    fetchChartOptions("get_chart_option_dropdowns");
    fetchScore();
  }, [userData]);

  // test

  return (
    <>
      {showLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
  <Loader />
</div>
      ) : (
        <div className="summaryReport">
          {/* head title start */}
          <section className="commonHead">
            <h1 className="commonHead_title">Welcome Back!</h1>
            <Breadcrumb breadcrumb={breadcrumb} />
          </section>
          {/* head title end */}
          <div className="pageContent">
            <div className="pageTitle d-flex justify-content-between align-items-center gap-2">
              <div className="d-flex align-items-center">
                <Link to={adminRouteMap.MYPREPORTS.path} className="backLink">
                  <em className="icon-back" />
                </Link>
                <h2 className="mb-0"> Dynamic Report</h2>
              </div>
              <div className="filter_action list-unstyled mb-0">
                <li>
                  <button
                    onClick={toPDF}
                    type="button"
                    aria-label="Download icon"
                    className="btn-icon ripple-effect"
                  >
                    <em className="icon-download" />
                  </button>
                </li>
              </div>
            </div>
            <div ref={targetRef}>
                   
            <Comments comment={comment.opening} userData={userData} image ={true} reportName={reportName}/>

            <div className="reportCard">
            <Previewboxheader userData={userData} image ={true} reportName={reportName}/>

            <div className="responseBox d-flex">
                <div className="responseBox_left">
                  <h3 className="responseBox_title mb-0">Question</h3>
                </div>
                <div className="responseBox_right">
                  <h3 className="responseBox_title mb-0">Response</h3>
                </div>
              </div>
            {dynamicGraphData?.map((question, index) => (
                <div key={index}>
                  <div key={index} className="responseBox d-flex border-top-0">
                    <div className="responseBox_left">
                      <h4 className="responseBox_txt mb-0">
                        {question.questionName}
                      </h4>
                    </div>
                    <div className="responseBox_right">
                      <div className="responseBox_chart">
                        {/* <CommonBarChartAnnotation
                          scalarConfigurationPropData={scalarConfiguration}
                          colorsChart={question?.colorsArray}
                          renderChart={false}
                          chartType={question?.chartOptions?.chartType}
                          legendPosition={question?.chartOptions?.legend}
                          labelPosition={question?.chartOptions?.dataLabel}
                          fontSize={question?.chartOptions?.fontSize}
                          switchAxis={
                            question?.chartOptions?.switchAxis === "xAxis"
                          }
                          labelColorState={question?.chartOptions?.lableColor}
                          annotationOpacity={Number(
                            (
                              question?.chartOptions?.scalarOpacity / 100
                            ).toFixed(2)
                          )}
                          showNegative={false}
                          values={question.responses?.map((r) =>
                            parseFloat(r.percentage)
                          )}
                          categories={
                            question.responses?.map((r) => r.responseName) || []
                          }
                        /> */}
                        {/* {JSON.stringify(chartTypeOptions)} */}

<ChartRenderer
                  question={question}
                  scalarConfiguration={scalerConfigration}
                  renderChart={true}
                  // sortOrder={sortOrder}
                  chartTypeOptions={chartTypeOptions}
                  legendOptions={legendOptions}
                  dataLabelOptions={dataLabelOptions}
                  fontSizeOptions={fontSizeOptions}
                />
                       
                      </div>
                    </div>
                  </div>
                </div>
              ))}
      </div>
                   
              <Comments comment={comment.closing} userData={userData} image ={true} reportName={reportName}/>

            </div>
          </div>
        </div>
      )}
    </>
  );
}

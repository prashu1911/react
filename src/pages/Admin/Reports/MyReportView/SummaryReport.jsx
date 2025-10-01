import { Link, useLocation } from "react-router-dom";
import { Breadcrumb, Loader, ReactDataTable } from "components";
import adminRouteMap from "routes/Admin/adminRouteMap";
import { useEffect, useState } from "react";
import { commonService } from "services/common.service";
import { SURVEYS_MANAGEMENT } from "apiEndpoints/SurveysManagement";
import { REPORTS_MANAGEMENT } from "apiEndpoints/ReportsManagement";
import {
  crosstabColumns,
  getChartTypeByID,
  getDataLabelsByID,
  getFontOptionsByID,
  getLgendsByID,
  processCrosstabData,
  transformDataAggregate,
  transformOutcomeData,
} from "utils/common.util";
import CommonBarChartAnnotation from "pages/Admin/Analytics/CommonBarChartAnnotation";
import { useAuth } from "customHooks";
import { usePDF } from "react-to-pdf";
import OutcomeTableData from "./OutcomeTableData";
import Comments from "../Previews/Comments";
import Previewboxheader from "../Previews/Previewboxheader";

export default function SummaryReport() {
  const { toPDF, targetRef } = usePDF({ filename: "summary-report.pdf" });
  // apexchart start

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
      name: "Summary Report",
    },
  ];

  const location = useLocation();
  const { reportID } = location.state || {};

  const [dataFilters, setDataFilters] = useState([]);

  const { getloginUserData } = useAuth();
  const userData = getloginUserData();

  const [comment, setComment] = useState({
    opening: "",
    closing: "",
  });

  const [outComeData, setOutComeData] = useState([]);

  const [reportName, setReportName] = useState("");

  const [scalerConfigration, setScalerConfigration] = useState({});

  const [colors, setColors] = useState([]);

  const [chartTypeOptions, setChartTypeOptions] = useState([]);

  const [legendOptions, setLegendOptions] = useState([]);

  const [dataLabelOptions, setDataLabelOptions] = useState([]);

  const [chartOptions, setCharOptions] = useState({});

  const [showNegative] = useState(false);

  const [isGraphData, setGraphData] = useState(false);

  const [category, setCategory] = useState([]);
  const [values, setValues] = useState([]);

  const [outcomeCategories, setOutcomeCategories] = useState([]);
  const [outcomeValues, setOutcomeValue] = useState([]);

  const [intentionCategories, setIntentionCategories] = useState([]);
  const [intentionValues, setIntentionValue] = useState([]);

  const [crossTabData, setCrossTabData] = useState([]);

  const [palletId, setPalletId] = useState();

  const [intensionTable, setIntensionTable] = useState([]);
  const [outcomeTable, setOutComeTable] = useState([]);

  const [reportTime, setReportTime] = useState("");
  const [showLoading, setShowLoading] = useState(true);

  const [fontSizeOptions] = useState([
    { value: 8, label: "8" },
    { value: 10, label: "10" },
    { value: 12, label: "12" },
    { value: 14, label: "14" },
    { value: 16, label: "16" },
  ]);

  function transformData(data, key1, key2) {
    const categoryData = data.map((item) =>  item.info_name === "Department Overall" ? "Overall" : item.info_name,)
    const value = data.map((item) => {
      const outcomesMap = {};

      item[key1].forEach((outcome) => {
        outcomesMap[outcome[key2]] = outcome.value;
      });
      return outcomesMap;
    });

    return { category: categoryData, value };
  }

  function transformNestedData(data, key1) {
    const categoryData = data.map((item) => item.data[0]?.info_name || null);

    const value = data.map((item) => {
      const outcomesMap = {};

      item.data.forEach((dataItem) => {
        dataItem[key1]?.forEach((intention) => {
          const key = intention.intention_name || intention.intention_id; // fallback if name is missing
          outcomesMap[key] = intention.value;
        });
      });

      return outcomesMap;
    });

    return { category: categoryData, value };
  }

  const getDataFromArr = (arr) => {
    return arr && arr.length > 0
    ? arr.map((val) => val?.name ||val?.responseValue|| "Overall").join(", ")
    : "-";
  };

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

  const fetchReportById = async () => {
    const response = await commonService({
      apiEndPoint: REPORTS_MANAGEMENT.fetchReportById,
      queryParams: { reportID },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });
    if (response?.status) {
      setCharOptions(response?.data?.data?.chartOptions);
      setScalerConfigration(response?.data?.data?.scalar);
      
      setColors(response?.data?.data?.chartOptions?.colors||['black'])

      setCrossTabData(response?.data?.data?.chartData?.crossTabData || []);
      setComment({
        opening: response?.data?.data?.openingComment || "",
        closing: response?.data?.data?.closingComment || "",
      });

      setReportName(response?.data?.data?.reportName || "");

      if (response?.data?.data?.chartData?.outcomeChart) {
        const result = transformData(
          response?.data?.data?.chartData?.outcomeChart,
          "outcomes",
          "outcome_name"
        );
        setOutcomeCategories(result.category || []);
        setOutcomeValue(result.value || []);
        setOutComeTable(response?.data?.data?.chartData?.outcomeChart);
        if(response?.data?.data?.chartOptions?.switchAxis){
          const result2 = transformOutcomeData(result.category,result.value)
          setOutcomeCategories(result2?.outcomeCategories)
          setOutcomeValue(result2?.outcomeValues)
        }
      }

      if (response?.data?.data?.chartData?.intentionChart) {
        const intensionResult = transformNestedData(
          response?.data?.data?.chartData?.intentionChart,
          "intentions",
          "intention_name"
        );

        setIntentionCategories(intensionResult.category);
        setIntentionValue(intensionResult.value);
        setIntensionTable(
          response?.data?.data?.chartData?.intentionChart || []
        );
        if(response?.data?.data?.chartOptions?.switchAxis){
          const result2 = transformOutcomeData(intensionResult.category,intensionResult.value)
          setIntentionCategories(result2?.outcomeCategories)
          setIntentionValue(result2?.outcomeValues)
        }
      }

      setReportTime(
        response?.data?.data?.dateTime
          ? formatDateTime(response?.data?.data?.dateTime)
          : ""
      );

      setOutComeData(
        response?.data?.data?.chartData?.aggregateChart?.map((val) => {
          return { [val.info_name]: Number(val.value) };
        }) || []
      );

      setPalletId(response?.data?.data?.chartOptions?.paletteColorID || "");
      if (response?.data?.data?.chartData?.aggregateChart) {
        const result = transformDataAggregate(response?.data?.data?.chartData?.aggregateChart)
        setCategory(result?.category)
        setValues(result?.value)
        if(response?.data?.data?.chartOptions?.switchAxis){
          const result2 = transformOutcomeData(result.category,result.value)
          setCategory(result2?.outcomeCategories)
          setValues(result2?.outcomeValues)
        }
      }

      if (response?.data?.data?.dataFilters) {
        setDataFilters([
          {
            Department: getDataFromArr(
              response?.data?.data?.dataFilters?.departments
            ),
          },
          {
            Participants: getDataFromArr(
              response?.data?.data?.dataFilters?.users
            ),
          },
          {
            Managers: getDataFromArr(
              response?.data?.data?.dataFilters?.managers
            ),
          },
          {
            Benchmarks: getDataFromArr(
              response?.data?.data?.dataFilters?.benchmarks
            ),
          },
          ...(response?.data?.data?.dataFilters?.demographicFilters || [])?.filter((item)=>getDataFromArr(item.responses)?.length>1)?.map(
            (item) => ({
              [item.questionValue]: getDataFromArr(item.responses),
            })
          ),
          {
            "Manager Reportees":
            response?.data?.data?.dataFilters?.managerReportees=="A"?"All":"Direct",
          },
          // {
          //   References: getDataFromArr(
          //     response?.data?.data?.dataFilters?.references
          //   ),
          // },

          {
            Outcomes: getDataFromArr(
              response?.data?.data?.dataFilters?.outcomes
            ),
          },
          {
            Intentions: getDataFromArr(
              response?.data?.data?.dataFilters?.intentions
            ),
          },
        ]);
      }

      if (response?.data?.data) {
        setGraphData(true);
      }
    }
  };

  useEffect(() => {
    fetchReportById();
  }, [reportID]);

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

  const fetchScore = async () => {
    try {
      const companyId = await localStorage.getItem("companyId");

      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT?.getScalar,
        queryParams: {
          companyMasterID: userData?.companyMasterID,
          companyID: companyId
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        if (palletId) {
          const colorsData = getPaletteByID(response?.data?.scalar, palletId);
          let colorCodeArray = colorsData?.colors?.map(
            (item) => item.colorCode
          );
          // setColors(colorCodeArray);
        }
      }
      setShowLoading(false);
    } catch (error) {
      setShowLoading(false);
      console.error("Error fetching score data:", error);
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
  }, [userData]);

  useEffect(() => {
    fetchScore();
  }, [userData, palletId]);

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
            <div className="pageTitle d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <Link to={adminRouteMap.MYPREPORTS.path} className="backLink">
                  <em className="icon-back" />
                </Link>
                <h2 className="mb-0">Summary Report </h2>
              </div>
              <ul className="filter_action list-unstyled mb-0">
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
              </ul>
            </div>
            <div ref={targetRef}>
            <Comments comment={comment.opening} userData={userData} image ={true} reportName={reportName}/>

              <div className="reportCard">
                                <Previewboxheader userData={userData} image ={true} reportName={reportName}/>

                <div className="reportCard_barchart">
                  <div className="reportCard_barchart_inner">
                    {/* {JSON.stringify(category)+""+JSON.stringify(values)} */}
                    {isGraphData && colors.length > 0 && (
                      <CommonBarChartAnnotation
                        scalarConfigurationPropData={scalerConfigration}
                        categories={category}
                        values={values}
                        activeTab=""
                        colorsChart={colors}
                        renderChart={false}
                        switchAxis={false}
                        labelColorState={chartOptions.lableColor}
                        annotationOpacity={Number(
                          (chartOptions.scalarOpacity / 100).toFixed(2)
                        )}
                        showNegative={showNegative}
                        chartType={getChartTypeByID(
                          chartOptions.chartType,
                          chartTypeOptions,
                          true
                        )}
                        legendPosition={
                          getLgendsByID(chartOptions.legend, legendOptions) ||
                          "bottom"
                        }
                        labelPosition={
                          getDataLabelsByID(chartOptions.dataLabel, dataLabelOptions) || "center"
                        }
                        fontSize={
                          getFontOptionsByID(
                            chartOptions.fontSize,
                            fontSizeOptions
                          ) || "12"
                        }
                      />
                    )}
                  </div>
                </div>
                <div className="reportCard_table">
                  <table className="mt-xxl-3 mt-2">
                    <thead>
                      <tr>
                        <th>Outcomes / Participant</th>
                        <th>Survey Aggregate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {outComeData.map((data) => {
                        const [key, value] = Object.entries(data)[0];
                        return (
                          <tr>
                            <td>{key?.replace('Department Overall',"Overall")}</td>
                            <td>{value}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                
              </div>
              <div className="reportCard">
                                <Previewboxheader userData={userData} image ={true} reportName={reportName}/>

                <div className="reportCard_table">
                  <table className="mt-xxl-3 mt-2">
                    <thead>
                      <tr>
                        <th className="w-1">S.No.</th>
                        <th>Data Point</th>
                        <th>Filter</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataFilters.map((data, i) => {
                        const [key, value] = Object.entries(data)[0];
                        return (
                          <tr>
                            <td>{i + 1}</td>
                            <td>{key}</td>
                            <td>{value}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                 
                </div>
                
              </div>
              <div className="reportCard">
                                <Previewboxheader userData={userData} image ={true} reportName={reportName}/>

                <div className="reportCard_barchart">
                  <div className="reportCard_barchart_inner">
                  {/* {JSON.stringify(category)+""+JSON.stringify(outcomeValues)} */}

                    {isGraphData && colors.length > 0 && (
                      <CommonBarChartAnnotation
                        scalarConfigurationPropData={scalerConfigration}
                        categories={outcomeCategories}
                        values={outcomeValues}
                        activeTab=""
                        colorsChart={colors}
                        renderChart={false}
                        switchAxis={false}
                        labelColorState={chartOptions.lableColor}
                        annotationOpacity={Number(
                          (chartOptions.scalarOpacity / 100).toFixed(2)
                        )}
                        showNegative={showNegative}
                        chartType={getChartTypeByID(
                          chartOptions.chartType,
                          chartTypeOptions,
                          true
                        )}
                        legendPosition={
                          getLgendsByID(chartOptions.legend, legendOptions) ||
                          "bottom"
                        }
                        labelPosition={
                          getDataLabelsByID(chartOptions.dataLabel, dataLabelOptions)  || "top"
                        }
                        fontSize={
                          getFontOptionsByID(
                            chartOptions.fontSize,
                            fontSizeOptions
                          ) || "12"
                        }
                      />
                    )}
                  </div>
                </div>
                <div className="reportCard_table">
                  <OutcomeTableData outcomeChart={outcomeTable} />
                </div>
                
              </div>

              <div className="reportCard">
                                <Previewboxheader userData={userData} image ={true} reportName={reportName}/>

                <div className="reportCard_barchart">
                <div className="reportCard_barchart_inner">
  {isGraphData &&
    colors.length > 0 &&
    intensionTable.map((chartItem, index) => {
      const transformed = transformData(chartItem.data, "intentions", "intention_name");
      const result = chartOptions?.switchAxis
        ? transformOutcomeData(transformed.category, transformed.value)
        : transformed;

      const category = chartOptions?.switchAxis
        ? result?.outcomeCategories
        : result?.category;
      const value = chartOptions?.switchAxis
        ? result?.outcomeValues
        : result?.value;

      const intentionNames = Array.from(
        new Set(
          chartItem.data.flatMap((participant) =>
            participant.intentions.map((int) => int.intention_name)
          )
        )
      );

      return (
        <div key={index} className="mb-5">
          <CommonBarChartAnnotation
            scalarConfigurationPropData={scalerConfigration}
            categories={category}
            values={value}
            activeTab=""
            colorsChart={colors}
            renderChart={false}
            switchAxis={false}
            labelColorState={chartOptions.lableColor}
            annotationOpacity={Number((chartOptions.scalarOpacity / 100).toFixed(2))}
            showNegative={false}
            chartType={getChartTypeByID(chartOptions.chartType, chartTypeOptions, true)}
            legendPosition={
              getLgendsByID(chartOptions.legend, legendOptions) || "bottom"
            }
            labelPosition={
              getDataLabelsByID(chartOptions.dataLabel, dataLabelOptions) || "top"
            }
            fontSize={
              getFontOptionsByID(chartOptions.fontSize, fontSizeOptions) || "12"
            }
          />

          {/* Inline Intension Table for this chart */}
          <div className="reportCard_table mt-3">
            <h6>{chartItem.name}</h6>
            <table className="mt-2" border="1">
              <thead>
                <tr>
                  <th>Intention / Participant</th>
                  {intentionNames.map((name, i) => (
                    <th key={i}>{name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chartItem.data.map((participant, partIndex) => {
                  const intentionMap = {};
                  participant.intentions.forEach((int) => {
                    intentionMap[int.intention_name] = int.value;
                  });

                  return (
                    <tr key={partIndex}>
                            <td>{participant?.info_name?.replace('Department Overall',"Overall")}</td>
                            {intentionNames.map((name, i) => (
                        <td key={i}>{intentionMap[name] || "-"}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      );
    })}
</div>

                </div>
                
              </div>

          
              <Comments comment={comment.closing} userData={userData} image ={true} reportName={reportName}/>
              {/* <Previewboxheader userData={userData} image ={true} reportName={reportName}/> */}

              { chartOptions.showCrosstab&&<div className="reportCard">
                <Previewboxheader userData={userData} image ={true} reportName={reportName}/>


                <ReactDataTable
                showFooter={false}
                isPaginate={false}
                data={processCrosstabData(crossTabData)}
                columns={crosstabColumns}
                isCrosstab={true}
              />
                <div className="reportCard_info d-flex justify-content-between flex-wrap gap-1">
                  <span>Report Generated at {reportTime}</span>
                  <span>© {new Date().getFullYear()}, Metolius®</span>
                </div>
              </div>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const IntensionTable = ({ data }) => {
  return (
    <>
      {data.map((outcome, outcomeIndex) => (
        <div key={outcomeIndex} style={{ marginBottom: "2rem" }}>
          <h6>{outcome.name}</h6>
          <table className="mt-xxl-3 mt-2">
            <thead>
              <tr>
                <th>Participant Name</th>
                <th>Intention Name</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {outcome.data.map((participant, partIndex) =>
                participant.intentions.map((intention, intIndex) => (
                  <tr key={`${partIndex}-${intIndex}`}>
                    <td>{participant.info_name}</td>
                    <td>{intention.intention_name}</td>
                    <td>{intention.value}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ))}
    </>
  );
};

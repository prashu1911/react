import { useChartSettings } from "customHooks/useChartSettings";
import React, { useEffect, useState } from "react";
import adminRouteMap from "routes/Admin/adminRouteMap";
import { useNavigate } from "react-router-dom";
import { commonService } from "services/common.service";
import { SURVEYS_MANAGEMENT } from "apiEndpoints/SurveysManagement";
import { useAuth } from "customHooks";
// import { usePDF } from "react-to-pdf";
import CommonBarChartAnnotation from "pages/Admin/Analytics/CommonBarChartAnnotation";
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
import { FallBackLoader, ImageElement, ReactDataTable } from "components";
import OutcomeTableData from "../MyReportView/OutcomeTableData";
import Comments from "./Comments";
import Previewboxheader from "./Previewboxheader";

function SummaryReportPreview() {
  // const { toPDF, targetRef } = usePDF({ filename: "summary-report.pdf" });

  const { chartSettings } = useChartSettings();
  let navigate = useNavigate();
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();

  const [chartOptions, setCharOptions] = useState({});
  const [scalerConfigration, setScalerConfigration] = useState([]);
  const [crossTabData, setCrossTabData] = useState([]);
  const [comment, setComment] = useState({
    opening: "",
    closing: "",
  });
  const [reportName, setReportName] = useState("");

  const [generatedDate] = useState(new Date());

  const [outcomeCategories, setOutcomeCategories] = useState([]);
  const [outcomeValues, setOutcomeValue] = useState([]);
  const [outcomeTable, setOutComeTable] = useState([]);

  const [intentionCategories, setIntentionCategories] = useState([]);
  const [intentionValues, setIntentionValue] = useState([]);
  const [intensionTable, setIntensionTable] = useState([]);

  const [outComeData, setOutComeData] = useState([]);

  const [category, setCategory] = useState([]);
  const [values, setValues] = useState([]);

  const [dataFilters, setDataFilters] = useState([]);
  const [isGraphData, setGraphData] = useState(false);

  const [chartTypeOptions, setChartTypeOptions] = useState([]);

  const [legendOptions, setLegendOptions] = useState([]);

  const [dataLabelOptions, setDataLabelOptions] = useState([]);

  const [colors, setColors] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [fontSizeOptions] = useState([
    { value: 8, label: "8" },
    { value: 10, label: "10" },
    { value: 12, label: "12" },
    { value: 14, label: "14" },
    { value: 16, label: "16" },
  ]);

  function transformData(data, key1, key2) {
    const categoryData = data.map((item) =>  item.info_name === "Department Overall" ? "Overall" : item.info_name,
  );

    const value = data.map((item) => {
      const outcomesMap = {};

      item[key1]?.forEach((outcome) => {
        outcomesMap[outcome[key2]] = outcome.value;
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

  const getDataFromArrreportees = (arr) => {
    return arr && arr.length > 0
      ? arr.map((val) => val?.name=='A'?'All':'Direct').join(", ")
      : "-";
  };

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
      // console.log("API scalar response:", response,action,SURVEYS_MANAGEMENT?.getDefaultChartSettings,userData?.apiToken);

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



  // function transformData(data, key1, key2) {
  //   const categoryData = data.map((item) => item.info_name);

  //   const value = data.map((item) => {
  //     const outcomesMap = {};

  //     item[key1].forEach((outcome) => {
  //       outcomesMap[outcome[key2]] = outcome.value;
  //     });
  //     return outcomesMap;
  //   });

  //   return { category: categoryData, value };
  // }


  // eslint-disable-next-line no-shadow
  const fetchScore = async (palletId) => {
    try {
      const companyId = localStorage.getItem("companyId");

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
      // console.log(response?.data)
      // if (response?.status) {
      //   if (palletId) {
      //     const colorsData = getPaletteByID(response?.data?.scalar, palletId);
      //     let colorCodeArray = colorsData?.colors?.map(
      //       (item) => item.colorCode
      //     );
      //     setColors(colorCodeArray);
      //   }
      // }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching score data:", error);
    }
  };

  useEffect(() => {
    if (chartSettings && chartSettings?.key !== "summary-report-preview") {
      navigate(adminRouteMap.DASHBOARD.path);
    }

    setCharOptions(chartSettings?.Data?.chartOptions || []);
    setScalerConfigration(chartSettings?.Data?.scalar || []);
    setCrossTabData(chartSettings?.Data?.chartData?.crossTabData || []);
    setColors(chartSettings?.Data?.chartOptions?.colors)
    setComment({
      opening: chartSettings?.Data?.openingComment || "",
      closing: chartSettings?.Data?.closingComment || "",
    });

    setReportName(chartSettings?.Data?.reportName || "");

    if (chartSettings?.Data?.chartData?.outcomeChart) {
      const transformed = chartSettings?.Data?.chartData?.outcomeChart.map((item) => ({
        ...item,
        info_name: item.info_name === "Department Overall" ? "Overall" : item.info_name,
      }));
      const result = transformData(
        chartSettings?.Data?.chartData?.outcomeChart,
        "outcomes",
        "outcome_name"
      );
      setOutcomeCategories(result.category || []);
      setOutcomeValue(result.value || []);
      setOutComeTable(transformed);
      if(chartSettings?.Data?.chartOptions?.switchAxis){
        const result2 = transformOutcomeData(result.category,result.value)
        setOutcomeCategories(result2?.outcomeCategories)
        setOutcomeValue(result2?.outcomeValues)
      }
    }

    if (chartSettings?.Data?.chartData?.intentionChart) {

      const intensionResult =transformData(
        chartSettings?.Data?.chartData?.intentionChart?.[0]?.data,
        "intentions",
        "intention_name"
      );

      setIntentionCategories(intensionResult.category);
      setIntentionValue(intensionResult.value);
      if(chartSettings?.Data?.chartOptions?.switchAxis){
        const result2 = transformOutcomeData(intensionResult.category,intensionResult.value)
        setIntentionCategories(result2?.outcomeCategories)
        // console.log("tranfoms",result2,intensionResult)
        setIntentionValue(result2?.outcomeValues)
      }
      setIntensionTable(chartSettings?.Data?.chartData?.intentionChart || []);
    }

    setOutComeData(
      chartSettings?.Data?.chartData?.aggregateChart?.map((val) => {
        return { [val.info_name]: Number(val.value) };
      }) || []
    );

    if (chartSettings?.Data?.chartData?.aggregateChart) {
        const result = transformDataAggregate(chartSettings?.Data?.chartData?.aggregateChart)
        setCategory(result?.category)
        setValues(result?.value)
        if(chartSettings?.Data?.chartOptions?.switchAxis){
          const result2 = transformOutcomeData(result.category,result.value)
          setCategory(result2?.outcomeCategories)
          setValues(result2?.outcomeValues)
        }
    }
    console.log(chartSettings)
    if (chartSettings?.Data?.dataFilters) {
      setDataFilters([
        {
          Department: getDataFromArr(
            chartSettings?.Data?.dataFilters?.departments
          ),
        },
        {
          Participants: getDataFromArr(chartSettings?.Data?.dataFilters?.users),
        },
        {
          Managers: getDataFromArr(chartSettings?.Data?.dataFilters?.managers),
        },
        {
          Benchmarks: getDataFromArr(
            chartSettings?.Data?.dataFilters?.benchmarks
          ),
        },
        ...(chartSettings?.Data?.dataFilters?.demographicFilters || []).filter((item)=>getDataFromArr(item.responses)?.length>1).map(
          (item) => ({
            [item.questionValue]: getDataFromArr(item.responses),
          })
        ),
        {
          "Manager Reportees":
            chartSettings?.Data?.dataFilters?.managerReportees=="A"?"All":"Direct",
        },
        // {
        //   References: getDataFromArr(
        //     chartSettings?.Data?.dataFilters?.references
        //   ),
        // },
        {
          Outcomes: getDataFromArr(chartSettings?.Data?.dataFilters?.outcomes),
        },
        {
          Intentions: getDataFromArr(
            chartSettings?.Data?.dataFilters?.intentions
          ),
        },
      ]);
    }

    setGraphData(true);

    fetchChartOptions("get_chart_option_dropdowns");
    fetchScore(chartSettings?.Data?.chartOptions?.paletteColorID);
  }, []);

  return (
    <>
      {isLoading ? (
        <FallBackLoader />
      ) : (
        <div className="summaryReport">
          {/* head title end */}
          <div className="pageContent">
            <div className="pageTitle d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <h2 className="mb-0">Summary Report</h2>
              </div>
              {/* <ul className="filter_action list-unstyled mb-0">
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
              </ul> */}
            </div>
            <Comments comment={comment.opening} userData={userData} image ={true} reportName={reportName}/>

            <div>
              <div className="reportCard">
                                <Previewboxheader userData={userData} image ={true} reportName={reportName}/>

                <div className="reportCard_barchart">
                  <div className="reportCard_barchart_inner">
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
                        showNegative={false}
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
                          getDataLabelsByID(chartOptions.dataLabel, dataLabelOptions) || "top"
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
                  {/* <div
                    className="my-xl-3 my-2"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: comment.opening }}
                  /> */}

                  {/* <div
                    className="my-xl-3 my-2"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: comment.closing }}
                  /> */}
                </div>
                
              </div>
              <div className="reportCard">
                                <Previewboxheader userData={userData} image ={true} reportName={reportName}/>

                <div className="reportCard_barchart">
                  <div className="reportCard_barchart_inner">
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
                        showNegative={false}
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
                          getDataLabelsByID(chartOptions.dataLabel, dataLabelOptions) || "top"
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
                    {/* {intensionTable?.length} */}
                    {isGraphData && colors.length > 0 &&
  intensionTable.map((chartItem, index) => {
    const transformed = transformData(chartItem.data, "intentions", "intention_name");
    const result = chartOptions?.switchAxis
      ? transformOutcomeData(transformed.category, transformed.value)
      : transformed;
    let category = chartOptions?.switchAxis ? result?.outcomeCategories : result?.category;
    let value = chartOptions?.switchAxis ? result?.outcomeValues : result?.value;

    // Unique intention names
    const intentionNames = Array.from(
      new Set(
        chartItem.data.flatMap((participant) =>
          participant.intentions.map((int) => int.intention_name)
        )
      )
    );

    return (
      <div key={index} className="mb-4">
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
          legendPosition={getLgendsByID(chartOptions.legend, legendOptions) || "bottom"}
          labelPosition={getDataLabelsByID(chartOptions.dataLabel, dataLabelOptions) || "top"}
          fontSize={getFontOptionsByID(chartOptions.fontSize, fontSizeOptions) || "12"}
        />

        <div className="reportCard_table">
          <h6>{chartItem.name}</h6>
          <table className="mt-xxl-3 mt-2" border="1">
            <thead>
              <tr>
                <th>Intention / Participant</th>
                {intentionNames.map((intentionName, i) => (
                  <th key={i}>{intentionName}</th>
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
                {/* <div className="reportCard_table">
                  <IntensionTable data={intensionTable} />
                </div> */}
              </div>

            
              <Comments comment={comment.closing} userData={userData} image ={true} reportName={reportName}/>
 
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
                  <span>
                    Report Generated at {generatedDate.toLocaleString()}
                  </span>
                  <span>© {generatedDate.getFullYear()}, Metolius®</span>
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
      {data.map((outcome, outcomeIndex) => {
        // Get all unique intention names
        const intentionNames = Array.from(
          new Set(
            outcome.data.flatMap(participant =>
              participant.intentions.map(int => int.intention_name)
            )
          )
        );

        return (
          <div key={outcomeIndex} style={{ marginBottom: "2rem" }}>
            <h6>{outcome.name}</h6>
            <table className="mt-xxl-3 mt-2" border="1">
              <thead>
                <tr>
                <th>Intention / Participant</th>
                {intentionNames.map((intentionName, i) => (
                    <th key={i}>{intentionName}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {outcome.data.map((participant, partIndex) => {
                  // Create a map of intention name to value for the participant
                  const intentionMap = {};
                  participant.intentions.forEach(int => {
                    intentionMap[int.intention_name] = int.value;
                  });

                  return (
                    <tr key={partIndex}>
                      <td>{participant.info_name}</td>
                      {intentionNames.map((name, i) => (
                        <td key={i}>{intentionMap[name] || "-"}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
    </>
  );
};


export default SummaryReportPreview;

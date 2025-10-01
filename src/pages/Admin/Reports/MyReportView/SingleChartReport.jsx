import { Breadcrumb, ImageElement, Loader } from "components";
import { Link, useLocation } from "react-router-dom";
import adminRouteMap from "routes/Admin/adminRouteMap";
import { REPORTS_MANAGEMENT } from "apiEndpoints/ReportsManagement";
import { useAuth } from "customHooks";
import { useEffect, useState } from "react";
import { commonService } from "services/common.service";
import { SURVEYS_MANAGEMENT } from "apiEndpoints/SurveysManagement";
import {
  getChartTypeByID,
  getDataLabelsByID,
  getFontOptionsByID,
  getLgendsByID,
  transformOutcomeData,
} from "utils/common.util";
import CommonBarChartAnnotation from "pages/Admin/Analytics/CommonBarChartAnnotation";
import { usePDF } from "react-to-pdf";
import { useSelector } from "react-redux";
import { getAssessmentCharting, updateAssessmentCharting } from "../../../../redux/AssesmentCharting/index.slice";
import Comments from "../Previews/Comments";
import Previewboxheader from "../Previews/Previewboxheader";

export default function SingleChartReport() {
  const { toPDF, targetRef } = usePDF({ filename: "single-chart-report.pdf" });
  const location = useLocation();
  const { reportID } = location.state || {};

  const [dataFilters, setDataFilters] = useState([]);
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
      name: " Single Chart Report",
    },
  ];

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

  const [palletId, setPalletId] = useState();
  const [reportTime, setReportTime] = useState("");

  const [outComeTableData, setOutCometableData] = useState([]);
  const [intentionTableData, setIntentiontableData] = useState([]);
  const [responseData, setResponseData] = useState({});
  const [isQuickCompare,setIsquickCompare]=useState(false)
  const [quickComapreIntemtionData, setQuickComapreIntemtionData] = useState(
    null
  );
  const [quickComapreOutcomeData, setQuickComapreOutcomeData] = useState(null);
  const [quickComapreData, setQuickComapreData] = useState(null);

  const [fontSizeOptions] = useState([
    { value: 8, label: "8" },
    { value: 10, label: "10" },
    { value: 12, label: "12" },
    { value: 14, label: "14" },
    { value: 16, label: "16" },
  ]);

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

  const transformData = (data, key1, key2) => {
    const category = data.map((item) => item.info_name);
    const value = data.map((item) => {
      const outcomesMap = {};
      item[key1]?.forEach((outcome) => {
        let val = parseFloat(outcome.value);
        if (val < 0) val = 0;
        outcomesMap[outcome[key2]] = val;
      });
      return outcomesMap;
    });
    return { category, value };
  };

  const transformDataAggregate = (data) => {
    const category = Array.isArray(data)?data?.map((item) => item.info_name === "Aggregate" ? "Survey Aggregate" : item.info_name):null
    const value = data?.map((item) => ({ Aggregate: item.value }));
    return { category, value };
  };

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
      const data = response?.data?.data;
      setResponseData(response?.data?.data)
      setCharOptions(data?.chartOptions);
      console.log(data)
      setScalerConfigration(data?.scalar);
      setComment({ opening: data?.openingComment || "", closing: data?.closingComment || "" });
      setReportName(data?.reportName);
      setPalletId(data?.chartOptions?.paletteColorID);
      setColors(response?.data?.data?.chartOptions?.colors||colors)
      setIsquickCompare(response?.data?.data?.chartOptions?.isQuickCompare)
      setDataFilters([
        { Department: getDataFromArr(data?.dataFilters?.departments) },
        { Participants: getDataFromArr(data?.dataFilters?.users) },
        { Managers: getDataFromArr(data?.dataFilters?.managers) },
        { Benchmarks: getDataFromArr(data?.dataFilters?.benchmarks) },
        ...(data?.dataFilters?.demographicFilters || [])?.filter((item)=>getDataFromArr(item.responses)?.length>1)?.map(
          (item) => ({
            [item.questionValue]: getDataFromArr(item.responses),
          })
        ),
                { "Manager Reportees": 
                    data?.dataFilters?.managerReportees=="A"?"All":"Direct",
        },
        // { References: getDataFromArr(data?.dataFilters?.references) },
      ]);

      setReportTime(data?.dateTime ? formatDateTime(data?.dateTime) : "");
      setGraphData(true);

      if (data?.reportType === "OUTCOME") {
        if(response?.data?.data?.chartOptions?.isQuickCompare){
          let finalData = response?.data?.data?.chartData
          // for (let oneRow of response?.data?.data?.chartData) {
          //   const result = transformDataQuickCompareIntentions(oneRow);
          //   finalData.push(result);
          // }
          if(response?.data?.data?.chartOptions?.switchAxis){
            const transformedData = finalData.map((item) => {
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
          }
          else{
  
            setQuickComapreOutcomeData(finalData);
  
          }
          setShowLoading(false);

          return 
        }
        const result = transformData(data?.chartData, "outcomes", "outcome_name");
        const transformed = data?.chartData.map((item) => ({
          ...item,
          info_name: item.info_name === "Department Overall" ? "Overall" : item.info_name,
        }));
        setOutCometableData(transformed);
        if (data?.chartOptions?.switchAxis) {
          const result2 = transformOutcomeData(result.category, result.value);
          setCategory(result2?.outcomeCategories);
          setValues(result2?.outcomeValues);
        } else {
          setCategory(result.category);
          setValues(result.value);
        }
      } else if (data?.reportType === "INTENTION") {
        if(response?.data?.data?.chartOptions?.isQuickCompare){
          let finalData = response?.data?.data?.chartData
          // for (let oneRow of response?.data?.data?.chartData) {
          //   const result = transformDataQuickCompareIntentions(oneRow);
          //   finalData.push(result);
          // }
          if(response?.data?.data?.chartOptions?.switchAxis){
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
  
            setQuickComapreIntemtionData(finalData);
  
          }
          setShowLoading(false);

          return 
        }
        const result = transformData(data?.chartData, "intentions", "intention_name");
        const transformed = data?.chartData.map((item) => ({
          ...item,
          info_name: item.info_name === "Department Overall" ? "Overall" : item.info_name,
        }));
        setIntentiontableData(transformed);
        if (data?.chartOptions?.switchAxis) {
          const result2 = transformOutcomeData(result.category, result.value);
          setCategory(result2?.outcomeCategories);
          setValues(result2?.outcomeValues);
        } else {
          setCategory(result.category);
          setValues(result.value);
        }
      } else {
        if(response?.data?.data?.chartOptions?.isQuickCompare){
          let finalData = response?.data?.data?.chartData
          // for (let oneRow of response?.data?.data?.chartData) {
          //   const result = transformDataQuickCompareIntentions(oneRow);
          //   finalData.push(result);
          // }
          if(response?.data?.data?.chartOptions?.switchAxis){
            // window.alert('ss')
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
  
            setQuickComapreData(finalData);
  
          }
          setShowLoading(false);

          return 
        }
        const result = transformDataAggregate(data?.chartData);
        if (data?.chartOptions?.switchAxis) {
          const result2 = transformOutcomeData(result.category, result.value);
          setCategory(result2?.outcomeCategories);
          setValues(result2?.outcomeValues);
        } else {
          setCategory(result.category);
          setValues(result.value);
        }
        setOutComeData(data?.chartData?.map((val) => ({ [val.info_name]: Number(val.value) })) || []);
      }
      
    }
    setShowLoading(false);
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
  const reduxChartData = useSelector(getAssessmentCharting);

  const fetchScore = async () => {
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
      if (response?.status) {
        if (palletId) {
          const colorsData = getPaletteByID(response?.data?.scalar, palletId);
          let colorCodeArray = colorsData?.colors?.map(
            (item) => item.colorCode
          );
          // setColors(colorCodeArray);
          console.log(colorCodeArray,colorsData,"colo")
        }
      }
    } catch (error) {
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
        // .filter(
        //   (item) => item.label !== "Column" && item.label !== "Spider"
        // );

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
        console.log(reduxChartData,"d")
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

  // Modify the useEffect for colors to wait for graph data
  useEffect(() => {
    if (palletId && isGraphData) {
      fetchScore();
    }
  }, [palletId, isGraphData]);
  // test

  // Extract unique outcome names for headers
  const getAllOutcomes = () => {
    const allOutcomes = new Set();
    outComeTableData.forEach((item) => {
      item.outcomes.forEach((outcome) => {
        allOutcomes.add(outcome.outcome_name);
      });
    });
    return Array.from(allOutcomes);
  };

  const getAllIntentions = () => {
    const allIntentions = new Set();

    intentionTableData.forEach((item) => {
      item.intentions.forEach((intention) => {
        allIntentions.add(intention.intention_name);
      });
    });

    return Array.from(allIntentions);
  };

  const outcomeNames = getAllOutcomes();
  const intentionNames = getAllIntentions();

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
                <h2 className="mb-0"> Single Chart Report </h2>
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
              
            <Comments  comment={comment.opening} date={reportTime} userData={userData} image ={true} reportName={reportName}/>

              <div className="reportCard">
              <Previewboxheader userData={userData} image ={true} reportName={reportName}/>

                <div className="reportCard_barchart">
                  <div className="reportCard_barchart_inner">

{isQuickCompare&&
quickComapreOutcomeData?.map((item,index) => (

    <>
    {/* {JSON.stringify(in)} */}
    <CommonBarChartAnnotation
    scalarConfigurationPropData={scalerConfigration}
    categories={item?.outcomeCategories}
    values={item?.outcomeValues}
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
true                        )}
    legendPosition={
      getLgendsByID(chartOptions.legend, legendOptions) ||
      "bottom"
    }
    labelPosition={
      getDataLabelsByID(chartOptions.dataLabel, dataLabelOptions)  ||'bottom'
    }
    fontSize={
      getFontOptionsByID(
        chartOptions.fontSize,
        fontSizeOptions
      ) || "12"
    }
  /></>
  ))
}

{chartOptions?.isQuickCompare&&
quickComapreData?.map((item,index) => (

    <>
    {/* {JSON.stringify(in)} */}
    <CommonBarChartAnnotation
    scalarConfigurationPropData={scalerConfigration}
    categories={item?.categories}
    values={item?.values}
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
true                        )}
    legendPosition={
      getLgendsByID(chartOptions.legend, legendOptions) ||
      "bottom"
    }
    labelPosition={
      getDataLabelsByID(chartOptions.dataLabel, dataLabelOptions)  ||'bottom'
    }
    fontSize={
      getFontOptionsByID(
        chartOptions.fontSize,
        fontSizeOptions
      ) || "12"
    }
  /></>
  ))
}

{chartOptions?.isQuickCompare&&
  quickComapreIntemtionData?.map((item,index) => (

    <>
    {/* {JSON.stringify(in)} */}
    <CommonBarChartAnnotation
    scalarConfigurationPropData={scalerConfigration}
    categories={item?.intentionCategories}
    values={item?.intentionValues}
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
true                        )}
    legendPosition={
      getLgendsByID(chartOptions.legend, legendOptions) ||
      "bottom"
    }
    labelPosition={
      getDataLabelsByID(chartOptions.dataLabel, dataLabelOptions)  ||'bottom'
    }
    fontSize={
      getFontOptionsByID(
        chartOptions.fontSize,
        fontSizeOptions
      ) || "12"
    }
  /></>
  ))
}
                    {chartOptions&&colors.length > 0&&!isQuickCompare && category.length > 0 && values.length > 0 && (
                      <CommonBarChartAnnotation
                        scalarConfigurationPropData={scalerConfigration}
                        categories={category}
                        values={values}
                        activeTab=""
                        colorsChart={colors}
                        renderChart={false}
                        switchAxis={false}
                        labelColorState={chartOptions?.lableColor}
                        annotationOpacity={Number(
                          (chartOptions.scalarOpacity / 100).toFixed(2)
                        )}
                        showNegative={showNegative}
                        chartType={getChartTypeByID(
                          chartOptions.chartType,
                          chartTypeOptions,
                          true
                          // responseData?.reportType !== "AGGREGATE"
                        )}
                        legendPosition={
                          getLgendsByID(chartOptions.legend, legendOptions) ||
                          "bottom"
                        }
                        labelPosition={
                          getDataLabelsByID(chartOptions.dataLabel, dataLabelOptions)  ||'bottom'
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
                {responseData?.reportType === "AGGREGATE"&&!isQuickCompare && (
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
                              <td>{key}</td>
                              <td>{value}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {responseData?.reportType === "OUTCOME"&&!isQuickCompare && (
                  <div className="p-4">
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-200 px-4 py-2 font-bold">
                              Outcomes / Participant
                            </th>
                            {outcomeNames.map((name, index) => (
                              <th
                                key={index}
                                className="border border-gray-200 px-4 py-2 font-bold"
                              >
                                {name}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {outComeTableData.map((item, rowIndex) => (
                            <tr
                              key={rowIndex}
                              className={
                                rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"
                              }
                            >
                              <td className="border border-gray-200 px-4 py-2 font-medium">
                                {item.info_name}
                              </td>
                              {outcomeNames.map((outcomeName, colIndex) => {
                                const outcomeObj = item.outcomes.find(
                                  (o) => o.outcome_name === outcomeName
                                );
                                return (
                                  <td
                                    key={colIndex}
                                    className="border border-gray-200 px-4 py-2"
                                  >
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

                {responseData?.reportType === "INTENTION"&&!isQuickCompare && (
                  <div className="p-4">
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-200 px-4 py-2 font-bold">
                              Outcomes / Participant
                            </th>
                            {intentionNames.map((name, index) => (
                              <th
                                key={index}
                                className="border border-gray-200 px-4 py-2 font-bold"
                              >
                                {name}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {intentionTableData.map((item, rowIndex) => (
                            <tr
                              key={rowIndex}
                              className={
                                rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"
                              }
                            >
                              <td className="border border-gray-200 px-4 py-2 font-medium">
                                {item.info_name}
                              </td>
                              {intentionNames.map((intentionName, colIndex) => {
                                const outcomeObj = item.intentions.find(
                                  (o) => o.intention_name === intentionName
                                );
                                return (
                                  <td
                                    key={colIndex}
                                    className="border border-gray-200 px-4 py-2"
                                  >
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
                {/* <div className="reportCard_info d-flex justify-content-between flex-wrap gap-1">
                  <span>Report Generated at {reportTime}</span>
                  <span>© {new Date().getFullYear()}, Metolius®</span>
                </div> */}
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

                
                </div>
              
              </div>
              <Comments footer={true} comment={comment.closing} date={reportTime} userData={userData} image ={true} reportName={reportName}/>

            </div>
          </div>
        </div>
      )}
    </>
  );
}

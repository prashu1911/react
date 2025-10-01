import { SURVEYS_MANAGEMENT } from "apiEndpoints/SurveysManagement";
import { useAuth } from "customHooks";
import { useChartSettings } from "customHooks/useChartSettings";
import CommonBarChartAnnotation from "pages/Admin/Analytics/CommonBarChartAnnotation";
import React, { useEffect, useState } from "react";
import { commonService } from "services/common.service";
// import { usePDF } from "react-to-pdf";
import { useNavigate } from "react-router-dom";
import adminRouteMap from "routes/Admin/adminRouteMap";
import {
  getChartTypeByID,
  getDataLabelsByID,
  getFontOptionsByID,
  getLgendsByID,
  transformOutcomeData,
} from "utils/common.util";
import { FallBackLoader, ImageElement } from "components";
import { getAssessmentCharting, updateAssessmentCharting } from "../../../../redux/AssesmentCharting/index.slice";
import { useSelector } from "react-redux";
import Comments from "./Comments";
import Previewboxheader from "./Previewboxheader";

function SingleChartReportPreview() {
  // const { toPDF, targetRef } = usePDF({ filename: "single-chart-report.pdf" });

  const [generatedDate] = useState(new Date());

  let navigate = useNavigate();

  const { chartSettings } = useChartSettings();
  const [chartOptions, setCharOptions] = useState({});
  const [scalerConfigration, setScalerConfigration] = useState([]);
  const [reportName, setReportName] = useState("");
  const [outComeData, setOutComeData] = useState([]);
  const [dataFilters, setDataFilters] = useState([]);
  const [isGraphData, setGraphData] = useState(false);
  const [category, setCategory] = useState([]);
  const [values, setValues] = useState([]);
  const [chartTypeOptions, setChartTypeOptions] = useState([]);
  const [legendOptions, setLegendOptions] = useState([]);
  const [dataLabelOptions, setDataLabelOptions] = useState([]);
  const [colors, setColors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [outComeTableData, setOutCometableData] = useState([]);
  const [isQuickCompare,setIsquickCompare]=useState(false)
  const [intentionTableData, setIntentiontableData] = useState([]);

  const [fontSizeOptions] = useState([
    { value: 8, label: "8" },
    { value: 10, label: "10" },
    { value: 12, label: "12" },
    { value: 14, label: "14" },
    { value: 16, label: "16" },
  ]);
  const [quickComapreIntemtionData, setQuickComapreIntemtionData] = useState(
    null
  );
  const [quickComapreOutcomeData, setQuickComapreOutcomeData] = useState(null);
  const [quickComapreData, setQuickComapreData] = useState(null);

  const { getloginUserData } = useAuth();
  const userData = getloginUserData();

  const [comment, setComment] = useState({
    opening: "",
    closing: "",
  });

  const getDataFromArr = (arr) => {
    return arr && arr?.length > 0
      ? arr.map((val) => val?.name||val?.responseValue || "Overall").join(", ")
      : "-";
  };
  const reduxChartData = useSelector(getAssessmentCharting);

  function transformDataQuickCompare(data) {
    const categoriesData = [...new Set(data.map((item) => item.data_type))];
    const value = [];

    categoriesData.forEach((category) => {
      const filtered = data.filter((item) => item.data_type === category);
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
   console.log(data)
    data?.forEach((item) => {
      category.push(item.info_name);

      const outcomeValuesQuickCompare = {};
      item?.intentions?.forEach((intention) => {
        outcomeValuesQuickCompare[intention.intention_name] = parseFloat(
          intention.value
        );
      });

      value.push(outcomeValuesQuickCompare);
    });

    return { intentionCategories: category, intentionValues: value };
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
        const chart = localStorage.getItem('chartOptions')
console.log(chart,"chart")
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

  const fetchScore = async (paletteColorID) => {
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
        if (paletteColorID) {
          const colorsData = getPaletteByID(
            response?.data?.scalar,
            paletteColorID
          );
          let colorCodeArray = colorsData?.colors?.map(
            (item) => item.colorCode
          );
          // setColors(colorCodeArray);
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching score data:", error);
    }
  };

  function transformData(data, key1, key2) {
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
  }
  
  function transformDataAggregate(data) {
    console.log("Transform agg data: ", data)
    const category = data.map((item) => (item?.info_name=="Aggregate")?"Survey aggregate":item?.info_name);
    const value = data.map((item) => ({"Aggregate":item.value}));
    console.log("CATEGORY VALUE: ", category, value)
    return { category, value };
  }
  useEffect(() => {
    if (chartSettings && chartSettings?.key !== "single-chart-report-preview") {
      navigate(adminRouteMap.DASHBOARD.path);
    }

    if (chartSettings) {
      // Use chartSettings to prefill the state

      setCharOptions(chartSettings?.Data?.chartOptions);
      setColors(chartSettings?.Data?.chartOptions?.colors)

      console.log(chartSettings)
      setScalerConfigration(chartSettings?.Data?.scalar);

      setComment({
        opening: chartSettings?.Data?.openingComment || "",
        closing: chartSettings?.Data?.closingComment || "",
      });
      setReportName(chartSettings?.Data?.reportName);

      setOutComeData(
        chartSettings?.Data?.chartData?.map((val) => {
          return { [val.info_name]: Number(val.value) };
        }) || []
      );

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
      ]);

      setGraphData(true);
      fetchScore(chartSettings?.Data?.chartOptions.paletteColorID);
    }

    fetchChartOptions("get_chart_option_dropdowns");
    setIsquickCompare(chartSettings?.Data?.chartOptions?.isQuickCompare)

    if (chartSettings?.Data?.reportType === "OUTCOME") {
      if(chartSettings?.Data?.chartOptions?.isQuickCompare){
        let finalData = chartSettings?.Data?.chartData
        // for (let oneRow of chartSettings?.Data?.chartData) {
        //   const result = transformDataQuickCompareIntentions(oneRow);
        //   finalData.push(result);
        // }
        if(chartSettings?.Data?.chartOptions?.switchAxis){
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
          setQuickComapreOutcomeData(finalData)
        }
        else{

          setQuickComapreOutcomeData(finalData);

        }
        return 
      }
      const transformed = chartSettings?.Data?.chartData.map((item) => ({
        ...item,
        info_name: item.info_name === "Department Overall" ? "Overall" : item.info_name,
      }));
        const result = transformData(
          transformed,
          "outcomes",
        "outcome_name"
      );
      setOutCometableData(transformed);
      setCategory(result?.category);
      setValues(result?.value);
      if(chartSettings?.Data?.chartOptions?.switchAxis){
        const result2 = transformOutcomeData(result.category,result.value)
        setCategory(result2?.outcomeCategories)
        setValues(result2?.outcomeValues)
      }

    } 
    if (chartSettings?.Data?.reportType === "AGGREGATE") {
      if(chartSettings?.Data?.chartOptions?.isQuickCompare){
        let finalData = chartSettings?.Data?.chartData
        // for (let oneRow of chartSettings?.Data?.chartData) {
        //   const result = transformDataQuickCompareIntentions(oneRow);
        //   finalData.push(result);
        // }
        if(chartSettings?.Data?.chartOptions?.switchAxis){
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
          // setQuickComapreData(transformedData);
          setQuickComapreData(finalData);

        }
        else{

          setQuickComapreData(finalData);

        }
        return 
      }
      const transformed = chartSettings?.Data?.chartData.map((item) => ({
        ...item,
        info_name: item.info_name === "Aggregate" ? "Survey Aggregate" : item.info_name,
      }));
        const result = transformDataAggregate(chartSettings?.Data?.chartData)

      setCategory(result?.category);
      setValues(result?.value);
      if(chartSettings?.Data?.chartOptions?.switchAxis){
        const result2 = transformOutcomeData(result.category,result.value)
        setCategory(result2?.outcomeCategories)
        setValues(result2?.outcomeValues)
      }

    }else if (chartSettings?.Data?.reportType === "INTENTION") {
      if(chartSettings?.Data?.chartOptions?.isQuickCompare){
        let finalData = chartSettings?.Data?.chartData
        // for (let oneRow of chartSettings?.Data?.chartData) {
        //   const result = transformDataQuickCompareIntentions(oneRow);
        //   finalData.push(result);
        // }
        if(chartSettings?.Data?.chartOptions?.switchAxis){
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
          setQuickComapreIntemtionData(transformedData)
        }
        else{

          setQuickComapreIntemtionData(finalData);

        }
        return 
      }
      const transformed = chartSettings?.Data?.chartData.map((item) => ({
        ...item,
        info_name: item.info_name === "Department Overall" ? "Overall" : item.info_name,
      }));
        const result = transformData(
        transformed,
        "intentions",
        "intention_name"
      );
      setIntentiontableData(transformed);

      setCategory(result.category);
      setValues(result.value);
      if(chartSettings?.Data?.chartOptions?.switchAxis){
        const result2 = transformOutcomeData(result.category,result.value)
        setCategory(result2?.outcomeCategories)
        setValues(result2?.outcomeValues)
      }
    } 
    // else {
    //   setCategory(
    //     chartSettings?.Data?.chartData?.map((val) => val.info_name) || []
    //   );

    //   setValues(chartSettings?.Data?.chartData?.map((val) => val.value) || []);
    // }
  }, [chartSettings]);

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

    intentionTableData?.forEach((item) => {
      item?.intentions?.forEach((intention) => {
        allIntentions.add(intention.intention_name);
      });
    });

    return Array.from(allIntentions);
  };

  const outcomeNames = getAllOutcomes();
  const intentionNames = getAllIntentions();

  return (
    <>
      {isLoading ? (
        <FallBackLoader />
      ) : (
        <div className="summaryReport">
          {/* head title end */}
          <div className="pageContent">
            <div className="pageTitle d-flex justify-content-between align-items-center gap-2">
              <div className="d-flex align-items-center">
                <h2 className="mb-0"> Single Chart Report</h2>
              </div>
              
              {/* <div className="filter_action list-unstyled mb-0">
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
              </div> */}
            </div>
            <Comments comment={comment.opening} userData={userData} image ={true} reportName={reportName}/>

            <div>
              <div className="reportCard">
                                <Previewboxheader userData={userData} image ={true} reportName={reportName}/>

                <div className="reportCard_barchart">
                  <div className="reportCard_barchart_inner">
                    {/* {JSON.stringify(category)+""+JSON.stringify(values)} */}
                    {/* {JSON.stringify(category)+""+JSON.stringify(outComeTableData)} */}
                    {/* {JSON.stringify(getChartTypeByID(
                          chartOptions.chartType,
                          chartTypeOptions,
true                        ))+"+"+chartOptions.chartType+""+JSON.stringify(chartTypeOptions)} */}


{chartSettings?.Data?.chartOptions?.isQuickCompare&&
quickComapreOutcomeData?.map((item,index) => (

    <>
    {/* {JSON.stringify(item)} */}
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
  />
  </>
  ))
}

{chartSettings?.Data?.chartOptions?.isQuickCompare&&
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
  />
  </>
  ))
}

{chartSettings?.Data?.chartOptions?.isQuickCompare&&
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
  />
  </>
  ))
}

                    {(isGraphData && colors?.length > 0&&!isQuickCompare) && (
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
                      />
                    )}
                  </div>
                </div>
                {chartSettings?.Data?.reportType === "AGGREGATE"&&!isQuickCompare && (
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

                {chartSettings?.Data?.reportType === "OUTCOME"&&!isQuickCompare && (
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

                {chartSettings?.Data?.reportType === "INTENTION"&&!isQuickCompare && (
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
              <Comments comment={comment.closing} userData={userData} image ={true} reportName={reportName}/>

            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SingleChartReportPreview;

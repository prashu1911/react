import { SURVEYS_MANAGEMENT } from "apiEndpoints/SurveysManagement";
import { useAuth } from "customHooks";
import { useChartSettings } from "customHooks/useChartSettings";
import CommonBarChartAnnotation from "pages/Admin/Analytics/CommonBarChartAnnotation";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminRouteMap from "routes/Admin/adminRouteMap";
import { commonService } from "services/common.service";
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
import DemographicGraphData from "../MyReportView/DemographicGraphData";
import Comments from "./Comments";
import Previewboxheader from "./Previewboxheader";

const DetailChartReportPreview = () => {
  const { chartSettings } = useChartSettings();
  console.log(chartSettings,"sss")
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
  const [outcomeCategories, setOutcomeCategories] = useState([]);
  const [outcomeValues, setOutcomeValue] = useState([]);
  const [outcomeTable, setOutComeTable] = useState([]);
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
  const [score, setScore] = useState("");
  const [demographicData, setDemoGraphicData] = useState([]);
  const [generatedDate] = useState(new Date());

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

  const getDataFromArr = (arr) => {
    return arr && arr.length > 0
    ? arr.map((val) => val?.name ||val?.responseValue|| "Overall").join(", ")
    : "-";
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
  // function transformDataAggregate(data) {
  //   console.log("Transform agg data: ", data)
  //   const category = data.map((item) => (item?.info_name=="Aggregate")?"Survey aggregate":item?.info_name);
  //   const value = data.map((item) => ({"Survey aggregate":item.value}));
  //   console.log("CATEGORY VALUE: ", category, value)
  //   return { category, value };
  // }


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
      if (response?.status) {
        if (palletId) {
          setScore(response?.data?.scalar);
          const colorsData = getPaletteByID(response?.data?.scalar, palletId);
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

  const fetchColorDataBasedOnPalletId = (ID, scoreID) => {
    if (ID) {
      const colorsData = getPaletteByID(scoreID, ID);

      let colorCodeArray = colorsData?.colors?.map((item) => item.colorCode);

      return { colorCodeArray, colorsArr: colorsData };
    } else {
      return { colorCodeArray: [], colorsArr: [] };
    }
  };

  useEffect(() => {
    if (
      chartSettings &&
      chartSettings?.key !== "deatiled-chart-report-preview"
    ) {
      navigate(adminRouteMap.DASHBOARD.path);
    }

    setCharOptions(chartSettings?.Data?.chartOptions || []);
    setColors(chartSettings?.Data?.chartOptions?.colors)
    setScalerConfigration(chartSettings?.Data?.scalar || []);
    setCrossTabData(chartSettings?.Data?.chartData?.crossTabData || []);
    setComment({
      opening: chartSettings?.Data?.openingComment || "",
      closing: chartSettings?.Data?.closingComment || "",
    });
    setReportName(chartSettings?.Data?.reportName || "");

    if (chartSettings?.Data?.chartData?.outcomeChart) {
      const result = transformData(
        chartSettings?.Data?.chartData?.outcomeChart,
        "outcomes",
        "outcome_name"
      );
      setOutcomeCategories(result.category || []);
      setOutcomeValue(result.value || []);
      setOutComeTable(chartSettings?.Data?.chartData?.outcomeChart);
      if(chartSettings?.Data?.chartOptions?.switchAxis){
        const result2 = transformOutcomeData(result.category,result.value)
        setOutcomeCategories(result2?.outcomeCategories)
        setOutcomeValue(result2?.outcomeValues)
      }
    }

    setOutComeData(
      chartSettings?.Data?.chartData?.aggregateChart?.map((val) => {
        return { [val.info_name]: Number(val.value) };
      }) || []
    );
    // setPalletId(response?.data?.data?.chartOptions?.paletteColorID || "");

    if (chartSettings?.Data?.chartData?.aggregateChart) {
      const result = transformDataAggregate(chartSettings?.Data?.chartData?.aggregateChart);

      setCategory(
       result.category
      );
      setValues(
       result.value
      );
      if(chartSettings?.Data?.chartOptions?.switchAxis){
        const result2 = transformOutcomeData(result.category,result.value)
        setCategory(result2?.outcomeCategories)
        setValues(result2?.outcomeValues)
      }
    }

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

    if (chartSettings?.Data?.chartData?.demographicChart && score) {
      setDemoGraphicData(
        chartSettings?.Data?.chartData?.demographicChart?.map((val) => {
          const { colorCodeArray, colorsArr } = fetchColorDataBasedOnPalletId(
            val?.chartOptions?.paletteColorID || 0,
            score
          );

          return {
            chartOptions: val.chartOptions,
            questionID: val.questionID,
            questionName: val.questionName,
            responses: val.responses,
            colorsArray: colorCodeArray,
            colors: colorsArr,
          };
        })
      );
    }

    setGraphData(true);

    fetchChartOptions("get_chart_option_dropdowns");
    fetchScore(chartSettings?.Data?.chartOptions?.paletteColorID);
  }, [score?.length]);

  return (
    <>
      {" "}
      {isLoading ? (
        <FallBackLoader />
      ) : (
        <>
          {" "}
          <div className="summaryReport">
            <div className="pageContent">
              <div className="pageTitle d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <h2 className="mb-0">Detailed Report</h2>
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
                      {/* {JSON.stringify(category)+JSON.stringify(values)} */}
                      {isGraphData && colors.length > 0 && chartOptions && (
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
                            (chartOptions?.scalarOpacity / 100).toFixed(2)
                          )}
                          showNegative={false}
                          chartType={getChartTypeByID(
                            chartOptions.chartType,
                            chartTypeOptions,
                            true
                          )}
                          legendPosition={
                            getLgendsByID(
                              chartOptions?.legend,
                              legendOptions
                            ) || "bottom"
                          }
                          labelPosition={
                            getDataLabelsByID(chartOptions.dataLabel, dataLabelOptions)  ||
                            "top"
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
                            <td>{key.replace('Department Overall',"Overall")}</td>
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
                    {/* {JSON.stringify(outcomeCategories)+JSON.stringify(outcomeValues)} */}

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
                            getDataLabelsByID(chartOptions.dataLabel, dataLabelOptions)  ||
                            "top"
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

                <div className="reportCard">
                                  <Previewboxheader userData={userData} image ={true} reportName={reportName}/>


                  <div className="reportCard_barchart">
                    <div className="reportCard_barchart_inner">
                      {isGraphData && demographicData?.length > 0 && (
                        <DemographicGraphData
                          colorCollpaseShow
                          chartData={demographicData}
                          scalarConfiguration={scalerConfigration}
                          colorsChart={colors}
                          renderChart={false}
                          chartOptions={chartOptions}
                          report={true}
                          showNegative={false}
                          chartTypeOptions={chartTypeOptions}
                          legendOptions={legendOptions}
                          dataLabelOptions={dataLabelOptions}
                          fontSizeOptions={fontSizeOptions}
                          loading={false}
                        />
                      )}
                    </div>
                  </div>
                </div>
                {chartSettings?.Data?.chartData?.orboeqData && (
  <>
   {/* Response based Open Ended Responses */}
{chartSettings.Data.chartData.orboeqData.rboeq?.length > 0 && (
  <div className="reportCard">
    <Previewboxheader userData={userData} image={true} reportName={reportName} />

    <h3 className="reportCard_title mb-2 d-flex justify-content-center align-items-center">
      Response based Open Ended Responses
    </h3>
    <div className="reportCard_table">
      {chartSettings.Data.chartData.orboeqData.rboeq.map((item) => {
        const counts = {};
        item.responses.forEach((res) => {
          const text = res.trim();
          counts[text] = (counts[text] || 0) + 1;
        });

        const grouped = Object.entries(counts);

        return (
          <table key={item.id} className="mb-4 mt-3 w-100">
            {/* {JSON.stringify} */}
            <thead>
              <tr>
                <th style={{ width: '20%' }}>Question </th>
                <th>{item.question}</th>
              </tr>
            </thead>
            <tbody>
            <tr>
                    <td style={{ width: '20%' }}>{`Response`}</td>
                    <td>{item?.responseName}</td>
                  </tr>
              {grouped.length > 0 ? (
                grouped.map(([text, count], i) => (
                  <tr key={i}>
                    <td style={{ width: '20%' }}>{`Participant Response (${count})`}</td>
                    <td>{text || "Not enough responses"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">Not enough responses</td>
                </tr>
              )}
            </tbody>
          </table>
        );
      })}
    </div>
  </div>
)}

{/* Intra-Survey Open-Ended Question Responses (EQR) */}
{chartSettings.Data.chartData.orboeqData.oeq?.length > 0 && (
  <div className="reportCard">
    <Previewboxheader userData={userData} image={true} reportName={reportName} />

    <h3 className="reportCard_title mb-2 d-flex justify-content-center align-items-center">
      Intra-Survey Open-Ended Question Responses
    </h3>

    <div className="reportCard_table">
      {chartSettings.Data.chartData.orboeqData.oeq.map((item) => {
        const counts = {};
        item.responses.forEach((res) => {
          const text = res.trim();
          counts[text] = (counts[text] || 0) + 1;
        });

        const grouped = Object.entries(counts);

        return (
          <table key={item.id} className="mb-4 mt-3 w-100">
            <thead>
              <tr>
                <th style={{ width: '20%' }}>Question</th>
                <th>{item.question}</th>
              </tr>
            </thead>
            <tbody>
              {grouped.length > 0 ? (
                grouped.map(([text, count], i) => (
                  <tr key={i}>
                    <td style={{ width: '20%' }}>{`Participant Response (${count})`}</td>
                    <td>{text || "Not enough responses"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">Not enough responses</td>
                </tr>
              )}
            </tbody>
          </table>
        );
      })}
    </div>
  </div>
)}

  </>
)}
                  <Comments comment={comment.closing} userData={userData} image ={true} reportName={reportName}/>

              {chartOptions.showCrosstab&&  <div className="reportCard">
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
                    <span>© {new Date().getFullYear()}, Metolius®</span>
                  </div>
                </div>}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DetailChartReportPreview;

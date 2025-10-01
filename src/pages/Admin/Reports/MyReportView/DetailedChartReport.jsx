/* eslint-disable react/no-danger */
import { Link, useLocation } from "react-router-dom";
import { Breadcrumb, Loader, ReactDataTable } from "components";
import adminRouteMap from "routes/Admin/adminRouteMap";
import { useEffect, useRef, useState } from "react";
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
// eslint-disable-next-line import/no-extraneous-dependencies
import html2pdf from "html2pdf.js";
import DemographicGraphData from "./DemographicGraphData";
import OutcomeTableData from "./OutcomeTableData";
import Comments from "../Previews/Comments";
import Previewboxheader from "../Previews/Previewboxheader";

export default function DetailedChartReport() {
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
      name: "Detailed Report",
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

  const [crossTabData, setCrossTabData] = useState([]);

  const [palletId, setPalletId] = useState();

  const [demographicData, setDemoGraphicData] = useState([]);
  const [score, setScore] = useState("");

  const [outcomeTable, setOutComeTable] = useState([]);
  const [reportTime, setReportTime] = useState("");
  const chartRef = useRef();

  const [showLoading, setShowLoading] = useState(true);
  const [data,setData] =useState({})
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

  const fetchColorDataBasedOnPalletId = (ID, scoreID) => {
    if (ID) {
      const colorsData = getPaletteByID(scoreID, ID);

      let colorCodeArray = colorsData?.colors?.map((item) => item.colorCode);

      return { colorCodeArray, colorsArr: colorsData };
    } else {
      return { colorCodeArray: [], colorsArr: [] };
    }
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
      setCharOptions(response?.data?.data?.chartOptions);
      setData(response?.data?.data)
      setScalerConfigration(response?.data?.data?.scalar);
      setColors(response?.data?.data?.chartOptions?.colors||colors)

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

      if (response?.data?.data?.chartData?.demographicChart && score) {
        setDemoGraphicData(
          response?.data?.data?.chartData?.demographicChart?.map((val) => {
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

      setReportTime(
        response?.data?.data?.dateTime
          ? formatDateTime(response?.data?.data?.dateTime)
          : ""
      );

      if (response?.data?.data) {
        setGraphData(true);
      }

      setShowLoading(false);
    }
  };

  useEffect(() => {
    fetchReportById();
  }, [reportID, score]);

  const fetchScore = async () => {
    try {
      const companyId =await localStorage.getItem("companyId");

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
        setScore(response?.data?.scalar);
        if (palletId) {
          const colorsData = getPaletteByID(response?.data?.scalar, palletId);
          let colorCodeArray = colorsData?.colors?.map(
            (item) => item.colorCode
          );
          setColors(colorCodeArray);
          console.log(colorCodeArray,"colors")
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

  const pdfRef = useRef(null);

  const handleDownload = () => {
    const element = pdfRef.current;
    const elementWidth = element.offsetWidth;

    const opt = {
      margin: 0,
      filename: "detail-summary-report.pdf",
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        scale: 2,
        scrollY: 0,
        useCORS: true,
        width: elementWidth,
      },
      jsPDF: {
        unit: "px",
        format: [elementWidth, 1180],
        orientation: "portrait",
      },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <>
      {" "}
      {showLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
  <Loader />
</div>
      ) : (
        <>
          {" "}
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
                  <h2 className="mb-0">Detailed Report </h2>
                </div>
                <ul className="filter_action list-unstyled mb-0">
                  <li>
                    <button
                      onClick={handleDownload}
                      type="button"
                      aria-label="Download icon"
                      className="btn-icon ripple-effect"
                    >
                      <em className="icon-download" />
                    </button>
                  </li>
                </ul>
              </div>



              <div ref={pdfRef}>
              <Comments comment={comment.opening} userData={userData} image ={true} reportName={reportName}/>

                <div className="reportCard">
                                  <Previewboxheader userData={userData} image ={true} reportName={reportName}/>

                  
                  <div className="reportCard_barchart">
                    <div className="reportCard_barchart_inner">
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
                          showNegative={showNegative}
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
                            getDataLabelsByID(chartOptions.dataLabel, dataLabelOptions) ||
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
                    />

                    <div
                      className="my-xl-3 my-2"
                      // eslint-disable-next-line react/no-danger
                      dangerouslySetInnerHTML={{ __html: comment.closing }}
                    /> */}
                  </div>
                  
                </div>

                <div className="reportCard">
                                  <Previewboxheader userData={userData} image ={true} reportName={reportName}/>


                  <div className="reportCard_barchart" ref={chartRef}>
                    <div className="reportCard_barchart_inner">
                      {isGraphData && demographicData?.length > 0 && (
                        <DemographicGraphData
                          colorCollpaseShow
                          chartData={demographicData}
                          scalarConfiguration={scalerConfigration}
                          colorsChart={colors}
                          renderChart={false}
                          showNegative={false}
                          chartOptions={chartOptions}
                          chartTypeOptions={chartTypeOptions}
                          legendOptions={legendOptions}
                          dataLabelOptions={dataLabelOptions}
                          fontSizeOptions={fontSizeOptions}
                          loading={false}
                          report={true}
                        />
                      )}
                    </div>
                  </div>
                </div>
                {data.chartData?.orboeqData && (
  <>
    {/* Response based Open Ended Responses */}
  {/* Response based Open Ended Responses */}
{data.chartData.orboeqData.rboeq?.length > 0 && (
  <div className="reportCard">
    <div className="header_left">
      {/* <ImageElement
        previewSource={
          userData?.logo || "../../assets/admin-images/logo.svg"
        }
        className="logoUpdate"
      /> */}
    </div>
    <Previewboxheader userData={userData} image={true} reportName={reportName} />

    <h3 className="reportCard_title mb-2 d-flex justify-content-center align-items-center">
      Response based Open Ended Responses
    </h3>

    <div className="reportCard_table">
  {Object.entries(
    data.chartData.orboeqData.rboeq.reduce((acc, item) => {
      const key = item.responseName || 'Unknown';
      if (!acc[key]) {
        acc[key] = { questions: new Set(), responses: [] };
      }
      acc[key].questions.add(item.question);
      acc[key].responses.push(...item.responses);
      return acc;
    }, {})
  ).map(([responseName, { questions, responses }], index) => {
    const counts = {};
    responses.forEach((res) => {
      const text = res.trim();
      counts[text] = (counts[text] || 0) + 1;
    });
    const grouped = Object.entries(counts);

    return (
      <table key={index} className="mb-4 mt-3 w-100">
        <thead>
          <tr>
            <th style={{ width: '20%' }}>Question</th>
            <th>{Array.from(questions).join(', ')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ width: '20%' }}>Response</td>
            <td>{responseName}</td>
          </tr>
          {grouped.length > 0 ? (
            grouped.map(([text, count], i) => (
              <tr key={i}>
                <td style={{ width: '20%' }}>{`Participant Response (${count})`}</td>
                <td>{text || 'Not enough responses'}</td>
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
{data.chartData.orboeqData.oeq?.length > 0 && (
  <div className="reportCard">
    <div className="header_left">
      {/* <ImageElement
        previewSource={
          userData?.logo || "../../assets/admin-images/logo.svg"
        }
        className="logoUpdate"
      /> */}
    </div>
    <Previewboxheader userData={userData} image={true} reportName={reportName} />

    <h3 className="reportCard_title mb-2 d-flex justify-content-center align-items-center">
      Intra-Survey Open-Ended Question Responses
    </h3>

    <div className="reportCard_table">
      {data?.chartData.orboeqData.oeq.map((item) => {
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

            { chartOptions.showCrosstab&&<div className="reportCard">
              <Previewboxheader userData={userData} image ={true} reportName={reportName}/>

                      
                <ReactDataTable
                showFooter={false}
                isPaginate={false}
                data={processCrosstabData(crossTabData)}
                columns={crosstabColumns}
                isCrosstab={true}
              />
                  {/* <div className="reportCard_table">
                    <table className="mt-xxl-3 mt-2">
                      <thead>
                        <tr>
                          <th>Crosstab</th>
                          <th>Responses</th>
                          <th>Overall (Count)</th>
                          <th className="text-center">%</th>
                        </tr>
                      </thead>
                      <tbody>
                        {crossTabData.map((item) =>
                          item.responses.map((response, index) => (
                            <tr key={response.response_id}>
                              {index === 0 && (
                                <td rowSpan={item.responses.length}>
                                  {item.question}
                                </td>
                              )}
                              <td>{response.response_name}</td>
                              <td>{response.response_user_count}</td>
                              <td>
                                {parseFloat(
                                  response.response_percentage
                                ).toFixed(2)}
                                %
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div> */}
                   <div className="reportCard_info d-flex justify-content-between flex-wrap gap-1">
                    <span>Report Generated at {reportTime}</span>
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
}

import { SURVEYS_MANAGEMENT } from "apiEndpoints/SurveysManagement";
import { useAuth } from "customHooks";
import { useChartSettings } from "customHooks/useChartSettings";
import React, { useEffect, useState } from "react";
import { commonService } from "services/common.service";
// import { usePDF } from "react-to-pdf";
import { useNavigate } from "react-router-dom";
import adminRouteMap from "routes/Admin/adminRouteMap";
import { ImageElement, Loader, ReactDataTable } from "components";
import IgGraphDataMap from "../MyReportView/IgGraphDataMap";
import Previewboxheader from "./Previewboxheader";
import Comments from "./Comments";

function IGChartReportPreview() {
  // const { toPDF, targetRef } = usePDF({ filename: "ig-chart-report.pdf" });
  const navigate = useNavigate();

  const { chartSettings } = useChartSettings();

  const [showLoading, setShowLoading] = useState(true);
  const [scalerConfigration, setScalerConfigration] = useState({});
  const [reportName, setReportName] = useState("");
  const [dataFilters, setDataFilters] = useState([]);
  const [isGraphData, setGraphData] = useState(false);
  const [igGraphData, setIgGraphData] = useState([]);
  const [crossTabData, setCrossTabData] = useState([]);
  const [reportTime, setReportTime] = useState("");
  const [chartTypeOptions, setChartTypeOptions] = useState([]);
  const [legendOptions, setLegendOptions] = useState([]);
  const [dataLabelOptions, setDataLabelOptions] = useState([]);
  const processCrosstabData = (data) => {
    if (!data) return [];

    let processedData = [];
    let counter = 1;

    data.forEach((item) => {
      // For branched questions, include level in question name
      const questionText = item.is_branch
        ? `${item.question} (Level ${item.filter_level})`
        : item.question;

      // Create a row for each response
      item.responses.forEach((response, index) => {
        processedData.push({
          number: index === 0 ? counter++ : '', // Only show number in first row
          question: index === 0 ? questionText : '', // Only show question in first row
          response_name: response.response_name,
          response_user_count: response.response_user_count,
          total_user_count: response.total_user_count,
          percentage: `${response.response_percentage}%`,
          rowspan: index === 0 ? item.responses.length : 0 // Set rowspan for first row only
        });
      });
    });

    return processedData;
  };
  const crosstabColumns = [
    {
      title: "#",
      dataKey: "number",
      data: "number",
      columnHeaderClassName: "no-sorting w-1 text-center",
    },
    {
      title: "Question",
      dataKey: "question",
      data: "question",
      columnHeaderClassName: "no-sorting",
      rowspan: (row) => row.rowspan || 1
    },
    {
      title: "Response",
      dataKey: "response_name",
      data: "response_name",
      columnHeaderClassName: "no-sorting",
    },
    {
      title: "Count",
      dataKey: "response_user_count",
      data: "response_user_count",
      columnHeaderClassName: "no-sorting text-center",
    },
    {
      title: "Total",
      dataKey: "total_user_count",
      data: "total_user_count",
      columnHeaderClassName: "no-sorting text-center",
    },
    {
      title: "%",
      dataKey: "percentage",
      data: "percentage",
      columnHeaderClassName: "no-sorting text-center",
    },
  ];
  
  const [fontSizeOptions] = useState([
    { value: 8, label: "8" },
    { value: 10, label: "10" },
    { value: 12, label: "12" },
    { value: 14, label: "14" },
    { value: 16, label: "16" },
  ]);

  const { getloginUserData } = useAuth();
  const userData = getloginUserData();

  const [comment, setComment] = useState({
    opening: "",
    closing: "",
  });

  const getDataFromArr = (arr) => {
    return arr && arr.length > 0
      ? arr.map((val) => val?.name||val?.responseValue || "Overall").join(", ")
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

  const fetchChartOptions = async (action) => {
    try {
      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT?.getDefaultChartSettings,
        queryParams: { action },
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

        const filteredChartOptions = defaultChartOptions.filter(
          (item) => item.label !== "Column" && item.label !== "Spider"
        );

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
      console.error("Error fetching chart options:", error);
    }
  };

  useEffect(() => {
    if (chartSettings && chartSettings?.key !== "ig-chart-report-preview") {
      navigate(adminRouteMap.DASHBOARD.path);
    }

    if (chartSettings) {
      setScalerConfigration(chartSettings?.Data?.scalar);

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
        ...(chartSettings?.Data?.dataFilters?.demographicFilters || [])?.filter((item)=>getDataFromArr(item.responses)?.length>1)?.map(
          (item) => ({
            [item.questionValue]: getDataFromArr(item.responses),
          })
        ),
        {
          "Manager Reportees":
            chartSettings?.Data?.dataFilters?.managerReportees,
        },
        // {
        //   References: getDataFromArr(
        //     chartSettings?.Data?.dataFilters?.references
        //   ),
        // },
      ]);

      setComment({
        opening: chartSettings?.Data?.openingComment || "",
        closing: chartSettings?.Data?.closingComment || "",
      });

      if (chartSettings?.Data?.chartData?.chartData)
        setIgGraphData(chartSettings?.Data?.chartData?.chartData || []);

      setReportTime(
        chartSettings?.Data?.dateTime
          ? formatDateTime(chartSettings?.Data?.dateTime)
          : ""
      );

      setReportName(chartSettings?.Data?.reportName || "");
      setCrossTabData(chartSettings?.Data?.crossTab || []);
      setGraphData(true);
      setShowLoading(false);
    }

    fetchChartOptions("get_chart_option_dropdowns");
  }, [chartSettings]);

  return (
    <>
      {showLoading ? (
        <Loader />
      ) : (
        <div className="summaryReport">
          <div className="pageContent">
            <div className="pageTitle d-flex justify-content-between align-items-center gap-2">
              <div className="d-flex align-items-center">
                <h2 className="mb-0">IG Report Preview</h2>
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
                    <div className="demographicAnalysis_Body">
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
                      {isGraphData && igGraphData?.length > 0 && (
                        // Update the IgGraphDataMap component call:
                        <IgGraphDataMap
                          colorCollpaseShow
                          chartData={igGraphData}
                          scalarConfiguration={scalerConfigration}
                          renderChart={false}
                          showNegative={false}
                          chartTypeOptions={chartTypeOptions}
                          legendOptions={legendOptions}
                          dataLabelOptions={dataLabelOptions}
                          fontSizeOptions={fontSizeOptions}
                          loading={false}
                          // Add these new props for legend styling
                          chartOptions={chartSettings?.Data?.chartOptions} // Pass chart options from preview data
                          labelColorState={
                            chartSettings?.Data?.chartOptions?.lableColor ||
                            "#696666"
                          }
                          legendPosition={
                            chartSettings?.Data?.chartOptions?.legend ||
                            "bottom"
                          }
                          annotationOpacity={
                            chartSettings?.Data?.chartOptions?.scalarOpacity ||
                            100
                          }
                          fontSize={
                            chartSettings?.Data?.chartOptions?.fontSize || 12
                          }
                          switchAxis={
                            chartSettings?.Data?.chartOptions?.switchAxis ||
                            false
                          }
                          paletteColorID={
                            chartSettings?.Data?.chartOptions?.paletteColorID
                          }
                        />
                      )}
                    </div>
                  </div>
                </div>
                {/* <div className="reportCard_info d-flex justify-content-between flex-wrap gap-1">
                  <span>Report Generated at {reportTime}</span>
                  <span>© {new Date().getFullYear()}, Metolius®</span>
                </div> */}
              </div>

              {/* <div className="reportCard">
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
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{key}</td>
                            <td>{value}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
               
                </div>
              
              </div> */}

              <Comments comment={comment.closing} userData={userData} image ={true} reportName={reportName}/>

              {chartSettings?.Data?.chartOptions.showCrosstab&&
              <div className="reportCard">
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
                              {parseFloat(response.response_percentage).toFixed(
                                2
                              )}
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
      )}
    </>
  );
}

export default IGChartReportPreview;

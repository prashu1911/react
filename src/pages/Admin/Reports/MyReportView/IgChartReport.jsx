import { Breadcrumb, Loader, ReactDataTable } from "components";
import { Link, useLocation } from "react-router-dom";
import adminRouteMap from "routes/Admin/adminRouteMap";
import { REPORTS_MANAGEMENT } from "apiEndpoints/ReportsManagement";
import { useAuth } from "customHooks";
import { useEffect, useState } from "react";
import { commonService } from "services/common.service";
import { SURVEYS_MANAGEMENT } from "apiEndpoints/SurveysManagement";
import { usePDF } from "react-to-pdf";
import IgGraphDataMap from "./IgGraphDataMap";
import { crosstabColumns, processCrosstabData } from "utils/common.util";
import Comments from "../Previews/Comments";
import Previewboxheader from "../Previews/Previewboxheader";

export default function IgChartReport() {
  const location = useLocation();
  const { toPDF, targetRef } = usePDF({
    filename:
      location.pathname === "/my-reports/drilldown-report"
        ? "drilldown-report.pdf"
        : "ig-chart-report.pdf",
  });
  console.log(location?.pathname,"location")
  const { reportID } = location.state || {};
  const [showLoading, setShowLoading] = useState(true);
  const [dataFilters, setDataFilters] = useState([]);

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
      name:
        location.pathname === "/my-reports/drilldown-report"
          ? "Drill Down Report"
          : "IG Report",
    },
  ];

  const { getloginUserData } = useAuth();
  const userData = getloginUserData();

  const [comment, setComment] = useState({
    opening: "",
    closing: "",
  });

  const [reportName, setReportName] = useState("");

  const [scalerConfigration, setScalerConfigration] = useState({});

  const [chartTypeOptions, setChartTypeOptions] = useState([]);

  const [legendOptions, setLegendOptions] = useState([]);

  const [dataLabelOptions, setDataLabelOptions] = useState([]);

  const [isGraphData, setGraphData] = useState(false);

  const [reportTime, setReportTime] = useState("");

  const [igGraphData, setIgGraphData] = useState([]);
  const [data,setdata]=useState({})
  const [crossTabData, setCrossTabData] = useState([]);

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

  const fetchReportById = async () => {
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
              response?.data?.data?.dataFilters?.managerReportees,
          },
          {
            References: getDataFromArr(
              response?.data?.data?.dataFilters?.references
            ),
          },
        ]);

        setComment({
          opening: response?.data?.data?.openingComment || "",
          closing: response?.data?.data?.closingComment || "",
        });

        if (response?.data?.data?.chartData?.chartData)
          setIgGraphData(response?.data?.data?.chartData?.chartData || []);


        setReportTime(
          response?.data?.data?.dateTime
            ? formatDateTime(response?.data?.data?.dateTime)
            : ""
        );
        setReportName(response?.data?.data?.reportName || "");
        setCrossTabData(response?.data?.data?.crossTab || []);
        setdata(response?.data?.data)
        setGraphData(true);
      }
      setShowLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchReportById();
  }, [reportID]);

  const fetchChartOptions = async (action) => {
    try {
      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT?.getDefaultChartSettings,
        queryParams: {
          action,
          type:        location.pathname === "/my-reports/drilldown-report"?"DRILLDOWN":"DA"

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
      console.error("Error fetching score data:", error);
    }
  };

  useEffect(() => {
    fetchChartOptions("get_chart_option_dropdowns");
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
                <h2 className="mb-0">
                  {" "}
                  {location.pathname === "/my-reports/drilldown-report"
                    ? "Drill Down Report"
                    : "IG Report"}
                </h2>
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
                        />
                      )}
                    </div>
                  </div>
                </div>

              
              </div>
                      {/* {JSON.stringify(data?.chartOptions)}i */}
              <Comments comment={comment.closing} userData={userData} image ={true} reportName={reportName}/>

              {data?.chartOptions?.showCrosstab &&<div className="reportCard">
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

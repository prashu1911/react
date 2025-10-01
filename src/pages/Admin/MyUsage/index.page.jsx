import React, { useEffect, useState } from "react";
import { Card, Col, ProgressBar, Row } from "react-bootstrap";
import { useAuth } from "customHooks";
import { commonService } from "services/common.service";
import { MyUsageEndPoint } from "apiEndpoints/MyUsage/index";
import { useTable } from "customHooks/useTable";
import ImageElement from "../../../components/ImageElement";
import { Breadcrumb, Loader, ReactDataTable } from "../../../components";
import CommonBarChartAnnotation from "../Analytics/CommonBarChartAnnotation";

// donut chart

export default function MyUsage() {
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  const [myUsagesUserData, setMyUsagesUserData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(true);
  const [consumed, setConsumed] = useState(0);
  const [available, setAvailable] = useState(0);
  const [publishedSurvey, setPublishedSurvey] = useState([]);
  const [firstResponse, setFirstResponse] = useState({});
  const [secondResponse, setSecondResponse] = useState({});
  const [thirdResponse, setThirdResponse] = useState({});
  const [surveyInstrument, setSurveyInstrument] = useState({});
  const [resposneCount, setResposneCount] = useState({});
  const [adminCount, setAdminCount] = useState({});
  const [searchValue] = useState("");
  const [tableFilters] = useState({});

  // data table
  const columns = [
    {
      title: "S.No.",
      dataKey: "s.no",
      data: "s.no",
      columnHeaderClassName: "no-sorting w-1 text-center",
    },
    {
      title: "Surveys",
      dataKey: "surveyName",
      data: "surveys",
      sortable: true,
    },
    {
      title: "Outcomes",
      dataKey: "outcomeCount",
      data: "outcomes",
      sortable: true,
    },
    {
      title: "Intentions",
      dataKey: "intentionCount",
      data: "intentions",
      sortable: true,
    },
  ];
  // breadcrumb
  const breadcrumb = [
    {
      path: "#",
      name: "My Usage",
    },
  ];

  const handleMyUsagesUserData = async () => {
    setIsSubmitting(true);
    try {
      const response = await commonService({
        apiEndPoint: MyUsageEndPoint.myUsageGetDetails,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        toastType: {
          success: true,
          error: true,
        },
      });
      if (response?.status) {
        setMyUsagesUserData(response?.data?.data);
      }

      setIsSubmitting(false);
    } catch (error) {
      console.error("error", error);
    }
  };

  const handleSurveyInstruments = async () => {
    setIsSubmitting(true);
    try {
      const response = await commonService({
        apiEndPoint: MyUsageEndPoint.surveyInstruments,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        toastType: {
          success: true,
          error: true,
        },
      });
      if (response?.status) {
        setConsumed(response?.data?.data?.consumed);
        setAvailable(response?.data?.data?.available);

        const surveyInstrumentData = {
          categories: ["Consumed", "Available"],
          values: [
            response?.data?.data?.consumed,
            response?.data?.data?.consumed + response?.data?.data?.available,
          ],
        };
        setSurveyInstrument(surveyInstrumentData);
      }

      setIsSubmitting(false);
    } catch (error) {
      console.error("error", error);
    }
  };

  const handlePublishedSurvey = async () => {
    setIsSubmitting(true);
    try {
      const response = await commonService({
        apiEndPoint: MyUsageEndPoint.publishedSurvey,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        toastType: {
          success: true,
          error: true,
        },
      });
      if (response?.status) {
        setPublishedSurvey(response?.data?.data);
      }

      setIsSubmitting(false);
    } catch (error) {
      console.error("error", error);
    }
  };

  const getCategoriesAndValues = (obj) => {
    const categories = Object.keys(obj);
    const values = Object.values(obj);
    return { categories, values };
  };

  const handleUsageSummary = async () => {
    setIsSubmitting(true);
    try {
      const response = await commonService({
        apiEndPoint: MyUsageEndPoint.usageSummary,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        toastType: {
          success: true,
          error: true,
        },
      });
      if (response?.status) {
        const firstResponseData = getCategoriesAndValues(
          response?.data?.data.monthlyResponses
        );
        setFirstResponse(firstResponseData);

        const secondResponseData = getCategoriesAndValues(
          response?.data?.data.monthlySurveys
        );
        setSecondResponse(secondResponseData);

        const thirdResponseData = getCategoriesAndValues(
          response?.data?.data.yearlySurveys
        );
        setThirdResponse(thirdResponseData);
      }

      setIsSubmitting(false);
    } catch (error) {
      console.error("error", error);
    }
  };

  const handleResponseCount = async () => {
    setIsSubmitting(true);
    try {
      const response = await commonService({
        apiEndPoint: MyUsageEndPoint.responseCount,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        toastType: {
          success: true,
          error: true,
        },
      });
      if (response?.status) {
        const surveyInstrumentData = {
          categories: ["Received", "Pending"],
          values: [
            response?.data?.data?.received,
            response?.data?.data?.pending + response?.data?.data?.received,
          ],
        };
        setResposneCount(surveyInstrumentData);
      }

      setIsSubmitting(false);
    } catch (error) {
      console.error("error", error);
    }
  };

  const handleaAdminCount = async () => {
    setIsSubmitting(true);
    try {
      const response = await commonService({
        apiEndPoint: MyUsageEndPoint.adminCount,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        toastType: {
          success: true,
          error: true,
        },
      });
      if (response?.status) {
        const surveyAdminData = {
          categories: ["User", "Available"],
          values: [
            response?.data?.data?.user,
            response?.data?.data?.user + response?.data?.data?.available,
          ],
        };

        setAdminCount(surveyAdminData);
      }

      setIsSubmitting(false);
    } catch (error) {
      console.error("error", error);
    }
  };

  useEffect(() => {
    handleMyUsagesUserData();
    handleSurveyInstruments();
    handlePublishedSurvey();
    handleUsageSummary();
    handleResponseCount();
    handleaAdminCount();
  }, []);

  // This hook is not usefull when we handle search,filter,pagination from api.
  const {
    currentData,
    totalRecords,
    totalPages,
    offset,
    limit,
    sortState,
    setOffset,
    setLimit,
    handleSort,
  } = useTable({
    searchValue,
    searchKeys: [],
    tableFilters,
    initialLimit: 5,
    data: publishedSurvey,
  });

  const handleLimitChange = (value) => {
    setLimit(value);
    setOffset(1);
  };

  const handleOffsetChange = (value) => {
    setOffset(value);
  };

  return (
    <>
      {isSubmitting && Object.keys(myUsagesUserData)?.length === 0 ? (
        <Loader />
      ) : (
        <div className="profilePage">
          {/* head title start */}
          <section className="commonHead">
            <h1 className="commonHead_title">Welcome Back!</h1>
            <Breadcrumb breadcrumb={breadcrumb} />
          </section>
          {/* head title end */}
          <Row className="g-3">
            <Col sm={12}>
              <Card className="flex-row">
                <div className="card_leftbox">
                  <div className="profileImg">
                    <ImageElement
                      previewSource={
                        myUsagesUserData?.profilePicture || "profile.png"
                      }
                      alt="profile"
                    />
                  </div>
                  <div className="info">
                    <h2>{myUsagesUserData?.fullName || "Bob"}</h2>
                    <p> {myUsagesUserData?.emailID || "backbryan@gmail.com"}</p>
                    <ul>
                      <li>{myUsagesUserData?.role || "backbryan@gmail.com"}</li>
                      <li>
                        {" "}
                        {myUsagesUserData?.companyName || "Amberty Enterprise"}
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="card_rightbox">
                  <ul>
                    <li>
                      <p>Subscriber Plan</p>
                      <h3>
                        {myUsagesUserData?.subscriptionType || ""}
                        <span>Manage Plan</span>
                      </h3>
                    </li>
                    <li>
                      <p>Start Date</p>
                      <h3> {myUsagesUserData?.subscriptionStartDate || ""}</h3>
                    </li>
                    <li>
                      <p>Renewal Due On</p>
                      <h3>{myUsagesUserData?.renewalDate || ""} </h3>
                    </li>
                    <li>
                      <p>Subscription status</p>
                      <h3>
                        <div className="active" />
                        {myUsagesUserData?.status || ""}
                      </h3>
                    </li>
                    <li>
                      <p>End Date</p>
                      <h3>{myUsagesUserData?.subscriptionEndDate || ""}</h3>
                    </li>
                    <li>
                      <p>Payment Cycle</p>
                      <h3>{myUsagesUserData?.paymentCycle || ""}</h3>
                    </li>
                  </ul>
                </div>
              </Card>
            </Col>
            <Col lg={6}>
              <Card className="p-4">
                <h2 className="card_title">Usage Summary</h2>
                <div className="card_progress">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="card_progress_title">
                      Story Survey Instruments
                    </div>

                    <div className="card_progress_value">
                      {consumed} /{consumed + available} Used
                    </div>
                  </div>
                  <ProgressBar
                    now={(consumed / (consumed + available)) * 100}
                  />
                </div>
                <Row>
                  <Col sm={4}>
                    <div className="chartbox">
                      <h3>Monthly Response</h3>
                      <CommonBarChartAnnotation
                        key={1}
                        scalarConfigurationPropData={[]}
                        categories={firstResponse?.categories || []}
                        values={firstResponse?.values || []}
                        activeTab=""
                        colorsChart={[
                          "#ef3d31",
                          "#f46a2b",
                          "#f88d23",
                          "#fcad18",
                          "#ffcb05",
                          "#81b73c",
                          "#6aa93a",
                          "#519a38",
                          "#368c36",
                        ]}
                        renderChart
                        switchAxis
                        labelColorState="#000000"
                        annotationOpacity={Number((100 / 100).toFixed(2))}
                        showNegative={false}
                        chartType="donut"
                        legendPosition="bottom"
                        labelPosition="top"
                        fontSize="12"
                      />
                    </div>
                  </Col>
                  <Col sm={4}>
                    <div className="chartbox">
                      <h3>Monthly Surveys</h3>
                      <CommonBarChartAnnotation
                        key={1}
                        scalarConfigurationPropData={[]}
                        categories={secondResponse?.categories || []}
                        values={secondResponse?.values || []}
                        activeTab=""
                        colorsChart={[
                          "#ef3d31",
                          "#f46a2b",
                          "#f88d23",
                          "#fcad18",
                          "#ffcb05",
                          "#81b73c",
                          "#6aa93a",
                          "#519a38",
                          "#368c36",
                        ]}
                        renderChart
                        switchAxis
                        labelColorState="#000000"
                        annotationOpacity={Number((100 / 100).toFixed(2))}
                        showNegative={false}
                        chartType="donut"
                        legendPosition="bottom"
                        labelPosition="top"
                        fontSize="12"
                      />
                    </div>
                  </Col>
                  <Col sm={4}>
                    <div className="chartbox">
                      <h3>Yearly Surveys</h3>
                      <CommonBarChartAnnotation
                        key={1}
                        scalarConfigurationPropData={[]}
                        categories={thirdResponse?.categories || []}
                        values={thirdResponse?.values || []}
                        activeTab=""
                        colorsChart={[
                          "#ef3d31",
                          "#f46a2b",
                          "#f88d23",
                          "#fcad18",
                          "#ffcb05",
                          "#81b73c",
                          "#6aa93a",
                          "#519a38",
                          "#368c36",
                        ]}
                        renderChart
                        switchAxis
                        labelColorState="#000000"
                        annotationOpacity={Number((100 / 100).toFixed(2))}
                        showNegative={false}
                        chartType="donut"
                        legendPosition="bottom"
                        labelPosition="top"
                        fontSize="12"
                      />
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col lg={6}>
              <Card className="p-4 h-100">
                <h2 className="card_title">Subscriber Admin - Published</h2>
                <ReactDataTable
                  data={currentData}
                  columns={columns}
                  page={offset}
                  totalLength={totalRecords}
                  totalPages={totalPages}
                  sizePerPage={limit}
                  handleLimitChange={handleLimitChange}
                  handleOffsetChange={handleOffsetChange}
                  searchValue={searchValue}
                  handleSort={handleSort}
                  sortState={sortState}
                />
              </Card>
            </Col>
            <Col md={6} lg={4}>
              <Card>
                <div className="chartbox text-center">
                  <h3>Admins</h3>
                  <CommonBarChartAnnotation
                    key={1}
                    scalarConfigurationPropData={[]}
                    categories={adminCount?.categories || []}
                    values={adminCount?.values || []}
                    activeTab=""
                    colorsChart={[
                      "#ef3d31",
                      "#f46a2b",
                      "#f88d23",
                      "#fcad18",
                      "#ffcb05",
                      "#81b73c",
                      "#6aa93a",
                      "#519a38",
                      "#368c36",
                    ]}
                    renderChart
                    switchAxis
                    labelColorState="#000000"
                    annotationOpacity={Number((100 / 100).toFixed(2))}
                    showNegative={false}
                    chartType="pie"
                    legendPosition="bottom"
                    labelPosition="top"
                    fontSize="12"
                  />
                </div>
              </Card>
            </Col>
            <Col md={6} lg={4}>
              <Card>
                <div className="chartbox text-center">
                  <h3>Responses</h3>
                  <CommonBarChartAnnotation
                    key={1}
                    scalarConfigurationPropData={[]}
                    categories={resposneCount?.categories || []}
                    values={resposneCount?.values || []}
                    activeTab=""
                    colorsChart={[
                      "#ef3d31",
                      "#f46a2b",
                      "#f88d23",
                      "#fcad18",
                      "#ffcb05",
                      "#81b73c",
                      "#6aa93a",
                      "#519a38",
                      "#368c36",
                    ]}
                    renderChart
                    switchAxis
                    labelColorState="#000000"
                    annotationOpacity={Number((100 / 100).toFixed(2))}
                    showNegative={false}
                    chartType="pie"
                    legendPosition="bottom"
                    labelPosition="top"
                    fontSize="12"
                  />
                </div>
              </Card>
            </Col>
            <Col md={6} lg={4}>
              <Card>
                <div className="chartbox text-center">
                  <h3>Survey Instruments</h3>
                  <CommonBarChartAnnotation
                    key={1}
                    scalarConfigurationPropData={[]}
                    categories={surveyInstrument?.categories || []}
                    values={surveyInstrument?.values || []}
                    activeTab=""
                    colorsChart={[
                      "#ef3d31",
                      "#f46a2b",
                      "#f88d23",
                      "#fcad18",
                      "#ffcb05",
                      "#81b73c",
                      "#6aa93a",
                      "#519a38",
                      "#368c36",
                    ]}
                    renderChart
                    switchAxis
                    labelColorState="#000000"
                    annotationOpacity={Number((100 / 100).toFixed(2))}
                    showNegative={false}
                    chartType="pie"
                    legendPosition="bottom"
                    labelPosition="top"
                    fontSize="12"
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
}

import React, { useImperativeHandle, useMemo, useRef, forwardRef, useEffect, useState } from "react";
import GaugeChart from "react-gauge-chart";
import { Link } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { IR_LOGO } from "config";
import { ImageElement, SweetAlert } from "../../../../components";
import ResponseRatePieChart from "./Chart/ResponseRatePieChart";
import ResponseRateTable from "./ReportDataTable/ResponseRateTable";
import GeneralChart from "./Chart/GeneralChart";
import OpenEndedResponseList from "./OpenEndedResponseList";
import ResponseRateBarChart from "./Chart/ResponseRateBarChart";
import FavorabilityIndexTable from "./ReportDataTable/FavorabilityIndexTable";
import OverallWithThreeUsersTable from "./ReportDataTable/OverallWithThreeUsersTable";
import ReferenceDataAggregateUserTable from "./ReportDataTable/ReferenceDataAggregateUserTable";
import TornadoChart from "./Chart/TornadoChart";
import TargetChart from "./Chart/TargetChart";
import HeatMapColorCoadingCnt from "./HeatMapColorCoadingCnt";
import HeatMapTable from "./ReportDataTable/HeatMapTable";
import SupportingDocumentFileTable from "./ReportDataTable/SupportingDocumentFileTable";
import ResponseRateProgressChart from "./Chart/ResponseRateProgressChart";
import WordCloudChart from "./Chart/WordCloudChart";
import BarChartWithErrorBars from "./Chart/BarChartWithErrorBars";
import { getIRReportData, updateIRReportData } from "../../../../redux/IRReportData/index.slice";
import { useSelector } from "react-redux";
import ProximityTable from "./ReportDataTable/ProximityTable";
import html2canvas from "html2canvas";
import { clearAllChartImage, updateChartImage } from "../../../../redux/ChartImagesSlice/index.slice";
import { useDispatch } from "react-redux";
import jsPDF from "jspdf";
import FavorabilityIndexChart from "./ReportDataTable/FavorabilityIndexChart";

export default function GenerateCardCenter({
  centerRef,
  pdfComponentRef,
  ScrollToBottom,
  setScrollToBottom,
  setCommonCollapse,
  TemplateFlag,
  setDeleteSectionValue,
  setDeleteSectionModal,
  SectionData,
  ReportWidgetList,
  commonToggleCollapse,
  commonCollapse,
  handleWidgetsDetails,
  generatePdf,
}) {
  const generateCardRef = useRef(null);
  const sectionRefs = useRef({});
  const dispatch = useDispatch();
  useEffect(() => {
    // setTimeout(() => {
    //   generatePDF();
    // }, [1000]);
    return () => {
      dispatch(clearAllChartImage());
    };
  }, []);

  useEffect(() => {
    if (generatePdf) {
      setTimeout(() => {
        generatePDF();
      }, [1500]);
    }
  }, [generatePdf]);

  const handleScrollToBottom = (data) => {
    setTimeout(() => {
      const container = centerRef.current;
      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth",
        });
      }
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });

      const sectionRef = sectionRefs.current[ScrollToBottom];
      sectionRef?.current?.scrollIntoView({ behavior: "smooth", block: "start" });

      setScrollToBottom(false);
      if (data?.collapseKey != "pageBreak") {
        openControlPanel(data);
      }
    }, 100);
  };

  const IRData = useSelector(getIRReportData);

  const [unSavedModal, setunSavedModal] = useState(false);
  const [CommonCollapseData, setCommonCollapseData] = useState();
  const openControlPanel = (data) => {
    setCommonCollapseData(data);
    if (IRData?.unsavedChanges) {
      setunSavedModal(true);
    } else {
      commonToggleCollapse(data);
    }
  };

  const onConfirmAlertModal = () => {
    commonToggleCollapse(CommonCollapseData);
  };

  const ReportSection = ({ SectionId, title, collapseKey, children, subTitle }) => {
    if (ScrollToBottom === SectionId) {
      handleScrollToBottom({ collapseKey, SectionId });
    }

    return (
      <div
        ref={sectionRefs.current[SectionId]}
        style={{ borderRadius: 6, border: commonCollapse?.SectionId == SectionId ? "1px solid #0968AC" : null }}
        className="generateCard_center_inner md-4"
      >
        <div className="d-flex align-items-center justify-content-between gap-2">
          <h3
            className="reportTitle mb-0"
            style={{ textAlign: collapseKey == "logoAndReportTitle" ? "center" : "left", width: "100%" }}
          >
            {collapseKey !== "pageBreak" ? title : null}
          </h3>

          <ul className="list-unstyled mb-0 d-flex align-items-center gap-3 lh-1 cardFilter">
            {collapseKey !== "pageBreak" && (
              <li>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => openControlPanel({ collapseKey, SectionId })}
                  className="icon"
                >
                  <em className="icon-sliders-horizontal" />
                </div>
              </li>
            )}
            <li>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setDeleteSectionValue({
                    SectionName: title,
                    SectionId,
                  });
                  setDeleteSectionModal(true);
                }}
                className="icon"
              >
                <em className="icon-close-circle" />
              </div>
            </li>
          </ul>
        </div>
        <p
          style={{ textAlign: collapseKey == "logoAndReportTitle" ? "center" : "left", width: "92%" }}
          className="mb-0"
        >
          {subTitle}
        </p>
        <div className="mt-4">{children}</div>
      </div>
    );
  };

  // ✅ Individual Functional Components
  const LogoReportTitle = ({ SectionId }) => (
    <ReportSection SectionId={SectionId} collapseKey="logoAndReportTitle">
      <div
        id={`logo-container-${SectionId}`}
        className="convertThisSection d-flex align-items-center justify-content-between gap-3"
      >
        <ImageElement
          previewSource={`${IR_LOGO}/${SectionData[SectionId]?.attributeData?.widgetData?.logoPath}`}
          className="reportLogo"
          styling={{
            height: "auto",
            maxHeight: "80px" /* ✅ Max height */,
            maxWidth: "250px" /* ✅ Optional max width */,
            object: "contain" /* ✅ Maintain aspect ratio inside limits */,
          }}
        />
        <div style={{ width: "100%" }}>
          <h3 className="reportTitle mb-0" style={{ textAlign: "center", width: "100%", marginBottom: "0.5rem" }}>
            {SectionData[SectionId]?.attributeData?.widgetData?.title}
          </h3>
          <p style={{ textAlign: "center" }} className="mb-0">
            {SectionData[SectionId]?.attributeData?.widgetData?.subTitle}
          </p>
        </div>
      </div>
    </ReportSection>
  );

  const DepartmentResponseRate = ({ SectionId }) => (
    <ReportSection
      subTitle={SectionData[SectionId]?.attributeData?.widgetData?.subTitle}
      SectionId={SectionId}
      title={SectionData[SectionId]?.attributeData?.widgetData?.title}
      collapseKey="departmentresponseRate"
    >
      {/* <Row className="mt-4">
        <Col md={4}>
          <h4 className="reportSubTitle mb-2">Completion Rate</h4>
          <p className="mb-xl-4 mb-3">Survey Aggregate</p>
          <ResponseRatePieChart value={SectionData[SectionId]?.attributeData?.widgetData?.percentage} />
          <div className="text-center mt-4 fs-6">
            <p className="mb-0">Responses</p>
            <span className="fw-bold">{SectionData[SectionId]?.attributeData?.widgetData?.completed_response}/{SectionData[SectionId]?.attributeData?.widgetData?.overallResponse}</span>
          </div>
        </Col>
        <Col md={8} className="border-start">
          <h4 className="reportSubTitle mb-2">Response Frequency</h4>
          <p className="fs-6">By {SectionData[SectionId]?.attributeData?.widgetData?.frequency}</p>
          <ResponseRateBarChart SectionData={SectionData[SectionId]} />
        </Col>
      </Row> */}
      <ResponseRateTable SectionData={SectionData[SectionId]} />

      {SectionData[SectionId]?.attributeData?.widgetData?.IRdatasetPropertiesFlag &&
        SectionData[SectionId]?.attributeData?.widgetData?.IRdatasetProperties && (
          <OverallWithThreeUsersTable SectionData={SectionData[SectionId]} />
        )}
      {SectionData[SectionId]?.attributeData?.widgetData?.referenceDataPropertiesFlag &&
        SectionData[SectionId]?.attributeData?.widgetData?.referenceDataProperties?.length > 0 && (
          <ReferenceDataAggregateUserTable SectionData={SectionData[SectionId]} />
        )}
    </ReportSection>
  );
  const WordCloudSection = ({ SectionId }) => (
    <ReportSection
      subTitle={SectionData[SectionId]?.attributeData?.widgetData?.subTitle}
      SectionId={SectionId}
      title={SectionData[SectionId]?.attributeData?.widgetData?.title}
      collapseKey="wordCloud"
    >
      <div className="convertThisSection">
        <WordCloudChart SectionData={SectionData[SectionId]} sectionId={SectionId} />
      </div>
      {SectionData[SectionId]?.attributeData?.widgetData?.IRdatasetPropertiesFlag &&
        SectionData[SectionId]?.attributeData?.widgetData?.IRdatasetProperties && (
          <OverallWithThreeUsersTable SectionData={SectionData[SectionId]} />
        )}
      {SectionData[SectionId]?.attributeData?.widgetData?.referenceDataPropertiesFlag &&
        SectionData[SectionId]?.attributeData?.widgetData?.referenceDataProperties?.length > 0 && (
          <ReferenceDataAggregateUserTable SectionData={SectionData[SectionId]} />
        )}
    </ReportSection>
  );

  const ResponseRateDistribution = ({ SectionId }) => {
    return (
      <ReportSection
        subTitle={SectionData[SectionId]?.attributeData?.widgetData?.subTitle}
        SectionId={SectionId}
        title={SectionData[SectionId]?.attributeData?.widgetData?.title}
        collapseKey="responseRate"
      >
        <Row className="convertThisSection mt-4">
          <Col md={4}>
            <h4 className="reportSubTitle mb-2">Completion Rate</h4>
            <p className="mb-xl-4 mb-3">Survey Aggregate</p>
            <div
              style={{
                height: "80%",
                display: "flex",
                alignItems: "left",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              {SectionData[SectionId]?.attributeData?.widgetData?.aggregateChart === "donut" && (
                <ResponseRatePieChart
                  decimal={SectionData[SectionId]?.attributeData?.widgetData?.selectedDecimalPoint}
                  value={SectionData[SectionId]?.attributeData?.widgetData?.percentage}
                  sectionId={SectionId}
                />
              )}
              {SectionData[SectionId]?.attributeData?.widgetData?.aggregateChart === "progress" && (
                <ResponseRateProgressChart
                  value={SectionData[SectionId]?.attributeData?.widgetData?.percentage}
                  sectionId={SectionId}
                />
              )}
              {SectionData[SectionId]?.attributeData?.widgetData?.aggregateChart === "speedometer" && (
                <div style={{ position: "relative", width: 250, alignSelf: "center" }}>
                  <div id={`gauge-container-${SectionId}`}>
                    <GaugeChart
                      id={`gauge-${SectionId}`}
                      nrOfLevels={100}
                      arcPadding={0.01}
                      arcWidth={0.2}
                      animate={false}
                      cornerRadius={1}
                      percent={parseFloat(
                        (SectionData[SectionId]?.attributeData?.widgetData?.percentage / 100).toFixed(
                          SectionData[SectionId]?.attributeData?.controlData?.selectedDecimalPoint + 2
                        )
                      )}
                      textColor="transparent"
                      needleColor="#0968AC"
                      colors={["#48B3FF", "#0968AC"]}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        fontSize: "18px",
                        fontWeight: "600",
                        color: "#0968AC",
                      }}
                    >
                      {parseFloat(SectionData[SectionId]?.attributeData?.widgetData?.percentage).toFixed(
                        SectionData[SectionId]?.attributeData?.controlData?.selectedDecimalPoint
                      )}
                      %
                    </div>
                  </div>
                </div>
              )}
              {SectionData[SectionId]?.attributeData?.widgetData?.displayResponse && (
                <div className="text-center mt-4 fs-6">
                  <p className="mb-0">Responses</p>
                  <span className="fw-bold">
                    {SectionData[SectionId]?.attributeData?.widgetData?.completed_response}/
                    {SectionData[SectionId]?.attributeData?.widgetData?.overallResponse}
                  </span>
                </div>
              )}
            </div>
          </Col>
          <Col md={8} className="border-start">
            <h4 className="reportSubTitle mb-2">Response Frequency</h4>
            <p className="fs-6">By {SectionData[SectionId]?.attributeData?.widgetData?.frequency}</p>
            <ResponseRateBarChart SectionData={SectionData[SectionId]} sectionId={SectionId} />
          </Col>
        </Row>

        {SectionData[SectionId]?.attributeData?.widgetData?.responseRateDistribution &&
          SectionData[SectionId]?.attributeData?.widgetData?.distribution?.length > 0 && (
            <ResponseRateTable responceRate={true} SectionData={SectionData[SectionId]} />
          )}
        {SectionData[SectionId]?.attributeData?.widgetData?.IRdatasetPropertiesFlag &&
          SectionData[SectionId]?.attributeData?.widgetData?.IRdatasetProperties && (
            <OverallWithThreeUsersTable SectionData={SectionData[SectionId]} />
          )}
        {SectionData[SectionId]?.attributeData?.widgetData?.referenceDataPropertiesFlag &&
          SectionData[SectionId]?.attributeData?.widgetData?.referenceDataProperties?.length > 0 && (
            <ReferenceDataAggregateUserTable SectionData={SectionData[SectionId]} />
          )}
      </ReportSection>
    );
  };

  const FavorabilityIndex = ({ SectionId }) => (
    <ReportSection
      subTitle={SectionData[SectionId]?.attributeData?.widgetData?.subTitle}
      SectionId={SectionId}
      title={SectionData[SectionId]?.attributeData?.widgetData?.title}
      collapseKey="favorabilityIndex"
    >
      {Array.isArray(SectionData[SectionId]?.attributeData?.widgetData?.favorabilityData) && (
        <FavorabilityIndexTable SectionData={SectionData[SectionId]} />
      )}
      {SectionData[SectionId]?.attributeData?.widgetData?.IRdatasetPropertiesFlag &&
        SectionData[SectionId]?.attributeData?.widgetData?.IRdatasetProperties && (
          <OverallWithThreeUsersTable SectionData={SectionData[SectionId]} />
        )}
      {SectionData[SectionId]?.attributeData?.widgetData?.referenceDataPropertiesFlag &&
        SectionData[SectionId]?.attributeData?.widgetData?.referenceDataProperties?.length > 0 && (
          <ReferenceDataAggregateUserTable SectionData={SectionData[SectionId]} />
        )}
    </ReportSection>
  );
  const Proximity = ({ SectionId }) => (
    <ReportSection
      subTitle={SectionData[SectionId]?.attributeData?.widgetData?.subTitle}
      SectionId={SectionId}
      title={SectionData[SectionId]?.attributeData?.widgetData?.title}
      collapseKey="proximity"
    >
      {SectionData[SectionId]?.attributeData?.widgetData?.importanceData && (
        <ProximityTable SectionData={SectionData[SectionId]} />
      )}
      {SectionData[SectionId]?.attributeData?.widgetData?.IRdatasetPropertiesFlag &&
        SectionData[SectionId]?.attributeData?.widgetData?.IRdatasetProperties && (
          <OverallWithThreeUsersTable SectionData={SectionData[SectionId]} />
        )}
      {SectionData[SectionId]?.attributeData?.widgetData?.referenceDataPropertiesFlag &&
        SectionData[SectionId]?.attributeData?.widgetData?.referenceDataProperties?.length > 0 && (
          <ReferenceDataAggregateUserTable SectionData={SectionData[SectionId]} />
        )}
    </ReportSection>
  );
  const FavorabilityByIntention = ({ SectionId }) => (
    <ReportSection
      subTitle={SectionData[SectionId]?.attributeData?.widgetData?.subTitle}
      SectionId={SectionId}
      title={SectionData[SectionId]?.attributeData?.widgetData?.title}
      collapseKey="favorabilityByIntention"
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          flexWrap: "wrap",
          width: "100%",
          border: "1px solid #dee2e6",
        }}
      >
        <div className="convertThisSection">
          {SectionData[SectionId]?.attributeData?.widgetData?.favorabilityData && (
            <FavorabilityIndexChart byIntention SectionData={SectionData[SectionId]} />
          )}
        </div>

        {SectionData[SectionId]?.attributeData?.widgetData?.favorabilityData && (
          <FavorabilityIndexTable byIntention SectionData={SectionData[SectionId]} />
        )}
      </div>

      {SectionData[SectionId]?.attributeData?.widgetData?.IRdatasetPropertiesFlag &&
        SectionData[SectionId]?.attributeData?.widgetData?.IRdatasetProperties && (
          <OverallWithThreeUsersTable SectionData={SectionData[SectionId]} />
        )}

      {SectionData[SectionId]?.attributeData?.widgetData?.referenceDataPropertiesFlag &&
        SectionData[SectionId]?.attributeData?.widgetData?.referenceDataProperties?.length > 0 && (
          <ReferenceDataAggregateUserTable SectionData={SectionData[SectionId]} />
        )}
    </ReportSection>
  );

  const GeneralChartSection = ({ SectionId }) => (
    <ReportSection
      subTitle={SectionData[SectionId]?.attributeData?.widgetData?.subTitle}
      SectionId={SectionId}
      title={SectionData[SectionId]?.attributeData?.widgetData?.title}
      collapseKey="generalChart"
    >
      {SectionData[SectionId]?.attributeData?.widgetData && (
        <div className="convertThisSection">
          <GeneralChart SectionData={SectionData[SectionId]} sectionId={SectionId} />
        </div>
      )}
      {SectionData[SectionId]?.attributeData?.widgetData?.IRdatasetPropertiesFlag &&
        SectionData[SectionId]?.attributeData?.widgetData?.IRdatasetProperties && (
          <OverallWithThreeUsersTable SectionData={SectionData[SectionId]} />
        )}
      {SectionData[SectionId]?.attributeData?.widgetData?.referenceDataPropertiesFlag &&
        SectionData[SectionId]?.attributeData?.widgetData?.referenceDataProperties?.length > 0 && (
          <ReferenceDataAggregateUserTable SectionData={SectionData[SectionId]} />
        )}
    </ReportSection>
  );

  const TornadoChartSection = ({ SectionId }) => {
    return (
      <ReportSection
        subTitle={SectionData[SectionId]?.attributeData?.widgetData?.subTitle}
        SectionId={SectionId}
        title={SectionData[SectionId]?.attributeData?.widgetData?.title}
        collapseKey="tornadoChart"
      >
        <div className="convertThisSection">
          <TornadoChart SectionData={SectionData[SectionId]} sectionId={SectionId} />
        </div>

        {SectionData[SectionId]?.attributeData?.widgetData?.IRdatasetPropertiesFlag &&
          SectionData[SectionId]?.attributeData?.widgetData?.IRdatasetProperties && (
            <OverallWithThreeUsersTable SectionData={SectionData[SectionId]} />
          )}
        {SectionData[SectionId]?.attributeData?.widgetData?.referenceDataPropertiesFlag &&
          SectionData[SectionId]?.attributeData?.widgetData?.referenceDataProperties?.length > 0 && (
            <ReferenceDataAggregateUserTable SectionData={SectionData[SectionId]} />
          )}
      </ReportSection>
    );
  };

  const ErrorBarChartSection = ({ SectionId }) => (
    <ReportSection
      subTitle={SectionData[SectionId]?.attributeData?.widgetData?.subTitle}
      SectionId={SectionId}
      title={SectionData[SectionId]?.attributeData?.widgetData?.title}
      collapseKey="errorBarChart"
    >
      {/* <ErrorBarChart SectionData={SectionData[SectionId]} /> */}
      <div className="convertThisSection">
        <BarChartWithErrorBars SectionData={SectionData[SectionId]} sectionId={SectionId} />
      </div>
      {SectionData[SectionId]?.attributeData?.widgetData?.IRdatasetPropertiesFlag &&
        SectionData[SectionId]?.attributeData?.widgetData?.IRdatasetProperties && (
          <OverallWithThreeUsersTable SectionData={SectionData[SectionId]} />
        )}
      {SectionData[SectionId]?.attributeData?.widgetData?.referenceDataPropertiesFlag &&
        SectionData[SectionId]?.attributeData?.widgetData?.referenceDataProperties?.length > 0 && (
          <ReferenceDataAggregateUserTable SectionData={SectionData[SectionId]} />
        )}
    </ReportSection>
  );

  const TargetChartSection = ({ SectionId }) => (
    <ReportSection
      subTitle={SectionData[SectionId]?.attributeData?.widgetData?.subTitle}
      SectionId={SectionId}
      title={SectionData[SectionId]?.attributeData?.widgetData?.title}
      collapseKey="targetChart"
    >
      <div className="convertThisSection">
        <TargetChart SectionData={SectionData[SectionId]} sectionId={SectionId} />
      </div>
      {SectionData[SectionId]?.attributeData?.widgetData?.IRdatasetPropertiesFlag &&
        SectionData[SectionId]?.attributeData?.widgetData?.IRdatasetProperties && (
          <OverallWithThreeUsersTable SectionData={SectionData[SectionId]} />
        )}
      {SectionData[SectionId]?.attributeData?.widgetData?.referenceDataPropertiesFlag &&
        SectionData[SectionId]?.attributeData?.widgetData?.referenceDataProperties?.length > 0 && (
          <ReferenceDataAggregateUserTable SectionData={SectionData[SectionId]} />
        )}
    </ReportSection>
  );

  const correlationData = [
    { value: 5, positive: "#e8f6cb", negative: "#ffefae" },
    { value: 10, positive: "#97d78d", negative: "#ffaa42" },
    { value: 15, positive: "#0faa4b", negative: "#f02d25" },
  ];

  const boxStyle = {
    width: "30px",
    height: "30px",
    border: "1px solid #ccc",
    position: "relative",
    marginLeft: "10px",
  };

  const HeatMapSection = ({ SectionId }) => {

    function processHeatmapHeader(arr) {
      const uniqueTypes = new Set();
      const demographicById = {};

      console.log("arr", arr);

      if (Array.isArray(arr) && arr.length > 0) {
        arr.forEach(item => {
          if (item.type !== "demographic") {
            uniqueTypes.add(item.type);
          } else {
            if (!(item.id in demographicById)) {
              // Only take first encountered element per unique demographic id
              const idx = item.name.indexOf("~");
              demographicById[item.id] =
                idx !== -1
                  ? item.name.substring(0, idx).trim()
                  : item.name.trim();
            }
          }
        });
      }

      return {
        uniqueTypes: Array.from(uniqueTypes),
        demographicLabels: Object.values(demographicById),
      };
    }
    // Example usage:
    const result = processHeatmapHeader(SectionData[SectionId]?.attributeData?.widgetData?.heatmapHeader);

    function getQuestionsWithSelectedResponse(demographic) {

      // Use a Set to avoid duplicate question names
      const questions = new Set();
      if (Array.isArray(demographic) && demographic.length > 0) {
        demographic.forEach(item => {
          if (
            Array.isArray(item.responses) &&
            item.responses.some(resp => resp.selected === true)
          ) {
            questions.add(item.question);
          }
        });
      }

      return Array.from(questions);
    }

    // Example usage:
    const questionNames = SectionData[SectionId]?.attributeData?.controlData?.heatmapType === 1 ? [] : getQuestionsWithSelectedResponse(SectionData[SectionId]?.attributeData?.controlData?.dataPointControlList2?.demographic);





    return (
      <ReportSection
        SectionId={SectionId}
        subTitle={SectionData[SectionId]?.attributeData?.widgetData?.subTitle}
        title={SectionData[SectionId]?.attributeData?.widgetData?.title}
        collapseKey="heatMap"
      >
        {SectionData[SectionId]?.attributeData?.widgetData?.instructionFlag && (
          <>
            <div className="convertThisSection">
              <HeatMapColorCoadingCnt
                SectionData={SectionData[SectionId]?.attributeData?.widgetData}
                sectionId={SectionId}
              />
            </div>
            <div className="d-flex align-items-center gap-3">
              {SectionData[SectionId]?.attributeData?.controlData?.dataCoRelationSettings.map((item, index) => (
                // <div key={index} className="d-flex align-items-center me-4">
                //   <div className="border rounded-start px-2 py-1 bg-light">+/−</div>
                //   <input
                //     disabled
                //     type="number"
                //     value={item.value}
                //     readOnly
                //     className="form-control rounded-0"
                //     style={{ width: '60px' }}
                //   />
                //   <div style={diagonalSplitStyle(item.positive, item.negative)} />
                // </div>
                <div class="d-flex align-items-center gap-2">
                  <span class="badge rounded-pill bg-light border text-dark px-3 py-2">
                    <span class="me-2">+/-</span>
                    <span>{item?.pointValue}</span>
                  </span>
                  <div
                    class="rounded"
                    style={{
                      width: "24px",
                      height: "24px",
                      background: `linear-gradient(45deg, ${item.positiveColor} 50%, ${item.negativeColor} 50%)`,
                      border: "1px solid #dee2e6",
                    }}
                  ></div>
                </div>
              ))}
            </div>
          </>
        )}
        {SectionData[SectionId]?.attributeData?.widgetData?.heatmapData && (
          <p style={{ fontSize: '14px' }} className="my-3 ">
            <strong>
              Comparison:{" "}
            </strong>
            {SectionData[SectionId]?.attributeData?.widgetData?.heatmapHeader[0]?.name}
          </p>
        )}
        {SectionData[SectionId]?.attributeData?.widgetData?.heatmapData && (
          <p style={{ fontSize: '14px' }} className="my-3 ">
            <strong>Breakout:</strong> {" "} {result.uniqueTypes.join(", ")} {questionNames.join(", ")}
          </p>
        )}
        {SectionData[SectionId]?.attributeData?.widgetData?.heatmapData && (
          <HeatMapTable
            TemplateFlag={TemplateFlag}
            SectionId={SectionId}
            expandAll={SectionData[SectionId]?.attributeData?.widgetData?.expandAllFlag}
            collapsedRows={SectionData[SectionId]?.attributeData?.widgetData?.collapsedRows}
            heatmapHeader={SectionData[SectionId]?.attributeData?.widgetData?.heatmapHeader}
            HeatmapData={SectionData[SectionId]?.attributeData?.widgetData?.heatmapData}
          />
        )}
        {SectionData[SectionId]?.attributeData?.widgetData?.IRdatasetPropertiesFlag &&
          SectionData[SectionId]?.attributeData?.widgetData?.IRdatasetProperties && (
            <OverallWithThreeUsersTable SectionData={SectionData[SectionId]} />
          )}
      </ReportSection>
    )
  };

  const OpenEndedResponse = ({ SectionId }) => (
    <ReportSection
      subTitle={SectionData[SectionId]?.attributeData?.widgetData?.subTitle}
      SectionId={SectionId}
      title={SectionData[SectionId]?.attributeData?.widgetData?.title}
      collapseKey="openEndedResponses"
    >
      <OpenEndedResponseList SectionData={SectionData[SectionId]} />
    </ReportSection>
  );

  const SupportingDocuments = ({ SectionId }) => (
    <ReportSection
      subTitle={SectionData[SectionId]?.attributeData?.widgetData?.subTitle}
      SectionId={SectionId}
      title={SectionData[SectionId]?.attributeData?.widgetData?.title}
      collapseKey="supportingDocuments"
    >
      <SupportingDocumentFileTable SectionData={SectionData[SectionId]} />
    </ReportSection>
  );

  const PageBreak = ({ SectionId }) => (
    <ReportSection SectionId={SectionId} title={"Page Break"} collapseKey="pageBreak">
      <p className="my-3 fs-6 text-center">--- Page Break ---</p>
    </ReportSection>
  );

  const InformationGraphic = ({ SectionId }) => {
    // Function to clean up escaped characters
    function decodeHtmlEntities(str) {
      const textarea = document.createElement("textarea");
      textarea.innerHTML = str;
      return textarea.value;
    }

    // Decode only once
    const decodedHtml = useMemo(() => {
      const firstPass = decodeHtmlEntities(SectionData[SectionId]?.attributeData?.widgetData?.htmlData);
      return firstPass.replace(/\\"/g, '"').replace(/\\\//g, "/"); // fix extra escaping
    }, [SectionData[SectionId]?.attributeData?.widgetData?.htmlData]);

    return (
      <ReportSection
        subTitle={SectionData[SectionId]?.attributeData?.widgetData?.subTitle}
        SectionId={SectionId}
        title={null}
        collapseKey="informationGraphic"
      >
        <div
          className="convertThisSection"
          id={`info-graphic-container-${SectionId}`}
          dangerouslySetInnerHTML={{ __html: decodedHtml }}
        />
      </ReportSection>
    );
  };

  const ReportDatasetProperties = ({ SectionId }) => (
    <ReportSection
      subTitle={SectionData[SectionId]?.attributeData?.widgetData?.subTitle}
      SectionId={SectionId}
      title={SectionData[SectionId]?.attributeData?.widgetData?.title}
      collapseKey="datasetProperties"
    >
      <OverallWithThreeUsersTable heading={false} SectionData={SectionData[SectionId]} />
    </ReportSection>
  );

  const widgetComponents = {
    standard_logo_title: LogoReportTitle,
    standard_support_documents: SupportingDocuments,
    standard_response_overall: ResponseRateDistribution,
    std_dataset_property: ReportDatasetProperties,
    std_instruction_comment: InformationGraphic,
    std_error_tornado_chart: TornadoChartSection,
    standard_response_department: DepartmentResponseRate,
    std_error_target_chart: TargetChartSection,
    std_error_bar_chart: ErrorBarChartSection,
    std_page_break: PageBreak,
    std_favorability: FavorabilityIndex,
    std_snapshot_chart: GeneralChartSection,
    std_heatmap: HeatMapSection,
    std_word_cloud: WordCloudSection,
    std_response_openend: OpenEndedResponse,
    std_favorability_by_intention: FavorabilityByIntention,
    std_proximity: Proximity,
    // std_follow_up:
  };

  const widgetRefs = useRef([]);

  // Helper function to check if a widget should be converted
  const shouldConvertWidget = (widgetTag, sectionId) => {
    // Configuration for widget conversion
    const widgetConfig = {
      specificWidgets: [
        "std_word_cloud",
        "standard_response_overall",
        "std_snapshot_chart",
        "std_error_bar_chart",
        "std_error_tornado_chart",
        "std_error_target_chart",
        "std_heatmap",
        "std_instruction_comment",
        "std_favorability_by_intention",
      ],
    };
    return widgetConfig.specificWidgets.includes(widgetTag);
  };

  // const imageUrl =
  //   "https://asmtdevapi.ibridgellc.com/storage/uploads/images/IRLogos/report_logo-801-2025-06-13-11-11-52.png";

  // useEffect(() => {
  //   const convert = async () => {
  //     try {
  //       const base64 = await urlToBase64(imageUrl);
  //       console.log("Base64 string:", base64);
  //     } catch (error) {
  //       console.error("Error converting image to base64:", error);
  //     }
  //   };

  //   convert();
  // }, [imageUrl]);

  // const urlToBase64 = async (imageUrl) => {
  //   const response = await fetch(imageUrl);
  //   const blob = await response.blob();

  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onloadend = () => resolve(reader.result);
  //     reader.onerror = reject;
  //     reader.readAsDataURL(blob);
  //   });
  // };

  const generatePDF = async (targetSectionId = null) => {
    const images = [];

    for (let i = 0; i < widgetRefs.current.length; i++) {
      const widget = widgetRefs.current[i];
      if (!widget) continue;

      const widgetInfo = ReportWidgetList[i];
      if (!widgetInfo) continue;

      // If a targetSectionId is provided, skip others
      // if (targetSectionId && widgetInfo.sectionID !== targetSectionId && generatedWidgets?.length > 0) {
      //   continue;
      // }

      if (!shouldConvertWidget(widgetInfo.widgetTag, widgetInfo.sectionID)) {
        continue;
      }

      try {
        // Find the element with convertThisSection class
        const elementToConvert = widget.querySelector(".convertThisSection");
        if (!elementToConvert) continue;

        // console.log(`Converting widget: ${widgetInfo.widgetTag} with section ID: ${widgetInfo.sectionID}`);
        const canvas = await html2canvas(elementToConvert, {
          scale: 1, // Higher quality
          useCORS: true,
          backgroundColor: "#ffffff",
        });
        const imgData = canvas.toDataURL("image/png");

        // Check if the image data is valid (not empty or just "data:,")
        if (imgData && imgData !== "data:," && imgData.length > 22) {
          // 22 is length of "data:image/png;base64,"
          images.push({
            index: i,
            imgData: imgData,
            widgetTag: widgetInfo.widgetTag,
            sectionId: widgetInfo.sectionID,
          });
        } else {
          console.log(`Invalid or empty image data for widget: ${widgetInfo.widgetTag}, skipping`);
        }
      } catch (error) {
        console.error(`Error capturing widget ${i}:`, error);
      }
    }
    console.log(images, "images");

    // Only proceed if we have valid images
    if (images.length > 0) {
      handleWidgetsDetails(images);
    } else {
      console.log("No valid images to convert");
    }
  };

  const DynamicComponentRenderer = () => {
    return (
      <div>
        {ReportWidgetList?.map((widget, index) => {
          const Component = widgetComponents[widget.widgetTag];

          return Component ? (
            <div
              key={index}
              ref={(el) => (widgetRefs.current[index] = el)}
              data-widget-tag={widget.widgetTag}
              data-section-id={widget.sectionID}
            >
              <Component SectionId={widget.sectionID} />
            </div>
          ) : null;
        })}
      </div>
    );
  };

  return (
    <div className="generateCard_center" ref={generateCardRef}>
      {/* <button onClick={generatePDF} className="download-btn">
        Download as PDF
      </button> */}

      <div ref={pdfComponentRef} style={{ height: "100%" }} className="generateCard_wrap">
        <DynamicComponentRenderer />
      </div>

      <SweetAlert
        title="Their is unsaved Changes"
        text={`you may have unsaved changes at ${IRData?.widgetTitle}`}
        show={unSavedModal}
        icon="warning"
        onConfirmAlert={onConfirmAlertModal}
        showCancelButton
        cancelButtonText="Close"
        confirmButtonText="Discard changes"
        setIsAlertVisible={setunSavedModal}
        otherErrDisplayMode={true}
      />
    </div>
  );
}

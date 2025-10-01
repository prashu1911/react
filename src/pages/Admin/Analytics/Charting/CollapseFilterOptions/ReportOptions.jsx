import React, { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import {
  Button,
  InputField,
  ModalComponent,
  SelectField,
  TextEditor,
} from "../../../../../components";

export default function ReportOptions({
  setReportName,
  setOpeningComment,
  setClosingComment,
  reportName,
  openingComment,
  closingComment,
  handleSaveReport,
  handleSaveSummaryChartReport,
  handleSaveDetailChartReport,
  activeTab, // Add this prop
  handlePreviewReport,
  isQuickCompare,
  handleIGSaveReport,
  handleDDSaveReport, // Add this prop
  handleSummaryPreviewReport,
  chartViewType,
  handleDetailsPreviewReport,
  handleIGPreviewReport,
  handleDDPreviewReport,
}) {
  // Single Chart Report Modal
  const [showSingleChartReport, setShowSingleChartReport] = useState(false);
  const singleChartReportClose = () => {
    setReportName("");
    setOpeningComment("");
    setClosingComment("");
    setShowSingleChartReport(false);
  };
  const singleChartReportShow = () => setShowSingleChartReport(true);

  // Summary Chart Report Modal
  const [showSummaryChartReport, setShowSummaryChartReport] = useState(false);
  const summaryChartReportClose = () => {
    setReportName("");
    setOpeningComment("");
    setClosingComment("");
    setShowSummaryChartReport(false);
  };
  const summaryChartReportShow = () => setShowSummaryChartReport(true);

  // Detailed Chart Report Modal
  const [showDemographicsReport, setShowDemographicsReport] = useState(false);
  const demographicsReportClose = () => {
    setReportName("");
    setOpeningComment("");
    setClosingComment("");
    setShowDemographicsReport(false);
  };
  const demographicsReportShow = () => setShowDemographicsReport(true);

  // Copy comment modal
  const [showCopyComment, setShowCopyComment] = useState(false);
  const copyCommentClose = () => setShowCopyComment(false);
  // const copyCommentShow = () => setShowCopyComment(true);
  // assessment Options
  const assessmentOptions = [
    { value: "Employee Assessment", label: "Employee Assessment" },
    { value: "Auditors", label: "Auditors" },
    { value: "June Assessment", label: "June Assessment" },
  ];
  // report Options
  const reportOptions = [
    { value: "Test10", label: "Test10" },
    { value: "Test2024", label: "Test2024" },
  ];

  // Add new modal for Information Gathering
  const [showIGReport, setShowIGReport] = useState(false);
  const IGReportClose = () => {
    setReportName("");
    setOpeningComment("");
    setClosingComment("");
    setShowIGReport(false);
  };

  const IGReportShow = () => setShowIGReport(true);

  // Add new modal for DrillDown
  const [showDDReport, setShowDDReport] = useState(false);
  const DDReportClose = () => {
    setReportName("");
    setOpeningComment("");
    setClosingComment("");
    setShowDDReport(false);
  };

  const DDReportShow = () => setShowDDReport(true);

  const renderReportButtons = () => {
    const buttons = [];

    // Show Single Chart Report button only for aggregate, outcome, intention and rating tabs
    if (!["DD", "IG"].includes(activeTab)) {
      buttons.push(
        <Button
          key="single"
          variant="primary"
          className="ripple-effect"
          onClick={singleChartReportShow}
        >
          <span>Single Chart Report</span>
        </Button>
      );
    }

    // Add Information Gathering button only when on IG tab
    if (activeTab === "IG") {
      buttons.push(
        <Button
          key="ig"
          variant="primary"
          className="ripple-effect"
          onClick={IGReportShow}
        >
          <span>Information Gathering Report</span>
        </Button>
      );
    }

    // Add Drilldownbutton only when on DD tab
    if (activeTab === "DD") {
      buttons.push(
        <Button
          key="dd"
          variant="primary"
          className="ripple-effect"
          onClick={DDReportShow}
        >
          <span>Drilldown Report</span>
        </Button>
      );
    }

    // Only show Summary and Detailed report buttons for aggregate tab and when not in compare mode
    if (
      activeTab === "aggregate" &&
      !isQuickCompare &&
      chartViewType?.toUpperCase() === "COMPARE"
    ) {
      buttons.push(
        <Button
          key="summary"
          variant="primary"
          className="ripple-effect"
          onClick={summaryChartReportShow}
        >
          <span>Summary Chart Report</span>
        </Button>,
        <Button
          key="detailed"
          variant="primary"
          className="ripple-effect"
          onClick={demographicsReportShow}
        >
          <span>Detailed Chart Report</span>
        </Button>
      );
    }

    return buttons;
  };

  const handleIGSaveReportLocal = () => {
    const returnValue = handleIGSaveReport();
    if (returnValue) {
      IGReportClose();
    }
  };

  const handleDDSaveReportLocal = () => {
    const returnValue = handleDDSaveReport();
    if (returnValue) {
      DDReportClose();
    }
  };

  const handleSaveReportLocal = () => {
    const returnValue = handleSaveReport();
    if (returnValue) {
      singleChartReportClose();
    }
  };

const handleSaveSummaryChartReportLocal = () => {
  const returnValue = handleSaveSummaryChartReport();
  if (returnValue) {
    summaryChartReportClose();
  }
};

const handleSaveDetailChartReportLocal = () => {
  const returnValue = handleSaveDetailChartReport();
  if (returnValue) {
    demographicsReportClose();
  }
};


  return (
    <>
      <div className="formCard">
        <div className="d-flex align-items-center gap-2 justify-content-between flex-wrap">
          <div className="d-flex gap-2 flex-wrap">{renderReportButtons()}</div>
        </div>
      </div>

      {/* Single Chart Report modal */}
      <ModalComponent
        modalHeader="Single Chart Report"
        size="lg"
        show={showSingleChartReport}
        onHandleCancel={singleChartReportClose}
      >
        <Form>
          <Form.Group className="form-group">
            <Form.Label>Report Name</Form.Label>
            <InputField
              type="text"
              placeholder="Report Name"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
            />
            {/* <div className="d-flex justify-content-end mt-2">
              <Link
                href="#!"
                className="link-primary d-flex align-items-center mb-2"
                onClick={copyCommentShow}
              >
                <OverlayTrigger
                  overlay={
                    <Tooltip id="tooltip-disabled">
                      Copy Comment from any of the existing reports.
                    </Tooltip>
                  }
                >
                  <span className="d-flex align-items-center">
                    <em
                      disabled
                      style={{ pointerEvents: "none" }}
                      className="icon-info-circle me-1"
                    />
                  </span>
                </OverlayTrigger>
                Copy Comments
              </Link>
            </div> */}
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label>Opening Comment</Form.Label>
            <TextEditor
              value={openingComment}
              onChange={(value) => setOpeningComment(value)}
            />
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label>Closing Comment</Form.Label>
            <TextEditor
              value={closingComment}
              onChange={(value) => setClosingComment(value)}
            />
          </Form.Group>
          <div className="d-flex flex-wrap gap-2 align-items-center justify-content-end">
            <Button
              variant="warning"
              className="ripple-effect"
              onClick={handlePreviewReport}
              disabled={!reportName}
            >
              Preview
            </Button>
            <Button
              variant="primary"
              className="ripple-effect"
              onClick={handleSaveReportLocal}
              disabled={!reportName}
            >
              Save Report
            </Button>
            <Button
              variant="secondary"
              className="ripple-effect"
              onClick={singleChartReportClose}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </ModalComponent>

      {/* Summary Chart Report modal */}
      <ModalComponent
        modalHeader="Summary Chart Report"
        size="lg"
        show={showSummaryChartReport}
        onHandleCancel={summaryChartReportClose}
      >
        <Form>
          <Form.Group className="form-group">
            <Form.Label>Report Name</Form.Label>
            <InputField
              type="text"
              placeholder="Report Name"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
            />
            {/* <div className="d-flex justify-content-end mt-2">
              <Link
                href="#!"
                className="link-primary d-flex align-items-center mb-2"
                onClick={copyCommentShow}
              >
                <OverlayTrigger
                  overlay={
                    <Tooltip id="tooltip-disabled">
                      Copy Comment from any of the existing reports.
                    </Tooltip>
                  }
                >
                  <span className="d-flex align-items-center">
                    <em
                      disabled
                      style={{ pointerEvents: "none" }}
                      className="icon-info-circle me-1"
                    />
                  </span>
                </OverlayTrigger>
                Copy Comments
              </Link>
            </div> */}
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label>Opening Comment</Form.Label>
            <TextEditor
              value={openingComment}
              onChange={(value) => setOpeningComment(value)}
            />
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label>Closing Comment</Form.Label>
            <TextEditor
              value={closingComment}
              onChange={(value) => setClosingComment(value)}
            />
          </Form.Group>
          <div className="d-flex flex-wrap gap-2 align-items-center justify-content-end">
            <Button
              variant="warning"
              className="ripple-effect"
              onClick={handleSummaryPreviewReport}
              disabled={!reportName}
            >
              Preview
            </Button>
            <Button
              variant="primary"
              className="ripple-effect"
              onClick={handleSaveSummaryChartReportLocal}
              disabled={!reportName}
            >
              Save Report
            </Button>
            <Button
              variant="secondary"
              className="ripple-effect"
              onClick={summaryChartReportClose}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </ModalComponent>

      {/* Detailed Chart Report modal */}
      <ModalComponent
        modalHeader="Detailed Report
"
        size="lg"
        show={showDemographicsReport}
        onHandleCancel={demographicsReportClose}
      >
        <Form>
          <Form.Group className="form-group">
            <Form.Label>Report Name</Form.Label>
            <InputField
              type="text"
              placeholder="Report Name"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label>Opening Comment</Form.Label>
            <TextEditor
              value={openingComment}
              onChange={(value) => setOpeningComment(value)}
            />
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label>Closing Comment</Form.Label>
            <TextEditor
              value={closingComment}
              onChange={(value) => setClosingComment(value)}
            />
          </Form.Group>

          <div className="d-flex flex-wrap gap-2 align-items-center justify-content-end">
            <Button
              variant="warning"
              className="ripple-effect"
              onClick={handleDetailsPreviewReport}
              disabled={!reportName}
            >
              Preview
            </Button>
            <Button
              variant="primary"
              className="ripple-effect"
              onClick={handleSaveDetailChartReportLocal}
              disabled={!reportName}
            >
              Save Report
            </Button>
            <Button
              variant="secondary"
              className="ripple-effect"
              onClick={demographicsReportClose}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </ModalComponent>

      {/* Add new IG Report Modal */}
      <ModalComponent
        modalHeader="Information Gathering Report"
        size="lg"
        show={showIGReport}
        onHandleCancel={IGReportClose}
      >
        <Form>
          <Form.Group className="form-group">
            <Form.Label>Report Name</Form.Label>
            <InputField
              type="text"
              placeholder="Enter Report Name"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label>Opening Comments</Form.Label>
            <TextEditor
              value={openingComment}
              onChange={(value) => setOpeningComment(value)}
            />
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label>Closing Comments</Form.Label>
            <TextEditor
              value={closingComment}
              onChange={(value) => setClosingComment(value)}
            />
          </Form.Group>

          <div className="d-flex flex-wrap gap-2 align-items-center justify-content-end">
            <Button
              variant="warning"
              className="ripple-effect"
              onClick={handleIGPreviewReport}
              disabled={!reportName}
            >
              Preview
            </Button>
            <Button
              variant="primary"
              className="ripple-effect"
              onClick={handleIGSaveReportLocal}
              disabled={!reportName}
            >
              Save Report
            </Button>
            <Button
              variant="secondary"
              className="ripple-effect"
              onClick={IGReportClose}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </ModalComponent>

      {/* Add new DrilldownReport Modal */}
      <ModalComponent
        modalHeader="Drilldown Report"
        size="lg"
        show={showDDReport}
        onHandleCancel={DDReportClose}
      >
        <Form>
          <Form.Group className="form-group">
            <Form.Label>Report Name</Form.Label>
            <InputField
              type="text"
              placeholder="Enter Report Name"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label>Opening Comments</Form.Label>
            <TextEditor
              value={openingComment}
              onChange={(value) => setOpeningComment(value)}
            />
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label>Closing Comments</Form.Label>
            <TextEditor
              value={closingComment}
              onChange={(value) => setClosingComment(value)}
            />
          </Form.Group>
          <div className="d-flex flex-wrap gap-2 align-items-center justify-content-end">
            <Button
              variant="warning"
              className="ripple-effect"
              onClick={handleDDPreviewReport}
              disabled={!reportName}
            >
              Preview
            </Button>
            <Button
              variant="primary"
              className="ripple-effect"
              onClick={handleDDSaveReportLocal}
              disabled={!reportName}
            >
              Save Report
            </Button>
            <Button
              variant="secondary"
              className="ripple-effect"
              onClick={DDReportClose}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </ModalComponent>

      {/* copy comments modal  */}
      <ModalComponent
        modalHeader="Copy Comments"
        modalExtraClass="modalBorder"
        size="lg"
        show={showCopyComment}
        onHandleCancel={copyCommentClose}
      >
        <Form action="">
          <Row className="row rowGap">
            <Col lg={6}>
              <Form.Group className="form-group">
                <Form.Label>Assessment Name</Form.Label>
                <SelectField
                  placeholder="Assessment Name"
                  options={assessmentOptions}
                />
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="form-group">
                <Form.Label>Report Name</Form.Label>
                <SelectField
                  placeholder="Report Name"
                  options={reportOptions}
                />
              </Form.Group>
            </Col>
          </Row>
          <div className="form-btn d-flex justify-content-end">
            <Button
              variant="secondary"
              className="ripple-effect"
              onClick={copyCommentClose}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </ModalComponent>
    </>
  );
}

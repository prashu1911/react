import React, { useState } from "react";
import { Col, Form, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Button, InputField, ModalComponent, SelectField, TextEditor } from "../../../../../components";


export default function ReportOptions() {
    // Single/Summary Report Modal
    const [showSummaryReport, setShowSummaryReport] = useState(false);
    const summaryReportClose = () => setShowSummaryReport(false);
    const summaryReportShow = () => setShowSummaryReport(true);

    // Copy comment modal
    const [showCopyComment, setShowCopyComment] = useState(false);
    const copyCommentClose = () => setShowCopyComment(false);
    const copyCommentShow = () => setShowCopyComment(true);
    // assessment Options
    const assessmentOptions = [
      { value: 'Employee Assessment', label: 'Employee Assessment' },
      { value: 'Auditors', label: 'Auditors' },
      { value: 'June Assessment', label: 'June Assessment' }  
    ]
    // report Options
    const reportOptions = [
      { value: 'Test10', label: 'Test10' },
      { value: 'Test2024', label: 'Test2024' }
    ]
    return ( 
      <>
        <div className="formCard">
            <div className="d-flex align-items-center gap-2 justify-content-between flex-wrap">
              <div className="d-flex gap-2 flex-wrap">
                <Button variant="primary" className="ripple-effect" onClick={summaryReportShow}><span> Single Chart Report</span></Button>
                <Button variant="primary" className="ripple-effect" onClick={summaryReportShow}><span> Summary Chart Report</span></Button>
                <Button variant="primary" className="ripple-effect"><span> Summary Report With Demographics Report</span></Button>
              </div>
              <div className="d-flex gap-2 flex-wrap">
                <Button variant="secondary" className="ripple-effect gap-2"><em className="icon-clear" /><span>Clear</span></Button>
                <Button variant="primary" className="ripple-effect gap-2"><em className="icon-run" /><span>Run</span></Button>
              </div>
            </div>
        </div>
        {/* Single/Summary Report modal */}
        <ModalComponent modalHeader="Summary Report" size="lg" show={showSummaryReport} onHandleCancel={summaryReportClose}>
          <Form>
            <Form.Group className="form-group" >
              <Form.Label>Report Name</Form.Label>
              <InputField type="text" placeholder="Report Name" />
              <div className="d-flex justify-content-end mt-2">
                <Link href="#!" className="link-primary d-flex align-items-center mb-2" onClick={copyCommentShow}>
                  <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Copy Comment from any of the existing reports.</Tooltip>}>
                    <span className="d-flex align-items-center">
                      <em disabled style={{ pointerEvents: 'none' }} className="icon-info-circle me-1" />
                    </span>
                  </OverlayTrigger>
                  Copy Comments
                </Link>
              </div>
            </Form.Group>
            <Form.Group className="form-group" >
              <Form.Label>Opening Comment</Form.Label>
              <TextEditor/>
            </Form.Group>
            <Form.Group className="form-group" >
              <Form.Label>Closing Comment</Form.Label>
              <TextEditor/>
            </Form.Group>
            <div className="d-flex flex-wrap gap-2 align-items-center justify-content-end">
              <Button variant="warning" className="ripple-effect">Preview</Button>
              <Button variant="primary" className="ripple-effect">Save Report</Button>
              <Button variant="secondary" className="ripple-effect" onClick={summaryReportClose}>Cancel</Button>
            </div>
          </Form>
        </ModalComponent>

        {/* copy comments modal  */}
        <ModalComponent modalHeader="Copy Comments" modalExtraClass="modalBorder" size="lg" show={showCopyComment} onHandleCancel={copyCommentClose}>
          <Form action="">
            <Row className="row rowGap">
              <Col lg={6}>
                <Form.Group className="form-group">
                  <Form.Label>Assessment Name</Form.Label>
                  <SelectField placeholder="Assessment Name" options={assessmentOptions} />
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group className="form-group">
                  <Form.Label>Report Name</Form.Label>
                  <SelectField placeholder="Report Name" options={reportOptions} />
                </Form.Group>
              </Col>
            </Row>
            <div className="form-btn d-flex justify-content-end">
              <Button variant='secondary' className='ripple-effect' onClick={copyCommentClose}>Cancel</Button>
            </div>
          </Form>
        </ModalComponent>
      </>
    )
}
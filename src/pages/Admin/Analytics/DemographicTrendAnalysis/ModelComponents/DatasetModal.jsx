import React from "react";
import { Form, Button } from "react-bootstrap";
import {
  InputField,
  ModalComponent,
  TextEditor,
} from "../../../../../components";

const CreateDatasetModal = ({
  show,
  onClose,
  reportName,
  setReportName,
  openingComment,
  setOpeningComment,
  closingComment,
  setClosingComment,
  handlePreview,
  handleSaveReport,
}) => {
  return (
    <ModalComponent
      modalHeader="Create Report"
      size="sm"
      show={show}
      onHandleCancel={onClose}
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
            onClick={handlePreview}
            disabled={!reportName}
          >
            Preview
          </Button>
          <Button
            variant="primary"
            className="ripple-effect"
            onClick={handleSaveReport}
            disabled={!reportName}
          >
            Save Report
          </Button>
          <Button
            variant="secondary"
            className="ripple-effect"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </ModalComponent>
  );
};

export default CreateDatasetModal;

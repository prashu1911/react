import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Col, Form, Row } from "react-bootstrap";
import { useFormik } from "formik";
import {
  Button,
  InputField,
  SelectField,
  ReactDataTable,
} from "../../../../../../../components";
import adminRouteMap from "../../../../../../../routes/Admin/adminRouteMap";
import {
  initValuesCreateFromExisting,
  validationCreateFromExistingResource,
} from "../../validation";
import { useTable } from "../../../../../../../customHooks/useTable";
import { useSurveyDataOnNavigations } from "customHooks";

export default function ResourceSection({
  companyOptions,
  surveyOptions,
  isSubmitting,
  onCopySurvey,
  resourceData,
  loading,
  onFetchResourceSurveys,
  createExistingClose,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatcSurveyDataOnNavigateData } = useSurveyDataOnNavigations();
  // Survey Modal radio start
  const [searchValue] = useState("");
  const [tableFilters] = useState({});
  const [keywords, setKeywords] = useState("");

  // Add new state for checkbox management
  const [checkedItems, setCheckedItems] = useState({});
  const [showNote, setShowNote] = useState(false);

  /**
   * Handle form submission clone existing
   * @param {Object} values - form values
   * @param {Object} {resetForm} - form reset function
   * @returns {Promise<void>}
   */
  const handleSubmitCloneExisting = async (values) => {
    try {
      if (!values?.selectionConfirm) {
        return;
      }

      // Get the first selected survey ID from the array
      const selectedSurveyId = values.selectedSurveys;

      const payload = {
        communitySurveyID: Number(selectedSurveyId), // Use the selected survey ID instead of fromAssessmentID
        fromCompanyID: values.fromCompanyID,
        toCompanyID: values.toCompanyID,
        surveyName: values.toAssessmentName,
        sourceType: "RESOURCE",
        buttonType: values.action === "copy-edit" ? "EDIT" : "PUBLISH",
      };

      if (!selectedSurveyId) {
        setShowNote(true);
        return;
      }

      const response = await onCopySurvey(payload, "resource");

      if (response?.status) {
        if (values.action === "copy-edit") {
          const holdValue = {
            companyID: values.toCompanyID,
            survey: {
              survey_id: response?.data?.surveyID,
              survey_name: values.newSurveyName,
              // Add any other required survey properties from the response
            },
          };
          // Navigate to review and edit page with the new survey data
          navigate(adminRouteMap.REVIEWANDEDIT.path, {
            state: holdValue,
          });
          if (location.pathname === adminRouteMap.REVIEWANDEDIT.path) {
            dispatcSurveyDataOnNavigateData(holdValue);
            createExistingClose();
            window.location.reload();
          }
        } else {
          createExistingClose();
        }
      }
    } catch (error) {
      console.error("Error in clone existing:", error);
    }
  };

  // Clone Existing Survey formik setup
  const formikCloneExisting = useFormik({
    initialValues: {
      ...initValuesCreateFromExisting(),
      action: "",
      selectedSurveys: [],
    },
    validationSchema: validationCreateFromExistingResource(),
    onSubmit: handleSubmitCloneExisting,
  });

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
    searchKeys: ["surveyName", "keywords"],
    tableFilters,
    initialLimit: 10,
    data: resourceData, // Use the API data instead of ModalTable
  });
  const handleLimitChange = (value) => {
    setLimit(value);
    setOffset(1);
  };

  const handleOffsetChange = (value) => {
    setOffset(value);
  };

  // Add checkbox handlers BEFORE columns definition
  const handleCheckboxChange = (e, row) => {
    const { checked } = e.target;
    const communitySurveyId = row?.communitySurveyId;
    console.log(checked, "checked resources");
    setCheckedItems(() => ({
      [communitySurveyId]: checked,
    }));
    if (checked) {
      formikCloneExisting.setFieldValue(
        "selectedSurveys",
        row?.communitySurveyId
      );

      formikCloneExisting.setFieldValue(
        "toAssessmentName",
        `Clone - ${row?.surveyName}`
      );
    } else {
      formikCloneExisting.setFieldValue("selectedSurveys", "");

      formikCloneExisting.setFieldValue("toAssessmentName", "");
    }
  };

  // Now define columns after the handlers
  const columns = [
    {
      title: "SELECT",
      dataKey: "select",
      columnHeaderClassName: "w-1 text-center",
      columnOrderable: false,
      render: (data, row) => {
        const communitySurveyId = row?.communitySurveyId;
        return (
          <Form.Group
            className="form-group mb-0"
            controlId={`survey-${communitySurveyId}`}
          >
            <Form.Check
              className="me-0 p-0"
              type="checkbox"
              id={communitySurveyId}
              checked={checkedItems[communitySurveyId] || false}
              onChange={(e) => handleCheckboxChange(e, row)}
              label={<div className="primary-color" />}
            />
          </Form.Group>
        );
      },
    },

    {
      title: "Survey Name",
      dataKey: "surveyName",
      data: "surveyName",
    },
    {
      title: "Keywords",
      dataKey: "keywords",
      data: "keywords",
    },
    {
      title: "Preview",
      dataKey: "preview",
      data: "preview",
      columnHeaderClassName: "w-1 text-center no-sorting",
      columnClassName: "w-1 text-center",
      render: () => {
        return (
          <ul className="list-inline action mb-0">
            <li className="list-inline-item">
              <Link to="#!" className="icon-primary">
                <em className="icon-eye" />
              </Link>
            </li>
          </ul>
        );
      },
    },
  ];

  // Helper function to handle button clicks
  const handleButtonClick = (action, e) => {
    e.preventDefault();
    formikCloneExisting.setFieldValue("action", action);
    formikCloneExisting.handleSubmit();
  };

  // Handle search button click
  const handleSearch = () => {
    if (
      formikCloneExisting.values.fromCompanyID === "" ||
      formikCloneExisting.values.fromAssessmentID === ""
    ) {
      return;
    }
    onFetchResourceSurveys(
      formikCloneExisting.values.fromCompanyID,
      formikCloneExisting.values.fromAssessmentID,
      keywords
    );
  };

  return (
    <Form onSubmit={formikCloneExisting.handleSubmit}>
      <div
        id="resources"
        className="show-hide"
        style={{
          display: "block",
        }}
      >
        <span className="formToLabal">From</span>
        <div className="row rowGap">
          <Col lg={6}>
            <Form.Group className="form-group">
              <Form.Label>
                Company<sup>*</sup>
              </Form.Label>
              <SelectField
                name="fromCompanyID"
                options={companyOptions}
                placeholder="Company Name"
                onChange={(selected) => {
                  formikCloneExisting.setFieldValue(
                    "fromCompanyID",
                    selected?.value || ""
                  );
                }}
                onBlur={formikCloneExisting.handleBlur}
                value={companyOptions.find(
                  (option) =>
                    option.value === formikCloneExisting.values.fromCompanyID
                )}
              />
              {formikCloneExisting.touched.fromCompanyID &&
              formikCloneExisting.errors.fromCompanyID ? (
                <div className="error text-danger">
                  {formikCloneExisting.errors.fromCompanyID}
                </div>
              ) : null}
            </Form.Group>
          </Col>
          <Col lg={6}>
            <Form.Group className="form-group">
              <Form.Label>
                Survey Type<sup>*</sup>
              </Form.Label>
              <SelectField
                name="fromAssessmentID"
                options={surveyOptions}
                placeholder="Survey Type"
                onChange={(selected) =>
                  formikCloneExisting.setFieldValue(
                    "fromAssessmentID",
                    selected?.value || ""
                  )
                }
                onBlur={formikCloneExisting.handleBlur}
                value={surveyOptions.find(
                  (option) =>
                    option.value === formikCloneExisting.values.fromAssessmentID
                )}
              />
              {formikCloneExisting.touched.fromCompanyID &&
              formikCloneExisting.errors.fromAssessmentID ? (
                <div className="error text-danger">
                  {formikCloneExisting.errors.fromAssessmentID}
                </div>
              ) : null}
            </Form.Group>
          </Col>
          <Col lg={6}>
            <div className="form-group">
              <label htmlFor="search">Keywords</label>
              <input
                type="text"
                className="form-control"
                placeholder="Keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
            </div>
          </Col>
          <Col lg={6} className="col-lg-6 d-flex align-items-end">
            <button
              type="button"
              className="btn btn-primary ripple-effect"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </Col>
        </div>
        {showNote && (
          <div className="error text-danger mt-2">
            There is no survey in your resource for next step cloning..
          </div>
        )}
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
          loading={loading}
        />
        <span className="formToLabal mt-xl-4 mt-sm-3 mt-2">To</span>
        <Row className="rowGap">
          <Col lg={6}>
            <Form.Group className="form-group">
              <Form.Label>
                Company<sup>*</sup>
              </Form.Label>
              <SelectField
                name="toCompanyID"
                options={companyOptions}
                placeholder="Company Name"
                onChange={(selected) =>
                  formikCloneExisting.setFieldValue(
                    "toCompanyID",
                    selected?.value || ""
                  )
                }
                onBlur={formikCloneExisting.handleBlur}
                value={companyOptions.find(
                  (option) =>
                    option.value === formikCloneExisting.values.toCompanyID
                )}
              />
              {formikCloneExisting.touched.toCompanyID &&
              formikCloneExisting.errors.toCompanyID ? (
                <div className="error text-danger">
                  {formikCloneExisting.errors.toCompanyID}
                </div>
              ) : null}
            </Form.Group>
          </Col>
          <Col lg={6}>
            <Form.Group className="form-group">
              <Form.Label>
                Survey<sup>*</sup>
              </Form.Label>
              <InputField
                type="text"
                placeholder="Survey"
                name="toAssessmentName"
                onChange={formikCloneExisting?.handleChange}
                onBlur={formikCloneExisting?.handleBlur}
                value={formikCloneExisting.values.toAssessmentName}
              />
              {formikCloneExisting?.touched.toAssessmentName &&
              formikCloneExisting?.errors.toAssessmentName ? (
                <div className="error text-danger">
                  {formikCloneExisting?.errors.toAssessmentName}
                </div>
              ) : null}
            </Form.Group>
          </Col>
        </Row>
        <div className="d-flex align-items-center justify-content-between mt-3 flex-wrap">
          <div className="form-check form-check-inline m-0 me-2 mb-lg-0 mb-2">
            <InputField
              className="form-check-input"
              type="checkbox"
              defaultValue={!formikCloneExisting.values.selectionConfirm}
              id="selectionConfirm1"
              name="selectionConfirm"
              onChange={formikCloneExisting.handleChange}
              onBlur={formikCloneExisting.handleBlur}
            />
            <label className="form-check-label" htmlFor="confirm">
              Confirm this is the right selection
            </label>
          </div>
          <div className="d-flex gap-2 justify-content-end">
            <Button
              variant="primary"
              type="submit"
              disabled={
                isSubmitting || !formikCloneExisting.values.selectionConfirm
              }
              className="ripple-effect"
              value="copy-edit"
              onClick={(e) => handleButtonClick("copy-edit", e)}
            >
              {isSubmitting ? "Copy & Edit..." : " Copy & Edit"}
            </Button>
            <Button
              variant="warning"
              type="submit"
              disabled={
                isSubmitting || !formikCloneExisting.values.selectionConfirm
              }
              className="ripple-effect"
              value="copy-publish"
              onClick={(e) => handleButtonClick("copy-publish", e)}
            >
              {isSubmitting ? "Copy & Publish..." : " Copy & Publish"}
            </Button>
          </div>
        </div>
      </div>
    </Form>
  );
}

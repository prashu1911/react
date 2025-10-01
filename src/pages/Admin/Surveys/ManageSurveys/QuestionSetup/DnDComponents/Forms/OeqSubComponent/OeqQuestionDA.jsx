import {
  Button,
  Col,
  Form,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useFormik } from "formik";
import { commonService } from "services/common.service";
import { QuestionSetup } from "apiEndpoints/QuestionSetup";
import { useSurveyDataOnNavigations } from "customHooks";
import { InputField, SweetAlert } from "../../../../../../../../components";
import {
  OEQFormInitialValue,
  OEQFormValidationSchema,
} from "../../../validation";
import QuestionBankModal from "../../../ModelComponent/QuestionBankModal";
import AddToResourceModel from "../../../ModelComponent/AddToResourceModel";

export default function OpenEndedQuestionDA({
  setActiveForm,
  surveyID,
  companyID,
  outcome,
  handleEditClose,
  surveyType,
  userData,
  updateQuestionListByOutComeID,
  questionOptions,
  initialQuestionData,
  edit
}) {
  // sweet alert
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const onConfirmAlertModal = () => {
    setIsAlertVisible(false);
    return true;
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBankAttributes, setShowBankAttributes] = useState(false);
  const handleCheckboxChange = (e) => {
    setShowBankAttributes(e.target.checked);
    // eslint-disable-next-line no-use-before-define
    formik.setFieldValue("addQuestionToResource", e.target.checked);
  };

  // Question Bank Modal start
  const [showQuestionBank, setShowQuestionBank] = useState(false);
  const questionBankClose = () => setShowQuestionBank(false);
  const questionBankShow = () => setShowQuestionBank(true);

  const { getSurveyDataOnNavigate } = useSurveyDataOnNavigations();
  const surevyData = getSurveyDataOnNavigate();
  const status = surevyData?.status !== 'Design';

  const [isEditMode] = useState(!!initialQuestionData);
  const BUTTON_TYPE = edit ? {
    load: "Updating...",
    type: "Update"

  } : {
    load: "Saving...",
    type: "Save"
  };

  // Initialize formik with either initial or prefilled values
  const formik = useFormik({
    initialValues: initialQuestionData ? {
      ...OEQFormInitialValue(),
      question: initialQuestionData.question || '',
      intentions: initialQuestionData.intentionName || '',
      intentionsShortName: initialQuestionData.intentionShortName || '',
      displaySkipForNow: initialQuestionData.isSkip || false,
    } : OEQFormInitialValue(),
    validationSchema: OEQFormValidationSchema(),
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      try {
        const endpoint = isEditMode ? QuestionSetup.updateOeq : QuestionSetup.addOeq;
        const bodyData = {
          companyMasterID: userData?.companyMasterID,
          companyID,
          surveyID,
          outcomeID: outcome?.id,
          intentionName: values?.intentions,
          intentionShortName: values?.intentionsShortName,
          question: values?.question,
          isSkip: values?.displaySkipForNow,
          surveyTypeID: values?.surveyType,
          keywords: values?.keyWord || "",
          isQuestionAddedToResource: values?.surveyType?.length > 0 ? 1 : 0,
          ...(isEditMode && { questionID: initialQuestionData.questionID }),
        };
        const response = await commonService({
          apiEndPoint: endpoint,
          bodyData,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData?.apiToken}`,
          },
          toastType: {
            success: true,
            error: false,
          },
        });
        if (response?.status) {
          if (!isEditMode) {
            resetForm();
            updateQuestionListByOutComeID(outcome?.id);
            setActiveForm([]);
          } else {
            // Call updateQuestionListByOutComeID with the updated question
            updateQuestionListByOutComeID(outcome?.id);
            handleEditClose();
          }
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });
  console.log(formik, "formik");
  const handleCancel = () => {
    if (initialQuestionData?.questionID) {
      handleEditClose();
    } else {
      setActiveForm([]);
    }
  };

  const handleAddQuestion = (row) => {
    formik.setFieldValue("question", row?.question);
    questionBankClose();
  };

  return (
    <>
      <Form onSubmit={formik.handleSubmit}>
        <div className="d-flex  justify-content-end mb-3">
          <Button
            variant="outline-primary"
            className="ripple-effect"
            onClick={questionBankShow}
            disabled={status}
          >
            <em className="icon-import me-2 d-sm-block d-none" />
            Import from Question Bank
          </Button>
        </div>{" "}
        <Row className="gy-3 gx-2">
          <Col sm={12}>
            <Form.Group className="form-group mb-0">
              <div className="d-flex justify-content-between mb-2 flex-sm-row flex-column-reverse">
                <Form.Label className="mb-0">
                  Question <sup>*</sup>
                </Form.Label>
                <Form.Group
                  className="form-group mb-sm-0 mb-2 flex-shrink-0"
                  controlId="skip1"
                >
                  <Form.Check
                    className="me-0"
                    type="checkbox"
                    onChange={handleCheckboxChange}
                    label={<div> Add Question To Resource </div>}
                    disabled={status}
                  />
                </Form.Group>
              </div>
              <InputField
                type="text"
                placeholder="Enter Question"
                name="question"
                onChange={formik.handleChange}
                value={formik.values.question}
                disabled={status}
              />
              {formik.touched.question && formik.errors.question && (
                <div className="error mt-1 text-danger">
                  {formik.errors.question}
                </div>
              )}
            </Form.Group>
          </Col>
          <Col sm={6}>
            <Form.Group className="form-group mb-0">
              <Form.Label className="mb-2">
                Intentions <sup>*</sup>
              </Form.Label>
              <InputField
                type="text"
                placeholder="Enter Intentions"
                name="intentions"
                onChange={formik.handleChange}
                value={formik.values.intentions}
                disabled={status}
              />
              {formik.touched.intentions && formik.errors.intentions && (
                <div className="error mt-1 text-danger">
                  {formik.errors.intentions}
                </div>
              )}
            </Form.Group>
          </Col>
          <Col sm={6}>
            <Form.Group className="form-group mb-0">
              <Form.Label className="mb-2 d-flex align-items-center">
                Intentions Short Name <sup>*</sup>
                <Link to="#!" className="p-0">
                  <OverlayTrigger
                    overlay={
                      <Tooltip id="tooltip-disabled">
                        Provide a short name to be used in reports and chart.
                      </Tooltip>
                    }
                  >
                    <span className="d-flex ms-1">
                      <em
                        disabled
                        style={{ pointerEvents: "none" }}
                        className="icon-info-circle"
                      />
                    </span>
                  </OverlayTrigger>
                </Link>
              </Form.Label>
              <InputField
                type="text"
                placeholder="Enter Intentions Short Name"
                name="intentionsShortName"
                onChange={formik.handleChange}
                value={formik.values.intentionsShortName}
                disabled={status}
              />
              {formik.touched.intentionsShortName &&
                formik.errors.intentionsShortName && (
                  <div className="error mt-1 text-danger">
                    {formik.errors.intentionsShortName}
                  </div>
                )}
            </Form.Group>
          </Col>
        </Row>
        <div className=" mt-3 pt-xl-1 pt-0">
          <Form.Group className="form-group switchaxis d-sm-flex align-items-center">
            <Form.Label className="mb-0 me-xl-3 me-2 w-auto ">
              Display Skip For Now <sup>*</sup>
            </Form.Label>
            <div className="switchBtn switchBtn-success switchBtn-label-nf">
              <InputField
                type="checkbox"
                defaultValue="1"
                id="switchaxis1"
                className="p-0"
                name="displaySkipForNow"
                onChange={formik.handleChange}
                checked={formik.values.displaySkipForNow}
                disabled={status}
              />
              <label htmlFor="switchaxis1" />
            </div>
            {formik.touched.displaySkipForNow &&
              formik.errors.displaySkipForNow && (
                <div className="error mt-1 text-danger">
                  {formik.errors.displaySkipForNow}
                </div>
              )}
          </Form.Group>
        </div>
        <div className="d-flex justify-content-end gap-2 mt-3">
          <Button
            variant="secondary"
            className="ripple-effect"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button variant="primary" type="submit" className="ripple-effect" disabled={isSubmitting}>
            {isSubmitting ? BUTTON_TYPE?.load : BUTTON_TYPE?.type}
          </Button>
        </div>
      </Form>

      {showQuestionBank && (
        <QuestionBankModal
          showQuestionBank={showQuestionBank}
          questionBankClose={questionBankClose}
          questionOptions={questionOptions}
          surveyOptions={surveyType}
          userData={userData}
          openFrom="Open Ended"
          handleAddQuestion={handleAddQuestion}
          surveyID={surveyID}
          companyID={companyID}
          questionType="o"
        />
      )}

      <SweetAlert
        title="Are you sure?"
        text="You want to delete this data!"
        show={isAlertVisible}
        icon="warning"
        onConfirmAlert={onConfirmAlertModal}
        showCancelButton
        cancelButtonText="Cancel"
        confirmButtonText="Yes"
        setIsAlertVisible={setIsAlertVisible}
        isConfirmedTitle="Deleted!"
        isConfirmedText="Question deleted successfully."
      />

      {/* Add Question Bank Attributes modal */}
      {showBankAttributes && (
        <AddToResourceModel
          show={showBankAttributes}
          onClose={() => setShowBankAttributes(false)}
          formik={formik}
          surveyType={surveyType}
          setShowBankAttributes={setShowBankAttributes}
        />
      )}
    </>
  );
}

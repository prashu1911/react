import { Col, Form, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Button, InputField } from "../../../../../../../../components";
import ResponseTypeDynamicForm from "./ResponseTypeDynamicForm";

const MultiResponseDynamicForm = ({ parentIndex, formik }) => {
  const { childForms } = formik.values.parentForms[parentIndex];
  const areAllChildFormsValid = childForms.every((_, childIndex) => {
    const responseError =
      formik.errors.parentForms?.[parentIndex]?.childForms?.[childIndex]
        ?.response;
    const weightageError =
      formik.errors.parentForms?.[parentIndex]?.childForms?.[childIndex]
        ?.weightage;
    const categoryError =
      formik.errors.parentForms?.[parentIndex]?.childForms?.[childIndex]
        ?.category;
    let openEndedQuestionError =
      formik.errors.parentForms?.[parentIndex]?.childForms?.[childIndex]
        ?.openEndedQuestion;
    if (
      !formik.values.parentForms?.[parentIndex]?.childForms?.[childIndex]
        ?.hasOeq
    ) {
      openEndedQuestionError = undefined;
    }
    return (
      !responseError &&
      !weightageError &&
      !categoryError &&
      !openEndedQuestionError
    );
  });

  const addChild = () => {
    const newChildForms = [
      ...childForms,
      {
        id: Date.now().toString(),
        response: "",
        weightage: 1,
        category: "",
        hasOeq: false,
        openEndedQuestion: "",
      },
    ];
    formik.setFieldValue(
      `parentForms[${parentIndex}].childForms`,
      newChildForms
    );
  };

  const responseCategory = [
    { value: "Positive", label: "Positive" },
    { value: "Neutral", label: "Neutral" },
    { value: "Negative", label: "Negative" },
  ];

  const handleCheckboxChangeOeq = (parentIndexLocal, childIndex) => {
    const newValue =
      !formik.values.parentForms[parentIndexLocal].childForms[childIndex]
        .hasOeq;
    formik.setFieldValue(
      `parentForms[${parentIndexLocal}].childForms[${childIndex}].hasOeq`,
      newValue
    );
    if (!newValue) {
      formik.setFieldValue(
        `parentForms[${parentIndexLocal}].childForms[${childIndex}].openEndedQuestion`,
        ""
      );
    }
  };

  return (
    <div>
      <div key={parentIndex.id} className="multiResponse">
        <Button variant="danger" className="multiResponse_deleteBtn">
          <em className="icon-delete" />
        </Button>
        <Row className="gx-2">
          <Col sm={12}>
            <Form.Group className="form-group">
              <Form.Label>
                Defining Question <sup>*</sup>
              </Form.Label>
              <InputField type="text" placeholder="Enter Question" />
            </Form.Group>
          </Col>
          <Col md={4} sm={6}>
            <Form.Group className="form-group">
              <Form.Label>
                Question Type <sup>*</sup>{" "}
              </Form.Label>
              {/* <SelectField
                  placeholder="Select Free From"
                  options={chartTypeOptions}
                /> */}
            </Form.Group>
          </Col>
          <Col md={4} sm={6}>
            <Form.Group className="form-group">
              <Form.Label>
                Intentions <sup>*</sup>
              </Form.Label>
              <InputField type="text" placeholder="Enter Intentions" />
            </Form.Group>
          </Col>
          <Col md={4} sm={6}>
            <Form.Group className="form-group">
              <Form.Label>
                Intentions Short Name <sup>*</sup>{" "}
                <Link to="#!" className="p-0">
                  <OverlayTrigger
                    overlay={
                      <Tooltip id="tooltip-disabled">
                        Provide a short name to be used in reports and chart.
                      </Tooltip>
                    }
                  >
                    <span className="d-inline-block ms-1">
                      <em
                        disabled
                        style={{ pointerEvents: "none" }}
                        className="icon-info-circle"
                      />
                    </span>
                  </OverlayTrigger>
                </Link>{" "}
              </Form.Label>
              <InputField
                type="text"
                placeholder="Enter Intentions Short Name"
              />
            </Form.Group>
          </Col>
          <Col sm={6}>
            <Form.Group className="form-group">
              <Form.Label>
                Response Type <sup>*</sup>{" "}
                <Link to="#!" className="p-0">
                  <OverlayTrigger
                    overlay={
                      <Tooltip id="tooltip-disabled">
                        Use list value Free Form to create custom response type.
                      </Tooltip>
                    }
                  >
                    <span className="d-inline-block ms-1">
                      <em
                        disabled
                        style={{ pointerEvents: "none" }}
                        className="icon-info-circle"
                      />
                    </span>
                  </OverlayTrigger>
                </Link>{" "}
              </Form.Label>
              {/* <SelectField
                  placeholder="Select Response Type"
                  defaultValue={responseType[0]}
                  options={responseType}
                /> */}
            </Form.Group>
          </Col>
          <Col sm={6}>
            <Form.Group className="form-group">
              <Form.Label>
                Scale <sup>*</sup>{" "}
              </Form.Label>
              {/* <SelectField
                  placeholder="Select Scale"
                  defaultValue={skipjumpOptions[0]}
                  options={skipjumpOptions}
                /> */}
            </Form.Group>
          </Col>
        </Row>
        {/* <div className="mb-lg-0 mb-md-3 mb-2 mt-md-0 mt-3 scalarSecCover">
            <ResponseTableData />
          </div> */}

        <div className="d-flex justify-content-between gap-2 mb-0 align-items-center">
          <div className="sequence title">Sl.No.</div>
          <div className="scalar title">Response </div>
          <div className="maximum title">Value </div>
          <div className="maximum title">Response Category</div>
          <div className="color title">
            Oeq
            <Link to="#!" className="p-0">
              <OverlayTrigger
                overlay={
                  <Tooltip id="tooltip-disabled">
                    Selecting an OEQ box associated with a response will trigger
                    an open-ended question e.g., asking the participant to
                    clarify why they chose this response.
                  </Tooltip>
                }
              >
                <span className="d-inline-block ms-1">
                  <em
                    className="icon-info-circle"
                    style={{ pointerEvents: "none" }}
                  />
                </span>
              </OverlayTrigger>
            </Link>
          </div>
          <div className="addeletebtn title justify-content-center">+/-</div>
        </div>

        {childForms.map((_, childIndex) => (
          <ResponseTypeDynamicForm
            key={childIndex}
            parentIndex={parentIndex}
            childIndex={childIndex}
            formik={formik}
            addChild={addChild}
            responseCategory={responseCategory}
            handleCheckboxChangeOeq={handleCheckboxChangeOeq}
          />
        ))}

        {/* <ResponseTypeDynamicForm
          //   key={childIndex}
          parentIndex={parentIndex}
          //   childIndex={childIndex}
          formik={formik}
          addChild={addChild}
          childForms={childForms}
        /> */}
      </div>

      <Button
        variant="primary"
        className="ripple-effect"
        onClick={() => {
          const newParentForms = [
            ...formik.values.parentForms,
            { childForms: [{ input: "" }] },
          ];
          formik.setFieldValue("parentForms", newParentForms);
        }}
        disabled={!areAllChildFormsValid}
      >
        {" "}
        <em className="icon-plus me-1" /> Add Response
      </Button>

      {/* <button
          type="button"
          onClick={() => {
            const newParentForms = [
              ...formik.values.parentForms,
              { childForms: [{ input: "" }] },
            ];
            formik.setFieldValue("parentForms", newParentForms);
          }}
          disabled={!areAllChildFormsValid}
        >
          Add New Parent
        </button> */}
    </div>
  );
};

export default MultiResponseDynamicForm;

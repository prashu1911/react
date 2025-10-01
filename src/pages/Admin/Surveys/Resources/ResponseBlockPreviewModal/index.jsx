import { ErrorMessage, Field, FieldArray } from "formik";
import {
  Form as BootstrapForm,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";

export default function ResponseBlockPreviewModal({
  responses,
  setFieldValue,
}) {
  // response Category Options
  const responseCategoryOptions = [
    { label: "Positive", value: 1 },
    { label: "Neutral", value: 2 },
    { label: "Negative", value: 3 },
  ];
  const handleCheckboxChange = (index, currentVal) => {
    const newValue = currentVal ? 0 : 1;
    setFieldValue(`responses[${index}].oeq`, newValue);
  };
  return (
    <div className="addResponse">
      <BootstrapForm.Group className="form-group mb-0">
        <BootstrapForm.Label>Add Response</BootstrapForm.Label>
      </BootstrapForm.Group>
      <FieldArray name="responses">
        {({ push, remove }) => (
          <>
            <div className="scalarSec scalarappend">
              <div className="d-flex justify-content-between gap-2 mb-0 align-items-center text-center">
                <div className="maximum title">S.No.</div>
                <div className="scalar title">Response</div>
                <div className="maximum title">Value </div>
                <div className="RespCategory title">Response Category </div>
                <div className="color title">
                  {" "}
                  OEQ
                  <OverlayTrigger
                    overlay={
                      <Tooltip id="tooltip-disabled">
                        Selecting an OEQ box associated with a response will
                        trigger an open-ended question e.g., asking the user to
                        clarify why they chose this response.
                      </Tooltip>
                    }
                  >
                    <span className="d-inline-block" role="button">
                      <em
                        disabled
                        style={{ pointerEvents: "none" }}
                        className="icon-info-circle ms-1 link-primary"
                      />
                    </span>
                  </OverlayTrigger>
                </div>
                <div className="title justify-content-center">Action</div>
              </div>
              {/* Render each response row */}
              {responses &&
                responses?.map((resp, index) => (
                  <div key={index}>
                    <div className="scalarappend_list d-flex justify-content-between gap-2 align-items-start">
                      <BootstrapForm.Group className="form-group maximum">
                        {/* S.No. - You may update this based on your design */}
                        <Field
                          type="text"
                          name={`responses[${index}].sno`}
                          className="text-center form-control disabled"
                          placeholder=""
                          value={index + 1}
                        />
                        <ErrorMessage
                          name={`responses[${index}].sno`}
                          component="div"
                          className="error-help-block"
                        />
                      </BootstrapForm.Group>
                      <BootstrapForm.Group className="form-group scalar">
                        <Field
                          type="text"
                          name={`responses[${index}].response`}
                          className="form-control"
                          placeholder="Enter a response"
                        />
                        <ErrorMessage
                          name={`responses[${index}].response`}
                          component="div"
                          className="error-help-block"
                        />
                      </BootstrapForm.Group>
                      <BootstrapForm.Group className="form-group maximum">
                          <Field
                            type="number"
                            name={`responses[${index}].weightage`}
                            className="form-control"
                            placeholder="Enter weightage"
                            value={resp.weightage}
                            onChange={(e) => {
                            const weightageStr = e.target.value;
                            setFieldValue(`responses[${index}].weightage`, weightageStr);

                            const weightNum = parseFloat(weightageStr);

                            // Sync category if valid number
                            if (!isNaN(weightNum)) {
                              if (weightNum < 0) {
                                setFieldValue(`responses[${index}].category`, 3); // Negative
                              } else if (weightNum > 0 && resp.category === 3) {
                                setFieldValue(`responses[${index}].category`, 1); // Positive
                              }
                            }
                          }}
                          />
                        <ErrorMessage
                          name={`responses[${index}].weightage`}
                          component="div"
                          className="error-help-block"
                        />
                      </BootstrapForm.Group>
                      <BootstrapForm.Group className="form-group RespCategory">
                        {/* Assuming you have a custom select component */}
                        <Field
                            as="select"
                            name={`responses[${index}].category`}
                            className="form-control"
                            onChange={(e) => {
                              const selectedValue = parseInt(e.target.value);
                              setFieldValue(`responses[${index}].category`, selectedValue);

                              const weightStr = resp.weightage?.toString() || "0";
                              const weightNum = parseFloat(weightStr);

                              // Update stringified weightage value based on category
                              if (selectedValue === 3 && weightNum > 0) {
                                setFieldValue(`responses[${index}].weightage`, (-weightNum).toString());
                              } else if (selectedValue === 1 && weightNum < 0) {
                                setFieldValue(`responses[${index}].weightage`, Math.abs(weightNum).toString());
                              }
                            }}
                          >
                            {responseCategoryOptions?.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                        </Field>
                        <ErrorMessage
                          name={`responses[${index}].category`}
                          component="div"
                          className="error-help-block"
                        />
                      </BootstrapForm.Group>
                      <BootstrapForm.Group className="form-group color">
                        <BootstrapForm.Check
                          type="checkbox"
                          label={<div className="primary-color" />}
                          name={`responses[${index}].oeq`}
                          checked={!!resp.oeq}
                          onChange={() => handleCheckboxChange(index, resp.oeq)}
                        />
                        <ErrorMessage
                          name={`responses[${index}].oeq`}
                          component="div"
                          className="error-help-block"
                        />
                      </BootstrapForm.Group>
                      {/* Action Button */}
                      <div className="addeletebtn d-flex gap-2">
                        {index === 0 ? (
                          // For the first row, show an "Add" button.
                          <button
                            type="button"
                            aria-label="Add icon"
                            className="addbtn addscaler"
                            onClick={() =>
                              push({
                                sno: (responses.length + 1).toString(),
                                response: "",
                                weightage: "",
                                category: responseCategoryOptions[0].value,
                                oeq: 0,
                                oeqQuestion: "",
                              })
                            }
                          >
                            <span>+</span>
                          </button>
                        ) : (
                          // For all subsequent rows, show a "Delete" button.
                          <button
                            type="button"
                            aria-label="Delete icon"
                            className="deletebtn deletebtnscaler"
                            onClick={() => remove(index)}
                          >
                            <em className="icon-delete" />
                          </button>
                        )}
                      </div>
                    </div>
                    {resp.oeq === 1 && (
                      <div className="oeqTextarea form-group mt-3">
                        <Field
                          as="textarea"
                          rows={2}
                          name={`responses[${index}].oeqQuestion`}
                          className="form-control"
                          placeholder="Enter Question"
                          extraClass="h-auto"
                        />
                        <ErrorMessage
                          name={`responses[${index}].oeqQuestion`}
                          component="div"
                          className="error-help-block"
                        />
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </>
        )}
      </FieldArray>
    </div>
  );
}

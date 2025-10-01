import React, { useState } from "react";
import { Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { InputField, SelectField } from "../../../../../../components";

function ResponseTableData({ showDragIcon = true }) {
  const [draggedItem, setDraggedItem] = useState(null);

  const responseCategory = [
    { value: "Positive", label: "Positive" },
    { value: "Neutral", label: "Neutral" },
    { value: "Negative", label: "Negative" },
  ];

  const validationSchema = Yup.object().shape({
    responses: Yup.array().of(
      Yup.object().shape({
        response: Yup.string()
          .required("Response is required")
          .min(1, "Response must be at least 2 characters"),
        weightage: Yup.number()
          .required("Value is required")
          .min(1, "Value must be at least 1")
          .max(100, "Value must not exceed 100"),
        category: Yup.string().required("Category is required"),
        openEndedQuestion: Yup.string().when("hasOeq", {
          is: true,
          then: () =>
            Yup.string().required(
              "Open ended question is required when OEQ is checked"
            ),
        }),
      })
    ),
  });

  const formik = useFormik({
    initialValues: {
      responses: [
        {
          id: "1",
          response: "Very Low",
          weightage: 1,
          category: "Positive",
          hasOeq: false,
          openEndedQuestion: "",
        },
      ],
    },
    validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      console.log(values);
      setSubmitting(false);
    },
  });

  const handleAddRow = () => {
    const newResponses = [...formik.values.responses];
    newResponses.push({
      id: Date.now().toString(),
      response: "",
      weightage: 1,
      category: "Positive",
      hasOeq: false,
      openEndedQuestion: "",
    });
    formik.setFieldValue("responses", newResponses);
  };

  const handleDeleteRow = (index) => {
    if (formik.values.responses.length > 1) {
      const newResponses = formik.values.responses.filter(
        (_, i) => i !== index
      );
      formik.setFieldValue("responses", newResponses);
    }
  };

  const handleCheckboxChangeOeq = (index) => {
    const newValue = !formik.values.responses[index].hasOeq;
    formik.setFieldValue(`responses.${index}.hasOeq`, newValue);
    if (!newValue) {
      formik.setFieldValue(`responses.${index}.openEndedQuestion`, "");
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = "move";
    e.target.style.opacity = "0.4";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    return false;
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    const target = e.target.closest(".response-item");
    if (target) {
      target.classList.add("drag-over");
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    const target = e.target.closest(".response-item");
    if (target) {
      target.classList.remove("drag-over");
    }
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const target = e.target.closest(".response-item");
    if (target) {
      target.classList.remove("drag-over");
    }

    if (draggedItem === null || draggedItem === dropIndex) return;

    const items = Array.from(formik.values.responses);
    const draggedItemContent = items[draggedItem];
    items.splice(draggedItem, 1);
    items.splice(dropIndex, 0, draggedItemContent);

    formik.setFieldValue("responses", items);
    setDraggedItem(null);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = "1";
    setDraggedItem(null);
    document.querySelectorAll(".response-item").forEach((item) => {
      item.classList.remove("drag-over");
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    formik.handleSubmit(e);
  };

  return (
    <Form>
      <div className="scalarSec scalarappend mt-2">
        {/* Table Header */}
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

        {formik.values.responses.map((response, index) => (
          <div
            key={response.id}
            className="response-item"
            draggable={showDragIcon}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
          >
            <div className="scalarappend_list d-flex justify-content-between gap-2 align-items-center">
              <div className="sequence">
                <Link>
                  <em className="icon-drag me-3" />
                </Link>
                <span>{String(index + 1).padStart(2, "0")}.</span>
              </div>

              {/* Rest of your form fields remain the same */}
              <Form.Group className="form-group scalar">
                <InputField
                  type="text"
                  name={`responses.${index}.response`}
                  placeholder="Enter Response"
                  value={response.response}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    formik.touched.responses?.[index]?.response &&
                    formik.errors.responses?.[index]?.response
                  }
                />
                {formik.touched.responses?.[index]?.response &&
                  formik.errors.responses?.[index]?.response && (
                    <div className="error-message text-danger">
                      {formik.errors.responses[index].response}
                    </div>
                  )}
              </Form.Group>

              <Form.Group className="form-group maximum">
                <InputField
                  type="number"
                  name={`responses.${index}.weightage`}
                  placeholder="Enter Value"
                  value={response.weightage}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    formik.touched.responses?.[index]?.weightage &&
                    formik.errors.responses?.[index]?.weightage
                  }
                />
                {formik.touched.responses?.[index]?.weightage &&
                  formik.errors.responses?.[index]?.weightage && (
                    <div className="error-message text-danger">
                      {formik.errors.responses[index].weightage}
                    </div>
                  )}
              </Form.Group>

              <Form.Group className="form-group maximum">
                <SelectField
                  name={`responses.${index}.category`}
                  placeholder="Select Response Category"
                  value={responseCategory.find(
                    (cat) => cat.value === response.category
                  )}
                  options={responseCategory}
                  onChange={(option) =>
                    formik.setFieldValue(
                      `responses.${index}.category`,
                      option.value
                    )
                  }
                  isInvalid={
                    formik.touched.responses?.[index]?.category &&
                    formik.errors.responses?.[index]?.category
                  }
                />
                {formik.touched.responses?.[index]?.category &&
                  formik.errors.responses?.[index]?.category && (
                    <div className="error-message text-danger">
                      {formik.errors.responses[index].category}
                    </div>
                  )}
              </Form.Group>

              <div className="color">
                <Form.Group className="form-group mb-0 d-flex align-items-center justify-content-center">
                  <Form.Check
                    className="me-0 mb-0"
                    type="checkbox"
                    label={<div />}
                    checked={response.hasOeq}
                    onChange={() => handleCheckboxChangeOeq(index)}
                  />
                </Form.Group>
              </div>

              <div className="addeletebtn d-flex gap-2">
                {index === 0 ? (
                  <Link
                    to="#!"
                    className="addbtn addscaler"
                    onClick={handleAddRow}
                  >
                    <span>+</span>
                  </Link>
                ) : (
                  <Link
                    to="#!"
                    className="deletebtn deletebtnscaler"
                    onClick={() => handleDeleteRow(index)}
                  >
                    <em className="icon-delete me-0" />
                  </Link>
                )}
              </div>
            </div>

            {response.hasOeq && (
              <div className="textarea-container mt-2">
                <Form.Group className="form-group">
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name={`responses.${index}.openEndedQuestion`}
                    placeholder="Enter Open Ended Question"
                    value={response.openEndedQuestion}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.responses?.[index]?.openEndedQuestion &&
                      formik.errors.responses?.[index]?.openEndedQuestion
                    }
                  />
                  {formik.touched.responses?.[index]?.openEndedQuestion &&
                    formik.errors.responses?.[index]?.openEndedQuestion && (
                      <div className="error-message text-danger">
                        {formik.errors.responses[index].openEndedQuestion}
                      </div>
                    )}
                </Form.Group>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="my-3">
        <button onClick={handleSubmit} className="btn btn-primary">
          Save Responses
        </button>
      </div>
    </Form>
  );
}

export default ResponseTableData;

import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { InputField, SelectField } from "../../../../../../../../components";

const ResponseTypeDynamicForm = ({
  parentIndex,
  childIndex,
  formik,
  addChild,
  responseCategory,
  handleCheckboxChangeOeq,
}) => (
  // <div className="child-form">
  //   <input
  //     type="text"
  //     name={`parentForms[${parentIndex}].childForms[${childIndex}].input`}
  //     placeholder="Enter value"
  //     value={
  //       formik.values.parentForms[parentIndex].childForms[childIndex].input
  //     }
  //     onChange={formik.handleChange}
  //     onBlur={formik.handleBlur}
  //   />
  //   {formik.touched.parentForms?.[parentIndex]?.childForms?.[childIndex]
  //     ?.input &&
  //     formik.errors.parentForms?.[parentIndex]?.childForms?.[childIndex]
  //       ?.input && (
  //       <div className="error">
  //         {formik.errors.parentForms[parentIndex].childForms[childIndex].input}
  //       </div>
  //     )}

  //   <button
  //     type="button"
  //     onClick={() => {
  //       addChild();
  //     }}
  //   >
  //     Add Child Form
  //   </button>
  // </div>

  <div className="scalarSecCover">
    <div className="scalarSec scalarappend mt-2">
      {/* Table Header */}

      <div
        key={childIndex}
        className="response-item"
        draggable
        // onDragStart={(e) => handleDragStart(e, index)}
        // onDragOver={(e) => handleDragOver(e, index)}
        // onDragEnter={(e) => handleDragEnter(e, index)}
        // onDragLeave={handleDragLeave}
        // onDrop={(e) => handleDrop(e, index)}
        // onDragEnd={handleDragEnd}
      >
        <div className="scalarappend_list d-flex justify-content-between gap-2 align-items-center">
          <div className="sequence">
            <div className="drag-handle">D&D</div>

            {/* <span>{String(index + 1).padStart(2, "0")}.</span> */}
          </div>

          {/* Rest of your form fields remain the same */}
          <Form.Group className="form-group scalar">
            <InputField
              type="text"
              name={`parentForms[${parentIndex}].childForms[${childIndex}].response`}
              placeholder="Enter Response"
              value={
                formik.values.parentForms[parentIndex].childForms[childIndex]
                  .response
              }
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            {formik.errors.parentForms?.[parentIndex]?.childForms?.[childIndex]
              ?.response && (
              <div className="error-message text-danger">
                {
                  formik.errors.parentForms[parentIndex].childForms[childIndex]
                    .response
                }
              </div>
            )}
          </Form.Group>

          <Form.Group className="form-group maximum">
            <InputField
              type="number"
              name={`parentForms[${parentIndex}].childForms[${childIndex}].weightage`}
              placeholder="Enter Value"
              value={
                formik.values.parentForms[parentIndex].childForms[childIndex]
                  .weightage
              }
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.parentForms?.[parentIndex]?.childForms?.[childIndex]
              ?.weightage && (
              <div className="error-message text-danger">
                {
                  formik.errors.parentForms[parentIndex].childForms[childIndex]
                    .weightage
                }
              </div>
            )}
          </Form.Group>

          <Form.Group className="form-group maximum">
            <SelectField
              name={`parentForms[${parentIndex}].childForms[${childIndex}].category`}
              placeholder="Select Response Category"
              value={responseCategory.find(
                (cat) =>
                  cat.value ===
                  formik.values.parentForms[parentIndex].childForms[childIndex]
                    .category
              )}
              options={responseCategory}
              onChange={(option) =>
                formik.setFieldValue(
                  `parentForms[${parentIndex}].childForms[${childIndex}].category`,
                  option.value
                )
              }
            />

            {formik.errors.parentForms?.[parentIndex]?.childForms?.[childIndex]
              ?.category && (
              <div className="error-message text-danger">
                {
                  formik.errors.parentForms[parentIndex].childForms[childIndex]
                    .category
                }
              </div>
            )}
          </Form.Group>

          <div className="color">
            <Form.Group className="form-group mb-0 d-flex align-items-center justify-content-center">
              <Form.Check
                className="me-0 mb-0"
                type="checkbox"
                label={<div />}
                checked={
                  formik.values.parentForms[parentIndex].childForms[childIndex]
                    .hasOeq
                }
                onChange={() =>
                  handleCheckboxChangeOeq(parentIndex, childIndex)
                }
              />
            </Form.Group>
          </div>

          {formik.values.parentForms[parentIndex].childForms[childIndex]
            .hasOeq && (
            <div className="textarea-container mt-2">
              <Form.Group className="form-group col-11">
                <Form.Control
                  as="textarea"
                  rows={2}
                  // name={`responses.${index}.openEndedQuestion`}
                  name={`parentForms[${parentIndex}].childForms[${childIndex}].openEndedQuestion`}
                  placeholder="Enter Open Ended Question"
                  value={
                    formik.values.parentForms[parentIndex].childForms[
                      childIndex
                    ].openEndedQuestion
                  }
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {/* {formik.touched.responses?.[index]?.openEndedQuestion &&
                formik.errors.responses?.[index]?.openEndedQuestion && (
                  <div className="error-message text-danger">
                    {formik.errors.responses[index].openEndedQuestion}
                  </div>
                )} */}

                {formik.errors.parentForms?.[parentIndex]?.childForms?.[
                  childIndex
                ]?.openEndedQuestion && (
                  <div className="error-message text-danger">
                    {
                      formik.errors.parentForms[parentIndex].childForms[
                        childIndex
                      ].openEndedQuestion
                    }
                  </div>
                )}
              </Form.Group>
            </div>
          )}

          <div className="addeletebtn d-flex gap-2">
            {childIndex === 0 ? (
              <Link
                to="#!"
                className="addbtn addscaler"
                onClick={() => addChild()}
              >
                <span>+</span>
              </Link>
            ) : (
              <Link
                to="#!"
                className="deletebtn deletebtnscaler"
                // onClick={() => handleDeleteRow(index)}
              >
                <em className="icon-delete" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ResponseTypeDynamicForm;

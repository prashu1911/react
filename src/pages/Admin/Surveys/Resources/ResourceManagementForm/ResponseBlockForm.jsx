import { RESOURSE_MANAGEMENT } from "apiEndpoints/ResourseManagement";
import { Loader } from "components";
import { useAuth } from "customHooks";
import { ErrorMessage, Field, Formik, Form as FormikForm } from "formik";
import logger from "helpers/logger";
import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { commonService } from "services/common.service";
import * as Yup from "yup";
import ResponseBlockPreviewModal from "../ResponseBlockPreviewModal";

function ResponseBlockForm({ editResponseBlockClose, rowData, formData, getResponseBlockList, modalType, companyOptions}) {
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  const [initialData, setInitialData] = useState();
  const [initialLoader, setInitialLoader] = useState(false);
  const [handleLoading, setHandleLoading] = useState(false);
  const responseCategoryOptions = [
    { label: "Positive", value: 1 },
    { label: "Neutral", value: 2 },
    { label: "Negative", value: 3 },
  ];
  const normalizeResponseCategory = (categoryLabel) => {
    const found = responseCategoryOptions?.find(
      (option) => option.label.toLowerCase() === categoryLabel.toLowerCase()
    );
    return found ? found.value : "";
  };
  const initialValues = {
    keywords: rowData?.keywords ||"",
    company: companyOptions[0].value || "",
    responseTypeName: rowData?.responseBlock || "",
    // initial response rows (could be empty or pre-populated)
    responses: initialData?.map((item) => ({
      // sno: (index + 1).toString(),
      response: item.responseName || "",
      // weightage: item.responseWeightage || "",
      weightage: item.responseWeightage ? parseFloat(item.responseWeightage).toFixed(2) : "", // Display only 2 places after decimal
      category: typeof item.responseCategory === "string"
      ? normalizeResponseCategory(item.responseCategory)
      : item.responseCategory,
      // Normalize "Yes" to true, any other value to false.
      oeq: item.oeq === "Yes" ? 1 : 0,
      oeqQuestion: item.oeqQuestion || "",
    })) || [
      {
        // sno: "1",
        response: "",
        weightage: "",
        category: parseInt(responseCategoryOptions[0].value),
        oeq: 0,
        oeqQuestion: "",
      },
    ],
  };
  const validationSchema = Yup.object({
    keywords: Yup.string().required("Keywords are required"),
    responseTypeName: Yup.string().required("Response Type Name is required"),
    company: Yup.string().required("Company is required"),
    responses: Yup.array().of(
      Yup.object({
        response: Yup.string().required("Response is required"),
        weightage: Yup.number()
          .typeError("Value must be a number")
          .required("Value is required"),
          // .moreThan(0, "Weightage must be greater than 0"),
        category: Yup.string().required(
          "Response Category is required"
        ),
        oeq: Yup.boolean(),
        oeqQuestion: Yup.string().when("oeq", (oeq, schema) =>
          oeq[0] === true
            ? schema.required("Question is required when OEQ is selected")
            : schema.notRequired()
        ),
      })
    ),
  });

  const getResponceBlockById = async (row) => {
    const { responseTypeID } = row;
    try {
      setInitialLoader(true);
      const response = await commonService({
        apiEndPoint: RESOURSE_MANAGEMENT.getResponceBlockById,
        queryParams: { responseTypeID },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        setInitialData(response?.data?.data);
      }
    } catch (error) {
      logger(error);
    }
    setInitialLoader(false);
  };

  const handleSubmit = async (values) => {
    setHandleLoading(true);
    let data = modalType === 'edit' ? {
      responseTypeID: parseInt(rowData?.responseTypeID) || undefined,
      companyMasterID : parseInt(formData?.companyMasterID) || undefined,
      companyID : parseInt(formData?.companyID) || undefined,
      keywords : values?.keywords,
      responseTypeName: values?.responseTypeName,
      allResponse : values?.responses,
    } : {
      companyMasterID : parseInt(userData?.companyMasterID) || undefined,
      companyID : parseInt(values?.company) || undefined,
      keywords : values?.keywords,
      responseTypeName: values?.responseTypeName,
      allResponse : values?.responses,
    };
    try {
      const response = await commonService({
        apiEndPoint:  modalType === 'edit' ? RESOURSE_MANAGEMENT.updateResponseBlockData : RESOURSE_MANAGEMENT.addResponseBlockData,
        bodyData : data,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        toastType: { success: true, error: true },
      });
      if (response?.status) {
        editResponseBlockClose();
        getResponseBlockList();
      }
    } catch (error) {
      logger(error);
    }
    setHandleLoading(false);
  }

  useEffect(() => {
    if (rowData) {
      getResponceBlockById(rowData);
    }
  }, []);
  return (
    <>
      {initialLoader ? (
        <div className="d-flex justify-content-center mb-3">
          <Loader />
        </div>
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue, resetForm }) => (
            <FormikForm>
              <Row className="gx-2">
                <Col lg={6}>
                  <Form.Group className="form-group">
                    <Form.Label>
                      Keywords <sup>*</sup>
                    </Form.Label>
                    <Field
                      type="text"
                      name="keywords"
                      placeholder="Enter Keywords"
                      defaultValue="Approval"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="keywords"
                      component="div"
                      className="error-help-block"
                    />
                  </Form.Group>
                </Col>
                <Col lg={6}>
                  <Form.Group className="form-group">
                    <Form.Label>
                      Response Type Name <sup>*</sup>
                    </Form.Label>
                    <Field
                      type="text"
                      name="responseTypeName"
                      placeholder="Enter Response Type Name"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="responseTypeName"
                      component="div"
                      className="error-help-block"
                    />
                  </Form.Group>
                </Col>
                {modalType === "add" && (
                <Col sm={12}>
                  <Form.Group className="form-group">
                    <Form.Label>
                      Company <sup>*</sup>
                    </Form.Label>
                    <Field
                      as="select"
                      name="company"
                      className="form-control"
                      value={companyOptions.find(
                        (option) => option.value === values
                      )}
                      onChange={(e) =>
                        setFieldValue("company", parseInt(e.target.value))
                      }
                    >
                      {companyOptions?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="emailGroup"
                      component="div"
                      className="error-help-block"
                    />
                  </Form.Group>
                </Col>
              )}
              </Row>
              <ResponseBlockPreviewModal
                responses={values.responses}
                setFieldValue={setFieldValue}
              />
              <div className="d-flex justify-content-end gap-2 mt-2">
                 <Button
                  variant="secondary"
                  className="ripple-effect"
                  // onClick={editResponseBlockClose}
                  onClick={() => {
                    resetForm();
                    editResponseBlockClose();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="ripple-effect"
                >
                { modalType === "add" ? (handleLoading ? "Saving..." : "Save") : (handleLoading ? "Updating..." : "Update")}
                </Button>         
              </div>
            </FormikForm>
          )}
        </Formik>
      )}
    </>
  );
}

export default ResponseBlockForm;

import { RESOURSE_MANAGEMENT } from "apiEndpoints/ResourseManagement";
import { InputField, Loader } from "components";
import { useAuth } from "customHooks";
import { ErrorMessage, Field, Formik, Form as FormikForm } from "formik";
import logger from "helpers/logger";
import { useState } from "react";
import { Accordion, Button, Col, Form, Row } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import adminRouteMap from "routes/Admin/adminRouteMap";
import { commonService } from "services/common.service";
import { decodeHtmlEntities } from "utils/common.util";
import * as Yup from "yup";

function SaveResourceFormComponent({
  surveyTypeOptions,
  resourcesOptions,
  emailCheckbox,
  participantCheckbox,
  summeryCheckbox,
  surveyLoading,
}) {
  const location = useLocation();
  const { getloginUserData } = useAuth();
  let navigate = useNavigate();
  const userData = getloginUserData();
  const [loading, setLoading] = useState(false);
  const [communityData, setCommunityData] = useState([]);
  const saveresource = location?.state?.saveresource || null;
  const companyId = location?.state?.companyId || null;
  const initialValues = {
    companyID: companyId || null,
    surveyID: parseInt(saveresource?.survey_id) || null,
    assessmentName: saveresource?.survey_name || null,
    keywords: "",
    surveyTypeID: parseInt(surveyTypeOptions[0]?.value) || null,
    sharedWith: parseInt(resourcesOptions[0]?.value) || null,
    communityShareID: null,
    sourceType:"RESOURCE",
    description: "",
    isPreStartRequired: false,
    isAssignEmailRequired: false,
    isRemainderMailRequired: false,
    isThankYouMailRequired: false,
    isEmailFooterRequired: false,
    isIntroductionRequired: false,
    isFaqRequired: false,
    isHelpContactRequired: false,
    isProgressBarRequired: false,
    isSummaryReportRequired: false,
    isDetailedReportRequired: false,
  };
  const handleSaveResourceSetup = (row) => {
    setTimeout(() => {
      navigate(adminRouteMap.RESOURCES.path, {
        state: { assessmentData : row },
      });
    }, [100]);
  };
  const validationSchema = Yup.object().shape({
    assessmentName: Yup.string().required("Survey Name is required"),
    surveyTypeID: Yup.string().required("Survey Type is required"),
    sharedWith: Yup.string().required("Shared With is required"),
    communityShareID: Yup.string().when("sharedWith", {
      is: "98",
      then: (schema) => schema.required("Community to Share is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    description: Yup.string().required("Description is required"),
  });
  const getCommunityData = async (value) => {
    if (!(userData.companyMasterID && companyId && value)) {
      return false;
    }
    try {
      const response = await commonService({
        apiEndPoint: RESOURSE_MANAGEMENT.getCommunityData,
        queryParams: {
          companyMasterID: userData.companyMasterID,
          companyID: companyId,
          libraryElementID: value,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        setCommunityData(
          Object?.values(response?.data?.data)?.map((company) => ({
            value: company?.communityHeaderID,
            label: decodeHtmlEntities(company?.communityName),
          }))
        );
      }
    } catch (error) {
      logger(error);
    }
  };
  const handleSubmit = async (values) => {
    setLoading(true);
    if (!(companyId && saveresource?.survey_id && saveresource?.survey_name)) {
      return false;
    }
    const formattedValues = {
      ...values,
      surveyTypeID: parseInt(
        values.surveyTypeID || surveyTypeOptions[0]?.value
      ),
      sharedWith: parseInt(values.sharedWith || resourcesOptions[0]?.value),
      communityShareID : values.sharedWith === "98" ? parseInt( values.communityShareID || communityData[0]?.value ) : null
    };
    try {
      const response = await commonService({
        apiEndPoint: RESOURSE_MANAGEMENT.saveResourcedata,
        bodyData: formattedValues,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        // navigate(adminRouteMap.RESOURCES.path);
        handleSaveResourceSetup(formattedValues);
      }
    } catch (error) {
      logger(error);
    }
    setLoading(false);
  };

  return surveyLoading ? (
    <div className="d-flex align-items-center justify-content-center">
      <Loader />
    </div>
  ) : (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue }) => (
        <FormikForm>
          <Form.Group className="form-group">
            <Form.Label>
              Survey Name<sup>*</sup>
            </Form.Label>
            <Field
              name="assessmentName"
              as={InputField}
              type="text"
              placeholder="Enter Survey Name"
              onChange={(e) => setFieldValue("assessmentName", e.target.value)}
            />
            <ErrorMessage
              name="assessmentName"
              component="div"
              className="text-danger"
            />
          </Form.Group>

          <Row>
            <Col sm={6}>
              <Form.Group className="form-group">
                <Form.Label>
                  Survey Type<sup>*</sup>
                </Form.Label>
                <Field
                  as="select"
                  name="surveyTypeID"
                  className="form-control form-select"
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setFieldValue("surveyTypeID", parseInt(newValue));
                  }}
                >
                  {surveyTypeOptions?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="surveyTypeID"
                  component="div"
                  className="text-danger"
                />
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group className="form-group">
                <Form.Label>
                  Shared With<sup>*</sup>
                </Form.Label>
                <Field
                  as="select"
                  name="sharedWith"
                  className="form-control form-select"
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setFieldValue("sharedWith", newValue);
                    if (newValue === "98") {
                      getCommunityData(newValue);
                    }
                  }}
                >
                  {resourcesOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="sharedWith"
                  component="div"
                  className="text-danger"
                />
              </Form.Group>
            </Col>
          </Row>
          <Field name="sharedWith">
            {({ form }) =>
              form.values.sharedWith === "98" && (
                <Form.Group className="form-group">
                  <Form.Label>
                    Community to Share<sup>*</sup>
                  </Form.Label>
                  <Field
                    as="select"
                    name="communityShareID"
                    className="form-control form-select"
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setFieldValue("communityShareID", parseInt(newValue));
                    }}
                  >
                    {communityData.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="communityShareID"
                    component="div"
                    className="text-danger"
                  />
                </Form.Group>
              )
            }
          </Field>

          <Form.Group className="form-group">
            <Form.Label>
              Description<sup>*</sup>
            </Form.Label>
            <Field
              name="description"
              as="textarea"
              className="textArea form-control"
              placeholder="Enter Description"
              onChange={(e) => setFieldValue("description", e.target.value)}
            />
            <ErrorMessage
              name="description"
              component="div"
              className="text-danger"
            />
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label>Keywords</Form.Label>
            <Field
              name="keywords"
              as={InputField}
              type="text"
              placeholder="Enter Keywords"
              onChange={(e) => setFieldValue("keywords", e.target.value)}
            />
          </Form.Group>

          <Form.Group className="form-group">
            <Form.Label>Bundle Options</Form.Label>
            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>System Generated Emails</Accordion.Header>
                <Accordion.Body>
                  {emailCheckbox &&
                    emailCheckbox?.map((item) => (
                      <div key={item.id} className="mb-1">
                        <Field
                          type="checkbox"
                          name={item.id}
                          checked={values[item.id]}
                          onChange={() =>
                            setFieldValue(item.id, !values[item.id])
                          }
                        />{" "}
                        {item.label}
                      </div>
                    ))}
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>Participation Tools</Accordion.Header>
                <Accordion.Body>
                  {participantCheckbox &&
                    participantCheckbox?.map((item) => (
                      <div key={item.id} className="mb-1">
                        <Field
                          type="checkbox"
                          name={item.id}
                          checked={values[item.id]}
                          onChange={() =>
                            setFieldValue(item.id, !values[item.id])
                          }
                        />{" "}
                        {item.label}
                      </div>
                    ))}
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>User Report Template</Accordion.Header>
                <Accordion.Body>
                  {summeryCheckbox.map((item) => (
                    <div key={item.id} className="mb-1">
                      <Field
                        type="checkbox"
                        name={item.id}
                        checked={values[item.id]}
                        onChange={() =>
                          setFieldValue(item.id, !values[item.id])
                        }
                      />{" "}
                      {item.label}
                    </div>
                  ))}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Form.Group>

          <div className="d-flex justify-content-end gap-2 mt-xl-4 mt-3 flex-wrap">
            <Link
              to={adminRouteMap.MANAGESURVEY.path}
              className="btn btn-secondary"
            >
              Cancel
            </Link>
            <Button type="submit" variant="primary" className="ripple-effect">
              {loading ? "Sharing..." : "Share"}
            </Button>
          </div>
        </FormikForm>
      )}
    </Formik>
  );
}

export default SaveResourceFormComponent;

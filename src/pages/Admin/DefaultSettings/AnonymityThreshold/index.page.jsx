import { Button, InputField } from "components";
import { Formik } from "formik";
import { Col, Form, Row } from "react-bootstrap";
import toast from "react-hot-toast";
import { useMemo } from "react";
import { commonService } from "services/common.service";
import { DEFAULT_SETTINGS } from "apiEndpoints/DefaultSettings";
import validationSchema from "./validation";

export default function AnonymityThreshold({
    setActiveTab,
    activeTab,
    userData,
    selectedCompany,
    initialData,
}) {

    const updatedThreshold = async (values) => {
        const { companyMasterID, apiToken } = userData || {};
        const companyId = selectedCompany?.value;

        if (!companyId) {
            toast.error("Please select a company first");
            return;
        }

        try {
            await commonService({
                apiEndPoint: DEFAULT_SETTINGS.updatedThreshold,
                bodyData: {
                    company_master_id: companyMasterID,
                    company_id: companyId,
                    ...values,
                },
                toastType: {
                    success: true,
                    error: false,
                },
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiToken}`,
                },
            });
        } catch (error) {
            console.error("Failed to save email content:", error);
            toast.error("Something went wrong while saving email content");
        }
    };

    const defaultValues = {
        dataset_threshold: 0,
        comment: 0
    };

    // Use initialData from props if available, otherwise use default values
    const initialValues = useMemo(() => {
        // Check if initialData exists and has valid properties
        if (initialData && typeof initialData === 'object') {
            return {
                dataset_threshold: initialData.dataset_threshold ?? defaultValues.dataset_threshold,
                comment: initialData.comment ?? defaultValues.comment
            };
        }
        return defaultValues;
    }, [initialData]);

    return <>
        <div
            id="anonymityThresholdTab"
            onClick={()=> {
                setActiveTab("anonymityThresholdTab");
            }}
        >
            <Formik
                enableReinitialize
                initialValues={{ ...initialValues }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    updatedThreshold(values);
                }}
            >
                {({
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values
                }) => (
                    <form onSubmit={handleSubmit}>
                        <div className="pageTitle">
                            <h2>Anonymity Threshold </h2>
                        </div>
                        <Row className='g-2'>
                            <Col md={6}>
                                <Form.Group className='form-group mb-0'>
                                    <Form.Label>Baseline minimum size of data sample set </Form.Label>
                                    <InputField
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        name='dataset_threshold'
                                        type="number"
                                        placeholder="Enter minimum size"
                                        value={values.dataset_threshold}
                                        min={0}
                                    />
                                    {errors.dataset_threshold && touched.dataset_threshold && (
                                        <div className="text-danger">
                                            {errors.dataset_threshold}
                                        </div>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className='form-group mb-0'>
                                    <Form.Label>Comments</Form.Label>
                                    <InputField
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        name='comment'
                                        type="number"
                                        placeholder="Enter Comments"
                                        value={values.comment}
                                        min={0}
                                    />
                                    {errors.comment && touched.comment && (
                                        <div className="text-danger">
                                            {errors.comment}
                                        </div>
                                    )}
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className="noteText fs-6 mt-xxl-2 mt-1">Note:Any dataset size falling below the baseline will not be rendered in the chart</div>
                        <div className="d-flex justify-content-end mt-xl-4 mt-3">
                            <Button type="submit" varian="primary" className="ripple-effect">Save</Button>
                        </div>
                    </form>
                )}

            </Formik>

        </div>
    </>;
}
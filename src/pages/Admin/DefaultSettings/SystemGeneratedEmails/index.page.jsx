import { DEFAULT_SETTINGS } from "apiEndpoints/DefaultSettings";
import { Tooltip } from "chart.js";
import { Button, InputField, TextEditor } from "components";
import { Accordion, OverlayTrigger, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { commonService } from "services/common.service";
import { Formik } from "formik";
import { toast } from "react-hot-toast";
import { getSchema } from './validation';


export default function SystemGeneratedEmails({
    setActiveTab,
    activeTab,
    emailShow,
    userData,
    selectedCompany,
    initialData = [],
}) {
    const saveEmailContent = async (values) => {
        const { companyMasterID, apiToken } = userData || {};
        const companyId = selectedCompany?.value;

        if (!companyId) {
            toast.error("Please select a company first");
            return;
        }

        try {
            await commonService({
                apiEndPoint: DEFAULT_SETTINGS.saveEmailContent,
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


    const getMappedInitialValues = (initial = []) => {
        const keyMap = {
            PreStart: 'preStartEmail',
            Assign: 'assignEmail',
            Reminder: 'reminderEmail',
            ThankYou: 'thankYouEmail',
            Footer: 'emailFooter',
        };

        const defaultValues = {
            preStartEmail: { content1: "", content2: "", content3: "" },
            assignEmail: { content1: "", content2: "", content3: "", content4: "" },
            reminderEmail: { content1: "", content2: "", content3: "" },
            thankYouEmail: { content1: "", content2: "", content3: "" },
            emailFooter: { content1: "" },
        };

        return initial.reduce((acc, item) => {
            const [key] = Object.keys(item);
            const mappedKey = keyMap[key];

            if (mappedKey) {
                acc[mappedKey] = {
                    ...defaultValues[mappedKey],
                    ...item[key],
                };
            }

            return acc;
        }, { ...defaultValues });
    };



    return <>
        <div
            id="defaultSystemTab"
            onClick={()=> {
                setActiveTab("defaultSystemTab");
            }}
        >
            <div className="pageTitle">
                <h2>Default System Generated Emails </h2>
            </div>
            <div className="generalsetting_inner d-block">
                <Accordion>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Pre Start Email</Accordion.Header>
                        <Accordion.Body>
                            <div className="d-flex justify-content-end mb-md-3 mb-2">
                                <Link
                                    href="#!"
                                    className="link-primary d-flex align-items-center"
                                    onClick={emailShow}
                                >
                                    <OverlayTrigger
                                        overlay={
                                            <Tooltip id="tooltip-disabled">
                                                {" "}
                                                Copy From Resource Email Templates
                                            </Tooltip>
                                        }
                                    >
                                        <span className="d-flex align-items-center">
                                            <em
                                                disabled
                                                style={{ pointerEvents: "none" }}
                                                className="icon-info-circle me-1"
                                            />
                                        </span>
                                    </OverlayTrigger>
                                    Search and Add from Resource
                                </Link>
                            </div>
                            <Formik
                                enableReinitialize
                                initialValues={{ ...getMappedInitialValues(initialData).preStartEmail }}
                                validationSchema={getSchema("preStartEmail")}
                                onSubmit={(values) => {
                                    saveEmailContent({
                                        ...values,
                                        mail_type: 'PreStart',
                                    });
                                }}
                            >
                                {({
                                    errors,
                                    touched,
                                    handleChange,
                                    handleBlur,
                                    handleSubmit,
                                    setFieldValue,
                                    values
                                }) => (
                                    <form onSubmit={handleSubmit}>
                                        <Form.Group className="form-group mb-3">
                                            <Form.Label>
                                                Email Subject Line <sup>*</sup>
                                            </Form.Label>
                                            <InputField
                                                name="content1"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                type="text"
                                                placeholder="Email Subject Line"
                                                value={values.content1}

                                            />
                                            {errors.content1 && touched.content1 && (
                                                <div className="text-danger">
                                                    {errors.content1}
                                                </div>
                                            )}
                                        </Form.Group>

                                        <Form.Group className="form-group mb-3">
                                            <Form.Label>Header Graphic</Form.Label>
                                            <Form.Label className="form-label d-inline-block">
                                                <span className="text-danger d-inline-block">
                                                    Note:
                                                </span>
                                                {`"Please make sure the size of the image that you
                                    might upload here be 660 X 100 pixels, in order
                                    that it renders correctly in Mail."`}
                                            </Form.Label>
                                            <TextEditor
                                                value={values.content2}
                                                onChange={(e) => {
                                                    setFieldValue("content2", e);
                                                }} />
                                            <span>
                                                The System Based Greeting will be inserted here
                                                (i.e., Dear First and last Name)
                                            </span>
                                        </Form.Group>
                                        <Form.Group className="form-group mb-3">
                                            <Form.Label>Email Content</Form.Label>
                                            <TextEditor
                                                value={values.content3}
                                                onChange={(e) => {
                                                    setFieldValue("content3", e);
                                                }}
                                            />
                                        </Form.Group>
                                        <div className="d-flex justify-content-end mt-3">
                                            <Button type="submit" variant="primary" className="ripple-effect">
                                                {" "}
                                                Save
                                            </Button>
                                        </div>
                                    </form>
                                )}

                            </Formik>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>Assign Email</Accordion.Header>
                        <Accordion.Body>
                            <div className="d-flex justify-content-end mb-md-3 mb-2">
                                <Link
                                    href="#!"
                                    className="link-primary d-flex align-items-center"
                                    onClick={emailShow}
                                >
                                    <OverlayTrigger
                                        overlay={
                                            <Tooltip id="tooltip-disabled">
                                                {" "}
                                                Copy From Resource Email Templates
                                            </Tooltip>
                                        }
                                    >
                                        <span className="d-flex align-items-center">
                                            <em
                                                disabled
                                                style={{ pointerEvents: "none" }}
                                                className="icon-info-circle me-1"
                                            />
                                        </span>
                                    </OverlayTrigger>
                                    Search and Add from Resource
                                </Link>
                            </div>
                            <Formik
                                enableReinitialize
                                initialValues={{ ...getMappedInitialValues(initialData).assignEmail }}
                                validationSchema={getSchema("assignEmail")}
                                onSubmit={(values) => {
                                    saveEmailContent({
                                        ...values,
                                        mail_type: 'Assign',
                                    });
                                }}
                            >
                                {({
                                    errors,
                                    touched,
                                    handleChange,
                                    handleBlur,
                                    handleSubmit,
                                    setFieldValue,
                                    values
                                }) => (
                                    <form onSubmit={handleSubmit}>
                                        <Form.Group className="form-group mb-3">
                                            <Form.Label>
                                                Email Subject Line <sup>*</sup>
                                            </Form.Label>
                                            <InputField
                                                name="content1"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                type="text"
                                                placeholder="Email Subject Line"
                                                value={values.content1}
                                            />
                                            {errors.content1 && touched.content1 && (
                                                <div className="text-danger">
                                                    {errors.content1}
                                                </div>
                                            )}
                                        </Form.Group>

                                        <Form.Group className="form-group mb-3">
                                            <Form.Label>Header Graphic</Form.Label>
                                            <Form.Label className="form-label d-inline-block">
                                                <span className="text-danger d-inline-block">
                                                    Note:
                                                </span>
                                                {`"Please make sure the size of the image that you
                                    might upload here be 660 X 100 pixels, in order
                                    that it renders correctly in Mail."`}
                                            </Form.Label>
                                            <TextEditor
                                                value={values.content2}
                                                onChange={(e) => {
                                                    setFieldValue("content2", e);
                                                }}
                                            />
                                            <span>
                                                The System Based Greeting will be inserted here
                                                (i.e., Dear First and last Name)
                                            </span>
                                        </Form.Group>
                                        <Form.Group className="form-group mb-3">
                                            <Form.Label>Pre-Credential Content</Form.Label>
                                            <TextEditor
                                                value={values.content3}
                                                onChange={(e) => {
                                                    setFieldValue("content3", e);
                                                }}
                                            />
                                            <span>
                                                {`The users or participant's system-based login
                                    credentials will be inserted here. `}
                                            </span>
                                        </Form.Group>
                                        <Form.Group className="form-group mb-3">
                                            <Form.Label>Pre-Credential Content</Form.Label>
                                            <TextEditor
                                                value={values.content4}
                                                onChange={(e) => {
                                                    setFieldValue("content4", e);
                                                }}
                                            />
                                        </Form.Group>
                                        <div className="d-flex justify-content-end mt-3">
                                            <Button type="submit" variant="primary" className="ripple-effect">
                                                {" "}
                                                Save
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </Formik>

                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2">
                        <Accordion.Header>Reminder Email</Accordion.Header>
                        <Accordion.Body>
                            <div className="d-flex justify-content-end mb-md-3 mb-2">
                                <Link
                                    href="#!"
                                    className="link-primary d-flex align-items-center"
                                    onClick={emailShow}
                                >
                                    <OverlayTrigger
                                        overlay={
                                            <Tooltip id="tooltip-disabled">
                                                {" "}
                                                Copy From Resource Email Templates
                                            </Tooltip>
                                        }
                                    >
                                        <span className="d-flex align-items-center">
                                            <em
                                                disabled
                                                style={{ pointerEvents: "none" }}
                                                className="icon-info-circle me-1"
                                            />
                                        </span>
                                    </OverlayTrigger>
                                    Search and Add from Resource
                                </Link>
                            </div>
                            <Formik
                                enableReinitialize
                                initialValues={{ ...getMappedInitialValues(initialData).reminderEmail }}
                                validationSchema={getSchema("reminderEmail")}
                                onSubmit={(values) => {
                                    saveEmailContent({
                                        ...values,
                                        mail_type: 'Reminder',
                                    });
                                }}
                            >
                                {({
                                    errors,
                                    touched,
                                    handleChange,
                                    handleBlur,
                                    handleSubmit,
                                    setFieldValue,
                                    values,
                                }) => (
                                    <form onSubmit={handleSubmit}>
                                        <Form.Group className="form-group mb-3">
                                            <Form.Label>
                                                Email Subject Line <sup>*</sup>
                                            </Form.Label>
                                            <InputField
                                                name="content1"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                type="text"
                                                placeholder="Email Subject Line"
                                                value={values.content1}
                                            />
                                            {errors.content1 && touched.content1 && (
                                                <div className="text-danger">
                                                    {errors.content1}
                                                </div>
                                            )}
                                        </Form.Group>

                                        <Form.Group className="form-group mb-3">
                                            <Form.Label>Header Graphic</Form.Label>
                                            <Form.Label className="form-label d-inline-block">
                                                <span className="text-danger d-inline-block">
                                                    Note:
                                                </span>
                                                {`"Please make sure the size of the image that you
                                    might upload here be 660 X 100 pixels, in order
                                    that it renders correctly in Mail."`}
                                            </Form.Label>
                                            <TextEditor
                                                value={values.content2}
                                                onChange={(e) => {
                                                    setFieldValue("content2", e);
                                                }}
                                            />
                                            <span>
                                                The System Based Greeting will be inserted here
                                                (i.e., Dear First and last Name)
                                            </span>
                                        </Form.Group>
                                        <Form.Group className="form-group mb-3">
                                            <Form.Label>Email Content</Form.Label>
                                            <TextEditor
                                                value={values.content3}
                                                onChange={(e) => {
                                                    setFieldValue("content3", e);
                                                }}
                                            />
                                        </Form.Group>
                                        <div className="d-flex justify-content-end mt-3">
                                            <Button type="submit" variant="primary" className="ripple-effect">
                                                {" "}
                                                Save
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </Formik>

                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="3">
                        <Accordion.Header>Thank You</Accordion.Header>
                        <Accordion.Body>
                            <div className="d-flex justify-content-end mb-md-3 mb-2">
                                <Link
                                    href="#!"
                                    className="link-primary d-flex align-items-center mb-2"
                                    onClick={emailShow}
                                >
                                    <OverlayTrigger
                                        overlay={
                                            <Tooltip id="tooltip-disabled">
                                                {" "}
                                                Copy From Resource Email Templates
                                            </Tooltip>
                                        }
                                    >
                                        <span className="d-flex align-items-center">
                                            <em
                                                disabled
                                                style={{ pointerEvents: "none" }}
                                                className="icon-info-circle me-1"
                                            />
                                        </span>
                                    </OverlayTrigger>
                                    Search and Add from Resource
                                </Link>
                            </div>
                            <Formik
                                enableReinitialize
                                initialValues={{ ...getMappedInitialValues(initialData).thankYouEmail }}
                                validationSchema={getSchema("thankYouEmail")}
                                onSubmit={(values) => {
                                    saveEmailContent({
                                        ...values,
                                        mail_type: 'ThankYou',
                                    });
                                }}
                            >
                                {({
                                    errors,
                                    touched,
                                    handleChange,
                                    handleBlur,
                                    handleSubmit,
                                    setFieldValue,
                                    values,
                                }) => (
                                    <form onSubmit={handleSubmit}>
                                        <Form.Group className="form-group mb-3">
                                            <Form.Label>
                                                Email Subject Line <sup>*</sup>
                                            </Form.Label>
                                            <InputField
                                                name="content1"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                type="text"
                                                placeholder="Email Subject Line"
                                                value={values.content1}
                                            />
                                            {errors.content1 && touched.content1 && (
                                                <div className="text-danger">
                                                    {errors.content1}
                                                </div>
                                            )}
                                        </Form.Group>

                                        <Form.Group className="form-group mb-3">
                                            <Form.Label>Header Graphic</Form.Label>
                                            <Form.Label className="form-label d-inline-block">
                                                <span className="text-danger d-inline-block">
                                                    Note:
                                                </span>
                                                {`"Please make sure the size of the image that you
                                    might upload here be 660 X 100 pixels, in order
                                    that it renders correctly in Mail."`}
                                            </Form.Label>
                                            <TextEditor
                                                value={values.content2}
                                                onChange={(e) => {
                                                    setFieldValue("content2", e);
                                                }}
                                            />
                                            <span>
                                                The System Based Greeting will be inserted here
                                                (i.e., Dear First and last Name)
                                            </span>
                                        </Form.Group>
                                        <Form.Group className="form-group mb-3">
                                            <Form.Label>Email Content</Form.Label>
                                            <TextEditor
                                                value={values.content3}
                                                onChange={(e) => {
                                                    setFieldValue("content3", e);
                                                }}
                                            />
                                        </Form.Group>
                                        <div className="d-flex justify-content-end mt-3">
                                            <Button type="submit" variant="primary" className="ripple-effect">
                                                {" "}
                                                Save
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </Formik>

                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="4">
                        <Accordion.Header>Email Footer</Accordion.Header>
                        <Accordion.Body>
                            <Formik
                                enableReinitialize
                                initialValues={{ ...getMappedInitialValues(initialData).emailFooter }}
                                validationSchema={getSchema("emailFooter")}
                                onSubmit={(values) => {
                                    saveEmailContent({
                                        ...values,
                                        mail_type: 'Footer',
                                    });
                                }}
                            >
                                {({
                                    handleSubmit,
                                    setFieldValue,
                                    values,
                                }) => (
                                    <form onSubmit={handleSubmit}>
                                        <Form.Group className="form-group mb-3">
                                            <Form.Label className="form-label d-inline-block">
                                                <span className="text-danger d-inline-block">
                                                    Note:
                                                </span>
                                                {`"Please make sure the size of the image that you
                                    might upload here be 660 X 100 pixels, in order
                                    that it renders correctly in Mail."`}
                                            </Form.Label>
                                            <TextEditor
                                                value={values.content1}
                                                onChange={(e) => {
                                                    setFieldValue("content1", e);
                                                }}
                                            />
                                        </Form.Group>
                                        <div className="d-flex justify-content-end mt-3">
                                            <Button type="submit" variant="primary" className="ripple-effect">
                                                {" "}
                                                Save
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </Formik>

                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </div>
        </div>
    </>
}
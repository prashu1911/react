import { Button, InputField, ModalComponent, SweetAlert, TextEditor } from "components";
import { Link } from "react-router-dom";
import { Accordion, Form, Spinner } from "react-bootstrap";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Formik } from "formik";
import toast from "react-hot-toast";
import { commonService } from "services/common.service";
import { DEFAULT_SETTINGS } from "apiEndpoints/DefaultSettings";
import validationSchema from "./validation";

export default function FAQ({
    setActiveTab,
    activeTab,
    userData,
    selectedCompany,
    faqData,
    contactData,
}) {
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [deleteType, setDeleteType] = useState(null);
    const [faqList, setFaqList] = useState([]);
    const [contactList, setContactList] = useState([]);
    const [currentFaq, setCurrentFaq] = useState(null);
    const [currentContact, setCurrentContact] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showFaqModal, setShowFaqModal] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);

    const defaultValues = {
        title: "",
        description: "",
    };

    const faqInitialValues = useMemo(() => {
        if (currentFaq && typeof currentFaq === 'object') {
            return {
                title: currentFaq.content1 ?? defaultValues.title,
                description: currentFaq.content2 ?? defaultValues.description
            };
        }
        return defaultValues;
    }, [currentFaq]);

    const contactInitialValues = useMemo(() => {
        if (currentContact && typeof currentContact === 'object') {
            return {
                title: currentContact.content1 ?? defaultValues.title,
                description: currentContact.content2 ?? defaultValues.description
            };
        }
        return defaultValues;
    }, [currentContact]);

    useEffect(() => {
        if (faqData && faqData?.faq_content) {
            try {
                const parseData = JSON.parse(faqData?.faq_content);
                setFaqList(Array.isArray(parseData) ? parseData : []);
            } catch (error) {
                console.error("Error parsing FAQ data:", error);
                setFaqList([]);
            }
        }
    }, [faqData]);

    useEffect(() => {
        if (contactData && contactData?.contact_content) {
            try {
                const parseData = JSON.parse(contactData?.contact_content);
                setContactList(Array.isArray(parseData) ? parseData : []);
            } catch (error) {
                console.error("Error parsing contact data:", error);
                setContactList([]);
            }
        }
    }, [contactData]);

    const updateListByIndex = useCallback((data, oldData, isFaq = true) => {
        const setListFunc = isFaq ? setFaqList : setContactList;

        setListFunc((prevList) => {
            if (oldData) {
                const updated = [...prevList];
                updated[oldData.index] = data;
                return updated;
            }
            return [...prevList, data];
        });
    }, []);

    const removeByIndex = useCallback((index, isFaq = true) => {
        const setListFunc = isFaq ? setFaqList : setContactList;
        const getListFunc = isFaq ? faqList : contactList;

        const updatedList = [...getListFunc];
        updatedList.splice(index, 1);
        setListFunc(updatedList);
    }, [faqList, contactList]);

    const addEditItem = useCallback(async (values, isFaq = true) => {
        const { companyMasterID, apiToken } = userData || {};
        const companyId = selectedCompany?.value;

        if (!companyId) {
            toast.error("Please select a company first");
            return;
        }

        setLoading(true);

        try {
            const current = isFaq ? currentFaq : currentContact;
            const isEdit = Boolean(current);

            const apiEndPoint = isFaq
                ? (isEdit ? DEFAULT_SETTINGS.updateFaq : DEFAULT_SETTINGS.addFaq)
                : (isEdit ? DEFAULT_SETTINGS.updateContact : DEFAULT_SETTINGS.addContact);

            const bodyData = {
                company_master_id: companyMasterID,
                company_id: companyId,
                ...values,
                ...(isEdit && { get_index: current.index }),
            };

            await commonService({
                apiEndPoint,
                bodyData,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiToken}`,
                },
            });

            const formattedData = {
                content1: values.title,
                content2: values.description,
            };

            updateListByIndex(formattedData, current, isFaq);
            toast.success(`${isFaq ? "FAQ" : "Contact"} ${isEdit ? "updated" : "added"} successfully`);

            if (isFaq) {
                setShowFaqModal(false);
                setCurrentFaq(null);
            } else {
                setShowContactModal(false);
                setCurrentContact(null);
            }
        } catch (error) {
            console.error(`Failed to save ${isFaq ? "FAQ" : "Contact"} content:`, error);
            toast.error("Something went wrong...");
        } finally {
            setLoading(false);
        }
    }, [currentFaq, currentContact, userData, selectedCompany, updateListByIndex]);

    const deleteItem = useCallback(async () => {
        const { companyMasterID, apiToken } = userData || {};
        const companyId = selectedCompany?.value;

        if (!companyId) {
            toast.error("Please select a company first");
            return false;
        }

        const isFaq = deleteType === 'faq';
        const current = isFaq ? currentFaq : currentContact;

        if (!current) {
            toast.error("No item selected for deletion");
            return false;
        }

        try {
            const bodyData = {
                company_master_id: companyMasterID,
                company_id: companyId,
                get_index: current.index,
            };

            await commonService({
                apiEndPoint: isFaq ? DEFAULT_SETTINGS.deleteFaq : DEFAULT_SETTINGS.deleteContact,
                bodyData,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiToken}`,
                },
            });

            removeByIndex(current.index, isFaq);

            if (isFaq) {
                setCurrentFaq(null);
            } else {
                setCurrentContact(null);
            }

            setDeleteType(null);
            return true;
        } catch (error) {
            console.error(`Failed to delete ${isFaq ? "FAQ" : "Contact"} content:`, error);
            toast.error("Something went wrong...");
            return false;
        }
    }, [currentFaq, currentContact, deleteType, userData, selectedCompany, removeByIndex]);

    const handleConfirmDelete = useCallback(() => {
        return deleteItem();
    }, [deleteItem]);

    const prepareForDeletion = useCallback((item, type) => {
        if (type === 'faq') {
            setCurrentFaq(item);
            setCurrentContact(null);
        } else {
            setCurrentContact(item);
            setCurrentFaq(null);
        }
        setDeleteType(type);
        setIsAlertVisible(true);
    }, []);

    return (
        <>
            <div
                id="faqHelpTab"
                onClick={()=> {
                    setActiveTab("faqHelpTab");
                }}
            >
                <div className="pageTitle">
                    <h2>FAQ And Help Contact Settings</h2>
                </div>
                <div className="generalsetting_inner d-block">
                    <Accordion>
                        {/* FAQ Section */}
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>FAQ</Accordion.Header>
                            <Accordion.Body>
                                <div className="d-flex justify-content-end mb-md-3 mb-2">
                                    <Link
                                        href="#!"
                                        className="link-primary"
                                        onClick={() => {
                                            setCurrentFaq(null);
                                            setShowFaqModal(true);
                                        }}
                                    >
                                        Add New FAQ
                                    </Link>
                                </div>
                                {faqList && faqList.length > 0 ? (
                                    faqList.map((item, index) => (
                                        <Accordion key={`faq-${index}`} className="innerAccordion">
                                            <Accordion.Item eventKey="0">
                                                <Accordion.Header>
                                                    <span className="d-flex flex-1 me-2">
                                                        {item?.content1}
                                                    </span>
                                                    <span className="d-flex gap-2 lh-1">
                                                        <Link
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setCurrentFaq({ ...item, index });
                                                                setShowFaqModal(true);
                                                            }}
                                                        >
                                                            <em className="icon-edit" />
                                                        </Link>
                                                        <Link
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                prepareForDeletion({ ...item, index }, 'faq');
                                                            }}
                                                        >
                                                            <em className="icon-delete" />
                                                        </Link>
                                                    </span>
                                                </Accordion.Header>
                                                <Accordion.Body
                                                 // eslint-disable-next-line react/no-danger
                                                    dangerouslySetInnerHTML={{
                                                        __html: item?.content2,
                                                    }}
                                                />
                                            </Accordion.Item>
                                        </Accordion>
                                    ))
                                ) : (
                                    <p className="text-center">No FAQ found</p>
                                )}
                            </Accordion.Body>
                        </Accordion.Item>

                        {/* Help Contact Section */}
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>Help Contact</Accordion.Header>
                            <Accordion.Body>
                                <div className="d-flex justify-content-end mb-md-3 mb-2">
                                    <Link
                                        href="#!"
                                        className="link-primary"
                                        onClick={() => {
                                            setCurrentContact(null);
                                            setShowContactModal(true);
                                        }}
                                    >
                                        Add New Help Contact
                                    </Link>
                                </div>
                                {contactList && contactList.length > 0 ? (
                                    contactList.map((item, index) => (
                                        <Accordion key={`contact-${index}`} className="innerAccordion">
                                            <Accordion.Item eventKey={`c-${index}`}>
                                                <Accordion.Header>
                                                    <span className="d-flex flex-1 me-2">
                                                        {item?.content1}
                                                    </span>
                                                    <span className="d-flex gap-2 lh-1">
                                                        <Link
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setCurrentContact({ ...item, index });
                                                                setShowContactModal(true);
                                                            }}
                                                        >
                                                            <em className="icon-edit" />
                                                        </Link>
                                                        <Link
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                prepareForDeletion({ ...item, index }, 'contact');
                                                            }}
                                                        >
                                                            <em className="icon-delete" />
                                                        </Link>
                                                    </span>
                                                </Accordion.Header>
                                                <Accordion.Body
                                                 // eslint-disable-next-line react/no-danger
                                                    dangerouslySetInnerHTML={{
                                                        __html: item?.content2,
                                                    }}
                                                />
                                            </Accordion.Item>
                                        </Accordion>
                                    ))
                                ) : (
                                    <p className="text-center">No help contacts found</p>
                                )}
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </div>
            </div>

            {/* FAQ Modal */}
            <ModalComponent
                modalHeader={`${currentFaq ? "Edit" : "Add"} FAQ`}
                show={showFaqModal}
                onHandleCancel={() => {
                    setShowFaqModal(false);
                    setCurrentFaq(null);
                }}
            >
                <Formik
                    enableReinitialize
                    initialValues={faqInitialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values) => addEditItem(values, true)}
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
                                    Title<sup>*</sup>
                                </Form.Label>
                                <InputField
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    name='title'
                                    type="text"
                                    placeholder="FAQ Title"
                                    value={values.title}
                                />
                                {errors.title && touched.title && (
                                    <div className="text-danger">
                                        {errors.title}
                                    </div>
                                )}
                            </Form.Group>
                            <Form.Group className="form-group mb-3">
                                <Form.Label>
                                    Description<sup>*</sup>
                                </Form.Label>
                                <TextEditor
                                    value={values.description}
                                    onChange={(e) => {
                                        setFieldValue("description", e);
                                    }}
                                />
                                {errors.description && touched.description && (
                                    <div className="text-danger">
                                        {errors.description}
                                    </div>
                                )}
                            </Form.Group>
                            <div className="form-btn d-flex justify-content-end">
                                <Button disabled={loading} type="submit" variant="primary" className="ripple-effect">
                                    {currentFaq ? "Update" : "Add FAQ"} {loading && <Spinner className="ms-2" animation="border" size="sm" />}
                                </Button>
                            </div>
                        </form>
                    )}
                </Formik>
            </ModalComponent>

            {/* Contact Modal */}
            <ModalComponent
                modalHeader={`${currentContact ? "Edit" : "Add"} Help Contact`}
                show={showContactModal}
                onHandleCancel={() => {
                    setShowContactModal(false);
                    setCurrentContact(null);
                }}
            >
                <Formik
                    enableReinitialize
                    initialValues={contactInitialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values) => addEditItem(values, false)}
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
                                    Title<sup>*</sup>
                                </Form.Label>
                                <InputField
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    name='title'
                                    type="text"
                                    placeholder="Contact Title"
                                    value={values.title}
                                />
                                {errors.title && touched.title && (
                                    <div className="text-danger">
                                        {errors.title}
                                    </div>
                                )}
                            </Form.Group>
                            <Form.Group className="form-group mb-3">
                                <Form.Label>
                                    Description<sup>*</sup>
                                </Form.Label>
                                <TextEditor
                                    value={values.description}
                                    onChange={(e) => {
                                        setFieldValue("description", e);
                                    }}
                                />
                                {errors.description && touched.description && (
                                    <div className="text-danger">
                                        {errors.description}
                                    </div>
                                )}
                            </Form.Group>
                            <div className="form-btn d-flex justify-content-end">
                                <Button disabled={loading} type="submit" variant="primary" className="ripple-effect">
                                    {currentContact ? "Update" : "Add Contact"} {loading && <Spinner className="ms-2" animation="border" size="sm" />}
                                </Button>
                            </div>
                        </form>
                    )}
                </Formik>
            </ModalComponent>

            {/* Confirmation Alert for Deletion */}
            <SweetAlert
                title="Are you sure?"
                text={`You want to delete this ${deleteType === 'faq' ? 'FAQ' : 'Help Contact'}!`}
                show={isAlertVisible}
                icon="warning"
                onConfirmAlert={handleConfirmDelete}
                showCancelButton
                cancelButtonText="Cancel"
                confirmButtonText="Yes"
                setIsAlertVisible={setIsAlertVisible}
                isConfirmedTitle="Deleted!"
                isConfirmedText={`Your ${deleteType === 'faq' ? 'FAQ' : 'Help Contact'} has been deleted.`}
            />
        </>
    );
}
import React, {useEffect, useState} from "react";
import {Button, Col, Form, Row} from "react-bootstrap";
import {Link, useLocation} from "react-router-dom";
import {RESOURSE_MANAGEMENT} from "apiEndpoints/ResourseManagement";
import {useAuth} from "customHooks";
import * as Yup from "yup";
import {ErrorMessage, Field, Formik, Form as FormikForm} from "formik";
// eslint-disable-next-line import/no-extraneous-dependencies
import debounce from "lodash.debounce";
// import CsvDownloader from "react-csv-downloader";
import ExportExcel from "components/Excel";
import {commonService} from "services/common.service";
import {stripHtml} from "utils/common.util";
import logger from "utils/logger";
import {
    BasicAlert,
    InputField,
    ModalComponent,
    ReactDataTable,
    SelectField,
    SweetAlert,
} from "../../../../components";
import adminRouteMap from "../../../../routes/Admin/adminRouteMap";
import toast from "react-hot-toast";

export default function SurveysTemplates({companyOptions, searchOptions, selectedCompany, onCompanyChange}) {
    // start alert modal
    const location = useLocation();
    const {getloginUserData} = useAuth();
    const userData = getloginUserData();
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState(null);
    const [alertMassage, setAlertMassage] = useState(null);
    // const [selectedCompany, setSelectedCompany] = useState(null);

    // review Edit Modal
    const [surveyEditTemp, setSurveyEditTemp] = useState(false);
    const surveyEditClose = () => setSurveyEditTemp(false);
    const surveyEditShow = () => setSurveyEditTemp(true);
    const [searchFormData, setSearchFormData] = useState([]);
    const [surveyTypeData, setSurveyTypeData] = useState([]);
    const [templateDataList, setTemplateDataList] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [deleteAssessmentData, setDeleteAssessmentData] = useState(null);
    const [sortDirection, setSortDirection] = useState("asc");
    const [tableLoader, setTableLoader] = useState(false);
    const [handleSearchSubmitting, setHandleSearchSubmitting] = useState(false);
    const [prevStart, setPrevStart] = useState(0);
    const assessmentData = location?.state?.assessmentData || null;
    const [formData, setFormData] = useState({
        companyMasterID: userData?.companyMasterID || null,
        companyID: selectedCompany || null,
        searchFrom: null,
        surveyTypeID: null,
        keywords: "",
    });
    const [tableState, setTableState] = useState({
        draw: 1,
        start: 0,
        length: 10,
        order: [{column: 0, dir: "asc"}],
    });
    const [totalRecords, setTotalRecords] = useState(0);
    const [communityData, setCommunityData] = useState([]);
    const [rowData, setRowData] = useState();
    const deleteModal = (raw) => {
        setAlertType("delete");
        setIsAlertVisible(true);
        setDeleteAssessmentData(raw);
    };
    const initialValues = {
        toCompanyID: "",
        surveyName: `Clone - ${rowData?.assessmentName}`,
        sourceType: "SURVEY",
        buttonType: "EDIT",
    };
    const addValidationSchema = Yup.object().shape({
        surveyName: Yup.string()
        .required("Survey name is required")
        .min(1, "Survey name is required"),
        toCompanyID: Yup.string().required("Company is required"),
    });

    // Update formData when selectedCompany prop changes
    useEffect(() => {
        if (selectedCompany) {
            setFormData(prev => ({
                ...prev,
                companyID: selectedCompany
            }));
        }
    }, [selectedCompany]);

    const getSearchFormData = async () => {
        try {
            const response = await commonService({
                apiEndPoint: RESOURSE_MANAGEMENT.getSearchFormDataForTemplate,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userData?.apiToken}`,
                },
            });
            if (response?.status) {
                setSearchFormData(
                    Object?.values(response?.data?.data)?.map((company) => ({
                        value: company?.libraryElementID,
                        label: stripHtml(company?.value),
                    }))
                );

                if (
                    Array.isArray(response?.data?.data) &&
                    response?.data?.data.length > 0
                ) {
                    const formId = response?.data?.data[0].libraryElementID ? parseInt(response?.data?.data[0].libraryElementID) : null
                    setFormData((prev) => ({
                        ...prev,
                        searchFrom: formId,
                    }));
                } else {
                    setFormData((prev) => ({...prev, searchFrom: null}));
                }
            }
        } catch (error) {
            logger(error);
        }
    };
    const getSurveyTypeData = async () => {
        try {
            const response = await commonService({
                apiEndPoint: RESOURSE_MANAGEMENT.getSurveyTypeDataForTemplate,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userData?.apiToken}`,
                },
            });
            if (response?.status) {
                setSurveyTypeData(
                    Object?.values(response?.data?.data?.surveyType)?.map((company) => ({
                        value: company?.libraryElementID,
                        label: stripHtml(company?.value),
                    }))
                );
            }
        } catch (error) {
            logger(error);
        }
    };
    const getCommunityData = async () => {
        if (
            !(formData.companyMasterID && formData.companyID && formData?.searchFrom)
        ) {
            return false;
        }
        try {
            const response = await commonService({
                apiEndPoint: RESOURSE_MANAGEMENT.getCommunityData,
                queryParams: {
                    companyMasterID: formData.companyMasterID,
                    companyID: formData.companyID,
                    libraryElementID: formData.searchFrom,
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
                        label: stripHtml(company?.communityName),
                    }))
                );
            }
        } catch (error) {
            logger(error);
        }
    };
    const getTemplateDataList = async () => {
        setHandleSearchSubmitting(true);
        setTableLoader(true);
        if (!(formData.companyMasterID && formData.companyID)) {
            setHandleSearchSubmitting(false);
            setTableLoader(false);
            return false;
        }
        try {
            const response = await commonService({
                apiEndPoint: RESOURSE_MANAGEMENT.getTemplateDataList,
                bodyData: {
                    companyMasterID: userData.companyMasterID,
                    companyID: formData.companyID,
                    surveyTypeID: formData.surveyTypeID,
                    searchFrom: formData.searchFrom,
                    keywords: formData.keywords,
                    search: {
                        value: searchValue || "",
                        regex: false,
                    },
                    ...tableState,
                    isExport: false,
                },
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userData?.apiToken}`,
                },
            });

            if (response?.status) {
                setTemplateDataList(response?.data?.data);
                // setTotalRecords(
                //     response?.data?.recordsTotal || response?.data?.recordsFiltered || 0
                // );
                  setTotalRecords(
                    searchValue 
                        ? (response?.data?.recordsFiltered || 0) 
                        : (response?.data?.recordsTotal || 0)
                    ); // Fix pagination issue
            }
        } catch (error) {
            logger(error);
        }
        setHandleSearchSubmitting(false);
        setTableLoader(false);
    };
    // Function to get all data in CSV
    const fetchAllTemplateDataForCSV = async () => {
        const {companyMasterID, companyID, surveyTypeID, searchFrom, keywords} =
            formData;
        if (!companyMasterID || !companyID || !searchFrom) {
            return [];
        }
        try {
            const response = await commonService({
                apiEndPoint: RESOURSE_MANAGEMENT.getTemplateDataList,
                bodyData: {
                    companyMasterID,
                    companyID,
                    surveyTypeID,
                    searchFrom,
                    keywords: keywords || "",
                    search: {
                        value: searchValue || "",
                        regex: false,
                    },
                    start: 0, // Fetch all
                    length: -1, // Fetch all
                    order: tableState.order,
                    isExport: true,
                },
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userData?.apiToken}`,
                },
            });
            if (response?.status) {
                return response?.data?.data || [];
            }
            return [];
        } catch (error) {
            logger(error);
            return [];
        }
    };
    const handleCompanyChange = async (selectedOption) => {
        const value = selectedOption ? selectedOption.value : null;
        onCompanyChange(selectedOption);
        setFormData(prev => ({
            ...prev,
            companyID: value
        }));
    };
    // const handleToCompanyChange = async (selectedOption) => {
    //   if (selectedOption?.value) {
    //     settoCompanyID(selectedOption?.value);
    //   }
    // };
    const handleToCompanyChange = (selectedOption, setFieldValue) => {
        setFieldValue("toCompanyID", selectedOption?.value || ""); // Update Formik state
    };
    const handleSearchFormChange = (selectedOption) => {
        setFormData((prev) => ({
            ...prev,
            searchFrom: Number(selectedOption?.value),
        }));
    };
    const handleServeyTypeChange = (selectedOption) => {
        setFormData((prev) => ({
            ...prev,
            surveyTypeID: Number(selectedOption?.value),
        }));
    };
    const handleKeywordTypeChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            keywords: e.target.value, // Update the `keywords` field in `formData`
        }));
    };
    const handleCommunityChange = (selectedOption) => {
        setFormData((prev) => ({
            ...prev,
            communityData: Number(selectedOption?.value),
        }));
    };
    const handleLimitChange = (value) => {
        setTableState((prev) => ({
            ...prev,
            length: parseInt(value),
            start: 0,
            draw: prev.draw + 1,
        }));
    };

    const handleSearchChange = debounce((e) => {
        setSearchValue(e.target.value);
        setTableState((prev) => ({
            ...prev,
            start: e.target.value ? 0 : prevStart,
            draw: prev.draw + 1,
        }));
    }, 500);
    const handleOffsetChange = (page) => {
        setTableState((prev) => {
            const newStart = (page - 1) * prev.length;
            setPrevStart(newStart);
            return {
                ...prev,
                start: newStart,
                draw: prev.draw + 1,
            };
        });
    };
    const columnIdMap = {
        assessmentName: 0,
        keywords: 1
    };
    const handleSort = (column) => {
        // Toggle direction if clicking same column
        const newDirection =
            tableState.order[0].column === columnIdMap[column]
                ? tableState.order[0].dir === "asc"
                ? "desc"
                : "asc"
                : "asc";

        setSortDirection(newDirection);
        setTableState((prev) => ({
            ...prev,
            order: [
                {
                    column: columnIdMap[column] || 0, // Default to 0 if column not found
                    dir: newDirection,
                },
            ],
            draw: prev.draw + 1,
        }));
    };
    const deleteAssessmentById = async () => {
        const {communityAssessmentID} = deleteAssessmentData;
        try {
            if (!communityAssessmentID) {
                return false;
            }
            const response = await commonService({
                apiEndPoint: RESOURSE_MANAGEMENT.deleteTemplateData,
                bodyData: {communityAssessmentID},
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userData?.apiToken}`,
                },
            });
            if (response?.status) {
                getTemplateDataList();
            }
        } catch (error) {
            logger(error);
        }
    };
    const onConfirmAlertModal = () => {
        setIsAlertVisible(false);
        deleteAssessmentById();
        return true;
    };
    const onConfirmSharedModal = () => {
        setIsAlertVisible(false);
        return true;
    };
    const copyQuestionModal = (row) => {
        if (!formData?.companyID) {
            setAlertType("error");
        } else {
            setAlertType("copyQuestion");
        }
        setIsAlertVisible(true);
        setRowData(row);
    };
    const copyQueToAnotherModal = (row) => {
        if (!formData?.companyID) {
            setAlertType("error");
        } else {
            setAlertType("copyToAnotherQuestion");
        }
        setIsAlertVisible(true);
        setRowData(row);
    };
    const handleCopyResponseBlock = async (assessmentName) => {
        if (!assessmentName) {
            toast.error("Assessment name cannot be empty", {toastId: "error001"});
            setAlertType(null);
            setIsAlertVisible(false);
            return false;
        }
        try {
            const response = await commonService({
                apiEndPoint: RESOURSE_MANAGEMENT.copyResponseTemplateToMyresource,
                bodyData: {
                    communityAssessmentID: parseInt(rowData?.communityAssessmentID),
                    companyID: parseInt(formData?.companyID),
                    companyMasterID: parseInt(userData?.companyMasterID),
                    surveyName: assessmentName || "",
                },
                isToast: false,
                toastType: {success: true, error: true},
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userData?.apiToken}`,
                },
            });
            if (response?.status) {
                getTemplateDataList();
                return true;
            }
        } catch (error) {
            logger(error);
        }
        return false;
    };
    const handleSubmit = async (values) => {
        if (!(values && formData?.companyID)) {
            return false;
        }
        const data = {
            ...values,
            toCompanyID: parseInt(values?.toCompanyID),
            fromCompanyID: parseInt(formData?.companyID),
            surveyID: parseInt(rowData?.communityAssessmentID),
        };
        try {
            const response = await commonService({
                apiEndPoint: RESOURSE_MANAGEMENT.copyResponseTemplateToAnotherResource,
                bodyData: data,
                toastType: {success: true, error: true},
                // isToast: false,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userData?.apiToken}`,
                },
            });
            if (response?.status) {
                getTemplateDataList();
                setIsAlertVisible(false);
                return true;
            }
        } catch (error) {
            logger(error);
        }
        setIsAlertVisible(false);
        return false;
    };
    const columns = [
        {
            title: "#",
            dataKey: "s.no",
            data: "id",
            columnHeaderClassName: "no-sorting w-1 text-center",
        },
        {
            title: "Name",
            dataKey: "assessmentName",
            data: "name",
            sortable: true,
            columnId: 0,
        },
        {
            title: "keyword",
            dataKey: "keywords",
            data: "audience",
            sortable: true,
            columnId: 1,
        },
        // {
        //   title: "Goal",
        //   dataKey: "resource",
        //   data: "goal",
        // },

        {
            title: "Action",
            dataKey: "action",
            data: null,
            columnHeaderClassName: "w-1 text-center no-sorting",
            columnClassName: "w-1 text-center",
            render: (data, raw) => {
                const resourceType = raw?.resource;

                return (
                    <ul className="list-inline action mb-0">
                        {/* Show Preview and Copy for System resource */}
                        {(resourceType === "System resource") && (
                            <>
                                <li className="list-inline-item tooltip-container" data-title="Preview">
                                    <Link to="#!" className="icon-primary" onClick={surveyEditShow}>
                                        <em className="icon-eye"/>
                                    </Link>
                                </li>

                                 <li className="list-inline-item tooltip-container" data-title="Copy to my resource">
                                    <button
                                        type="button"
                                        aria-label="Copy icon"
                                        className="icon-success"
                                        onClick={() => copyQuestionModal(raw)}
                                    >
                                        <em className="icon-copy"/>
                                    </button>
                                </li>

                            </>
                        )}

                        {/* Show Preview , Copy to Another and Delete button for My Resources */}
                        {(resourceType === "My Resources") && (
                            <>

                                <li className="list-inline-item tooltip-container" data-title="Preview">
                                    <Link to="#!" className="icon-primary" onClick={surveyEditShow}>
                                        <em className="icon-eye"/>
                                    </Link>
                                </li>

                                <li className="list-inline-item tooltip-container" data-title="Copy to my survey">
                                    <Link
                                        to="#!"
                                        className="icon-success"
                                        onClick={() => copyQueToAnotherModal(raw)}
                                    >
                                        <em className="icon-clipboard-check"/>
                                    </Link>
                                </li>

                                <li className="list-inline-item tooltip-container" data-title="Delete">
                                    <Link
                                        to="#!"
                                        className="icon-danger"
                                        onClick={() => deleteModal(raw)}
                                    >
                                        <em className="icon-delete"/>
                                    </Link>
                                </li>

                            </>
                        )}

                        {/* Show CopyQuestion , Copy to Another and Delete button for My Resources */}
                        {(resourceType === "Community Resources") && (
                            <>

                               <li className="list-inline-item tooltip-container" data-title="Preview">
                                    <Link to="#!" className="icon-primary" onClick={surveyEditShow}>
                                        <em className="icon-eye"/>
                                    </Link>
                                </li>
                                
                                 <li className="list-inline-item tooltip-container" data-title="Copy to my resource">
                                    <button
                                        type="button"
                                        aria-label="Copy icon"
                                        className="icon-success"
                                        onClick={() => copyQuestionModal(raw)}
                                    >
                                        <em className="icon-copy"/>
                                    </button>
                                </li>


                            </>
                        )}
                    </ul>
                );
        
            },
        },
    ];
    // for csv upload
    const columnCsvDownload = [
        {
            displayName: "S.No",
            id: "s.no",
        },
        // {
        //   displayName: "Community Assessment ID",  // Old Code - Unnecessary Column
        //   id: "communityAssessmentID",
        // },
        {
            displayName: "Resource",
            id: "resource",
        },
        {
            displayName: "Keywords",
            id: "keywords",
        },
        {
            displayName: "Assessment Name",
            id: "assessmentName",
        },
    ];
    // Old Code - Gets Only paginated data in CSV
    // const filteredData =
    //   templateDataList &&
    //   templateDataList?.map((item, index) => {
    //     return {
    //       "s.no": index + 1,
    //       assessmentName: stripHtml(item?.assessmentName),
    //       communityAssessmentID: item?.communityAssessmentID,
    //       keywords: stripHtml(item?.keywords),
    //       resource: item?.resource,
    //     };
    //   });
    const handleSearch = () => {
        if (!formData.companyMasterID) {
            setAlertType("companyMasterID");
            setAlertMassage("Please Select the Company Master");
            setIsAlertVisible(true);
            return;
        }
        if (!formData.companyID) {
            setAlertType("companyID");
            setAlertMassage("Please Select the Company");
            setIsAlertVisible(true);
            return;
        }
        if (!formData.searchFrom) {
            setAlertType("searchFrom");
            setAlertMassage("Please Select the Search From");
            setIsAlertVisible(true);
            return;
        }
        // if (!formData.surveyTypeID) {
        //   setAlertType("surveyTypeID");
        //   setAlertMassage("Please Select the Survey Type");
        //   setIsAlertVisible(true);
        //   return;
        // }

        // If all fields are filled, clear the alert and proceed
        setAlertType("");
        setAlertMassage("");
        setIsAlertVisible(false);
        
        // Update table state is keyword or search from is updated
        const isKeywordSearch = formData.keywords && formData.keywords.trim() !== "";
        if (isKeywordSearch || formData.searchFrom) {
            setTableState(prevState => ({
                ...prevState,
                start: 0,
            }));
        }
        getTemplateDataList();
    };
    useEffect(() => {
        getSearchFormData();
        getSurveyTypeData();
    }, []);
    useEffect(() => {
        if (
            formData.companyMasterID &&
            formData.companyID &&
            formData?.searchFrom
        ) {
            getCommunityData();
        }
    }, [formData.companyID, formData.searchFrom]);
    useEffect(() => {
        if (
            (formData.companyMasterID &&
                formData.companyID &&
                formData?.searchFrom) ||
            formData.surveyTypeID
        ) {
            getTemplateDataList();
        }
    }, [tableState, searchValue, assessmentData]);

    return (
        <>
            <Form>
                <Row className="mb-2 align-items-end gx-2">
                    <Col lg={4} sm={6}>
                        <Form.Group className="form-group">
                            <Form.Label>Company<sup>*</sup></Form.Label>
                            <SelectField
                                placeholder="Select Company"
                                options={companyOptions || []}
                                value={companyOptions?.find(
                                    (option) => option.value === formData.companyID
                                )}
                                onChange={handleCompanyChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col lg={4} sm={6}>
                        <Form.Group className="form-group">
                            <Form.Label>Search From <sup>*</sup></Form.Label>
                            <SelectField
                                placeholder="Select Search From"
                                options={searchFormData}
                                value={searchFormData?.find(
                                    (option) => parseInt(option.value) === formData.searchFrom
                                )}
                                onChange={handleSearchFormChange}
                            />
                        </Form.Group>
                    </Col>
                    {formData?.searchFrom === 98 && (
                        <Col lg={4} sm={6}>
                            <Form.Group className="form-group">
                                <Form.Label>Community Name</Form.Label>
                                <SelectField
                                    placeholder="Select Community"
                                    options={communityData || []}
                                    onChange={handleCommunityChange}
                                />
                            </Form.Group>
                        </Col>
                    )}
                    <Col lg={4} sm={6}>
                        <Form.Group className="form-group">
                            <Form.Label>Survey Type</Form.Label>
                            <SelectField
                                placeholder="Select Survey Type"
                                options={surveyTypeData}
                                value={surveyTypeData?.find(
                                    (option) => parseInt(option.value) === formData.surveyTypeID
                                )}
                                onChange={handleServeyTypeChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col lg={4} sm={6}>
                        <Form.Group className="form-group">
                            <Form.Label>Keywords</Form.Label>
                            <InputField
                                type="text"
                                placeholder="Enter Keywords"
                                value={formData.keywords}
                                onChange={handleKeywordTypeChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col lg={4} sm={6}>
                        <Form.Group className="form-group">
                            <Button onClick={() => handleSearch()}>
                                {handleSearchSubmitting ? "Searching..." : "Search"}{" "}
                            </Button>
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
            <div className="filter d-flex align-items-center justify-content-between flex-wrap gap-2">
                <div className="searchBar">
                    <InputField
                        type="search"
                        placeholder="Search"
                        onChange={handleSearchChange}
                    />
                </div>
                <ul className="list-inline filter_action d-flex mb-0">
                    {/*<li className="list-inline-item">*/}
                    {/*  <CsvDownloader*/}
                    {/*    filename="Resource_Survey_List" // Rename filename*/}
                    {/*    extension=".csv"*/}
                    {/*    className="downloadBtn "*/}
                    {/*    columns={columnCsvDownload}*/}
                    {/*    // datas={filteredData}*/}
                    {/*    datas={async () => {*/}
                    {/*      const allData = await fetchAllTemplateDataForCSV();*/}
                    {/*      return allData.map((item, index) => ({*/}
                    {/*        "s.no": index + 1,*/}
                    {/*         assessmentName: stripHtml(item?.assessmentName),*/}
                    {/*         communityAssessmentID: item?.communityAssessmentID,*/}
                    {/*         keywords: stripHtml(item?.keywords),*/}
                    {/*         resource: item?.resource,*/}
                    {/*      }));*/}
                    {/*    }}*/}
                    {/*    text={<em className="icon-download" />}*/}
                    {/*  />*/}
                    {/*</li>*/}
                    <li className="list-inline-item tooltip-container" data-title="Download All">
                        <ExportExcel
                            filename="Resource_Survey_List"
                            columns={columnCsvDownload}
                            data={async () => {
                                const allData = await fetchAllTemplateDataForCSV();
                                const arrayData = Array.isArray(allData) ? allData : allData?.data || [];
                                return arrayData.map((item, index) => ({
                                    "s.no": index + 1,
                                    assessmentName: stripHtml(item?.assessmentName),
                                    communityAssessmentID: item?.communityAssessmentID,
                                    keywords: stripHtml(item?.keywords),
                                    resource: item?.resource,
                                }));
                            }}
                            text={<em className="icon-download"/>}
                        />
                    </li>

                </ul>
            </div>
            <ReactDataTable
                data={templateDataList}
                columns={columns}
                page={Math.floor(tableState.start / tableState.length) + 1}
                totalLength={totalRecords}
                totalPages={Math.ceil(totalRecords / tableState.length)}
                sizePerPage={tableState.length}
                handleLimitChange={handleLimitChange}
                handleOffsetChange={handleOffsetChange}
                searchValue={searchValue}
                handleSort={handleSort}
                sortState={{
                    column: tableState.order[0].column,
                    direction: sortDirection, // Use the tracked direction
                }}
                isLoading={tableLoader}
                serverSide
            />

            {/* review surveys */}
            <ModalComponent
                modalExtraClass="reviewEditModal"
                extraClassName="modal-dialog-md"
                extraTitleClassName="pb-0"
                extraBodyClassName="pt-0 text-center"
                show={surveyEditTemp}
                onHandleCancel={surveyEditClose}
            >
                <div className="modalHead d-inline-block">
                    <h5 className="subtitle mb-0">Welcome to Template</h5>
                    <h6 className="title mb-0">Employee Belonging Survey!</h6>
                </div>
                <p className="mb-xl-4 mb-md-3 mb-2">
                    Your participation is essential in helping us understand your
                    satisfaction with the benefits offered by our organization. By sharing
                    your perceptions and experiences, you&apos;ll enable us to identify
                    strengths and areas for improvement in our benefits programs. This
                    survey aims to ensure our benefits align with your needs and
                    expectations, fostering a more satisfied and engaged workforce. Your
                    feedback will also help us remain competitive in attracting and
                    retaining top talent by offering a benefits package that meets or
                    exceeds industry standards.
                </p>
                <p className="text-dark mb-0 fw-semibold">
                    Your participation drives meaningful change, so thank you for your
                    valuable input!
                </p>
                <div className="mt-3 pt-1 d-flex justify-content-center">
                    <Link
                        to={adminRouteMap.PREVIEWSURVEYS.path}
                        state={{
                            companyID: formData.companyID,
                            // surveyID: selectedSurveyId,
                        }}
                        className="btn btn-primary ripple-effect"
                    >
                        Start
                    </Link>
                </div>
            </ModalComponent>

            {/* delete alert */}
            <SweetAlert
                title="Are you sure?"
                text="You want to delete this data!"
                show={isAlertVisible && alertType === "delete"}
                icon="warning"
                onConfirmAlert={onConfirmAlertModal}
                showCancelButton
                cancelButtonText="Cancel"
                confirmButtonText="Yes"
                setIsAlertVisible={setIsAlertVisible}
                isConfirmedTitle="Deleted!"
                isConfirmedText="Assessment has been deleted successfully."
            />
            {/* this alert showing when company is selected */}
            <SweetAlert
                icon="warning"
                text="Enter a new Assessment Name and Submit to Proceed Copying this Assessment."
                input="text"
                inputPlaceholder="Enter Assessment Name"
                showCancelButton
                cancelButtonText="Cancel"
                confirmButtonText="Yes"
                show={isAlertVisible && alertType === "copyQuestion"}
                onConfirmAlert={handleCopyResponseBlock}
                setIsAlertVisible={setIsAlertVisible}
                isConfirmedTitle="Copied!"
                isConfirmedText="Assessment has been copied successfully."
            />

            {/* this alert showing when company is not selected */}
            <SweetAlert
                icon="error"
                text="Please Select the Company"
                cancelButtonColor="#0968AC"
                showCancelButton
                showConfirmButton={false}
                cancelButtonText="Okay"
                show={isAlertVisible && alertType === "error"}
                onConfirmAlert={onConfirmAlertModal}
                setIsAlertVisible={setIsAlertVisible}
                customClass={{
                    popup: "resource_modal",
                    confirmButton: "resource_confirmbutton",
                    cancelButton: "resource_cancelbutton",
                }}
            />

            <BasicAlert
                title={alertMassage || "Please Select filters..."}
                text={
                    alertType === "surveyTypeID"
                        ? "Please select a survey type before proceeding!"
                        : alertType === "searchFrom"
                        ? "Please provide search From criteria to continue!"
                        : alertType === "companyID"
                            ? "Please select a company before adding a question!"
                            : "Please select the outcome too processing..."
                }
                show={
                    isAlertVisible &&
                    (alertType === "surveyTypeID" ||
                        alertType === "searchFrom" ||
                        alertType === "companyID")
                }
                icon="warning"
                setIsAlertVisible={setIsAlertVisible}
                buttonText="OK"
            />

            <ModalComponent
                modalExtraClass="reviewEditModal"
                extraClassName="modal-dialog-md"
                extraTitleClassName="pb-0"
                extraBodyClassName="pt-0"
                modalHeader="Copy Survey"
                show={isAlertVisible && alertType === "copyToAnotherQuestion"}
                onHandleCancel={onConfirmSharedModal}
            >
                <Formik
                    initialValues={initialValues}
                    validationSchema={addValidationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {({values, setFieldValue}) => (
                        <FormikForm>
                            <Row className="row rowGap align-items-start mt-2">
                                <Col sm={12}>
                                    <Form.Group className="form-group">
                                        <Form.Label>
                                            Enter a new Survey Name and Submit to Proceed Copying this
                                            Survey <sup>*</sup>
                                        </Form.Label>
                                        <Field
                                            type="text"
                                            name="surveyName"
                                            className="form-control"
                                            placeholder="Enter survey name"
                                            // value={`Clone - ${rowData.assessmentName}`}
                                            // onChange={(e) =>
                                            //     setFieldValue("surveyName", e.target.value)
                                            // }
                                        />
                                        <ErrorMessage
                                            name="surveyName"
                                            component="div"
                                            className="error-help-block"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col sm={12}>
                                    <Form.Group className="form-group">
                                        <Form.Label className="form-label">
                                            To Company <sup>*</sup>
                                        </Form.Label>
                                        <SelectField
                                            placeholder="Select Company"
                                            options={companyOptions}
                                            name="toCompanyID"
                                            onChange={(selectedOption) =>
                                                handleToCompanyChange(selectedOption, setFieldValue)
                                            }
                                            styles={{
                                                menuPortal: (base) => ({...base, zIndex: 9999})
                                            }}
                                        />
                                        <ErrorMessage
                                            name="toCompanyID"
                                            component="div"
                                            className="error-help-block"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <div className="form-btn d-flex justify-content-end gap-2">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="ripple-effect"
                                    onClick={onConfirmSharedModal}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="ripple-effect"
                                >
                                    Submit
                                </Button>
                            </div>
                        </FormikForm>
                    )}
                </Formik>
            </ModalComponent>
        </>
    );
}

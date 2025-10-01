import React, { useState } from "react";
import { useFormik } from "formik";
import { Row, Col, Form, Button } from "react-bootstrap";
import { commonService } from "services/common.service";
import { SURVEYS_MANAGEMENT } from "apiEndpoints/SurveysManagement";
import { useTable } from "customHooks/useTable";
import { decodeHtmlEntities, stripHtml } from "utils/common.util";
import {
  InputField,
  SelectField,
  ModalComponent,
  ReactDataTable,
} from "../../../../../../components";

const SearchAndAddModal = ({
  show,
  onClose,
  survey,
  initialData,
  validation,
  userData,
  companyID,
  handleAddIntro,
}) => {
  const [introductionList, setIntroductionList] = useState([]);
  const [searchValue] = useState("");
  const [tableFilters] = useState({});
  // Initialize the checkedItems state based on unassignModalData
  const [checkedItems, setCheckedItems] = useState({});

  const [selectIntro, setSelectIntro] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userSearched, setUserSearched] = useState(false);

  function convertApiDataToSampleData(apiData) {
    return apiData.map((item, index) => ({
      id: index,
      introduction: item.introduction,
      checkboxData: "false",
    }));
  }

  const fetchIntroduction = async (values) => {
    setIsSubmitting(true);

    const response = await commonService({
      apiEndPoint: SURVEYS_MANAGEMENT.getResourceIntroduction,
      queryParams: {
        companyID,
        surveyTypeID: values?.surveyType,
        keywords: values?.keywords,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });
    if (response?.status) {
      let introList = convertApiDataToSampleData(response?.data?.data);
      setIntroductionList(introList);
      setUserSearched(true);
      let checkListData = introList?.reduce(
        (acc, item) => ({ ...acc, [item.id]: false }),
        {}
      );

      setCheckedItems(checkListData);
      setIsSubmitting(false);
    } else {
      console.log("error");
      setIsSubmitting(false);
    }
  };

  // This hook is not usefull when we handle search,filter,pagination from api.
  const {
    currentData,
    totalRecords,
    totalPages,
    offset,
    limit,
    sortState,
    setOffset,
    setLimit,
    handleSort,
  } = useTable({
    searchValue,
    searchKeys: [],
    tableFilters,
    initialLimit: 10,
    data: introductionList,
  });

  const handleLimitChange = (value) => {
    setLimit(value);
    setOffset(1);
  };

  const handleOffsetChange = (value) => {
    setOffset(value);
  };

  const updateCheckObject = (rowData, checkObject) => {
    // Create a copy of the checkObject to avoid mutating the original object
    const updatedCheckObject = { ...checkObject };

    // Iterate over the checkObject keys and set the corresponding value based on the rowData.id
    Object.keys(updatedCheckObject).forEach((key) => {
      // Set the value to true if the key matches the rowData.id
      updatedCheckObject[key] = parseInt(key) === rowData.id;
    });

    return updatedCheckObject;
  };

  const handleCheckboxChange = (e, row) => {
    const returnCheck = updateCheckObject(row, checkedItems);
    setCheckedItems(returnCheck);
    setSelectIntro(row?.introduction);
  };

  // Formik Hook
  const formik = useFormik({
    initialValues: initialData,
    validationSchema: validation,
    onSubmit: fetchIntroduction,
  });

  const unassignColumns = [
    {
      title: "S.No.",
      dataKey: "s.no",
      data: "s.no",
      columnHeaderClassName: "no-sorting w-1 text-center",
    },
    {
      title: "#",
      dataKey: "checkboxData",
      columnHeaderClassName: "w-1 text-center",
      columnOrderable: false,
      render: (data, row) => {
        return (
          <>
            <Form.Group className="form-group mb-0" controlId={row.id}>
              <Form.Check
                className="me-0 p-0"
                type="checkbox"
                id={row.id}
                checked={checkedItems[row.id]}
                onChange={(e) => handleCheckboxChange(e, row)}
                label={<div className="primary-color" />}
              />
            </Form.Group>
          </>
        );
      },
    },
    {
      title: "Title",
      dataKey: "Introduction",
      columnHeaderClassName: "no-sorting",
      render: (data, row) => {
        return (
          <div className="faqFilter">
            <div className="faqFilter_Head">{row.introduction}</div>
          </div>
        );
      },
    },
  ];

  const handleClose = () => {
    onClose();
    setIntroductionList([]);
    setCheckedItems({});
    setSelectIntro("");
    setUserSearched(false);
    formik.resetForm();
  };

  const handleAdd = () => {
    handleAddIntro(selectIntro);
    handleClose();
  };

  return (
    <ModalComponent
      modalHeader="Search and Add - Introduction"
      show={show}
      onHandleCancel={handleClose}
      size="lg"
    >
      <Form onSubmit={formik.handleSubmit}>
        <Row className="row rowGap align-items-end">
          <Col lg={5}>
            <Form.Group className="form-group">
              <Form.Label>
                Survey Type
              </Form.Label>
              <SelectField
                placeholder="Select Survey Type"
                options={survey}
                onChange={(selectedOption) =>
                  formik.setFieldValue("surveyType", selectedOption?.value)
                }
                onBlur={() => formik.setFieldTouched("surveyType", true)}
              />
              {formik.touched.surveyType && formik.errors.surveyType && (
                <div className="text-danger">{formik.errors.surveyType}</div>
              )}
            </Form.Group>
          </Col>
          <Col lg={5}>
            <Form.Group className="form-group">
              <Form.Label>Keywords</Form.Label>
              <InputField
                type="text"
                placeholder="Enter Keywords"
                name="keywords"
                value={formik.values.keywords}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.keywords && formik.errors.keywords && (
                <div className="text-danger">{formik.errors.keywords}</div>
              )}
            </Form.Group>
          </Col>
          <Col lg={2} className="d-flex justify-content-end">
            <Button
              type="submit"
              variant="primary"
              className="ripple-effect px-3 py-2"
            >
              {isSubmitting ? "Searching..." : "Search"}
            </Button>
          </Col>
        </Row>
      </Form>
      {userSearched && (
        <Row className="row rowGap mt-2">
          <Col lg={12}>
            <ReactDataTable
              data={currentData.map((pre) => ({
                ...pre,
                introduction: decodeHtmlEntities(stripHtml(pre.introduction)),
              }))}
              columns={unassignColumns}
              page={offset}
              totalLength={totalRecords}
              totalPages={totalPages}
              sizePerPage={limit}
              handleLimitChange={handleLimitChange}
              handleOffsetChange={handleOffsetChange}
              searchValue={searchValue}
              handleSort={handleSort}
              sortState={sortState}
            />

            <div className="form-btn d-flex gap-2 justify-content-end pt-2">
              <Button
                type="button"
                variant="secondary"
                className="ripple-effect"
                onClick={handleClose}
              >
                Close
              </Button>
              <Button
                type="button"
                variant="primary"
                className="ripple-effect"
                onClick={handleAdd}
                disabled={selectIntro === ""}
              >
                Add
              </Button>
            </div>
          </Col>
        </Row>
      )}
    </ModalComponent>
  );
};

export default SearchAndAddModal;

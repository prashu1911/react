import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { commonService } from "services/common.service";
import { QuestionSetup } from "apiEndpoints/QuestionSetup";
import { useTable } from "customHooks/useTable";
import { stripHtml } from "utils/common.util";
import {
  Button,
  InputField,
  ModalComponent,
  ReactDataTable,
  SelectField,
} from "../../../../../../components";

const QuestionBankModal = ({
  showQuestionBank,
  questionBankClose,
  questionOptions,
  surveyOptions,
  handleAddQuestion,
  userData,
  openFrom,
  companyID,
  questionType,
}) => {
  const [questions, setQuestions] = useState([]);
  const [searchValue] = useState("");
  const [tableFilters] = useState({});
  const [selectSurveyTypeID, setSelectSurveyTypeID] = useState("");
  const [enteredKeyword, setEnteredKeyword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // data table
  const columns = [
    {
      title: "#",
      dataKey: "s.no",
      columnHeaderClassName: "w-1 text-center no-sorting",
    },
    {
      title: "Question",
      dataKey: "question",
    },
    {
      title: "Keywords",
      dataKey: "keywords",
    },
    {
      title: "Action",
      dataKey: "action",
      columnHeaderClassName: "w-1 text-center no-sorting",
      columnClassName: "w-1 text-center",
      render: (_, row) => {
        return (
          <Button
            variant="primary"
            className="ripple-effect btn btn-sm text-nowrap"
            onClick={() => {
              handleAddQuestion(row);
            }}
          >
            Add to Survey
          </Button>
        );
      },
    },
  ];

  const fetchQuestinList = async () => {
    try {
      setIsSubmitting(true);
      const response = await commonService({
        apiEndPoint: QuestionSetup.fetchQuestionList,
        bodyData: {
          companyMasterID: userData?.companyMasterID,
          companyID,
          searchFrom: 95,
          questionType,
          surveyTypeID: Number(selectSurveyTypeID),
          keywords: enteredKeyword,
          draw: 1,
          start: 0,
          length: 500,
          search: { value: "", regex: true },
          order: [{ column: 0, dir: "asc" }],
          isExport: false,
          type: "question"
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        setQuestions(response?.data?.data);

        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error add outcome:", error);
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
    searchKeys: [
      "aliasName",
      "companyName",
      "departmentName",
      "eMailID",
      "firstName",
      "lastName",
      "roleName",
    ],
    tableFilters,
    initialLimit: 10,
    data: questions,
  });
  const ISMODAL=true;
  const handleLimitChange = (value) => {
    setLimit(value);
    setOffset(1);
  };

  const handleOffsetChange = (value) => {
    setOffset(value);
  };
  const handleSearch = () => {
    fetchQuestinList();
  };
  return (
    <ModalComponent
      modalHeader="Search & Add - Question Bank"
      extraClassName="questionBankModal"
      show={showQuestionBank}
      onHandleCancel={questionBankClose}
    >
      <Form>
        <div className="questionBankModal_filter d-flex gap-2 align-items-end mb-3">
          <Form.Group className="form-group mb-0 questionBankModal_select">
            <Form.Label>Question Type</Form.Label>
            <SelectField
              placeholder="Select Question Type"
              options={questionOptions}
              value={questionOptions.find(({ value }) => value === openFrom)}
              isDisabled
            />
          </Form.Group>
          <Form.Group className="form-group mb-0 questionBankModal_survey">
            <Form.Label>Survey Type</Form.Label>
            <SelectField
              placeholder="Select Survey Type"
              options={surveyOptions}
              onChange={(option) => {
                setSelectSurveyTypeID(option?.value);
              }}
              isModal={ISMODAL}
              value={surveyOptions.find(
                (option) => option.value === selectSurveyTypeID
              )}
            />
          </Form.Group>
          <Form.Group className="form-group mb-0 questionBankModal_input">
            <Form.Label>Keywords</Form.Label>
            <InputField
              type="text"
              placeholder="Keywords"
              onChange={(e) => {
                setEnteredKeyword(e.target.value);
              }}
            />
          </Form.Group>
          <Button
            variant="primary"
            className="ripple-effect"
            onClick={handleSearch}
            // disabled={selectSurveyTypeID === ""}
          >
            {isSubmitting ? "Searching..." : "Search"}
          </Button>
        </div>
      </Form>

      <ReactDataTable
        data={currentData.map((pre) => ({
          ...pre,
          question: stripHtml(pre.question), // Decode HTML entities
        }))}
        columns={columns}
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
    </ModalComponent>
  );
};

export default QuestionBankModal;

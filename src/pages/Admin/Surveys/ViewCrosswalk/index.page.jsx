import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Form } from "react-bootstrap";
import { commonService } from "services/common.service";
import { COMPANY_MANAGEMENT } from "apiEndpoints/OrgStructure/OrgStructure.dashboard";
import { SURVEYS_MANAGEMENT } from "apiEndpoints/SurveysManagement";
import { Crosswalks } from "apiEndpoints/Crosswalk";
import CsvDownloader from "react-csv-downloader";
import { decodeHtmlEntities } from "utils/common.util";
import {
  Breadcrumb,
  SelectField,
  ReactDataTable,
} from "../../../../components";
import { useTable } from "../../../../customHooks/useTable";
import useAuth from "../../../../customHooks/useAuth/index";
import {
  selectCompany,
  selectCompanyData,
} from "../../../../redux/ManageSurveySlice/index.slice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

function ViewCrosswalk() {
  const dispatch = useDispatch();
  const { getloginUserData } = useAuth();
  const location = useLocation();
  const filterData = location.state || null; // Use optional chaining
  const userData = getloginUserData();
  // company options
  const [companyOptions, setCompanyOptions] = useState([]);
  const [searchValue] = useState("");
  const [survey, setSurvey] = useState([]);
  const [tableFilters] = useState({});
  const selectedReduxCompanyID = useSelector(selectCompanyData);

  const [selectedSurveyID, setSelectedSurveyID] = useState("");
  const [selectedCompanyID, setSelectedCompanyID] = useState("");
  const [crossWalk, setCrossWalk] = useState([]);
  const [tableLoader, setTableLoader] = useState(false);
  const [isEditable, setIsEditable] = useState(true);
  const [disableSurvey, setDisableSurvey] = useState(true);

  // breadcrumb
  const breadcrumb = [
    {
      path: "#!",
      name: "Surveys",
    },

    {
      path: "#",
      name: "View Crosswalk",
    },
  ];
  const fetchCompanies = async () => {
    const response = await commonService({
      apiEndPoint: COMPANY_MANAGEMENT.getCompanybasic,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });
    if (response?.status) {
      setIsEditable(response?.data?.isEditable);
      setCompanyOptions(
        Object?.values(response?.data?.data)?.map((company) => ({
          value: company?.companyID,
          label: company?.companyName,
        }))
      );
    } else {
      console.log("error");
    }
  };

  const fetchSurvey = async (companyID) => {
    setDisableSurvey(true);
    const response = await commonService({
      apiEndPoint: SURVEYS_MANAGEMENT.getSurvey,
      queryParams: { companyID },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });
    if (response?.status) {
      setSurvey(
        response?.data?.data?.map((item) => ({
          value: item?.surveyID,
          label: item?.surveyName,
        }))
      );
      setDisableSurvey(false);
    } else {
      console.log("error");
    }
  };

  useEffect(() => {
    if (companyOptions.length && selectedReduxCompanyID) {
      setSelectedCompanyID(selectedReduxCompanyID);
      fetchSurvey(selectedReduxCompanyID);
    }
  }, [companyOptions, selectedReduxCompanyID]);

  const fetchCrossWalk = async () => {
    setTableLoader(true);
    const response = await commonService({
      apiEndPoint: Crosswalks.viewCrosswalk,
      queryParams: { companyID: selectedCompanyID, surveyID: selectedSurveyID },
      //   queryParams: { companyID: 1, surveyID: 19 }, this for testing
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });
    if (response?.status) {
      let crossWalkData = [];
      if (response?.data?.length > 0) {
        for (let oneRow of response?.data) {
          // Add main question
          let temp = {
            sub_question_no: "-",
            question_id: oneRow.question_id,
            outcome_id: oneRow.outcome_id,
            outcomes: oneRow.outcomes,
            question_no: oneRow.question_no,
            intentions: oneRow.question_type === "MR" ? "-" : oneRow.intentions,
            intention_short_name:
              oneRow.question_type === "MR" ? "-" : oneRow.intention_short_name,
            question: oneRow.question,
            question_type: oneRow.question_type,
            is_branch_filter: oneRow.is_branch_filter,
            jump_sequence: oneRow.jump_sequence === 1 ? "Yes" : "-",
            response:
              oneRow.question_type === "D"
                ? oneRow.response?.map((item) => ({
                    response_name: item.response_name,
                  }))
                : oneRow.question_type === "R" && oneRow.is_score === 0
                ? oneRow.response?.map((item) => ({
                    ...item,
                    response_weightage: "0.00",
                    response_category: "Neutral",
                  }))
                : oneRow.question_type === "G"
                ? oneRow.response?.map((item) => ({
                    response_name: item.response_name,
                    response_category: item.response_category,
                    is_oeq: item.is_oeq,
                    oeq_question: item.oeq_question,
                  }))
                : oneRow.response || [],
            is_score: oneRow.is_score,
            is_slider: oneRow.is_slider,
            demographic_response:
              oneRow.demographic_response &&
              oneRow.demographic_response?.length > 0
                ? oneRow?.demographic_response
                : [],
          };
          crossWalkData.push(temp);

          // Add sequence question for Gate type if it exists
          if (
            oneRow.question_type === "G" &&
            oneRow.sequence_question?.length > 0
          ) {
            oneRow.sequence_question.forEach((seqQ, index) => {
              // Add the sequence question
              let sequenceQuestionTemp = {
                sub_question_no: "-",
                question_id: oneRow.question_id,
                outcome_id: oneRow.outcome_id,
                outcomes: oneRow.outcomes,
                question_no: Number(oneRow.question_no) + index + 1,
                intentions: seqQ.intentions,
                intention_short_name: seqQ.intention_short_name,
                question: seqQ.question,
                question_type: seqQ.question_type,
                is_branch_filter: seqQ.is_branch_filter,
                jump_sequence:
                  seqQ.jump_sequence === 1
                    ? `Yes (${oneRow.question_no})`
                    : `${oneRow.question_no}`,
                response: seqQ.response || [],
                is_score: seqQ.is_score,
                is_slider: seqQ.is_slider,
              };
              crossWalkData.push(sequenceQuestionTemp);

              // If it's a nested question (type N), add its sub-questions
              if (seqQ.question_type === "N" && seqQ.sub_question?.length > 0) {
                seqQ.sub_question.forEach((subQ) => {
                  let nestedSubQuestionTemp = {
                    sub_question_no: subQ.question_sub_no.split(".")[0],
                    question_id: oneRow.question_id,
                    outcome_id: oneRow.outcome_id,
                    outcomes: oneRow.outcomes,
                    question_no: Number(oneRow.question_no) + index + 1,
                    intentions: seqQ.intentions,
                    intention_short_name: seqQ.intention_short_name,
                    question: subQ.question_sub,
                    question_type: seqQ.question_type,
                    is_branch_filter: seqQ.is_branch_filter,
                    jump_sequence:
                      seqQ.jump_sequence === 1
                        ? `Yes (${oneRow.question_no})`
                        : `${oneRow.question_no}`,
                    response: seqQ.response || [],
                    is_score: seqQ.is_score,
                    is_slider: seqQ.is_slider,
                  };
                  crossWalkData.push(nestedSubQuestionTemp);
                });
              }
            });
          }

          // Add sub-questions if they exist
          if (oneRow.sub_question?.length > 0) {
            oneRow.sub_question.forEach((subQ) => {
              let subQuestionTemp = {
                sub_question_no: subQ.question_sub_no.split(".")[0],
                question_id: oneRow.question_id,
                outcome_id: oneRow.outcome_id,
                outcomes: oneRow.outcomes,
                question_no: oneRow.question_no,
                intentions: oneRow.intentions,
                intention_short_name: oneRow.intention_short_name,
                question: subQ.question_sub,
                question_type: oneRow.question_type,
                is_branch_filter: oneRow.is_branch_filter,
                jump_sequence: oneRow.jump_sequence === 1 ? "Yes" : "-",
                response: oneRow.response || [],
                is_score: oneRow.is_score,
                is_slider: oneRow.is_slider,
              };
              crossWalkData.push(subQuestionTemp);
            });
          }

          // Add defining questions for MR type if they exist
          if (
            oneRow.question_type === "MR" &&
            oneRow.defining_question_details?.length > 0
          ) {
            // Sort defining questions by question_no
            const sortedDefiningQuestions = [
              ...oneRow.defining_question_details,
            ].sort((a, b) => {
              const [aMain, aSub] = a.question_no.split(".").map(Number);
              const [bMain, bSub] = b.question_no.split(".").map(Number);
              return aSub - bSub;
            });

            // For question 18, we need to reorder the questions
            if (oneRow.question_no === "18") {
              const reorderedQuestions = [];
              const subQ1 = sortedDefiningQuestions.filter(
                (q) => q.question_no === "18.1"
              );
              const subQ2 = sortedDefiningQuestions.filter(
                (q) => q.question_no === "18.2"
              );

              // Add first sub-question of each question_no
              subQ1.forEach((q) => reorderedQuestions.push(q));
              subQ2.forEach((q) => reorderedQuestions.push(q));

              sortedDefiningQuestions.length = 0;
              sortedDefiningQuestions.push(...reorderedQuestions);
            }

            // Track sub-question numbers for each question_no
            let currentQuestionNo = null;
            let currentCount = 0;

            sortedDefiningQuestions.forEach((defQ) => {
              // Reset counter when question_no changes
              if (currentQuestionNo !== defQ.question_no) {
                currentQuestionNo = defQ.question_no;
                currentCount = 1;
              } else {
                currentCount++;
              }

              let definingQuestionTemp = {
                sub_question_no: currentCount.toString(),
                question_id: defQ.question_id,
                outcome_id: oneRow.outcome_id,
                outcomes: oneRow.outcomes,
                question_no: defQ.question_no,
                intentions: oneRow.intentions || "-",
                intention_short_name: oneRow.intention_short_name || "-",
                question: `${defQ.defining_question} :: ${defQ.question_sub}`,
                question_type: oneRow.question_type,
                is_branch_filter: oneRow.is_branch_filter,
                jump_sequence: oneRow.jump_sequence === 1 ? "Yes" : "-",
                response: defQ.response || [],
                is_score: oneRow.is_score,
                is_slider: oneRow.is_slider,
              };
              crossWalkData.push(definingQuestionTemp);
            });
          }
        }
      }

      setCrossWalk(crossWalkData);
      setTableLoader(false);
    } else {
      console.log("error");
      setTableLoader(false);
    }
  };

  useEffect(() => {
    fetchCompanies(userData?.companyMasterID);
    if (filterData && Object.keys(filterData).length > 0) {
      setSelectedSurveyID(filterData?.surveyID);
      setSelectedCompanyID(filterData?.companyID);
      fetchSurvey(filterData?.companyID);
    }
  }, []);

  useEffect(() => {
    if (selectedCompanyID !== "" && selectedSurveyID !== "") {
      fetchCrossWalk();
    }
  }, [selectedSurveyID, selectedCompanyID]);

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
    searchKeys: ["outcomes", "intentions", "question2"],
    tableFilters,
    initialLimit: 1000,
    data: crossWalk,
  });

  const handleLimitChange = (value) => {
    setLimit(value);
    setOffset(1);
  };

  const handleOffsetChange = (value) => {
    setOffset(value);
  };

  const listOfBranchFilters = (inputArr) => {
    if (Array.isArray(inputArr) && inputArr.length > 0) {
      const arr11 = [];
      inputArr.forEach((item) => {
        let testVal = item.response;

        function transe(arrItem, preText) {
          if (Array.isArray(arrItem) && arrItem.length > 0) {
            for (const ele of arrItem) {
              let testThree = preText + " -> " + ele.response;
              if (Array.isArray(ele.next_level) && ele.next_level.length > 0) {
                transe(ele.next_level, testThree);
              } else {
                arr11.push(testThree);
              }
            }
          }
        }

        if (Array.isArray(item.next_level) && item.next_level.length > 0) {
          transe(item.next_level, testVal);
        } else {
          arr11.push(testVal);
        }
      });

      return arr11;
    }
  };

  const renderBranchList = (rowData, forExcel) => {
    const queId = rowData?.question_id;

    const filterReqDemograpFilter = crossWalk.find(
      (ele) => ele.question_id === queId
    );

    if (queId && filterReqDemograpFilter) {
      const returnedArr = listOfBranchFilters(
        filterReqDemograpFilter.demographic_response
      );
      if (Array.isArray(returnedArr) && returnedArr.length > 0) {
        return forExcel ? (
          returnedArr
        ) : (
          <ul>
            {returnedArr.map((eleI, idx) => (
              <li key={idx}>{eleI}</li>
            ))}
          </ul>
        );
      }
      return null;
    } else {
      return null;
    }
  };

  const addOpenEndedQue = (oeqVal) => {
    if (oeqVal) {
      let strVal = "";
      if (oeqVal.is_oeq) {
        strVal += " - Yes";
        if (oeqVal?.oeq_question) {
          strVal += ` - ${oeqVal?.oeq_question}`;
        }

        return strVal;
      } else {
        return " - No";
      }
    } else {
      return "";
    }
  };

  const columns = [
    {
      title: "#",
      dataKey: "s.no",
      data: "s.no",
      columnHeaderClassName: "no-sorting w-1 text-center",
    },
    {
      title: "Outcomes",
      dataKey: "outcomes",
      data: "outcomes",
      columnHeaderClassName: "min-w-220",
      columnClassName: "wh-normal",
      sortable: true,
    },
    {
      title: "Question No",
      dataKey: "question_no",
      data: "question_no",
      columnHeaderClassName: "min-w-150",
      columnClassName: "wh-normal",
      sortable: true,
    },
    {
      title: "Sub-Question",
      dataKey: "sub_question_no",
      data: "sub_question_no",
      columnHeaderClassName: "no-sorting",
    },
    {
      title: "Intentions",
      dataKey: "intentions",
      data: "intentions",
      columnHeaderClassName: "min-w-220 no-sorting",
      columnClassName: "wh-normal",
    },
    {
      title: "Intentions Short Name",
      dataKey: "intention_short_name",
      data: "intention_short_name",
      sortable: true,
    },
    {
      title: "Question",
      dataKey: "question",
      data: "question",
      columnHeaderClassName: "no-sorting",
    },
    {
      title: "Jump Sequence",
      dataKey: "jump_sequence",
      data: "jump_sequence",
      columnHeaderClassName: "no-sorting",
    },
    {
      title: "Response - Value - Category - OEQ",
      dataKey: "response",
      data: "response",
      columnHeaderClassName: "no-sorting",
      render: (row, data) => {
        return (
          <>
            {data.question_type === "D" && data.is_branch_filter === 1 ? (
              <>{renderBranchList(data)}</>
            ) : (
              <>
                {row && row.length > 0 && (
                  <ul>
                    {row.map((item, index) => (
                      <li key={index}>
                        {item.response_name}
                        {data.question_type === "G" ? (
                          <>
                            {` - ${item.response_category}`}
                            {item.is_oeq !== undefined && addOpenEndedQue(item)}
                          </>
                        ) : (
                          item.response_weightage !== undefined && (
                            <>
                              {` - ${item.response_weightage} - ${item.response_category}`}
                              {item.is_oeq !== undefined &&
                                addOpenEndedQue(item)}
                            </>
                          )
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </>
        );
      },
    },
  ];

  // Handle select field change
  const handleSelectChange = (selectedOption, name) => {
    const { value } = selectedOption;
    if (name === "company_id") {
      setSelectedCompanyID(value);
      dispatch(selectCompany(value));
      setSelectedSurveyID("");
      fetchSurvey(value);
    } else {
      setSelectedSurveyID(value);
    }
  };

  const renterTextTwo = (rowData) => {
    if (rowData.question_type === "D" && rowData.is_branch_filter === 1) {
      return `"${renderBranchList(rowData, true).join("\n")}"`;
    } else if (Array.isArray(rowData.response) && rowData.response.length > 0) {
      const returnVal = rowData.response.map((item) => {
        if (rowData?.intentions === "DEMO") {
          return item.response_name;
        } else if (rowData.question === "branch filter") {
          return renderBranchList(rowData);
        } else if (rowData.question_type === "G") {
          return `${item.response_name} - ${item.response_category} ${
            item.is_oeq !== undefined ? addOpenEndedQue(item) : ""
          }`;
        } else if (item.response_weightage && item.response_category) {
          return `${item.response_name} - ${item.response_weightage} - ${
            item.response_category
          } ${item.is_oeq !== undefined ? addOpenEndedQue(item) : ""}`;
        } else {
          return item.response_name;
        }
      });

      return `"${returnVal.join("\n")}"`;
    } else {
      return "";
    }
  };

  const filteredData = crossWalk.map((item, index) => {
    return {
      "s.no": index + 1,
      outcomes: decodeHtmlEntities(item?.outcomes),
      question_no: decodeHtmlEntities(item?.question_no),
      sub_question_no: decodeHtmlEntities(item?.sub_question_no),
      intentions: decodeHtmlEntities(item?.intentions),
      intention_short_name: decodeHtmlEntities(item?.intention_short_name),
      question: decodeHtmlEntities(item?.question),
      jump_sequence: decodeHtmlEntities(item?.jump_sequence),
      response: renterTextTwo(item),
      // response:
      //   item?.response &&
      //   item?.response.length > 0 &&
      //   `"${item?.response
      //     ?.map((item2) => {
      //       if (item?.intentions === "DEMO") {
      //         return `${item2.response_name}`;
      //       }
      //       if (item?.question_type === "G") {
      //         return `${item2.response_name} - ${item2.response_category} - ${item2.is_oeq}`;
      //       }
      //       return `${item2.response_name} - ${item2.response_weightage} - ${item2.response_category} - ${item2.is_oeq}`;
      //     })
      //     .join("\n")}"`,
    };
  });

  // for csv upload
  const columnCsvDownload = [
    {
      displayName: "S.No",
      id: "s.no",
    },
    {
      displayName: "Outcomes",
      id: "outcomes",
    },
    {
      displayName: "Question No",
      id: "question_no",
    },
    {
      displayName: "Sub-Question",
      id: "sub_question_no",
    },
    {
      displayName: "Intentions",
      id: "intentions",
    },
    {
      displayName: "Intentions Short Name",
      id: "intention_short_name",
    },
    {
      displayName: "Question",
      id: "question",
    },
    {
      displayName: "Jump Sequence",
      id: "jump_sequence",
    },
    {
      displayName: "Response - Value - Category - OEQ",
      id: "response",
    },
  ];

  return (
    <>
      {/* head title start */}
      <section className="commonHead">
        <h1 className="commonHead_title">Welcome Back!</h1>
        <Breadcrumb breadcrumb={breadcrumb} />
      </section>
      {/* head title end */}
      <div className="pageContent crosswalk surveyTable">
        <div className="pageTitle">
          <h2 className="mb-0">View Crosswalk</h2>
        </div>

        <Form>
          <div className="d-sm-flex align-items-center flex-sm-nowrap flex-wrap gap-2">
            <Form.Group className="form-group">
              <Form.Label>Company Name</Form.Label>
              <SelectField
                name="company_id"
                options={companyOptions || []}
                placeholder="Select Company"
                value={companyOptions.find(
                  ({ value }) => value === selectedCompanyID
                )}
                onChange={(value) => handleSelectChange(value, "company_id")}
                isDisabled={!isEditable}
              />
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>Survey Name</Form.Label>
              <SelectField
                placeholder="Survey Name"
                name="survey_id"
                options={survey || []}
                value={survey.find(({ value }) => value == selectedSurveyID)}
                onChange={(value) => handleSelectChange(value, "survey_id")}
                isDisabled={!selectedCompanyID}
              />
            </Form.Group>
          </div>
        </Form>
        <h3 className="innerTitle">HR assessment</h3>
        <div className="filter d-flex align-items-center justify-content-end flex-wrap gap-2">
          <ul className="list-inline filter_action mb-0">
            <li className="list-inline-item">
              <CsvDownloader
                filename="View_Crosswalk"
                extension=".csv"
                className="btn-icon"
                columns={columnCsvDownload}
                datas={filteredData}
                text={<em className="icon-download" />}
              />
            </li>
          </ul>
        </div>
        <ReactDataTable
          data={currentData}
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
          isLoading={tableLoader}
          isPaginate={false}
        />
      </div>
    </>
  );
}

export default ViewCrosswalk;

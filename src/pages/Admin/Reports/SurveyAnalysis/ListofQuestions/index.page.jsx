import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTable } from "customHooks/useTable";
import { commonService } from "services/common.service";
import { useAuth } from "customHooks";
import { REPORTS_MANAGEMENT } from "apiEndpoints/ReportsManagement";
import { debounce } from "lodash";
import {
  Breadcrumb,
  InputField,
  ReactDataTable,
} from "../../../../../components";
import adminRouteMap from "../../../../../routes/Admin/adminRouteMap";

export default function ListofQuestions() {
  // breadcrumb
  const breadcrumb = [
    {
      path: "#!",
      name: "Reports",
    },

    {
      path: "#!",
      name: "Participant Response",
    },
    {
      path: "#",
      name: "List of Questions",
    },
  ];

  const [tableFilters] = useState({});
  const [searchValue, setSearchValue] = useState("");

  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  
  const handleSearchChange = debounce((e) => {
    setSearchValue(e.target.value);
  }, 500);

  const location = useLocation();
  const { companyID, surveyID } = location.state || {};

  const [questionListData, setQuestionListData] = useState([]);
  const [isTableLoader, setIsTableLoader] = useState(false);

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
    searchKeys: ["outcomes", "question", "questionNo", "intentionsShortName"],
    tableFilters,
    initialLimit: 10,
    data: questionListData,
  });

  const handleLimitChange = (value) => {
    setLimit(value);
    setOffset(1);
  };

  const handleOffsetChange = (value) => {
    setOffset(value);
  };

  useEffect(() => {
    const fetchListOfQuestions = async () => {
      setIsTableLoader(true);
      const response = await commonService({
        apiEndPoint: REPORTS_MANAGEMENT.fetchReportUsingSurveyANDCompanyId,
        queryParams: { companyID, surveyID },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        setIsTableLoader(false);
        if (response?.data?.data?.length > 0) {
          const listData = response?.data?.data;

          setQuestionListData(
            listData.map((val,index) => {
              return {
                serial_no:index+1,
                questionNo: val.ques_no?.replace('Q',""),
                outcomes: val.outcome,
                question: val.question,
                intentionsShortName: val.intention,
              };
            })
          );
        }
      } else {
        setIsTableLoader(false);
      }
    };

    fetchListOfQuestions();
  }, []);

  const downloadFromBuffer = (buffer) => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "report.xlsx";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const downoadQuestionList = async () => {
    const response = await commonService({
      apiEndPoint: REPORTS_MANAGEMENT.downloadQuestionList,
      queryParams: { companyID, surveyID, status: 1 },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
      responseType: "blob",
    });
    if (response?.status) {
      downloadFromBuffer(response.data);
    }
  };

  const columns = [
    {
      title: "S.no",
      dataKey: "serial_no",
      data: 'serial_no',
    },
    {
      title: "question no",
      dataKey: "questionNo",
      data: "questionNo",
    },
    {
      title: "Outcomes",
      dataKey: "outcomes",
      data: "outcomes",
    },
    {
      title: "Question",
      dataKey: "question",
      data: "question",
    },
    {
      title: "intentions short name",
      dataKey: "intentionsShortName",
      data: "intentionsShortName",
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
      <div className="pageContent">
        <div className="pageTitle d-flex align-items-center">
          <Link
            to={adminRouteMap.PARTICIPANTRESPONSE.path}
            className="backLink"
          >
            <em className="icon-back" />
          </Link>
          <h2 className="mb-0">List of Questions</h2>
        </div>
        <div className="filter d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div className="searchBar">
            <InputField
              type="text"
              placeholder="Search"
              onChange={handleSearchChange}
            />
          </div>
          <ul className="list-inline filter_action mb-0">
            <li className="list-inline-item">
              <Link
                to="#!"
                onClick={(e) => {
                  e.preventDefault();
                  downoadQuestionList();
                }}
                className="btn-icon ripple-effect"
              >
                <em className="icon-download" />
              </Link>
            </li>
          </ul>
        </div>
        {/* <DataTableComponent data={ListofQuestionsData} columns={columns}  /> */}

        <ReactDataTable
          data={currentData} // Changed from questionListData to currentData
          columns={columns}
          page={offset}
          totalLength={totalRecords}
          totalPages={totalPages}
          sizePerPage={limit}
          handleLimitChange={handleLimitChange}
          handleOffsetChange={handleOffsetChange}
          handleSort={handleSort}
          sortState={sortState}
          isLoading={isTableLoader}
        />
      </div>
    </>
  );
}

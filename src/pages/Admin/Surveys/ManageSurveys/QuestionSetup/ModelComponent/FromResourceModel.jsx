import React, { useEffect, useState } from "react";

import { commonService } from "services/common.service";
import { QuestionSetup } from "apiEndpoints/QuestionSetup";
import { useTable } from "customHooks/useTable";
import { Link } from "react-router-dom";
import { ModalComponent, ReactDataTable } from "../../../../../../components";

const FromResourceModel = ({
  showQuestionBank,
  questionBankClose,
  userData,
  handleAdd,
  companyID,
}) => {
  const [questions, setQuestions] = useState([]);
  const [searchValue] = useState("");
  const [tableFilters] = useState({});
  const [tableLoader, setTableLoader] = useState(false);

  // data table
  const columns = [
    {
      title: "s.no",
      dataKey: "s.no",
    },
    {
      title: "Response",
      dataKey: "response",
    },
    {
      title: "Hierarchy",
      dataKey: "hierarchy",
    },
    {
      title: "Action",
      dataKey: "action",
      columnHeaderClassName: "w-1 text-center no-sorting",
      columnClassName: "w-1 text-center",
      render: (_, row) => {
        return (
          <>
            <ul className="list-inline action mb-0">
              <li className="list-inline-item">
                <div className="addeletebtn d-flex gap-2">
                  {" "}
                  <Link
                    className="addbtn addscaler"
                    onClick={() => {
                      handleAdd(row);
                    }}
                  >
                    <span>+</span>
                  </Link>
                </div>
              </li>
            </ul>
          </>
        );
      },
    },
  ];

  const fetchQuestinList = async () => {
    try {
      setTableLoader(true);
      const response = await commonService({
        apiEndPoint: QuestionSetup.fetchBranchFilter,
        bodyData: {
          companyMasterID: userData?.companyMasterID,
          companyID,
          searchFrom: 95,
          keywords: "",
          draw: 1,
          start: 0,
          length: 500,
          search: { value: "", regex: true },
          order: [{ column: 0, dir: "asc" }],
          isExport: false,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        setQuestions(response?.data?.data);
        setTableLoader(false);
      }
    } catch (error) {
      console.error("Error add outcome:", error);
    }
  };

  useEffect(() => {
    fetchQuestinList();
  }, []);

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
    data: questions,
  });

  const handleLimitChange = (value) => {
    setLimit(value);
    setOffset(1);
  };

  const handleOffsetChange = (value) => {
    setOffset(value);
  };

  return (
    <ModalComponent
      modalHeader="Search & Add - From Resource"
      show={showQuestionBank}
      onHandleCancel={questionBankClose}
      size="xl"
    >
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
      />
    </ModalComponent>
  );
};

export default FromResourceModel;

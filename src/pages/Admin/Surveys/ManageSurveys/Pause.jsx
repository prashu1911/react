import React, { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { commonService } from "services/common.service";
import { SURVEYS_MANAGEMENT } from "apiEndpoints/SurveysManagement";
import CsvDownloader from "react-csv-downloader";
import { decodeHtmlEntities } from "utils/common.util";
import { statusFormatter } from "components/DataTable/TableFormatter";
import { ReactDataTable, SweetAlert } from "../../../../components";
import adminRouteMap from "../../../../routes/Admin/adminRouteMap";
import { useSurveyDataOnNavigations } from "../../../../customHooks";
import ExportExcel from "components/Excel";

export default function Pause({
  scheduleShow,
  searchData,
  userData,
  company,
  selectedTab,
  companyName,
  setSelectedActiveSurveyId,
}) {
  // State management
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [ListData, setListData] = useState([]);
  const [tableLoader, setTableLoader] = useState(false);
  const [render, setRender] = useState(false);
  const [targetRecord, setTargetRecord] = useState("");
  const { dispatcSurveyDataOnNavigateData } = useSurveyDataOnNavigations();

  const navigate = useNavigate();

  // Server-side pagination state
  const [tableState, setTableState] = useState({
    draw: 1,
    start: 0,
    length: 10,
    search: { value: "", regex: false },
    order: [{ column: 0, dir: "asc" }],
  });
  const [totalRecords, setTotalRecords] = useState(0);

  const getSurveyBycompanyID = async () => {
    setTableLoader(true);
    const response = await commonService({
      apiEndPoint: SURVEYS_MANAGEMENT.getManageSurvey,
      bodyData: {
        companyID: company,
        assessmentStatus: 6, // 6 for Pause/Continue
        ...tableState,
        search: {
          value: searchData || "",
          regex: false,
        },
        isExport: false,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });

    if (response?.status) {
      setListData(response?.data?.data?.data || []);
      setTotalRecords(
        (response?.data?.data?.recordsTotal &&
          response?.data?.data?.recordsFiltered) ||
          0
      );
      setTableLoader(false);
    } else {
      console.log("error");
      setTableLoader(false);
    }
  };

  useEffect(() => {
    if (selectedTab === "pause" && company) {
      getSurveyBycompanyID();
    }
  }, [searchData, company, selectedTab, render, tableState]);

  useEffect(() => {
    if (selectedTab !== "pause") {
      setTableState((prev) => ({
        ...prev,
        draw: 1,
        start: 0,
        length: 10,
        order: [{ column: 0, dir: "asc" }],
      }));
    }
  }, [selectedTab]);

  useEffect(() => {
    setTableState((prev) => ({
      ...prev,
      draw: 1,
      start: 0,
      length: 10,
      order: [{ column: 0, dir: "asc" }],
    }));
  }, [company]);

  // Pagination and sorting handlers
  const handleLimitChange = (value) => {
    setTableState((prev) => ({
      ...prev,
      length: parseInt(value),
      start: 0,
      draw: prev.draw + 1,
    }));
  };

  const handleOffsetChange = (page) => {
    setTableState((prev) => ({
      ...prev,
      start: (page - 1) * prev.length,
      draw: prev.draw + 1,
    }));
  };

  // Add column ID mapping
  const columnIdMap = {
    survey_name: 0,
    created_by: 1,
    created_at: 2,
    updated_at: 3,
  };

  // Add sortDirection state
  const [sortDirection, setSortDirection] = useState("asc");

  // Update handleSort to properly toggle direction
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
          column: columnIdMap[column] || 1,
          dir: newDirection,
        },
      ],
      draw: prev.draw + 1,
    }));
  };

  // Action handlers
  const handleContinue = async (row) => {
    const response = await commonService({
      apiEndPoint: SURVEYS_MANAGEMENT.continueSurvey,
      bodyData: {
        surveyID: row?.survey_id,
      },
      toastType: {
        success: true,
        error: false,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });
    if (response?.status) {
      setRender((prev) => !prev);
      getSurveyBycompanyID();
    }
  };

  const handleDelete = async () => {
    const response = await commonService({
      apiEndPoint: SURVEYS_MANAGEMENT.deleteSurvey,
      bodyData: {
        surveyID: targetRecord,
      },

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });
    if (response?.status) {
      await getSurveyBycompanyID(); // Refresh list after deletion
      setTargetRecord("");
      return true;
    } else {
      console.log("error");
      setTargetRecord("");
      return false;
    }
  };

  const onConfirmAlertModal = async () => {
    const result = await handleDelete();
    setIsAlertVisible(false);
    return result;
  };
  const deleteModal = (row) => {
    setTargetRecord(row?.survey_id);
    setIsAlertVisible(true);
  };

  const editModal = (row) => {
    dispatcSurveyDataOnNavigateData({ survey: row, companyID: company });
    setTimeout(() => {
      navigate("/review-and-edit", { state: { survey: row } });
    }, [100]);
  };

  const handleClose = async (row) => {
    const response = await commonService({
      apiEndPoint: SURVEYS_MANAGEMENT.closeSurvey,
      bodyData: {
        surveyID: row?.survey_id,
      },
      toastType: {
        success: true,
        error: false,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });
    if (response?.status) {
      setRender((prev) => !prev);
    } else {
      console.log("error");
    }
  };

  const handleQuestionSetup = (row) => {
    dispatcSurveyDataOnNavigateData({ survey: row, companyID: company });
    setTimeout(() => {
      navigate(adminRouteMap.QUESTIONSETUP.path);
    }, [100]);
  };

  const handleProgressReport = (row) => {
    dispatcSurveyDataOnNavigateData({ survey: row, companyID: company });
    setTimeout(() => {
      navigate(adminRouteMap.DASHBOARD.path);
    }, [100]);
  };

  const handleAuditTrial = (row) => {
    setTimeout(() => {
      navigate(adminRouteMap.AUDITTRAIL.path, {
        state: {
          survey: {
            ...row,
            companyName, // Add company name directly here
          },
        },
      });
    }, [100]);
  };

  const handleSaveResource = (row) => {
    const surveyDetails = {
      companyId: company,
      saveresource: {
        survey_id: row?.survey_id,
        survey_name: row?.survey_name,
      },
    };

    navigate(adminRouteMap.SAVERESOURCE.path,{state:surveyDetails});
  };

  // Column definitions
  const columns = [
    {
      title: "#",
      dataKey: "s.no",
      data: "s.no",
      columnHeaderClassName: "no-sorting w-1 text-center",
    },
    {
      title: "Name",
      dataKey: "survey_name",
      data: "Name",
      sortable: true,
    },
    {
      title: "Created By",
      dataKey: "created_by",
      data: null,
      sortable: true,
    },
    {
      title: "Created Date",
      dataKey: "created_at",
      data: "Created",
      sortable: true,
      render: (data) => {
        return data?.split(" ")[0];
      },
    },
    {
      title: "Modified Date",
      dataKey: "updated_at",
      data: "Modified",
      sortable: true,
      render: (data) => {
        return data?.split(" ")[0];
      },
    },
    {
      title: "Questions",
      dataKey: "question",
      data: "Questions",
    },
    {
      title: "Participant",
      dataKey: "participant",
      data: "Participant",
    },
    {
      title: "Responses",
      dataKey: "response",
      data: "Responses",
    },
    {
      title: "Status",
      dataKey: "status",
      data: "status",
      columnClassName: "align-top",
      render: (data) => {
        return statusFormatter(data);
      },
    },
    {
      title: "Action",
      dataKey: "action",
      // data:"action",
      columnHeaderClassName: "w-1 text-center no-sorting",
      columnClassName: "w-1 text-center",
      render: (data, row) => {
        return (
          <>
            <ul className="list-inline action mb-0">
              <li className="list-inline-item">
                <Link
                  className="icon-primary"
                  onClick={() => {
                    editModal(row);
                  }}
                >
                  <em className="icon-table-edit" />
                </Link>
              </li>
              <li className="list-inline-item">
                <Link
                  className="icon-danger"
                  onClick={() => {
                    deleteModal(row);
                  }}
                >
                  <em className="icon-delete" />
                </Link>
              </li>
              <li className="list-inline-item">
                <Dropdown>
                  <Dropdown.Toggle as="a" className="icon-secondary">
                    <em className="icon-settings-outline" />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => {
                        navigate("/assign-send", {
                          state: {
                            companyId: company,
                            surveyId: row?.survey_id,
                          },
                        });
                      }}
                    >
                      <em className="icon-users-group-outline" />
                      Assign Survey
                    </Dropdown.Item>
                    <Dropdown.Item
                      href="#!"
                      onClick={() => {
                        setSelectedActiveSurveyId(row?.survey_id);
                        scheduleShow();
                      }}
                    >
                      <em className="icon-booking" />
                      Create Schedule
                    </Dropdown.Item>
                    <Dropdown.Item href="#!">
                      <em className="icon-report" />
                      Progress Report
                    </Dropdown.Item>
                    <Dropdown.Item href="#!">
                      <Link onClick={() => handleQuestionSetup(row)}>
                        {" "}
                        <em className="icon-chat-question" />
                        Question Set-Up{" "}
                      </Link>
                    </Dropdown.Item>
                    <Dropdown.Item href="#!">
                      <Link onClick={() => handleAuditTrial(row)}>
                        {" "}
                        <em className="icon-audit-list" />
                        Audit Trail{" "}
                      </Link>
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleSaveResource(row)}>
                      {/* <Link
                       
                      > */}
                        {" "}
                        <em className="icon-resources" />
                        Save to Resources{" "}
                      {/* </Link> */}
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleContinue(row)}>
                      <em className="icon-pause-circle" />
                      Continue
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => {
                        handleClose(row.id);
                      }}
                    >
                      <em className="icon-close-circle" />
                      Close
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </li>
            </ul>
            <SweetAlert
              title="Are you sure?"
              text="You want to delete this data!"
              show={isAlertVisible}
              icon="warning"
              onConfirmAlert={onConfirmAlertModal}
              showCancelButton
              cancelButtonText="Cancel"
              confirmButtonText="Yes"
              setIsAlertVisible={setIsAlertVisible}
              isConfirmedTitle="Deleted!"
              isConfirmedText="Your file has been deleted."
            />
          </>
        );
      },
    },
  ];

  // CSV download configuration
  const columnCsvDownload = [
    {
      displayName: "S.No",
      id: "s.no",
    },
    {
      displayName: "Name",
      id: "name",
    },
    {
      displayName: "Status",
      id: "status",
    },
    {
      displayName: "Created By",
      id: "createdBy",
    },
    {
      displayName: "Created Date",
      id: "created",
    },
    {
      displayName: "Modified Date",
      id: "modified",
    },
    {
      displayName: "Questions",
      id: "questions",
    },
    {
      displayName: "Participant",
      id: "participant",
    },
    {
      displayName: "Responses",
      id: "responses",
    },
  ];

  const filteredData = ListData.map((item, index) => {
    return {
      "s.no": index + 1,
      name: decodeHtmlEntities(item?.survey_name),
      status: decodeHtmlEntities(item?.status),
      category: decodeHtmlEntities("undefined"),
      type: decodeHtmlEntities("undefined"),
      createdBy: decodeHtmlEntities(item?.created_by),
      created: decodeHtmlEntities(item?.created_at?.split(" ")[0]),
      modified: decodeHtmlEntities(
        item?.updated_at && item?.updated_at?.split(" ")[0]
      ),
      questions: decodeHtmlEntities(item?.question),
      participant: decodeHtmlEntities(item?.participant),
      responses: decodeHtmlEntities(item?.response),
    };
  });

  const downloadDataForExcel = async () => {
    if (company) {
      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT.getManageSurvey,
        bodyData: {
          companyID: company,
          assessmentStatus: 6, // 6 for Pause/Continue
          ...tableState,
          search: {
            value: searchData || "",
            regex: false,
          },
          isExport: true,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (
        Array.isArray(response?.data?.data?.data) &&
        response?.data?.data?.data?.length > 0
      ) {
        const updatedArr = response?.data?.data?.data.map((item, index) => {
          return {
            "s.no": index + 1,
            name: decodeHtmlEntities(item?.survey_name),
            status: decodeHtmlEntities(item?.status),
            category: decodeHtmlEntities("undefined"),
            type: decodeHtmlEntities("undefined"),
            createdBy: decodeHtmlEntities(item?.created_by),
            created: decodeHtmlEntities(item?.created_at?.split(" ")[0]),
            modified: decodeHtmlEntities(
              item?.updated_at && item?.updated_at?.split(" ")[0]
            ),
            questions: decodeHtmlEntities(item?.question),
            participant: decodeHtmlEntities(item?.participant),
            responses: decodeHtmlEntities(item?.response),
          };
        });
        return updatedArr;
      } else {
        console.log("error");
      }
    }
  };

  return (
    <>
      <div className="d-flex justify-content-end mb-3">
        {/* <Link className="btn-icon ripple-effect check-button">
          <CsvDownloader
            filename="Manage_surveys_pause"
            extension=".csv"
            className="downloadBtn "
            columns={columnCsvDownload}
            datas={filteredData}
            text={<em className="icon-download" />}
          />
        </Link> */}
        <ul className="list-inline filter_action mb-0">
          <li
            className="list-inline-item tooltip-container"
            data-title="Download All"
          >
            <ExportExcel
              filename="Pause_Survey_List"
              columns={columnCsvDownload}
              data={downloadDataForExcel}
              text={<em className="icon-download" />}
            />
          </li>
        </ul>
      </div>
      <ReactDataTable
        data={ListData}
        columns={columns}
        page={Math.floor(tableState.start / tableState.length) + 1}
        totalLength={totalRecords}
        totalPages={Math.ceil(totalRecords / tableState.length)}
        sizePerPage={tableState.length}
        handleLimitChange={handleLimitChange}
        handleOffsetChange={handleOffsetChange}
        searchValue={searchData}
        handleSort={handleSort}
        sortState={{
          column: tableState.order[0].column,
          direction: sortDirection,
        }}
        isLoading={tableLoader}
        serverSide
      />
    </>
  );
}

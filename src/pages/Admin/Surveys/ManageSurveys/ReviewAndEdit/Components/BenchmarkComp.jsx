import { SURVEYS_MANAGEMENT } from "apiEndpoints/SurveysManagement";
import { ReactDataTable, SweetAlert } from "components";
import { useAuth } from "customHooks";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { commonService } from "services/common.service";
import AddBenchmarkComp from "./SubComponents/AddBenchmarkComp";
import ViewBenchmark from "./SubComponents/ViewBenchmark";
import EditBenchmark from "./SubComponents/EditBenchmark";
import UploadBenchmark from "./SubComponents/UploadBenchmark";

const BenchmarkComp = ({ companyID, surveyID }) => {
  const [tableLoader, setTableLoader] = useState([]);
  const [tableState, setTableState] = useState([]);
  const [actionType, setActionType] = useState(null);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [activeBenchmarkId, setActiveBenchmarkId] = useState(null);
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  const columns = [
    {
      title: "S.No.",
      dataKey: "s.no",
      // data: 's.no',
      data: (row, index) => index + 1, // Correct S.No. based on pagination
      columnHeaderClassName: "no-sorting w-1 text-center",
    },
    {
      title: "Benchmark",
      dataKey: "name",
      data: "name",
      sortable: false,
    },
    {
      title: "Status",
      dataKey: "status",
      data: "status",
      sortable: false,
      width: "100px",
      render: (data, row) => {
        return row.status ? (
          <span className={`status status-active`}>{"Active"}</span>
        ) : (
          <span className={`status status-paused`}>{"Deleted"}</span>
        );
      },
    },
    {
      title: "Action",
      dataKey: "Action",
      data: null,
      columnHeaderClassName: "w-1 text-center no-sorting",
      columnClassName: "w-1 text-center",
      render: (data, row) => {
        return (
          <ul className="list-inline action mb-0">
            <li
              className="list-inline-item tooltip-container"
              data-title="View"
            >
              <Link
                className="icon-primary"
                onClick={() => {
                  setActiveBenchmarkId(row.benchmarkID);
                  setActionType("view");
                }}
              >
                <em className="icon-eye" />
              </Link>
            </li>
            <li
              className="list-inline-item tooltip-container"
              data-title="Edit"
            >
              <Link
                className="icon-primary"
                onClick={() => {
                  setActiveBenchmarkId(row.benchmarkID);
                  setActionType("edit");
                }}
              >
                <em className="icon-table-edit" />
              </Link>
            </li>
            <li
              className="list-inline-item tooltip-container"
              data-title="Delete"
            >
              <Link
                className="icon-danger"
                onClick={() => {
                  setActiveBenchmarkId(row?.benchmarkID);
                  setIsAlertVisible(true);
                }}
              >
                <em className="icon-delete" />
              </Link>
            </li>
          </ul>
        );
      },
    },
  ];

  const getBenchMarks = async () => {
    setTableLoader(true);
    try {
      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT.benchmarkListing,
        queryParams: { surveyID },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        setTableState(response?.data?.data || []);
        // setTotalRecords(response?.data?.recordsTotal || response?.data?.recordsFiltered || 0);
        setTotalRecords(
          searchValue
            ? response.data.recordsFiltered ?? 0
            : response.data.recordsTotal ?? 0
        );
      }
    } catch (error) {
      // logger(error);
    }
    setTableLoader(false);
  };

  useEffect(() => {
    getBenchMarks();
  }, []);

  const deleteBenchmark = async (benchmarkID) => {
    try {
      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT.deleteBenchmark,
        queryParams: { benchmarkID },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        toastType: {
          success: "Company deleted successfully",
          error: "Company delete failed",
        },
      });
      if (response?.status) {
        setIsAlertVisible(false);
        getBenchMarks();
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error deleting company:", error);
      return false;
    }
  };

  const onConfirmAlertModal = async () => {
    const deleteRes = await deleteBenchmark(activeBenchmarkId);
    return deleteRes;
  };

  const cancelAction = () => {
    setActionType(null);
    setActiveBenchmarkId(null);
    getBenchMarks();
  };
  return (
    <div>
      <div className="d-flex align-items-center justify-content-end gap-2 p-2">
        <Link
          href="#!"
          className="link-primary"
          onClick={(e) => {
            e.preventDefault();
            setActionType("add");
          }}
        >
          Add Benchmark
        </Link>
        <Link
          href="#!"
          className="link-primary"
          onClick={(e) => {
            e.preventDefault();
            setActionType("upload");
          }}
        >
          Upload Excel
        </Link>
      </div>

      {/* List of benchmark */}
      <div>
        <ReactDataTable
          data={tableState}
          columns={columns}
          page={1}
          // totalLength={totalRecords}
          // totalPages={Math.ceil(totalRecords / tableState.length)}
          sizePerPage={tableState.length}
          // handleLimitChange={handleLimitChange}
          // handleOffsetChange={handleOffsetChange}
          // searchValue={searchValue}
          // handleSort={handleSort}
          // sortState={{
          //   column: Object.keys(columnIdMap).find(
          //     (key) => columnIdMap[key] === tableState.order[0].column
          //   ),
          //   direction: sortDirection,
          // }}
          columnWidths={{2:'100px'}}
          isLoading={tableLoader}
          isPaginate={false}
          // serverSide
        />
      </div>

      <AddBenchmarkComp
        type={actionType}
        surveyID={surveyID}
        companyID={companyID}
        companyMasterId={userData?.companyMasterID}
        setActionType={cancelAction}
      />

      <ViewBenchmark
        type={actionType}
        surveyID={surveyID}
        companyID={companyID}
        companyMasterId={userData?.companyMasterID}
        setActionType={cancelAction}
        benchmarkID={activeBenchmarkId}
      />

      <EditBenchmark
        type={actionType}
        surveyID={surveyID}
        companyID={companyID}
        companyMasterId={userData?.companyMasterID}
        setActionType={cancelAction}
        benchmarkID={activeBenchmarkId}
      />

      <UploadBenchmark
        type={actionType}
        surveyID={surveyID}
        companyID={companyID}
        companyMasterId={userData?.companyMasterID}
        setActionType={cancelAction}
      />

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
        isConfirmedText="Benchmark has been deleted."
      />
    </div>
  );
};

export default BenchmarkComp;

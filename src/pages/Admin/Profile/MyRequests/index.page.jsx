import React, { useState } from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTable } from "customHooks/useTable";
import {
  InputField,
  Loader,
  ModalComponent,
  ReactDataTable,
} from "../../../../components";

export default function MyRequests({
  ticketData,
  setCurrentTicketId,
  currentTicketData,
  isCurrentTicketLoader,
  formatDateTime,

  
}) {
  // my request modal
  const [showMyRequests, setShowMyRequests] = useState(false);
  const myRequestsClose = () => setShowMyRequests(false);
  const myRequestsShow = () => setShowMyRequests(true);

  const [searchValue, setSearchValue] = useState("");
  const [tableFilters] = useState({});

  const {
    totalRecords,
    totalPages,
    offset,
    limit,
    sortState,
    handleSort,
    currentData,
  } = useTable({
    searchValue,
    searchKeys: ["subject"],
    tableFilters,
    initialLimit: 100,
    data: ticketData,
  });

  const columns = [
    {
      title: "#",
      dataKey: "id",
      data: "id",
      columnHeaderClassName: "no-sorting w-1 text-center",
    },
    {
      title: "Subject",
      dataKey: "subject",
      data: "subject",
    },
    {
      title: "Date",
      dataKey: "date",
      data: "date",
    },
    {
      title: "Action",
      dataKey: "action",
      data: null,
      columnHeaderClassName: "w-1 text-center no-sorting",
      columnClassName: "w-1 text-center",
      render: (val, data) => {
        return (
          <>
            <ul className="list-inline action mb-0">
              <li className="list-inline-item">
                <Link
                  to="#!"
                  className="icon-primary"
                  onClick={() => {
                    setCurrentTicketId(data.ticket_id);
                    myRequestsShow();
                  }}
                >
                  <em className="icon-eye" />
                </Link>
              </li>
            </ul>
          </>
        );
      },
    },
  ];
  return (
    <>
      <Card>
        <div className="filter">
          <div className="searchBar">
            <InputField
              type="text"
              placeholder="Search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </div>
        <ReactDataTable
          isPaginate={false}
          data={currentData}
          columns={columns}
          page={offset}
          totalLength={totalRecords}
          totalPages={totalPages}
          sizePerPage={limit}
          handleSort={handleSort}
          sortState={sortState}
          columnWidths={[20,280,70,20]} // <- optional

          //   isLoading={isTableLoader}
        />
      </Card>
      {/* view modal */}
      <ModalComponent
        modalHeader="My Requests"
        extraClassName="myRequestModal"
        show={showMyRequests}
        onHandleCancel={myRequestsClose}
      >
        {isCurrentTicketLoader ? (
          <Loader />
        ) : (
          <ul className="mb-0 list-unstyled">
            <li>
              <label className="pe-1">Date And Time:</label>
              <span>{formatDateTime(currentTicketData.created_at)}</span>
            </li>
            <li>
              <label className="pe-1">Subject:</label>
              <span>{currentTicketData.subject} </span>
            </li>
            <li>
              <label className="pe-1">Request Detail:</label>
              <span>{currentTicketData.request} </span>
            </li>
          </ul>
        )}
      </ModalComponent>
    </>
  );
}

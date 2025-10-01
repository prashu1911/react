import React, { useState } from "react";
import { Link } from "react-router-dom";
import { decodeHtmlEntities } from "utils/common.util";
import { Spinner } from "react-bootstrap";
import { ModalComponent } from "..";

<style>
{`
  .table-bordered td,
  .table-bordered th {
    border: 1px solid black !important;
  }
`}
</style>

// Wrap the ReactDataTable component in React.memo
const ReactDataTable = React.memo(
  ({
    columns,
    data,
    page,
    totalLength,
    sizePerPage,
    handleLimitChange,
    handleOffsetChange,
    totalPages,
    handleSort,
    sortState,
    isLoading,
    isPaginate = true,
    isCrosstab = false,
    columnWidths = [], // <- new optional prop

  }) => {
    const [showMore, setShowMore] = useState(false);
    const [showMoreData, setShowMoreData] = useState("");

    const handleShowMore = (cellContent) => {
      setShowMore((prev) => !prev);
      if (cellContent) {
        setShowMoreData(cellContent);
      } else {
        setShowMoreData("");
      }
    };

    const renderCellContent = (row, column, rowIndex) => {
      let cellContent = row[column.dataKey];
      // Check if there's a custom render method defined for the column
      if (column.render) {
        return column.render(cellContent, row);
      }

      // Check if the content is too long, and if so, add "Show More" functionality
      if (typeof cellContent === "string" && column?.dataKey === "question") {
        return (
          <div style={{
            maxWidth: "550px",
            minWidth: "300px"
          }}>
            <span style={{
              textWrap: "wrap",
            }}>{cellContent}</span>
            {/* <Link
              className="showMore link-primary"
              onClick={() => handleShowMore(cellContent)}
            >
              Read More
            </Link> */}
          </div>
        );
      }
      // this condition is added for managing automatic serial number
      if (column.dataKey === "s.no") {
        cellContent = (page - 1) * parseInt(sizePerPage) + rowIndex + 1;
      }

      return decodeHtmlEntities(cellContent);
    };

    const goToPage = (pagedata) => {
      handleOffsetChange(pagedata);
    };

    const handleSelect = (e) => {
      handleLimitChange(e.target.value);
    };

    // Function to handle column click and toggle sort direction
    const handleColumnClick = (columnKey) => {
      const currentSortDirection = sortState[columnKey] || "asc";
      const newSortDirection = currentSortDirection === "asc" ? "desc" : "asc";
      handleSort(columnKey, newSortDirection);
    };

    const renderCrosstabTable = () => {
      return (
        <table className="table w-100 table-bordered border-dark">
          <thead>
            <tr>
              {columns?.map((column, index) => (
               <th
               className={`${column?.columnHeaderClassName || ""}`.trim()}
               data-orderable={column?.columnOrderable}
                  key={index}
             >
               {column.title}
             </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="text-center tableLoader">
                  <Spinner animation="border" size="sm" style={{ marginRight: "10px" }} />
                  Loading...
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column, colIndex) => {
                    // Special handling for number and question columns with rowspan
                    if (column.dataKey === 'number' || column.dataKey === 'question') {
                      return row.rowspan > 0 ? (
                        <td
                          className={column?.columnClassName} 
                        key={colIndex}
                          rowSpan={row.rowspan}
                          style={{ verticalAlign: 'top' }}
                      >
                        {renderCellContent(row, column, rowIndex)}
                      </td>
                      ) : null;
                    }
                    // Regular columns - show content even if it's 0
                    return (
                      <td
                      key={colIndex}
                      style={{
                        textAlign: /count|total/i.test(column.title)
                          ? 'center'
                          : /[%]|percent/i.test(column.title)
                          ? 'right'
                          : 'left',
                      }}
                    >
                      <div
                        style={{
                          textAlign: /count|total/i.test(column.title)
                            ? 'center'
                            : /[%]|percent/i.test(column.title)
                            ? 'right'
                            : 'left',
                        }}
                      >
                        {row[column.dataKey] !== undefined
                          ? renderCellContent(row, column, rowIndex)
                          : ''}
                      </div>
                    </td>
                    

                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center">
                  No Records Found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      );
    };

    return (
      <>
        <div className="commonTable dataTable dt-container dt-empty-footer">
          <div className="table-responsive datatable-wrap mb-3">
            {isCrosstab ? renderCrosstabTable() : (
              <table
                className="table w-100"
                style={columnWidths && columnWidths.length > 0 ? { tableLayout: "fixed" } : {}}
              >
                <thead>
                  <tr>
                    {columns?.map((column, index) => {
                      const dynamicClass = column.sortable
                        ? `sorting ${
                            sortState[column.dataKey] === "asc"
                              ? "sorting_asc"
                              : sortState[column.dataKey] === "desc"
                                ? "sorting_desc"
                                : ""
                          }`
                        : "";
                      return (
                        <th
                        key={index}
                          style={
                            columnWidths && columnWidths[index]
                              ? { width: columnWidths[index], wordBreak: "break-word", whiteSpace: "normal" }
                              : {}
                          }
                        className={`${column?.columnHeaderClassName || ""} ${dynamicClass}`.trim()}
                        data-orderable={column?.columnOrderable}
                          onClick={() =>
                            column.sortable && handleColumnClick(column.dataKey)
                          }
                      >
                        {column.title}
                      </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={columns.length} className="text-center tableLoader">
                        <Spinner animation="border" size="sm" style={{ marginRight: "10px" }} />
                        Loading...
                      </td>
                    </tr>
                  ) : data.length > 0 ? (
                    data.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {columns.map((column, colIndex) => (
                          <td
                            className={column?.columnClassName}
                            key={colIndex}
                            style={
                              columnWidths && columnWidths[colIndex]
                                ? { width: columnWidths[colIndex], wordBreak: "break-word", whiteSpace: "normal" }
                                : {}
                            }
                          >
                            {renderCellContent(row, column, rowIndex)}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={columns.length} className="text-center">
                        No Records Found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
          {isPaginate && (
            <div
              id=""
              className="table__footer d-block d-flex align-items-center justify-content-between flex-lg-row flex-column gap-2"
            >
              <div
                id=""
                className="d-block d-flex pageLenth align-items-center gap-3"
              >
                <div className="dt-length">
                  <label htmlFor="dt-length-1">
                    Entries Per Page{" "}
                    <select className="dt-input" onChange={handleSelect}>
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>{" "}
                  </label>
                </div>
                <div
                  className="dt-info"
                  aria-live="polite"
                  id="DataTables_Table_0_info"
                  role="status"
                >
                  Showing{" "}
                  {totalLength > 0
                    ? (parseInt(page) - 1) * parseInt(sizePerPage) + 1
                    : totalLength}{" "}
                  to{" "}
                  {totalLength > 0
                    ? page * sizePerPage <= totalLength
                      ? page * sizePerPage
                      : totalLength
                    : totalLength}{" "}
                  of {totalLength} entries
                </div>
              </div>
              <div
                id=""
                className="table__footer__right d-block d-sm-flex align-items-center"
              >
                <div className="dt-paging paging_full_numbers">
                  <nav>
                    <button
                      className={`dt-paging-button first ${page === 1 ? "disabled" : ""}`}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        goToPage(1);
                      }}
                    >
                      First
                    </button>
                    <button
                      className={`dt-paging-button previous ${page === 1 ? "disabled" : ""}`}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        goToPage(page - 1);
                      }}
                    >
                      Previous
                    </button>
                    {Array.from(Array(totalPages).keys()).map((row) => {
                      if (totalPages < 5) {
                        return (
                          <button
                            className={`dt-paging-button next ${page === row + 1 ? "current" : ""}`}
                            onClick={(e) => {
                              e.preventDefault();
                              if (page !== row + 1) {
                                goToPage(row + 1);
                              }
                            }}
                          >
                            {row + 1}
                          </button>
                        );
                      }
                      if (totalPages >= 5) {
                        if (page < 3) {
                          if (totalPages === row + 1) {
                            return (
                              <button
                                className={`dt-paging-button ${page === row + 1 ? "current" : ""}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (page !== row + 1) {
                                    goToPage(row + 1);
                                  }
                                }}
                              >
                                {row + 1}
                              </button>
                            );
                          }
                          return row < 3 ? (
                            <>
                              <button
                                className={`dt-paging-button ${page === row + 1 ? "current" : ""}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (page !== row + 1) {
                                    goToPage(row + 1);
                                  }
                                }}
                              >
                                {row + 1}
                              </button>
                              {row === 2 && page < 3 ? (
                                <button
                                  className="dt-paging-button disabled"
                                  onClick={(e) => {
                                    e.preventDefault();
                                  }}
                                >
                                  . . .
                                </button>
                              ) : (
                                <></>
                              )}
                            </>
                          ) : (
                            <></>
                          );
                        }
                        if (page >= 3) {
                          if (row === 0) {
                            return (
                              <>
                                <button
                                  className={`dt-paging-button ${page === row + 1 ? "current" : ""}`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (page !== row + 1) {
                                      goToPage(row + 1);
                                    }
                                  }}
                                >
                                  {row + 1}
                                </button>
                                {page >= 4 ? (
                                  <button
                                    className="dt-paging-button disabled"
                                    onClick={(e) => {
                                      e.preventDefault();
                                    }}
                                  >
                                    . . .
                                  </button>
                                ) : (
                                  <></>
                                )}
                              </>
                            );
                          }
                          if (row + 1 === totalPages) {
                            return (
                              <>
                                {page <= totalPages - 4 ? (
                                  <button
                                    className="dt-paging-button disabled"
                                    onClick={(e) => {
                                      e.preventDefault();
                                    }}
                                  >
                                    . . .
                                  </button>
                                ) : (
                                  <></>
                                )}
                                <button
                                  className={`dt-paging-button ${page === row + 1 ? "current" : ""}`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (page !== row + 1) {
                                      goToPage(row + 1);
                                    }
                                  }}
                                >
                                  {row + 1}
                                </button>
                              </>
                            );
                          }
                          if (page >= row - 1 && page <= row + 2) {
                            return (
                              <button
                                className={`dt-paging-button ${page === row + 1 ? "current" : ""}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (page !== row + 1) {
                                    goToPage(row + 1);
                                  }
                                }}
                              >
                                {row + 1}
                              </button>
                            );
                          }
                          return <></>;
                        }
                      }
                    })}
                    <button
                      className={`dt-paging-button next ${totalPages <= page ? "disabled" : ""}`}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        goToPage(page + 1);
                      }}
                    >
                      Next
                    </button>
                    <button
                      className={`dt-paging-button last ${totalPages <= page ? "disabled" : ""}`}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        goToPage(totalPages);
                      }}
                    >
                      Last
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        <ModalComponent
          modalHeader="Read More"
          show={showMore}
          onHandleCancel={() => handleShowMore("")}
        >
          <div className="text-break">{decodeHtmlEntities(showMoreData)}</div>
        </ModalComponent>
        <>
  {/* ...your JSX table and pagination stuff... */}

  <style>
{`
  .table-bordered td,
  .table-bordered th {
    border: 1px solid #999999 !important; /* or use rgba(0, 0, 0, 0.3) */
    color: #333; /* optional: lighter text as well */
  }
`}
</style>

</>

      </>
    );
  }
);

export default ReactDataTable;

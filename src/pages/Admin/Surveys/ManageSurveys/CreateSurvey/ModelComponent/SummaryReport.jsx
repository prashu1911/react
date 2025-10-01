/* eslint-disable react/no-danger */
import PieChart from "pages/Admin/Surveys/Charts/PieChart";
import React from "react";
import Chart from "react-apexcharts";
// eslint-disable-next-line import/no-extraneous-dependencies
import { usePDF } from "react-to-pdf";

function SummaryReport({
  previewData,
  isEditPage,
  detailChart,
  summaryChart,
  reportType,
}) {
  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });

  // Destructure with default values to prevent undefined errors
  const {
    chartOptions = {
      xaxis: {
        categories: [],
      },
    },
    seriesData = [],
    chartType = "bar",
    reportName = "",
    openingComment = "",
    closingComment = "",
  } = previewData || {};

  // Add safety check for render
  if (!chartOptions || !seriesData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pageContent p-0">
      <div className="pageTitle d-flex justify-content-end align-items-center">
        <ul className="filter_action list-unstyled mb-0">
           {/* <li>
            <button
              onClick={() => toPDF()}
              type="button"
              aria-label="Download PDF"
              className="btn-icon ripple-effect"
            >
              <em className="icon-download" />
            </button>
          </li> */}
        </ul>
      </div>
      <div ref={targetRef}>
        <div className="reportCard">
          <h3 className="reportCard_title">
            {reportName || "User Summary Report"}
          </h3>
          <div className="reportCard_barchart">
            <div className="reportCard_barchart_inner">
              {isEditPage ? (
                <>
                  {reportType === "Summary"
                    ? summaryChart(chartType)
                    : detailChart(chartType)}
                </>
              ) : (
                <Chart
                  options={chartOptions}
                  series={seriesData}
                  type={chartType}
                  height={350}
                />
              )}
            </div>
          </div>
          <div className="reportCard_table">
            <table className="mt-xxl-3 mt-2">
              <thead>
                <tr>
                  <th>Outcomes / Participants</th>
                  {chartType !== "scatter" &&
                    seriesData?.map((series, index) => (
                      <th key={index}>{series.name}</th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {chartOptions?.xaxis?.categories?.map((category, rowIndex) => (
                  <tr key={rowIndex}>
                    <td>{category}</td>
                    {chartType !== "scatter" &&
                      seriesData?.map((series, colIndex) => (
                        <td key={colIndex}>{series.data?.[rowIndex] || "-"}</td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="reportCard_info d-flex justify-content-between gap-1 flex-wrap">
            <span>Report Generated at {new Date().toLocaleString()}</span>
            <span>© 2022, Metolius®</span>
          </div>
        </div>
        <div className="reportCard">
          <h3 className="reportCard_title">Summarized Report Details</h3>
          <div className="reportCard_table">
            <table>
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Data Point</th>
                  <th>Filter</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Department</td>
                  <td>All</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Participants</td>
                  <td>All</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            className="my-xl-3 my-2 reportCard_opComment"
            dangerouslySetInnerHTML={{ __html: openingComment }}
          />
         
          {reportType === "Detail" && (
            <>
              <div className="d-flex flex-column">
                <div className="d-flex align-items-center justify-content-center flex-column">
                  <h5 className="p-2">Demographic Response</h5>
                  <p className="text-muted">
                    How long have you worked at this company
                  </p>
                </div>
                <div className="d-flex justify-content-center">
                  <PieChart
                    xaxisLabel={[
                      "Less than 6 months",
                      "Six months to less than a year",
                      "At least one but less than 3 years",
                      "At least three but less than 6 years",
                      "At least six but less than 11 years",
                    ]}
                    series={[44, 33, 23, 12]}
                  />
                </div>
              </div>
              <div className="d-flex flex-column">
                <h5>Open Ended Question Response</h5>
                <div>
                  <div className="reportCard_table">
                    <table>
                      <thead>
                        <tr>
                          <th>Question</th>
                          <th>Sample OEQ </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>OEQ Response (1)</td>
                          <td>Sample OEQ Response 2</td>
                        </tr>
                        <tr>
                          <td>OEQ Response (2)</td>
                          <td>Sample OEQ Response 2</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}

           <div
            className="mb-3 reportCard_opComment"
            dangerouslySetInnerHTML={{ __html: closingComment }}
          />

          <div className="reportCard_info d-flex justify-content-between gap-1 flex-wrap">
            <span>Report Generated at {new Date().toLocaleString()}</span>
            <span>© 2022, Metolius®</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SummaryReport;

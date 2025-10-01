import React, { useEffect, useState } from "react";
import { ProgressBar } from "react-bootstrap";
import { Doughnut } from "react-chartjs-2";
import { Link } from "react-router-dom";
import { Col, Row, Dropdown } from "react-bootstrap";
import { Tooltip } from "bootstrap"; // Bootstrap must be installed
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart as ChartJS, ArcElement, Tooltip as cTooltip, Legend } from "chart.js";
import { useAuth } from "customHooks";

ChartJS.register(ArcElement, cTooltip, Legend, ChartDataLabels);

export default function FavorabilityIndexTable({ byIntention = false, SectionData }) {
  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach((el) => new Tooltip(el));
  }, []);

  const { getloginUserData } = useAuth();
  const userData = getloginUserData();

  const [collapsedNodeIDs, setCollapsedNodeIDs] = useState([]);

  const toggleCollapseNode = (id) => {
    setCollapsedNodeIDs(
      (prev) =>
        prev.includes(id)
          ? prev.filter((item) => item !== id) // Remove from collapsed → now expanded
          : [...prev, id] // Add to collapsed
    );
  };

  const priorityOutcomes = ["Engagement", "Manager Effectiveness", "Equip Factors"];

  function sortOutcomesByPriority(favorabilityData) {
    if (userData?.companyMasterID != 8) {
      return favorabilityData;
    }
    return [...favorabilityData].sort((a, b) => {
      const aIndex = priorityOutcomes.indexOf(a.outcome_name);
      const bIndex = priorityOutcomes.indexOf(b.outcome_name);

      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  }

  const data = {
    labels: SectionData?.attributeData?.widgetData?.favorabilityData?.favorData?.map((item) => item.favorName),
    datasets: [
      {
        data: SectionData?.attributeData?.widgetData?.favorabilityData?.favorData?.map((item) => item.favorPercentage),
        value: SectionData?.attributeData?.widgetData?.favorabilityData?.favorData?.map((item) => item.responseCount),
        backgroundColor: SectionData?.attributeData?.widgetData?.themeData.map((item) => item.color),
      },
    ],
  };

  const options = {
    cutout: "70%",
    hoverOffset: 20,
    responsive: true,
    maintainAspectRatio: false,
    animate: false,
    plugins: {
      tooltip: {
        backgroundColor: "#f5f5f5",
        bodyColor: "#000",
        displayColors: false,
        cornerRadius: 0,
        bodyFont: { size: 12 },
        callbacks: {
          title: () => "",
          label: (tooltipItem) => {
            const { dataset, dataIndex } = tooltipItem;
            const total = dataset.data.reduce((a, b) => a + b, 0);
            const currentValue = dataset.data[dataIndex];
            const percentage = ((currentValue / total) * 100).toFixed(2);
            const label = tooltipItem.chart.data.labels[dataIndex];
            return `${label}: ${percentage}%`;
          },
        },
      },
      legend: false,
      datalabels: {
        color: "#fff",
        font: {
          size: 10,
          weight: "bold",
        },
        formatter: function (value, context) {
          console.log("context", context);

          const count = context.chart.data.datasets[0].data[context.dataIndex];
          return count; // You can also return `${value}%` or combine both
        },
      },
    },
  };

  const Legend = ({ datas }) => {
    return (
      <ul style={{ marginTop: "2.3rem", position: "relative", listStyleType: "none" }}>
        {datas.labels.map((label, index) => {
          const value = datas.datasets[0].value[index];
          const percentage = datas.datasets[0].data[index];
          return (
            <li key={index}>
              <Row className="align-items-center">
                <Col xs={6} className="text-start">
                  <div
                    data-bs-toggle={"tooltip"}
                    data-bs-placement="top"
                    title={label}
                    className="d-flex align-items-center"
                  >
                    <span
                      className="colorBox"
                      style={{
                        backgroundColor: datas.datasets[0].backgroundColor[index],
                        borderRadius: "1rem",
                        marginRight: "0.5rem",
                        width: "0.6rem",
                        height: "0.6rem",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      className="listText"
                      style={{
                        maxWidth: "8rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        display: "inline-block",
                      }}
                    >
                      {label}
                    </span>
                  </div>
                </Col>
                <Col xs={3} className="text-start">
                  <span className="listText">{percentage}%</span>
                </Col>
              </Row>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    // <div
    //   style={{
    //     display: "flex",
    //     alignItems: "flex-start",
    //     flexWrap: "wrap",
    //     width: "100%",
    //     border: "1px solid #dee2e6",
    //   }}
    // >
    //   {/* Favorability Index table with accordion */}
    //   {byIntention && (
    //     <div style={{ minWidth: "16rem", flex: "0 0 16rem", marginRight: "1rem", marginTop: "2.5rem" }}>
    //       <div style={{ height: "180px" }}>
    //         <Doughnut data={data} options={options} />
    //       </div>
    //       <Legend datas={data} />
    //     </div>
    //   )}
    <div style={{ flex: 1, minWidth: 0 }} className="border-start table-responsive datatable-wrap">
      <table style={{ marginBottom: 0 }} className="table reportTable">
        <thead>
          <tr>
            <th className="w-1 pe-0"></th>
            <th className="w-1 pe-0"></th>
            <th className="min-w-250 ps-0" style={{ minWidth: "10rem" }}>
              Name
            </th>
            {SectionData?.attributeData?.widgetData?.displayResponseCount && <th className="min-w-180">Responses</th>}
            <th className="text-center min-w-220">Distribution</th>
            {SectionData?.attributeData?.widgetData?.displayOverallFavorability && <th className='text-center'>Overall Favorable</th>}
            {SectionData?.attributeData?.widgetData?.displayFavorableResponseCount &&
              <th className='text-center'>Favorable Count</th>
            }
            {!byIntention &&
              SectionData?.attributeData?.widgetData?.displayBenchmark &&
              SectionData?.attributeData?.widgetData?.favorabilityData[0]?.benchmarks?.map((item) => (
                <th className="text-center">{item?.name}</th>
              ))}
            {byIntention &&
              SectionData?.attributeData?.widgetData?.displayBenchmark &&
              SectionData?.attributeData?.widgetData?.favorabilityData?.benchmarks?.map((item) => (
                <th className="text-center">{item?.name}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          {!byIntention ? (
            sortOutcomesByPriority(SectionData?.attributeData?.widgetData?.favorabilityData)?.map((item, index) => (
              <>
                {item?.selected && (
                  <tr>
                    <td className="w-1 pe-0">
                      <Link
                        onClick={(e) => {
                          e.preventDefault();
                          // toggleCollapseNode(item?.outcome_id);
                        }}
                        className={`clickIcon ${!collapsedNodeIDs.includes(item?.outcome_id) ? "clickIcon-roate" : ""
                          }`}
                      >
                        <em className="icon-drop-down"></em>
                      </Link>
                    </td>
                    <td className="w-1 pe-0"></td>
                    <td className="ps-0 fw-semibold">{item?.outcome_name}</td>
                    {SectionData?.attributeData?.widgetData?.displayResponseCount && (
                      <td className="text-center">{/* {item?.totalResponse} */}</td>
                    )}
                    <td className="text-center">
                      <ProgressBar>
                        {item?.favorData?.map((item) => (
                          <ProgressBar
                            style={{
                              backgroundColor: SectionData?.attributeData?.widgetData?.themeData.find(
                                (theme) => theme.name === item?.favorName
                              )?.color, // 👈 custom color
                            }}
                            label={
                              SectionData?.attributeData?.widgetData?.displayPercentage && (
                                <span className="dist-label">{item?.favorPercentage?.toFixed(SectionData?.attributeData?.widgetData?.selectedDecimalPoint || 0)}</span>
                              )
                            }
                            now={item?.favorPercentage}
                          />
                        ))}
                      </ProgressBar>
                    </td>
                    {SectionData?.attributeData?.widgetData?.displayOverallFavorability && (
                      <td className="text-center">{item?.favorableResponsePercentage?.toFixed(SectionData?.attributeData?.widgetData?.selectedDecimalPoint || 0)}</td>
                    )}
                    {SectionData?.attributeData?.widgetData?.displayFavorableResponseCount &&
                      <td className='text-center'>{item?.favorableResponse}</td>
                    }
                    {SectionData?.attributeData?.widgetData?.displayBenchmark &&
                      item?.benchmarks?.map((item) => <td className="text-center">{item?.value}</td>)}
                  </tr>
                )}
                {!collapsedNodeIDs.includes(item?.outcome_id) &&
                  item?.intentions?.map((intention, index) => (
                    <>
                      {intention?.selected && (
                        <tr>
                          <td className="w-1 "></td>
                          <td className="w-1 pe-0">
                            <Link
                              onClick={(e) => {
                                e.preventDefault();
                                // toggleCollapseNode(intention?.intention_id);
                              }}
                              className={`clickIcon ${!collapsedNodeIDs.includes(intention?.intention_id) ? "clickIcon-roate" : ""
                                }`}
                            >
                              <em className="icon-drop-down"></em>
                            </Link>
                          </td>
                          <td className="ps-2 fw-semibold">{intention?.intention_name}</td>
                          {SectionData?.attributeData?.widgetData?.displayResponseCount && (
                            <td className="text-center">{/* {intention?.totalResponse} */}</td>
                          )}
                          <td className="text-center">
                            <ProgressBar>
                              {intention?.favorData?.map((item) => (
                                <ProgressBar
                                  style={{
                                    backgroundColor: SectionData?.attributeData?.widgetData?.themeData.find(
                                      (theme) => theme.name === item?.favorName
                                    )?.color, // 👈 custom color
                                  }}
                                  label={
                                    SectionData?.attributeData?.widgetData?.displayPercentage && (
                                      <span className="dist-label">{item?.favorPercentage?.toFixed(SectionData?.attributeData?.widgetData?.selectedDecimalPoint || 0)}</span>
                                    )
                                  }
                                  now={item?.favorPercentage}
                                />
                              ))}
                            </ProgressBar>
                          </td>
                          {SectionData?.attributeData?.widgetData?.displayOverallFavorability && (
                            <td className="text-center">{intention?.favorableResponsePercentage?.toFixed(SectionData?.attributeData?.widgetData?.selectedDecimalPoint || 0)}</td>
                          )}
                          {SectionData?.attributeData?.widgetData?.displayFavorableResponseCount &&
                                    <td className='text-center'>{intention?.favorableResponse}</td>
                                }
                          {SectionData?.attributeData?.widgetData?.displayBenchmark &&
                            intention?.benchmarks?.map((item) => <td className="text-center">{item?.value}</td>)}
                        </tr>
                      )}

                      {!collapsedNodeIDs.includes(intention?.intention_id) &&
                        intention?.questions?.map((question, index) => (
                          <>
                            {question?.selected && (
                              <tr>
                                <td className="w-1 "></td>
                                <td className="w-1 pe-0"></td>
                                <td className="ps-2 ">{question?.question}</td>
                                {SectionData?.attributeData?.widgetData?.displayResponseCount && (
                                  <td className="text-center">{question?.totalResponse}</td>
                                )}
                                <td className="text-center">
                                  <ProgressBar>
                                    {question?.favorData?.map((favour) => (
                                      <ProgressBar
                                        style={{
                                          backgroundColor: SectionData?.attributeData?.widgetData?.themeData.find(
                                            (theme) => theme.name === favour?.favorName
                                          )?.color, // 👈 custom color
                                        }}
                                        label={
                                          SectionData?.attributeData?.widgetData?.displayPercentage && (
                                            <span className="dist-label">{favour?.favorPercentage?.toFixed(SectionData?.attributeData?.widgetData?.selectedDecimalPoint || 0)}</span>
                                          )
                                        }
                                        now={favour?.favorPercentage}
                                      />
                                    ))}
                                  </ProgressBar>
                                </td>
                                {SectionData?.attributeData?.widgetData?.displayOverallFavorability && (
                                  <td className="text-center">{question?.favorableResponsePercentage?.toFixed(SectionData?.attributeData?.widgetData?.selectedDecimalPoint || 0)}</td>
                                )}
                                {SectionData?.attributeData?.widgetData?.displayFavorableResponseCount &&
                                  <td className='text-center'>{question?.favorableResponse}</td>
                                }
                                {SectionData?.attributeData?.widgetData?.displayBenchmark &&
                                  question?.benchmarks?.map((item) => <td className="text-center">{item?.value}</td>)}
                              </tr>
                            )}
                          </>
                        ))}
                    </>
                  ))}
              </>
            ))
          ) : (
            <>
              <tr>
                <td className="w-1 "></td>
                <td className="w-1 pe-0">
                  <Link
                    onClick={(e) => {
                      e.preventDefault();
                      // toggleCollapseNode(SectionData?.attributeData?.widgetData?.favorabilityData?.intention_id);
                    }}
                    className={`clickIcon ${!collapsedNodeIDs.includes(
                      SectionData?.attributeData?.widgetData?.favorabilityData?.intention_id
                    )
                        ? "clickIcon-roate"
                        : ""
                      }`}
                  >
                    <em className="icon-drop-down"></em>
                  </Link>
                </td>
                <td className="ps-2 fw-semibold">
                  {SectionData?.attributeData?.widgetData?.favorabilityData?.intention_name}
                </td>
                {SectionData?.attributeData?.widgetData?.displayResponseCount && (
                  <td className="text-center">
                    {/* {SectionData?.attributeData?.widgetData?.favorabilityData?.totalResponse} */}
                  </td>
                )}
                <td className="text-center">
                  <ProgressBar>
                    {SectionData?.attributeData?.widgetData?.favorabilityData?.favorData?.map((item) => (
                      <ProgressBar
                        style={{
                          backgroundColor: SectionData?.attributeData?.widgetData?.themeData.find(
                            (theme) => theme.name === item?.favorName
                          )?.color, // 👈 custom color
                        }}
                        label={
                          SectionData?.attributeData?.widgetData?.displayPercentage && (
                            <span className="dist-label">{item?.favorPercentage?.toFixed(SectionData?.attributeData?.widgetData?.selectedDecimalPoint || 0)}</span>
                          )
                        }
                        now={item?.favorPercentage}
                      />
                    ))}
                  </ProgressBar>
                </td>
                {SectionData?.attributeData?.widgetData?.displayOverallFavorability && (
                  <td className="text-center">
                    {SectionData?.attributeData?.widgetData?.favorabilityData?.favorableResponsePercentage?.toFixed(SectionData?.attributeData?.widgetData?.selectedDecimalPoint || 0)}
                  </td>
                )}
                {SectionData?.attributeData?.widgetData?.displayFavorableResponseCount &&
                  <td className='text-center'>{SectionData?.attributeData?.widgetData?.favorabilityData?.favorableResponse}</td>
                }
                {SectionData?.attributeData?.widgetData?.displayBenchmark &&
                  SectionData?.attributeData?.widgetData?.favorabilityData?.benchmarks?.map((item) => (
                    <td className="text-center">{item?.value}</td>
                  ))}
              </tr>

              {!collapsedNodeIDs.includes(SectionData?.attributeData?.widgetData?.favorabilityData?.intention_id) &&
                SectionData?.attributeData?.widgetData?.favorabilityData?.questions?.map((question, index) => (
                  <>
                    <tr>
                      <td className="w-1 "></td>
                      <td className="w-1 pe-0"></td>
                      <td className="ps-2 ">{question?.question}</td>
                      {SectionData?.attributeData?.widgetData?.displayResponseCount && (
                        <td className="text-center">{question?.totalResponse}</td>
                      )}
                      <td className="text-center">
                        <ProgressBar>
                          {question?.favorData?.map((favour) => (
                            <ProgressBar
                              style={{
                                backgroundColor: SectionData?.attributeData?.widgetData?.themeData.find(
                                  (theme) => theme.name === favour?.favorName
                                )?.color, // 👈 custom color
                              }}
                              label={
                                SectionData?.attributeData?.widgetData?.displayPercentage && (
                                  <span className="dist-label">{favour?.favorPercentage?.toFixed(SectionData?.attributeData?.widgetData?.selectedDecimalPoint || 0)}</span>
                                )
                              }
                              now={favour?.favorPercentage}
                            />
                          ))}
                        </ProgressBar>
                      </td>
                      {SectionData?.attributeData?.widgetData?.displayOverallFavorability && (
                        <td className="text-center">{question?.favorableResponsePercentage?.toFixed(SectionData?.attributeData?.widgetData?.selectedDecimalPoint || 0)}</td>
                      )}
                      {SectionData?.attributeData?.widgetData?.displayFavorableResponseCount &&
                        <td className='text-center'>{question?.favorableResponse}</td>
                      }
                      {/* {SectionData?.attributeData?.widgetData?.displayBenchmark &&
                                                    <td className="text-center">{question?.favorableResponsePercentage}</td>} */}
                      {SectionData?.attributeData?.widgetData?.displayBenchmark &&
                        question.benchmarks?.map((item) => <td className="text-center">{item?.value}</td>)}
                    </tr>
                  </>
                ))}
            </>
          )}
        </tbody>
      </table>
    </div>
    // </div>
  );
}

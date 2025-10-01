/* eslint-disable object-shorthand */
/* eslint-disable func-names */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
import React from "react";
import Chart from 'react-apexcharts';
import DemographicResponses from "./DemographicResponses";

function DetailedReport() {
  // apexchart start
  const options = {
    chart: {
      type: 'bar',
      height: 480,
      events: {
        mounted(config) {
          moveAnnotationsBehindBars();
        },
        updated: function (chartContext, config) {
          moveAnnotationsBehindBars();
        },
        resized: function (chartContext, config) {
          moveAnnotationsBehindBars();
        }
      },
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      custom: function ({
        series,
        seriesIndex,
        dataPointIndex,
        w
      }) {
        return (
          `<div className="custom-tooltip">` +
          `<span>${series[seriesIndex][dataPointIndex]}</span>` +
          `</div>`
        );
      },
    },
    xaxis: {
      categories: ['Abigail Baker', 'AU7 ', 'AU712', 'AU13'],
      labels: {
        show: true,
        style: {
          color: '#0F0F0F',
          fontSize: '14px',
          fontFamily: 'sans-serif',
          fontWeight: 600,
          cssClass: 'apexcharts-xaxis-label',
        },
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 5,
      labels: {
        offsetY: 0,
        show: true,
        minWidth: 50,
        align: 'left',
        style: {
          fontSize: '14px',
          fontWeight: 500,
        },
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: false
        },
      },
      padding: {
        top: -10,
        right: -10,
        bottom: 0,
      },
    },
    legend: {
      show: true,
      offsetX: -10,
      position: 'bottom',
      horizontalAlign: 'center',
    },
    annotations: {
      yaxis: [
        {
          y: 0,
          y2: 13,
          fillColor: '#FCD8D5',
          opacity: 1,
          borderColor: '#FCD8D5',
          label: {
            borderColor: 'transparent',
            position: 'left',
            textAnchor: 'end',
            rotate: 0,
            offsetX: -10,
            offsetY: 20,
            style: {
              fontSize: '12px',
              fontWeight: 600,
              fontFamily: 'Helvetica, Arial, sans-serif',
              color: '#2b7db8',
              background: 'transparent',
              padding: {
                bottom: 20,
              },
            },
          }
        },
        {
          y: 14,
          y2: 32,
          fillColor: '#FFE2CA',
          opacity: 1,
          borderColor: '#FFE2CA',
          label: {
            borderColor: 'transparent',
            position: 'left',
            textAnchor: 'end',
            offsetX: -10,
            offsetY: 35,
            style: {
              fontSize: '12px',
              fontWeight: 600,
              fontFamily: 'Helvetica, Arial, sans-serif',
              color: '#2b7db8',
              background: 'transparent',
              padding: {
                bottom: 20,
              },
            },
          }
        },
        {
          y: 33,
          y2: 51,
          fillColor: '#FDEECC',
          opacity: 1,
          borderColor: '#FDEECC',
          label: {
            borderColor: 'transparent',
            position: 'left',
            textAnchor: 'end',
            offsetX: -10,
            offsetY: 15,
            style: {
              fontSize: '12px',
              fontWeight: 600,
              fontFamily: 'Helvetica, Arial, sans-serif',
              color: '#2b7db8',
              background: 'transparent',
              padding: {
                bottom: 20,
              },
            },
          }
        },
        {
          y: 52,
          y2: 70,
          fillColor: '#EEF3C8',
          opacity: 1,
          borderColor: '#EEF3C8',
          label: {
            borderColor: 'transparent',
            position: 'left',
            textAnchor: 'end',
            offsetX: -10,
            offsetY: 15,
            style: {
              fontSize: '12px',
              fontWeight: 600,
              fontFamily: 'Helvetica, Arial, sans-serif',
              color: '#2b7db8',
              background: 'transparent',
              padding: {
                bottom: 20,
              },
            },
          }
        },
        {
          y: 71,
          y2: 89,
          fillColor: '#DBF1BF',
          opacity: 1,
          borderColor: '#DBF1BF',
          label: {
            borderColor: 'transparent',
            position: 'left',
            textAnchor: 'end',
            offsetX: -10,
            offsetY: 25,
            style: {
              fontSize: '12px',
              fontWeight: 600,
              fontFamily: 'Helvetica, Arial, sans-serif',
              color: '#2b7db8',
              background: 'transparent',
              padding: {
                bottom: 20,
              },
            },
          }
        },
        {
          y: 90,
          y2: 100,
          fillColor: '#C8F3B7',
          opacity: 1,
          borderColor: '#C8F3B7',
          label: {
            borderColor: 'transparent',
            position: 'left',
            textAnchor: 'end',
            offsetX: -10,
            offsetY: 20,
            style: {
              fontSize: '12px',
              fontWeight: 600,
              fontFamily: 'Helvetica, Arial, sans-serif',
              color: '#2b7db8',
              background: 'transparent',
              padding: {
                bottom: 20,
              },
            },
          }
        },
      ]
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          legend: {
            offsetX: 40,
          },
          title: {
            offsetX: 20,
            offsetY: 20,
          }
        }
      }
    ]
  };
  const series = [
    {
      name: 'Alignment of Goals and Strategies',
      data: [52.73, 50.91, 43.64, 50.91],
      color: '#ef3d31',
      zIndex: 1
    },
    {
      name: 'Operational Efficiency',
      data: [80, 62.5, 67.5, 50],
      color: '#368c36',
      zIndex: 1
    },
  ];
  const moveAnnotationsBehindBars = () => {
    const annotations = document.querySelectorAll('.apexcharts-yaxis-annotations');
    annotations.forEach((annotation) => {
      const chart = annotation.closest('.apexcharts-canvas').querySelector('.apexcharts-bar-series');
      if (chart && chart.parentNode) {
        chart.parentNode.insertBefore(annotation, chart);
      }
    });
  };
  //   apex chart end
  return (
    <>
      <section className="commonBanner position-relative">
        <div className="container">
          <div className="commonBanner_inner">
            <h1 className="mb-3">Detailed <span>Report</span> </h1>
          </div>
        </div>
      </section>
      <section className="reportSec position-relative">
        <div className="container">
          <div className="reportSec_box bg-white">
            <div className="reportSec_box_inner">
              <h3 className="reportSec_box_title">
                Detailed Report - Participant
              </h3>
              <div className="reportSec_box_barchart">
                <div className="reportSec_box_barchart_inner">
                  <Chart options={options} series={series} type="bar" height={350} />
                </div>
              </div>
              <div className="reportSec_box_table">
                <table className="mt-xxl-3 mt-2">
                  <thead>
                    <tr>
                      <th>Outcomes / Participant</th>
                      <th>Alignment of Goals and Strategies</th>
                      <th>Operational Efficiency </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Abigail Baker</td>
                      <td>52.73</td>
                      <td>80.00</td>
                    </tr>
                    <tr>
                      <td>AU7</td>
                      <td>50.91</td>
                      <td>62.50</td>
                    </tr>
                    <tr>
                      <td>AU12</td>
                      <td>43.64</td>
                      <td>67.50</td>
                    </tr>
                    <tr>
                      <td>AU13</td>
                      <td>50.91</td>
                      <td>50.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="reportSec_box_info d-flex justify-content-between flex-wrap gap-1">
                <span>Report Generated at 09/24/2024 05:48 PT</span>
                <span>© 2022, Metolius®</span>
              </div>
            </div>
            <div className="reportSec_box_inner">
              <h3 className="reportSec_box_title">
                Detailed Report - Participant
              </h3>
              <div className="reportSec_box_table">
                <table className="mt-xxl-3 mt-2">
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
                      <td>React JS</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>Participants</td>
                      <td>Ogiwel J</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>Demographic Filter</td>
                      <td>All</td>
                    </tr>
                  </tbody>
                </table>
                <p className="mt-xl-3 mt-2 mb-0">
                  Welcome to the detailed report. This report presents a comprehensive examination of [briefly mention the main subject or objective, e.g., recent performance metrics, operational efficiency, market trends] and is designed to provide actionable insights and support strategic decision-making.
                </p>
              </div>

              <div className="reportSec_box_info d-flex justify-content-between flex-wrap gap-1">
                <span>Report Generated at 09/24/2024 05:48 PT</span>
                <span>© 2022, Metolius®</span>
              </div>
            </div>
            <div className="reportSec_box_inner">
              <h3 className="reportSec_box_title mb-2">
                Detailed Report - Participant
              </h3>
              <p className="reportSec_box_para">Individual Filtering Question - Demographic Responses  </p>
              <DemographicResponses />
              <div className="reportSec_box_info d-flex justify-content-between flex-wrap gap-1">
                <span>Report Generated at 09/24/2024 05:48 PT</span>
                <span>© 2022, Metolius®</span>
              </div>
            </div>
            <div className="reportSec_box_inner">
              <h3 className="reportSec_box_title mb-2">
                Detailed Report - Participant
              </h3>
              <p className="reportSec_box_para">Response based open ended responses</p>
              <div className="reportSec_box_table">
                <table>
                  <tbody>
                    <tr>
                      <th className="text-start">Question</th>
                      <td className="text-start"> <div className="reportSec_box_table_data"> The organization’s goals are clearly communicated to all employees.</div></td>
                    </tr>
                    <tr>
                      <th className="text-start">Response</th>
                      <td className="text-start"><div className="reportSec_box_table_data">Strongly Disagree (OEQ QN: Explain Reason?)</div> </td>
                    </tr>
                    <tr>
                      <th className="text-start">RBOEQ Response (1)	</th>
                      <td className="text-start"><div className="reportSec_box_table_data">No other remarks </div> </td>
                    </tr>
                    <tr>
                      <th className="text-start">RBOEQ Response (1)	</th>
                      <td className="text-start"><div className="reportSec_box_table_data">There may be insufficient or ineffective communication channels used to relay the organization goals to all employees. If the methods used are outdated or do not reach all levels of the organization, employees may not receive or understand the goals. </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="reportSec_box_info d-flex justify-content-between flex-wrap gap-1">
                <span>Report Generated at 09/24/2024 10:28 PT</span>
                <span>© 2022, Metolius®</span>
              </div>
            </div>
            <div className="reportSec_box_inner">
              <h3 className="reportSec_box_title mb-2">
                Detailed Report - Participant
              </h3>
              <p className="reportSec_box_para">Intra-Survey Open-Ended Question Responses</p>
              <p className="reportSec_box_para">Pre-Survey OEQ</p>
              <div className="reportSec_box_table">
                <table>
                  <tbody>
                    <tr>
                      <th className="text-start">Question</th>
                      <td className="text-start"><div className="reportSec_box_table_data">What aspects of your job do you find most fulfilling and why? </div></td>
                    </tr>
                    <tr>
                      <th className="text-start">OEQ Response (3)	</th>
                      <td className="text-start"><div className="reportSec_box_table_data">test </div> </td>
                    </tr>
                    <tr>
                      <th className="text-start">OEQ Response (1)		</th>
                      <td className="text-start"><div className="reportSec_box_table_data"> The aspect of my job that I find most fulfilling is the opportunity to lead and mentor my team. I derive a great deal of satisfaction from helping my colleagues develop their skills and grow professionally.</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="reportSec_box_info d-flex justify-content-between flex-wrap gap-1">
                <span>Report Generated at 09/24/2024 10:28 PT</span>
                <span>© 2022, Metolius®</span>
              </div>
            </div>
            <div className="reportSec_box_inner">
              <h3 className="reportSec_box_title mb-2">
                Detailed Report - Participant
              </h3>
              <p className="reportSec_box_para">Intra-Survey Open-Ended Question Responses</p>
              <p className="reportSec_box_para">Survey OEQ</p>
              <div className="reportSec_box_table">
                <table>
                  <tbody>
                    <tr>
                      <th className="text-start">Question</th>
                      <td className="text-start"><div className="reportSec_box_table_data">What is the timeline for achieving these goals?</div></td>
                    </tr>
                    <tr>
                      <th className="text-start">OEQ Response (3)</th>
                      <td className="text-start"><div className="reportSec_box_table_data">test </div> </td>
                    </tr>
                    <tr>
                      <th className="text-start">OEQ Response (1)</th>
                      <td className="text-start"><div className="reportSec_box_table_data">We aim to finish the research phase and finalize our strategic plan by the end of the first month. This includes gathering data, assessing current resources, and identifying key stakeholders.</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table className="mt-xxl-3 mt-2">
                  <tbody>
                    <tr>
                      <th className="text-start">Question</th>
                      <td className="text-start"><div className="reportSec_box_table_data">What financial impacts, if any, have resulted from the organizational structure? </div></td>
                    </tr>
                    <tr>
                      <th className="text-start">OEQ Response (1)</th>
                      <td className="text-start"><div className="reportSec_box_table_data">Our current structure has streamlined processes by centralizing decision-making and reducing redundancies. This has led to a significant reduction in operational costs by approximately 15% over the past year.</div></td>
                    </tr>
                    <tr>
                      <th className="text-start">OEQ Response (3)</th>
                      <td className="text-start"><div className="reportSec_box_table_data">test </div></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="reportSec_box_info d-flex justify-content-between flex-wrap gap-1">
                <span>Report Generated at 09/24/2024 10:28 PT</span>
                <span>© 2022, Metolius®</span>
              </div>
            </div>
            <div className="reportSec_box_inner">
              <h3 className="reportSec_box_title mb-2">
                Detailed Report - Participant
              </h3>
              <p className="reportSec_box_para">Intra-Survey Open-Ended Question Responses</p>
              <p className="reportSec_box_para">Post-Survey OEQ</p>
              <div className="reportSec_box_table">
                <table>
                  <tbody>
                    <tr>
                      <th className="text-start">Question</th>
                      <td className="text-start"><div className="reportSec_box_table_data">Can you describe your overall experience this survey?</div></td>
                    </tr>
                    <tr>
                      <th className="text-start">OEQ Response (1)</th>
                      <td className="text-start"><div className="reportSec_box_table_data">Overall, I felt that the survey was well-constructed and achieved its objectives. It was a positive experience, and I appreciate the opportunity to contribute my feedback.</div></td>
                    </tr>
                    <tr>
                      <th className="text-start">OEQ Response (3)</th>
                      <td className="text-start"><div className="reportSec_box_table_data">test</div></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="reportSec_box_info d-flex justify-content-between flex-wrap gap-1">
                <span>Report Generated at 09/24/2024 10:28 PT</span>
                <span>© 2022, Metolius®</span>
              </div>
            </div>
            <div className="reportSec_box_inner">
              <h3 className="reportSec_box_title">
                Detailed Report - Participant
              </h3>
              <div className="reportSec_box_table">
                <p className="mb-0">We appreciate the time and effort dedicated to reviewing this report. Your feedback and insights are invaluable as we move towards implementing the recommendations and addressing the challenges identified. We are committed to leveraging these insights to drive positive outcomes and support our strategic objectives.</p>
              </div>

              <div className="reportSec_box_info d-flex justify-content-between flex-wrap gap-1">
                <span>Report Generated at 09/24/2024 10:28 PT</span>
                <span>© 2022, Metolius®</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default DetailedReport;
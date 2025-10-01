/* eslint-disable prefer-template */
/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable object-shorthand */
import React from "react";
import Chart from 'react-apexcharts';
import AlignmentStrategies from "./AlignmentStrategies";
import OperationalEfficiency from "./OperationalEfficiency";

function SummaryReport() {

  // apexchart start
  const options = {
    chart: {
      type: 'bar',
      height: 480,
      events: {
        // eslint-disable-next-line func-names
        mounted: function (chartContext, config) {
          moveAnnotationsBehindBars();
        },
        // eslint-disable-next-line func-names
        updated: function (chartContext, config) {
          moveAnnotationsBehindBars();
        },
        // eslint-disable-next-line func-names
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
      // eslint-disable-next-line func-names
      custom: function ({
        series,
        seriesIndex,
        dataPointIndex,
        w
      }) {
        return (
          '<div className="custom-tooltip">' +
          '<span>' + series[seriesIndex][dataPointIndex] + '</span>' +
          '</div>'
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
            <h1 className="mb-3">Summary <span>Report</span> </h1>
          </div>
        </div>
      </section>
      <section className="reportSec position-relative">
        <div className="container">
          <div className="reportSec_box bg-white">
            <div className="reportSec_box_inner">
              <h3 className="reportSec_box_title">
                Summarized report - Participant
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
              <div className="reportSec_box_info d-flex justify-content-between gap-1 flex-wrap">
                <span>Report Generated at 09/24/2024 05:48 PT</span>
                <span>© 2022, Metolius®</span>
              </div>
            </div>
            <div className="reportSec_box_inner">
              <h3 className="reportSec_box_title">
                Summarized report - Participant
              </h3>
              <div className="reportSec_box_table">
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
              </div>
              <p className="my-xl-3 my-2">
                You will find a detailed examination of [mention key areas or sections, e.g., survey results, financial impacts, strategic objectives], along with an analysis of how these elements align with our overall goals and strategies. We aim to present a clear and concise synthesis of the findings, highlighting both successes and areas for improvement.
              </p>
              <p className="mb-0">
                We appreciate the time and effort invested by everyone involved in contributing to this report. Your feedback and collaboration are crucial as we continue to strive for excellence and drive positive outcomes.
              </p>
              <div className="reportSec_box_info d-flex justify-content-between gap-1 flex-wrap">
                <span>Report Generated at 09/24/2024 05:48 PT</span>
                <span>© 2022, Metolius®</span>
              </div>
            </div>
            <div className="reportSec_box_inner">
              <h3 className="reportSec_box_title">
                Summarized report - Participant - Alignment of Goals and Strategies
              </h3>
              <AlignmentStrategies />
              <div className="reportSec_box_info d-flex justify-content-between gap-1 flex-wrap">
                <span>Report Generated at 09/24/2024 05:48 PT</span>
                <span>© 2022, Metolius®</span>
              </div>
            </div>
            <div className="reportSec_box_inner">
              <h3 className="reportSec_box_title">
                Summarized report - Participant - Operational Efficiency
              </h3>
              <OperationalEfficiency />
              <div className="reportSec_box_info d-flex justify-content-between gap-1 flex-wrap">
                <span>Report Generated at 09/24/2024 05:48 PT</span>
                <span>© 2022, Metolius®</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default SummaryReport;
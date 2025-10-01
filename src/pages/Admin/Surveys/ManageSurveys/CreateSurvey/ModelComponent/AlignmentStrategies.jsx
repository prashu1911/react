import Chart from "react-apexcharts";

export default function AlignmentStrategies() {
  // apexchart start
  const options = {
    chart: {
      type: "bar",
      height: 480,
      //   events: {
      //     mounted: function (chartContext, config) {
      //       moveAnnotationsBehindBars();
      //     },
      //     updated: function (chartContext, config) {
      //       moveAnnotationsBehindBars();
      //     },
      //     resized: function (chartContext, config) {
      //       moveAnnotationsBehindBars();
      //     }
      //   },
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      custom({ series, seriesIndex, dataPointIndex }) {
        return (
          `<div className="custom-tooltip">` +
          `<span>${series[seriesIndex][dataPointIndex]}</span>` +
          `</div>`
        );
      },
    },
    xaxis: {
      categories: ["Abigail Baker", "AU7 ", "AU12", "AU13"],
      labels: {
        show: true,
        style: {
          color: "#0F0F0F",
          fontSize: "14px",
          fontFamily: "sans-serif",
          fontWeight: 600,
          cssClass: "apexcharts-xaxis-label",
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
        align: "left",
        style: {
          fontSize: "14px",
          fontWeight: 500,
        },
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: false,
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
      position: "bottom",
      horizontalAlign: "center",
    },
    annotations: {
      yaxis: [
        {
          y: 0,
          y2: 13,
          fillColor: "#FCD8D5",
          opacity: 1,
          borderColor: "#FCD8D5",
          label: {
            borderColor: "transparent",
            position: "left",
            textAnchor: "end",
            rotate: 0,
            offsetX: -10,
            offsetY: 20,
            style: {
              fontSize: "12px",
              fontWeight: 600,
              fontFamily: "Helvetica, Arial, sans-serif",
              color: "#2b7db8",
              background: "transparent",
              padding: {
                bottom: 20,
              },
            },
          },
        },
        {
          y: 14,
          y2: 32,
          fillColor: "#FFE2CA",
          opacity: 1,
          borderColor: "#FFE2CA",
          label: {
            borderColor: "transparent",
            position: "left",
            textAnchor: "end",
            offsetX: -10,
            offsetY: 35,
            style: {
              fontSize: "12px",
              fontWeight: 600,
              fontFamily: "Helvetica, Arial, sans-serif",
              color: "#2b7db8",
              background: "transparent",
              padding: {
                bottom: 20,
              },
            },
          },
        },
        {
          y: 33,
          y2: 51,
          fillColor: "#FDEECC",
          opacity: 1,
          borderColor: "#FDEECC",
          label: {
            borderColor: "transparent",
            position: "left",
            textAnchor: "end",
            offsetX: -10,
            offsetY: 15,
            style: {
              fontSize: "12px",
              fontWeight: 600,
              fontFamily: "Helvetica, Arial, sans-serif",
              color: "#2b7db8",
              background: "transparent",
              padding: {
                bottom: 20,
              },
            },
          },
        },
        {
          y: 52,
          y2: 70,
          fillColor: "#EEF3C8",
          opacity: 1,
          borderColor: "#EEF3C8",
          label: {
            borderColor: "transparent",
            position: "left",
            textAnchor: "end",
            offsetX: -10,
            offsetY: 15,
            style: {
              fontSize: "12px",
              fontWeight: 600,
              fontFamily: "Helvetica, Arial, sans-serif",
              color: "#2b7db8",
              background: "transparent",
              padding: {
                bottom: 20,
              },
            },
          },
        },
        {
          y: 71,
          y2: 89,
          fillColor: "#DBF1BF",
          opacity: 1,
          borderColor: "#DBF1BF",
          label: {
            borderColor: "transparent",
            position: "left",
            textAnchor: "end",
            offsetX: -10,
            offsetY: 25,
            style: {
              fontSize: "12px",
              fontWeight: 600,
              fontFamily: "Helvetica, Arial, sans-serif",
              color: "#2b7db8",
              background: "transparent",
              padding: {
                bottom: 20,
              },
            },
          },
        },
        {
          y: 90,
          y2: 100,
          fillColor: "#C8F3B7",
          opacity: 1,
          borderColor: "#C8F3B7",
          label: {
            borderColor: "transparent",
            position: "left",
            textAnchor: "end",
            offsetX: -10,
            offsetY: 20,
            style: {
              fontSize: "12px",
              fontWeight: 600,
              fontFamily: "Helvetica, Arial, sans-serif",
              color: "#2b7db8",
              background: "transparent",
              padding: {
                bottom: 20,
              },
            },
          },
        },
      ],
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
          },
        },
      },
    ],
  };
  const series = [
    {
      name: "Defining Goals",
      data: [1, 1, 1, 1],
      color: "#ef3d31",
      zIndex: 1,
    },
    {
      name: "Clarity",
      data: [20, 40, 40, 40],
      color: "#368c36",
      zIndex: 1,
    },
    {
      name: "Goals",
      data: [30, 60, 50, 50],
      color: "#fcad18",
      zIndex: 1,
    },
    {
      name: "Understanding of Goals",
      data: [40, 40, 40, 40],
      color: "#ffcb05",
      zIndex: 1,
    },
    {
      name: "Strategies",
      data: [60, 50, 60, 50],
      color: "#6aa93a",
      zIndex: 1,
    },
    {
      name: "Alignment",
      data: [60, 55, 40, 60],
      color: "#519a38",
      zIndex: 1,
    },
    {
      name: "Evaluation and Refinement",
      data: [100, 40, 40, 40],
      color: "#368c36",
      zIndex: 1,
    },
  ];
  //   const moveAnnotationsBehindBars = () => {
  //     const annotations = document.querySelectorAll(
  //       ".apexcharts-yaxis-annotations"
  //     );
  //     annotations.forEach((annotation) => {
  //       const chart = annotation
  //         .closest(".apexcharts-canvas")
  //         .querySelector(".apexcharts-bar-series");
  //       if (chart && chart.parentNode) {
  //         chart.parentNode.insertBefore(annotation, chart);
  //       }
  //     });
  //   };
  //   apex chart end
  return (
    <>
      <div className="reportSec_box_barchart">
        <div className="reportSec_box_barchart_inner">
          <Chart options={options} series={series} type="bar" height={350} />
        </div>
      </div>
      <div className="reportSec_box_table">
        <table className="mt-xxl-3 mt-2">
          <thead>
            <tr>
              <th>Intentions / Participants </th>
              <th>Alignment</th>
              <th>Clarity </th>
              <th>Defining Goals </th>
              <th>Evaluation and Refinement</th>
              <th>goals</th>
              <th>strategies</th>
              <th>Understanding of Goals</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Abigail Baker</td>
              <td>60.00</td>
              <td>20.00</td>
              <td>0.00</td>
              <td>100.00</td>
              <td>30.00</td>
              <td>60.00</td>
              <td>40.00</td>
            </tr>
            <tr>
              <td>AU7</td>
              <td>55.00</td>
              <td>40.00</td>
              <td>0.00</td>
              <td>40.00</td>
              <td>60.00</td>
              <td>50.00</td>
              <td>40.00</td>
            </tr>
            <tr>
              <td>AU12</td>
              <td>40.00</td>
              <td>40.00</td>
              <td>0.00</td>
              <td>20.00</td>
              <td>50.00</td>
              <td>60.00</td>
              <td>40.00</td>
            </tr>
            <tr>
              <td>AU13</td>
              <td>60.00</td>
              <td>40.00</td>
              <td>0.00</td>
              <td>40.00</td>
              <td>50.00</td>
              <td>50.00</td>
              <td>40.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

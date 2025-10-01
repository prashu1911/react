import React from "react";
import ReactApexChart from "react-apexcharts";

export default function DashboardPeiChart({ value, height=350 }) {  
  const options = {
    chart: {
      type: "donut",
      offsetY: 0,
    },
    legend: {
      show: true,
      position: "bottom"
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return `${val.toFixed(2)}%`;
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        // Show the full value with all decimals for the "Completed" slice
        if (opts.seriesIndex === 0) {
          return `${value}%`;
        }
        // For "Incomplete" slice, show the full value as well
        return `${(100 - value).toFixed(2)}%`;
      },
      style: {
        fontSize: "13px",
        fontWeight: "bold",
        colors: ["#fff"]
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%", // Adjust as needed
          labels: {
            show: false,
            name: {
              show: true,
              offsetY: 10,
            },
            value: {
              show: true,
              fontSize: "22px",
              fontWeight: "bold",
              color: "#2196F3",
              offsetY: -10,
              // formatter: function () {
              //   return `${value}%`;
              // }
            },
          }
        }
      }
    },
    fill: {
      colors: ["#2196F3", "#eee"], // Blue color for progress
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Completed", "Incomplete"],
  };

  const series = [value, (100-value)]; // Set progress dynamically

  return (
    <div className="progress-chart">
      <ReactApexChart options={options} series={series} type="pie" height={height} />
    </div>
  );
}

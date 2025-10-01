import React, { useEffect } from "react";
import ReactApexChart from "react-apexcharts";

export default function ResponseRateProgressChart({ value, height = 220, sectionId }) {
  const chartId = `radialBar-${sectionId}`;

  const options = {
    chart: {
      id: chartId,
      type: "radialBar",
      offsetY: 0,
      animations: {
        enabled: false, // 🔴 Disable all animations
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: 0,
        endAngle: 360,
        hollow: {
          size: "60%", // Adjust for center size
        },
        track: {
          background: "#f0f0f0",
          strokeWidth: "100%",
        },
        dataLabels: {
          name: {
            show: true,
            offsetY: 25,
            color: "#000",
            fontSize: "16px",
            fontWeight: 600,
          },
          value: {
            fontSize: "22px",
            fontWeight: "bold",
            offsetY: -10,
            formatter: function (val) {
              return `${val}%`;
            },
          },
        },
      },
    },
    fill: {
      colors: ["#2196F3"], // Blue color for progress
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Progress"],
    tooltip: {
      enabled: true,
      y: {
        formatter: function (val) {
          return `${val}% Completed`; // 👈 Custom hover text
        },
      },
    },
  };

  const series = [value]; // Set progress dynamically

  return (
    <div className="progress-chart">
      <ReactApexChart options={options} series={series} type="radialBar" height={height} />
    </div>
  );
}

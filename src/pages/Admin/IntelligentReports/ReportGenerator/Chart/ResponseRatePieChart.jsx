import React, { useEffect } from "react";
import ReactApexChart from "react-apexcharts";

export default function ResponseRatePieChart({ value, height = 180, sectionId, decimal }) {

  console.log("value",value);
  const safeValue = parseFloat(value);
  const valueFloat = isNaN(safeValue) ? 0 : safeValue;
  let series;
  if (valueFloat > 0) {
    series = [valueFloat, 100 - valueFloat];
  } else {
    series = [0, 100]; // Always show the "Incomplete" part if value is 0 or invalid
  }
  const chartId = `donut-chart-${sectionId}`;

  const options = {
    chart: {
      id: chartId,
      type: "donut",
      height: height,
      animations: {
        enabled: false,
      },
    },
    legend: {
      show: false,
      position: "bottom",
    },
    colors: ["#0968AC", "#ddd"],
    dataLabels: {
      enabled: true,
      formatter: function (_, opts) {
        // Ensure it's a number before using toFixed
        const formattedValue = Number(opts.w.config.series[0]).toFixed(decimal);
        return opts.seriesIndex === 0 ? `${formattedValue}` : "";
      },
      e: {
        fontSize: "14px",
        fontWeight: "bold",
        colors: ["#ffffff"], // visible on dark blue
      },
    },
    labels: ["Completed", "Incomplete"],
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: false, // disable center label
          },
        },
      },
    },
    tooltip: {
      enabled: true,
      y: {
        title: {
          formatter: function (seriesName, opts) {
            return opts.seriesIndex === 0 ? "Completed" : "Incomplete";
          },
        },
        formatter: function (val) {
          return `${val.toFixed(decimal)}%`; // show full decimal
        },
      },
    },
  };

  return (
    <div>
      <ReactApexChart options={options} series={series} type="donut" height={height} />
    </div>
  );
}

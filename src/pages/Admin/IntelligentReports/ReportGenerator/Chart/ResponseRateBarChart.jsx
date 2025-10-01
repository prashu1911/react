import React, { useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import ApexCharts from "apexcharts";

export default function ResponseRateBarChart({ SectionData, sectionId }) {
  // ✅ Extract frequency response data safely
  const frequencyResponse = SectionData?.attributeData?.widgetData?.frequencyResponse;

  // ✅ Ensure data exists before mapping
  const series =
    frequencyResponse?.response?.map((item) => ({
      name: item?.name || "Unknown", // Default name if missing
      data: item?.data?.map((val) => (val !== null && val !== undefined ? val : 0)) || [0], // Ensure numerical values
    })) || [];

  // ✅ Extract `frequency` for x-axis labels, fallback to ["No Data"]
  const categories = frequencyResponse?.frequency?.length ? frequencyResponse.frequency : ["No Data"];

  // ✅ Extract chart type from API response (default to 'bar' if missing or invalid)
  const validChartTypes = ["bar", "line", "column"];
  const chartType = validChartTypes.includes(SectionData?.attributeData?.widgetData?.frequencyChart)
    ? SectionData?.attributeData?.widgetData?.frequencyChart
    : "bar";
  const chartId = `response-rate-chart-${sectionId}`;

  const isHorizontal = SectionData?.attributeData?.widgetData?.frequencyChart === "bar";

  const allValues = series.flatMap((s) => s.data);
  const maxBarValue = Math.max(...allValues);


  const options = {
    chart: {
      id: chartId,
      type: chartType === "line" ? "line" : "bar",
      height: 400,
      width: "100%",
      toolbar: {
        show: false, // ❌ Hide all toolbar controls
      },
      zoom: {
        enabled: false, // ❌ Disable zoom
      },
      animations: {
        enabled: false, // ❌ Disable animations if not needed
      },
      selection: {
        enabled: false, // ❌ Disable selection
      },
      pan: {
        enabled: false, // ❌ Disable panning
      },
    },
    plotOptions: {
      bar: {
        horizontal: chartType === "bar",
        columnWidth: "45%",
        dataLabels: {
          position: chartType === "column" ? "top" : "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      offsetX: isHorizontal?8:0, // Adjust offset for 'top' position 
      offsetY: isHorizontal?0:-10, // Adjust offset for 'top' position
      style: {
        fontSize: "10px",
        colors: ["#000"],
      },
      formatter: function (val) {
        return Number(val); // Forces 2 decimal places
      },
    },
    stroke: {
      show: chartType === "line",
      width: chartType === "line" ? (categories.length === 1 ? 0 : 2) : 0,
      curve: "straight",
      colors: chartType === "line" ? undefined : ["#000"], // Allow default Apex colors for lines
    },
    markers: {
      size: chartType === "line" && categories.length === 1 ? 6 : 0, // show dots only if one point
    },

    xaxis: {
      categories,
      tickPlacement: "on",
    },
    yaxis: {
      min: 0,
      max:maxBarValue+2,
      tickAmount: 5,
    },
    legend: {
      show: true, // ❌ Hide legend
    },
    // tooltip: {
    //   enabled: true,
    //   shared: chartType === "line" && categories.length === 1,
    //   intersect: false,
    //   custom: chartType === "line" && categories.length === 1
    //     ? function({ series, seriesIndex, dataPointIndex, w }) {
    //         return (
    //           `<div style="padding: 6px 10px;">` +
    //           w.globals.seriesNames.map((name, i) => {
    //             const val = series[i][dataPointIndex];
    //             const color = w.globals.colors[i]; // ✅ Get series color
    //             return `
    //               <div style="display: flex; align-items: center; margin-bottom: 4px;">
    //                 <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${color};margin-right:6px;"></span>
    //                 <strong>${name}:</strong>&nbsp;${val.toFixed(SectionData?.attributeData?.widgetData?.selectedDecimalPoint)}
    //               </div>
    //             `;
    //           }).join('') +
    //           `</div>`
    //         );
    //       }
    //     : undefined,
    //   y: {
    //     formatter: (val) =>
    //       val !== null && val !== undefined ? val.toFixed(SectionData?.attributeData?.widgetData?.selectedDecimalPoint) : "N/A",
    //   },
    // },
    
    markers: {
      size: chartType === "line" ? 4 : 0,
      hover: {
        size: 6
      }
    },
    
  };

  return (
    <div className="responseRate">
      <div className="responseRate_chart">
        {series.length > 0 ? (
          <ReactApexChart options={options} series={series} type={chartType == "line" ? "line" : "bar"} height={400} />
        ) : (
          <p>No Data Available</p>
        )}
      </div>
    </div>
  );
}

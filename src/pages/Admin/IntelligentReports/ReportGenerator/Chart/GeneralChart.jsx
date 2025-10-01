import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

export default function GeneralChart({ SectionData, sectionId }) {
  const [activeSeriesIndex, setActiveSeriesIndex] = useState(null);

  try {
    const chartType =
      SectionData?.attributeData?.widgetData?.selectedChart === "column"
        ? "bar"
        : SectionData?.attributeData?.widgetData?.selectedChart === "spider"
          ? "radar"
          : SectionData?.attributeData?.widgetData?.selectedChart;
    const chartData = SectionData?.attributeData?.widgetData?.chartData || [];
    const palette = SectionData?.attributeData?.widgetData?.selectedPaletteColors || [];

    const defaultCategories = chartData?.map((item) => item?.name || "N/A");

    const defaultObjectNames = [...new Set(chartData.flatMap((item) => item.objects?.map((obj) => obj?.name)))].filter(
      Boolean
    );

    let categories = [];
    let series = [];

    const isHorizontal = SectionData?.attributeData?.widgetData?.selectedChart === "bar";


    if (SectionData?.attributeData?.widgetData?.switchAxis) {
      categories = defaultCategories;
    
      series = defaultObjectNames.map((objName, index) => ({
        name: objName,
        data: chartData.map((item) => {
          const match = item.objects?.find((o) => o.name === objName);
          const value = match ? parseFloat(match.value) || 0 : 0;
          // ✅ Fix: Add x (label) and y (value) for horizontal bars
          return isHorizontal
            ? { x: item.name || "N/A", y: value }
            : value;
        }),
        color: palette[index % palette.length]?.colorCode,
      }));
    } else {
      categories = defaultObjectNames;
    
      series = chartData.map((item, index) => ({
        name: item.name,
        data: categories.map((cat) => {
          const match = item.objects?.find((o) => o.name === cat);
          const value = match ? parseFloat(match.value) || 0 : 0;
          return isHorizontal
            ? { x: cat || "N/A", y: value }
            : value;
        }),
        color: palette[index % palette.length]?.colorCode,
      }));
    }
    

    if (!categories.length || !series.length) return null;

    const allValues = series.flatMap((s) => s.data);
    const maxBarValue = Math.max(...allValues);

    const isRadarChart = chartType === "radar";
    const chartHeight = isRadarChart ? 400 : 400;
    const chartId = `general-chart-${sectionId}`;

    const options = {
      chart: {
        type: chartType,
        height: chartHeight,
        toolbar: { show: false },
        animations: {
          enabled: false, // ← Disable animations
        },
        // spacing: { left: 30, right: 30 }, // ⬅️ optional
        zoom: {
          enabled: false, // ❌ Disable zoom
        },
        pan: {
          enabled: false, // ❌ Disable pan
        },
        events: {
          legendClick: (chartContext, seriesIndex) => {
            setActiveSeriesIndex((prevIndex) => (prevIndex === seriesIndex ? null : seriesIndex));
          },
        },
      },
      legend: {
        onItemClick: {
          toggleDataSeries: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: isHorizontal,
          columnWidth: "50%", // Smaller width = more spacing between bars
          barHeight: "70%", // Optional: control vertical bar height for horizontal bars
          dataLabels: {
            position: "top", // Position labels on top of bars
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
          return Number(val).toFixed(SectionData?.attributeData?.widgetData?.selectedDecimalPoint); // Forces 2 decimal places
        },
      },
      stroke: {
        show: true,
        width: chartType === "line" ? 3 : 2,
        colors: chartType === "bar" ? ["transparent"] : undefined,
        curve: chartType === "line" ? "smooth" : null,
      },
      xaxis: isHorizontal
        ? {
          tickPlacement: 'on',

          labels: {
            show: true,
            trim: true,
            style: {
              fontSize: "12px",
              cssClass: "apexcharts-xaxis-label",
            },
            hideOverlappingLabels: false, // ❌ Allow all labels to render
          },
        }
        : {
          categories,

          labels: {
            show: true,
            trim: true,
            hideOverlappingLabels: false, // ❌ Allow all labels to render

            style: {
              fontSize: "12px",
              cssClass: "apexcharts-xaxis-label",
            },
          },
        },
      yaxis: isHorizontal
        ? {
          categories, // ✅ Needed for horizontal bar
          labels: {
            style: {
              fontSize: "12px",
              cssClass: "apexcharts-yaxis-label",
            },
          },
        }
        : {
          min: 0,
          max: 100, // Let ApexCharts handle the max value to provide padding
          // labels: {
          //   formatter: function (value) {
          //     return Number(value).toFixed(
          //       SectionData?.attributeData?.widgetData?.selectedDecimalPoint
          //     );
          //   },
          // },
        },
      
      fill: {
        opacity: series.map((_, i) => {
          if (activeSeriesIndex === null) {
            return 1;
          }
          return i === activeSeriesIndex ? 1 : 0.35;
        }),
      },
    };
    
    return (
      <div className="resposnseRate">
        <div  className="resposnseRate_chart lg">
          <ReactApexChart
            // ref={chartRef}
            options={options}
            series={series}
            type={chartType}
            height={chartHeight}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering chart:", error);
    return null;
  }
}

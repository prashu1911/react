import React, { useEffect, useRef } from "react";
import ReactApexChart from "react-apexcharts";

export default function TornadoChart({ SectionData, sectionId }) {
  const tornadoChartDataRaw = SectionData?.attributeData?.widgetData?.tornadoChartData;
  const selectedDatasets = SectionData?.attributeData?.controlData?.selectedTornadoDatasets;

  const reorderedTornadoChartData =
    Array.isArray(tornadoChartDataRaw) && Array.isArray(selectedDatasets)
      ? selectedDatasets
          .map((selected) =>
            tornadoChartDataRaw.find(
              (item) =>
                String(item.id) === String(selected.id) &&
                item.type?.toLowerCase() === selected.dataPointType?.toLowerCase()
            )
          )
          .filter(Boolean)
      : [];

  const tornadoChartData = reorderedTornadoChartData || [];

  if (!Array.isArray(tornadoChartData) || tornadoChartData.length < 2) return null;

  // Step 1: Extract unique question names for X-axis categories
  const categories = [
    ...new Set(
      tornadoChartData?.flatMap(
        (entry) => entry?.objects?.map((obj) => obj.name) || entry?.datapoints?.map((obj) => obj.name)
      )
    ),
  ];

  // Step 2: Build series - first series negative, second series positive
  const series = tornadoChartData.slice(0, 2).map((entry, entryIndex) => {
    const values = categories.map((questionName) => {
      const match =
        entry.objects?.find((obj) => obj.name === questionName) ||
        entry.datapoints?.find((obj) => obj.name === questionName);
      let value = parseFloat(match?.value || 0);
      if (isNaN(value)) value = 0;

      // Force sign: first to negative, second to positive
      if (entryIndex === 0 && value > 0) value *= -1;
      if (entryIndex === 1 && value < 0) value *= -1;

      return value;
    });

    return {
      name: entry.name,
      data: values,
    };
  });

  // For y-axis scale
  const allValues = series.flatMap((s) => s.data);
  const minY = Math.min(...allValues, 0) - 10;
  const maxY = Math.max(...allValues, 0) + 10;

  // ✅ Assign color codes from palette
  const colorPalette = SectionData?.attributeData?.widgetData?.selectedPaletteColors?.map((c) => c.colorCode) || [];
  const chartId = `tornado-bar-chart-${sectionId}`;

  const options = {
    chart: {
      id: chartId,
      type: "bar",
      height: 450,
      stacked: true,
      toolbar: { show: false },
      animations: {
        enabled: false, // 🔴 Disable all animations
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "75%",
      },
    },
    xaxis: {
      categories,
      labels: {
        formatter: (val) => `${Math.abs(val)}%`,
      },
    },
    yaxis: {
      min: minY,
      max: maxY,
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        const safeVal = Math.abs(Number(val)); // Convert negative to positive
        return safeVal.toFixed(SectionData?.attributeData?.widgetData?.selectedDecimalPoint || 0);
      },      
      style: {
        fontSize: "12px",
        fontWeight: 600,
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${Math.abs(val)}%`,
      },
    },
    legend: {
      position: "bottom",
    },
    colors: colorPalette,
  };

  return (
    <div className="resposnseRate_chart md">
      <ReactApexChart options={options} series={series} type="bar" height={450} />
    </div>
  );
}

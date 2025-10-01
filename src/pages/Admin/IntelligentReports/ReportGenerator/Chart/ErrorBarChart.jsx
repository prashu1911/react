import React from "react";
import ReactApexChart from "react-apexcharts";

export default function ErrorBarChart({ SectionData }) {
  const errorChartDataRaw = SectionData?.attributeData?.widgetData?.errorBarChartData;
  const selectedDatasets = SectionData?.attributeData?.controlData?.selectedErrorBarDatasets;

  const reorderedTornadoChartData =
    Array.isArray(errorChartDataRaw) && Array.isArray(selectedDatasets)
      ? selectedDatasets?.map((selected) =>
          errorChartDataRaw?.find(
            (item) =>
              String(item.id) === String(selected.id) &&
              item.type?.toLowerCase() === selected.dataPointType?.toLowerCase()
          )
        )
      : [];

  const chartData = reorderedTornadoChartData || [];

  // Transform the data for candlestick format
  const seriesData = chartData
    .map((item) => {
      const values = item.objects.map((obj) => parseFloat(obj.value)).filter((val) => !isNaN(val));
      if (values.length < 4) return null;

      const open = values[0];
      const close = values[values.length - 1];
      const high = Math.max(...values);
      const low = Math.min(...values);

      return {
        x: item.name,
        y: [open, high, low, close],
      };
    })
    .filter(Boolean); // Filter out null entries

  if (!seriesData.length) return null; // Avoid rendering if no valid data

  const series = [{ data: seriesData }];

  const options = {
    chart: {
      type: "candlestick",
      height: 400,
      toolbar: { show: false },
    },
    xaxis: {
      type: "category",
      tooltip: { enabled: false },
      labels: {
        style: { colors: "#333", fontSize: "12px" },
      },
    },
    yaxis: {
      min: Math.min(...seriesData.map((d) => d.y[2])) - 10,
      max: Math.max(...seriesData.map((d) => d.y[1])) + 10,
      labels: {
        formatter: (val) => val.toFixed(0),
      },
    },
    tooltip: {
      shared: true,
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        const [open, high, low, close] = w.globals.initialSeries[seriesIndex].data[dataPointIndex].y;
        return `
          <div style="padding:5px;">
            <strong>${w.globals.labels[dataPointIndex]}</strong><br/>
            Open: ${open}<br/>
            High: ${high}<br/>
            Low: ${low}<br/>
            Close: ${close}
          </div>
        `;
      },
    },
  };

  return (
    <div className="resposnseRate">
      <div className="resposnseRate_chart">
        <ReactApexChart options={options} series={series} type="candlestick" height={400} />
      </div>
    </div>
  );
}

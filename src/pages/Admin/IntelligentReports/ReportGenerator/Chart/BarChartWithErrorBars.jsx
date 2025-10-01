import React, { useRef, useState } from "react";
import Plot from "react-plotly.js";
import { ResponsiveContainer } from "recharts";

export default function BarChartWithErrorBars({ SectionData }) {
  const chartRef = useRef(null);
  const [clickedLegend, setClickedLegend] = useState(null);
  const [hoveredLegend, setHoveredLegend] = useState(null);

  const errorChartDataRaw = SectionData?.attributeData?.widgetData?.errorBarChartData;
  const selectedDatasets = SectionData?.attributeData?.controlData?.selectedErrorBarDatasets;

  const reorderedTornadoChartData =
    Array.isArray(errorChartDataRaw) && Array.isArray(selectedDatasets)
      ? selectedDatasets.map((selected) =>
        errorChartDataRaw.find(
          (item) =>
            String(item.id) === String(selected.id) &&
            item.type?.toLowerCase() === selected.dataPointType?.toLowerCase()
        )
      )
      : [];

  const errorBarChartData = reorderedTornadoChartData;

  if (!Array.isArray(errorBarChartData) || errorBarChartData.length === 0) return null;

  const uniqueObjectNames = [
    ...new Set(
      errorBarChartData.flatMap((entry) =>
        Array.isArray(entry?.objects)
          ? entry.objects.map((obj) => obj?.name).filter(Boolean)
          : Array.isArray(entry?.datapoints)
            ? entry.datapoints.map((obj) => obj?.name).filter(Boolean)
            : []
      )
    ),
  ];

  const wrapText = (text, maxLength = 28) => {
    if (!text) return "N/A";
    if (text.length <= maxLength) {
      return text;
    }

    const words = text.split(" ");
    const lines = [];
    let currentLine = "";

    for (const word of words) {
      if (word.length === 0) continue;

      if (currentLine.length === 0) {
        currentLine = word;
      } else if (currentLine.length + 1 + word.length <= maxLength) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);

    return lines.join("<br>");
  };
  

  const categories = errorBarChartData.map((entry) => wrapText(entry?.name));

  const plotlySeries = uniqueObjectNames.map((objectName, index) => {
    const yValues = [];
    const errorValues = [];
    const textLabels = [];

    errorBarChartData.forEach((entry) => {
      const match =
        entry?.objects?.find((obj) => obj?.name === objectName) ||
        entry?.datapoints?.find((obj) => obj?.name === objectName);
      const yVal = match?.value !== undefined ? Number(match.value) : 0;
      const errorVal = match?.errorDifference !== undefined ? Number(match.errorDifference) : 0;

      yValues.push(yVal);
      errorValues.push(errorVal);
      textLabels.push(`${match?.value} (${match?.errorDifference})`);
    });

    const decimalPlaces = SectionData?.attributeData?.widgetData?.selectedDecimalPoint || 0;
const hoverTemplateString =
  `<b>%{x}</b><br>` +
  `Value: %{y:.${decimalPlaces}f}<br>` +
  `Error: %{customdata:.${decimalPlaces}f}<extra></extra>`;

    // Highlight logic
    const finalHighlighted = hoveredLegend || clickedLegend;
    let opacity = 1;
    if (finalHighlighted !== null) {
      opacity = finalHighlighted === objectName ? 1 : 0.2;
    }

    return {
      type: "bar",
      name: objectName,
      x: categories,
      y: yValues,
      text: textLabels,
      textposition: "auto",
      textfont: { size: 10, color: "#000" },
      marker: {
        color: SectionData?.attributeData?.widgetData?.selectedPaletteColors[
          index % SectionData?.attributeData?.widgetData?.selectedPaletteColors.length
        ]?.colorCode,
        opacity,
      },
      error_y: {
        type: "data",
        array: errorValues,
        visible: true,
        color: "red",
        thickness: 1.5,
        width: 6,
      },
      hovertemplate:hoverTemplateString,
      customdata: errorValues,
    };

  });

  const maxYValue = Math.max(
    ...plotlySeries.flatMap((trace) => trace.y.map((yVal, i) => yVal + trace.error_y.array[i]))
  );

  const layout = {
    title: "Bar Chart with Error Bars (per object)",
    barmode: "group",
    autosize: true,
    dragmode: false, // ⛔ disables zoom, pan, and selection
    xaxis: {
      title: "Category",
      tickangle: 0,
      automargin: true,              // ✅ Prevent overlap
      tickmode: "array",             // ✅ Explicit tick spacing
      tickfont: {
        size: 10,                    // ✅ Slightly smaller labels
      },
      tickson: "boundaries",         // ✅ Adds space between categories
      margin: { l: 50, r: 0, t: 50, b: 80 },
      overlaying:"x12"

    },
    yaxis: {
      title: "Value",
      range: [0, Math.ceil(maxYValue + 5)],
    },
    showlegend: true,
    legend: {
      orientation: "h",
      x: 0.5,
      xanchor: "center",
      y: -0.2,
    },
    margin: { l: 50, r: 0, t: 50, b: 50 }, // optional for spacing
  };

  return (
    <div style={{
      width: "100%", height: "450px",
      position: "relative",       // ✅ REQUIRED for Plotly resizing
      display: "flex",
    }} ref={chartRef}>
      {" "}
      {/* ✅ Full width container */}
      <ResponsiveContainer>

        <Plot
          data={plotlySeries}
          layout={layout}
          config={{
            displayModeBar: false,
            displaylogo: false,
            responsive: true,
            scrollZoom: false, // ⛔ disables scroll zoom
          }}
          onLegendClick={(event) => {
            // event.curveNumber gives the trace index
            const traceName = plotlySeries[event.curveNumber]?.name;
            setClickedLegend((prev) =>
              prev === traceName ? null : traceName
            );
            return false; // Prevent default hide/show
          }}
          onLegendHover={(event) => {
            const traceName = plotlySeries[event.curveNumber]?.name;
            setHoveredLegend(traceName);
          }}
          onLegendUnhover={() => {
            setHoveredLegend(null);
          }}
          useResizeHandler={true}
          style={{ width: "100%", height: "100%" }} // ✅ Match parent dimensions
        />
      </ResponsiveContainer>
    </div>
  );
}

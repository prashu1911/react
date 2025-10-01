import React from "react";
import {
  getChartTypeByID,
  getDataLabelsByID,
  getFontOptionsByID,
  getLgendsByID,
} from "utils/common.util";
import CommonBarChartAnnotation from "../../CommonBarChartAnnotation";

const ChartRenderer = ({
  question,
  scalarConfiguration,
  renderChart,
  sortOrder,
  switchAxis,
  chartTypeOptions,
  legendOptions,
  dataLabelOptions,
  fontSizeOptions,
}) => {
  const chartType =
    getChartTypeByID(
      question?.chartOptions?.chartType,
      chartTypeOptions,
      true
    ) || "pie";
    console.log(question)

  const legendPosition =
    getLgendsByID(question?.chartOptions?.legend, legendOptions) || "bottom";

  const labelPosition =
    getDataLabelsByID(question?.chartOptions?.dataLabel, dataLabelOptions) ||
    "top";

  const fontSize =
    getFontOptionsByID(question?.chartOptions?.fontSize, fontSizeOptions) ||
    "12";

  const annotationOpacity = Number(
    ((question?.chartOptions?.scalarOpacity ?? 100) / 100).toFixed(2)
  );

  const outcome = question?.outcome_value || "";

  
  // === 🔁 Transform based on axis switch ===

  function extractData(input, isXAxis) {
    if (isXAxis) {
      const categories = input.responses.map(
        (r) => r.response_name ?? r.responseName ?? ""
      );

      const values = input.responses.map((r) => ({
        [outcome]: parseFloat(r.response_percentage ?? r.percentage ?? 0),
      }));

      const counts = input.responses.map((r) => r.response_count??r.responded ?? 0);

      return { categories, values, counts };
    } else {
      const categories = [outcome];

      const values = [
        input.responses.reduce((acc, r) => {
          const key = r.response_name ?? r.responseName ?? "";
          acc[key] = parseFloat(r.response_percentage ?? r.percentage ?? 0);
          return acc;
        }, {}),
      ];

      const counts = input.responses.map((r) => r.response_count??r.responded ?? 0);

      return { categories, values, counts };
    }
  }

  const isPie = chartType === "pie" || chartType === "donut";

  const { categories, values, counts } = isPie
    ? {
        categories:
          question.responses?.map(
            (r) => r.responseName ?? r.response_name ?? ""
          ) || [],
        values:
          question.responses?.map((r) =>
            parseFloat(r.percentage ?? r.response_percentage ?? 0)
          ) || [],
        counts:
          question.responses?.map((r) => r.response_count??r.responded ?? 0) || [],
      }
    : extractData(question, question?.chartOptions?.switchAxis === "xAxis");

  return (
    <>
    {/* {JSON.stringify(counts)} */}
    <CommonBarChartAnnotation
      scalarConfigurationPropData={scalarConfiguration}
      colorsChart={question?.colorsArray}
      renderChart={renderChart}
      chartType={chartType}
      legendPosition={legendPosition}
      labelPosition={labelPosition}
      fontSize={fontSize}
      switchAxis={false}
      labelColorState={question?.chartOptions?.lableColor}
      annotationOpacity={annotationOpacity}
      showNegative={false}
      values={values}
      categories={categories}
      sortOrder={sortOrder}
      counts={counts} // ✅ Passed counts here
    /></>
  );
};

export default ChartRenderer;

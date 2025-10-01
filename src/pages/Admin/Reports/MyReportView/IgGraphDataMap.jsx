import CommonBarChartAnnotation from "pages/Admin/Analytics/CommonBarChartAnnotation";
import ChartRenderer from "pages/Admin/Analytics/DemographicTrendAnalysis/CollapseAge/ChartRenderer";
import React from "react";
import {
  getChartTypeByID,
  getDataLabelsByID,
  getFontOptionsByID,
  getLgendsByID,
} from "utils/common.util";

export default function IgGraphDataMap({
  chartData,
  scalarConfiguration = [],
  renderChart,
  legendOptions,
  dataLabelOptions,
  fontSizeOptions,
  chartTypeOptions,
}) {
  console.log(chartTypeOptions,"charttype")
  return (
    <>
      {chartData?.map((question, index) => {
        return (
          <div key={index}>
            <div key={index} className="responseBox d-flex mb-4">
              <div className="responseBox_left">
                <h4 className="responseBox_txt mb-0">
                  {question.questionName}
                </h4>
              </div>
              <div className="responseBox_right">
                <div className="responseBox_chart">
                <ChartRenderer
                  question={question}
                  scalarConfiguration={scalarConfiguration}
                  renderChart={true}
                  // sortOrder={sortOrder}
                  chartTypeOptions={chartTypeOptions}
                  legendOptions={legendOptions}
                  dataLabelOptions={dataLabelOptions}
                  fontSizeOptions={fontSizeOptions}
                />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

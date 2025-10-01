import CommonBarChartAnnotation from "pages/Admin/Analytics/CommonBarChartAnnotation";
import React from "react";
import {
  getDataLabelsByID,
  getFontOptionsByID,
  getLgendsByID,
} from "utils/common.util";

export default function DemographicGraphData({
  chartData,
  scalarConfiguration = [],
  renderChart,
  report,
  legendOptions,
  chartOptions,
  colorsChart,
  dataLabelOptions,
  fontSizeOptions,
}) {
  return (
    <>
      {chartData?.map((question, index) => {
        // Extract counts for each response — adjust property name as needed
        const counts =
          question.responses?.map((r) =>
            r.response_count ?? r.responded ?? 0
          ) || [];

        return (
          <div key={index}>
            <div className="responseBox d-flex mb-4">
              <div className="responseBox_left border-0" style={{ width: '100%' }}>
                <h4
                  className="responseBox_txt mb-0"
                  style={{ textAlign: 'center' }}
                >
                  {question.questionName}
                </h4>
                <CommonBarChartAnnotation
                  scalarConfigurationPropData={scalarConfiguration}
                  colorsChart={colorsChart}
                  report={report}
                  renderChart={renderChart}
                  chartType="pie"
                  legendPosition={
                    getLgendsByID(chartOptions?.legend, legendOptions) || "bottom"
                  }
                  labelPosition={
                    getDataLabelsByID(chartOptions?.dataLabel, dataLabelOptions) || "top"
                  }
                  fontSize={
                    getFontOptionsByID(chartOptions?.fontSize, fontSizeOptions) || "12"
                  }
                  switchAxis={question?.chartOptions?.switchAxis === "xAxis"}
                  labelColorState={chartOptions?.lableColor}
                  annotationOpacity={Number(
                    (chartOptions?.scalarOpacity / 100).toFixed(2)
                  )}
                  showNegative={false}
                  values={
                    question.responses?.map((r) =>
                      parseFloat(r.percentage ?? r.response_percentage ?? 0)
                    )
                  }
                  categories={
                    question.responses?.map((r) =>
                      r.responseName ?? r.response_name ?? ""
                    ) || []
                  }
                  counts={counts} // Pass counts here!
                />
              </div>
              <div style={{ backgroundColor: 'black' }}>
                <div>
                  {/* Debug: {JSON.stringify(counts)} */}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}


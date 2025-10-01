import CommonBarChartAnnotation from "pages/Admin/Analytics/CommonBarChartAnnotation";
import React from "react";
import {
  getChartTypeByID,
  getDataLabelsByID,
  getFontOptionsByID,
  getLgendsByID,
} from "utils/common.util";

export default function DynamicDataMap({
  chartData,
  renderChart,
  legendOptions,
  dataLabelOptions,
  fontSizeOptions,
  chartTypeOptions,
}) {
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
                  <CommonBarChartAnnotation
                    scalarConfigurationPropData={[]}
                    colorsChart={question.colorCodeArray}
                    renderChart={renderChart}
                    chartType={
                      getChartTypeByID(
                        question?.chartOptions?.chartType,
                        chartTypeOptions,
                        false
                      ) || "pie"
                    }
                    legendPosition={
                      getLgendsByID(
                        question?.chartOptions?.legend,
                        legendOptions
                      ) || "bottom"
                    }
                    labelPosition={
                      getDataLabelsByID(
                        question?.chartOptions?.dataLabel,
                        dataLabelOptions
                      ) || "top"
                    }
                    fontSize={
                      getFontOptionsByID(
                        question?.chartOptions?.fontSize,
                        fontSizeOptions
                      ) || "12"
                    }
                    switchAxis={question?.chartOptions?.switchAxis === "xAxis"}
                    labelColorState={question?.chartOptions?.lableColor}
                    annotationOpacity={Number(
                      (question?.chartOptions?.scalarOpacity / 100).toFixed(2)
                    )}
                    showNegative={false}
                    values={question.responses?.map((r) =>
                      parseFloat(r.percentage ?? r.response_percentage ?? 0)
                    )}
                    categories={
                      question.responses?.map(
                        (r) => r.responseName ?? r.response_name ?? ""
                      ) || []
                    }
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

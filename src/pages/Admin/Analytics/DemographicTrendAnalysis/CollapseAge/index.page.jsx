import React, { useState } from "react";
import { Collapse } from "react-bootstrap";
import ChartOptions from "../../Charting/CollapseFilterOptions/ChartOptions";
import ChartRenderer from "./ChartRenderer";

export default function CollapseAge({
  score,
  chartData,
  scalarConfiguration = [],
  renderChart,
  chartTypeOptions,
  legendOptions,
  childAxis,
  dataLabelOptions,
  fontSizeOptions,
  handleChartTypeChange,
  handleLegendPositionChange,
  handleLablePosistionChange,
  handleFontSizeChange,
  handleSwitchAxisChange,
  handleLabelColorChange,
  handleOpacityChange,
  handleChartColorChange,
  renderScalar,
  switchAxis,
  sortOrder,
}) {
  const [collapseStates, setCollapseStates] = useState({});

  const toggleCollapse = (index) => {
    setCollapseStates((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
 console.log(chartData,"chhh")
  return (
    <>
      {chartData?.map((question, index) => (
        <div key={index}>
          <button
            type="button"
            className="commonCollapse ripple-effect"
            onClick={() => toggleCollapse(index)}
            aria-controls={`collapse-${index}`}
            aria-expanded={collapseStates[index] || false}
          >
            <span className="me-2">Chart Options</span>
            <em className="icon-drop-down" />
          </button>
          <Collapse in={collapseStates[index] || false}>
            <div id={`collapse-${index}`}>
              <div className="optionCollapse">
                <div className="optionCollapse_inner" style={{margin: "20px"}}>
                  <ChartOptions
                   
                    score={score}
                    onColorChange={(value) =>
                      handleChartColorChange(value, index)
                    }
                    handleChartTypeChange={(value) =>
                      handleChartTypeChange(value, index)
                    }
                    handleLegendPosistionChange={(value) =>
                      handleLegendPositionChange(value, index)
                    }
                    handleLablePosistionChange={(value) =>
                      handleLablePosistionChange(value, index)
                    }
                    handleFontSizeChange={(value) =>
                      handleFontSizeChange(value, index)
                    }
                    handleSwitchAxisChange={(e) =>
                      handleSwitchAxisChange(!e.target.checked, index)
                    }
                    handleLabelColorChange={(e) => {
                      handleLabelColorChange(e.target.value, index);
                    }}
                    handleOpacityChange={(e) =>
                      handleOpacityChange(e.target.value, index)
                    }
                    chartTypeOptions={chartTypeOptions}
                    legendOptions={legendOptions}
                    dataLabelOptions={dataLabelOptions}
                    fontSizeOptions={fontSizeOptions}
                    chartType={question?.chartOptions?.chartType}
                    legendPosition={question?.chartOptions?.legend}
                    labelPosition={question?.chartOptions?.dataLabel}
                    fontSize={question?.chartOptions?.fontSize}
                    switchAxis={question?.chartOptions?.switchAxis === "xAxis"}
                    labelColorState={question?.chartOptions?.lableColor}
                    annotationOpacity={question?.chartOptions?.scalarOpacity}
                    selectedColorPallet={question?.colors}
                    renderScalar={renderScalar}
                    switchAxixButtonShow={childAxis}
                  />
                </div>
              </div>
            </div>
          </Collapse>
          <div key={index} className="responseBox d-flex">
            <div className="responseBox_left">
              <h4 className="responseBox_txt mb-0">{question.questionName}</h4>
            </div>
            <div className="responseBox_right">
              <div className="responseBox_chart">
                <ChartRenderer
                  question={question}
                  scalarConfiguration={scalarConfiguration}
                  renderChart={renderChart}
                  sortOrder={sortOrder}
                  switchAxis={switchAxis}

                  chartTypeOptions={chartTypeOptions}
                  legendOptions={legendOptions}
                  dataLabelOptions={dataLabelOptions}
                  fontSizeOptions={fontSizeOptions}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

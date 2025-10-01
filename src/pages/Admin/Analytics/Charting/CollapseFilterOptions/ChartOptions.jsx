import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Form, Collapse, Row, Col } from "react-bootstrap";
import {
  Button,
  ColorPellates,
  InputField,
  RangeSlider,
  SelectField,
} from "../../../../../components";

import {
  getAssessmentCharting,
} from "../../../../../redux/AssesmentCharting/index.slice";
import { useDispatch } from "react-redux";
import {  updateAssessmentCharting } from "../../../../../redux/AssesmentCharting/index.slice";

export default function ChartOptions({
  score,
  onColorChange,
  chartTypeOptions,
  legendOptions,
  dataLabelOptions,
  fontSizeOptions,
  handleChartTypeChange,
  chartType,
  handleLegendPosistionChange,
  legendPosition,
  handleLablePosistionChange,
  labelPosition,
  handleFontSizeChange,
  fontSize,
  handleSwitchAxisChange,
  labelColorState,
  handleLabelColorChange,
  handleOpacityChange,
  annotationOpacity,
  showApllyAll,
  handleApplyAll,
  selectedColorPallet = {},
  renderScalar,
  switchAxixButtonShow,
  switchAxis
}) {
  // const { switchAxis } = useSelector(getAssessmentCharting) || {};

  const [paletteCollapse, setPaletteCollapse] = useState(false);
  const switchAxisId = `switchAxis-${Math.random().toString(36)}`;
  const chartoptionsRedux = useSelector(getAssessmentCharting)?.defaultColor


  const [currentColorPallet, setCurrentColorPallet] = useState({
    colorPaletteID: "",
    colors: [],
  });

  const dispatch = useDispatch()

  // console.log(chartoptionsRedux,"redux",currentColorPallet)

 

  const handleColorPicker = (value) => {
    setCurrentColorPallet({
      colorPaletteID: value?.colorPaletteID,
      colors: value?.colors,
    });
dispatch(
  updateAssessmentCharting({
    defaultColor:{
      colorPaletteID:value?.colorPaletteID,
      colors: value?.colors,
    }
  })
)
    if (onColorChange) {
      onColorChange(value);
    }
  };

  useEffect(() => {
    if (Object.keys(selectedColorPallet)?.length > 0) {
      setCurrentColorPallet({
        colorPaletteID:
          selectedColorPallet?.paletteID || selectedColorPallet?.colorPaletteID,
        colors: selectedColorPallet?.colors,
      });
      updateAssessmentCharting({
        defaultColor:{
          colorPaletteID:
          selectedColorPallet?.paletteID || selectedColorPallet?.colorPaletteID,
        colors: selectedColorPallet?.colors,
        }
      })
    } else if (score?.defaultColor) {
      setCurrentColorPallet({
        colorPaletteID: score?.defaultColor[0]?.PaletteID,
        colors: score?.defaultColor[0]?.colors,
      });
      updateAssessmentCharting({
        defaultColor:{
          colorPaletteID: score?.defaultColor[0]?.PaletteID,
          colors: score?.defaultColor[0]?.colors,
        }
      })
    }
  }, [score, Object.keys(selectedColorPallet).length, renderScalar]);

  useEffect(() => {
    console.log("FONT SIZE: ", fontSize);
  }, [fontSize]);

  return (
    <div className="formCard optionCollapse">
      <Row className="gx-2 gy-3 align-items-baseline">
        <Col lg={2} md={4} sm={6}>
          <Form.Group className="form-group mb-0">
            <Form.Label>Select Palette</Form.Label>
            <Button
              variant="secondary"
              className="palleteBtn w-100"
              onClick={() => setPaletteCollapse(!paletteCollapse)}
              aria-controls="palette"
              aria-expanded={paletteCollapse}
            >
              <span className="me-2"> Palette </span>
              <em className="icon-drop-down ms-auto position-static" />
            </Button>
          </Form.Group>
        </Col>

        <Col lg={3} md={4} sm={6} className="customField">
          <Form.Group className="form-group mb-0">
            <Form.Label>Chart Type</Form.Label>
            <SelectField
              placeholder="Select Chart Type"
              options={chartTypeOptions}
              value={chartTypeOptions?.find(({ value }) => value === chartType)}
              onChange={(option) => handleChartTypeChange(option)}
            />
          </Form.Group>
        </Col>

        <Col lg={3} md={4} sm={6} className="customField">
          <Form.Group className="form-group mb-0">
            <Form.Label>Legend</Form.Label>
            <SelectField
              placeholder="Select Legend Position"
              options={legendOptions}
              value={legendOptions?.find(({ value }) => value === legendPosition)}
              onChange={(option) => handleLegendPosistionChange(option)}
            />
          </Form.Group>
        </Col>

        <Col lg={3} md={4} sm={6} className="customField">
          <Form.Group className="form-group mb-0">
            <Form.Label>Data Label</Form.Label>
            <SelectField
              placeholder="Select Data Label"
              options={dataLabelOptions}
              value={dataLabelOptions?.find(({ value }) => value === labelPosition)}
              onChange={(option) => handleLablePosistionChange(option)}
              isDisabled={
                chartType === "pie" ||
                chartType === "donut" ||
                chartType === 4 ||
                chartType === 5||
                chartType === 7||
                chartType === 8


              }
            />
          </Form.Group>
        </Col>

        <Col lg={2} md={4} sm={6}>
          <Form.Group className="form-group mb-0">
            <Form.Label>Data Label Color</Form.Label>
            <InputField
              type="color"
              className="form-control-color p-1"
              name="data_label_color"
              value={labelColorState}
              onChange={handleLabelColorChange}
              disabled={
                labelPosition?.label === "None" || labelPosition?.value === 4
              }
            />
          </Form.Group>
        </Col>

        <Col lg={3} md={4} sm={6} className="customField">
          <Form.Group className="form-group mb-0">
            <Form.Label>Font Size</Form.Label>
            <SelectField
              placeholder="Select Font Size"
              options={fontSizeOptions}
              value={fontSizeOptions?.find(
                ({ value }) => value === (fontSize < 8 ? 12 : fontSize || 12)
              )}
              onChange={(option) => handleFontSizeChange(option)}
              isDisabled={
                labelPosition?.label === "None" || labelPosition?.value === 4
              }
            />
          </Form.Group>
        </Col>

        <Col lg={3} md={4} sm={6} className="customField">
          <Form.Group className="form-group mb-0">
            <Form.Label className="d-flex justify-content-between mb-3">
              Color Opacity <span id="percentage">{annotationOpacity}%</span>
            </Form.Label>
            <RangeSlider
              value={annotationOpacity}
              onChange={handleOpacityChange}
              min={0}
              max={100}
              name="summary_scalar_opacity"
              placeholder="Adjust Opacity"
              className="form-range w-100"
              disabled={chartType === "pie"}
            />
          </Form.Group>
        </Col>

        {switchAxixButtonShow ? (
          <Col lg={3} md={4} sm={6} className="customField">
            <Form.Group className="form-group mb-0">
              <Form.Label>Switch Axis</Form.Label>
              <div className="switchBtn">
                <InputField
                  type="checkbox"
                  id={switchAxisId}
                  onChange={handleSwitchAxisChange} // 👈 kept exactly as you asked
                  checked={switchAxis}               // 👈 from Redux
                  disabled={
                    chartType === "pie" ||
                    chartType === "donut"
                  }
                />
                <Form.Label htmlFor={switchAxisId} />
              </div>
            </Form.Group>
          </Col>
        ) : (
          ""
        )}
      </Row>

      <Collapse in={paletteCollapse}>
        <div>
          {paletteCollapse && (
            <ColorPellates
              keyValue="chartPalette"
              data={score}
              value={chartoptionsRedux?.colorPaletteID}
              handleColorPicker={handleColorPicker}
            />
          )}
        </div>
      </Collapse>

      {showApllyAll && (
        <Button onClick={handleApplyAll} className="mt-3">
          Apply All{" "}
        </Button>
      )}
    </div>
  );
}

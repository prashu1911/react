import React, { useEffect, useState, useRef } from "react";
import { Form, Collapse } from "react-bootstrap";
import {
  Button,
  InputField,
  SelectField,
  ColorPellates,
} from "../../../../../components";

export default function Filter({ score }) {
  // Add score prop
  const [paletteCollapse, setPaletteCollapse] = useState(false);

  // Chart Options
  const chartOptions = [
    { value: "Line", label: "Line" },
    { value: "Bar", label: "Bar" },
    { value: "Combo", label: "Combo" },
    { value: "Scatter", label: "Scatter" },
    { value: "Spider", label: "Spider" },
  ];
  // legend Options
  const legendOptions = [
    { value: "Bottom", label: "Bottom" },
    { value: "Right", label: "Right" },
    { value: "Left", label: "Left" },
    { value: "Hide", label: "Hide" },
  ];
  // fontSize Options
  const fontSizeOptions = [
    { value: "8", label: "8" },
    { value: "10", label: "10" },
    { value: "12", label: "12" },
    { value: "14", label: "14" },
    { value: "16", label: "16" },
    { value: "18", label: "18" },
  ];
  // data Label Options
  const dataLabelOptions = [
    { value: "Bottom", label: "Bottom" },
    { value: "Top", label: "Top" },
    { value: "Center", label: "Center" },
    { value: "None", label: "None" },
  ];

  // Collapse
  // const [show, setShow] = useState(false);

  // range slider start
  const [sliderValue1, setSliderValue1] = useState(50); // Initial value

  const slider1Ref = useRef(null);
  const updateSliderBackground = (sliderElement, value) => {
    const color = `linear-gradient(to right, #0968AC ${value}%, #CDCED0 ${value}%)`;
    if (sliderElement) {
      sliderElement.style.background = color;
    }
  };

  useEffect(() => {
    updateSliderBackground(slider1Ref.current, sliderValue1);
  }, []);

  const handleSliderChange1 = (event) => {
    const { value } = event.target;
    setSliderValue1(value);
    updateSliderBackground(event.target, value);
  };

  const [currentColorPallet, setCurrentColorPallet] = useState({
    colorPaletteID: "",
    colors: [],
  });

  const handleColorPicker = (value) => {
    setCurrentColorPallet({
      colorPaletteID: value?.colorPaletteID,
      colors: value?.colors,
    });
  };

  useEffect(() => {
    if (score?.defaultColor) {
      setCurrentColorPallet({
        colorPaletteID: score?.defaultColor[0]?.PaletteID,
        colors: score?.defaultColor[0]?.colors,
      });
    }
  }, [score]);

  return (
    <>
      <ul className="list-unstyled mb-0 d-flex gap-x-2 gap-y-3 justify-content-lg-between align-items-lg-end align-items-center flex-wrap">
        <li className="selectPalette">
          <Form.Group className="form-group mb-0">
            <Form.Label>Select Palette</Form.Label>
            <Button
              className="palleteBtn"
              onClick={() => setPaletteCollapse(!paletteCollapse)}
              aria-controls="pallete-collapse"
              aria-expanded={paletteCollapse}
            >
              <span className="me-2"> Palette </span>
              <em className="icon-drop-down" />
            </Button>
          </Form.Group>
        </li>
        <li className="customOption">
          <Form.Group className="form-group mb-0">
            <Form.Label>Chart Type</Form.Label>
            <SelectField
              placeholder="Select Chart Type"
              options={chartOptions}
            />
          </Form.Group>
        </li>
        <li className="customOption">
          <Form.Group className="form-group mb-0">
            <Form.Label>Legend</Form.Label>
            <SelectField placeholder="Select Legend" options={legendOptions} />
          </Form.Group>
        </li>
        <li className="customOption">
          <Form.Group className="form-group mb-0">
            <Form.Label>Data Label</Form.Label>
            <SelectField
              placeholder="Select Data Label"
              options={dataLabelOptions}
            />
          </Form.Group>
        </li>
        <li className="selectPalette">
          <Form.Group className="form-group mb-0">
            <Form.Label className="mb-2">Data Label Color</Form.Label>
            <InputField
              type="color"
              className=" form-control-color p-1"
              id="myColor1"
              defaultValue="#000000"
              title="Choose a color"
            />
          </Form.Group>
        </li>
        <li className="customOption">
          <Form.Group className="form-group mb-0">
            <Form.Label>Font Size</Form.Label>
            <SelectField
              placeholder="Select Font Size"
              options={fontSizeOptions}
            />
          </Form.Group>
        </li>
        <li className="customOption">
          <Form.Group className="form-group mb-0">
            <Form.Label className="d-flex justify-content-between">
              Color Opacity <span id="percentage">{sliderValue1}%</span>
            </Form.Label>
            <div className="colorOpacity">
              <InputField
                type="range"
                id="slider1"
                min="0"
                max="100"
                defaultValue={sliderValue1}
                innerRef={slider1Ref}
                onChange={handleSliderChange1}
                placeholder="Report Name"
              />
            </div>
          </Form.Group>
        </li>
        <li className="customOption d-flex justify-content-lg-end">
          <Button type="button" variant="primary" className="ripple-effect">
            Apply All
          </Button>
        </li>
      </ul>
      <Collapse in={paletteCollapse}>
        <div>
          {paletteCollapse && (
            <ColorPellates
              keyValue="chartPalette"
              data={score}
              value={currentColorPallet?.colorPaletteID}
              handleColorPicker={handleColorPicker}
            />
          )}
        </div>
      </Collapse>
    </>
  );
}

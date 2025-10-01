import React, { useEffect, useRef, useState } from 'react';
import { Form, Collapse } from 'react-bootstrap';
import {Button, ColorPellates, InputField, SelectField } from '../../../../../components';

export default function ChartOptions() {
  // collapse
  const [paletteCollapse, setPaletteCollapse] = useState(false);
  const switchAxisId = `switchAxis-${Math.random().toString(36)}`;
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
      const {value} = event.target;
      setSliderValue1(value);
      updateSliderBackground(event.target, value);
  };
  // range slider end
  
  // chart type Options
  const chartTypeOptions = [
    { value: 'Line', label: 'Line' },
    { value: 'Column', label: 'Column' },
    { value: 'Bar', label: 'Bar' }  
  ]
  // legend Options
  const legendOptions = [
    { value: 'Legend01', label: 'Legend01' },
    { value: 'Legend02', label: 'Legend02' }
  ]
  // dataLabel Options
  const dataLabelOptions = [
    { value: 'Data01', label: 'Data01' },
    { value: 'Data02', label: 'Data02' }
  ]
  // font Size Options
  const fontSizeOptions = [
    { value: '12', label: '12' },
    { value: '14', label: '14' },
    { value: '16', label: '16' },
    { value: '18', label: '18' }
  ]

  return (
    <div className="formCard optionCollapse">
      <ul className="list-unstyled mb-0 d-flex gap-3 justify-content-between align-items-baseline flex-wrap">
        <li className='selectPalette'>
            <Form.Group className="form-group mb-0" >
                <Form.Label>Select Palette</Form.Label>
                <Button variant="secondary" className="palleteBtn" onClick={() => setPaletteCollapse(!paletteCollapse)} aria-controls="palette" aria-expanded={paletteCollapse}> <span className='me-2'> Palette </span> <em className='icon-drop-down ms-auto position-static' />  </Button>
            </Form.Group>
        </li>
        <li className='customOption'>
            <Form.Group className="form-group mb-0" >
                <Form.Label>Chart Type</Form.Label>
                <SelectField  placeholder="Company Name" options={chartTypeOptions} />
            </Form.Group>
        </li>
        <li className='customOption'>
            <Form.Group className="form-group mb-0" >
                <Form.Label>Legend</Form.Label>
                <SelectField  placeholder="Company Name" options={legendOptions} />
            </Form.Group>
        </li>
        <li className='customOption'>
            <Form.Group className="form-group mb-0" >
                <Form.Label>Data Label</Form.Label>
                <SelectField  placeholder="Company Name" options={dataLabelOptions} />
            </Form.Group>
        </li>
        <li className='selectPalette'>
            <Form.Group className="form-group mb-0" >
                <Form.Label>Data Label Color</Form.Label>
                <InputField type="color" className=" form-control-color p-1" id="myColor1" defaultValue="#0968AC" title="Choose a color"/>
            </Form.Group>
        </li>
        <li className='customOption'>
            <Form.Group className="form-group mb-0" >
                <Form.Label>Font Size</Form.Label>
                <SelectField  placeholder="Company Name" options={fontSizeOptions} />
            </Form.Group>
        </li>
        <li className='customOption'>
          <Form.Group className='form-group mb-0'>
            <Form.Label className="d-flex justify-content-between mb-3">Color Opacity <span id="percentage">{sliderValue1}%</span></Form.Label>
            <div className="colorOpacity">
                <InputField type="range" className="w-100" id="slider1" min="0" max="100" defaultValue={sliderValue1}  innerRef={slider1Ref} onChange={handleSliderChange1} placeholder="Report Name" />
            </div>
          </Form.Group>
        </li>
        <li className="customOption">
          <Form.Group className="form-group mb-0">
              <Form.Label>Switch Axis</Form.Label>
              <div className="switchBtn">
                  <InputField
                    type="checkbox"
                    id={switchAxisId}
                    />
                  <Form.Label htmlFor={switchAxisId} />
              </div>
          </Form.Group>
        </li>
      </ul>
      <Collapse in={paletteCollapse}>
        <div><ColorPellates /></div>
      </Collapse>
    </div>
  );
}

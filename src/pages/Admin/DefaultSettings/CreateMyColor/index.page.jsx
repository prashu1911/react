/* eslint-disable one-var */
/* eslint-disable no-plusplus */
import React, { useEffect, useRef, useState } from "react";
import {
  Col,
  Form,
  FormGroup,
  Nav,
  OverlayTrigger,
  Popover,
  Row,
  Tab,
} from "react-bootstrap";
import chroma from "chroma-js";
import { commonService } from "services/common.service";
import { DEFAULT_SETTINGS } from "apiEndpoints/DefaultSettings";
import toast from "react-hot-toast";
import { Link, useLocation } from "react-router-dom";
import { useAuth, useColorBlindSimulation } from "customHooks";
import SequentialTab from "./SequentialTab";
import DivergingTab from "./DivergingTab";
import CustomTab from "./CustomTab";
import { Breadcrumb, Button, InputField } from "../../../../components";
import adminRouteMap from "../../../../routes/Admin/adminRouteMap";

const NAMED_COLORS = {
  aliceblue: "f0f8ff",
  antiquewhite: "faebd7",
  aqua: "0ff",
  aquamarine: "7fffd4",
  azure: "f0ffff",
  beige: "f5f5dc",
  bisque: "ffe4c4",
  black: "000",
  blanchedalmond: "ffebcd",
  blue: "00f",
  blueviolet: "8a2be2",
  brown: "a52a2a",
  burlywood: "deb887",
  cadetblue: "5f9ea0",
  chartreuse: "7fff00",
  chocolate: "d2691e",
  coral: "ff7f50",
  cornflowerblue: "6495ed",
  cornsilk: "fff8dc",
  crimson: "dc143c",
  cyan: "0ff",
  darkblue: "00008b",
  darkcyan: "008b8b",
  darkgoldenrod: "b8860b",
  darkgray: "a9a9a9",
  darkgrey: "a9a9a9",
  darkgreen: "006400",
  darkkhaki: "bdb76b",
  darkmagenta: "8b008b",
  darkolivegreen: "556b2f",
  darkorange: "ff8c00",
  darkorchid: "9932cc",
  darkred: "8b0000",
  darksalmon: "e9967a",
  darkseagreen: "8fbc8f",
  darkslateblue: "483d8b",
  darkslategray: "2f4f4f",
  darkslategrey: "2f4f4f",
  darkturquoise: "00ced1",
  darkviolet: "9400d3",
  deeppink: "ff1493",
  deepskyblue: "00bfff",
  dimgray: "696969",
  dimgrey: "696969",
  dodgerblue: "1e90ff",
  firebrick: "b22222",
  floralwhite: "fffaf0",
  forestgreen: "228b22",
  fuchsia: "f0f",
  gainsboro: "dcdcdc",
  ghostwhite: "f8f8ff",
  gold: "ffd700",
  goldenrod: "daa520",
  gray: "808080",
  grey: "808080",
  green: "008000",
  greenyellow: "adff2f",
  honeydew: "f0fff0",
  hotpink: "ff69b4",
  indianred: "cd5c5c",
  indigo: "4b0082",
  ivory: "fffff0",
  khaki: "f0e68c",
  lavender: "e6e6fa",
  lavenderblush: "fff0f5",
  lawngreen: "7cfc00",
  lemonchiffon: "fffacd",
  lightblue: "add8e6",
  lightcoral: "f08080",
  lightcyan: "e0ffff",
  lightgoldenrodyellow: "fafad2",
  lightgray: "d3d3d3",
  lightgrey: "d3d3d3",
  lightgreen: "90ee90",
  lightpink: "ffb6c1",
  lightsalmon: "ffa07a",
  lightseagreen: "20b2aa",
  lightskyblue: "87cefa",
  lightslategray: "789",
  lightslategrey: "789",
  lightsteelblue: "b0c4de",
  lightyellow: "ffffe0",
  lime: "0f0",
  limegreen: "32cd32",
  linen: "faf0e6",
  magenta: "f0f",
  maroon: "800000",
  mediumaquamarine: "66cdaa",
  mediumblue: "0000cd",
  mediumorchid: "ba55d3",
  mediumpurple: "9370d8",
  mediumseagreen: "3cb371",
  mediumslateblue: "7b68ee",
  mediumspringgreen: "00fa9a",
  mediumturquoise: "48d1cc",
  mediumvioletred: "c71585",
  midnightblue: "191970",
  mintcream: "f5fffa",
  mistyrose: "ffe4e1",
  moccasin: "ffe4b5",
  navajowhite: "ffdead",
  navy: "000080",
  oldlace: "fdf5e6",
  olive: "808000",
  olivedrab: "6b8e23",
  orange: "ffa500",
  orangered: "ff4500",
  orchid: "da70d6",
  palegoldenrod: "eee8aa",
  palegreen: "98fb98",
  paleturquoise: "afeeee",
  palevioletred: "d87093",
  papayawhip: "ffefd5",
  peachpuff: "ffdab9",
  peru: "cd853f",
  pink: "ffc0cb",
  plum: "dda0dd",
  powderblue: "b0e0e6",
  purple: "800080",
  rebeccapurple: "639",
  red: "f00",
  rosybrown: "bc8f8f",
  royalblue: "4169e1",
  saddlebrown: "8b4513",
  salmon: "fa8072",
  sandybrown: "f4a460",
  seagreen: "2e8b57",
  seashell: "fff5ee",
  sienna: "a0522d",
  silver: "c0c0c0",
  skyblue: "87ceeb",
  slateblue: "6a5acd",
  slategray: "708090",
  slategrey: "708090",
  snow: "fffafa",
  springgreen: "00ff7f",
  steelblue: "4682b4",
  tan: "d2b48c",
  teal: "008080",
  thistle: "d8bfd8",
  tomato: "ff6347",
  turquoise: "40e0d0",
  violet: "ee82ee",
  wheat: "f5deb3",
  white: "fff",
  whitesmoke: "f5f5f5",
  yellow: "ff0",
  yellowgreen: "9acd32",
};

export default function CreateMyColor() {
  // breadcrumb
  const breadcrumb = [
    {
      path: "#!",
      name: "Default Settings",
    },

    {
      path: "#",
      name: "Create My Color",
    },
  ];

  const [isInputVisible, setIsInputVisible] = useState(false);
  const inputRef = useRef(null);
  const [colorInp, setColorInp] = useState("#00004d, #96ffea,lightyellow");
  const [colorArr, setColorArr] = useState(["#00004d", "#96ffea", "#ffffe0"]);
  const [palette, setPalette] = useState([]);
  const [greenBlindPallete, setGreenBlindPallete] = useState([]);
  const [redBlindPallete, setRedBlindPallete] = useState([]);
  const [blueBlindPallete, setBlueBlindPallete] = useState([]);
  const [noOfPalleteColors] = useState(9);
  const { transformColors } = useColorBlindSimulation();
  const [divergingClrInpOne, setDivergingClrInpOne] = useState("red, blue");
  const [divergingClrInpTwo, setDivergingClrInpTwo] = useState(
    "lightyellow, #ff005e, #93003a"
  );

  const [diversionInpOneVisible, setDiversionInpOneVisible] = useState(false);
  const [diversionInpTwoVisible, setDiversionInpTwoVisible] = useState(false);

  const divergingClrInpRef = useRef(null);
  const divergingClrInpTwoRef = useRef(null);

  const [diversionClrArrOne, setDiversionClrArrOne] = useState([
    "#f00",
    "#00f",
  ]);
  const [diversionClrArrTwo, setDiversionClrArrTwo] = useState([
    "#ffffe0",
    "#ff005e",
    "#93003a",
  ]);

  const [diversionPalette, setDiversionPalette] = useState({
    one: [],
    two: [],
  });
  const [diversionRedBlindPallete, setDiversionRedBlindPallete] = useState({
    one: [],
    two: [],
  });
  const [diversionGreenBlindPallete, setDiversionGreenBlindPallete] = useState({
    one: [],
    two: [],
  });

  const [diversionBlueBlindPallete, setDiversionBlueBlindPallete] = useState({
    one: [],
    two: [],
  });

  const [sequentialInpErr, setSequentialInpErr] = useState("");
  const [divergingInpOneErr, setDivergingInpOneErr] = useState("");
  const [divergingInpTwoErr, setDivergingInpTwoErr] = useState("");

  const [customColorPallete, setCustomColorPallete] = useState(
    Array(noOfPalleteColors).fill("#0968AC")
  );

  const [isCustomColorLoading, setIsCustomColorLoading] = useState(false);

  const location = useLocation();
  const { companyId } = location.state;

  const handlePallateClick = () => {
    setIsInputVisible(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const pallentList = (color, noOfCol) => {
    if (color.length > 0) {
      const validColors = color.filter(Boolean).slice(0, 6);

      let scale;

      if (validColors.length === 1) {
        const base = chroma(validColors[0]);
        const light = base.brighten(2).hex();
        const dark = base.darken(2).hex();
        scale = chroma
          .scale([dark, base.hex(), light])
          .mode("lab")
          .colors(noOfCol);
      } else {
        scale = chroma.scale(validColors).mode("lab").colors(noOfCol);
      }

      return scale;
    } else {
      return [];
    }
  };

  const generatePallteForDiversion = (color, noOfCol) => {
    return pallentList(color, noOfCol);
  };
  const generatePalette = (color) => {
    return pallentList(color, noOfPalleteColors);
  };

  const addColorArr = (colorList) => {
    if (colorList) {
      const filterColorArr = colorList
        .trim()
        .split(",")
        .map((val) => val.trim().toLocaleLowerCase())
        .filter((val) => val) // removes empty strings
        .map((val) => {
          if (NAMED_COLORS[val]) return `#${NAMED_COLORS[val]}`;
          if (/^[0-9a-fA-F]{6}$/.test(val)) return `#${val}`;
          if (/^#[0-9a-fA-F]{6}$/.test(val)) return val;
          return val;
        });
      setColorArr(filterColorArr);
      const generated = generatePalette(filterColorArr, noOfPalleteColors);
      setPalette(generated);
      const red = transformColors(generated, "protanopia");
      const green = transformColors(generated, "deuteranopia");
      const blue = transformColors(generated, "tritanopia");
      setPalette(generated);
      setRedBlindPallete(red);
      setGreenBlindPallete(green);
      setBlueBlindPallete(blue);
      setIsInputVisible(false);
    }
  };

  function splitNumberInTwoParts(n) {
    const first = Math.ceil(n / 2);
    const second = n - first;
    return [first, second];
  }

  const addDiversionColorArr = (colorList, noOfCol, Inptype) => {
    const filterColorArr = (colorList || "")
      .trim()
      .split(",")
      .map((val) => val.trim().toLocaleLowerCase())
      .filter((val) => val) // removes empty strings
      .map((val) => {
        if (NAMED_COLORS[val]) return `#${NAMED_COLORS[val]}`;
        if (/^[0-9a-fA-F]{6}$/.test(val)) return `#${val}`;
        if (/^#[0-9a-fA-F]{6}$/.test(val)) return val;
        return val;
      });

    const generated = generatePallteForDiversion(filterColorArr, noOfCol);
    const red = transformColors(generated, "protanopia");
    const green = transformColors(generated, "deuteranopia");
    const blue = transformColors(generated, "tritanopia");

    if (Inptype === "two") {
      setDiversionClrArrTwo(filterColorArr);
      setDiversionInpTwoVisible(false);
      setDiversionPalette((prev) => ({ ...prev, two: generated }));
      setDiversionRedBlindPallete((prev) => ({ ...prev, two: red }));
      setDiversionGreenBlindPallete((prev) => ({ ...prev, two: green }));
      setDiversionBlueBlindPallete((prev) => ({ ...prev, two: blue }));
    }

    if (Inptype === "one") {
      setDiversionClrArrOne(filterColorArr);
      setDiversionInpOneVisible(false);
      setDiversionPalette((prev) => ({ ...prev, one: generated }));
      setDiversionRedBlindPallete((prev) => ({ ...prev, one: red }));
      setDiversionGreenBlindPallete((prev) => ({ ...prev, one: green }));
      setDiversionBlueBlindPallete((prev) => ({ ...prev, one: blue }));
    }
  };

  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      setIsInputVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInpChange = (e, setError, setInputValue) => {
    const { value } = e.target;
    const colorArray = value
      .split(",")
      .map((color) => color.trim())
      .filter((color) => color);

    if (colorArray.length > 6) {
      setError("You can only add up to six colors.");
    } else {
      setError("");
      setInputValue(value);
    }
  };

  function generateLSHVariants(baseHex) {
    const base = chroma(baseHex).hsl(); // [h, s, l]
    const [baseH, baseS, baseL] = base;

    const matrix = { L: [], S: [], H: [] };
    const steps = 11;

    const minL = 0.2,
      maxL = 0.9;
    const minS = 0.2,
      maxS = 1.0;
    const hueRange = 60; // +/- range around base hue

    // Lightness variations (clamped, H & S constant)
    for (let i = 0; i < steps; i++) {
      const l = minL + ((maxL - minL) * i) / (steps - 1);
      matrix.L.push(chroma.hsl(baseH, baseS, l).hex());
    }

    // Saturation variations (clamped, H & L constant)
    for (let i = 0; i < steps; i++) {
      const s = minS + ((maxS - minS) * i) / (steps - 1);
      matrix.S.push(chroma.hsl(baseH, s, baseL).hex());
    }

    // Hue variations (small hue shifts around base hue, S & L constant)
    for (let i = 0; i < steps; i++) {
      const h =
        (baseH - hueRange / 2 + (hueRange * i) / (steps - 1) + 360) % 360;
      matrix.H.push(chroma.hsl(h, baseS, baseL).hex());
    }

    return matrix;
  }

  const [activeColor, setActiveColor] = useState(null);
  const [divergingActiveColor, setDivergingActiveColor] = useState({
    one: null,
    two: null,
  });

  const targetRefs = useRef([]); // store refs for each color block
  let hideTimeout = useRef();

  const handleMouseEnter = (val, type) => {
    clearTimeout(hideTimeout.current);
    if (type === "one") {
      setDivergingActiveColor({ ...divergingActiveColor, one: val });
    } else if (type === "two") {
      setDivergingActiveColor({ ...divergingActiveColor, two: val });
    } else {
      setActiveColor(val);
    }
  };

  const handleMouseLeave = () => {
    hideTimeout.current = setTimeout(() => {
      setActiveColor(null);
      setDivergingActiveColor({
        one: null,
        two: null,
      });
    }, 150);
  };

  const handlePalletColorClick = (currentColor, newColor, type) => {
    let colorName =
      Object.keys(NAMED_COLORS).find(
        (key) => NAMED_COLORS[key] === currentColor.replace("#", "")
      ) || currentColor;

    if (type === "one") {
      const updatedColorInp = divergingClrInpOne.replace(colorName, newColor);
      setDivergingClrInpOne(updatedColorInp);
      addDiversionColorArr(
        updatedColorInp,
        splitNumberInTwoParts(noOfPalleteColors)[0],
        type
      );
      setDivergingActiveColor({ ...divergingActiveColor, one: newColor });
    } else if (type === "two") {
      const updatedColorInp = divergingClrInpTwo.replace(colorName, newColor);
      setDivergingClrInpTwo(updatedColorInp);
      addDiversionColorArr(
        updatedColorInp,
        splitNumberInTwoParts(noOfPalleteColors)[1],
        type
      );
      setDivergingActiveColor({ ...divergingActiveColor, two: newColor });
    } else {
      const updatedColorInp = colorInp.replace(colorName, newColor);

      setColorInp(updatedColorInp);
      addColorArr(updatedColorInp);
      setActiveColor(newColor);
    }
  };

  function isColorDark(hex) {
    // Remove "#" if present
    hex = hex.replace("#", "");

    // If shorthand (#fff), convert to full form (#ffffff)
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Calculate luminance
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

    return luminance < 128;
  }
  const handleCustomClrChangeOnBlur = (e, index) => {
    customColorPallete[index] = e.target.value;
    setCustomColorPallete(customColorPallete);
  };

  const { getloginUserData } = useAuth();
  const userData = getloginUserData();

  const handleCreateCustomColor = async () => {
    setIsCustomColorLoading(true);
    try {
      const bodyData = {
        company_master_id: userData?.companyMasterID,
        company_id: companyId,
        colorcode: customColorPallete,
      };
      const response = await commonService({
        apiEndPoint: DEFAULT_SETTINGS.createCustomColor,
        bodyData,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.data) toast.success("custom color created!");
    } catch (error) {
      console.error(error);
    } finally {
      setIsCustomColorLoading(false);
    }
  };

  useEffect(() => {
    addColorArr(colorInp);
    if (divergingClrInpOne)
      addDiversionColorArr(
        divergingClrInpOne,
        splitNumberInTwoParts(noOfPalleteColors)[0],
        "one"
      );
    if (divergingClrInpTwo)
      addDiversionColorArr(
        divergingClrInpTwo,
        splitNumberInTwoParts(noOfPalleteColors)[1],
        "two"
      );
  }, []);

  return (
    <>
      {/* head title start */}
      <section className="commonHead">
        <h1 className="commonHead_title">Welcome Back!</h1>
        <Breadcrumb breadcrumb={breadcrumb} />
      </section>
      {/* head title end */}
      <div className="pageContent createColorPage">
        <div className="pageTitle d-flex align-items-center">
          <Link to={adminRouteMap.DEFAULTSETTINGS.path} className="backLink">
            <em className="icon-back" />
          </Link>
          <h2 className="mb-0">Create My Color</h2>
        </div>
        <div className="subHeading">
          <span>1</span> What kind of palette do you want to create?
        </div>
        <Tab.Container defaultActiveKey="sequential">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div className="d-flex flex-column align-items-center">
              <span className="label">Palette type: </span>
              <Nav variant="pills" className="commonTab me-2">
                <Nav.Item>
                  <Nav.Link eventKey="sequential">Sequential</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="diverging">Diverging</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="custom">Custom</Nav.Link>
                </Nav.Item>
              </Nav>
            </div>
            <Form.Group className="form-group mb-0">
              <Form.Label>Number of colors:</Form.Label>
              <InputField
                type="text"
                placeholder="Enter No. Color"
                value={noOfPalleteColors}
              />
            </Form.Group>
          </div>
          <Tab.Content className="mt-3">
            <Tab.Pane eventKey="sequential">
              <div className="repeatBox">
                <div className="subHeading">
                  <span>2</span> Select and arrange input colors
                </div>

                <FormGroup className="form-group mb-0  repeatBox_Input">
                  <InputField
                    type="text"
                    innerRef={inputRef}
                    placeholder="Enter No. Color"
                    value={colorInp}
                    className={isInputVisible ? "d-block" : "d-none"}
                    onChange={(e) =>
                      handleInpChange(e, setSequentialInpErr, setColorInp)
                    }
                    onBlur={(e) => {
                      addColorArr(e.target.value);
                    }}
                  />
                </FormGroup>
                {sequentialInpErr && (
                  <div className="invalid-feedback d-block">
                    {sequentialInpErr}
                  </div>
                )}

                <div
                  className={
                    isInputVisible
                      ? "repeatBox_pallate d-none"
                      : "d-block repeatBox_pallate"
                  }
                  onClick={handlePallateClick}
                >
                  {colorArr.length > 0 &&
                    colorArr.map((val, index) => {
                      if (!targetRefs.current[index]) {
                        targetRefs.current[index] = React.createRef();
                      }

                      return (
                        <OverlayTrigger
                          key={index}
                          target={targetRefs.current[index].current}
                          show={activeColor === val}
                          placement="bottom"
                          onHide={() => setActiveColor(null)}
                          rootClose
                          overlay={
                            <Popover
                              id="popover-basic"
                              onClick={(e) => e.stopPropagation()}
                              onMouseEnter={() =>
                                clearTimeout(hideTimeout.current)
                              }
                              onMouseLeave={handleMouseLeave}
                            >
                              <Popover.Body>
                                <LSHToolTip
                                  generateLSHVariants={generateLSHVariants}
                                  handlePalletColorClick={
                                    handlePalletColorClick
                                  }
                                  colorCode={val}
                                  index={index}
                                />
                              </Popover.Body>
                            </Popover>
                          }
                        >
                          <span
                            ref={targetRefs.current[index]}
                            onMouseEnter={() => handleMouseEnter(val)}
                            onMouseLeave={handleMouseLeave}
                            style={{
                              background: val,
                              color: isColorDark(val) ? "#fff" : "#000",
                            }}
                          >
                            {val}
                          </span>
                        </OverlayTrigger>
                      );
                    })}
                </div>
              </div>
              <SequentialTab
                palette={palette}
                redBlindPallete={redBlindPallete}
                greenBlindPallete={greenBlindPallete}
                blueBlindPallete={blueBlindPallete}
              />
              <div className="d-flex justify-content-end mt-xl-4 mt-3">
                <Button variant="primary" className="ripple-effect">
                  {" "}
                  Save{" "}
                </Button>
              </div>
            </Tab.Pane>
            <Tab.Pane eventKey="diverging">
              <div className="repeatBox">
                <div className="subHeading">
                  <span>2</span> Select and arrange input colors
                </div>
                <Row className="g-2">
                  <Col md={6}>
                    <FormGroup className="form-group mb-0  repeatBox_Input">
                      <InputField
                        type="text"
                        innerRef={divergingClrInpRef}
                        placeholder="Enter No. Color"
                        value={divergingClrInpOne}
                        className={
                          diversionInpOneVisible ? "d-block" : "d-none"
                        }
                        onChange={(e) =>
                          handleInpChange(
                            e,
                            setDivergingInpOneErr,
                            setDivergingClrInpOne
                          )
                        }
                        onBlur={(e) => {
                          addDiversionColorArr(
                            e.target.value,
                            splitNumberInTwoParts(noOfPalleteColors)[0],
                            "one"
                          );
                        }}
                      />
                    </FormGroup>

                    {divergingInpOneErr && (
                      <div className="invalid-feedback d-block">
                        {divergingInpOneErr}
                      </div>
                    )}

                    <div
                      className={
                        diversionInpOneVisible
                          ? "repeatBox_pallate d-none"
                          : "d-block repeatBox_pallate"
                      }
                      onClick={() => setDiversionInpOneVisible(true)}
                    >
                      {diversionClrArrOne.length > 0 &&
                        diversionClrArrOne.map((val, index) => {
                          if (!targetRefs.current[index]) {
                            targetRefs.current[index] = React.createRef();
                          }

                          return (
                            <OverlayTrigger
                              key={index}
                              target={targetRefs.current[index].current}
                              show={divergingActiveColor.one === val}
                              placement="bottom"
                              onHide={() =>
                                setDivergingActiveColor({
                                  ...divergingActiveColor,
                                  one: null,
                                })
                              }
                              rootClose
                              overlay={
                                <Popover
                                  id="popover-basic"
                                  onClick={(e) => e.stopPropagation()}
                                  onMouseEnter={() =>
                                    clearTimeout(hideTimeout.current)
                                  }
                                  onMouseLeave={handleMouseLeave}
                                >
                                  <Popover.Body>
                                    <LSHToolTip
                                      generateLSHVariants={generateLSHVariants}
                                      handlePalletColorClick={
                                        handlePalletColorClick
                                      }
                                      colorCode={val}
                                      index={index}
                                      type="one"
                                    />
                                  </Popover.Body>
                                </Popover>
                              }
                            >
                              <span
                                ref={targetRefs.current[index]}
                                onMouseEnter={() =>
                                  handleMouseEnter(val, "one")
                                }
                                onMouseLeave={handleMouseLeave}
                                style={{
                                  background: val,
                                  color: isColorDark(val) ? "#fff" : "#000",
                                }}
                              >
                                {val}
                              </span>
                            </OverlayTrigger>
                          );
                        })}
                    </div>
                  </Col>
                  <Col md={6}>
                    <FormGroup className="form-group mb-0  repeatBox_Input">
                      <InputField
                        type="text"
                        placeholder="Enter No. Color"
                        innerRef={divergingClrInpTwoRef}
                        value={divergingClrInpTwo}
                        className={
                          diversionInpTwoVisible ? "d-block" : "d-none"
                        }
                        onChange={(e) =>
                          handleInpChange(
                            e,
                            setDivergingInpTwoErr,
                            setDivergingClrInpTwo
                          )
                        }
                        onBlur={(e) => {
                          addDiversionColorArr(
                            e.target.value,
                            splitNumberInTwoParts(noOfPalleteColors)[1],
                            "two"
                          );
                        }}
                      />
                    </FormGroup>
                    {divergingInpTwoErr && (
                      <div className="invalid-feedback d-block">
                        {divergingInpTwoErr}
                      </div>
                    )}

                    <div
                      className={
                        diversionInpTwoVisible
                          ? "repeatBox_pallate d-none"
                          : "d-block repeatBox_pallate"
                      }
                      onClick={() => setDiversionInpTwoVisible(true)}
                    >
                      {diversionClrArrTwo.length > 0 &&
                        diversionClrArrTwo.map((val, index) => {
                          if (!targetRefs.current[index]) {
                            targetRefs.current[index] = React.createRef();
                          }

                          return (
                            <OverlayTrigger
                              key={index}
                              target={targetRefs.current[index].current}
                              show={divergingActiveColor.two === val}
                              placement="bottom"
                              onHide={() =>
                                setDivergingActiveColor({
                                  ...divergingActiveColor,
                                  one: null,
                                })
                              }
                              rootClose
                              overlay={
                                <Popover
                                  id="popover-basic"
                                  onClick={(e) => e.stopPropagation()}
                                  onMouseEnter={() =>
                                    clearTimeout(hideTimeout.current)
                                  }
                                  onMouseLeave={handleMouseLeave}
                                >
                                  <Popover.Body>
                                    <LSHToolTip
                                      generateLSHVariants={generateLSHVariants}
                                      handlePalletColorClick={
                                        handlePalletColorClick
                                      }
                                      colorCode={val}
                                      index={index}
                                      type="two"
                                    />
                                  </Popover.Body>
                                </Popover>
                              }
                            >
                              <span
                                ref={targetRefs.current[index]}
                                onMouseEnter={() =>
                                  handleMouseEnter(val, "two")
                                }
                                onMouseLeave={handleMouseLeave}
                                style={{
                                  background: val,
                                  color: isColorDark(val) ? "#fff" : "#000",
                                }}
                              >
                                {val}
                              </span>
                            </OverlayTrigger>
                          );
                        })}
                    </div>
                  </Col>
                </Row>
              </div>
              <DivergingTab
                diversionPalette={diversionPalette}
                diversionRedBlindPallete={diversionRedBlindPallete}
                diversionGreenBlindPallete={diversionGreenBlindPallete}
                diversionBlueBlindPallete={diversionBlueBlindPallete}
              />
              <div className="d-flex justify-content-end mt-xl-4 mt-3">
                <Button variant="primary" className="ripple-effect">
                  {" "}
                  Save{" "}
                </Button>
              </div>
            </Tab.Pane>
            <Tab.Pane eventKey="custom">
              <CustomTab
                handleCustomClrChangeOnBlur={handleCustomClrChangeOnBlur}
                noOfPalleteColors={noOfPalleteColors}
              />
              <div className="d-flex justify-content-end mt-xl-4 mt-3">
                <Button
                  variant="primary"
                  disabled={isCustomColorLoading}
                  className="ripple-effect"
                  onClick={handleCreateCustomColor}
                >
                  {" "}
                  Save{" "}
                </Button>
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
    </>
  );
}

const LSHToolTip = ({
  generateLSHVariants,
  colorCode,
  handlePalletColorClick,
  type,
}) => {
  const [variants, setVariants] = useState({});
  useEffect(() => {
    if (colorCode) setVariants(generateLSHVariants(colorCode));
  }, [colorCode]);
  return (
    <div style={{ background: "#fff", color: "#000" }}>
      {["L", "S", "H"].map((key) => (
        <div key={key} style={{ display: "flex", gap: "2px" }}>
          <p className="text-black mb-0 mx-1">{key}</p>
          {variants[key]?.map((col, i) => (
            <div
              key={i}
              style={{
                width: 20,
                height: 20,
                margin: "2px 1px",
                backgroundColor: col,
                // border: colorCode === col ? "2px solid #000" : "none",
              }}
              title={`${key}[${i}]: ${col}`}
              onClick={() => handlePalletColorClick(colorCode, col, type)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

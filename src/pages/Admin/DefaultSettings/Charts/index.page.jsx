import { Button, InputField, RangeSlider, SelectField } from "components";
import { Accordion, Form, Spinner } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import { commonService } from "services/common.service";
import { DEFAULT_SETTINGS } from "apiEndpoints/DefaultSettings";
import toast from "react-hot-toast";
import CommonBarChartAnnotation from "pages/Admin/Analytics/CommonBarChartAnnotation";
import {
  getChartTypeByID,
  getDataLabelsByID,
  getFontOptionsByID,
  getLgendsByID,
} from "utils/common.util";
import PaletteSection from "../ColorPalette/PaletteSection";

export default function Charts({
  activeTab,
  setActiveTab,
  chartTypeOptions,
  labelColor,
  legendOptions,
  fontSizeOptions,
  dataLabelOptions,
  switchAccess,
  scalarOpacity,
  setSwitchAccess,
  setScalerOpacity,
  setLabelColor,
  defaultPalletId,
  updateDefaultChartOptions,
  isDefaultChartOptions,
  defaultChartOptions,
  initialData,
  selectedCompany,
  userData,
  defaultScalarPaletteId,
}) {
  const [selectedPalette, setSelectedPalette] = useState(null);
  const [selectedChartType, setSelectedChartType] = useState("");
  const [selectedLegend, setSelectedLegend] = useState("");
  const [selectedFontSize, setSelectedFontSize] = useState("");
  const [selectedDataLabel, setSelectedDataLabel] = useState("");
  const [defaultPalette, setDefaultPalette] = useState([]);
  const [scalar, setScalar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(defaultPalletId);

  const handlePaletteSelect = (palette) => {
    if (selectedId === palette[0]?.color_palette_id) {
      setSelectedId(null);
      setSelectedPalette(null);
    } else {
      setSelectedId(palette[0]?.color_palette_id);
      setSelectedPalette(palette);
    }
  };

  const updateSliderBackground = (sliderElement, value) => {
    const color = `linear-gradient(to right, #0968AC ${value}%, #CDCED0 ${value}%)`;
    if (sliderElement) {
      sliderElement.style.background = color;
    }
  };
  const sliderRef = useRef(null);

  const [currentColorPallet, setCurrentColorPallet] = useState({
    colorPaletteID: defaultPalletId,
    colors: [],
  });

  useEffect(() => {
    updateSliderBackground(sliderRef.current, scalarOpacity);
  }, [scalarOpacity]);

  const handleSliderChange = (event) => {
    const { value } = event.target;
    setScalerOpacity(value);
    updateSliderBackground(event.target, value);
  };

  const setDefaultColor = async () => {
    const { companyMasterID, apiToken } = userData || {};
    const companyId = selectedCompany?.value;
    setLoading(true);
    if (!companyId) {
      toast.error("Please select a company first");
      return;
    }

    if (!selectedPalette) {
      toast.error("Please select a color palette first");
      return;
    }

    try {
      const bodyData = {
        company_master_id: companyMasterID,
        company_id: companyId,
        standard_chart_option: "C",
        color_palette_id: selectedPalette[0].color_palette_id,
      };
      await commonService({
        apiEndPoint: DEFAULT_SETTINGS.setDefaultColor,
        bodyData,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
      });
      toast.success("Color palette set successfully");
      setDefaultPalette(selectedPalette);
    } catch (error) {
      console.error("Failed to save email content:", error);
      toast.error("Something went wrong while saving email content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (defaultChartOptions) {
      setSelectedChartType(
        chartTypeOptions.find(
          (val) => val.value === defaultChartOptions.chartType
        )
      );
      setSelectedLegend(
        legendOptions.find((val) => val.value === defaultChartOptions.legend)
      );
      setSelectedFontSize(
        fontSizeOptions.find(
          (val) => val.value === defaultChartOptions.fontSize
        )
      );
      setSelectedDataLabel(
        dataLabelOptions.find(
          (val) => val.value === defaultChartOptions.dataLabel
        )
      );
      setSwitchAccess(defaultChartOptions.switchAxis);
      setScalerOpacity(defaultChartOptions.scalarOpacity);
      setLabelColor(defaultChartOptions.lableColor);
      setCurrentColorPallet({
        colorPaletteID: defaultPalletId?.toString(),
        colors: [],
      });
      setSelectedId(defaultPalletId);
    }
  }, [defaultChartOptions, defaultPalletId]);

  useEffect(() => {
    if (initialData) {
      const matchingColors = [];
      Object.keys(initialData).forEach((categoryKey) => {
        if (matchingColors.length) return;
        const category = initialData[categoryKey];
        if (Array.isArray(category)) {
          category.forEach((palette) => {
            if (Array.isArray(palette)) {
              const matches = palette.filter(
                (color) => color.color_palette_id === defaultPalletId
              );
              matchingColors.push(...matches);
            }
          });
        }
      });
      const scalrColors = [];

      Object.keys(initialData).forEach((categoryKey) => {
        if (scalrColors.length) return;
        const category = initialData[categoryKey];
        if (Array.isArray(category)) {
          category.forEach((palette) => {
            if (Array.isArray(palette)) {
              const matches = palette.filter(
                (color) => color.color_palette_id === defaultScalarPaletteId
              );
              scalrColors.push(...matches);
            }
          });
        }
      });

      setScalar(scalrColors);
      setDefaultPalette(matchingColors);
    }
  }, [initialData]);

  return (
    <>
      <div
        id="chartOptionsTab"
        onClick={()=> {
          setActiveTab("chartOptionsTab");
      }}
      >
        <div className="pageTitle">
          <h2>Default Chart Options </h2>
        </div>
        <div className="generalsetting_inner d-block">
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Default Chart Options</Accordion.Header>
              <Accordion.Body>
                <div className="d-sm-flex summarychart flex-wrap gap-2 mb-xl-4 mb-3 pb-xl-2 pb-0">
                  <Form.Group className="form-group">
                    <Form.Label>Chart Type:</Form.Label>
                    <SelectField
                      placeholder="Chart Type"
                      options={chartTypeOptions}
                      value={selectedChartType}
                      onChange={(e) => setSelectedChartType(e)}
                    />
                  </Form.Group>
                  <Form.Group className="form-group">
                    <Form.Label>Legend:</Form.Label>
                    <SelectField
                      placeholder="Legend"
                      options={legendOptions}
                      value={selectedLegend}
                      onChange={(e) => setSelectedLegend(e)}
                    />
                  </Form.Group>
                  <Form.Group className="form-group">
                    <Form.Label>Font Size:</Form.Label>
                    <SelectField
                      placeholder="Font Size"
                      options={fontSizeOptions}
                      value={selectedFontSize}
                      onChange={(e) => setSelectedFontSize(e)}
                    />
                  </Form.Group>
                  <Form.Group className="form-group">
                    <Form.Label>Data Label:</Form.Label>
                    <SelectField
                      placeholder="Data Label"
                      options={dataLabelOptions}
                      value={selectedDataLabel}
                      onChange={(e) => setSelectedDataLabel(e)}
                    />
                  </Form.Group>
                  <Form.Group className="form-group">
                    <Form.Label>Scalar Color Opacity:</Form.Label>
                    <div className="colorOpacity">
                      <RangeSlider
                        value={scalarOpacity}
                        onChange={handleSliderChange}
                        min={0}
                        max={100}
                        name="summary_scalar_opacity"
                        placeholder="Adjust Opacity"
                        className="form-range w-100"
                        disabled={selectedChartType === "pie"}
                      />
                      <span id="percentage">{scalarOpacity}%</span>
                    </div>
                  </Form.Group>
                  <Form.Group className="form-group switchaxis d-flex align-items-center">
                    <Form.Label className="mb-0 me-2">Switch Axis:</Form.Label>
                    <div className="switchBtn">
                      <InputField
                        type="checkbox"
                        checked={switchAccess}
                        id="switchaxis2"
                        onChange={() => {
                          setSwitchAccess((p) => !p);
                        }}
                      />
                      <Form.Label htmlFor="switchaxis2" />
                    </div>
                  </Form.Group>
                  <Form.Group className="form-group">
                    <div className="color w-100 d-flex align-items-center">
                      <Form.Label className="w-auto me-2 mb-0">
                        Data Label Color:
                      </Form.Label>
                      <InputField
                        className="form-control-color p-1"
                        type="color"
                        id="myColor7"
                        value={labelColor}
                        title="Choose a color"
                        onChange={(e) => setLabelColor(e.target.value)}
                      />
                    </div>
                  </Form.Group>
                </div>

                <div
                  className="d-flex justify-content-end mt-xl-4 mt-3"
                  onClick={() => {
                    const data = {
                      chartType: selectedChartType?.value,
                      legend: selectedLegend?.value,
                      switchAxis: switchAccess,
                      scalarOpacity: Number(scalarOpacity),
                      fontSize: selectedFontSize?.value,
                      lableColor: labelColor,
                      paletteColorID:
                        Number(currentColorPallet?.colorPaletteID) || 0,
                      dataLabel: selectedDataLabel?.value,
                    };
                    updateDefaultChartOptions(data);
                  }}
                >
                  <Button
                    type="submit"
                    varian="primary"
                    className="ripple-effect"
                    disabled={isDefaultChartOptions}
                  >
                    {isDefaultChartOptions ? "Saving...." : "Save"}
                  </Button>
                </div>
                <div>
                  <>
                    <div className="generalsetting_inner d-block">
                      <div className="colorPalettes">
                        <PaletteSection
                          title="Sequential"
                          palettes={initialData?.sequential}
                          selectedId={selectedId}
                          setSelectedId={setSelectedId}
                          setSelectedPalette={handlePaletteSelect}
                        />
                        <PaletteSection
                          title="Diverging"
                          palettes={initialData?.divergent}
                          selectedId={selectedId}
                          setSelectedId={setSelectedId}
                          setSelectedPalette={handlePaletteSelect}
                        />
                        <PaletteSection
                          title="Data Visualization"
                          palettes={initialData?.data_visualization}
                          selectedId={selectedId}
                          setSelectedId={setSelectedId}
                          setSelectedPalette={handlePaletteSelect}
                        />
                        <PaletteSection
                          title="My Colors"
                          palettes={initialData?.my_color}
                          selectedId={selectedId}
                          setSelectedId={setSelectedId}
                          setSelectedPalette={handlePaletteSelect}
                        />
                        <div>
                          <h3 className="colorPalettes_title">
                            Current Default
                          </h3>
                          <div>
                            <table>
                              <tbody>
                                <tr>
                                  {defaultPalette.length > 0 &&
                                    defaultPalette.map((color, index) => (
                                      <>
                                        {color?.color_code.startsWith("#") && (
                                          <td
                                            key={index}
                                            style={{
                                              backgroundColor:
                                                color?.color_code,
                                            }}
                                          />
                                        )}
                                      </>
                                    ))}
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      <div className="d-flex justify-content-end mt-3">
                        <Button
                          disabled={loading}
                          onClick={setDefaultColor}
                          variant="primary"
                          className="ripple-effect"
                        >
                          {" "}
                          Set Default{" "}
                          {loading && (
                            <Spinner
                              className="ms-2"
                              animation="border"
                              size="sm"
                            />
                          )}
                        </Button>
                      </div>
                    </div>
                  </>
                </div>

                {scalar?.length > 0 &&
                  defaultPalette?.length > 0 &&
                  selectedChartType && (
                    <CommonBarChartAnnotation
                      scalarConfigurationPropData={[
                        {
                          scalar_id: "1",
                          scalar_name: "Very Low",
                          scalar_sequence: 1,
                          range_start: "1.0000",
                          range_end: "20.0000",
                          color_code: "#ef3d31",
                        },
                        {
                          scalar_id: "2",
                          scalar_name: "Low",
                          scalar_sequence: 2,
                          range_start: "21.0000",
                          range_end: "40.0000",
                          color_code: "#f88d23",
                        },
                        {
                          scalar_id: "3",
                          scalar_name: "Average",
                          scalar_sequence: 3,
                          range_start: "41.0000",
                          range_end: "60.0000",
                          color_code: "#ffcb05",
                        },
                        {
                          scalar_id: "4",
                          scalar_name: "High",
                          scalar_sequence: 4,
                          range_start: "61.0000",
                          range_end: "80.0000",
                          color_code: "#6aa93a",
                        },
                        {
                          scalar_id: "5",
                          scalar_name: "Very High",
                          scalar_sequence: 5,
                          range_start: "81.0000",
                          range_end: "100.0000",
                          color_code: "#368c36",
                        },
                      ]}
                      categories={["overall", "user1", "user2"]}
                      values={[
                        { Outcome1: 40, Outcome2: 30, Outcome3: 30 },
                        { Outcome1: 40, Outcome2: 30, Outcome3: 30 },
                        { Outcome1: 40, Outcome2: 30, Outcome3: 30 },
                      ]}
                      colorsChart={defaultPalette.map(
                        (item) => item.color_code
                      )}
                      renderChart
                      switchAxis={switchAccess}
                      labelColorState={labelColor}
                      annotationOpacity={Number(
                        (scalarOpacity / 100).toFixed(2)
                      )}
                      showNegative={false}
                      chartType={getChartTypeByID(
                        selectedChartType?.value,
                        chartTypeOptions,
                        true
                      )}
                      legendPosition={
                        getLgendsByID(selectedLegend?.value, legendOptions) ||
                        "bottom"
                      }
                      labelPosition={
                        getDataLabelsByID(
                          selectedDataLabel?.value,
                          dataLabelOptions
                        ) || "top"
                      }
                      fontSize={
                        getFontOptionsByID(
                          selectedFontSize?.value,
                          fontSizeOptions
                        ) || "12"
                      }
                      sortOrder="random"
                    />
                  )}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </div>
    </>
  );
}

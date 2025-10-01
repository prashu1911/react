import { useEffect, useState } from "react";
import { Button } from "components";
import { Accordion, Spinner } from "react-bootstrap";
import { commonService } from "services/common.service";
import { DEFAULT_SETTINGS } from "apiEndpoints/DefaultSettings";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import adminRouteMap from "routes/Admin/adminRouteMap";
import PaletteSection from "./PaletteSection";

export default function ColorPalette({
  setActiveTab,
  activeTab,
  initialData,
  defaultPaletteId,
  userData,
  selectedCompany,
}) {
  const [selectedPalette, setSelectedPalette] = useState(null);
  const [defaultPalette, setDefaultPalette] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [selectedId, setSelectedId] = useState(defaultPaletteId);

  const handlePaletteSelect = (palette) => {
    if (selectedId === palette[0]?.color_palette_id) {
      setSelectedId(null);
      setSelectedPalette(null);
    } else {
      setSelectedId(palette[0]?.color_palette_id);
      setSelectedPalette(palette);
    }
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
        standard_chart_option: "S",
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
    if (initialData) {
      const matchingColors = [];
      Object.keys(initialData).forEach((categoryKey) => {
        if (matchingColors.length) return;
        const category = initialData[categoryKey];
        if (Array.isArray(category)) {
          category.forEach((palette) => {
            if (Array.isArray(palette)) {
              const matches = palette.filter(
                (color) => color.color_palette_id === defaultPaletteId
              );
              matchingColors.push(...matches);
            }
          });
        }
      });
      console.log("initialData",initialData, defaultPaletteId, matchingColors);
      setDefaultPalette(matchingColors);
    }
  }, [initialData]);

  useEffect(() => {
    setSelectedId(defaultPaletteId);
  }, [defaultPaletteId]);

  return (
    <>
      <div
        id="colorPaletteTab"
        onClick={()=> {
          setActiveTab("colorPaletteTab");
      }}
      >
        <div className="pageTitle">
          <h2>Scalar Color Palette Default </h2>
        </div>
        <div className="generalsetting_inner d-block">
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Scalar Color Palette Default</Accordion.Header>
              <Accordion.Body>
                <div className="colorPalettes">
                  <div className="d-flex justify-content-end">
                    {/* adminRouteMap.CREATEMYCOLOR.path */}
                    <Link
                      to="#!"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(adminRouteMap.CREATEMYCOLOR.path, {
                          state: { companyId: selectedCompany?.value },
                        });
                      }}
                      className="btn btn-primary ripple-effect"
                    >
                      Create New
                    </Link>
                  </div>
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
                    <h3 className="colorPalettes_title">Current Default {defaultPalette.length}</h3>
                    <div>
                      <table>
                        <tbody>
                          <tr style={{padding:0,  borderRadius:'5px'}}>
                            {defaultPalette.length > 0 &&
                              defaultPalette.map((color, index) => {
                                console.log("color",color);
                                
                                return(
                                <>
                                  {color?.color_code && (
                                    <td
                                      key={index+1}
                                      style={{
                                        backgroundColor: color?.color_code,
                                        width:'1.5rem',
                                        height:'1.5rem',
                                        borderRadius:0
                                      }}
                                    >
                                      {/* {color?.color_id} */}
                                    </td>
                                  )}
                                </>
                              )})}
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
                      <Spinner className="ms-2" animation="border" size="sm" />
                    )}
                  </Button>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </div>
    </>
  );
}

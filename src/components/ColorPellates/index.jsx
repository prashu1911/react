import { useEffect } from "react";
import { Form } from "react-bootstrap";

export default function ColorPellates({
  keyValue,
  data,
  value,
  handleColorPicker,
  ignoreCurrentDefaultFlag,
}) {
  
  const getSafeColor = (code) => {
    const hex = code?.startsWith("#") ? code : `#${code}`;
    const isValidHex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex);
    return isValidHex ? hex : "#CCCCCC"; // fallback to light grey
  };
  return (
    <div className="mt-4">
      {Object.keys(data)?.length > 0 && (
        <div className="colorPalettes">
        <div>
        <h3 className="colorPalettes_title">Current Default</h3>
        {["radio"].map((type) => (
          <div key={`inline-${type}`}>
            <table>
              <tbody>
                <tr>
                  <td>
                    {!ignoreCurrentDefaultFlag && (
                      <Form.Check
                        key={`sequential-${keyValue}-default`}
                        className="m-0"
                        inline
                        label=""
                        name="colorPaletteID"
                        type={type}
                        checked={
                          data?.defaultColor[1]?.colorPaletteID === value
                        }
                        id={`sequential-${type}`}
                        onChange={() =>
                          handleColorPicker({
                            colorPaletteID:
                              data?.defaultColor[1]?.colorPaletteID,
                            colors: data?.defaultColor[1]?.colors,
                            keyValue,
                          })
                        }
                      />
                    )}
                  </td>

                      {data?.defaultColor &&
                        data?.defaultColor[1]?.colors?.map(
                          (color, colorIndex) => (
                            <td key={`palette-color-${colorIndex}`}>
                              <div
                                style={{
                                  backgroundColor: color.colorCode?.includes(
                                    "#"
                                  )
                                    ? color.colorCode
                                    : `#${color.colorCode}`,
                                  cursor: "default",
                                  width: "100%",
                                  color: color.colorCode?.includes("#")
                                    ? color.colorCode
                                    : `#${color.colorCode}`,
                                }}
                              >
                                .
                              </div>
                            </td>
                          )
                        )}
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
          </div>

          <div className="d-flex w-100 gap-4">
            <div>
              <h3 className="colorPalettes_title">Sequential</h3>
              {["radio"].map((type) => (
                <div key={`inline-${type}`}>
                  <table>
                    <tbody className="d-flex flex-column">
                      {data?.sequential?.map((palette, paletteIndex) => (
                        <tr key={`palette-row-${paletteIndex}`}>
                          <td>
                            <Form.Check
                              key={`sequential-${paletteIndex}-${keyValue}- ${paletteIndex}`}
                              className="m-0"
                              inline
                              label=""
                              name="colorPaletteID"
                              type={type}
                              checked={palette?.paletteID === value}
                              id={`sequential-${type}-${paletteIndex + 1}`}
                              onChange={() =>
                                handleColorPicker({
                                  colorPaletteID: palette?.paletteID,
                                  colors: palette?.colors,
                                  keyValue,
                                })
                              }
                            />
                          </td>
                          {palette?.colors?.map((color, colorIndex) => (
                            <td
                              key={`palette-color-${paletteIndex}-${colorIndex}`}
                            >
                              <div
                                style={{
                                  backgroundColor: color.colorCode?.includes(
                                    "#"
                                  )
                                    ? color.colorCode
                                    : `#${color.colorCode}`,
                                  cursor: "default",
                                  width: "100%",
                                  color: color.colorCode?.includes("#")
                                    ? color.colorCode
                                    : `#${color.colorCode}`,
                                }}
                              >
                                .
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
            <div>
              <h3 className="colorPalettes_title">Diverging</h3>
              {["radio"].map((type) => (
                <div key={`inline-${type}`}>
                  <table>
                    <tbody className="d-flex flex-column">
                      {data?.divergent?.map((palette, paletteIndex) => (
                        <tr key={`palette-row-${paletteIndex}`}>
                          <td>
                            <Form.Check
                              key={`sequential-${paletteIndex}-${keyValue}- ${paletteIndex}`}
                              className="m-0"
                              inline
                              label=""
                              name="colorPaletteID"
                              type={type}
                              checked={palette?.paletteID === value}
                              id={`diverging-${type}-${paletteIndex + 1}`}
                              onChange={() =>
                                handleColorPicker({
                                  colorPaletteID: palette?.paletteID,
                                  colors: palette?.colors,
                                  keyValue,
                                })
                              }
                            />
                          </td>
                          {palette?.colors?.map((color, colorIndex) => (
                            <td
                              key={`palette-color-${paletteIndex}-${colorIndex}`}
                            >
                              <div
                                style={{
                                  backgroundColor: color.colorCode?.includes(
                                    "#"
                                  )
                                    ? color.colorCode
                                    : `#${color.colorCode}`,
                                  cursor: "default",
                                  width: "100%",
                                  color: color.colorCode?.includes("#")
                                    ? color.colorCode
                                    : `#${color.colorCode}`,
                                }}
                              >
                                .
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
            <div>
              <h3 className="colorPalettes_title">Data Visualization</h3>
              {["radio"].map((type) => (
                <div key={`inline-${type}`}>
                  <table>
                    <tbody className="d-flex flex-column">
                      {data?.dataVisualization?.map((palette, paletteIndex) => (
                        <tr key={`palette-row-${paletteIndex}`}>
                          <td>
                            <Form.Check
                              key={`sequential-${paletteIndex}-${keyValue}- ${paletteIndex}`}
                              className="m-0"
                              inline
                              label=""
                              name="colorPaletteID"
                              type={type}
                              checked={palette?.paletteID === value}
                              id={`visualization-${type}-${paletteIndex + 1}`}
                              onChange={() =>
                                handleColorPicker({
                                  colorPaletteID: palette?.paletteID,
                                  colors: palette?.colors,
                                  keyValue,
                                })
                              }
                            />
                          </td>
                          {palette?.colors?.map((color, colorIndex) => (
                            <>
                              <td
                                key={`palette-color-${paletteIndex}-${colorIndex}`}
                              >
                                <div
                                  style={{
                                    backgroundColor: color.colorCode?.includes(
                                      "#"
                                    )
                                      ? color.colorCode
                                      : `#${color.colorCode}`,
                                    cursor: "default",
                                    width: "100%",
                                    color: color.colorCode?.includes("#")
                                      ? color.colorCode
                                      : `#${color.colorCode}`,
                                  }}
                                >
                                  .
                                </div>
                              </td>
                            </>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
          <div>
            {Array.isArray(data?.myColors) && data?.myColors.length > 0 && (
              <>
                <h3 className="colorPalettes_title">My Colors</h3>
                {["radio"].map((type) => {
                  const maxColors = Math.max(
                    ...(data?.myColors || []).map((p) => p.colors.length)
                  );

                  return (
                    <div key={`inline-${type}`}>
                      <table>
                        <tbody>
                          {data?.myColors?.map((palette, paletteIndex) => {
                            const colors = palette.colors || [];
                            const injectExtraBox = colors.length < maxColors;
                            const emptySlots =
                              maxColors -
                              (colors.length + (injectExtraBox ? 1 : 0));

                            return (
                              <tr key={`palette-row-${paletteIndex}`}>
                                {/* Radio button cell */}
                                <td>
                                  <Form.Check
                                    key={`sequential-${paletteIndex}-${keyValue}- ${paletteIndex}`}
                                    className="m-0"
                                    inline
                                    label=""
                                    name="colorPaletteID"
                                    type="radio"
                                    checked={palette?.paletteID === value}
                                    id={`visualization-${type}-${
                                      paletteIndex + 1
                                    }`}
                                    onChange={() =>
                                      handleColorPicker({
                                        colorPaletteID: palette?.paletteID,
                                        colors: palette?.colors,
                                        keyValue,
                                      })
                                    }
                                  />
                                </td>

                                {/* Render color boxes */}
                                {colors.map((color, colorIndex) => (
                                  <td
                                    key={`palette-color-${paletteIndex}-${colorIndex}`}
                                  >
                                    <div
                                      style={{
                                        backgroundColor: getSafeColor(
                                          color.colorCode
                                        ),
                                        cursor: "default",
                                        width: "100%",
                                        color: getSafeColor(color.colorCode),
                                      }}
                                    >
                                      .
                                    </div>
                                  </td>
                                ))}

                                {/* Add one extra box if needed */}
                                {injectExtraBox && (
                                  <td
                                    key={`extra-box-${paletteIndex}`}
                                    style={{ backgroundColor: "transparent" }}
                                  />
                                )}

                                {/* Add empty <td>s to pad to max */}
                                {emptySlots > 0 &&
                                  Array.from({ length: emptySlots }).map(
                                    (_, i) => (
                                      <td key={`empty-${paletteIndex}-${i}`} />
                                    )
                                  )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

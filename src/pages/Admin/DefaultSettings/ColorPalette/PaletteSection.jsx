import React from "react";
import { Form } from "react-bootstrap";

const PaletteSection = ({
  title,
  palettes,
  selectedId,
  setSelectedId,
  setSelectedPalette = () => {},
}) => {
  const handleClick = (palette) => {
    // Update both the ID and the palette object in one click
    setSelectedId(palette[0]?.color_palette_id);
    setSelectedPalette(palette);
  };

  return (
    <div>
      <h3 className="colorPalettes_title">{title}</h3>
      <div>
        <table>
          <tbody>
            {palettes?.length > 0 &&
              palettes.map((palette) => (
                <tr key={palette[0]?.color_palette_id}>
                  <td>
                    <Form.Check
                      onChange={() => handleClick(palette)}
                      className="m-0"
                      inline
                      label=""
                      name="default"
                      type="radio"
                      id={`radio-${palette[0]?.color_palette_id}`}
                      key={`radio-${palette[0]?.color_palette_id}`}
                      checked={
                        Number(selectedId) ===
                        Number(palette[0]?.color_palette_id)
                      }
                    />
                  </td>
                  {palette.map(
                    (color, index) =>
                      color?.color_code.startsWith("#") && (
                        <td
                          key={index}
                          style={{
                            backgroundColor: color?.color_code,
                          }}
                        />
                      )
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default React.memo(PaletteSection);

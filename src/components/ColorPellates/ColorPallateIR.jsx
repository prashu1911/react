import { useState } from "react";
import { Form } from "react-bootstrap"

export default function ColorPellatesIR({ ColorPellates, selectedPalletteID, handleColorPaletteSelect }) {

    const [ColorPallatesData, setColorPallatesData] = useState(ColorPellates)

    const categoryName = {
        sequential: "Sequential",
        divergent: "Diverging",
        dataVisualization: "Data Visualization",
        myColors: "My colors"
    };

    console.log("ColorPellates", ColorPellates, );
    

    return (
        <div className="mt-xl-4 mt-3 colorSec">
            <div  className="colorPalettes">

                {ColorPellates && Object.keys(ColorPellates)?.map((category, categoryIndex) => (

                    <>
                        {(category !="defaultColor" && category != "myColors") &&
                            <div >
                                <h3 className="colorPalettes_title">{categoryName[category]}</h3>
                                {ColorPellates[category]?.map((type) => (
                                    <div key={`inline-${type}`}>
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <Form.Check className='m-0'
                                                            inline
                                                            label=""
                                                            name="default"
                                                            type={'radio'}
                                                            id={`sequential-${type}-11`}
                                                            checked={type?.paletteID == selectedPalletteID}
                                                            onChange={() => { handleColorPaletteSelect(type?.paletteID) }}
                                                        />
                                                    </td>
                                                    {type?.colors?.map((item) => (

                                                        <td style={{ backgroundColor: item?.colorCode }}></td>
                                                    ))}
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                ))}
                            </div>

                        }
                    </>


                ))}

            </div>
        </div>
    )

}
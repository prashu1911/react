import { InputField } from "../../../../components";

export default function CustomTab({
  handleCustomClrChangeOnBlur,
  noOfPalleteColors,
}) {
  return (
    <div className="repeatBox">
      <div className="customSubHead">
        <span>Custom Color</span>
        <p className="mb-0">Click and configure the resulting palette</p>
      </div>
      <div className="colorPalette">
        {[...Array(noOfPalleteColors)].map((_, index) => {
          return (
            <div key={index}>
              <InputField
                onBlur={(e) => handleCustomClrChangeOnBlur(e, index)}
                type="color"
                placeholder="Enter Subtitle"
                title="Choose a color"
                id="mycolor1"
                defaultValue="#0968AC"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

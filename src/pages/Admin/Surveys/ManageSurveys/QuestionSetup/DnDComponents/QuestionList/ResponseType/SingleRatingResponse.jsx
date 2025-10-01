import { Form } from "react-bootstrap";
import SliderResponse from "./SliderResponse";
import RankOrderResponse from "./RankOrderResponse";
import ResponseSliderTwo from "./responseSliderTwo";
import { useState } from "react";

const SingleRatingResponse = ({ data }) => {
  if (!data?.response?.length) return null;

  const [selectedValue, setSelectedValue] = useState([]);

  const handleOnChange = (event) => {
    const { name, type } = event.target;
    const intValue = parseInt(name)

    if (type === "radio") {

      if (selectedValue.includes(intValue)) {
        setSelectedValue([]);
      } else {
        setSelectedValue([intValue]);
      }
    } else if (type === "checkbox") {

      if (selectedValue.includes(intValue)) {
        let newStrings = selectedValue.filter(function (string) {
          return string !== intValue;
        });
        setSelectedValue(newStrings);
      } else {
        setSelectedValue((prev) => [...prev, intValue]);
      }
    }
  };


  return (
    <>
      <div className="d-flex justify-content-between align-items-start flex-wrap">
        {/* <p className="d-flex align-items-center me-2">{` ${data.question}`}</p> */}
      </div>
      {data?.isSlider && (
        // <SliderResponse response={data?.response} />
        <ResponseSliderTwo
          questionResponse={data?.response}
          questionData={data}
        />
      )}

      {!data?.isSlider &&
        data?.responseSelectedType === "Rank Order Response" && (
          <RankOrderResponse response={data?.response} />
        )}
      {!data?.isSlider &&
        (data?.responseSelectedType === "Multi-Select Response" ||
          data?.responseSelectedType === "Single Select Response") && (
          <div
            className="allOptions d-flex flex-wrap gap-2 flex-column"
            style={{
              width: "max-content",
              minWidth: "200px",
              maxWidth: "100%",
            }}
          >
            {data?.response.map((type, typeIndex) => (
              <Form.Group
                key={`response-${typeIndex}`}
                className="mb-0"
                controlId={`response-${typeIndex}`}
              >
              
                <Form.Check
                  className="me-0"
                  inline
                  label={type.response}
                  checked={selectedValue.includes(type?.responseID)}
                  // checked={true}
                  name={type?.responseID}
                  type={
                    data?.responseSelectedType === "Multi-Select Response"
                      ? "checkbox"
                      : "radio"
                  }
                  id={`inline-${typeIndex}-${data?.questionID}`}
                  onClick={(e) => handleOnChange(e)}
                  // disabled={true}
                />
              </Form.Group>
            ))}
          </div>
        )}
    </>
  );
};

export default SingleRatingResponse;

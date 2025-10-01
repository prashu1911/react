import { useState } from "react";

const SliderResponse = ({ response = [] }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleSliderClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <span className="rangeSlider">
      <ul className="list-unstyled mb-0 d-flex">
        {response.map((item, index) => (
          <li
            key={item.response_id}
            className={`d-flex flex-column mb-0 ${activeIndex === index ? "active" : ""}`}
            onClick={() => handleSliderClick(index)}
            style={{flex: 1}}
          >
            <span className="d-inline-block" />
            <p className="mb-0 text-center">{item.response}</p>
          </li>
        ))}
      </ul>
    </span>
  );
};

export default SliderResponse;

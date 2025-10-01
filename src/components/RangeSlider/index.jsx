import React from "react";

const RangeSlider = ({
  value,
  onChange,
  min,
  max,
  name,
  placeholder,
  className,
  disabled = false,
}) => {
  return (
    <div className="colorOpacity">
      <input
        type="range"
        id={name}
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        name={name}
        placeholder={placeholder}
        className={className}
        disabled={disabled}
      />
    </div>
  );
};

export default RangeSlider;

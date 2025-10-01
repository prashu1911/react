import React, { useState, useEffect } from "react";
import { InputField } from "..";

function NumCounter({ value, onChange }) {
  const [count, setCount] = useState(1);

  useEffect(() => {
    
    if (value > 0) {
      setCount(value);
    }
  }, [value]);

  const increment = () => {
    setCount((prevCount) => {
      const newCount = prevCount + 1;
      onChange(newCount);
      return newCount;
    });
  };

  const decrement = () => {
    setCount((prevCount) => {
      if (prevCount > 1) {
        const newCount = prevCount - 1;
        onChange(newCount);
        return newCount;
      }
      return prevCount;
    });
  };

  return (
    <>
      <span
        className="input-group-text minus btn btn-primary"
        onClick={decrement}
      >
        -
      </span>
      <InputField
        type="text"
        className="form-control text-center px-2 bg-white text-dark"
        value={count}
        readOnly
      />
      <span
        className="input-group-text plus btn btn-primary"
        onClick={increment}
      >
        +
      </span>
    </>
  );
}

export default NumCounter;

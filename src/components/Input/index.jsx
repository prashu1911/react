import React from "react";
import { Form } from "react-bootstrap";

const InputField = React.memo(
  ({ extraClass = "", type, placeholder, value, innerRef, ...rest }) => {
    return (
      <Form.Control
        ref={innerRef}
        type={type}
        placeholder={placeholder}
        className={`${extraClass}`}
        value={value}
        {...rest}
      />
    );
  }
);

export default InputField;

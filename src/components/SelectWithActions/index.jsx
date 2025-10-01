import React from "react";
import { Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import Select from "react-select";

const CustomMultiValue = (props) => {
  const { data, removeProps } = props;
  return (
    <div className="custom-multi-value">
      <div className="custom-multi-label">
        {data.label}
        <span className="custom-remove" {...removeProps}>
          ×
        </span>
      </div>
    </div>
  );
};

const SelectWithActions = ({
  label,
  placeholder,
  options,
  isMulti,
  handleSelectAll,
  handleClearAll,
  value,
  onChange,
  style,
  dropdownWidth, // <-- NEW PROP
  isDisabled, // New Prop
}) => {
  // react-select style override for dropdown
  const customStyles = {
    menu: (provided) => ({
      ...provided,
      width: dropdownWidth || "auto",
      minWidth: dropdownWidth || provided.minWidth,
      maxWidth: dropdownWidth || provided.maxWidth,
      zIndex: 9999,
    }),
    control: (provided) => ({
      ...provided,
      width: dropdownWidth || "100%",
      minHeight: "40px",
      alignItems:"flex-start", // fix vertical alignment
      paddingTop: "0px",
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "2px 8px",
      display: "flex",
      flexWrap: "wrap",
      alignItems:"flex-start", // fix vertical alignment
      gap: "4px",
    }),
    placeholder: (provided) => ({
      ...provided,
      position: "absolute", // force placeholder to behave like native input
      left: "10px",
      top: "10%",
      // transform: "translateY(-50%)",
      margin: 0,
      pointerEvents: "none",
    }),
    input: (provided) => ({
      ...provided,
      margin: 0,
      padding: 0,
      position: "relative",
      top: "1px",
    }),
  
    ...style,
  };
  

  return (
    <Form.Group className="form-group select-with-actions">
      {label && <Form.Label>{label}</Form.Label>}
      <div className="select-wrapper">
        <Select
          placeholder={placeholder}
          isMulti={isMulti}
          options={options}
          value={value}
          onChange={onChange}
          classNamePrefix="select-field"
          className="select-field"
          styles={customStyles}
          isDisabled={isDisabled}
          components={{
            MultiValue: CustomMultiValue,
            DropdownIndicator: () => null,
            IndicatorSeparator: () => null,
            ClearIndicator: () => null,
          }}
        />

<div className="select-actions">
  {handleClearAll && (
    // <OverlayTrigger
    //   placement="top"
    // >
      <button  data-title={isMulti?"Clear all":"Deselect"}
        type="button"
        className="action-button clear-all tooltip-container"
        onClick={handleClearAll}
      >
        <em className="icon-close-circle" />
      </button>
    // </OverlayTrigger>
  )}

  {handleSelectAll && (
   
      <button
      data-title="Select all"
        type="button"
        className="action-button clear-all tooltip-container"
        onClick={handleSelectAll}
      >
        <em className="icon-circle-check" />
      </button>
    // </OverlayTrigger>
  )}
</div>
      </div>

      <style>{`
        .select-wrapper {
          position: relative;
        }

        .select-actions {
          position: absolute;
          top: 8px;
          right: 8px;
          display: flex;
          gap: 8px;
          z-index: 2;
        }

        .action-button {
          border: none;
          background: none;
          cursor: pointer;
          font-size: 18px;
          padding: 2px;
          color: black;
        }

        .action-button em {
          font-style: normal;
          font-size: 18px;
          color: black;
        }

        .select-field__value-container {
          display: flex;
          flex-wrap: wrap;
          padding-right: 60px;
          height: 70px;
          overflow-y: scroll; /* Always visible */
        }

        .select-field__value-container::-webkit-scrollbar {
          height: 4px;
          width: 6px;
        }

        .select-field__value-container::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 2px;
        }

        .custom-multi-value {
          flex: 0 0 100%;
          box-sizing: border-box;
          padding: 4px;
        }

        .custom-multi-label {
          background-color: #f1f1f1;
          border-radius: 4px;
          padding: 4px 8px;
          font-size: 12px;
          display: flex;
          justify-content: space-between;
        }

        .custom-remove {
          cursor: pointer;
          margin-left: 6px;
          color: #ff5c5c;
          font-weight: bold;
        }
      `}</style>
    </Form.Group>
  );
};

export default SelectWithActions;

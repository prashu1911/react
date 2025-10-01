import React from "react";
import Select, { components } from "react-select";

const customSingleValue = ({ data }) => (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      {data.colorCode && (
        <span
          style={{
            width: 10,
            height: 10,
            backgroundColor: data.colorCode,
            borderRadius: '50%',
            display: 'inline-block',
            marginRight: 6,
          }}
        />
      )}
      {data.label}
    </div>
  );
  
  const customOption = (props) => {
    const { data, innerRef, innerProps } = props;
    return (
      <div
        ref={innerRef}
        {...innerProps}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '6px 12px',
        }}
      >
        {data.colorCode && (
          <span
            style={{
              width: 14,
              height: 14,
              backgroundColor: data.colorCode,
              borderRadius: '50%',
              display: 'inline-block',
              marginRight: 8,
            }}
          />
        )}
        {data.label}
      </div>
    );
  };
  const dropdownStyle = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? '#0968ac' // Selected color
        : state.isFocused
        ? 'rgb(255, 255, 255)' // Hover color
        : undefined,
      color: state.isSelected ? 'white' : 'black',
      border:state.isFocused && '1px solid #0968ac', 
      cursor: 'pointer',
      marginTop: '2px',  
    }),
    control: (provided) => ({
      ...provided,
      minHeight: '36px',
      borderColor: '#ccc',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#999',
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      // color: '#4caf50', // Color of selected value text
    }),
  };

  const starColorDropdownStyle = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? '#0968ac' // Selected color
        : state.isFocused
        ? 'rgb(255, 255, 255)' // Hover color
        : undefined,
      color: state.isSelected ? 'white' : 'black',
      border:state.isFocused && '1px solid #0968ac', 
      cursor: 'pointer',
      marginTop: '2px',  
      width: "120px",
      borderRadius: "5px",
      height: "40px",
      display: "flex",
      alignItems: "center"
    }),
    control: (provided) => ({
      ...provided,
      minHeight: '36px',
      borderColor: '#ccc',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#999',
      },
      width: "120px",
      borderRadius: "5px",
      height: "40px",
      display: "flex",
      alignItems: "center"
    }),
    singleValue: (provided) => ({
      ...provided,
      // color: '#4caf50', // Color of selected value text
      width: "120px",
      borderRadius: "5px",
      height: "40px",
      display: "flex",
      alignItems: "center"
    }),
  };

  const customStyles = {
    ...dropdownStyle, // or starColorDropdownStyle/confettiDropdown depending on context
    multiValue: (provided) => ({
      ...provided,
      maxWidth: '100px', // Limit width
      backgroundColor: '#f0f0f0',
      borderRadius: '4px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      cursor: 'pointer',
      ':hover': {
        backgroundColor: 'red',
        color: 'white',
      },
    }),
    control: (provided) => ({
      ...provided,
      minHeight: '36px',
      overflowX: 'auto', // Optional horizontal scroll if needed
      flexWrap: 'nowrap', // Prevent wrapping
    }),
  };

const singleLineMultiSelectStyles = {
  input: (provided) => ({
    ...provided,
    position: "relative",
    zIndex: 2,
    margin: 0,
    padding: 0,
    lineHeight: "normal",
    flexShrink: 1,
    minWidth: 0,
    maxWidth: "100%",
  }),
  placeholder: (provided) => ({
    ...provided,
    position: "absolute",
    left: "8px",
    top: "50%",
    transform: "translateY(-50%)",
    margin: 0,
    padding: 0,
    zIndex: 1,
    pointerEvents: "none",
    color: "#bbb",
  }),
  menuPortal: (base) => ({ ...base, zIndex: 99999 }),
  control: (provided) => ({
    ...provided,
    minHeight: "36px",
    // Control itself should not wrap its direct children (ValueContainer, Indicators)
    // and should not scroll. Scrolling happens *inside* ValueContainer.
    display: "flex",
    flexWrap: "nowrap",
    alignItems: "center",
    overflow: "hidden", // Hide any overflow from the control itself
  }),
  valueContainer: (provided) => ({
    ...provided,
    position: "relative",
    padding: "2px 8px",
    display: "flex",
    flexWrap: "nowrap",
    alignItems: "center",
    overflowX: "auto", // Allow horizontal scrolling of selected items
    flex: "1 1 auto", // Allow ValueContainer to grow and shrink
    gap: "4px",
  }),
  singleValue: (provided) => ({
    ...provided,
    flexShrink: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
  }),
  multiValue: (provided) => ({
    ...provided,
    maxWidth: "100px",
    backgroundColor: "#f0f0f0",
    borderRadius: "4px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    margin: "2px",      // Add spacing between items
    flexShrink: 0,      // Prevent items from shrinking too much
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    cursor: "pointer",
    ":hover": {
      backgroundColor: "red",
      color: "white",
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? '#0968AC'     // selected option background
      : state.isFocused
      ? '#b2daf7'     // hover/focused background
      : 'white',
    color: state.isSelected ? 'white' : 'black',
    padding: 10,
  }),
};

const multipleLineMultiSelectStyles = {
  input: (provided) => ({
    ...provided,
    position: "relative",
    zIndex: 2,
    margin: 0,
    padding: 0,
    lineHeight: "normal",
    flexShrink: 1,
    minWidth: 0,
    maxWidth: "100%",
    maxHeight: '200px'
  }),
  placeholder: (provided) => ({
    ...provided,
    position: "absolute",
    left: "8px",
    top: "50%",
    transform: "translateY(-50%)",
    margin: 0,
    padding: 0,
    zIndex: 1,
    pointerEvents: "none",
    color: "#bbb",
  }),
  menuPortal: (base) => ({ ...base, zIndex: 99999 }),
  control: (provided) => ({
    ...provided,
    minHeight: "36px",
    maxHeight: "150px",
    overflowX: "auto",
    overflowY: "auto",
    whiteSpace: "nowrap",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
  }),
  valueContainer: (provided) => ({
    ...provided,
    display: 'flex',
    flexWrap: 'wrap', // ⛔ prevent wrapping
    overflowX: 'hidden', // ✅ allow horizontal scroll
    overflowY: 'hidden',
    whiteSpace: 'nowrap',
    padding: '2px 60px 2px 8px',
    gap: '4px',
  }),

  singleValue: (provided) => ({
    ...provided,
    flexShrink: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
  }),
  multiValue: (provided) => ({
    ...provided,
    maxWidth: "100px",
    backgroundColor: "#f0f0f0",
    borderRadius: "4px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    cursor: "pointer",
    ":hover": {
      backgroundColor: "red",
      color: "white",
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? '#0968AC'     // selected option background
      : state.isFocused
      ? '#b2daf7'     // hover/focused background
      : 'white',
    color: state.isSelected ? 'white' : 'black',
    padding: 10,
  }),
};
function SelectField({
  extraClass = "",
  defaultValue,
  options,
  isModal,
  hasColorSwatch = false,
  placeholder,
  isConfettiDropdown,
  starColor,
  disabled,
  multipleLineSelect,
  ...rest
}) {
  const customComponents = multipleLineSelect ? {
  ClearIndicator: () => null,
  DropdownIndicator: () => null,
  IndicatorSeparator: () => null, // Optional: remove the vertical bar between indicators
} : {
    ...(hasColorSwatch && { SingleValue: customSingleValue, Option: customOption }),
    ...(rest.isMulti && {
      MultiValue: (props) => {
        const { data } = props;
        return (
          <div style={{ display: "flex" }} title={data.label}>
            <components.MultiValue {...props} />
          </div>
        );
      },
    }),
  };

  return (
    <Select
      className={`selectPicker ${extraClass}`}
      options={options}
      placeholder={placeholder}
      components={Object.keys(customComponents)?.length > 0 ? customComponents : undefined}
      defaultValue={defaultValue}
      isDisabled={disabled}
      styles={multipleLineSelect ? multipleLineMultiSelectStyles : singleLineMultiSelectStyles}
      // menuPortalTarget={document.body} // ⬅️ this is critical
      {...rest}
    />
  );
}
export default SelectField;
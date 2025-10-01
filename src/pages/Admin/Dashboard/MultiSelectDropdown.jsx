import React, { useState } from 'react';
import Select from 'react-select';


export default function MultiSelectDropdown({
    value,
    onChange,
    placeholder,
    options
}) {

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: '40px',
      maxHeight: '80px', // limits container height
      overflowY: 'auto',
      flexWrap: 'wrap',
    }),
    valueContainer: (provided) => ({
      ...provided,
      maxHeight: '60px', // limit selection area height
      overflowY: 'auto',
      flexWrap: 'wrap',
      scrollbarWidth: 'none',     
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#e6f7ff' : 'white',
      color: 'black',
      padding: 10,
      
    }),
  };

  const customOption = (props) => {
    const { data, isSelected, innerRef, innerProps } = props;
    return (
      <div ref={innerRef} {...innerProps}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px 12px",
        fontSize: "14px", // ✅ larger font
        backgroundColor: isSelected ? "#e0f0ff" : "white", // ✅ active color
        cursor: "pointer",
      }}>
        <input type="checkbox" checked={isSelected} readOnly 
        style={{
          marginRight: 10,
          width: 18,       // ✅ bigger checkbox
          height: 18,      // ✅ bigger checkbox
          accentColor: "#0968AC", // ✅ blue when active
        }}
 />
        {data.label}
      </div>
    );
  };



  

  return (
    <Select
      options={options}
      isMulti
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
      components={{ Option: customOption }}
      onChange={onChange}
      value={value}
      styles={customStyles}
      placeholder={placeholder}
    />
  );




}

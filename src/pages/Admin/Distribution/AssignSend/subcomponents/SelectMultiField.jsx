import React, { useEffect, useState } from 'react';
import Select from 'react-select';

export default function SelectMultiField({
  value,
  onChange,
  placeholder,
  options,
  isDisabled,
}) {
  const [allSelected, setAllSelected] = useState(false);

  // "All" option config
  const allOption = { label: "All", value: "*" };

  // Merged options: All + real options
  const mergedOptions = [allOption, ...options];

  useEffect(() => {
    // Update allSelected state based on selection
    if (value.length === options.length) {
      setAllSelected(true);
    } else {
      setAllSelected(false);
    }
  }, [value, options]);

  const handleChange = (selectedOptions) => {
    if (!selectedOptions) {
      onChange([]);
      return;
    }

    const isAllSelected = selectedOptions.some((option) => option.value === "*");

    if (isAllSelected) {
      // If "All" was selected, toggle full selection
      if (value.length === options.length) {
        onChange([]);
      } else {
        onChange([...options]);
      }
    } else {
      onChange(selectedOptions);
    }
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: '40px',
      maxHeight: '80px',
      overflowY: 'auto',
      flexWrap: 'wrap',
    }),
    valueContainer: (provided) => ({
      ...provided,
      maxHeight: '60px',
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
      <div
        ref={innerRef}
        {...innerProps}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px 12px',
          fontSize: '14px',
          backgroundColor: (isSelected || allSelected) ? '#e0f0ff' : 'white',
          cursor: 'pointer',
        }}
      >
        <input
          type="checkbox"
          checked={
            data.value === '*' ? allSelected : isSelected
          }
          readOnly
          style={{
            marginRight: 10,
            width: 18,
            height: 18,
            accentColor: '#0968AC',
          }}
        />
        {data.label}
      </div>
    );
  };

  return (
    <Select
      options={mergedOptions}
      isMulti
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
      components={{ Option: customOption }}
      onChange={handleChange}
      value={value}
      styles={customStyles}
      placeholder={placeholder}
      isDisabled={isDisabled}
    />
  );
}

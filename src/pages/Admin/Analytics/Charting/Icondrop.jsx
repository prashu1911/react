import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import SvgComponent from "./IconSvg";

const CustomMultiValue = ({ data, removeProps }) => (
  
  <div className="custom-multi-value">
    <div className="custom-multi-label">
      {data.label}
      <span className="custom-remove" {...removeProps}>×</span>
    </div>
  </div>
);

const IconDropdown = ({
  options,
  isMulti = false,
  value,
  onChange,
  dropdownWidth,
  style,
}) => {
  const selectRef = useRef();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.controlRef.contains(event.target)) {
        setMenuOpen(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const handleIconClick = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleChange = (selected) => {
    onChange(selected);
    if (!isMulti) {
      setMenuOpen(false); // close menu for single select
    }
  };

  const customStyles = {
    container: (provided) => ({
      ...provided,
      position: "absolute",
      top: "40px",
      right: 0,         // <-- Align to the left side of the icon
      left: "auto",     // <-- Prevent default left alignment
      zIndex: 9999,
      width: dropdownWidth || "200px",
      display: menuOpen ? "block" : "none",
    }),
    control: () => ({
      display: "none",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    ...style,
  };
  

  return (
    <div className="dropdown-icon-wrapper ">
      <button
        type="button"
        className="icon-button tooltip-container" data-title="Saved Filter Subset"
        onClick={handleIconClick}
      >
<SvgComponent width={32} height={32} fill="#555" />
</button>

      <Select
        ref={selectRef}
        isMulti={isMulti}
        options={options}
        value={value}
        onChange={handleChange}
        styles={customStyles}
        menuIsOpen={menuOpen}
        onMenuClose={() => setMenuOpen(false)}
        components={{
          MultiValue: CustomMultiValue,
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
        }}
      />

      <style>{`
        .dropdown-icon-wrapper {
          position: relative;
          display: inline-block;
        }

        .icon-button {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 24px;
          padding: 6px;
        }

        .icon-button em {
          font-style: normal;
          color: #333;
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
    </div>
  );
};

export default IconDropdown;

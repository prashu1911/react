import React, { useState, useEffect } from "react";

const BranchFilterResponse = ({ data }) => {
  const [selections, setSelections] = useState({});
  const [optionsAtLevel, setOptionsAtLevel] = useState({});
  const [maxLevel, setMaxLevel] = useState(1);

  // Function to find the maximum level in the data
  const findMaxLevel = (items) => {
    let max = 1;
    const checkLevel = (item, currentLevel) => {
      if (currentLevel > max) max = currentLevel;
      if (item.nextLevel && item.nextLevel.length > 0) {
        item.nextLevel.forEach((child) => checkLevel(child, currentLevel + 1));
      }
    };
    items.forEach((item) => checkLevel(item, 1));
    return max;
  };

  // Initialize the component
  useEffect(() => {
    if (data && data.length > 0) {
      const max = findMaxLevel(data);
      setMaxLevel(max);

      const firstLevelOptions = data.map((item) => ({
        value: item.demographic_filter_id.toString(),
        label: item.response,
        displayName: item.displayName,
      }));

      setOptionsAtLevel({
        1: firstLevelOptions,
      });
      setSelections({});
    }
  }, [data]);

  // Function to update options for subsequent levels based on current selection
  const updateOptionsForLevel = (level, selectedValue) => {
    let currentData = data;
    let currentLevel = 1;

    // Navigate through the data structure based on selections
    while (currentLevel < level) {
      const currentSelection = selections[currentLevel];
      if (!currentSelection) break;

      const selectedItem = currentData.find(
        (item) => item.demographic_filter_id.toString() === currentSelection
      );
      if (!selectedItem || !selectedItem.nextLevel) break;

      currentData = selectedItem.nextLevel;
      // eslint-disable-next-line no-plusplus
      currentLevel++;
    }

    const selectedItem = currentData.find(
      (item) => item.demographic_filter_id.toString() === selectedValue
    );

    if (selectedItem && selectedItem.nextLevel) {
      const nextLevelOptions = selectedItem.nextLevel.map((item) => ({
        value: item.demographic_filter_id.toString(),
        label: item.response,
        displayName: item.displayName,
      }));

      setOptionsAtLevel((prev) => ({
        ...prev,
        [level + 1]: nextLevelOptions,
      }));
    }
  };

  const handleSelectionChange = (level, e) => {
    const { value } = e.target;

    const newSelections = {};
    // eslint-disable-next-line no-plusplus
    for (let i = 1; i <= level; i++) {
      newSelections[i] = i === level ? value : selections[i];
    }
    setSelections(newSelections);
    const newOptions = {};
    // eslint-disable-next-line no-plusplus
    for (let i = 1; i <= level; i++) {
      newOptions[i] = optionsAtLevel[i];
    }
    setOptionsAtLevel(newOptions);

    if (value) {
      updateOptionsForLevel(level, value);
    }
  };

  const getSelectedPath = () => {
    const path = [];
    // eslint-disable-next-line no-plusplus
    for (let level = 1; level <= maxLevel; level++) {
      const selectedValue = selections[level];
      const options = optionsAtLevel[level];
      if (selectedValue && options) {
        const selectedOption = options.find(
          (opt) => opt.value === selectedValue
        );
        if (selectedOption) {
          path.push(`${selectedOption.displayName}: ${selectedOption.label}`);
        }
      }
    }
    return path;
  };

  const handleReset = () => {
    setSelections({});
    setOptionsAtLevel((prev) => ({
      1: prev[1],
    }));
  };

  return (
    // <div className="container">
      <div className="card selectState">
        <div className="card-body">
            {[...Array(maxLevel)].map((_, index) => {
              const level = index + 1;
              const options = optionsAtLevel[level] || [];
              const showDropdown = level === 1 || selections[level - 1];

              return (
                showDropdown && (
                  <div key={level}>
                    <select
                      className="form-select"
                      value={selections[level] || ""}
                      onChange={(e) => handleSelectionChange(level, e)}
                    >
                      <option value="">
                        {options.length > 0
                          ? `Select ${options[0]?.displayName}`
                          : "Select Option"}
                      </option>
                      {options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )
              );
            })}
            <button className="btn btn-primary ripple-effect" onClick={handleReset}>
              Reset Selections
            </button>
          {Object.keys(selections).length > 0 && (
            <div className="mt-4 p-3 bg-light rounded">
              <h6 className="mb-2">Selected Path:</h6>
              <p className="mb-0 text-muted">{getSelectedPath().join(" > ")}</p>
            </div>
          )}
        </div>
      </div>
    // </div>
  );
};

export default BranchFilterResponse;

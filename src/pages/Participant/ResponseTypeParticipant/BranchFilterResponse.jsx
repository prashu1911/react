import { useAuth } from "customHooks";
import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";

const BranchFilterResponse = React.memo(({ data, onResponseChange, errors, responses, isEditable = true }) => {
  const [selections, setSelections] = useState({});
  const [optionsAtLevel, setOptionsAtLevel] = useState({});
  const [maxLevel, setMaxLevel] = useState(1);
  const [skipCheck, setSkipCheck] = useState(false);
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();

  function getMaxLevelFromData(data, selections) {
    let level = 1;
    let currentOptions = data.demographic_response;
    while (currentOptions && currentOptions.length > 0) {
      const selectedId = selections[level];
      if (!selectedId) break;
      const selectedOption = currentOptions.find(
        (item) => String(item.demographic_filter_id) === String(selectedId)
      );
      if (!selectedOption || !selectedOption.next_level || selectedOption.next_level.length === 0) {
        break;
      }
      level++;
      currentOptions = selectedOption.next_level;
    }
    return level;
  }

  function transformDataPrifilling(input, max) {
    return {
      question_id: data.question_id,
      question_type: data.question_type,
      outcome_id: data.outcome_id,
      intention_id: data.intention_id,
      question_no: data.question_no,
      response_selected_type: data.response_selected_type,
      is_branch_filter: true,
      is_skipped: input?.is_skipped || skipCheck,
      response_id: Object.entries(input).map(([level, id]) => ({
        id: parseInt(id, 10),
        level: parseInt(level, 10),
      })),
      maxLevel: max,
    };
  }

  useEffect(() => {
    if (!data?.demographic_response || data.demographic_response.length === 0) return;
    const findMaxLevel = (items, currentLevel = 1) => {
      let max = currentLevel;
      items.forEach((item) => {
        if (item.next_level && item.next_level.length > 0) {
          const childMax = findMaxLevel(item.next_level, currentLevel + 1);
          if (childMax > max) max = childMax;
        }
      });
      return max;
    };

    const max = findMaxLevel(data.demographic_response);
    setMaxLevel(max);

    const selectedResponseData = responses.find((value) => value?.question_id === data?.question_id);
    if (selectedResponseData) {
      setSkipCheck(selectedResponseData?.is_skipped);
      if (selectedResponseData?.is_skipped) {
        setSelections({});
        setOptionsAtLevel({
          1: data.demographic_response.map((item) => ({
            value: String(item.demographic_filter_id),
            label: item.response,
            displayName: item.display_name,
          })),
        });
      } else if (selectedResponseData?.response_id?.length > 0) {
        // Reconstruct selections from response_id
        const prevSelections = {};
        selectedResponseData.response_id.forEach(({ level, id }) => {
          prevSelections[level] = String(id);
        });
        setSelections(prevSelections);

        // Reconstruct optionsAtLevel for each level
        let currentData = data.demographic_response;
        let currentOptions = {
          1: currentData.map((item) => ({
            value: String(item.demographic_filter_id),
            label: item.response,
            displayName: item.display_name,
          })),
        };

        for (let i = 1; i <= Object.keys(prevSelections).length; i++) {
          const selectedId = prevSelections[i];
          if (!selectedId) break;
          const selectedItem = currentData.find((item) => String(item.demographic_filter_id) === String(selectedId));
          if (selectedItem && selectedItem.next_level && selectedItem.next_level.length > 0) {
            currentOptions[i + 1] = selectedItem.next_level.map((item) => ({
              value: String(item.demographic_filter_id),
              label: item.response,
              displayName: item.display_name,
            }));
            currentData = selectedItem.next_level;
          } else {
            break;
          }
        }
        setOptionsAtLevel(currentOptions);
      } else {
        // No previous selections, initialize first level options
        setSelections({});
        setOptionsAtLevel({
          1: data.demographic_response.map((item) => ({
            value: String(item.demographic_filter_id),
            label: item.response,
            displayName: item.display_name,
          })),
        });
      }
    } else {
      // Set initial options for level 1
      const firstLevelOptions = data.demographic_response.map((item) => ({
        value: item.demographic_filter_id,
        label: item.response,
        displayName: item.display_name,
      }));

      setOptionsAtLevel({ 1: firstLevelOptions });

      let currentLevel = data.demographic_response;
      let currentSelections = {};
      let currentOptions = { 1: firstLevelOptions };

      while (currentLevel) {
        const selectedItem = currentLevel.find((item) => item.is_user_selected_response === 1);
        if (!selectedItem) break;

        currentSelections[selectedItem.level] = selectedItem.demographic_filter_id;

        if (selectedItem.next_level) {
          const nextLevelOptions = selectedItem.next_level.map((item) => ({
            value: item.demographic_filter_id,
            label: item.response,
            displayName: item.display_name,
          }));
          currentOptions[selectedItem.level + 1] = nextLevelOptions;
          currentLevel = selectedItem.next_level;
        } else {
          break;
        }
      }

      if (Object.keys(currentSelections).length > 0) {
        setSelections(currentSelections);
        setOptionsAtLevel(currentOptions);
        const response = transformDataPrifilling(currentSelections, max);
        if (isEditable) {
          onResponseChange(response);
        }
      }
    }
  }, [responses, data?.question_id, data?.demographic_response]);

  // Update options for subsequent levels based on current selection
  const updateOptionsForLevel = (level, selectedValue) => {
    let currentData = data.demographic_response;
    let currentLevel = 1;

    // Navigate through the data structure based on selections
    while (currentLevel < level) {
      const currentSelection = selections[currentLevel];
      if (!currentSelection) break;

      const selectedItem = currentData.find((item) => item.demographic_filter_id === currentSelection);

      if (!selectedItem || !selectedItem.next_level) break;

      currentData = selectedItem.next_level;
      // eslint-disable-next-line no-plusplus
      currentLevel++;
    }

    const selectedItem = currentData.find((item) => item.demographic_filter_id === selectedValue);

    if (selectedItem && selectedItem.next_level) {
      const nextLevelOptions = selectedItem.next_level.map((item) => ({
        value: item.demographic_filter_id,
        label: item.response,
        displayName: item.display_name,
      }));

      setOptionsAtLevel((prev) => ({
        ...prev,
        [level + 1]: nextLevelOptions,
      }));
    }
  };

  function transformData(input, isClear) {
    if (isClear) {
      return {
        question_id: data.question_id,
        question_type: data.question_type,
        outcome_id: data.outcome_id,
        intention_id: data.intention_id,
        question_no: data.question_no,
        response_selected_type: data.response_selected_type,
        is_branch_filter: true,
        is_skipped: input?.is_skipped || skipCheck,
        response_id: [],
        maxLevel,
      };
    } else {
      return {
        question_id: data.question_id,
        question_type: data.question_type,
        outcome_id: data.outcome_id,
        intention_id: data.intention_id,
        question_no: data.question_no,
        response_selected_type: data.response_selected_type,
        is_branch_filter: true,
        is_skipped: input?.is_skipped || skipCheck,
        response_id: Object.entries(input).map(([level, id]) => ({
          id: parseInt(id, 10),
          level: parseInt(level, 10),
        })),
        maxLevel,
      };
    }
  }

  const handleSelectionChange = (level, e) => {
    const { value } = e.target;

    // Build newSelections up to the current level
    const newSelections = {};
    for (let i = 1; i < level; i++) {
      newSelections[i] = selections[i];
    }
    if (value !== "") {
      newSelections[level] = value;
    }
    // If value is '', do not add it to newSelections (removes the response for this and subsequent levels)

    // Build newOptions up to the current level
    const newOptions = {};
    for (let i = 1; i <= level; i++) {
      newOptions[i] = optionsAtLevel[i];
    }

    setSelections(newSelections);
    setOptionsAtLevel(newOptions);

    if (
      Object.keys(newOptions).length > 0 &&
      Object.values(newOptions).some((arr) => arr && arr.length > 0)
    ) {
      const newMaxLevel = getMaxLevelFromData(data, newSelections);
      const transformDataValue = transformData(newSelections, false);
      transformDataValue.maxLevel = newMaxLevel;
      if (isEditable) {
        onResponseChange(transformDataValue);
      }
    }
    if (value) {
      updateOptionsForLevel(level, value);
    }
  };

  const handleReset = () => {
    const newOptions = { 1: optionsAtLevel[1] };
    setSelections({});
    setOptionsAtLevel(newOptions);

    if (
      Object.keys(newOptions).length > 0 &&
      Object.values(newOptions).some((arr) => arr && arr.length > 0)
    ) {
      const newMaxLevel = getMaxLevelFromData(data, {});
      const transformDataValue = transformData({}, true);
      transformDataValue.maxLevel = newMaxLevel;
      if (isEditable) {
        onResponseChange(transformDataValue);
      }
    }
  };

  const isErrorObj = errors?.find((value) => value?.id === data?.question_id);
  let isError = false;
  let isShowError = false;

  if (isErrorObj) {
    isError = isErrorObj?.error;
    isShowError = true;
  } else {
    isShowError = false;
  }

  const borderStyle = {
    boxShadow: isShowError
      ? isError
        ? "rgb(241 0 0 / 39%) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px, rgba(17, 17, 26, 0.1) 0px 24px 80px"
        : "none"
      : "none",
  };

  const handleSkipForNow = (e) => {
    if (e.target.checked) {
      const newOptions = {
        1: data.demographic_response.map((item) => ({
          value: String(item.demographic_filter_id),
          label: item.response,
          displayName: item.display_name,
        })),
      };
      setSelections({});
      setOptionsAtLevel(newOptions);

      if (
        Object.keys(newOptions).length > 0 &&
        Object.values(newOptions).some((arr) => arr && arr.length > 0)
      ) {
        const newMaxLevel = getMaxLevelFromData(data, {});
        const baseResponse = {
          question_id: data.question_id,
          question_type: data.question_type,
          outcome_id: data.outcome_id,
          intention_id: data.intention_id,
          question_no: data.question_no,
          response_selected_type: data.response_selected_type,
          is_branch_filter: true,
          is_skipped: true,
          response_id: [],
          maxLevel: newMaxLevel,
        };
        if (isEditable) {
          onResponseChange(baseResponse);
        }
      }
    } else {
      const baseResponse = {
        question_id: data.question_id,
        question_type: data.question_type,
        outcome_id: data.outcome_id,
        intention_id: data.intention_id,
        question_no: data.question_no,
        response_selected_type: data.response_selected_type,
        is_branch_filter: true,
        is_skipped: false,
        response_id: [],
        maxLevel,
      };
      if (isEditable) {
        onResponseChange(baseResponse);
      }
    }
  };


  return (
    <div
      style={borderStyle}
      className="p-2"
      id={`question-container-${data.outcome_id}-${data.question_id}`}
      tabIndex={-1}
    >
      <div className="card">
        <div className="card-header">
          <h5>
            <span className="fw-bold">{data?.sl_no || data?.question_no}.</span> {data.question}
          </h5>
          {/* <p className="text-muted">{data.intentions}</p> */}
        </div>
        <div className="card-body">
          <div className="row g-3">
            {Array.from({ length: maxLevel }, (_, index) => {
              const level = index + 1;
              const options = optionsAtLevel[level] || [];
              const showDropdown = level === 1 || selections[level - 1];
              return (
                showDropdown &&
                options.length > 0 && (
                  <div key={level} className="col-md-12 mb-3">
                    <select
                      className="form-select"
                      value={selections[level] || ""}
                      onChange={(e) => handleSelectionChange(level, e)}
                      disabled={skipCheck}
                    >
                      <option value="">
                        {options.length > 0 ? `Select ${options[0]?.displayName}` : "Select Option"}
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

            <div className="col-12">
              <button className="btn btn-secondary" type="button" onClick={handleReset}>
                Reset Selections
              </button>
            </div>

            {!userData?.isAnonymous && Boolean(data?.skip_now) && (
              <Form.Group
                className="form-group mb-0 d-inline-block skipcheckBox"
                controlId={`skip-${data.question_id}`}
                style={{width:"fit-content"}}
              >
                <Form.Check
                  className="me-0"
                  type="checkbox"
                  onChange={handleSkipForNow}
                  checked={skipCheck}
                  label={<div>{data.skipText ? data.skipText : "Skip For Now"}</div>}
                />
              </Form.Group>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default BranchFilterResponse;

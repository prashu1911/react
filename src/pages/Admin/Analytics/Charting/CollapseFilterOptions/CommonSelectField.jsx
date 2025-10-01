import React, { useEffect, useState } from "react";
import { Col, Form, Collapse, Row } from "react-bootstrap";
import { SelectField, SelectWithActions } from "../../../../../components";
import { getAssessmentCharting, updateAssessmentCharting } from "../../../../../redux/AssesmentCharting/index.slice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

export default function CommonSelectField({
  departmentOptions,
  participantOptions,
  demographicsQuestionListOptions,
  managerOptions,
  benchmarklist,
  onDepartmentChange,
  onParticipantChange,
  onManagerChange,
  onManagerReporteesChange,
  onDemographicFilterChange,
  onBenchmarkChange,
  isQuickCompare,
  onQuickCompareBaseChange,
  selectedDepartments,
  selectedManagerReportees,
  selectedUsers,
  selectedManagers,
  selectedBenchmarkList,
  selectedDemographicFilters,
  setSelectedBenchmarkId,
}) {
  const [selectedCheckbox, setSelectedCheckbox] = useState(null);
  const [showDemographics, setShowDemographics] = useState(false);

  const getDemographicsOptions = (responses) => {
    if (!responses) return [];
    return responses.map((response) => ({
      value: response.response_id,
      label: response.value,
    }));
  };  
  const dispatch = useDispatch()

  const handleDemographicsChange = (
    selectedOptions,
    question,
    isBaseData = false
  ) => {
    const uniqueId = question.isBranch
      ? `${question.questionId}_${question.level}`
      : question.questionId;

    onDemographicFilterChange((prev) => [
      ...prev.filter((item) => {
        if (question.isBranch) {
          return item.uniqueId !== uniqueId;
        }
        return item.questionId !== question.questionId;
      }),
      {
        questionId: question.questionId,
        uniqueId,
        questionValue: question.label,
        isBranch: question.isBranch,
        level: question.level,
        responses: question.responses,
        selectedOptions,
      },
    ]);
  };
  const baseValue = useSelector(getAssessmentCharting)?.isQuickCompare
  const DMuniqueId = useSelector(getAssessmentCharting)?.DMuniqueId

  useEffect(() => {
    if (!baseValue) {
      setSelectedCheckbox(null);
      return;
    }
  
    let labelValue = null;
    switch (baseValue) {
      case "D":
        labelValue = "Departments";
        break;
      case "U":
        labelValue = "Participants";
        break;
      case "M":
        labelValue = "Managers";
        break;
      case "DM":
        labelValue = DMuniqueId;
        // setSelectedCheckbox(DMuniqueId)
        break;
      default:
        labelValue = baseValue; 
          // or "DM" → choose as per app logic
    }
    // alert(labelValue+""+DMuniqueId)
    setSelectedCheckbox(labelValue);
    // alert(labelValue)
  }, [baseValue]);
  
  

  const handleCheckboxChange = (label, labelValue) => {
    const newValue = selectedCheckbox === labelValue ? null : labelValue;
    setSelectedCheckbox(newValue);
    // alert(newValue)
  
    let baseValue = null;
    if (newValue) {
      switch (newValue) {
        case "Departments":
          baseValue = "D";
          break;
        case "Participants":
          baseValue = "U";
          break;
        case "Managers":
          baseValue = "M";
          break;
        default:
          baseValue = "DM";
      }
  
      dispatch(updateAssessmentCharting({ isQuickCompare: baseValue }));
      const flag = demographicsQuestionListOptions?.find((te)=>te?.value==newValue)?.value==newValue

      // alert(newValue+""+
      //   JSON.stringify(demographicsQuestionListOptions?.find((te)=>te?.value==newValue)?.value)
      //   +""+flag?"tr":'f')
      
      // ✅ Immediately update `isBaseData` for demographics
      onDemographicFilterChange((prev) => {
        const updated = prev.map((item) => {
          // console.log("Comparing item.value:", item, "with newValue:", newValue);
          // console.log("Equal?", item.value === newValue);
          return {
            ...item,
            isBaseData: item.uniqueId === newValue,
          };
        });
        console.log("Updated List:", updated);
        return updated;
      });
      dispatch(updateAssessmentCharting({ DMuniqueId:newValue }));

      
    } else {
      dispatch(updateAssessmentCharting({ DMuniqueId: null }));
        dispatch(updateAssessmentCharting({ isQuickCompare: null }));

      // ✅ Clear all isBaseData if unchecked
      onDemographicFilterChange((prev) =>
        prev.map((item) => ({
          ...item,
          isBaseData:false,
        }))
      );
    }
    console.log(demographicsQuestionListOptions)
  
    onQuickCompareBaseChange(baseValue);
  };
  

  const renderLabel = (label, rawValue = null, disableCheckbox = false) => {
    if (!isQuickCompare) return label;
    const checkboxValue = rawValue || label;
    return (
      <div className="d-flex align-items-center">
        {/* Label as plain text, no tooltip */}
        {label}
  
        {/* Tooltip ONLY on checkbox */}
        <div
          className="tooltip-container"
          data-title={disableCheckbox ? "Select atleast one option in dropdown" : "Tick the box"}
          style={{ marginLeft: "5px" }}
        >
          <Form.Check
            className="mb-1"
            type="checkbox"
            label={<div className="primary-color" />}
            checked={selectedCheckbox === checkboxValue}
            disabled={disableCheckbox}
            onChange={() => !disableCheckbox && handleCheckboxChange(label, checkboxValue)}
          />
        </div>
      </div>
    );
  };
  

  return (
    <>
      <Col xxl={3} lg={4} sm={6}>
        <Form.Group className="form-group">
          <Form.Label className="d-flex align-items-center gap-2">
            {renderLabel("Departments","Departments",selectedDepartments?.length?false:true)}
          </Form.Label>
          <SelectWithActions
            placeholder="Select Department"
            isMulti
            options={[{ value: "0", label: "Overall" }, ...departmentOptions]}
            onChange={onDepartmentChange}
            value={[
              ...(selectedDepartments?.includes("0")
                ? [{ value: "0", label: "Overall" }]
                : []),
              ...departmentOptions.filter((option) =>
                selectedDepartments?.includes(option.value)
              ),
            ]}
            handleClearAll={() => onDepartmentChange([])}
            handleSelectAll={() =>
              onDepartmentChange([
                { value: "0", label: "Overall" },
                ...departmentOptions,
              ])
            }
          />
        </Form.Group>
      </Col>

      <Col xxl={3} lg={4} sm={6}>
        <Form.Group className="form-group">
          <Form.Label className="d-flex align-items-center gap-2">
            {renderLabel("Participants","Participants",selectedUsers?.length?false:true)}
          </Form.Label>
          <SelectWithActions
            placeholder="Select Participant"
            isMulti
            options={participantOptions}
            onChange={onParticipantChange}
            value={participantOptions.filter((option) =>
              selectedUsers.includes(option.value)
            )}
            handleClearAll={() => onParticipantChange([])}
            handleSelectAll={() => onParticipantChange(participantOptions)}
          />
        </Form.Group>
      </Col>

      <Col xxl={3} lg={4} sm={6}>
        <Form.Group className="form-group">
          <Form.Label className="d-flex gap-2 align-items-center w-100">
            {renderLabel("Managers","Managers",selectedManagers?.length?false:true)}
            <div
              className="btn-group toggle-switch"
              role="group"
              aria-label="Manager Reportees Toggle"
              style={{
                marginTop: window.innerWidth > 768 ? -12 : 0,
                marginLeft: "auto",
              }}
            >
              <button
                type="button"
                className={`btn btn-xs px-2 py-1 
                  ${
                  selectedManagerReportees === "A"
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                style={{ fontSize: "12px", height: "24px" }}
                onClick={() => onManagerReporteesChange("A")}
              >
                All
              </button>
              <button
                type="button"
                className={`btn btn-xs px-2 py-1 
                  ${
                  selectedManagerReportees === "D"
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                style={{ fontSize: "12px", height: "24px" }}
                onClick={() => onManagerReporteesChange("D")}
              >
                Direct
              </button>
            </div>
          </Form.Label>
          <SelectWithActions
            placeholder="Select Manager"
            isMulti
            options={managerOptions}
            onChange={onManagerChange}
            value={managerOptions.filter((option) =>
              selectedManagers.includes(option?.value)
            )}
            handleClearAll={() => onManagerChange([])}
            handleSelectAll={() => onManagerChange(managerOptions)}
          />
        </Form.Group>
      </Col>

      <Col xxl={3} lg={4} sm={6} className={`${isQuickCompare ? "mt-1" : ""}`}>
        <Form.Group className="form-group">
          <SelectWithActions
            label={"Save Benchmark"}
            placeholder="Select Save Benchmark"
            options={benchmarklist}
            isMulti
            style={{ width: "15vw" }}
            onChange={onBenchmarkChange}
            value={benchmarklist.filter((option) =>
              selectedBenchmarkList
                ?.map((item) => item.value ?? item)
                .includes(option.value)
            )}
            handleClearAll={() => onBenchmarkChange([])}
            handleSelectAll={() => onBenchmarkChange(benchmarklist)}
          />
        </Form.Group>
      </Col>

      {demographicsQuestionListOptions?.length > 0 && (
        <Col xs={12} className="d-flex flex-column align-items-center">
          <button
            type="button"
            onClick={() => setShowDemographics(!showDemographics)}
            className="commonCollapse border-top border-bottom mb-3 bg-white"
          >
            <span style={{ color: "gray" }}>Demographics Options</span>
            <em
              className={`icon-drop-down ${
                showDemographics ? "top" : "down"
              }`}
            />
          </button>
          <Collapse in={showDemographics}>
            <Row className="commonCollapse px-1 border-bottom">

              {demographicsQuestionListOptions?.map((question, index) => {
                const isDisabled =
                selectedDemographicFilters?.find((f) => {
                  if (question.isBranch) {
                    return (
                      f.questionId === question.questionId &&
                      f.level === question.level
                    );
                  }
                  return f.questionId === question.questionId;
                })?.selectedOptions ?false:true
                                const demographicValue = question?.value;
                return (
                  <Col xxl={3} lg={4} sm={6} key={index}>
                    
                    <Form.Group className="form-group">
                      <Form.Label className="d-flex align-items-center gap-2">
                        {renderLabel(
                          question.label,
                          demographicValue,
                          isDisabled
                        )}
                      </Form.Label>
                    {/* {JSON.stringify(question)}
                     */}
                      <SelectField
                        placeholder={`Select Response`}
                        isMulti
                        options={getDemographicsOptions(question.responses)}
                        onChange={(selectedOptions) =>
                          handleDemographicsChange(
                            selectedOptions,
                            question,
                            selectedCheckbox === demographicValue
                          )
                        }
                        value={
                          selectedDemographicFilters?.find((f) => {
                            if (question.isBranch) {
                              return (
                                f.questionId === question.questionId &&
                                f.level === question.level
                              );
                            }
                            return f.questionId === question.questionId;
                          })?.selectedOptions || []
                        }
                      />
                    </Form.Group>
                  </Col>
                );
              })}
            </Row>
          </Collapse>
        </Col>
      )}
    </>
  );
}

import React, { useState, useEffect } from "react";
import { Col, Collapse, Form, Row, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  Button,
  ModalComponent,
  SelectField,
  InputField,
  SelectWithActions,
  ReactDataTable,
} from "../../../../components";
import ReportOptions from "./CollapseFilterOptions/ReportOptions";
import ChartOptions from "./CollapseFilterOptions/ChartOptions";
import CommonSelectField from "./CollapseFilterOptions/CommonSelectField";
import BenchmarkModal from "./BenchmarkModal"; // Add this import
import DownloadButtonGroup from "./DownloadButtonGroup";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getAssessmentCharting, updateAssessmentCharting } from "../../../../redux/AssesmentCharting/index.slice";
import IconDropdown from "./Icondrop";
import toast from "react-hot-toast";

export default function Outcomes({
  departmentOptions,
  managerOptions,
  participantOptions,
  outcomeOptions,
  demographicsQuestionListOptions,
  score,
  chartTypeOptions,
  legendOptions,
  dataLabelOptions,
  fontSizeOptions,
  outcomes,
  benchmarklist,
  selectedBenchmarkList,
  setSelectedBenchmarkList,
  saveBenchmarkdata,
  saveFilterSubset,
  handlePaletteColorChange,
  saveBenchmarkListData,
  selectedCompanyId,
  selectedSurveyId,
  fetchSaveBenchMark,
  handleView,
  viewLoader,
  selectedDepartments,
  selectedUsers,
  selectedManagers,
  selectedManagerReportees,
  selectedDemographicFilters,
  setSelectedDepartments,
  setSelectedUsers,
  setSelectedManagers,
  setSelectedManagerReportees,
  setSelectedDemographicFilters,
  filterSubsetOptions,
  onCompareTabOpen, // add this prop
  onFilterTabOpen,
  fetchSubsetListData, // <-- Add this prop
  getfiltersubset, // <-- Add this prop (for consistency)
  handleClearFilters,
  handleChartTypeChange,
  chartType,
  handleLegendPosistionChange,
  legendPosition,
  handleLablePosistionChange,
  labelPosition,
  handleFontSizeChange,
  fontSize,
  handleSwitchAxisChange,
  switchAxis,
  handleLabelColorChange,
  labelColorState,
  handleOpacityChange,
  annotationOpacity,
  resetQuickCompareStates,
  handleDownloadPNG,
  handleDownloadSVG,
  handleDownloadCSV,
  handleOrder,
  setReportName,
  setOpeningComment,
  setClosingComment,
  reportName,
  openingComment,
  closingComment,
  handleSaveReport,
  activeTab, // Add this prop
  chartViewType, // Add this prop
  activeCollapse,
  onCollapseChange,
  handlePreviewReport,
}) {
  // Replace existing collapse state with controlled version
  const [outcomesCollapse, setOutcomesCollapse] = useState(activeCollapse);

  const outcomesToggleCollapse = (collapseId) => {
    // Don't allow switching to filter if we're in compare mode
    if (chartViewType === "COMPARE" && collapseId === "aggregateFilter") {
      return;
    }

    const newCollapseState =
      outcomesCollapse === collapseId ? null : collapseId;
    setOutcomesCollapse(newCollapseState);
    if (typeof onCollapseChange === "function") {
      onCollapseChange(newCollapseState);
    }
  };

  useEffect(() => {
    console.log("FONT SIZE in outcomes: ", fontSize)
  },[fontSize])

  // Update effect to handle collapse changes from parent
  useEffect(() => {
    if (activeCollapse !== undefined) {
      setOutcomesCollapse(activeCollapse);
    }
  }, [activeCollapse]);

  // view All questins modal
  const [questions, setQuestions] = useState(false);
  const questionsClose = () => setQuestions(false);
  const questionsShow = () => setQuestions(true);

  // Add benchmark-related state
  const [showAddBenchmark, setShowAddBenchmark] = useState(false);
  const [benchmarkName, setBenchmarkName] = useState("");
  const [modifiedBenchmarkData, setModifiedBenchmarkData] = useState(null);
  const [isCreateNew, setIsCreateNew] = useState(true);
  const [selectedBenchmarkId, setSelectedBenchmarkId] = useState(null);
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10); // default page size
  const handleLimitChange = (newLimit) => {
    setSizePerPage(parseInt(newLimit));
    setPage(1); // reset to first page on limit change
  };
  
  const handleOffsetChange = (newPage) => {
    setPage(newPage);
  };
  // Add state for selections
  const [selectedOutcomes, setSelectedOutcomes] = useState([]);

  // Preselect all outcomes on mount or when outcomeOptions changes
  useEffect(() => {
    if (Array.isArray(outcomeOptions) && outcomeOptions.length > 0) {
      setSelectedOutcomes(outcomeOptions);
    }
  }, [outcomeOptions]);

  const handleOutcomeChange = (options) => {
    setSelectedOutcomes(options);
  };

  // Select All/Clear All handlers for Outcomes
  const handleSelectAllOutcomes = (e) => {
    e.preventDefault();
    setSelectedOutcomes(outcomeOptions);
  };
  const handleClearAllOutcomes = (e) => {
    e.preventDefault();
    setSelectedOutcomes([]);
  };

  const addBenchmarkClose = () => {setShowAddBenchmark(false); setBenchmarkName(""); setIsCreateNew(true)};
  const addBenchmarkShow = () => setShowAddBenchmark(true);

  // Add benchmark handlers
  const handleBenchmarkValueChange = (
    outcomeId,
    intentionId,
    questionId,
    value
  ) => {
    setModifiedBenchmarkData((prev) => {
      const newData = prev ? { ...prev } : { ...saveBenchmarkListData };

      newData.outcomes = newData.outcomes.map((outcome) => {
        if (outcome.outcome_id === outcomeId) {
          // If modifying outcome value directly
          if (!intentionId && !questionId) {
            return { ...outcome, value };
          }

          // If modifying intention or question
          return {
            ...outcome,
            intentions: outcome.intentions.map((intention) => {
              if (intention.intention_id === intentionId) {
                // If modifying intention value directly
                if (!questionId) {
                  return { ...intention, value };
                }

                // If modifying question value
                return {
                  ...intention,
                  questions: intention.questions.map((question) =>
                    question.question_id === questionId
                      ? { ...question, value }
                      : question
                  ),
                };
              }
              return intention;
            }),
          };
        }
        return outcome;
      });

      return newData;
    });
  };

  const handleSaveBenchmark = async() => {
    const benchmarkData = modifiedBenchmarkData || {
      outcomes: saveBenchmarkListData?.outcomes?.map((outcome) => ({
        outcome_id: parseInt(outcome.outcome_id, 10),
        outcome_name: outcome.outcome_name,
        value: outcome.value,
        intentions: outcome.intentions.map((intention) => ({
          intention_id: parseInt(intention.intention_id, 10),
          intention_name: intention.intention_name,
          value: intention.value,
          questions: intention.questions.map((question) => ({
            question_id: parseInt(question.question_id, 10),
            question_no: question.question_no,
            question: question.question,
            value: question.value,
          })),
        })),
      })),
    };

    await saveBenchmarkdata(
      parseInt(selectedCompanyId, 10),
      parseInt(selectedSurveyId, 10),
      benchmarkName,
      benchmarkData,
      !isCreateNew ? selectedBenchmarkId : null
    );
    addBenchmarkClose()
  };

  const [quickCompareBase, setQuickCompareBase] = useState(null);

  const [runType, setRunType] = useState("filter"); 
  const reduxruntype = useSelector(getAssessmentCharting)?.isCompareTab
  const reduxquickcompate = useSelector(getAssessmentCharting)?.isQuickCompare

  useEffect(()=>{
    setQuickCompareBase(reduxquickcompate)
  },[reduxquickcompate])
  useEffect(()=>{
setRunType(reduxruntype?"compare":'filter')

},[reduxruntype])
const dispatch= useDispatch()
  
  useEffect(() => {
    if(selectedOutcomes.length){
      handleRun2()

    }else{
      if(quickCompareBase&&runType){
        toast.error("At least one outcome should be selected")

      }
    }
  }, [runType,selectedOutcomes,quickCompareBase]);

     const handleRun2 = () => {

      const isCompareTab = reduxruntype
      setRunType(isCompareTab ? "compare" : "filter");
      dispatch(updateAssessmentCharting({ isCompareTab }));
  
      // Quick compare is only true if we're in compare tab AND have a base selection
      const isQuickCompare = isCompareTab && quickCompareBase !== null;
      // Composite is true if we're in compare tab but don't have a base selection
      const isComposite = isCompareTab && quickCompareBase === null;
  
      if (!isQuickCompare && typeof resetQuickCompareStates === "function") {
        resetQuickCompareStates();
      }
  
      // Implement transformedDemographicFilters
      const transformedDemographicFilters =
        selectedDemographicFilters?.length > 0
          ? selectedDemographicFilters.map((filter) => {
              // Find the question definition
              const question = demographicsQuestionListOptions?.find(
                (q) =>
                  String(q.questionId) === String(filter.questionId) ||
                  String(q.value) === String(filter.questionId)
              );
              // Map selectedOptions to array of {responseId, responseValue}
              const responses =
                Array.isArray(filter.selectedOptions) &&
                question &&
                question.responses
                  ? filter.selectedOptions.map((selected) => {
                      // Find the response object in question.responses
                      const respObj = question.responses.find(
                        (resp) =>
                          String(resp.response_id) === String(selected.value) ||
                          String(resp.value) === String(selected.value)
                      );
                      return {
                        responseId: respObj?.response_id ?? selected.value,
                        responseValue: respObj?.value ?? selected.label,
                      };
                    })
                  : [];
              return {
                ...filter,
                responses,
              };
            })
          : [];
  
      const filterValid = (arr) =>
        Array.isArray(arr)
          ? arr.filter((v) => v !== null && v !== undefined && v !== "")
          : [];
  
      const dataFilters = {
        departments: filterValid(
          selectedDepartments?.length > 0
            ? selectedDepartments.map((item) => item.value ?? item)
            : []
        ),
        users: filterValid(
          selectedUsers?.length > 0
            ? selectedUsers.map((item) => item.value ?? item)
            : []
        ),
        managers: filterValid(
          selectedManagers?.length > 0
            ? selectedManagers.map((item) => item.value ?? item)
            : []
        ),
        managerReportees: selectedManagerReportees || "D",
        demographicFilters: transformedDemographicFilters,
        benchmarks:
          selectedBenchmarkList?.length > 0
            ? selectedBenchmarkList.map((item) => item.value)
            : [],
        references: [],
        // Always pass the preselected outcomes
        outcomes: selectedOutcomes?.map((outcome) => outcome.value) || [],
        isOutcomes: !isCompareTab,
        isQuickCompare,
        isComposite,
        quickCompareBase,
      };
      handleView(dataFilters);
    };

  const handleRun = () => {
    if(!selectedOutcomes?.length){
     return toast.error("At least one outcome should be selected")

    }    const isCompareTab = outcomesCollapse === "quickCompare";
    setRunType(isCompareTab ? "compare" : "filter");
    dispatch(updateAssessmentCharting({ isCompareTab }));

    // Quick compare is only true if we're in compare tab AND have a base selection
    const isQuickCompare = isCompareTab && quickCompareBase !== null;
    // Composite is true if we're in compare tab but don't have a base selection
    const isComposite = isCompareTab && quickCompareBase === null;

    if (!isQuickCompare && typeof resetQuickCompareStates === "function") {
      resetQuickCompareStates();
    }

    // Implement transformedDemographicFilters
    const transformedDemographicFilters =
      selectedDemographicFilters?.length > 0
        ? selectedDemographicFilters.map((filter) => {
            // Find the question definition
            const question = demographicsQuestionListOptions?.find(
              (q) =>
                String(q.questionId) === String(filter.questionId) ||
                String(q.value) === String(filter.questionId)
            );
            // Map selectedOptions to array of {responseId, responseValue}
            const responses =
              Array.isArray(filter.selectedOptions) &&
              question &&
              question.responses
                ? filter.selectedOptions.map((selected) => {
                    // Find the response object in question.responses
                    const respObj = question.responses.find(
                      (resp) =>
                        String(resp.response_id) === String(selected.value) ||
                        String(resp.value) === String(selected.value)
                    );
                    return {
                      responseId: respObj?.response_id ?? selected.value,
                      responseValue: respObj?.value ?? selected.label,
                    };
                  })
                : [];
            return {
              ...filter,
              responses,
            };
          })
        : [];

    const filterValid = (arr) =>
      Array.isArray(arr)
        ? arr.filter((v) => v !== null && v !== undefined && v !== "")
        : [];

    const dataFilters = {
      departments: filterValid(
        selectedDepartments?.length > 0
          ? selectedDepartments.map((item) => item.value ?? item)
          : []
      ),
      users: filterValid(
        selectedUsers?.length > 0
          ? selectedUsers.map((item) => item.value ?? item)
          : []
      ),
      managers: filterValid(
        selectedManagers?.length > 0
          ? selectedManagers.map((item) => item.value ?? item)
          : []
      ),
      managerReportees: selectedManagerReportees || "D",
      demographicFilters: transformedDemographicFilters,
      benchmarks:
        selectedBenchmarkList?.length > 0
          ? selectedBenchmarkList.map((item) => item.value)
          : [],
      references: [],
      // Always pass the preselected outcomes
      outcomes: selectedOutcomes?.map((outcome) => outcome.value) || [],
      isOutcomes: !isCompareTab,
      isQuickCompare,
      isComposite,
      quickCompareBase,
    };
    handleView(dataFilters);
  };

  // Save Filter Subset for aggregate (FCSS)
  const [showSaveFilterSubset, setShowSaveFilterSubset] = useState(false);
  const [filterSubsetName, setFilterSubsetName] = useState("");
  const [showSaveCompareSubset, setShowSaveCompareSubset] = useState(false);
  const [compareSubsetName, setCompareSubsetName] = useState("");

  const handleSaveFilterSubset = () => {
    const dataFilters = {
      departments: selectedDepartments || [],
      users: selectedUsers || [],
      managers: selectedManagers || [],
      managerReportees: selectedManagerReportees || "D",
      demographicFilters:
        selectedDemographicFilters?.length > 0
          ? selectedDemographicFilters.map((filter) => ({
              ...filter,
              responses: Array.isArray(filter.selectedOptions)
                ? filter.selectedOptions.map((r) => r.value)
                : [],
            }))
          : [],
    };

    if (filterSubsetName && selectedCompanyId && selectedSurveyId) {
      saveFilterSubset(filterSubsetName, dataFilters, "FCSS")
        .then(() => {
          setShowSaveFilterSubset(false);
          setFilterSubsetName("");
        })
        .catch((error) => {
          console.error("Failed to save filter subset:", error);
        });
    }
  };

  const handleSaveCompareSubset = () => {
    const dataFilters = {
      departments: selectedDepartments || [],
      users: selectedUsers || [],
      managers: selectedManagers || [],
      managerReportees: selectedManagerReportees || "D",
      demographicFilters:
        selectedDemographicFilters?.length > 0
          ? selectedDemographicFilters.map((filter) => ({
              ...filter,
              responses: Array.isArray(filter.selectedOptions)
                ? filter.selectedOptions.map((r) => r.value)
                : [],
            }))
          : [],
    };

    if (compareSubsetName && selectedCompanyId && selectedSurveyId) {
      saveFilterSubset(compareSubsetName, dataFilters, "CCSS")
        .then(() => {
          setShowSaveCompareSubset(false);
          setCompareSubsetName("");
        })
        .catch((error) => {
          console.error("Failed to save compare chart subset:", error);
        });
    }
  };

  // data table columns for modal (match Aggregate)
  const demographicsColumns = [
    {
      title: "S.No.",
      dataKey: "number",
      data: "number",
      columnHeaderClassName: "no-sorting ",
    },
    {
      title: "Questions",
      dataKey: "questions",
      data: "questions",
      columnHeaderClassName: "no-sorting",
    },
  ];

  // flatten outcomes/questions for modal table (match Aggregate)
  const transformedOutcomesData =
    outcomes?.flatMap((outcome, index) =>
      outcome.questions.map((question, questionIndex) => ({
        number: `${index + 1}.${questionIndex + 1}`,
        questions: question.question,
      }))
    ) || [];

  // Trigger parent callback when compare tab is opened
  useEffect(() => {
    if (
      outcomesCollapse === "quickCompare" &&
      typeof onCompareTabOpen === "function"
    ) {
      onCompareTabOpen();
    }
    else{
      onFilterTabOpen()
    }
    // Only run when tab changes
  }, [outcomesCollapse]);

  // Add state to track selected filter subset
  const [selectedFilterSubset, setSelectedFilterSubset] = useState(null);

  // Handler for filter subset selection
  const handleFilterSubsetChange = (option) => {
    setSelectedFilterSubset(option);
    if (option && option.value) {
      fetchSubsetListData(option.value);
    }
  };

  // Fill filter fields when getfiltersubset changes
  useEffect(() => {
    if (
      getfiltersubset &&
      (getfiltersubset.departments ||
        getfiltersubset.users ||
        getfiltersubset.managers ||
        getfiltersubset.managerReportees ||
        getfiltersubset.demographicFilters)
    ) {
      // Departments
      if (Array.isArray(getfiltersubset.departments)) {
        setSelectedDepartments(getfiltersubset.departments);
      }
      // Users
      if (Array.isArray(getfiltersubset.users)) {
        setSelectedUsers(getfiltersubset.users);
      }
      // Managers
      if (Array.isArray(getfiltersubset.managers)) {
        setSelectedManagers(getfiltersubset.managers);
      }
      // Manager Reportees
      if (getfiltersubset.managerReportees) {
        setSelectedManagerReportees(getfiltersubset.managerReportees);
      }
      // Demographic Filters
      if (Array.isArray(getfiltersubset.demographicFilters)) {
        // Map demographicFilters to UI format
        const mapped = getfiltersubset.demographicFilters.map((filter) => {
          // Find the question definition from demographicsQuestionListOptions
          const question = demographicsQuestionListOptions?.find(
            (q) =>
              String(q.questionId) === String(filter.questionId) ||
              String(q.value) === String(filter.questionId)
          );
          // Map responses to selectedOptions format
          const selectedOptions =
            Array.isArray(filter.responses) && question && question.responses
              ? question.responses
                  .filter((resp) =>
                    filter.responses.includes(resp.response_id || resp.value)
                  )
                  .map((resp) => ({
                    value: resp.response_id ?? resp.value,
                    label: resp.value,
                  }))
              : [];
          return {
            questionId: filter.questionId,
            questionValue: question?.label || "",
            isBranch: filter.isBranch,
            responses: question?.responses || [],
            selectedOptions,
          };
        });
        setSelectedDemographicFilters(mapped);
      }
    }
  }, [getfiltersubset, demographicsQuestionListOptions]);

  const handleClearLocal = () => {
    handleClearFilters(); // Call parent clear function
    setSelectedFilterSubset(null); // Clear selected filter subset
  };

  return (
    <>
      <Row className="g-2">
        <Col lg={4} sm={6}>
          <SelectWithActions
            label="Outcome Selection"
            placeholder="Select Outcome"
            options={outcomeOptions}
            isMulti
            value={selectedOutcomes}
            onChange={handleOutcomeChange}
            handleSelectAll={handleSelectAllOutcomes}
            handleClearAll={handleClearAllOutcomes}
          />
        </Col>
      </Row>
      <div className="d-flex align-items-center justify-content-between flex-wrap mb-4 gap-2">
        <ul className="collapseList list-inline d-flex align-items-center gap-2 mb-0 pb-lg-0 pb-1 collapseBtn">
          <li>
            <Link
              href="#!"
              aria-controls="aggregateFilter"
              onClick={() => outcomesToggleCollapse("aggregateFilter")}
              aria-expanded={outcomesCollapse === "aggregateFilter"}
              className={`btn btn-light gap-2 collapseArrow ${runType === "filter" ? "active" : ""} ${
                chartViewType === "COMPARE" ? "disabled" : ""
              }`}
              style={{
                pointerEvents: chartViewType === "COMPARE" ? "none" : "auto",
                opacity: chartViewType === "COMPARE" ? 0.5 : 1,
              }}
            >
              <span>Filter</span>
              <em className="icon icon-drop-down" />
            </Link>
          </li>
          <li>
            <Link
              href="#!"
              aria-controls="quickCompare"
              onClick={() => outcomesToggleCollapse("quickCompare")}
              aria-expanded={outcomesCollapse === "quickCompare"}
              className={`btn btn-light gap-2 collapseArrow ${runType === "compare" ? "active" : ""}`}
              >
              <span>Compare</span>
              <em className="icon icon-drop-down" />
            </Link>
          </li>
          
        </ul>
        <ul className="list-inline d-flex align-items-center filter_action mb-0 flex-wrap collapseBtn">
          <li>
            <Link
              href="#!"
              aria-controls="chartOptions"
              onClick={() => outcomesToggleCollapse("chartOptions")}
              aria-expanded={outcomesCollapse === "chartOptions"}
              className="btn btn-light gap-2 bg-toggleSky"
            >
              <span>Chart Options</span>
              <em className="icon icon-drop-down" />
            </Link>
          </li>
          <li>
            <Link
              href="#!"
              className="btn btn-light ripple-effect"
              onClick={questionsShow}
            >
              Questions
            </Link>
          </li>
          <li>
            <Link
              href="#!"
              aria-controls="reports"
              onClick={() => outcomesToggleCollapse("reports")}
              aria-expanded={outcomesCollapse === "reports"}
              className="btn btn-light gap-2 collapseArrow"
            >
              <span>Reports</span>
              <em className="icon icon-drop-down" />
            </Link>
          </li>
          <li>
            <DownloadButtonGroup
              onDownloadPNG={handleDownloadPNG}
              onDownloadSVG={handleDownloadSVG}
            />
          </li>
          {runType=="filter"&&<li className="tooltip-container" data-title="Change Order">
            <Link
              href="#!"
              className=" btn-icon ripple-effect"
              onClick={handleOrder}
            >
              <em className="icon-exchange" />
            </Link>
          </li>}
        </ul>
      </div>
      <Collapse in={outcomesCollapse === "chartOptions"}>
        <Form>
          <ChartOptions
            score={score}
            onColorChange={handlePaletteColorChange}
            handleChartTypeChange={handleChartTypeChange}
            chartTypeOptions={chartTypeOptions}
            legendOptions={legendOptions}
            dataLabelOptions={dataLabelOptions}
            fontSizeOptions={fontSizeOptions}
            chartType={chartType}
            handleLegendPosistionChange={handleLegendPosistionChange}
            legendPosition={legendPosition}
            handleLablePosistionChange={handleLablePosistionChange}
            labelPosition={labelPosition}
            handleFontSizeChange={handleFontSizeChange}
            fontSize={fontSize}
            handleSwitchAxisChange={handleSwitchAxisChange}
            switchAxis={switchAxis}
            handleLabelColorChange={handleLabelColorChange}
            labelColorState={labelColorState}
            handleOpacityChange={handleOpacityChange}
            annotationOpacity={annotationOpacity}
            switchAxixButtonShow={true}
          />
        </Form>
      </Collapse>
      <Collapse in={outcomesCollapse === "aggregateFilter"}>
        <Form>
          <div className="formCard">
          <div  style={{marginLeft:'auto',width:"50px",marginTop:-20,marginBottom:-10,marginRight:-10}}>
          <IconDropdown
                    placeholder="Select Saved Filtered Subsets"
                    options={filterSubsetOptions}
                    value={selectedFilterSubset}
                    handleClearAll={()=>setSelectedFilterSubset([])}
                    onChange={handleFilterSubsetChange}
                  />
           </div>
            <Row className="gx-2">
             
              <CommonSelectField
                departmentOptions={departmentOptions}
                participantOptions={participantOptions}
                demographicsQuestionListOptions={
                  demographicsQuestionListOptions
                }
                managerOptions={managerOptions}
                benchmarklist={benchmarklist}
                onDepartmentChange={(value) => {
                  setSelectedDepartments(
                    value?.map((item) => item.value) || []
                  );
                }} // Capture selected departments
                onParticipantChange={(value) => {
                  setSelectedUsers(value?.map((item) => item.value) || []);
                }} // Capture selected users
                selectedUsers={selectedUsers} // Capture selected users
                onManagerChange={(value) => {
                  setSelectedManagers(value?.map((item) => item.value) || []);
                }} // Capture selected managers
                selectedManagers={selectedManagers} // Capture selected managers
                onManagerReporteesChange={setSelectedManagerReportees} // Capture manager reportees
                onDemographicFilterChange={setSelectedDemographicFilters} // Capture demographic filters
                onBenchmarkChange={setSelectedBenchmarkList}
                selectedBenchmarkList={selectedBenchmarkList} // Add this prop
                selectedDepartments={selectedDepartments}
                selectedManagerReportees={selectedManagerReportees} // Pass selected manager reportees
                selectedDemographicFilters={selectedDemographicFilters}
              />

              <Col xs={12} className="align-self-end mt-3">
                <Form.Group className="form-group d-flex gap-2 justify-content-end flex-wrap">
                  <Button
                    variant="secondary"
                    className="ripple-effect gap-2"
                    onClick={handleClearLocal}
                  >
                    <em className="icon-clear" />
                    <span>Clear</span>
                  </Button>
                  <Button
                    variant="primary"
                    className="ripple-effect gap-2"
                    onClick={addBenchmarkShow}
                  >
                    <em className="icon-bookmark-check" />
                    <span>Save Benchmark</span>
                  </Button>
                  <Button
                    variant="warning"
                    className="ripple-effect gap-2 flex-shrink-0"
                    onClick={() => setShowSaveFilterSubset(true)}
                  >
                    <em className="icon-bookmark-check" />
                    <span>Save Filter Subset</span>
                  </Button>
                  <Button
                    variant="primary"
                    className="ripple-effect gap-2"
                    onClick={handleRun}
                  >
                    {viewLoader ? (
                      <Spinner animation="border" size="sm" className="me-2" />
                    ) : (
                      <em className="icon-run" />
                    )}
                    <span>Run</span>
                  </Button>
                </Form.Group>
              </Col>
            </Row>
          </div>
        </Form>
      </Collapse>
      <Collapse in={outcomesCollapse === "quickCompare"}>
        <Form>
          <div className="formCard">
          <div  style={{marginLeft:'auto',width:"50px",marginTop:-20,marginBottom:-10,marginRight:-10}}>
          <IconDropdown
                    placeholder="Select Saved Quick Compare View"
                    options={filterSubsetOptions}
                    value={selectedFilterSubset}
                    onChange={handleFilterSubsetChange}
                    handleClearAll={()=>setSelectedFilterSubset([])}
                  />
            </div>
          
            <Row className="gx-2">
          
              <CommonSelectField
                departmentOptions={departmentOptions}
                participantOptions={participantOptions}
                demographicsQuestionListOptions={
                  demographicsQuestionListOptions
                }
                managerOptions={managerOptions}
                benchmarklist={benchmarklist}
                onDepartmentChange={(value) => {
                  setSelectedDepartments(
                    value?.map((item) => item.value) || []
                  );
                }}
                onParticipantChange={(value) => {
                  setSelectedUsers(value?.map((item) => item.value) || []);
                }} // Capture selected users
                selectedUsers={selectedUsers}
                onManagerChange={(value) => {
                  setSelectedManagers(value?.map((item) => item.value) || []);
                }} // Capture selected managers
                selectedManagers={selectedManagers}
                onManagerReporteesChange={setSelectedManagerReportees}
                onDemographicFilterChange={setSelectedDemographicFilters}
                onBenchmarkChange={setSelectedBenchmarkList}
                isQuickCompare
                selectedBenchmarkList={selectedBenchmarkList}
                onQuickCompareBaseChange={setQuickCompareBase}
                selectedDepartments={selectedDepartments}
                selectedManagerReportees={selectedManagerReportees}
                selectedDemographicFilters={selectedDemographicFilters}
              />
              <Col xs={12} className="align-self-end mt-3">
                <Form.Group className="form-group d-flex gap-2 justify-content-end flex-wrap">
                  <Button
                    variant="secondary"
                    className="ripple-effect gap-2"
                    onClick={handleClearLocal}
                  >
                    <em className="icon-clear" />
                    <span>Clear</span>
                  </Button>
                  <Button
                    variant="warning"
                    className="ripple-effect gap-2 flex-shrink-0"
                    onClick={() => setShowSaveCompareSubset(true)}
                  >
                    <em className="icon-bookmark-check" />
                    <span>Save Compare Chart Subset</span>
                  </Button>
                  <Button
                    variant="primary"
                    className="ripple-effect gap-2"
                    onClick={handleRun}
                  >
                    {viewLoader ? (
                      <Spinner animation="border" size="sm" className="me-2" />
                    ) : (
                      <em className="icon-run" />
                    )}
                    <span>Run</span>
                  </Button>
                </Form.Group>
              </Col>
            </Row>
          </div>
        </Form>
      </Collapse>
      <Collapse in={outcomesCollapse === "reports"}>
        <Form>
          <Form>
            <ReportOptions
              setReportName={setReportName}
              setOpeningComment={setOpeningComment}
              setClosingComment={setClosingComment}
              reportName={reportName}
              openingComment={openingComment}
              closingComment={closingComment}
              handleSaveReport={handleSaveReport}
              handlePreviewReport={handlePreviewReport}
              activeTab={activeTab} // Add this prop
            />
          </Form>
        </Form>
      </Collapse>
      {/* view All questins modal */}
      <ModalComponent
        modalHeader="Questions by Outcomes"
        extraBodyClassName="modalBody"
        size="xl"
        show={questions}
        onHandleCancel={questionsClose}
      >
        <h4 className="h6 mb-3 fw-semibold">Demographics</h4>
        {/* {JSON.stringify(outcomes)} */}
        <ReactDataTable
  columns={demographicsColumns}
  data={transformedOutcomesData.slice(
    (page - 1) * sizePerPage,
    page * sizePerPage
  )}
  page={page}
  sizePerPage={sizePerPage}
  totalLength={transformedOutcomesData.length}
  totalPages={Math.ceil(transformedOutcomesData.length / sizePerPage)}
  handleLimitChange={handleLimitChange}
  handleOffsetChange={handleOffsetChange}
  sortState={{}} // if needed
  handleSort={() => {}} // if needed
  isLoading={false}
/>

      </ModalComponent>

      {showAddBenchmark && (
        <BenchmarkModal
          show={showAddBenchmark}
          onClose={addBenchmarkClose}
          benchmarkName={benchmarkName}
          setBenchmarkName={setBenchmarkName}
          saveBenchmarkListData={saveBenchmarkListData}
          handleBenchmarkValueChange={handleBenchmarkValueChange}
          handleSaveBenchmark={handleSaveBenchmark}
          selectedDepartments={selectedDepartments}
          selectedUsers={selectedUsers}
          selectedManagers={selectedManagers}
          selectedManagerReportees={selectedManagerReportees}
          selectedDemographicFilters={selectedDemographicFilters}
          fetchSaveBenchMark={fetchSaveBenchMark}
          selectedCompanyId={selectedCompanyId}
          selectedSurveyId={selectedSurveyId}
          benchmarklist={benchmarklist}
          isCreateNew={isCreateNew}
          setIsCreateNew={setIsCreateNew}
          selectedBenchmarkId={selectedBenchmarkId}
          setSelectedBenchmarkId={setSelectedBenchmarkId}
        />
      )}

      {/* Add Save Filter Subset Modal */}
      <ModalComponent
        modalHeader="Save Filter Subset"
        size="sm"
        show={showSaveFilterSubset}
        onHandleCancel={() => setShowSaveFilterSubset(false)}
      >
        <Form>
          <Form.Group className="form-group mb-3">
            <Form.Label>Filter Subset Name</Form.Label>
            <InputField
              type="text"
              placeholder="Enter filter subset name"
              value={filterSubsetName}
              onChange={(e) => setFilterSubsetName(e.target.value)}
            />
          </Form.Group>
          <div className="form-btn d-flex justify-content-end gap-2">
            <Button
              variant="secondary"
              className="ripple-effect"
              onClick={() => setShowSaveFilterSubset(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="ripple-effect"
              onClick={handleSaveFilterSubset}
            >
              Save
            </Button>
          </div>
        </Form>
      </ModalComponent>
      {/* Save Compare Chart Subset Modal for Compare */}
      <ModalComponent
        modalHeader="Save Compare Chart Subset"
        size="sm"
        show={showSaveCompareSubset}
        onHandleCancel={() => setShowSaveCompareSubset(false)}
      >
        <Form>
          <Form.Group className="form-group mb-3">
            <Form.Label>Compare Chart Subset Name</Form.Label>
            <InputField
              type="text"
              placeholder="Enter compare chart subset name"
              value={compareSubsetName}
              onChange={(e) => setCompareSubsetName(e.target.value)}
            />
          </Form.Group>
          <div className="form-btn d-flex justify-content-end gap-2">
            <Button
              variant="secondary"
              className="ripple-effect"
              onClick={() => setShowSaveCompareSubset(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="ripple-effect"
              onClick={handleSaveCompareSubset}
            >
              Save
            </Button>
          </div>
        </Form>
      </ModalComponent>
    </>
  );
}

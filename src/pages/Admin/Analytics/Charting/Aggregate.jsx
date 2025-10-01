import React, { useState, useEffect } from "react";
import { Col, Collapse, Form, OverlayTrigger, Row, Spinner, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  Button,
  InputField,
  ModalComponent,
  ReactDataTable,
  SelectField,
  SelectWithActions,
} from "../../../../components";
import ReportOptions from "./CollapseFilterOptions/ReportOptions";
import ChartOptions from "./CollapseFilterOptions/ChartOptions";
import CommonSelectField from "./CollapseFilterOptions/CommonSelectField";
import BenchmarkModal from "./BenchmarkModal";
import DownloadButtonGroup from "./DownloadButtonGroup";
import { useDispatch } from "react-redux";
import { getAssessmentCharting, updateAssessmentCharting } from "../../../../redux/AssesmentCharting/index.slice";
import { useSelector } from "react-redux";
import IconDropdown from "./Icondrop";

// Create a reusable component for the download button group

// Update the component props to include chartViewType and onCollapseChange
export default function Aggregate({
  departmentOptions,
  managerOptions,
  benchmarkByID,
  participantOptions,
  demographicsQuestionListOptions,
  score,
  chartTypeOptions,
  legendOptions,
  dataLabelOptions,
  fontSizeOptions,
  filterSubsetOptions,
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
  saveBenchmarkdata,
  saveFilterSubset, // Add this prop
  outcomes,
  saveBenchmarkListData,
  benchmarklist,
  selectedCompanyId, // Add selectedCompanyId
  selectedSurveyId, // Add selectedSurveyId
  fetchSaveBenchMark, // Add fetchSaveBenchMark as a prop
  handleView,
  viewLoader,
  selectedDepartments,
  selectedUsers,
  selectedManagers,
  selectedBenchmarkList,
  setSelectedBenchmarkList,
  selectedManagerReportees,
  selectedDemographicFilters,
  setSelectedDepartments,
  setSelectedUsers,
  setSelectedManagers,
  setSelectedManagerReportees,
  setSelectedDemographicFilters,
  onCompareTabOpen, // <-- add this prop
  onFilterTabOpen,
  fetchSubsetListData, // <-- Add this prop
  getfiltersubset,
  handleClearFilters, // Add handleClearFilters
  resetQuickCompareStates, // Add this new prop
  handleDownloadPNG,
  handleDownloadSVG,
  handleDownloadCSV,
  setReportName,
  setOpeningComment,
  setClosingComment,
  reportName,
  openingComment,
  closingComment,
  handleSaveReport,
  handleOrder,
  handleSaveSummaryChartReport,
  handleSaveDetailChartReport,
  activeTab, // Add this prop
  activeCollapse,
  chartViewType,
  onCollapseChange,
  handlePreviewReport,
  handleDetailsPreviewReport,
  handleSummaryPreviewReport,
  handlePaletteColorChange
}) {
  // collapse
  const [aggregateCollapse, setAggregateCollapse] = useState(activeCollapse);
  // const { switchAxis } = useSelector(getAssessmentCharting) || {};

  // Update toggleCollapse to handle undefined/null values
  const toggleCollapse = (collapseId) => {
    const newCollapseState =
      aggregateCollapse === collapseId ? null : collapseId;
    setAggregateCollapse(newCollapseState);
    if (typeof onCollapseChange === "function") {
      onCollapseChange(newCollapseState);
    }
  };

  // Update effect to handle undefined/null values
  useEffect(() => {
    if (activeCollapse !== undefined) {
      setAggregateCollapse(activeCollapse);
    }
  }, [activeCollapse]);

  // useEffect(()=>{
  //   if(runType=='filter'){
  //     toggleCollapse()
  //   }
  // },[runType])

  // create dataset modal
  const [questions, setQuestions] = useState(false);
  const questionsClose = () => setQuestions(false);
  const questionsShow = () => setQuestions(true);

  // data table
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

  const [showAddBenchmark, setShowAddBenchmark] = useState(false);
  const addBenchmarkClose = () =>{ setShowAddBenchmark(false); setBenchmarkName(""); setIsCreateNew(true)};
  const addBenchmarkShow = () => setShowAddBenchmark(true);

  // Transform outcomes data for the ReactDataTable
  const transformedOutcomesData = outcomes?.flatMap((outcome, index) => {
    if (!outcome || !outcome.questions) return [];
    return outcome.questions.map((question, questionIndex) => ({
      number: `${index + 1}.${questionIndex + 1}`, // Serial number
      questions: question?.question || 'No questions available', // Question text with fallback
    }));
  }) || []; // Provide empty array as fallback if outcomes is undefined

  const [benchmarkName, setBenchmarkName] = useState("");
  const [modifiedBenchmarkData, setModifiedBenchmarkData] = useState(null);
  const [isCreateNew, setIsCreateNew] = useState(true); // Add this state
  const [selectedBenchmarkId, setSelectedBenchmarkId] = useState(null); // Add this state
  const [quickCompareBase, setQuickCompareBase] = useState(null);

  // Add state for compare subset modal
  const [showSaveCompareSubset, setShowSaveCompareSubset] = useState(false);
  const [compareSubsetName, setCompareSubsetName] = useState("");
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10); // default page size
  const handleLimitChange = (newLimit) => {
    setSizePerPage(parseInt(newLimit));
    setPage(1); // reset to first page on limit change
  };
  
  const handleOffsetChange = (newPage) => {
    setPage(newPage);
  };
    
  // State for download dropdown in Aggregate

  // Add this function to handle input changes
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
      !isCreateNew ? selectedBenchmarkId : null // Pass benchmarkID when updating
    );
    addBenchmarkClose();
  };

  // Save Filter Subset for aggregate (FCSS)
  const handleSaveFilterSubset = () => {
    const dataFilters = {
      departments: selectedDepartments || [],
      users: selectedUsers || [],
      managers: selectedManagers || [],
      managerReportees: selectedManagerReportees || "D",
      benchmarks: selectedBenchmarkList || [],

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

    // eslint-disable-next-line no-use-before-define
    if (filterSubsetName && selectedCompanyId && selectedSurveyId) {
      // eslint-disable-next-line no-use-before-define
      saveFilterSubset(filterSubsetName, dataFilters, "FCSS")
        .then(() => {
          // eslint-disable-next-line no-use-before-define
          setShowSaveFilterSubset(false);
          // eslint-disable-next-line no-use-before-define
          setFilterSubsetName("");
        })
        .catch((error) => {
          console.error("Failed to save filter subset:", error);
        });
    }
  };

  // Save Compare Chart Subset (CCSS)
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

  const [showSaveFilterSubset, setShowSaveFilterSubset] = useState(false);
  const [filterSubsetName, setFilterSubsetName] = useState("");

  const [runType, setRunType] = useState("filter"); 
  const reduxruntype = useSelector(getAssessmentCharting)?.isCompareTab
  const reduxquickcompate = useSelector(getAssessmentCharting)?.isQuickCompare
  const nagitiveValue = useSelector(getAssessmentCharting)?.negativeValue


  useEffect(()=>{
    setQuickCompareBase(reduxquickcompate)
  },[reduxquickcompate])

  useEffect(()=>{
setRunType(reduxruntype?"compare":'filter')
  },[reduxruntype])
  const dispatch= useDispatch()

  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log('runti')
      handleRun2();
    }, 50); // Delay to batch rapid changes
  
    return () => clearTimeout(timeout);
  }, [runType,quickCompareBase,
    // nagitiveValue
  ]);

  const handleRun2 = () => {
    const isCompareTab = reduxruntype
    setRunType(isCompareTab ? "compare" : "filter");
    dispatch(updateAssessmentCharting({ isCompareTab }));

    const isQuickCompare = isCompareTab && quickCompareBase !== null;
    const isComposite = isCompareTab && quickCompareBase === null;

    // Reset quick compare states when not in quick compare mode
    if (!isQuickCompare && typeof resetQuickCompareStates === "function") {
      resetQuickCompareStates();
    }

    // Transform demographicFilters to match API expectations
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
      isAggregate: !isCompareTab,
      isQuickCompare,
      isComposite,
      quickCompareBase, // This will be null when no checkbox is selected
    };
    handleView(dataFilters);
  };

  const handleRun = () => {
    const isCompareTab = aggregateCollapse === "quickCompare";
    setRunType(isCompareTab ? "compare" : "filter");
    dispatch(updateAssessmentCharting({ isCompareTab }));

    const isQuickCompare = isCompareTab && quickCompareBase !== null;
    const isComposite = isCompareTab && quickCompareBase === null;

    // Reset quick compare states when not in quick compare mode
    if (!isQuickCompare && typeof resetQuickCompareStates === "function") {
      resetQuickCompareStates();
    }

    // Transform demographicFilters to match API expectations
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
      isAggregate: !isCompareTab,
      isQuickCompare,
      isComposite,
      quickCompareBase, // This will be null when no checkbox is selected
    };
    handleView(dataFilters);
  };

  // Trigger parent callback when compare tab is opened
  React.useEffect(() => {
    if (
      aggregateCollapse === "quickCompare" &&
      typeof onCompareTabOpen === "function"
    ) {
      onCompareTabOpen();
    }
    else{
      onFilterTabOpen()
    }
    // Only run when tab changes
  }, [aggregateCollapse]);

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

  // Update handleClearFilters to include benchmark clearing
  const handleClearLocal = () => {
    handleClearFilters(); // Call parent clear function
    setSelectedFilterSubset(null); // Clear selected filter subset
  };

  return (
    <>
      <div className="d-flex align-items-center justify-content-between flex-wrap mb-4 gap-2">
        <ul className="collapseList list-inline d-flex align-items-center gap-2 mb-0 pb-lg-0 pb-1 collapseBtn">
        <li>
    <Link
      href="#!"
      aria-controls="aggregateFilter"
      onClick={() => toggleCollapse("aggregateFilter")}
      aria-expanded={aggregateCollapse === "aggregateFilter"}
      className={`btn btn-light gap-2 collapseArrow ${runType === "filter" ? "active" : ""}`}

    >
      <span>Filter</span>
      <em className="icon icon-drop-down" />
    </Link>
  </li>
  <li>
    <Link
      href="#!"
      aria-controls="quickCompare"
      onClick={() => toggleCollapse("quickCompare")}
      aria-expanded={aggregateCollapse === "quickCompare"}
      className={`btn btn-light gap-2 collapseArrow ${runType === "compare" ? "active" : ""}`}

    >
      <span>Compare</span>
      <em className="icon icon-drop-down" />
    </Link>
  </li>
          {/* Remove composite tab */}
       
        </ul>
        <ul className="list-inline d-flex align-items-center filter_action mb-0 flex-wrap collapseBtn">
          <li>
            <Link
              href="#!"
              aria-controls="chartOptions"
              onClick={() => toggleCollapse("chartOptions")}
              aria-expanded={aggregateCollapse === "chartOptions"}
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
              onClick={() => toggleCollapse("reports")}
              aria-expanded={aggregateCollapse === "reports"}
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
              // onDownloadCSV={handleDownloadCSV}
            />
          </li>
          {runType=="filter"&&<li className="tooltip-container" data-title="Change Order">
            {/* <OverlayTrigger
  placement="top"
  overlay={<Tooltip id="sort-tooltip">Change Order</Tooltip>}
> */}
  <Link
    href="#!"
    className="btn-icon ripple-effect"
    onClick={handleOrder}
  >
    <em className="icon-exchange" />
  </Link>
{/* </OverlayTrigger> */}
          </li>}
        </ul>
      </div>

      <Collapse in={aggregateCollapse === "chartOptions"}>
        <div>
          <ChartOptions
            score={score}
            // onColorChange={handleChartColorChange}
            handleChartTypeChange={handleChartTypeChange}
            chartTypeOptions={chartTypeOptions}
            onColorChange={handlePaletteColorChange}
            legendOptions={legendOptions}
            dataLabelOptions={dataLabelOptions}
            fontSizeOptions={fontSizeOptions}
            chartType={chartType}
            // switchAxis={switchAxis}
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
        </div>
      </Collapse>
      <Collapse in={aggregateCollapse === "aggregateFilter"}>
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
                setSelectedBenchmarkId={setSelectedBenchmarkId}

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
                selectedBenchmarkList={selectedBenchmarkList}
                selectedDepartments={selectedDepartments}
                selectedManagerReportees={selectedManagerReportees}
                selectedDemographicFilters={selectedDemographicFilters} // Capture demographic filters
                // Capture demographic filters
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
      <Collapse in={aggregateCollapse === "quickCompare"}>
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
                }} // Capture selected departments
                onParticipantChange={(value) => {
                  setSelectedUsers(value?.map((item) => item.value) || []);
                }} // Capture selected users
                selectedUsers={selectedUsers}
                onManagerChange={(value) => {
                  setSelectedManagers(value?.map((item) => item.value) || []);
                }} // Capture selected managers
                selectedManagers={selectedManagers} // Capture selected managers
                setSelectedBenchmarkId={setSelectedBenchmarkId}
                setSelectedBenchmarkList={setSelectedBenchmarkList}
                onManagerReporteesChange={setSelectedManagerReportees} // Capture manager reportees
                onDemographicFilterChange={setSelectedDemographicFilters} // Capture demographic filters
                onBenchmarkChange={setSelectedBenchmarkList}
                
                onQuickCompareBaseChange={setQuickCompareBase}
                isQuickCompare={aggregateCollapse === "quickCompare"}
                selectedDepartments={selectedDepartments}
                selectedManagerReportees={selectedManagerReportees}
                selectedBenchmarkList={selectedBenchmarkList}
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
      {/* Remove the composite Collapse section */}
      <Collapse in={aggregateCollapse === "reports"}>
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
            handleSaveSummaryChartReport={handleSaveSummaryChartReport}
            handleSaveDetailChartReport={handleSaveDetailChartReport}
            handleDetailsPreviewReport={handleDetailsPreviewReport}
            handleSummaryPreviewReport={handleSummaryPreviewReport}
            activeTab={activeTab} // Add this prop
            chartViewType={runType} // Add this prop
            isQuickCompare={quickCompareBase !== null} // Add this prop
          />
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

      {/* Save Filter Subset Modal for Aggregate */}
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
          benchmarkByID={benchmarkByID}
          isCreateNew={isCreateNew} // Pass isCreateNew
          setIsCreateNew={setIsCreateNew} // Pass setIsCreateNew
          selectedBenchmarkId={selectedBenchmarkId} // Add this prop
          setSelectedBenchmarkId={setSelectedBenchmarkId} // Add this prop
        />
      )}
    </>
  );
}

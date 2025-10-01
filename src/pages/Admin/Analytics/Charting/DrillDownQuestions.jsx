import React, { useState } from "react";
import { Col, Collapse, Form, Row, Spinner } from "react-bootstrap";
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
import { savedOptions } from "./CollapseFilterOptions/CommonSelectFieldOptions";
import CollapseAge from "../DemographicTrendAnalysis/CollapseAge/index.page";
import DownloadButtonGroup from "./DownloadButtonGroup";
import IconDropdown from "./Icondrop";

export default function DrillDownQuestions({
  departmentOptions,
  managerOptions,
  participantOptions,
  demographicsQuestionListOptions,
  score,
  chartTypeOptions,
  legendOptions,
  dataLabelOptions,
  fontSizeOptions,
  handleView,
  viewLoader,
  selectedDepartments,
  selectedUsers,
  selectedManagers,
  selectedManagerReportees,
  onOutcomeChange,
  onIntentionChange,
  selectedDemographicFilters,
  setSelectedDepartments,
  outcomes,
  setSelectedUsers,
  setSelectedManagers,
  setSelectedManagerReportees,
  setSelectedDemographicFilters,
  benchmarklist,
  selectedBenchmarkList,
  setSelectedBenchmarkList,
  outcomeOptions,
  intentionsOptions,
  questionOptions,
  saveFilterSubset,
  filterSubsetOptions,
  selectedCompanyId, // Add selectedCompanyId
  selectedSurveyId,
  fetchSubsetListData, // <-- Add this prop
  getfiltersubset, // <-- Add this prop
  handleClearFilters,
  DrillDownQuestionsData,
  scalarConfiguration,
  colorsChart,
  renderChart,
  handleChartTypeChangeChild,
  handleLegendPositionChange,
  handleLablePosistionChange,
  handleFontSizeChange,
  handleSwitchAxisChange,
  handleLabelColorChange,
  handleOpacityChange,
  handleChartColorChangeChild,
  handleDrilldownChartTypeChange,
  handleDrilldownLegendPositionChange,
  handleDrilldownLabelPositionChange,
  handleDrilldownFontSizeChange,
  handleDrilldownLabelColorChange,
  handleDrilldownOpacityChange,
  handleDrilldownChartColorChange,
  drilldownSelectedColorPallet,
  handleDownloadSVG,

  drilldownColors,
  drilldownChartType,
  drilldownLegendPosition,
  drilldownLabelPosition,
  drilldownFontSize,
  drilldownLabelColorState,
  drilldownAnnotationOpacity,
  handleDrilldownApplyAll,
  handleDrilldownSwitchAxisChange,
  drilldownswitchAxis,
  renderScalar,
  drillDownChartRef,
  handleDownloadPNG,
  handleOrder,
  sortOrder,
  setReportName,
  setOpeningComment,
  setClosingComment,
  reportName,
  openingComment,
  closingComment,
  handleDDSaveReport,
  activeTab, // Add this prop
  handleDDPreviewReport
}) {
  // collapse
  const [infoCollapse, setInfoCollapse] = useState(null);
  const infoToggleCollapse = (collapseId) => {
    setInfoCollapse(infoCollapse === collapseId ? null : collapseId);
  };

  console.log('drill',drilldownSelectedColorPallet)

  // view All questins modal
  const [questions, setQuestions] = useState(false);
  const questionsClose = () => setQuestions(false);
  const questionsShow = () => setQuestions(true);

  const [colorCollpaseShow, setcolorCollpaseShow] = useState({
    mainColorCollapse: false,
    ageColorCollapse: false,
  });

  const toggleCollapse = (collapseKey) => {
    setcolorCollpaseShow((prevState) => ({
      ...prevState,
      [collapseKey]: !prevState[collapseKey],
    }));
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
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10); // default page size
  const handleLimitChange = (newLimit) => {
    setSizePerPage(parseInt(newLimit));
    setPage(1); // reset to first page on limit change
  };
  
  const handleOffsetChange = (newPage) => {
    setPage(newPage);
  };
  // flatten outcomes/questions for modal table (match Aggregate)
  const transformedOutcomesData =
    outcomes?.flatMap((outcome, index) =>
      outcome.questions?.map((question, questionIndex) => ({
        number: `${index + 1}.${questionIndex + 1}`,
        questions: question.question,
      }))
    ) || [];
    const [runType, setRunType] = useState("filter"); 

  const [selectedQuestions, setSelectedQuestions] = useState([]);

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
  React.useEffect(() => {
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

  const handleRun = () => {
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
      questions: selectedQuestions?.map((question) => question.value) || [],
      benchmarks:
        selectedBenchmarkList?.length > 0
          ? selectedBenchmarkList.map((item) => item.value)
          : [], // Add selected benchmark
      references: [],
      isDrillDown: true, // Add this flag
    };
    handleView(dataFilters);
  };

  const [showSaveFilterSubset, setShowSaveFilterSubset] = useState(false);
  const [filterSubsetName, setFilterSubsetName] = useState("");

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

    // eslint-disable-next-line no-use-before-define
    if (filterSubsetName && selectedCompanyId && selectedSurveyId) {
      // eslint-disable-next-line no-use-before-define
      saveFilterSubset(filterSubsetName, dataFilters, "DDSS")
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

  // Add state for selections and handlers (copied/adapted from RatingQuestions)
  const [selectedOutcomes, setSelectedOutcomes] = useState([]);
  const [selectedIntentions, setSelectedIntentions] = useState([]);

  // Only preselect on first mount, not after clearing
  React.useEffect(() => {
    if (Array.isArray(outcomeOptions) && outcomeOptions.length > 0) {
      setSelectedOutcomes(outcomeOptions);
      onOutcomeChange?.(outcomeOptions);
    }
  }, [outcomeOptions]);

  // Preselect all intentions on mount or when intentionsOptions changes
  React.useEffect(() => {
    if (Array.isArray(intentionsOptions) && intentionsOptions.length > 0) {
      setSelectedIntentions(intentionsOptions);
      onIntentionChange?.(intentionsOptions);
    }
  }, [intentionsOptions]);

  // Preselect all question on mount or when questionOptions changes

  React.useEffect(() => {
    // Only set questions if there are selected outcomes and intentions
    if (
      Array.isArray(questionOptions) &&
      questionOptions.length > 0 &&
      selectedOutcomes?.length > 0 &&
      selectedIntentions?.length > 0
    ) {
      setSelectedQuestions(questionOptions);
    } else {
      // Clear questions if outcomes or intentions are not selected
      setSelectedQuestions([]);
    }
  }, [questionOptions, selectedOutcomes, selectedIntentions]);

  const handleOutcomeChange = (options) => {
    setSelectedOutcomes(options);
    onOutcomeChange?.(options);
    // If outcomes are cleared, clear all selections
    if (!options || options.length === 0) {
      setSelectedIntentions([]);
      setSelectedQuestions([]);
      onIntentionChange?.([]);
    }
  };

  // Intention change handler with dependency logic
  const handleIntentionChange = (options) => {
    setSelectedIntentions(options);
    onIntentionChange?.(options);
    // If intentions are cleared, clear questions as well
    if (!options || options.length === 0) {
      setSelectedQuestions([]);
    }
  };

  // Select All/Clear All handlers for Outcomes
  const handleSelectAllOutcomes = (e) => {
    e.preventDefault();
    setSelectedOutcomes(outcomeOptions);
    onOutcomeChange?.(outcomeOptions);
    // When selecting all outcomes, do not clear intentions/questions
  };
  const handleClearAllOutcomes = (e) => {
    e.preventDefault();
    setSelectedOutcomes([]);
    setSelectedIntentions([]);
    setSelectedQuestions([]);
    onOutcomeChange?.([]);
    onIntentionChange?.([]);
  };

  // Select All/Clear All handlers for Intentions
  const handleSelectAllIntentions = (e) => {
    e.preventDefault();
    setSelectedIntentions(intentionsOptions);
    onIntentionChange?.(intentionsOptions);
    // When selecting all intentions, do not clear questions
  };
  const handleClearAllIntentions = (e) => {
    e.preventDefault();
    setSelectedIntentions([]);
    setSelectedQuestions([]);
    onIntentionChange?.([]);
  };

  // Select All/Clear All handlers for Questions
  const handleSelectAllQuestion = (e) => {
    e.preventDefault();
    setSelectedQuestions(questionOptions);
    // No dependency clearing needed
  };
  const handleClearAllQuestion = (e) => {
    e.preventDefault();
    setSelectedQuestions([]);
    // No dependency clearing needed
  };

  const handleQuestionChange = (options) => {
    setSelectedQuestions(options);
  };

  // Add clear handler
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
            onChange={handleOutcomeChange}
            value={selectedOutcomes}
            handleSelectAll={handleSelectAllOutcomes}
            handleClearAll={handleClearAllOutcomes}
          />
        </Col>
        <Col lg={4} sm={6}>
          <SelectWithActions
            label="Intention Selection"
            placeholder="Select Intention"
            options={intentionsOptions}
            isMulti
            onChange={handleIntentionChange}
            value={selectedIntentions}
            handleSelectAll={handleSelectAllIntentions}
            handleClearAll={handleClearAllIntentions}
          />
        </Col>
        <Col lg={4} sm={6}>
          <SelectWithActions
            label="Questions"
            placeholder="Select Questions"
            options={questionOptions}
            isMulti
            onChange={handleQuestionChange}
            value={selectedQuestions}
            handleSelectAll={handleSelectAllQuestion}
            handleClearAll={handleClearAllQuestion}
          />
        </Col>
      </Row>
      <div className="d-flex align-items-center justify-content-between flex-wrap mb-4 gap-2">
        <ul className="collapseList list-inline d-flex align-items-center gap-2 mb-0 pb-lg-0 pb-1 collapseBtn">
          <li>
            <Link
              href="#!"
              aria-controls="aggregateFilter"
              onClick={() => infoToggleCollapse("aggregateFilter")}
              aria-expanded={infoCollapse === "aggregateFilter"}
              className={`btn btn-light gap-2 collapseArrow ${runType === "filter" ? "active" : ""}`}
            >
              <span>Filter</span>
              <em className="icon icon-drop-down" />
            </Link>
          </li>
         
        </ul>
        <ul className="list-inline d-flex align-items-center filter_action mb-0 flex-wrap collapseBtn">
          <li>
            <Link
              href="#!"
              aria-controls="chartOptions"
              onClick={() => infoToggleCollapse("chartOptions")}
              aria-expanded={infoCollapse === "chartOptions"}
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
              {" "}
              Questions
            </Link>
          </li>
          <li>
            <Link
              href="#!"
              aria-controls="reports"
              onClick={() => infoToggleCollapse("reports")}
              aria-expanded={infoCollapse === "reports"}
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
          {/* <li>
            <Link
              href="#!"
              className=" btn-icon ripple-effect"
              onClick={handleOrder}
            >
              <em className="icon-exchange" />
            </Link>
          </li> */}
        </ul>
      </div>
      <Collapse in={infoCollapse === "chartOptions"}>
        <Form>
          <ChartOptions
            score={score}
            onColorChange={handleDrilldownChartColorChange}
            handleChartTypeChange={handleDrilldownChartTypeChange}
            chartTypeOptions={chartTypeOptions}
            legendOptions={legendOptions}
            dataLabelOptions={dataLabelOptions}
            fontSizeOptions={fontSizeOptions}
            chartType={drilldownChartType}
            handleLegendPosistionChange={handleDrilldownLegendPositionChange}
            legendPosition={drilldownLegendPosition}
            handleLablePosistionChange={handleDrilldownLabelPositionChange}
            labelPosition={drilldownLabelPosition}
            handleFontSizeChange={handleDrilldownFontSizeChange}
            fontSize={drilldownFontSize}
            handleSwitchAxisChange={handleDrilldownSwitchAxisChange}
            switchAxis={drilldownswitchAxis}
            handleLabelColorChange={handleDrilldownLabelColorChange}
            labelColorState={drilldownLabelColorState}
            handleOpacityChange={handleDrilldownOpacityChange}
            annotationOpacity={drilldownAnnotationOpacity}
            showApllyAll
            handleApplyAll={handleDrilldownApplyAll}
            selectedColorPallet={drilldownSelectedColorPallet}
            switchAxixButtonShow={true}
            drilldownColors={drilldownColors}
          />
        </Form>
      </Collapse>
      <Collapse in={infoCollapse === "aggregateFilter"}>
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
                selectedBenchmarkList={selectedBenchmarkList} // Add this prop
                selectedDepartments={selectedDepartments}
                selectedManagerReportees={selectedManagerReportees}
                selectedDemographicFilters={selectedDemographicFilters}
              />
              <Col xxl={3} lg={4} sm={6}>
                <Form.Group className="form-group">
                  <Form.Label>Saved Filtered Subsets</Form.Label>
                  <SelectField
                    placeholder="Select Saved Filtered Subsets"
                    options={savedOptions}
                  />
                </Form.Group>
              </Col>
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
      <Collapse in={infoCollapse === "reports"}>
        <Form>
          <ReportOptions
            setReportName={setReportName}
            setOpeningComment={setOpeningComment}
            setClosingComment={setClosingComment}
            reportName={reportName}
            openingComment={openingComment}
            closingComment={closingComment}
            handleDDSaveReport={handleDDSaveReport}
            activeTab={activeTab} // Add this prop
            handleDDPreviewReport={handleDDPreviewReport}
          />
        </Form>
      </Collapse>
      {DrillDownQuestionsData?.length > 0 && (
        <div className="demographicAnalysis_Body" ref={drillDownChartRef}>
          <div>
            <div className="responseBox d-flex">
              <div className="responseBox_left">
                <h3 className="responseBox_title mb-0">Question</h3>
              </div>
              <div className="responseBox_right">
                <div className="d-flex align-items-center justify-content-between">
                  <h3 className="responseBox_title mb-0">Response</h3>
                </div>
              </div>
            </div>
            <CollapseAge
              colorCollpaseShow={colorCollpaseShow.ageColorCollapse}
              toggleCollapse={() => toggleCollapse("ageColorCollapse")}
              score={score}
              chartData={DrillDownQuestionsData} // Pass chartData as a prop
              scalarConfiguration={scalarConfiguration}
              colorsChart={colorsChart}
              renderChart={renderChart}
              showNegative={false}
              chartTypeOptions={chartTypeOptions}
              childAxis={true}
              legendOptions={legendOptions}
              dataLabelOptions={dataLabelOptions}
              fontSizeOptions={fontSizeOptions}
              handleChartTypeChange={handleChartTypeChangeChild}
              handleLegendPositionChange={handleLegendPositionChange}
              handleLablePosistionChange={handleLablePosistionChange}
              handleFontSizeChange={handleFontSizeChange}
              handleSwitchAxisChange={handleSwitchAxisChange}
              handleLabelColorChange={handleLabelColorChange}
              handleOpacityChange={handleOpacityChange}
              handleChartColorChange={handleChartColorChangeChild}
              renderScalar={renderScalar}
              sortOrder={sortOrder}
              // loading={loading}
            />
          </div>
        </div>
      )}
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
    </>
  );
}

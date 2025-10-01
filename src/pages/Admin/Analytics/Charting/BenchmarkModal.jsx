import React, { useEffect, useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { commonService } from "services/common.service";
import { SURVEYS_MANAGEMENT } from "apiEndpoints/SurveysManagement";
import { useAuth } from "customHooks";
import {
  ModalComponent,
  InputField,
  SelectField,
} from "../../../../components"; // adjust import path

const BenchmarkModal = ({
  show,
  onClose,
  benchmarkName,
  setBenchmarkName,
  saveBenchmarkListData,
  handleBenchmarkValueChange,
  handleSaveBenchmark,
  selectedDepartments,
  selectedUsers,
  selectedManagers,
  selectedManagerReportees,
  selectedDemographicFilters,
  selectedCompanyId,
  fetchSaveBenchMark,
  selectedSurveyId,
  benchmarklist,
  isCreateNew,
  setIsCreateNew,
  selectedBenchmarkId,
  setSelectedBenchmarkId
}) => {
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  const [benchmarkByID, setBenchmarkByID] = useState(null);

  useEffect(() => {
    // Always include all keys, with empty arrays as default values
    const dataFilters = {
      departments:
        selectedDepartments?.length > 0
          ? selectedDepartments.map((item) => item.value)
          : [],
      users:
        selectedUsers?.length > 0
          ? selectedUsers.map((item) => item.value)
          : [],
      managers:
        selectedManagers?.length > 0
          ? selectedManagers.map((item) => item.value)
          : [],
      managerReportees: selectedManagerReportees || "D",
      demographicFilters:
        selectedDemographicFilters?.length > 0
          ? selectedDemographicFilters
          : [],
    };
    if (selectedCompanyId && selectedSurveyId) {
      fetchSaveBenchMark(selectedCompanyId, selectedSurveyId, dataFilters);
    } else {
      console.error("Company ID or Survey ID is missing.");
    }
  }, []);

  const fetchBenchMarkByID = async (benchmarkID) => {
    try {
      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT.surveyAssessmentChart,
        queryParams: {
          action: "get_benchmark",
          benchmarkID: parseInt(benchmarkID, 10),
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        setBenchmarkByID(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching benchmark data:", error);
    }
  };

  const handleBenchmarkSelect = (selectedOption) => {
    if (selectedOption?.value) {
      setSelectedBenchmarkId(parseInt(selectedOption.value, 10)); // Convert to integer
      setBenchmarkName(selectedOption.label); // Set benchmark name when selecting existing benchmark
      fetchBenchMarkByID(selectedOption.value);
    }
  };

  useEffect(() => {
    if (selectedBenchmarkId) {
      fetchBenchMarkByID(selectedBenchmarkId);
    }
  }, [selectedBenchmarkId]);

  const findExistingValue = (outcomeId, intentionId = null, questionId = null) => {
    if (!benchmarkByID?.outcomes) return '';
    
    const outcome = benchmarkByID.outcomes.find(o => o.outcome_id === outcomeId);
    if (!outcome) return '';

    if (!intentionId && !questionId) {
      return outcome.value || '';
    }

    const intention = outcome.intentions.find(i => i.intention_id === intentionId);
    if (!intention) return '';

    if (!questionId) {
      return intention.value || '';
    }

    const question = intention.questions.find(q => q.question_id === questionId);
    return question?.value || '';
  };

  return (
    <ModalComponent
      modalHeader={isCreateNew ? "Add Benchmark" : "Update Benchmark"}
      modalExtraClass="benchmarkModal"
      size="xl"
      show={show}
      onHandleCancel={onClose}
    >
      <Row>
        <Col xxl={2} sm={2}>
          <Form.Group className="form-group mb-0">
            <Form.Label className="mb-2">Create New</Form.Label>
            <div className="switchBtn">
              <InputField
                type="checkbox"
                id="CreateNew"
                checked={isCreateNew}
                onChange={(e) => {setIsCreateNew(e.target.checked); setBenchmarkName('')}}
              />
              <Form.Label htmlFor="CreateNew" />
            </div>
          </Form.Group>
        </Col>
        {isCreateNew ? (
          <Col xxl={3} lg={4} sm={6}>
            <Form.Group className="form-group">
              <Form.Label>Benchmark Name</Form.Label>
              <InputField
                type="text"
                placeholder="Enter Benchmark Name"
                value={benchmarkName}
                onChange={(e) => setBenchmarkName(e.target.value)}
              />
            </Form.Group>
          </Col>
        ) : (
          <Col xxl={3} lg={4} sm={6}>
            <Form.Group className="form-group">
              <Form.Label>Select Benchmark</Form.Label>
              <SelectField
                placeholder="Select Save Benchmark"
                options={benchmarklist}
                onChange={handleBenchmarkSelect}
                value={benchmarklist.find(
                  (opt) => opt.value === selectedBenchmarkId
                )}
              />
            </Form.Group>
          </Col>
        )}
      </Row>

      <div className="commonTable">
        <div className="table-responsive datatable-wrap">
          <table className="table">
            <thead>
              <tr>
                <th className="w-200">Outcomes</th>
                {!isCreateNew && <th className="min-w-150">Existing Value</th>}
                <th className="min-w-150">Value</th>
                <th className="w-160">Intentions</th>
                {!isCreateNew && <th className="min-w-150">Existing Value</th>}
                <th className="min-w-150">Value</th>
                <th className="w-500">Questions</th>
                {!isCreateNew && <th className="min-w-150">Existing Value</th>}
                <th className="min-w-150">Value</th>
              </tr>
            </thead>
            <tbody>
              {saveBenchmarkListData?.outcomes?.map((outcome) => {
                const totalRows = outcome.intentions.reduce(
                  (acc, intention) => acc + intention.questions.length,
                  0
                );
                return (
                  <React.Fragment key={outcome.outcome_id}>
                    {outcome.intentions.map((intention, i) => (
                      <React.Fragment key={intention.intention_id}>
                        {intention.questions.map((question, j) => (
                          <tr key={question.question_id}>
                            {i === 0 && j === 0 && (
                              <>
                                <td
                                  className="text-wrap align-top"
                                  rowSpan={totalRows}
                                >
                                  {outcome.outcome_name}
                                </td>
                                {!isCreateNew && (
                                  <td className="align-top" rowSpan={totalRows}>
                                    {findExistingValue(outcome.outcome_id) ? Number(findExistingValue(outcome.outcome_id)).toFixed(2) : ''}
                                  </td>
                                )}
                                <td className="align-top" rowSpan={totalRows}>
                                  <Form.Group className="form-group mb-0">
                                    <InputField
                                      type="number"
                                      min="1"
                                      max="100"
                                      disabled
                                      defaultValue={outcome.value ? Number(outcome.value).toFixed(2) : ''}
                                      onChange={(e) =>
                                        handleBenchmarkValueChange(
                                          outcome.outcome_id,
                                          null,
                                          null,
                                          e.target.value
                                        )
                                      }
                                    />
                                  </Form.Group>
                                </td>
                              </>
                            )}
                            {j === 0 && (
                              <>
                                <td
                                  className="text-wrap align-top"
                                  rowSpan={intention.questions.length}
                                >
                                  {intention.intention_name}
                                </td>
                                {!isCreateNew && (
                                  <td
                                    className="align-top"
                                    rowSpan={intention.questions.length}
                                  >
                                    {findExistingValue(outcome.outcome_id, intention.intention_id) ? Number(findExistingValue(outcome.outcome_id, intention.intention_id)).toFixed(2) : ''}
                                  </td>
                                )}
                                <td
                                  className="align-top"
                                  rowSpan={intention.questions.length}
                                >
                                  <Form.Group className="form-group mb-0">
                                    <InputField
                                      type="number"
                                      min="1"
                                      max="100"
                                      disabled
                                      defaultValue={intention.value ? Number(intention.value).toFixed(2) : ''}
                                      onChange={(e) =>
                                        handleBenchmarkValueChange(
                                          outcome.outcome_id,
                                          intention.intention_id,
                                          null,
                                          e.target.value
                                        )
                                      }
                                    />
                                  </Form.Group>
                                </td>
                              </>
                            )}
                            <td className="text-wrap">{question.question}</td>
                            {!isCreateNew && (
                              <td>
                                {findExistingValue(outcome.outcome_id, intention.intention_id, question.question_id) ? Number(findExistingValue(outcome.outcome_id, intention.intention_id, question.question_id)).toFixed(2) : ''}
                              </td>
                            )}
                            <td>
                              <Form.Group className="form-group mb-0">
                                <InputField
                                  type="number"
                                  min="1"
                                  max="100"
                                  disabled
                                  defaultValue={question.value ? Number(question.value).toFixed(2) : ''}
                                  onChange={(e) =>
                                    handleBenchmarkValueChange(
                                      outcome.outcome_id,
                                      intention.intention_id,
                                      question.question_id,
                                      e.target.value
                                    )
                                  }
                                />
                              </Form.Group>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="form-btn d-flex gap-2 justify-content-end pt-2">
        <Button
          type="button"
          variant="secondary"
          className="ripple-effect"
          onClick={onClose}
        >
          Close
        </Button>
        <Button
          type="button"
          variant="primary"
          className="ripple-effect"
          onClick={handleSaveBenchmark}
        >
          {isCreateNew ? "Add" : "Update"}
        </Button>
      </div>
    </ModalComponent>
  );
};

export default BenchmarkModal;

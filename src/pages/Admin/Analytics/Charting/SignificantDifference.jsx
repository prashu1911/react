import React from 'react'
import { Button, Form } from 'react-bootstrap'
import { commonService } from 'services/common.service'
import { SURVEYS_MANAGEMENT } from 'apiEndpoints/SurveysManagement'

const SignificantDifference = ({
  compositeAggregateData = [],
  compositeOutcomeData = [],
  compositeIntentionData = [],
  userData,
  setViewLoader,
  setSignificantDifference,
  significantDifferenceValue = 90,
  setSignificantDifferenceValue,
  selectedControlGroupIdx = {},
  setSelectedControlGroupIdx,
  significantDifference = [],
  lastSignificanceAction,
  setLastSignificanceAction,
  activeTab = "aggregate"
}) => {
  // Helper to render radio cell
  const renderRadioCell = (rowIdx) => (
    <Form.Group>
      <Form.Check
        inline
        label=""
        name="significantTable"
        type="radio"
        className="mb-0"
        checked={selectedControlGroupIdx === rowIdx}
        onChange={() => setSelectedControlGroupIdx(rowIdx)}
      />
    </Form.Group>
  );

  // Table renderers
  const renderAggregateTable = () => (
    <table className="table table-bordered table-striped">
      <thead>
        <tr>
          <th>Control Group</th>
          <th>Dataset Name</th>
          <th>Dataset Type</th>
          <th>Aggregate</th>
        </tr>
      </thead>
      <tbody>
        {compositeAggregateData.map((row, idx) => (
          <tr key={row.info_id || idx}>
            <td>{renderRadioCell(idx)}</td>
            <td>{row.info_name}</td>
            <td>{row.data_type}</td>
            <td>{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderOutcomeTable = () => (
    <table className="table table-bordered table-striped">
      <thead>
        <tr>
          <th>Control Group</th>
          <th>Dataset Name</th>
          <th>Dataset Type</th>
          <th>Outcome Name</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {compositeOutcomeData.map((row, idx) =>
          row.outcomes && row.outcomes.length > 0
            ? row.outcomes.map((outcome, oidx) => (
                <tr key={`${row.info_id}-${outcome.outcome_id}`}>
                  {oidx === 0 && (
                    <td rowSpan={row.outcomes.length}>{renderRadioCell(idx)}</td>
                  )}
                  {oidx === 0 && (
                    <td rowSpan={row.outcomes.length}>{row.info_name}</td>
                  )}
                  {oidx === 0 && (
                    <td rowSpan={row.outcomes.length}>{row.data_type}</td>
                  )}
                  <td>{outcome.outcome_name}</td>
                  <td>{outcome.value}</td>
                </tr>
              ))
            : (
                <tr key={row.info_id || idx}>
                  <td>{renderRadioCell(idx)}</td>
                  <td>{row.info_name}</td>
                  <td>{row.data_type}</td>
                  <td colSpan={2}>No outcomes</td>
                </tr>
              )
        )}
      </tbody>
    </table>
  );

  const renderIntentionTable = () => (
    <table className="table table-bordered table-striped">
      <thead>
        <tr>
          <th>Control Group</th>
          <th>Dataset Name</th>
          <th>Dataset Type</th>
          <th>Intention Name</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {compositeIntentionData.map((row, idx) =>
          row.intentions && row.intentions.length > 0
            ? row.intentions.map((intention, iidx) => (
                <tr key={`${row.info_id}-${intention.intention_id}`}>
                  {iidx === 0 && (
                    <td rowSpan={row.intentions.length}>{renderRadioCell(idx)}</td>
                  )}
                  {iidx === 0 && (
                    <td rowSpan={row.intentions.length}>{row.info_name}</td>
                  )}
                  {iidx === 0 && (
                    <td rowSpan={row.intentions.length}>{row.data_type}</td>
                  )}
                  <td>{intention.intention_name}</td>
                  <td>{intention.value}</td>
                </tr>
              ))
            : (
                <tr key={row.info_id || idx}>
                  <td>{renderRadioCell(idx)}</td>
                  <td>{row.info_name}</td>
                  <td>{row.data_type}</td>
                  <td colSpan={2}>No intentions</td>
                </tr>
              )
        )}
      </tbody>
    </table>
  );

  // Result table renderers based on last action
  const renderAggregateResultTable = () => (
    <table className="table table-bordered table-striped">
      <thead>
        <tr>
          <th>Dataset Name</th>
          <th>Dataset Type</th>
          <th>Aggregate</th>
          <th>P Value</th>
          <th>F Value</th>
          <th>Rejection</th>
        </tr>
      </thead>
      <tbody>
        {significantDifference.map((row, idx) => (
          <tr key={row.info_id || idx}>
            <td>{row.info_name}</td>
            <td>{row.data_type}</td>
            <td>{row.value}</td>
            <td>{row.p_value}</td>
            <td>{row.f_value}</td>
            <td>{row.rejection}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderOutcomeResultTable = () => (
    <table className="table table-bordered table-striped">
      <thead>
        <tr>
          <th>Dataset Name</th>
          <th>Dataset Type</th>
          <th>Outcome Name</th>
          <th>Value</th>
          <th>P Value</th>
          <th>F Value</th>
          <th>Rejection</th>
        </tr>
      </thead>
      <tbody>
        {significantDifference.map((row, idx) =>
          row.outcomes && row.outcomes.length > 0
            ? row.outcomes.map((outcome, oidx) => (
                <tr key={`${row.info_id}-${outcome.outcome_id}`}>
                  {oidx === 0 && (
                    <td rowSpan={row.outcomes.length}>{row.info_name}</td>
                  )}
                  {oidx === 0 && (
                    <td rowSpan={row.outcomes.length}>{row.data_type}</td>
                  )}
                  <td>{outcome.outcome_name}</td>
                  <td>{outcome.value}</td>
                  <td>{outcome.p_value}</td>
                  <td>{outcome.f_value}</td>
                  <td>{outcome.rejection}</td>
                </tr>
              ))
            : (
                <tr key={row.info_id || idx}>
                  <td>{row.info_name}</td>
                  <td>{row.data_type}</td>
                  <td colSpan={5}>No outcomes</td>
                </tr>
              )
        )}
      </tbody>
    </table>
  );

  const renderIntentionResultTable = () => (
    <table className="table table-bordered table-striped">
      <thead>
        <tr>
          <th>Dataset Name</th>
          <th>Dataset Type</th>
          <th>Intention Name</th>
          <th>Value</th>
          <th>P Value</th>
          <th>F Value</th>
          <th>Rejection</th>
        </tr>
      </thead>
      <tbody>
        {significantDifference.map((row, idx) =>
          row.intentions && row.intentions.length > 0
            ? row.intentions.map((intention, iidx) => (
                <tr key={`${row.info_id}-${intention.intention_id}`}>
                  {iidx === 0 && (
                    <td rowSpan={row.intentions.length}>{row.info_name}</td>
                  )}
                  {iidx === 0 && (
                    <td rowSpan={row.intentions.length}>{row.data_type}</td>
                  )}
                  <td>{intention.intention_name}</td>
                  <td>{intention.value}</td>
                  <td>{intention.p_value}</td>
                  <td>{intention.f_value}</td>
                  <td>{intention.rejection}</td>
                </tr>
              ))
            : (
                <tr key={row.info_id || idx}>
                  <td>{row.info_name}</td>
                  <td>{row.data_type}</td>
                  <td colSpan={5}>No intentions</td>
                </tr>
              )
        )}
      </tbody>
    </table>
  );

  // Function to fetch significant difference data
  const fetchSignificanceDifferenceAggregate = async () => {
    setViewLoader(true);
    try {
      let action = "";
      let dataArr = [];

      // Use activeTab to determine which action and data to use
      if (activeTab === "aggregate") {
        action = "get_aggregate_significant";
        dataArr = compositeAggregateData;
      } else if (activeTab === "outcome") {
        action = "get_outcome_significant";
        dataArr = compositeOutcomeData;
      } else if (activeTab === "intentions") {
        action = "get_intention_significant";
        dataArr = compositeIntentionData;
      } else {
        // Default fallback - use aggregate data
        action = "get_aggregate_significant";
        dataArr = compositeAggregateData || [];
      }
      setLastSignificanceAction(action);

      // Map data to match required format with control_group
      const formattedData = dataArr?.map((item, index) => ({
        info_id: parseInt(item.info_id) || 0,
        info_name: item.info_name,
        value: parseFloat(item.value) || 0,
        data_type: item.data_type,
        control_group: selectedControlGroupIdx === index,
        ...(item.outcomes && {
          outcomes: item.outcomes.map((outcome) => ({
            ...outcome,
            outcome_id: parseInt(outcome.outcome_id) || 0,
            value: parseFloat(outcome.value) || 0,
          })),
        }),
        ...(item.intentions && {
          intentions: item.intentions.map((intention) => ({
            ...intention,
            intention_id: parseInt(intention.intention_id) || 0,
            value: parseFloat(intention.value) || 0,
          })),
        }),
      }));

      const payload = {
        action,
        significant_difference: significantDifferenceValue,
        data: formattedData,
      };

      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT.filterAggregateChart,
        bodyData: payload,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        setSignificantDifference(response?.data?.data);
      }
      setViewLoader(false);
    } catch (error) {
      setViewLoader(false);
      console.error("Error fetching filter aggregate chart data:", error);
    }
  };

  // Render the correct result table based on last action
  const renderResultTable = () => {
    if (!significantDifference || significantDifference.length === 0) return null;
    if (lastSignificanceAction === 'get_aggregate_significant') return renderAggregateResultTable();
    if (lastSignificanceAction === 'get_outcome_significant') return renderOutcomeResultTable();
    if (lastSignificanceAction === 'get_intention_significant') return renderIntentionResultTable();
    // fallback
    return renderAggregateResultTable();
  };

  return (
    <div className="significant-difference-container">
      <Form.Group className="mb-3 d-flex align-items-baseline flex-wrap gap-2">
        <Form.Label className="radio-label mb-0 pe-lg-4 pe-3">
          Significant Difference
        </Form.Label>
        <div className="onlyradio flex-wrap ms-xl-2">
          <Form.Check
            inline
            label="90%"
            name="significant"
            type="radio"
            id="percentage"
            className="mb-0"
            checked={significantDifferenceValue === 90}
            onChange={() => setSignificantDifferenceValue(90)}
          />
          <Form.Check
            inline
            label="95%"
            name="significant"
            type="radio"
            id="percentage2"
            className="mb-0"
            checked={significantDifferenceValue === 95}
            onChange={() => setSignificantDifferenceValue(95)}
          />
        </div>
      </Form.Group>

      {activeTab === "aggregate" && compositeAggregateData && compositeAggregateData.length > 0 && (
        <>
          <h4 className="mb-3">Aggregate Data</h4>
          {renderAggregateTable()}
        </>
      )}
      {activeTab === "outcome" && compositeOutcomeData && compositeOutcomeData.length > 0 && (
        <>
          <h4 className="mb-3 mt-4">Outcome Data</h4>
          {renderOutcomeTable()}
        </>
      )}
      {activeTab === "intentions" && compositeIntentionData && compositeIntentionData.length > 0 && (
        <>
          <h4 className="mb-3 mt-4">Intention Data</h4>
          {renderIntentionTable()}
        </>
      )}
      {significantDifference && significantDifference.length > 0 && (
        <>
          <h4 className="mb-3 mt-4">Significant Difference Results</h4>
          {renderResultTable()}
        </>
      )}
      <div className="d-flex justify-content-end mt-3">
        <Button
          variant="primary"
          className="ripple-effect"
          onClick={fetchSignificanceDifferenceAggregate}
        >
          Execute
        </Button>
      </div>
    </div>
  )
}

export default SignificantDifference
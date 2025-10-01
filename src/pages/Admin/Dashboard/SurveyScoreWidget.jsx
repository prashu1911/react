import React, { useEffect, useState } from "react";
import { Button, Col, Dropdown, Form } from "react-bootstrap";
import { commonService } from "services/common.service";
import { useAuth } from "customHooks";
import { SelectField } from "components";
import SurveyScore from "./Chart/SurveyScore";
import { ADMIN_MANAGEMENT } from "apiEndpoints/AdminManagement/adminManagement";
import MultiSelectDropdown from "./MultiSelectDropdown";

const SurveyScoreWidget = React.memo(({ SurveyList, widgetData }) => {
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();

  const [SureveyScoreData, setSureveyScoreData] = useState([]);
  const [SelectedChartType, setSelectedChartType] = useState("aggregate");
  const [SelectedSurvey, setSelectedSurvey] = useState();
  const [OutcomeList, setOutcomeList] = useState([]);
  const [SelectedOutcome, setSelectedOutcome] = useState([]);
  const [IntentionList, setIntentionList] = useState([]);
  const [SelectedIntention, setSelectedIntention] = useState([]);
  const [prevChartType, setPrevChartType] = useState("aggregate");

  // Handler for user-initiated survey change
  const handleSurveyChange = (survey) => {
    setSelectedSurvey(survey);
    setSelectedChartType("aggregate");
  };

  // Handler for chart type change from dropdown
  const handleChartTypeChange = (type) => {
    setPrevChartType(SelectedChartType);
    setSelectedChartType(type);
  };

  useEffect(() => {
    const newArray = SurveyList.filter(item =>
      widgetData?.widget_data?.assessmentID == item.value
    );
    setSelectedChartType(widgetData?.widget_data?.chartType)
    setSelectedSurvey(...newArray);

  }, [SurveyList, widgetData]);

  // Fetch survey score when any required dependency changes
  useEffect(() => {
    if (
      SelectedSurvey?.value &&
      (
        SelectedChartType === "aggregate" ||
        (SelectedChartType === "outcome" && SelectedOutcome.length > 0) ||
        (SelectedChartType === "intention" && SelectedOutcome.length > 0 && SelectedIntention.length > 0)
      )
    ) {
      fetchSurveyScore();
    }else{
      setSureveyScoreData([]);
    }
  }, [SelectedSurvey, SelectedChartType, SelectedOutcome, SelectedIntention]);

  useEffect(() => {
    if (SelectedSurvey?.value && (SelectedChartType === 'outcome' || SelectedChartType === 'intention')) {
      fetchOutcomeList();
    }
  }, [SelectedSurvey, SelectedChartType]);


  useEffect(() => {
    if (widgetData?.widget_data?.chartType === 'outcome' ) {
      if (OutcomeList?.length>0) {
        const newArray = OutcomeList.filter(item =>
          widgetData?.widget_data?.outcomes?.includes(item.value)
        );
        setSelectedOutcome(newArray);
        
      }
    }else if (widgetData?.widget_data?.chartType === 'intention') {
      if (OutcomeList?.length>0 && SelectedOutcome?.length==0) {
        const newArray = OutcomeList.filter(item =>
          widgetData?.widget_data?.outcomes?.includes(item.value)
        );
        setSelectedOutcome(newArray);
      }
      
      if (IntentionList?.length>0) {
        const newArray = IntentionList.filter(item =>
          widgetData?.widget_data?.intentions?.includes(item.value) || SelectedIntention?.some(element => element.value === item?.value)

        );
        setSelectedIntention(newArray);
      }

      
    }
  }, [OutcomeList, IntentionList]);

  useEffect(() => {
    if (SelectedChartType === 'intention' && SelectedOutcome.length > 0) {
      fetchIntentionList();
    }else if ((SelectedChartType === 'outcome' || SelectedChartType === 'intention') && SelectedOutcome.length === 0) {
      setSureveyScoreData([]);
      setSelectedIntention([]);
    }
  }, [SelectedOutcome, SelectedChartType]);

  const fetchSurveyScore = async () => {
    const assessmentID = SelectedSurvey?.value;
    if (!assessmentID) return;

    const body = {
      assessmentID,
      companyMasterID: 1,
      chartType: SelectedChartType
    };

    if (SelectedChartType === 'outcome' || SelectedChartType === 'intention') {
      body.outcomes = SelectedOutcome.map(item => item.value);
      if (!body.outcomes.length) return;
    }

    if (SelectedChartType === 'intention') {
      body.intentions = SelectedIntention.map(item => item.value);
      if (!body.intentions.length) return;
    }

    try {
      const response = await commonService({
        apiEndPoint: ADMIN_MANAGEMENT.getDashboardSurveyScore,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        bodyData: body,
      });
      if (response?.status) {

        updateSurveyScore(body)
        setSureveyScoreData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching survey score:", error);
    }
  };
  const updateSurveyScore = async (body) => {

    try {
      const response = await commonService({
        apiEndPoint: ADMIN_MANAGEMENT.updateDashboardSurveyScore,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        bodyData: {
          dashboardID: widgetData?.dashboard_id,
          widgetID: widgetData?.widget_id,
          ...body
        }
      });
      if (response?.status) {
      }
    } catch (error) {
      console.error("Error fetching survey score:", error);
    }
  };

  const fetchOutcomeList = async () => {
    
    
    const assessmentID = SelectedSurvey?.value;
    if (!assessmentID) return;

    try {
      const response = await commonService({
        apiEndPoint: ADMIN_MANAGEMENT.getOutcomeList(assessmentID),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        const outcomes = response.data.data.map(company => ({
          value: company.outcome_id,
          label: company.outcome_value
        }));
        setOutcomeList(outcomes);
        // Only select all if just switched to outcome
        if (SelectedChartType === "outcome" && prevChartType !== "outcome") {
          setSelectedOutcome(outcomes);
        }
      }
    } catch (error) {
      console.error("Error fetching outcomes:", error);
    }
  };

  const fetchIntentionList = async () => {
    const assessmentID = SelectedSurvey?.value;
    if (!assessmentID || !SelectedOutcome.length) return;

    try {
      const response = await commonService({
        apiEndPoint: ADMIN_MANAGEMENT.getIntentionList,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        bodyData: {
          action: "intention_list_dropdown",
          assessmentID,
          outcomeIDs: SelectedOutcome.map(item => item.value),
          isIG: false
        },
      });
      if (response?.status) {
        const intentions = response.data.data.map(company => ({
          value: company.intention_id,
          label: company.intention_value
        }));
        setIntentionList(intentions);
        // Only select all if just switched to intention
        if (SelectedChartType === "intention" && prevChartType !== "intention") {
          setSelectedIntention(intentions);
        }
      }
    } catch (error) {
      console.error("Error fetching intentions:", error);
    }
  };



  return (
    <Col xxl={4} sm={6}>
      <div className="cardBox bg-white h-100">
        <div className="d-flex align-item-center justify-content-between pageTitle mb-3 flex-wrap">
          <h2 className="mb-0">Survey Score</h2>
        </div>
        <div style={{flexDirection:'column'}} className="d-flex gap-2 cardBox_btn">
          <Form.Group className="d-flex form-group w-100">
            <SelectField
              extraClass="w-100"
              value={SelectedSurvey}
              onChange={handleSurveyChange}
              placeholder="Select Surveys"
              options={SurveyList}
              isMulti={false}
              styles={{
                control: (base) => ({
                  ...base,
                  width: "100%",
                  minHeight: "2.5rem",
                }),
                valueContainer: (base) => ({
                  ...base,
                  overflow: "hidden",
                }),
                singleValue: (base) => ({
                  ...base,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }),
              }}
            />
            <Dropdown style={{ marginLeft: '0.7rem' }} className="commonDropdown">
              <Dropdown.Toggle>
                <em className="icon-settings-outline" />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  className={SelectedChartType === "aggregate" ? "active-chart-type" : ""}
                  onClick={() => handleChartTypeChange("aggregate")}
                >
                  <em className="icon icon-summary-report" />Aggregate
                </Dropdown.Item>
                <Dropdown.Item
                  className={SelectedChartType === "outcome" ? "active-chart-type" : ""}
                  onClick={() => handleChartTypeChange("outcome")}
                >
                  <em className="icon icon-detailed-analysis" />Outcome
                </Dropdown.Item>
                <Dropdown.Item
                  className={SelectedChartType === "intention" ? "active-chart-type" : ""}
                  onClick={() => handleChartTypeChange("intention")}
                >
                  <em className="icon icon-clipboard-check" />Intention
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>
          {(SelectedChartType === 'outcome' || SelectedChartType === 'intention') && (
            <Form.Group className="form-group w-100">
              <MultiSelectDropdown
                placeholder="Select Outcomes"
                options={OutcomeList}
                value={SelectedOutcome}
                onChange={(selectedOptions) => {
                  // Check if any outcomes were removed
                  const removedOptions = SelectedOutcome?.filter(
                    selected => !selectedOptions?.find(option => option.value === selected.value)
                  );

                  console.log("selectedOptions", selectedOptions);
                  if (removedOptions?.length > 0) {
                    // Clear intentions when outcomes are removed
                    setSelectedOutcome(selectedOptions);
                    // Re-fetch data with updated outcomes
                    // fetchSurveyScore();
                  } else {
                    setSelectedOutcome(selectedOptions);
                  }
                }}
                isMulti
              />
            </Form.Group>
          )}
          {SelectedChartType === 'intention' && (
            <Form.Group className="form-group w-100">
              <MultiSelectDropdown
                placeholder="Select Intention"
                options={IntentionList}
                value={SelectedIntention}
                onChange={setSelectedIntention}
                isMulti
              />
            </Form.Group>
          )}
        </div>
        <SurveyScore SureveyScoreData={SureveyScoreData} />
      </div>
    </Col>
  );
});

export default SurveyScoreWidget;

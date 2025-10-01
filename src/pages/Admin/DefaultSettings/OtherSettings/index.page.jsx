import { Button, InputField, SelectField } from "components";
import { useEffect, useState } from "react";
import { Accordion, Form } from "react-bootstrap";

export default function Settings({
  setActiveTab,
  activeTab,
  resultOutput,
  updateResultOutput,
  isReportOutBtn,
  dynamicOutput,
  updateDynamicOutput,
  isDynamicOutput,
  updateAssesmentLayout,
  isAssesmentLayout,
  assessmentLayout,
}) {
  const ASSESMENT_TOPICS = [{ label: "Metolius Default", value: 2 }];
  const QUESTION_PER_PAGE = [
    { label: "1", value: 1 },
    { label: "2", value: 2 },
    { label: "3", value: 3 },
    { label: "4", value: 4 },
    { label: "5", value: 5 },
    { label: "6", value: 6 },
    { label: "7", value: 7 },
    { label: "8", value: 8 },
    { label: "9", value: 9 },
    { label: "10", value: 10 },
  ];
  const HIDE_OUTCOME = [
    { label: "Yes", value: true, num: 1 },
    { label: "No", value: false, num: 0 },
  ];

  const [resultOutputArr, setResultOutputArr] = useState([]);
  const [vectorInp, setVectorInp] = useState("");
  const [elementInp, setElementInp] = useState("");
  const [questionInp, setQuestionInp] = useState("");

  const [assesmentTopic, setAssesmentTopic] = useState(ASSESMENT_TOPICS[0]);

  const [questionPerPage, setQuestionPerPage] = useState("");
  const [hideOutCome, setHideOutCome] = useState("");

  useEffect(() => {
    if (resultOutput?.length > 0)
      setResultOutputArr(
        resultOutput?.map((val) => {
          const reportContent = JSON.parse(val.report_content || "{}");
          return {
            department_id: val.department_id,
            department_name: val.department_name,
            summary: reportContent.summary || 0,
            detailed: reportContent.detailed || 0,
            spider: reportContent.spider || 0,
          };
        })
      );
  }, [resultOutput]);

  useEffect(() => {
    if (dynamicOutput) {
      setVectorInp(dynamicOutput?.assessment_type_description?.vector || "");
      setElementInp(dynamicOutput?.assessment_type_description?.element || "");
      setQuestionInp(
        dynamicOutput?.assessment_type_description?.question || ""
      );
    }
  }, [dynamicOutput]);

  const handleDynamicOutput = () => {
    const data = {
      assessment_topic: assesmentTopic?.value,
      vector: vectorInp,
      element: elementInp,
      question: questionInp,
    };

    updateDynamicOutput(data);
  };

  const handleAssessmentLayout = () => {
    const data = {
      layout_option: questionPerPage?.value,
      hide_outcome: hideOutCome?.value,
    };
    updateAssesmentLayout(data);
  };

  useEffect(() => {
    if (assessmentLayout) {
      setQuestionPerPage(
        QUESTION_PER_PAGE.find(
          (data) => data.value === assessmentLayout.layout_option
        )
      );
      setHideOutCome(
        HIDE_OUTCOME.find((data) => data.num === assessmentLayout.hide_outcome)
      );
    }
  }, [assessmentLayout]);

  return (
    <>
      <div
        id="defaultSettingsTab"
        onClick={()=> {
          setActiveTab("defaultSettingsTab");
      }}
      >
        <div className="pageTitle">
          <h2>Other Default Settings </h2>
        </div>
        <div className="generalsetting_inner d-block">
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Results Output </Accordion.Header>
              <Accordion.Body>
                <div className="generalsetting">
                  <div className="generalsetting_inner flex-wrap gap-2">
                    {resultOutputArr?.length > 0 &&
                      resultOutputArr.map((val, index) => {
                        return (
                          <div className="generalsetting_field" key={index}>
                            <Form.Group className="form-group">
                              <Form.Label> {val.department_name}</Form.Label>
                              {["checkbox"].map((type) => (
                                <div
                                  className="onlyradio flex-wrap"
                                  key={`inline-${type}`}
                                >
                                  <Form.Check
                                    inline
                                    label="Summary Report"
                                    name={`summary-${index}`} // or use val.department_id
                                    type={type}
                                    id={`summary-${index}`}
                                    checked={val?.summary}
                                    onChange={() => {
                                      const updated = [...resultOutputArr];
                                      updated[index] = {
                                        ...updated[index],
                                        summary:
                                          updated[index].summary === 1 ? 0 : 1,
                                      };
                                      setResultOutputArr(updated);
                                    }}
                                  />

                                  <Form.Check
                                    inline
                                    label="Detailed Analysis"
                                    name={`detailed-${index}`}
                                    type={type}
                                    id={`detailed-${index}`}
                                    checked={val?.detailed}
                                    onChange={() => {
                                      const updated = [...resultOutputArr];
                                      updated[index] = {
                                        ...updated[index],
                                        detailed:
                                          updated[index].detailed === 1 ? 0 : 1,
                                      };
                                      setResultOutputArr(updated);
                                    }}
                                  />
                                </div>
                              ))}
                            </Form.Group>
                          </div>
                        );
                      })}
                  </div>
                  <div className="d-flex justify-content-end mt-3">
                    <Button
                      variant="primary"
                      className="ripple-effect"
                      disabled={isReportOutBtn}
                      onClick={() => updateResultOutput(resultOutputArr)}
                    >
                      {" "}
                      {isReportOutBtn ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              {/* <Accordion.Header>Dynamic Outcome Labels</Accordion.Header>
              <Accordion.Body>
                <label className="form-label d-inline-block" htmlFor="note">
                  {" "}
                  Your subscription does not have this feature enabled. Please
                  contact metoliusdemo@ibridgellc.com for subscription
                  enquiries.{" "}
                </label>
                <div className="generalsetting border-0 pt-0 mt-0">
                  <div className="generalsetting_inner flex-wrap gap-2">
                    <div className="generalsetting_field">
                      <Form.Group className="form-group">
                        <Form.Label>Select Assessment Topic </Form.Label>
                        <SelectField
                          placeholder="Select Assessment Topic"
                          options={ASSESMENT_TOPICS}
                          isDisabled
                          value={assesmentTopic}
                          onChange={(e) => {
                            setAssesmentTopic(e);
                          }}
                        />
                      </Form.Group>
                    </div>
                  </div>
                  <div className="generalsetting_inner flex-wrap gap-2">
                    <div className="generalsetting_field">
                      <Form.Group className="form-group mb-0">
                        <Form.Label>Preferred Text for Vector </Form.Label>
                        <InputField
                          type="text"
                          placeholder="Outcomes"
                          value={vectorInp}
                          disabled
                          onChange={(e) => setVectorInp(e.target.value)}
                        />
                      </Form.Group>
                    </div>
                    <div className="generalsetting_field">
                      <Form.Group className="form-group mb-0">
                        <Form.Label>Preferred Text for Element</Form.Label>
                        <InputField
                          type="text"
                          placeholder="Intentions"
                          value={elementInp}
                          disabled
                          onChange={(e) => setElementInp(e.target.value)}
                        />
                      </Form.Group>
                    </div>
                    <div className="generalsetting_field">
                      <Form.Group className="form-group mb-0">
                        <Form.Label>Preferred Text for Question</Form.Label>
                        <InputField
                          type="text"
                          placeholder="Question"
                          value={questionInp}
                          disabled
                          onChange={(e) => setQuestionInp(e.target.value)}
                        />
                      </Form.Group>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end mt-3">
                    <Button
                      variant="primary"
                      className="ripple-effect"
                      onClick={handleDynamicOutput}
                    >
                      {" "}
                      {isDynamicOutput ? "Saving...." : "Save"}
                    </Button>
                  </div>
                </div>
              </Accordion.Body> */}
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              {/* <Accordion.Header>Assessment Layout</Accordion.Header> */}
              <Accordion.Header>Participant View Options</Accordion.Header>
              <Accordion.Body>
                <div className="generalsetting border-0 pt-0 mt-0">
                  <div className="generalsetting_inner flex-wrap gap-2">
                    <div className="generalsetting_field">
                      <Form.Group className="form-group">
                        <Form.Label>Questions per Page </Form.Label>
                        <SelectField
                          placeholder="Questions per Page"
                          options={QUESTION_PER_PAGE}
                          value={questionPerPage}
                          onChange={(e) => {
                            setQuestionPerPage(e);
                          }}
                        />
                      </Form.Group>
                    </div>

                    <div className="generalsetting_field">
                      <Form.Group className="form-group">
                        <Form.Label>Hide Outcome(s) </Form.Label>
                        <SelectField
                          placeholder="Hide Outcome"
                          options={HIDE_OUTCOME}
                          value={hideOutCome}
                          onChange={(e) => {
                            setHideOutCome(e);
                          }}
                        />
                      </Form.Group>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end mt-3">
                    <Button
                      variant="primary"
                      className="ripple-effect"
                      onClick={handleAssessmentLayout}
                    >
                      {" "}
                      {isAssesmentLayout ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
            {/* <Accordion.Item eventKey="3">
              <Accordion.Header> Sizing Parameters </Accordion.Header>
              <Accordion.Body>
                <label className="form-label d-inline-block" htmlFor="note">
                  {" "}
                  Your subscription does not have this feature enabled. Please
                  contact metoliusdemo@ibridgellc.com for subscription
                  enquiries.
                </label>
              </Accordion.Body>
            </Accordion.Item> */}
          </Accordion>
        </div>
      </div>
    </>
  );
}

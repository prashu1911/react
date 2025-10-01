import { SURVEYS_MANAGEMENT } from "apiEndpoints/SurveysManagement";
import { Button, InputField, ModalComponent } from "components";
import { useAuth } from "customHooks";
import React, { useEffect, useState } from "react";
import { Col, Form, ListGroup, Row } from "react-bootstrap";
import toast from "react-hot-toast";
import { commonService } from "services/common.service";

const ViewBenchmarkComp = ({ type, surveyID, companyID, setActionType ,benchmarkID}) => {
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  const [benchmarkName, setBenchmarkName] = useState("");
  const [benchMarkData, setBenchMarkData] = useState([]);

 const getQuestionsForSurvey = async () => {
     try {
       const response = await commonService({
         apiEndPoint: SURVEYS_MANAGEMENT.fetchBenchmark,
         queryParams: { benchmarkID: benchmarkID },
         headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${userData?.apiToken}`,
         },
       });
 
       if (response?.status) {
         const benchmarkArrValue =
           response?.data?.data?.dataset_values?.all_values?.outcomes;
           console.log(benchmarkArrValue,"benchmarkArrValue")
         if (benchmarkArrValue) setBenchMarkData(benchmarkArrValue || []);
         const benchmarkName = response?.data?.data?.name;
         if (benchmarkName) setBenchmarkName(benchmarkName);
       }
     } catch (error) {
         console.log(error);
       //   logger(error);
     }
   };

  useEffect(() => {
    if (type === "view" && benchmarkID) getQuestionsForSurvey();
  }, [type,benchmarkID]);

  const onModalClose = () => {
    setActionType(null);
  };



  const thStyle = {
    border: "1px solid #ccc",
    padding: "8px",
    backgroundColor: "#f4f4f4",
    position: "sticky",
    top: 0,
    zIndex: 2,
  };

  const tdStyle = {
    border: "1px solid #ccc",
    padding: "8px",
    verticalAlign: "top",
  };

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
  };

  return (
    <ModalComponent
      modalHeader="View Benchmark"
      show={type === "view"}
      onHandleCancel={onModalClose}
      size={"xl"}
    >
      <Row>
        <Col lg={6}>
          <Form.Group className="form-group">
            <Form.Label>Benchmark Name</Form.Label>
            <InputField
              type="text"
              name="benchmarkName"
              placeholder="Benchmark Name"
              value={benchmarkName}
              disabled
            />
          </Form.Group>
        </Col>
      </Row>

      <div className="m-3" style={{ maxHeight: "80vh", overflowY: "auto" }}>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th style={thStyle}>Outcome</th>
              <th style={thStyle}>Value</th>
              <th style={thStyle}>Intention</th>
              <th style={thStyle}>Value</th>
              <th style={thStyle}>Question</th>
              <th style={thStyle}>Value</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(benchMarkData) && benchMarkData.map((outcome, oIdx) => {
              const outcomeRowspan = outcome.intention.reduce(
                (total, intent) => total + Math.max(1, intent.question.length),
                0
              );

              let outcomeRendered = false;

              return outcome.intention.map((intention, iIdx) => {
                const intentionRowspan = Math.max(1, intention.question.length);
                const questions =
                  intention.question.length > 0 ? intention.question : [""];

                let intentionRendered = false;

                return questions.map((question, qIdx) => {
                  const row = [];

                  if (!outcomeRendered) {
                    row.push(
                      <td
                        key={`outcome-${oIdx}`}
                        rowSpan={outcomeRowspan}
                        style={tdStyle}
                      >
                        {outcome.outcomeName}
                      </td>,
                      <td
                        key={`outcome-val-${oIdx}`}
                        rowSpan={outcomeRowspan}
                        style={tdStyle}
                      >
                        <input
                          type="number"
                          style={inputStyle}
                          value={outcome.value}
                          min={0}
                          max={100}
                         disabled
                        />
                      </td>
                    );
                    outcomeRendered = true;
                  }

                  if (!intentionRendered) {
                    row.push(
                      <td
                        key={`intention-${iIdx}`}
                        rowSpan={intentionRowspan}
                        style={tdStyle}
                      >
                        {intention.intentionShortName}
                      </td>,
                      <td
                        key={`intention-val-${iIdx}`}
                        rowSpan={intentionRowspan}
                        style={tdStyle}
                      >
                        <input
                          type="number"
                          style={inputStyle}
                          value={intention.value ?? null}
                          min={0}
                          max={100}
                         disabled
                        />
                      </td>
                    );
                    intentionRendered = true;
                  }

                  row.push(
                    <td key={`q-${qIdx}`} style={tdStyle}>
                      {question?.question}
                    </td>,
                    <td key={`q-val-${qIdx}`} style={tdStyle}>
                      {question?.question && (
                        <input
                          type="number"
                          style={inputStyle}
                          value={question.value}
                          min={0}
                          max={100}
                          disabled
                        />
                      )}
                    </td>
                  );

                  return <tr key={`row-${oIdx}-${iIdx}-${qIdx}`}>{row}</tr>;
                });
              });
            })}
          </tbody>
        </table>
      </div>

      <Col xs={12}>
        <div className="form-btn d-flex gap-2 justify-content-end">
          <Button
            variant="secondary"
            className="ripple-effect"
            onClick={onModalClose}
          >
            Close
          </Button>
          {/* <Button
            variant="primary"
            type="submit"
            disabled={isSubmitting}
            className="ripple-effect"
            onClick={handleAddBenchmark}
          >
            {isSubmitting ? "Adding..." : "Add"}
          </Button> */}
        </div>
      </Col>
    </ModalComponent>
  );
};

export default ViewBenchmarkComp;

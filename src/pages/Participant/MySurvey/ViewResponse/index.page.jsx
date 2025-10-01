import { Loader } from "components";
import { useAuth } from "customHooks";
import React, { useEffect, useState } from "react";
import { Participant } from "apiEndpoints/Participant";
import { commonService } from "services/common.service";

function ViewResponse() {
  const [showLoader, setShowLoader] = useState(false);
  const [responses, setResponses] = useState([]);
  const [tableResponse, setTableResponse] = useState([]);

  const { getloginUserData } = useAuth();
  const userData = getloginUserData();

  const fetchOutcome = async () => {
    try {
      setShowLoader(true);
      const response = await commonService({
        apiEndPoint: Participant.fetchQuestionList,
        queryParams: {
          companyID: userData?.companyID,
          surveyID: userData?.surveyID,
          departmentID: userData?.departmentID,
          userID: userData?.userID,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        setShowLoader(false);
        formtableResponse(response?.data);
        setResponses(response?.data || []);
      }
    } catch (error) {
      console.error("Error fetching outcomes:", error);
      setShowLoader(false);
    }
  };

  useEffect(() => {
    fetchOutcome();
  }, []);

  const formtableResponse = (data) => {
    let outComeDetails = [];
    let questionCounter = 1;

    data?.outcomes?.forEach((items) => {
      let outComeObj = {
        outComeId: items.outcome_id,
        outComeName: items.outcome_name,
        details: [],
      };

      if (Array.isArray(items.questions)) {
        items.questions.forEach((val) => {
          // Type: Numeric Sub-questions
          if (val.question_type === "N") {
            val?.sub_questions?.forEach((subQ,idx) => {
              const selectedResponses = subQ.response
                .filter((r) => r.is_user_selected_response === 1)
                .map((r) => r.response_name);

              if (selectedResponses.length > 0) {
                outComeObj.details.push({
                  sno: questionCounter + `.${idx + 1}`,
                  name: `${val.question} - ${subQ.question_sub}`,
                  response: selectedResponses,
                });
              }
            });
            questionCounter++;
            return;
          }

          // Type: Multi-response Groups
          if (val.question_type === "MR") {
            val?.defining_question_details?.forEach((group,index) => {
              group?.sub_questions?.forEach((subQ,idx) => {
               
                subQ?.response?.forEach((res) => {
                  
                  if (res.is_user_selected_response === 1) {
                    outComeObj.details.push({
                      sno: questionCounter + `.${index + 1}.${idx + 1}`,
                      name: `${subQ.question} - ${subQ.question_sub}`,
                      response: res.response_name,
                    });
                    
                  }
                });
              });
            });
            questionCounter++;
            return;
          }

          // Type: Gate Questions
          if (val.question_type === "G") {
            val?.response?.forEach((res) => {
              if (res.is_user_selected_response === 1) {
                outComeObj.details.push({
                  sno: questionCounter++,
                  name: val.question,
                  response: res.response_name.trim(),
                });
              }
            });

            if (val.is_jump_configure === 1 && Array.isArray(val.sequence_question)) {
              val.sequence_question.forEach((q) => {
                q?.response?.forEach((res) => {
                  if (res.is_user_selected_response === 1) {
                    outComeObj.details.push({
                      sno: questionCounter++,
                      name: `${q.question}${q.sub_question_no ? " - " + q.sub_question_no : ""}`,
                      response: res.response_name.trim(),
                    });
                  }
                });
              });
            }
            return;
          }

          if (val.question_type === "D" && Boolean(val.is_branch_filter)) {
            // Helper to count selected sub-questions recursively
            function countSelectedDemographicRows(items) {
              let count = 0;
              items.forEach((item) => {
                if (item.is_user_selected_response === 1) {
                  count++;
                }
                if (Array.isArray(item.next_level)) {
                  count += countSelectedDemographicRows(item.next_level);
                }
              });
              return count;
            }
            const subCount = countSelectedDemographicRows(val.demographic_response);
            outComeObj.details.push({
              sno: questionCounter++,
              name: val.question,
              response: "",
              mainQuestion: true,
              groupLength: subCount + 1, // main question + sub-questions
            });
            function pushDemographicRows(items) {
              items.forEach((item) => {
                if (item.is_user_selected_response === 1) {
                  outComeObj.details.push({
                    sno: "",
                    name: item.display_name || item.label || item.question || "",
                    response: item.response,
                  });
                }
                if (Array.isArray(item.next_level)) {
                  pushDemographicRows(item.next_level);
                }
              });
            }
            pushDemographicRows(val.demographic_response);
            return;
          }

          if (
            val.question_type === "R" &&
            (val.response_selected_type === "Rank" || val.response_selected_type === "Multi")
          ) {
            // Push a single detail object with all selected responses as an array
            const selectedResponses =
              val?.response?.filter((u) => u.is_user_selected_response === 1).map((u) => u.response_name) || [];
            outComeObj.details.push({
              sno: questionCounter++,
              name: val.question,
              response: selectedResponses,
              question_type: "R",
              response_selected_type: val.response_selected_type,
            });
            return;
          }

          // Other Types: D, R, 0, etc.
          const questions = {
            sno: questionCounter++,
            name: val.question,
            response: "",
          };

          // if (val.question_type === "R" && val.response_selected_type === "Rank") {
          //   // Push a single detail object with all selected responses as an array
          //   const selectedResponses =
          //     val?.response?.filter((u) => u.is_user_selected_response === 1).map((u) => u.response_name) || [];
          //   outComeObj.details.push({
          //     sno: questionCounter++,
          //     name: val.question,
          //     response: selectedResponses,
          //     question_type: "R",
          //     response_selected_type: val.response_selected_type,
          //   });
          //   return;
          // }
          if (
            (val.question_type === "D" && !val.is_branch_filter) ||
            (val.question_type === "R" && val.response_selected_type !== "Rank")
          ) {
            val?.response?.forEach((u) => {
              if (u.is_user_selected_response === 1) {
                questions.response = [u.response_name];
              }
            });
          } else if (val.question_type === "D" && Boolean(val.is_branch_filter)) {
            questions.response = extractUserSelectedResponses(val.demographic_response);
          } else if (val.question_type === "O") {
            questions.response = val.is_user_selected_response;
          } else {
            questions.response = val.response || "";
          }

          if (questions.response && questions.response.length !== 0) {
            outComeObj.details.push(questions);
          }
        });
      }

      outComeDetails.push(outComeObj);
    });

    setTableResponse(outComeDetails);
  };

  function extractUserSelectedResponses(array) {
    const result = [];

    function traverse(item) {
      if (item.is_user_selected_response === 1) {
        result.push(item.response);
      }
      if (Array.isArray(item.next_level)) {
        item.next_level.forEach(traverse);
      }
    }

    array.forEach(traverse);
    return result;
  }

  const renderResponse = (response, responseType) => {
    if (!response || response.length === 0) return " ";

    if (typeof response === "string") return response;

    if (Array.isArray(response)) {
      if (typeof response[0] === "string") {
        if (responseType === "Rank") {
          // Render each response on a new line with numbering for rank type
          return (
            <>
              {response.map((item, idx) => (
                <React.Fragment key={idx}>
                  {idx + 1}. {item}
                  {idx !== response.length - 1 && <br />}
                </React.Fragment>
              ))}
            </>
          );
        } else {
          // For other types, comma separated
          return response.join(", ");
        }
      }
    }

    return JSON.stringify(response);
  };

  return (
    <>
      {showLoader ? (
        <div className="participantLoader">
          <Loader />
        </div>
      ) : (
        <>
          <section className="commonBanner position-relative survey-details-banner">
            <div className="container">
              <div className="commonBanner_inner">
                <h1>{responses?.survey_name}</h1>
                <ul className="list-unstyled d-flex align-items-center flex-wrap" style={{ fontSize: "18px" }}>
                  <li>
                    Company: <span className="suvery-basic-details">{userData.companyName}</span>
                  </li>
                  <li className="ms-2 me-2">|</li>
                  <li>
                    Department: <span className="suvery-basic-details">{responses?.department_name}</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>
          <section className="pt-4 pt-xl-5 mb-4">
            <div className="container">
              <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Sl. No</th>
                    <th style={thStyle}>Questions</th>
                    <th style={thStyle}>Selected Response</th>
                    {/* <th style={thStyle}>Action</th> */}
                  </tr>
                </thead>
                <tbody>
                  {tableResponse?.map((outcome, i) => (
                    <React.Fragment key={i}>
                      {!responses?.is_hide_outcome && (
                        <tr style={{ backgroundColor: "#E9F1FA", padding: "0.5rem" }}>
                          <td colSpan={4} style={{ color: "#0968AC", padding: "0.5rem", textAlign: "center" }}>
                            <strong>Outcome - {outcome.outComeName}</strong>
                          </td>
                        </tr>
                      )}
                      {outcome?.details?.map((item, j) => {
                        if (
                          item.response_selected_type === "Rank" &&
                          Array.isArray(item.response) &&
                          item.response.length > 1
                        ) {
                          return item.response.map((resp, idx) => (
                            <tr key={j + "-" + idx}>
                              {idx === 0 && (
                                <td style={tdStyle} rowSpan={item.response.length}>
                                  {item.sno}
                                </td>
                              )}
                              {idx === 0 && (
                                <td style={tdStyle} rowSpan={item.response.length}>
                                  {item.name}
                                </td>
                              )}
                              <td style={tdStyle}>{`${idx + 1}. ${resp}`}</td>
                            </tr>
                          ));
                        } else {
                          return (
                            <tr key={j}>
                              {item.mainQuestion ? (
                                <td rowSpan={item.groupLength} style={tdStyle}>
                                  {item.sno}
                                </td>
                              ) : item.sno ? (
                                <td style={tdStyle}>{item.sno}</td>
                              ) : null}
                              {item.mainQuestion ? (
                                <td colSpan={2} style={{ ...tdStyle }}>
                                  {item.name}
                                </td>
                              ) : (
                                <>
                                  <td style={tdStyle}>{item.name}</td>
                                  <td style={tdStyle}>{renderResponse(item.response, item.response_selected_type)}</td>
                                </>
                              )}
                            </tr>
                          );
                        }
                      })}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </>
  );
}
const thStyle = {
  border: "1px solid #888",
  padding: "8px",
  backgroundColor: "#f0f0f0",
  textAlign: "center",
};

const tdStyle = {
  border: "1px solid #888",
  padding: "8px",
  verticalAlign: "top",
};
export default ViewResponse;

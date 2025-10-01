import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Accordion } from "react-bootstrap";
import { useAuth } from "customHooks";
import { commonService } from "services/common.service";
import { QuestionSetup } from "apiEndpoints/QuestionSetup";
import { Loader, ModalComponent } from "components";
import QuestionListRearrange from "../DnDComponents/QuestionList/SubComponent/QuestionListRearrange";

const QuestionRearrangeModal = ({
  showRearrangeModal,
  createRearrangeClose,
  surveyID,
}) => {
  const [outcomes, setOutcomes] = useState([]);
  const [showLoader, setshowLoader] = useState(false);
  const [sequencingData, setSequencingData] = useState([]);
  const [questionComponentLoading, setQuestionComponentLoading] =
    useState(false);
  const [renderQuestionList, setRenderQuestionList] = useState(false);

  // Importing user data from custom authentication hook
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();

  const fetchQuestion = async (outcomeID) => {
    try {
      const response = await commonService({
        apiEndPoint: QuestionSetup.fetchQuestion,
        queryParams: {
          outcomeID,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status && response?.data?.question?.length > 0) {
        return response?.data?.question;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error add outcome:", error);
    }
  };

  const processOutcome = (outcomeRow) => ({
    id: outcomeRow?.outcomeID,
    outcomeName: outcomeRow?.outcomeName,
    showDataAnalyticsCol: false,
    showOutComes: true,
    isSaved: true,
    isOutcomeTitle: outcomeRow?.isOutcomeTitle,
    outcomeDefinition: outcomeRow?.outcomeDefinition,
    outcomeSequence: outcomeRow?.outcomeSequence,
    outcomeTitleColor: outcomeRow?.outcomeColorCode,
  });

  function convertSurveyData(originalData) {
    // Create a new array to store the converted data
    const convertedData = [];
    // Process each outcome in the original data
    for (const outcome of originalData) {
      // Create a new outcome object with id and questions array
      const newOutcome = {
        outcomeID: outcome.id,
        questions: [],
      };

      if (outcome?.question?.length > 0) {
        for (const question of outcome?.question) {
          newOutcome?.questions?.push(question?.questionNo);
        }
      }
      // Add the new outcome to our result array
      convertedData.push(newOutcome);
    }

    setSequencingData(convertedData);
  }

  async function processOutcomes(responseOutcomes) {
    try {
      // Create an array of promises for parallel API calls
      const questionPromises = responseOutcomes.map(async (outcomeRow) => {
        try {
          if (!outcomeRow?.outcomeID) {
            console.warn("Missing outcomeID for row:", outcomeRow);
            return [];
          }

          const questionData = await fetchQuestion(outcomeRow.outcomeID);
          return {
            ...processOutcome(outcomeRow),
            question: questionData,
          };
        } catch (error) {
          console.error(
            `Error fetching question for outcomeID ${outcomeRow.outcomeID}:`,
            error
          );

          return {
            ...processOutcome(outcomeRow),
            question: [],
          };
        }
      });

      // Wait for all API calls to complete
      const finalOutcome = await Promise.all(questionPromises);
      convertSurveyData(finalOutcome);
      setOutcomes(finalOutcome);
      setshowLoader(false);
      return finalOutcome;
    } catch (error) {
      console.error("Error processing outcomes:", error);
    }
  }

  const fetchOutcome = async () => {
    setshowLoader(true);
    try {
      const response = await commonService({
        apiEndPoint: QuestionSetup.getOutcome,
        queryParams: {
          surveyID,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status && response?.data?.outcome?.length > 0) {
        processOutcomes(response?.data?.outcome);
      } else {
        setshowLoader(false);
      }
    } catch (error) {
      setshowLoader(false);
      console.error("Error add outcome:", error); // Handle error scenarios.
    }
  };

  const RearrangeOutcomes = async (data, isQuestionRearrange, outComeID) => {
    try {
      const response = await commonService({
        apiEndPoint: QuestionSetup.rearrangeOutcomes,
        bodyData: data,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        if (isQuestionRearrange) {
          const questionData = await fetchQuestion(outComeID);
          // eslint-disable-next-line no-use-before-define
          const rearrangedQuestionData = outcomes.map((outcome) =>
            outcome.id === outComeID
              ? { ...outcome, question: questionData }
              : outcome
          );
          setQuestionComponentLoading(false);
          setOutcomes(rearrangedQuestionData);
          setRenderQuestionList((prev) => !prev);
        } else {
          fetchOutcome();
        }
      } else {
        fetchOutcome();
      }
    } catch (error) {
      console.error("Error add outcome:", error); // Handle error scenarios.
    }
  };

  useEffect(() => {
    fetchOutcome();
  }, []);

  const handleDragStartLocal = (e, index) => {
    // Store the index of the dragged item
    e.dataTransfer.setData("draggedItemIndex", index);
  };

  const handleDragOverLocal = (e) => {
    e.preventDefault();
  };

  const handleDropLocal = (e, dropIndex) => {
    const draggedItemIndex = e.dataTransfer.getData("draggedItemIndex");

    if (draggedItemIndex) {
      const draggedItem = outcomes[draggedItemIndex];

      const reorderedOutcomes = [...outcomes];
      reorderedOutcomes[dropIndex] = draggedItem;
      reorderedOutcomes[draggedItemIndex] = outcomes[dropIndex];
      setOutcomes(reorderedOutcomes);
    }

    if (draggedItemIndex) {
      const draggedItem = sequencingData[draggedItemIndex];
      const reorderedOutcomes = [...sequencingData];
      reorderedOutcomes[dropIndex] = draggedItem;
      reorderedOutcomes[draggedItemIndex] = sequencingData[dropIndex];
      setSequencingData(reorderedOutcomes);
      RearrangeOutcomes(
        {
          assessmentID: Number(surveyID),
          sequence: reorderedOutcomes,
        },
        false,
        undefined
      );
    }
  };

  function updateQuestions(data, outcomeID, newQuestions) {
    return data.map((item) =>
      item.outcomeID === outcomeID ? { ...item, questions: newQuestions } : item
    );
  }

  const handleQuestionRearrange = (outComeID, questionArray) => {
    const updatedSequence = updateQuestions(
      sequencingData,
      outComeID,
      questionArray
    );
    setQuestionComponentLoading(true);
    RearrangeOutcomes(
      {
        assessmentID: Number(surveyID),
        sequence: updatedSequence,
      },
      true,
      outComeID
    );
  };

  return (
    <ModalComponent
      modalHeader="Question Rearrange"
      extraClassName="questionRearrangeModal"
      show={showRearrangeModal}
      onHandleCancel={createRearrangeClose}
    >
      <>
        {showLoader ? (
          <Loader />
        ) : (
          <div className="modalAccordion">
            <Accordion>
              {outcomes &&
                outcomes.length > 0 &&
                outcomes.map((outcome, index) => (
                  <Accordion.Item eventKey={index.toString()}>
                    <div
                      key={outcome.id}
                      id="dataanalyticscol"
                      draggable
                      onDragStart={(e) => handleDragStartLocal(e, index)}
                      onDragOver={handleDragOverLocal}
                      onDrop={(e) => handleDropLocal(e, index)}
                    >
                      <Accordion.Header>
                        <div className="d-flex align-items-start gap-2">
                          {outcome?.outcomeName && (
                            <>
                              <div>
                                <div className="d-flex align-items-center">
                                  <em className="icon-drag d-sm-block d-none" />
                                  <h2
                                    className="modalAccordion_Head modalAccordion_Head-blue mb-0"
                                    style={{
                                      color: outcome?.outcomeTitleColor,
                                    }}
                                  >
                                    {outcome?.outcomeName}
                                  </h2>
                                </div>
                                <Link className="modalAccordion_actionBtn">
                                  <em className="icon-collapse-arrow m-0" />
                                </Link>
                              </div>
                            </>
                          )}
                        </div>
                      </Accordion.Header>
                    </div>
                    <Accordion.Body>
                      {outcome && outcome.showOutComes && (
                        <QuestionListRearrange
                          questions={outcome?.question}
                          outcome={outcome}
                          handleQuestionRearrange={handleQuestionRearrange}
                          questionComponentLoading={questionComponentLoading}
                          renderQuestionList={renderQuestionList}
                        />
                      )}
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
            </Accordion>
          </div>
        )}
      </>
    </ModalComponent>
  );
};

export default QuestionRearrangeModal;

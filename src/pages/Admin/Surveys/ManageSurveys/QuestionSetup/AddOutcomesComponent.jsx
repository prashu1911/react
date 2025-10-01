import React, { useEffect, useState, forwardRef } from "react";
import { Accordion, Button } from "react-bootstrap";
import { useAuth } from "customHooks";
import { commonService } from "services/common.service";
import { QuestionSetup } from "apiEndpoints/QuestionSetup";
import { Link } from "react-router-dom";
import { SweetAlert, ModalComponent, Loader } from "components";
import SetupOutCome from "./SetupOutCome";
import OutcomeForm from "./OutcomeForm";
import { useOutCome, useSurveyDataOnNavigations } from "../../../../../customHooks";


const AddOutcomesComponent = forwardRef(
  (
    {
      activeForm,
      setActiveForm,
      handleDrop,
      handleDragOver,
      handleDragLeave,
      surveyID,
      companyID,
      searchTerm,
      addOutcomesRef,
      renderOutComes,
      showPreviewQuestionSetup,
      setCurrentOutcomeValue
    },
    ref
  ) => {
    if (surveyID === null || companyID === null) return null;

    const [outcomes, setOutcomes] = useState([]);
    const [showLoader, setshowLoader] = useState(false);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [showOutcomeForm, setShowOutcomeForm] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [usedCount, setUsedCount] = useState(0);
    const [outComeColors, setOutcomeColor] = useState([]);
    const [selectedOutcomeId, setSelectedOutcomeId] = useState(null);
    const [showcreateExisting, setshowcreateExisting] = useState(false);
    const [editData, setEditData] = useState(null);
    const { setOutCome } = useOutCome();
    // Importing user data from custom authentication hook
    const { getloginUserData } = useAuth();
    const userData = getloginUserData();
    const [renderQuestionList, setRenderQuestionList] = useState(false);
    const [questionComponentLoading, setQuestionComponentLoading] =
      useState(false);
    const [sequencingData, setSequencingData] = useState([]);
    const { dispatcSurveyDataOnNavigateData } = useSurveyDataOnNavigations();
    const { getSurveyDataOnNavigate } = useSurveyDataOnNavigations();
    const surevyData = getSurveyDataOnNavigate();
    const status = surevyData?.survey?.status !== 'Design';

    const deleteModal = (outcomeId) => {
      setSelectedOutcomeId(outcomeId);
      setIsAlertVisible(true);
    };

    const deleteOutcome = async (outcomeId) => {
      setshowLoader(true);
      try {
        const response = await commonService({
          apiEndPoint: QuestionSetup.deleteOutcome,
          bodyData: {
            outcomeID: outcomeId,
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData?.apiToken}`,
          },
        });
        if (response?.status) {
          const updOutcome = outcomes.filter((outcome) => outcome.id !== outcomeId)
          setOutcomes(updOutcome);
          setCurrentOutcomeValue(updOutcome);
        }
      } catch (error) {
        console.error("Error deleting outcome:", error);
      } finally {
        setshowLoader(false);
      }
    };

    const onConfirmAlertModal = async () => {
      setIsAlertVisible(false);
      if (selectedOutcomeId) {
        await deleteOutcome(selectedOutcomeId);
        setSelectedOutcomeId(null);
      }
      return true;
    };

    const createExistingClose = () => {
      setshowcreateExisting(false);
      setEditData(null);
    };

    const handleEditClick = (event, outcome) => {
      event.stopPropagation();

      const colorData = outComeColors.find(
        (data) => data?.colorCode === outcome?.outcomeTitleColor
      );

      setEditData({
        outcomeID: outcome.id,
        outcomeName: outcome.outcomeName,
        outcomeDefinition: outcome.outcomeDefinition,
        outcomeTitleColor: outcome.outcomeTitleColor, // This should be the colorID
        colorData,
      });
      setshowcreateExisting(true);
    };

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

    const fetchQuestionCount = async () => {
      try {
        const response = await commonService({
          apiEndPoint: QuestionSetup.fetchQuestionCount,
          queryParams: {
            surveyID,
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData?.apiToken}`,
          },
        });
        if (response?.status) {
          setTotalCount(response?.data?.totalCount);
          setUsedCount(response?.data?.usedCount);
          if (response?.data?.totalCount === response?.data?.usedCount) {
            dispatcSurveyDataOnNavigateData({
              survey:surevyData?.survey,
              companyID: surevyData?.companyID,
              rangeStart: surevyData?.rangeStart,
              rangeEnd: surevyData?.rangeEnd,
              isSlider: surevyData?.isSlider,
              status: surevyData?.status,
              isExceed: true,
              maxQuestionList: response?.data?.totalCount
            });

          }

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
        setCurrentOutcomeValue(finalOutcome)
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
          dispatcSurveyDataOnNavigateData({
            survey:surevyData?.survey,
            companyID: response?.data?.range?.company_id,
            rangeStart: response?.data?.range.weightage_start,
            rangeEnd: response?.data?.range.weightage_end,
            isSlider: response?.data?.range.is_slider,
            status: response?.data?.range?.status,
            isExceed: false
          });
          processOutcomes(response?.data?.outcome);
        } else {
          setshowLoader(false);
        }
      } catch (error) {
        setshowLoader(false);
        console.error("Error add outcome:", error); // Handle error scenarios.
      }
    };

    const fetchOutcomeTitleColor = async () => {
      try {
        const response = await commonService({
          apiEndPoint: QuestionSetup.getOutcomeColor,

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData?.apiToken}`,
          },
        });
        if (response?.status) {
          setOutcomeColor(
            response?.data?.color.map((data) => ({
              value: data?.colorID,
              label: data?.colorName,
              colorCode: data?.colorCode,
            }))
          );
        } else {
          setOutcomeColor([]);
        }
      } catch (error) {
        console.error("Error add outcome:", error); // Handle error scenarios.
      }
    };

    function updateOutcomeQuestions(outcomeData, idToUpdate, newQuestions) {
      return outcomeData.map((outcome) => {
        if (outcome.id === idToUpdate) {
          return {
            ...outcome,
            question: newQuestions,
          };
        }
        return outcome;
      });
    }

    const updateQuestionListByOutComeID = async (id) => {
      const newQuestionData = await fetchQuestion(id);
      const updatedOutcome = updateOutcomeQuestions(
        outcomes,
        id,
        newQuestionData
      );
      fetchQuestionCount();
      setOutcomes(updatedOutcome);
      setCurrentOutcomeValue(updatedOutcome)
      setRenderQuestionList((prev) => !prev);
    };

    useEffect(() => {
      fetchOutcome();
      fetchQuestionCount();
      fetchOutcomeTitleColor();
    }, [renderOutComes, showPreviewQuestionSetup]);

    const handleDragStartLocal = (e, index) => {
      // Store the index of the dragged item
      e.dataTransfer.setData("draggedItemIndex", index);
    };

    const handleDragOverLocal = (e) => {
      e.preventDefault();
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
            const rearrangedQuestionData = filteredOutcomes.map((outcome) =>
              outcome.id === outComeID
                ? { ...outcome, question: questionData }
                : outcome
            );
            setQuestionComponentLoading(false);
            setOutcomes(rearrangedQuestionData);
            setCurrentOutcomeValue(rearrangedQuestionData)
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

    const handleDropLocal = (e, dropIndex) => {
      // const draggedItemIndex = e.dataTransfer.getData("draggedItemIndex");

      let draggedItemIndex = parseInt(
        e.dataTransfer.getData("draggedItemIndex"),
        10
      );
      // eslint-disable-next-line no-restricted-globals
      if (isNaN(draggedItemIndex) || draggedItemIndex === dropIndex) return;

      if (draggedItemIndex || draggedItemIndex === 0) {
        const draggedItem = outcomes[draggedItemIndex];
        const reorderedOutcomes = [...outcomes];
        reorderedOutcomes[dropIndex] = draggedItem;
        reorderedOutcomes[draggedItemIndex] = outcomes[dropIndex];
        setOutcomes(reorderedOutcomes);
        rearrangedQuestionData(reorderedOutcomes)
      }

      if (draggedItemIndex || draggedItemIndex === 0) {
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

    // Prevent accordion from opening and set the outcome to delete
    const handleDeleteClick = (event, outcomeId) => {
      event.stopPropagation();
      if (!status) {
        deleteModal(outcomeId);

      }

    };

    const handleSaveOutcome = async () => {
      await fetchOutcome(); // Refresh the outcomes list
      setShowOutcomeForm(false);
      setshowcreateExisting(false); // Close the edit modal
      setEditData(null); // Reset edit data
    };

    const handleSelect = (key) => {
      const selectedData = outcomes[key];

      if (selectedData && Object.keys(selectedData).length > 0) {
        setOutCome(selectedData?.id);
      } else {
        setOutCome(null);
      }
    };

    const filteredOutcomes = outcomes.filter((outcome) => {
      if (!searchTerm) return true;

      const searchLower = searchTerm.toLowerCase();
      return (
        outcome.outcomeName?.toLowerCase().includes(searchLower) ||
        outcome.outcomeDefinition?.toLowerCase().includes(searchLower)
      );
    });

    function updateQuestions(data, outcomeID, newQuestions) {
      return data.map((item) =>
        item.outcomeID === outcomeID
          ? { ...item, questions: newQuestions }
          : item
      );
    }

    const handleQuestionRearrange = async (outComeID, questionArray) => {
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
      <div ref={ref}>
        {showLoader ? (
          <Loader />
        ) : (
          <div className="dataAnalyticsCol">
            <Accordion onSelect={handleSelect}>
              {filteredOutcomes &&
                filteredOutcomes.length > 0 &&
                filteredOutcomes.map((outcome, index) => (
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
                          {outcome?.outcomeName ? (
                            <>
                              <div>
                                <div className="d-flex align-items-center mb-xxl-3 mb-2 flex-wrap pe-sm-0 pe-5 me-sm-0 me-3">
                                  <em className="icon-drag d-sm-block d-none" />
                                  <h2
                                    className="dataAnalyticsCol_Head dataAnalyticsCol_Head_blue mb-0"
                                    style={{
                                      color: outcome?.outcomeTitleColor,
                                      wordBreak: "break-word",
                                      overflowWrap: "break-word",
                                    }}
                                  >
                                    {outcome?.outcomeName}
                                  </h2>
                                </div>
                                <p
                                  className="mb-0 dataAnalyticsCol_Para"
                                  style={{
                                    wordBreak: "break-word",
                                    overflowWrap: "break-word",
                                  }}
                                >
                                  {outcome?.outcomeDefinition}
                                </p>
                              </div>
                              <div className="d-flex align-items-center gap-lg-3 gap-2 dataAnalyticsCol_actionBtn">
                                <Link
                                  aria-label="Edit icon"
                                  onClick={(event) =>
                                    handleEditClick(event, outcome)
                                  }
                                >
                                  <em className="icon-table-edit" />
                                </Link>
                                <Link
                                  aria-label="Delete icon"
                                  onClick={(event) => {
                                    handleDeleteClick(event, outcome.id);
                                  }}
                                >
                                  <em className="icon-delete" />
                                </Link>
                                <Link aria-label="collapse arrow icon">
                                  <em className="icon-collapse-arrow" />
                                </Link>
                              </div>
                            </>
                          ) : (
                            !outcome?.isSaved && (
                              <>
                                {" "}
                                <div>
                                  <div className="d-flex align-items-center mb-xxl-3 mb-2 flex-wrap pe-sm-0 pe-5 me-sm-0 me-3">
                                    <h2 className="dataAnalyticsCol_Head dataAnalyticsCol_Head_blue mb-0">
                                      {`New outcome ${index + 1}`}
                                    </h2>
                                  </div>
                                </div>
                              </>
                            )
                          )}
                          <></>
                        </div>
                      </Accordion.Header>
                    </div>
                    <Accordion.Body>
                      {outcome && outcome.showOutComes && (
                        <SetupOutCome
                          activeForm={activeForm}
                          setActiveForm={setActiveForm}
                          handleDrop={handleDrop}
                          handleDragOver={handleDragOver}
                          handleDragLeave={handleDragLeave}
                          outcome={outcome}
                          surveyID={surveyID}
                          companyID={companyID}
                          updateQuestionListByOutComeID={
                            updateQuestionListByOutComeID
                          }
                          totalCount={totalCount}
                          usedCount={usedCount}
                          renderQuestionList={renderQuestionList}
                          handleQuestionRearrange={handleQuestionRearrange}
                          questionComponentLoading={questionComponentLoading}
                        />
                      )}
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
            </Accordion>
          </div>
        )}

        {showOutcomeForm ? (
          <OutcomeForm
            handleSaveOutcome={handleSaveOutcome}
            onCancel={() => setShowOutcomeForm(false)}
            outComeColors={outComeColors}
            surveyID={surveyID}
            companyID={companyID}
          />
        ) : (
          <div
            ref={addOutcomesRef}
            className="addOutcomes text-center d-flex align-items-center flex-column mt-0"
            id="addOutcomes"
          >
            <Button
              className="ripple-effect"
              onClick={() => setShowOutcomeForm((prev) => !prev)}
              disabled={status}
            >
              <em className="icon-plus" /> Add Outcomes
            </Button>
          </div>
        )}

        <ModalComponent
          modalHeader="Edit Outcome"
          extraClassName="editOutcomeModal"
          show={showcreateExisting}
          onHandleCancel={createExistingClose}
        >
          <OutcomeForm
            handleSaveOutcome={handleSaveOutcome}
            currentOutcomeId={editData?.outcomeID}
            outComeColors={outComeColors}
            onCancel={createExistingClose}
            isEdit={!!editData}
            editData={editData}
            status={status}
          />
        </ModalComponent>

        <SweetAlert
          title="Are you sure?"
          text="You want to delete this data!"
          show={isAlertVisible}
          icon="warning"
          onConfirmAlert={onConfirmAlertModal}
          showCancelButton
          cancelButtonText="Cancel"
          confirmButtonText="Yes"
          setIsAlertVisible={setIsAlertVisible}
          isConfirmedTitle="Deleted!"
          isConfirmedText="Outcome deleted successfully."
        />
      </div>
    );
  }
);

export default AddOutcomesComponent;

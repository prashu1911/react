import { ModalComponent } from 'components';
import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';

export default function FavorabilityObjectPointModal({
  ShowObjectPointModal,
  setShowObjectPointModal,
  formData,
  setFormData,
  objectControlList,
  limit,
  ChangesTrue
}) {
  const [ObjectControlList, setObjectControlList] = useState(objectControlList);
  const [selectAll, setSelectAll] = useState(false);
  const [clearAll, setClearAll] = useState(false);


  // ✅ Count how many outcomes are selected
  const totalSelected = ObjectControlList?.reduce((count, outcome) => {
    if (outcome.selected) count += 1;

    outcome.intentions?.forEach((intention) => {
      if (intention.selected) count += 1;

      intention.questions?.forEach((question) => {
        if (question.selected) count += 1;
      });
    });

    return count;
  }, 0);

  const isLimitReached = limit && totalSelected >= 2;


  const handleSelectAll = () => {
    setSelectAll(true);
    setClearAll(false);
  
    const updatedData = ObjectControlList.map(outcome => ({
      ...outcome,
      selected: true,
      intentions: outcome.intentions.map(intention => ({
        ...intention,
        selected: true,
        questions: intention.questions.map(question => ({
          ...question,
          selected: true
        }))
      }))
    }));
  
    setObjectControlList(updatedData);
  };
  
  const handleClearAll = () => {
    setSelectAll(false);
    setClearAll(true);
  
    const updatedData = ObjectControlList.map(outcome => ({
      ...outcome,
      selected: false,
      intentions: outcome.intentions.map(intention => ({
        ...intention,
        selected: false,
        questions: intention.questions.map(question => ({
          ...question,
          selected: false
        }))
      }))
    }));
  
    setObjectControlList(updatedData);
  };

  useEffect(() => {
    const allSelected = ObjectControlList.every(outcome =>
      outcome.selected &&
      outcome.intentions.every(intention =>
        intention.selected && intention.questions.every(q => q.selected)
      )
    );
  
    const anySelected = ObjectControlList.some(outcome =>
      outcome.selected ||
      outcome.intentions.some(intention =>
        intention.selected || intention.questions.some(q => q.selected)
      )
    );
  
    setSelectAll(allSelected);
    setClearAll(!anySelected);
  }, [ObjectControlList]);
  


  const handleCheckboxChange = (index, value) => {
    setObjectControlList(prev => {
      const updatedData = [...prev];
      updatedData[index].selected = value;

      if (!value) {
        // Unselect all intentions and their questions
        updatedData[index].intentions = updatedData[index].intentions.map(intention => ({
          ...intention,
          selected: false,
          questions: intention.questions?.map(q => ({ ...q, selected: false })) || [],
        }));
      }

      return updatedData;
    });
  };




  const handleIntentionCheckboxChange = (index, intentionsIndex, value) => {
    setObjectControlList(prev => {
      const updatedData = [...prev];
      updatedData[index].intentions[intentionsIndex].selected = value;

      if (!value) {
        // Unselect all questions under this intention
        updatedData[index].intentions[intentionsIndex].questions =
          updatedData[index].intentions[intentionsIndex].questions.map(q => ({
            ...q,
            selected: false,
          }));
      }

      // If selecting, ensure parent outcome is selected
      if (value) {
        updatedData[index].selected = true;
      }

      return updatedData;
    });
  };




  const handleQuestionCheckboxChange = (index, intentionsIndex, questionIndex, value) => {
    setObjectControlList(prev => {
      const updatedData = [...prev];
      updatedData[index].intentions[intentionsIndex].questions[questionIndex].selected = value;

      // Auto-select parents if selected
      if (value) {
        updatedData[index].intentions[intentionsIndex].selected = true;
        updatedData[index].selected = true;
      }
      return updatedData;
    });
  };



  const handleSave = () => {
    // const selectedTornadoDatasets = ObjectControlList.filter(item => item.selected).slice(0, 2).map((item, i) => ({
    //   id: parseInt(item.outcome_id),
    //   dataPointType: 'outcome',
    //   name: item.outcome_name,
    //   control: i === 0, // first selected = control
    // }));


    ChangesTrue()
    if (limit) {
      const selectedTornadoDatasets = [];

      ObjectControlList.forEach((outcome) => {
        let isSelected = false;

        if (outcome.selected) {
          isSelected = true;
          selectedTornadoDatasets.push({
            id: parseInt(outcome.outcome_id),
            dataPointType: "Outcome", // Can be changed dynamically if you track types
            name: outcome.outcome_name,
            control: false
          });
        }

        outcome.intentions?.forEach((intention) => {
          if (intention.selected) {
            isSelected = true;

            selectedTornadoDatasets.push({
              id: parseInt(intention?.intention_id),
              dataPointType: "Intention", // Can be changed dynamically if you track types
              name: intention?.intention_name,
              control: false
            });
          }

          intention.questions?.forEach((question) => {
            if (question.selected) {
              isSelected = true;
              selectedTornadoDatasets.push({
                id: parseInt(question.question_id),
                dataPointType: "Question", // Can be changed dynamically if you track types
                name: question?.question,
                control: false
              });
            }
          });
        });
      });

      if (limit == 2) {

        setFormData({
          ...formData,
          objectControlList: ObjectControlList,
          selectedTornadoDatasets: selectedTornadoDatasets,
        });
      } else {

        setFormData({
          ...formData,
          objectControlList: ObjectControlList,
        });
      }


    } else {
      setFormData({
        ...formData,
        objectControlList: ObjectControlList,
      });

    }




    setShowObjectPointModal(false);
  };

  const objectControlClose = () => setShowObjectPointModal(false);

  return (
    <ModalComponent modalHeader="Object Control Panel" size="lg" show={ShowObjectPointModal} onHandleCancel={objectControlClose}>
      <p className="mb-2">Outcome, Intention and Question Selection</p>
      
      <div className="d-flex gap-3 mb-3">
        <Form.Check
          type="checkbox"
          checked={selectAll}
          label={<div style={{ color: "#000", fontSize: '14px', marginTop:'0.2rem' }} className="primary-color">Select All</div>}
          onChange={() => {
            if (!selectAll) {
              handleSelectAll()
            } else {
              handleClearAll()
            }
          }}
        />
      </div>
      <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <div className="table-responsive datatable-wrap actionPlanTable">
          

          
          <table className="table reportTable">
            <tbody>
              {Array.isArray(ObjectControlList) &&
                ObjectControlList.map((item, index) => (
                  <React.Fragment key={index}>
                    <tr >
                      <td className="w-1">
                        {/* <Form.Check
                          className="mb-0"
                          type="checkbox"
                          checked={item.selected}
                          disabled={!item.selected && isLimitReached}
                          onChange={() => handleCheckboxChange(index, !item.selected)}
                          label={<div className="primary-color"></div>}
                        /> */}
                      </td>
                      <td colSpan={3}>
                        <label>
                          <strong>{item?.outcome_name}</strong>
                        </label>
                      </td>
                    </tr>
                    {item?.intentions?.map((intentions, intentionsIndex) => (
                      <React.Fragment key={intentionsIndex}>
                        <tr style={{cursor:'pointer'}} onClick={()=>{handleIntentionCheckboxChange(index, intentionsIndex, !intentions.selected)}}>
                          <td className="w-1"></td>
                          <td className="w-1">
                            <Form.Check
                              checked={intentions.selected}
                              disabled={!intentions.selected && isLimitReached}
                              className="mb-0"
                              type="checkbox"
                              label={<div className="primary-color"></div>}
                            />
                          </td>
                          <td colSpan={3}>
                            <label>{intentions?.intention_name}</label>
                          </td>
                        </tr>
                        {intentions?.questions?.map((questions, questionsIndex) => (
                          <tr key={questionsIndex} style={{cursor:'pointer'}} onClick={()=>{handleQuestionCheckboxChange(index, intentionsIndex, questionsIndex, !questions.selected)}}>
                            <td className="w-1"></td>
                            <td className="w-1"></td>
                            <td className="w-1">
                              <Form.Check
                                checked={questions.selected}
                                className="mb-0"
                                type="checkbox"
                                disabled={!questions.selected && isLimitReached}
                                label={<div className="primary-color"></div>}
                              />
                            </td>
                            <td>
                              <label>{questions?.question}</label>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </React.Fragment>
                ))}
            </tbody>
          </table>
        </div>

      </div>
      <div style={{ marginTop: '1rem', marginBottom: '-1rem' }} className="d-flex justify-content-end gap-2">
        <Button onClick={handleSave} variant="primary" className="ripple-effect">
          Save
        </Button>
        <Button variant="secondary" className="ripple-effect" onClick={objectControlClose}>
          Cancel
        </Button>
      </div>
    </ModalComponent>
  );
}

import { ModalComponent } from 'components';
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

export default function ObjectPointModal({
  ShowObjectPointModal,
  setShowObjectPointModal,
  formData,
  setFormData,
  objectControlList,
  limit = 0,
  ChangesTrue
}) {
  const [ObjectControlList, setObjectControlList] = useState(objectControlList);
  const [selectAll, setSelectAll] = useState(false);
  const [clearAll, setClearAll] = useState(false);


  const updateSelectionState = (updatedList) => {
    const totalItems = updatedList.reduce((acc, outcome) => {
      return acc +
        (outcome.selected ? 1 : 0) +
        outcome.intentions.reduce((accInt, intn) => {
          return accInt +
            (intn.selected ? 1 : 0) +
            intn.questions.filter(q => q.selected).length;
        }, 0);
    }, 0);

    const totalPossible = updatedList.reduce((acc, outcome) => {
      return acc +
        1 + // outcome
        outcome.intentions.length +
        outcome.intentions.reduce((accInt, intn) => accInt + intn.questions.length, 0);
    }, 0);

    setSelectAll(totalItems === totalPossible);
    setClearAll(totalItems === 0);
  };

  const handleCheckboxChange = (index, value) => {
    const updatedData = [...ObjectControlList];
    updatedData[index].selected = value;
    setObjectControlList(updatedData);
    updateSelectionState(updatedData);
  };

  const handleIntentionCheckboxChange = (index, intentionsIndex, value) => {
    const updatedData = [...ObjectControlList];
    updatedData[index].intentions[intentionsIndex].selected = value;
    setObjectControlList(updatedData);
    updateSelectionState(updatedData);
  };

  const handleQuestionCheckboxChange = (index, intentionsIndex, questionIndex, value) => {
    const updatedData = [...ObjectControlList];
    updatedData[index].intentions[intentionsIndex].questions[questionIndex].selected = value;
    setObjectControlList(updatedData);
    updateSelectionState(updatedData);
  };

  const handleSelectAll = () => {
    const updatedData = ObjectControlList.map(outcome => ({
      ...outcome,
      selected: true,
      intentions: outcome.intentions.map(intn => ({
        ...intn,
        selected: true,
        questions: intn.questions.map(q => ({ ...q, selected: true }))
      }))
    }));
    setObjectControlList(updatedData);
    setSelectAll(true);
    setClearAll(false);
  };

  const handleClearAll = () => {
    const updatedData = ObjectControlList.map(outcome => ({
      ...outcome,
      selected: false,
      intentions: outcome.intentions.map(intn => ({
        ...intn,
        selected: false,
        questions: intn.questions.map(q => ({ ...q, selected: false }))
      }))
    }));
    setObjectControlList(updatedData);
    setClearAll(true);
    setSelectAll(false);
  };

  const handleSave = () => {
    ChangesTrue();
    if (limit) {
      const selectedTornadoDatasets = [];

      ObjectControlList.forEach((outcome) => {
        if (outcome.selected) {
          selectedTornadoDatasets.push({
            id: parseInt(outcome.outcome_id),
            dataPointType: "Outcome",
            name: outcome.outcome_name,
            control: false
          });
        }

        outcome.intentions?.forEach((intention) => {
          if (intention.selected) {
            selectedTornadoDatasets.push({
              id: parseInt(intention.intention_id),
              dataPointType: "Intention",
              name: intention.intention_name,
              control: false
            });
          }

          intention.questions?.forEach((question) => {
            if (question.selected) {
              selectedTornadoDatasets.push({
                id: parseInt(question.question_id),
                dataPointType: "Question",
                name: question.question,
                control: false
              });
            }
          });
        });
      });

      setFormData({
        ...formData,
        objectControlList: ObjectControlList,
        selectedTornadoDatasets: limit === 2 ? selectedTornadoDatasets : undefined
      });
    } else {
      setFormData({
        ...formData,
        objectControlList: ObjectControlList
      });
    }

    setShowObjectPointModal(false);
  };

  const totalSelected = ObjectControlList?.reduce((count, outcome) => {
    if (outcome.selected) count += 1;
    outcome.intentions?.forEach(intention => {
      if (intention.selected) count += 1;
      intention.questions?.forEach(q => {
        if (q.selected) count += 1;
      });
    });
    return count;
  }, 0);







  const objectControlClose = () => setShowObjectPointModal(false);

  return (
    <ModalComponent modalHeader="Object Control Panel" size="lg" show={ShowObjectPointModal} onHandleCancel={objectControlClose}>
      <p className="mb-2">Outcome, Intention and Question Selection</p>

      {limit == 0 && <div className="d-flex gap-3 mb-3">
        <Form.Check
          type="checkbox"
          checked={selectAll}
          label={<div style={{ color: "#000", fontSize: '14px' }} className="primary-color">Select All</div>}
          onChange={() => {
            if (!selectAll) {
              handleSelectAll()
            } else {
              handleClearAll()
            }
          }}
        />
      </div>}

      <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <div className="table-responsive datatable-wrap actionPlanTable">
          <table className="table reportTable">
            <tbody>
              {ObjectControlList?.map((item, index) => (
                <React.Fragment key={index}>
                  <tr
                    style={{
                      cursor: (!item.selected && limit > 0 && totalSelected >= limit) ? 'not-allowed' : 'pointer',
                      opacity: (!item.selected && limit > 0 && totalSelected >= limit) ? 0.4 : 1, // Reduced opacity if disabled
                    }}
                    onClick={() => {
                      if (!item.selected && limit > 0 && totalSelected >= limit) return; // 🔒 Prevent click
                      handleCheckboxChange(index, !item.selected);
                    }}
                  >
                    <td className="w-1">
                      <Form.Check
                        className="mb-0"
                        type="checkbox"
                        checked={item.selected}
                        disabled={!item.selected && limit > 0 && totalSelected >= limit}
                        // onChange={() => handleCheckboxChange(index, !item.selected)}
                        label={<div className="primary-color"></div>}
                      />
                    </td>
                    <td colSpan={3}>
                      <strong>{item.outcome_name}</strong>
                    </td>
                  </tr>
                  {item?.intentions?.map((intentions, iIndex) => (
                    <React.Fragment key={iIndex}>
                      <tr
                        style={{
                          cursor: (!intentions.selected && limit > 0 && totalSelected >= limit) ? 'not-allowed' : 'pointer',
                          opacity: (!intentions.selected && limit > 0 && totalSelected >= limit) ? 0.4 : 1, // Reduced opacity if disabled
                        }}
                        onClick={() => {
                          if (!intentions.selected && limit > 0 && totalSelected >= limit) return; // 🔒 Prevent click
                          handleIntentionCheckboxChange(index, iIndex, !intentions.selected)
                        }}
                      >
                        <td className="w-1"></td>
                        <td className="w-1">
                          <Form.Check
                            className="mb-0"
                            type="checkbox"
                            checked={intentions.selected}
                            disabled={!intentions.selected && limit > 0 && totalSelected >= limit}
                            label={<div className="primary-color"></div>}
                          />

                        </td>
                        <td colSpan={3}>{intentions.intention_name}</td>
                      </tr>
                      {intentions?.questions?.map((questions, qIndex) => (
                        <tr key={qIndex}
                          style={{
                            cursor: (!questions.selected && limit > 0 && totalSelected >= limit) ? 'not-allowed' : 'pointer',
                            opacity: (!questions.selected && limit > 0 && totalSelected >= limit) ? 0.4 : 1, // Reduced opacity if disabled
                          }}
                          onClick={() => {
                            if (!questions.selected && limit > 0 && totalSelected >= limit) return; // 🔒 Prevent click
                            handleQuestionCheckboxChange(index, iIndex, qIndex, !questions.selected);
                          }}
                        >
                          <td className="w-1"></td>
                          <td className="w-1"></td>
                          <td className="w-1">
                            <Form.Check
                              className="mb-0"
                              type="checkbox"
                              checked={questions.selected}
                              disabled={!questions.selected && limit > 0 && totalSelected >= limit}
                              label={<div className="primary-color"></div>}
                            />

                          </td>
                          <td>{questions.question}</td>
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

      <div className="d-flex justify-content-end gap-2 mt-3">
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

import { ModalComponent } from 'components';
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

export default function HeatmapObjectPointModal({
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


  const handleSelectAllChange = (checked) => {
    const updated = ObjectControlList.map(outcome => ({
      ...outcome,
      // selected: checked,
      intentions: outcome.intentions.map(intention => ({
        ...intention,
        selected: checked,
        questions: intention.questions.map(q => ({ ...q, selected: checked }))
      }))
    }));
    setObjectControlList(updated);
    setSelectAll(checked);
    setClearAll(false);
  };

  const handleClearAllChange = (checked) => {
    const updated = ObjectControlList.map(outcome => ({
      ...outcome,
      selected: false,
      intentions: outcome.intentions.map(intention => ({
        ...intention,
        selected: false,
        questions: intention.questions.map(q => ({ ...q, selected: false }))
      }))
    }));
    setObjectControlList(updated);
    setClearAll(checked);
    setSelectAll(false);
  };



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


  const handleIntentionCheckboxChange = (index, intentionsIndex, value) => {
    if (value) {
      setClearAll(false)
    }
    if (!value) {
      setSelectAll(false)
    }
    setObjectControlList(prev => {
      const updatedData = [...prev];
      const intention = updatedData[index].intentions[intentionsIndex];
      intention.selected = value;

      // If intention is unselected, unselect all questions
      if (!value) {
        intention.questions = intention.questions.map(q => ({
          ...q,
          selected: false
        }));
      }

      return updatedData;
    });
  };


  const handleQuestionCheckboxChange = (index, intentionsIndex, questionIndex, value) => {
    if (value) {
      setClearAll(false)
    }
    if (!value) {
      setSelectAll(false)
    }
    setObjectControlList(prev => {
      const updatedData = [...prev];
      const questions = updatedData[index].intentions[intentionsIndex].questions;

      // Update the selected state of the question
      questions[questionIndex].selected = value;

      // If any question is selected, set the intention to selected
      const anySelected = questions.some(q => q.selected);
      if (anySelected) {

        updatedData[index].intentions[intentionsIndex].selected = anySelected;
      }

      return updatedData;
    });
  };


  const handleSave = () => {
    console.log("ObjectControlList", ObjectControlList);

    ChangesTrue()
    setFormData({
      ...formData,
      objectControlList: ObjectControlList,
    });
    setShowObjectPointModal(false);
  };

  const objectControlClose = () => setShowObjectPointModal(false);

  return (
    <ModalComponent modalHeader="Object Control Panel" size="lg" show={ShowObjectPointModal} onHandleCancel={objectControlClose}>
      <p className="mb-2">Outcome, Intention and Question Selection</p>
      <div style={{ maxHeight: '500px', overflowY: 'auto' }}>

        <div className="d-flex gap-3 align-items-center mb-3">
          <Form.Check
            type="checkbox"
            label={<div style={{ color: "#000", fontSize: '14px', marginTop:'0.2rem' }} className="primary-color">Select All</div>}
            checked={selectAll}
            onChange={
              (e) => {
                if (!selectAll) {
                  handleSelectAllChange(e.target.checked)
                } else {
                  handleClearAllChange(e.target.checked)
                }
              }}
          />
        </div>


        <div className="table-responsive datatable-wrap actionPlanTable">
          <table className="table reportTable">
            <tbody>
              {Array.isArray(ObjectControlList) &&
                ObjectControlList.map((item, index) => (
                  <React.Fragment key={index}>
                    <tr>
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
                              onChange={() =>
                                handleIntentionCheckboxChange(index, intentionsIndex, !intentions.selected)
                              }
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
                                onChange={() =>
                                  handleQuestionCheckboxChange(index, intentionsIndex, questionsIndex, !questions.selected)
                                }
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

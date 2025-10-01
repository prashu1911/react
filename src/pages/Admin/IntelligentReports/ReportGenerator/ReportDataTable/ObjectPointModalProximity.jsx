import { ModalComponent } from 'components';
import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';

export default function ObjectPointModalProximity({
  ShowObjectPointModal,
  setShowObjectPointModal,
  formData,
  setFormData,
  objectControlList,
  limit,
  ChangesTrue,
  SelectedIntentions,
   getSelectedQuestionCount,
   setMaxLimit
}) {
  const [ObjectControlList, setObjectControlList] = useState(objectControlList);

  const [selectAll, setSelectAll] = useState(false);
  const [clearAll, setClearAll] = useState(false);

  console.log("objectControlList", objectControlList);
  

  const handleSelectAll = () => {
    setSelectAll(true);
    setClearAll(false);
  
    const updatedData = ObjectControlList.map(outcome => ({
      ...outcome,
      // selected: true,
      intentions: outcome.intentions.map(intention => ({
        ...intention,
        // selected: true,

        ...(intention?.intention_id.split("~")[1]!=SelectedIntentions?.value && { questions: intention.questions.map(question => ({
          ...question,
          selected:  true
        }))
       }),



        
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

  const handleQuestionCheckboxChange = (index, intentionsIndex, questionIndex, value) => {
    if (value) {
      setClearAll(false)
    }else if (!value) {
      setSelectAll(false)
    }
    setObjectControlList(prev => {
      const updatedData = [...prev];
      updatedData[index].intentions[intentionsIndex].questions[questionIndex].selected = value;
      return updatedData;
    });
  };

  const handleSave = () => {

    ChangesTrue()
    const count=getSelectedQuestionCount(ObjectControlList)
    setMaxLimit(count)
    if (count<formData?.importanceLimit) {
      setFormData({
        ...formData,
        objectControlList: ObjectControlList,
        importanceLimit:count
      });
      
    }else{
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
          label={<div style={{ color: "#000", fontSize: '14px' }} className="primary-color">Select All</div>}
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
                  {(item?.intentions&& item?.intentions?.filter(item => item?.intention_id.split("~")[1]!=SelectedIntentions?.value)?.length>0) && <tr>
                    <td className="w-1">
                    </td>
                    <td colSpan={3}>
                      <label>
                        <strong>{item?.outcome_name}</strong>
                      </label>
                    </td>
                  </tr>}
                  {item?.intentions?.map((intentions, intentionsIndex) => (
                    <>
                    {intentions?.intention_id.split("~")[1]!=SelectedIntentions?.value &&
                    <React.Fragment key={intentionsIndex}>
                      <tr>
                        <td className="w-1"></td>
                        <td className="w-1">
                        </td>
                        <td colSpan={3}>
                          <label>{intentions?.intention_name}</label>
                        </td>
                      </tr>
                      {intentions?.questions?.map((questions, questionsIndex) => (
                        <tr  key={questionsIndex} style={{ lineHeight: "0.5", alignItems:'center', cursor:'pointer' }} onClick={()=>{handleQuestionCheckboxChange(index, intentionsIndex, questionsIndex, !questions.selected)}}>
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
                            <label style={{lineHeight:'1rem', marginTop:'0.1rem'}}>{questions?.question}</label>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                     }
                    </>
                  ))}
                </React.Fragment>
              ))}
          </tbody>
        </table>
      </div>
      </div>
      <div style={{marginTop:'1rem', marginBottom:'-1rem'}} className="d-flex justify-content-end gap-2">
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

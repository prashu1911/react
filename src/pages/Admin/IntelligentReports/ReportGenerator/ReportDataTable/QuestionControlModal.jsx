import { ModalComponent } from 'components';
import React, { useRef, useState } from 'react';
import { Button, Form } from 'react-bootstrap';

export default function QuestionControlModal({ ChangesTrue, ShowQuestionModal, setShowQuestionModal, formData, setFormData, questionControlList }) {
    const [QuestionControlList, setQuestionControlList] = useState(questionControlList);
    const [selectAll, setSelectAll] = useState(false);

    const checkboxesRef = useRef([]); // Ref for all checkboxes

    // Select All logic – updates state too
    const handleSelectAll = (e) => {
        const isChecked = e.target.checked;
        setSelectAll(isChecked)

        // Update checkbox refs visually (optional if you're using controlled components)
        checkboxesRef.current.forEach((checkbox) => {
            if (checkbox) checkbox.checked = isChecked;
        });

        // Update selected flag in state
        setQuestionControlList((prevList) =>
            prevList.map((item) => ({
                ...item,
                selected: isChecked
            }))
        );
    };

    const handleCheckboxChange = (id) => {
        const updatedList = QuestionControlList.map((item) =>
            item.id === id ? { ...item, selected: !item.selected } : item
        );

        // Update state
        setQuestionControlList(updatedList);

        // Set selectAll to false if any item is not selected
        const allSelected = updatedList.every((item) => item.selected);
        setSelectAll(allSelected);
    };

    const handleSave = () => {
        ChangesTrue()
        setFormData({
            ...formData,
            questionControlList: QuestionControlList
        });
        setShowQuestionModal(false);
    };

    return (
        <ModalComponent modalHeader="Question Control Panel" size={'lg'} show={ShowQuestionModal} onHandleCancel={() => { setShowQuestionModal(false) }}>
            <div className="table-responsive datatable-wrap actionPlanTable">
                <table className="table reportTable">
                    <thead>
                        <tr style={{ cursor: 'pointer', borderTop: 'none', borderBottom: '1px solid #E6E6E6' }} onClick={handleSelectAll}>
                            <th className='w-1'>
                                <Form.Check className='mb-0' id='selectAll'
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                    label={<div style={{ color: '#000', fontSize: '14px', width: '20rem' }} className="primary-color">Select All</div>} />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr >
                            <td style={{ paddingLeft: '1.5rem' }} colSpan={3}><strong>OEQ Questions</strong></td>
                        </tr>
                        {QuestionControlList?.filter(q => q.questionType === 'oeq')?.length === 0 &&
                            <div style={{ width: '300%' }} className="alert alert-warning mb-3">
                                No OEQ question is present
                            </div>
                        }
                        {QuestionControlList?.filter(q => q.questionType === 'oeq').map((item, index) => (
                            <tr style={{ cursor: "pointer", marginLeft: '16px' }} onClick={() => { handleCheckboxChange(item.id) }} key={`oeq-${item.id}`}>
                                <td style={{ paddingLeft: '1.5rem' }} className='w-1'>
                                    <Form.Check className='mb-0' id={`questCheck-${item.id}`} type="checkbox" checked={item.selected}
                                        onChange={() => handleCheckboxChange(item?.id)}
                                        label={<div className="primary-color" />} />
                                </td>
                                <td colSpan={2}><label htmlFor={`questCheck-${item.id}`}>{item?.question}</label></td>
                            </tr>

                        ))}
                        <tr style={{ marginLeft: '-16px' }}>
                            <td style={{ paddingLeft: '1.5rem' }} colSpan={3}><strong>RBOEQ Questions</strong></td>
                        </tr>
                        {QuestionControlList?.filter(q => q.questionType === 'rboeq')?.length === 0 &&
                            <div style={{ width: '300%' }} className="alert alert-warning mb-3">
                                No RBOEQ question is present
                            </div>
                        }
                        {QuestionControlList?.filter(q => q.questionType === 'rboeq').map((item) => (
                            <tr style={{ cursor: "pointer", marginLeft: '16px' }} onClick={() => { handleCheckboxChange(item.id) }} key={`rboeq-${item.id}`}>
                                <td style={{ paddingLeft: '1.5rem' }} className='w-1'>
                                    <Form.Check className='mb-0' id={`questCheck-${item.id}`} type="checkbox" checked={item.selected}
                                        onChange={() => handleCheckboxChange(item?.id)}
                                        label={<div className="primary-color" />} />
                                </td>
                                <td colSpan={2}><label htmlFor={`questCheck-${item.id}`}>{item?.question}</label></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="d-flex justify-content-end gap-2">
                <Button onClick={handleSave} variant='primary' className='ripple-effect'>Save</Button>
                <Button onClick={() => { setShowQuestionModal(false) }} variant='secondary' className='ripple-effect'>Cancel</Button>
            </div>
        </ModalComponent>
    );
}

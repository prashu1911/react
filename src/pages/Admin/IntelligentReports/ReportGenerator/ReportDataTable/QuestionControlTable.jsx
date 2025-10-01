import { ModalComponent } from 'components';
import React, { useRef } from 'react';
import {Form} from 'react-bootstrap';

export default function QuestionControlTable(
    ShowObjectPointModal,
    setShowObjectPointModal,
) {
    const selectAllRef = useRef(null); // Ref for the 'Select All' checkbox
    const checkboxesRef = useRef([]); // Ref for all other checkboxes

    // Handle the 'Select All' functionality
    const handleSelectAll = (e) => {
        const isChecked = e.target.checked;
        checkboxesRef.current.forEach((checkbox) => {
            if (checkbox) checkbox.checked = isChecked; // Set checked status based on 'Select All'
        });
    };

    // Handle individual checkbox changes
    const handleCheckboxChange = () => {
        const allChecked = checkboxesRef.current.every((checkbox) => checkbox && checkbox.checked);
        if (selectAllRef.current) {
            selectAllRef.current.checked = allChecked; // Update 'Select All' checkbox
        }
    };

    // Add checkbox refs to the array
    const addToRef = (el, index) => {
        if (el && !checkboxesRef.current.includes(el)) {
            checkboxesRef.current[index] = el;
            // Add a change event listener to each checkbox
            el.addEventListener('change', handleCheckboxChange);
        }
    };
    const objectControlClose = () => setShowObjectPointModal(false);

    return (
        <ModalComponent modalHeader="Question Control Panel" size="lg" show={ShowObjectPointModal} onHandleCancel={objectControlClose} >

        <div className="table-responsive datatable-wrap actionPlanTable">
            <table className="table reportTable">
            <thead>
                <tr>
                <th className='w-1'>
                    <Form.Check className='mb-0' id='selectAll' ref={selectAllRef}
                    type="checkbox"
                    onChange={handleSelectAll}
                    label={<div className="primary-color"/>}/>
                </th>
                <th colSpan={2}><label htmlFor="selectAll">Select All</label></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td colSpan={3}><strong>OEQ Questions</strong></td>
                </tr>
                <tr>
                    <td className='w-1'>
                        <Form.Check className='mb-0' id='questCheck0' type="checkbox" ref={(el) => addToRef(el, 0)}
                        label={<div className="primary-color"/>}/>
                    </td>
                    <td colSpan={2}><label htmlFor="questCheck0">What is the timeline for achieving these goals?</label></td>
                </tr>
                <tr>
                    <td className='w-1'>
                        <Form.Check className='mb-0' id='questCheck01' type="checkbox" ref={(el) => addToRef(el, 1)}
                        label={<div className="primary-color"/>}/>
                    </td>
                    <td><label htmlFor="questCheck01">What financial impacts, if any, have resulted from the organizational structure?</label></td>
                </tr>
                <tr>
                    <td className='w-1'>
                        <Form.Check className='mb-0' id='questCheck02' type="checkbox" ref={(el) => addToRef(el, 2)}
                        label={<div className="primary-color"/>}/>
                    </td>
                    <td><label htmlFor="questCheck02">What aspects of your job do you find most fulfilling and why?</label></td>
                </tr>
                <tr>
                    <td className='w-1'>
                        <Form.Check className='mb-0' id='questCheck03' type="checkbox"  ref={(el) => addToRef(el, 3)}
                        label={<div className="primary-color"/>}/>
                    </td>
                    <td><label htmlFor="questCheck03">Can you describe your overall experience this survey?</label></td>
                </tr>
                <tr>
                    <td colSpan={3}><strong>RBOEQ Questions</strong></td>
                </tr>
                <tr>
                    <td colSpan={3} className='border-0'>The organization’s goals are clearly communicated to all employees.</td>
                </tr>
                <tr>
                    <td className='w-1'>
                        <Form.Check className='mb-0' id='questCheck04' type="checkbox" ref={(el) => addToRef(el, 4)}
                        label={<div className="primary-color"/>}/>
                    </td>
                    <td colSpan={2}><label htmlFor="questCheck04">Strongly Disagree : Explain Reason?</label></td>
                </tr>
            </tbody>
            </table>
        </div>
        </ModalComponent>
    );
};





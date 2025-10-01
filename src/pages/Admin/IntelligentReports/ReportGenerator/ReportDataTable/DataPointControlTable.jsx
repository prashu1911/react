import React, { useRef } from 'react';
import {Form} from 'react-bootstrap';

export default function DataPointControlTable() {
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

    return (
        <div className="table-responsive datatable-wrap actionPlanTable">
            <table className="table reportTable">
            <thead>
                <tr>
                <th className='w-1'>
                    <Form.Check className='mb-0' id='selectAll' ref={selectAllRef}
                    type="checkbox"
                    onChange={handleSelectAll}
                    label={<div className="primary-color"></div>}/>
                </th>
                <th colSpan={3}><label htmlFor="selectAll">Select All</label></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className='w-1'>
                        <Form.Check className='mb-0' id='dataPointCheck0' type="checkbox" ref={(el) => addToRef(el, 0)}
                        label={<div className="primary-color"></div>}/>
                    </td>
                    <td colSpan={3}><label htmlFor="dataPointCheck0"><strong>Overall</strong></label></td>
                </tr>
                <tr>
                    <td className='w-1'></td>
                    <td className='w-1'>
                        <Form.Check className='mb-0' id='dataPointCheck01' type="checkbox" ref={(el) => addToRef(el, 1)}
                        label={<div className="primary-color"></div>}/>
                    </td>
                    <td colSpan={2}><label htmlFor="dataPointCheck01">Testing team</label></td>
                </tr>
                <tr>
                    <td className='w-1'></td>
                    <td className='w-1'></td>
                    <td className='w-1'>
                        <Form.Check className='mb-0' id='dataPointCheck02' type="checkbox" ref={(el) => addToRef(el, 2)}
                        label={<div className="primary-color"></div>}/>
                    </td>
                    <td className='text-nowrap'><label htmlFor="dataPointCheck02">Harish N</label></td>
                </tr>
                <tr>
                    <td className='w-1'></td>
                    <td className='w-1'></td>
                    <td className='w-1'>
                        <Form.Check className='mb-0' id='dataPointCheck03' type="checkbox" ref={(el) => addToRef(el, 3)}
                        label={<div className="primary-color"></div>}/>
                    </td>
                    <td className='text-nowrap'><label htmlFor="dataPointCheck03">Abigail Baker </label></td>
                </tr>
                <tr>
                    <td className='w-1'></td>
                    <td className='w-1'></td>
                    <td className='w-1'>
                        <Form.Check className='mb-0' id='dataPointCheck04' type="checkbox"  ref={(el) => addToRef(el, 4)}
                        label={<div className="primary-color"></div>}/>
                    </td>
                    <td className='text-nowrap'><label htmlFor="dataPointCheck04">Brooklyn Kelly</label></td>
                </tr>
                <tr>
                    <td colSpan={4}><strong>Reference Points</strong></td>
                </tr>
                <tr>
                    <td className='w-1'></td>
                    <td className='w-1'>
                        <Form.Check className='mb-0' id='dataPointCheck05' type="checkbox" ref={(el) => addToRef(el, 5)}
                        label={<div className="primary-color"></div>}/>
                    </td>
                    <td colSpan={2} className='min-w-220'><label htmlFor="dataPointCheck05">reference data aggregate user</label></td>
                </tr>
            </tbody>
            </table>
        </div>
    );
};





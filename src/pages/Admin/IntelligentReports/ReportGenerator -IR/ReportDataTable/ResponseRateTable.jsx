import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ResponseRateTable() {
  const [openRows, setOpenRows] = useState({});

  // Handle row click for toggling accordion
  const handleRowClick = (index) => {
    setOpenRows((prevOpenRows) => ({
      ...prevOpenRows,
      [index]: !prevOpenRows[index], 
    }));
  };

  return (
    <div className="table-responsive datatable-wrap">
        <table className="table reportTable">
        <thead>
            <tr>
            <th className='min-w-220'>Name</th>
            <th className='min-w-150'>Invited</th>
            <th>Responded</th>
            <th className='min-w-150'>Participation Rate</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <Link onClick={() => handleRowClick(0)} className={`clickIcon ${openRows[0] ? 'clickIcon-roate' : ''}`}><em className="icon-drop-down"></em></Link>
                    <span className="ms-2">Response Rate</span>
                </td>
                <td>John Doe</td>
                <td>28</td>
                <td>4</td>
            </tr>
            {openRows[0] && (
                <tr>
                <td>Business Analysis</td>
                <td>Participant</td>
                <td>52</td>
                <td>3</td>
                </tr>
            )}
            <tr>
                <td>
                    <Link onClick={() => handleRowClick(1)} className={`clickIcon ${openRows[1] ? 'clickIcon-roate' : ''}`}><em className="icon-drop-down"></em></Link>
                    <span className="ms-2">Impact on Productivity</span>
                </td>
                <td>Jane Smith</td>
                <td>32</td>
                <td>5</td>
            </tr>
            {openRows[1] && (
                <tr>
                    <td>Business Analysis</td>
                    <td>Participant</td>
                    <td>33</td>
                    <td>4</td>
                </tr>
            )}
            <tr>
                <td>
                    <Link onClick={() => handleRowClick(2)} className={`clickIcon ${openRows[2] ? 'clickIcon-roate' : ''}`}><em className="icon-drop-down"></em></Link>
                    <span className="ms-2">Manager Effectiveness</span>
                </td>
                <td>Michael Johnson</td>
                <td>45</td>
                <td>2</td>
            </tr>
            {openRows[2] && (
                <tr>
                    <td>Business Analysis</td>
                    <td>Participant</td>
                    <td>75</td>
                    <td>5</td>
                </tr>
            )}
        </tbody>
        </table>
    </div>
  );
};





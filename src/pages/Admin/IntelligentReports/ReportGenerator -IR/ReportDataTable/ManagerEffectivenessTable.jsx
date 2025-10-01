import React, { useState } from 'react';
import { ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function ManagerEffectivenessTable({actionPlanShow}) {
  const [openRows, setOpenRows] = useState({0: true});

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
            <th className="text-center">Responses</th>
            <th className="text-center min-w-220">Distribution</th>
            <th className='text-center'>Overall</th>
            <th className='text-center'>WSA 2022 <br/> Overall</th>
            <th className='text-center'>Arts, Entertainment, <br/> and Recreation</th>
            <th className='text-center'>Construction</th>
            <th className='text-center min-w-120'>Action Plan</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <Link onClick={() => handleRowClick(0)} className={`clickIcon ${openRows[0] ? 'clickIcon-roate' : ''}`}><em className="icon-drop-down"></em></Link>
                    <span className="ms-2">Manager Effectiveness</span>
                </td>
                <td></td>
                <td className="text-center">
                    <ProgressBar>
                        <ProgressBar variant="success" label={<span className="dist-label">33%</span>} now={33}/>
                        <ProgressBar variant="warning" label={<span className="dist-label">33%</span>} now={33} />
                        <ProgressBar variant="danger" label={<span className="dist-label">33%</span>} now={33} />
                    </ProgressBar>
                </td>
                <td className='text-center'>33%</td>
                <td className='text-center text-danger'>74%</td>
                <td className='text-center text-danger'>68%</td>
                <td className='text-center text-danger'>75%</td>
                <td className='text-center'></td>
            </tr>
            {openRows[0] && (
                <>
                <tr>
                    <td>My manager demonstrates strong leadership skills.</td>
                    <td className="text-center">4</td>
                    <td className="text-center">
                        <ProgressBar>
                            <ProgressBar variant="warning" label={<span className="dist-label">25%</span>} now={25}/>
                            <ProgressBar variant="warning" label={<span className="dist-label">25%</span>} now={25} />
                            <ProgressBar variant="danger" label={<span className="dist-label">50%</span>} now={50} />
                        </ProgressBar>
                    </td>
                    <td className="text-center">25%</td>
                    <td className="text-center text-danger">-</td>
                    <td className="text-center text-danger">-</td>
                    <td className="text-center text-danger">-</td>
                    <td className='text-center'>
                        <Link className='link-primary' onClick={actionPlanShow}>Action Items</Link>
                    </td>
                </tr>
                <tr>
                    <td>My manager communicates expectations and goals clearly.</td>
                    <td className="text-center">4</td>
                    <td className="text-center">
                        <ProgressBar>
                            <ProgressBar variant="success" label={<span className="dist-label">100%</span>} now={100}/>
                        </ProgressBar>
                    </td>
                    <td className="text-center">100%</td>
                    <td className="text-center text-danger">-</td>
                    <td className="text-center text-danger">-</td>
                    <td className="text-center text-danger">-</td>
                    <td className='text-center'>
                        <Link className='link-primary' onClick={actionPlanShow}>Action Items</Link>
                    </td>
                </tr>
                <tr>
                    <td>My manager provides adequate support and guidance to help me succeed in my role.</td>
                    <td className="text-center">3</td>
                    <td className="text-center">
                        <ProgressBar>
                            <ProgressBar variant="warning" label={<span className="dist-label">67%</span>} now={67}/>
                            <ProgressBar variant="danger" label={<span className="dist-label">33%</span>} now={33} />
                        </ProgressBar>
                    </td>
                    <td className="text-center">0%</td>
                    <td className="text-center text-danger">-</td>
                    <td className="text-center text-danger">-</td>
                    <td className="text-center text-danger">-</td>
                    <td className='text-center'>
                        <Link className='link-primary' onClick={actionPlanShow}>Action Items</Link>
                    </td>
                </tr>
                <tr>
                    <td>I receive constructive feedback from my manager that helps me improve my performance.</td>
                    <td className="text-center">4</td>
                    <td className="text-center">
                        <ProgressBar>
                            <ProgressBar variant="warning" label={<span className="dist-label">50%</span>} now={50}/>
                            <ProgressBar variant="danger" label={<span className="dist-label">50%</span>} now={50} />
                        </ProgressBar>
                    </td>
                    <td className="text-center">0%</td>
                    <td className="text-center text-danger">-</td>
                    <td className="text-center text-danger">-</td>
                    <td className="text-center text-danger">-</td>
                    <td className='text-center'>
                        <Link className='link-primary' onClick={actionPlanShow}>Action Items</Link>
                    </td>
                </tr>
                </>
            )}
        </tbody>
        </table>
    </div>
  );
};





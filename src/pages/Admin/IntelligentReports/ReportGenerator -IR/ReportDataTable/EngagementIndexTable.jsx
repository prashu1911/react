import React, { useState } from 'react';
import { ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function EngagementIndexTable() {
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
            <th className='min-w-150 text-center'>Overall</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <Link onClick={() => handleRowClick(0)} className={`clickIcon ${openRows[0] ? 'clickIcon-roate' : ''}`}><em className="icon-drop-down"></em></Link>
                    <span className="ms-2">Engagement</span>
                </td>
                <td></td>
                <td className="text-center">
                    <ProgressBar>
                        <ProgressBar variant="success" label={<span className="dist-label">42%</span>} now={42}/>
                        <ProgressBar variant="warning" label={<span className="dist-label">21%</span>} now={21}/>
                        <ProgressBar variant="danger" label={<span className="dist-label">37%</span>} now={37}/>
                    </ProgressBar>
                </td>
                <td className='text-center'>42%</td>
            </tr>
            {openRows[0] && (
                <>
                <tr>
                    <td>There is open and honest two-way communication at this company.</td>
                    <td className="text-center">4</td>
                    <td className="text-center">
                        <ProgressBar>
                            <ProgressBar variant="success" label={<span className="dist-label">50%</span>} now={50}/>
                            <ProgressBar variant="warning" label={<span className="dist-label">25%</span>} now={25}/>
                            <ProgressBar variant="danger" label={<span className="dist-label">25%</span>} now={25}/>
                        </ProgressBar>
                    </td>
                    <td className="text-center">50%</td>
                </tr>
                <tr>
                    <td>I feel actively engaged in my work or role</td>
                    <td className="text-center">4</td>
                    <td className="text-center">
                        <ProgressBar>
                            <ProgressBar variant="success" label={<span className="dist-label">25%</span>} now={25}/>
                            <ProgressBar variant="danger" label={<span className="dist-label">75%</span>} now={75}/>
                        </ProgressBar>
                    </td>
                    <td className="text-center">25%</td>
                </tr>
                <tr>
                    <td>I find the tasks and responsibilities in my role interesting and stimulating</td>
                    <td className="text-center">4</td>
                    <td className="text-center">
                        <ProgressBar>
                            <ProgressBar variant="success" label={<span className="dist-label">75%</span>} now={75}/>
                            <ProgressBar variant="danger" label={<span className="dist-label">25%</span>} now={25}/>
                        </ProgressBar>
                    </td>
                    <td className="text-center">75%</td>
                </tr>
                <tr>
                    <td>I believe my work contributes meaningfully to the organization's goals.</td>
                    <td className="text-center">4</td>
                    <td className="text-center">
                        <ProgressBar>
                            <ProgressBar variant="success" label={<span className="dist-label">25%</span>} now={25}/>
                            <ProgressBar variant="warning" label={<span className="dist-label">50%</span>} now={50}/>
                            <ProgressBar variant="danger" label={<span className="dist-label">25%</span>} now={25}/>
                        </ProgressBar>
                    </td>
                    <td className="text-center">25%</td>
                </tr>
                <tr>
                    <td>I receive adequate feedback and recognition for my contributions.</td>
                    <td className="text-center">3</td>
                    <td className="text-center">
                        <ProgressBar>
                            <ProgressBar variant="success" label={<span className="dist-label">33%</span>} now={33}/>
                            <ProgressBar variant="warning" label={<span className="dist-label">33%</span>} now={33}/>
                            <ProgressBar variant="danger" label={<span className="dist-label">33%</span>} now={33}/>
                        </ProgressBar>
                    </td>
                    <td className="text-center">33%</td>
                </tr>
                </>
            )}
        </tbody>
        </table>
    </div>
  );
};





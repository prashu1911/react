import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function BreakoutComparisonTable() {
  const [openRows, setOpenRows] = useState({0: true});

  // Handle row click for toggling accordion
  const handleRowClick = (index) => {
    setOpenRows((prevOpenRows) => ({
      ...prevOpenRows,
      [index]: !prevOpenRows[index], 
    }));
  };

  return (
    <div className="commonTable dataTable">
        <div className="table-responsive datatable-wrap">
            <table className="table breakoutTable">
            <thead>
                <tr>
                    <th className='min-w-300'>Response</th>
                    <th className="text-center">-</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <Link onClick={() => handleRowClick(0)} className={`clickIcon ${openRows[0] ? 'clickIcon-roate' : ''}`}><em className="icon-drop-down"></em></Link>
                        <span className="ms-2">Engagement</span>
                    </td>
                    <td className={`text-center ${openRows[0] ? 'border-0' : ''}`}>0%</td>
                </tr>
                {openRows[0] && (
                    <>
                    <tr>
                        <td>There is open and honest two-way communication at this company.</td>
                        <td className='border-0'></td>
                    </tr>
                    <tr>
                        <td>I feel actively engaged in my work or role</td>
                        <td className='border-0'></td>
                    </tr>
                    <tr>
                        <td>I find the tasks and responsibilities in my role interesting and stimulating</td>
                        <td className='border-0'></td>
                    </tr>
                    <tr>
                        <td>I believe my work contributes meaningfully to the organization's goals.</td>
                        <td className='border-0'></td>
                    </tr>
                    <tr>
                        <td>I receive adequate feedback and recognition for my contributions.</td>
                        <td></td>
                    </tr>
                    </>
                )}
                <tr>
                    <td>
                        <Link onClick={() => handleRowClick(1)} className={`clickIcon ${openRows[1] ? 'clickIcon-roate' : ''}`}><em className="icon-drop-down"></em></Link>
                        <span className="ms-2"> Equip Factors</span>
                    </td>
                    <td className={`text-center ${openRows[1] ? 'border-0' : ''}`}>0%</td>
                </tr>
                {openRows[1] && (
                    <>
                    <tr>
                        <td>Where I work, we set clear performance standards for product/service quality.</td>
                        <td className='border-0'></td>
                    </tr>
                    <tr>
                        <td>I have access to the necessary resources to perform my job effectively.</td>
                        <td className='border-0'></td>
                    </tr>
                    <tr>
                        <td>The tools and equipment provided are effective for accomplishing my tasks.</td>
                        <td className='border-0'></td>
                    </tr>
                    <tr>
                        <td>I receive adequate training to use the tools and resources provided.</td>
                        <td className='border-0'></td>
                    </tr>
                    <tr>
                        <td>Technical support is readily available when I encounter issues with tools or equipment.</td>
                        <td></td>
                    </tr>
                    </>
                )}
                <tr>
                    <td>
                        <Link onClick={() => handleRowClick(2)} className={`clickIcon ${openRows[2] ? 'clickIcon-roate' : ''}`}><em className="icon-drop-down"></em></Link>
                        <span className="ms-2">Impact on Productivity</span>
                    </td>
                    <td className={`text-center ${openRows[2] ? 'border-0' : ''}`}>0%</td>
                </tr>
                {openRows[2] && (
                    <tr>
                        <td>Optimization has had a positive impact on overall productivity.</td>
                        <td></td>
                    </tr>
                )}
                <tr>
                    <td>
                        <Link onClick={() => handleRowClick(3)} className={`clickIcon ${openRows[3] ? 'clickIcon-roate' : ''}`}><em className="icon-drop-down"></em></Link>
                        <span className="ms-2">Manager Effectiveness</span>
                    </td>
                    <td className={`text-center ${openRows[3] ? 'border-0' : ''}`}>0%</td>
                </tr>
                {openRows[3] && (
                    <>
                    <tr>
                        <td>My manager demonstrates strong leadership skills.</td>
                        <td className='border-0'></td>
                    </tr>
                    <tr>
                        <td>My manager communicates expectations and goals clearly.</td>
                        <td className='border-0'></td>
                    </tr>
                    <tr>
                        <td>My manager provides adequate support and guidance to help me succeed in my role.</td>
                        <td className='border-0'></td>
                    </tr>
                    <tr>
                        <td>I receive constructive feedback from my manager that helps me improve my performance.</td>
                        <td></td>
                    </tr>
                    </>
                )}
            </tbody>
            </table>
        </div>
    </div>
  );
};





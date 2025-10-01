import React, { useState } from 'react';
import { ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function DimensionItemSummaryTable({actionPlanShow}) {
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
            <th className="text-center">Responses</th>
            <th className="text-center min-w-220">Distribution</th>
            <th>Overall</th>
            <th className='min-w-150'>WSA 2022 <br/> Overall</th>
            <th className='min-w-150'>Arts, Entertainment, <br/> and Recreation</th>
            <th>Construction</th>
            <th className='min-w-150 text-center'>Action Plan</th>
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
                <td>42%</td>
                <td className='text-danger'>74%</td>
                <td className='text-danger'>70%</td>
                <td className='text-danger'>78%</td>
                <td className='text-center'></td>
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
                    <td>50%</td>
                    <td className='text-danger'>62%</td>
                    <td className='text-danger'>50%</td>
                    <td className='text-danger'>67%</td>
                    <td className='text-center'>
                        <Link className='link-primary' onClick={actionPlanShow}>Action Items</Link>
                    </td>
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
                    <td>25%</td>
                    <td className='text-danger'>-</td>
                    <td className='text-danger'>-</td>
                    <td className='text-danger'>-</td>
                    <td className='text-center'>
                        <Link className='link-primary' onClick={actionPlanShow}>Action Items</Link>
                    </td>
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
                    <td>75%</td>
                    <td className='text-danger'>-</td>
                    <td className='text-danger'>-</td>
                    <td className='text-danger'>-</td>
                    <td className='text-center'>
                        <Link className='link-primary' onClick={actionPlanShow}>Action Items</Link>
                    </td>
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
                    <td>25%</td>
                    <td className='text-danger'>-</td>
                    <td className='text-danger'>-</td>
                    <td className='text-danger'>-</td>
                    <td className='text-center'>
                        <Link className='link-primary' onClick={actionPlanShow}>Action Items</Link>
                    </td>
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
                    <td>25%</td>
                    <td className='text-danger'>-</td>
                    <td className='text-danger'>-</td>
                    <td className='text-danger'>-</td>
                    <td className='text-center'>
                        <Link className='link-primary' onClick={actionPlanShow}>Action Items</Link>
                    </td>
                </tr>
                </>
            )}
            <tr>
                <td>
                    <Link onClick={() => handleRowClick(1)} className={`clickIcon ${openRows[1] ? 'clickIcon-roate' : ''}`}><em className="icon-drop-down"></em></Link>
                    <span className="ms-2">Equip Factors</span>
                </td>
                <td></td>
                <td className="text-center">
                    <ProgressBar>
                        <ProgressBar variant="success" label={<span className="dist-label">28%</span>} now={28}/>
                        <ProgressBar variant="warning" label={<span className="dist-label">17%</span>} now={17}/>
                        <ProgressBar variant="danger" label={<span className="dist-label">56%</span>} now={56}/>
                    </ProgressBar>
                </td>
                <td>28%</td>
                <td className='text-danger'>75%</td>
                <td className='text-danger'>42%</td>
                <td className='text-danger'>67%</td>
                <td className='text-center'></td>
            </tr>
            {openRows[1] && (
                <>
                <tr>
                    <td>Where I work, we set clear performance standards for product/service quality.</td>
                    <td className="text-center">3</td>
                    <td className="text-center">
                        <ProgressBar>
                            <ProgressBar variant="warning" label={<span className="dist-label">33%</span>} now={33}/>
                            <ProgressBar variant="danger" label={<span className="dist-label">67%</span>} now={67}/>
                        </ProgressBar>
                    </td>
                    <td>0%</td>
                    <td className='text-danger'>78%</td>
                    <td className='text-danger'>79%</td>
                    <td className='text-danger'>77%</td>
                    <td className='text-center'>
                        <Link className='link-primary' onClick={actionPlanShow}>Action Items</Link>
                    </td>
                </tr>
                <tr>
                    <td>I have access to the necessary resources to perform my job effectively.</td>
                    <td className="text-center">4</td>
                    <td className="text-center">
                        <ProgressBar>
                            <ProgressBar variant="success" label={<span className="dist-label">100%</span>} now={100}/>
                        </ProgressBar>
                    </td>
                    <td>100%</td>
                    <td className='text-danger'>-</td>
                    <td className='text-danger'>-</td>
                    <td className='text-danger'>-</td>
                    <td className='text-center'>
                        <Link className='link-primary' onClick={actionPlanShow}>Action Items</Link>
                    </td>
                </tr>
                <tr>
                    <td>The tools and equipment provided are effective for accomplishing my tasks.</td>
                    <td className="text-center">4</td>
                    <td className="text-center">
                        <ProgressBar>
                            <ProgressBar variant="warning" label={<span className="dist-label">25%</span>} now={25}/>
                            <ProgressBar variant="danger" label={<span className="dist-label">75%</span>} now={75}/>
                        </ProgressBar>
                    </td>
                    <td>0%</td>
                    <td className='text-danger'>-</td>
                    <td className='text-danger'>-</td>
                    <td className='text-danger'>-</td>
                    <td className='text-center'>
                        <Link className='link-primary' onClick={actionPlanShow}>Action Items</Link>
                    </td>
                </tr>
                <tr>
                    <td>I receive adequate training to use the tools and resources provided.</td>
                    <td className="text-center">4</td>
                    <td className="text-center">
                        <ProgressBar>
                            <ProgressBar variant="success" label={<span className="dist-label">25%</span>} now={25}/>
                            <ProgressBar variant="danger" label={<span className="dist-label">75%</span>} now={75}/>
                        </ProgressBar>
                    </td>
                    <td>25%</td>
                    <td className='text-danger'>-</td>
                    <td className='text-danger'>-</td>
                    <td className='text-danger'>-</td>
                    <td className='text-center'>
                        <Link className='link-primary' onClick={actionPlanShow}>Action Items</Link>
                    </td>
                </tr>
                <tr>
                    <td>Technical support is readily available when I encounter issues with tools or equipment.</td>
                    <td className="text-center">3</td>
                    <td className="text-center">
                        <ProgressBar>
                            <ProgressBar variant="warning" label={<span className="dist-label">33%</span>} now={33}/>
                            <ProgressBar variant="danger" label={<span className="dist-label">67%</span>} now={67}/>
                        </ProgressBar>
                    </td>
                    <td>0%</td>
                    <td className='text-danger'>-</td>
                    <td className='text-danger'>-</td>
                    <td className='text-danger'>-</td>
                    <td className='text-center'>
                        <Link className='link-primary' onClick={actionPlanShow}>Action Items</Link>
                    </td>
                </tr>
                </>
            )}
            <tr>
                <td>
                    <Link onClick={() => handleRowClick(2)} className={`clickIcon ${openRows[2] ? 'clickIcon-roate' : ''}`}><em className="icon-drop-down"></em></Link>
                    <span className="ms-2"> Impact on Productivity</span>
                </td>
                <td></td>
                <td className="text-center">
                    <ProgressBar>
                        <ProgressBar variant="success" label={<span className="dist-label">28%</span>} now={28}/>
                        <ProgressBar variant="danger" label={<span className="dist-label">75%</span>} now={75}/>
                    </ProgressBar>
                </td>
                <td>25%</td>
                <td className='text-danger'>-</td>
                <td className='text-danger'>-</td>
                <td className='text-danger'>-</td>
                <td className='text-center'></td>
            </tr>
            {openRows[2] && (
            <tr>
                <td>Optimization has had a positive impact on overall productivity.</td>
                <td className="text-center">4</td>
                <td className="text-center">
                    <ProgressBar>
                        <ProgressBar variant="success" label={<span className="dist-label">25%</span>} now={25}/>
                        <ProgressBar variant="danger" label={<span className="dist-label">75%</span>} now={75}/>
                    </ProgressBar>
                </td>
                <td>25%</td>
                <td className='text-danger'>-</td>
                <td className='text-danger'>-</td>
                <td className='text-danger'>-</td>
                <td className='text-center'>
                    <Link className='link-primary' onClick={actionPlanShow}>Action Items</Link>
                </td>
            </tr>
            )}
            <tr>
                <td>
                    <Link onClick={() => handleRowClick(3)} className={`clickIcon ${openRows[3] ? 'clickIcon-roate' : ''}`}><em className="icon-drop-down"></em></Link>
                    <span className="ms-2">Manager Effectiveness</span>
                </td>
                <td></td>
                <td className="text-center">
                    <ProgressBar>
                        <ProgressBar variant="success" label={<span className="dist-label">33%</span>} now={33}/>
                        <ProgressBar variant="warning" label={<span className="dist-label">33%</span>} now={33}/>
                        <ProgressBar variant="danger" label={<span className="dist-label">33%</span>} now={33}/>
                    </ProgressBar>
                </td>
                <td>33%</td>
                <td className='text-danger'>74%</td>
                <td className='text-danger'>68%</td>
                <td className='text-danger'>75%</td>
                <td className='text-center'></td>
            </tr>
            {openRows[3] && (
                <>
                <tr>
                    <td>My manager demonstrates strong leadership skills.</td>
                    <td className="text-center">4</td>
                    <td className="text-center">
                        <ProgressBar>
                            <ProgressBar variant="success" label={<span className="dist-label">25%</span>} now={25}/>
                            <ProgressBar variant="warning" label={<span className="dist-label">25%</span>} now={25}/>
                            <ProgressBar variant="danger" label={<span className="dist-label">50%</span>} now={50}/>
                        </ProgressBar>
                    </td>
                    <td>25%</td>
                    <td className='text-danger'>-</td>
                    <td className='text-danger'>-</td>
                    <td className='text-danger'>-</td>
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
                    <td>100%</td>
                    <td className='text-danger'>-</td>
                    <td className='text-danger'>-</td>
                    <td className='text-danger'>-</td>
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
                            <ProgressBar variant="danger" label={<span className="dist-label">33%</span>} now={33}/>
                        </ProgressBar>
                    </td>
                    <td>0%</td>
                    <td className='text-danger'>-</td>
                    <td className='text-danger'>-</td>
                    <td className='text-danger'>-</td>
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
                            <ProgressBar variant="danger" label={<span className="dist-label">50%</span>} now={50}/>
                        </ProgressBar>
                    </td>
                    <td>0%</td>
                    <td className='text-danger'>-</td>
                    <td className='text-danger'>-</td>
                    <td className='text-danger'>-</td>
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





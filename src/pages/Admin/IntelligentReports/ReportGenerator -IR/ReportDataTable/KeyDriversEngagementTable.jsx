import React from 'react';
import { OverlayTrigger, ProgressBar, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function KeyDriversEngagementTable({actionPlanShow}) {
  return (
    <div className="table-responsive datatable-wrap">
        <table className="table reportTable">
        <thead>
            <tr>
            <th>Impact</th>
            <th>Value</th>
            <th className="min-w-300">Question</th>
            <th className="text-center">Responses</th>
            <th className="text-center min-w-220">Distribution</th>
            <th>Overall</th>
            <th className='min-w-100'>WSA 2022 <br/> Overall</th>
            <th className='min-w-100'>Arts, Entertainment, <br/> and Recreation</th>
            <th>Construction</th>
            <th className='min-w-120 text-center'>Action Plan</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <div className="impactDot">
                        <OverlayTrigger placement="top" overlay={<Tooltip >Impact: -0.8704</Tooltip>}>
                            <span className="impactDot_fill" data-bs-toggle="tooltip"></span>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip >Impact: -0.8704</Tooltip>}>
                            <span className="impactDot_fill" data-bs-toggle="tooltip"></span>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip >Impact: -0.8704</Tooltip>}>
                            <span className="impactDot_fill" data-bs-toggle="tooltip"></span>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip >Impact: -0.8704</Tooltip>}>
                            <span className="impactDot_fill" data-bs-toggle="tooltip"></span>
                        </OverlayTrigger>
                    </div>
                </td>
                <td>-0.8704</td>
                <td>My manager communicates expectations and goals clearly.</td>
                <td>4</td>
                <td className="text-center">
                    <ProgressBar>
                        <ProgressBar variant="success" label={<span className="dist-label">100%</span>} now={100}  />
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
                <td>
                    <div className="impactDot">
                        <OverlayTrigger placement="top" overlay={<Tooltip >Impact: -0.8182</Tooltip>}>
                            <span className="impactDot_fill" data-bs-toggle="tooltip"></span>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip >Impact: -0.8182</Tooltip>}>
                            <span className="impactDot_fill" data-bs-toggle="tooltip"></span>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip >Impact: -0.8182</Tooltip>}>
                            <span className="impactDot_fill" data-bs-toggle="tooltip"></span>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip >Impact: -0.8182</Tooltip>}>
                            <span className="impactDot_fill" data-bs-toggle="tooltip"></span>
                        </OverlayTrigger>
                    </div>
                </td>
                <td>-0.8182</td>
                <td>My manager demonstrates strong leadership skills.</td>
                <td>4</td>
                <td className="text-center">
                    <ProgressBar>
                        <ProgressBar variant="success" label={<span className="dist-label">25%</span>} now={25}  />
                        <ProgressBar variant="warning" label={<span className="dist-label">25%</span>} now={25}  />
                        <ProgressBar variant="danger" label={<span className="dist-label">50%</span>} now={50} />
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
                <td>
                    <div className="impactDot">
                        <OverlayTrigger placement="top" overlay={<Tooltip >Impact: -0.8123</Tooltip>}>
                            <span className="impactDot_fill" data-bs-toggle="tooltip"></span>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip >Impact: -0.8123</Tooltip>}>
                            <span className="impactDot_fill" data-bs-toggle="tooltip"></span>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip >Impact: -0.8123</Tooltip>}>
                            <span className="impactDot_fill" data-bs-toggle="tooltip"></span>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip >Impact: -0.8123</Tooltip>}>
                            <span className="impactDot_fill" data-bs-toggle="tooltip"></span>
                        </OverlayTrigger>
                    </div>
                </td>
                <td>-0.8123</td>
                <td>I receive adequate training to use the tools and resources provided.</td>
                <td>4</td>
                <td className="text-center">
                    <ProgressBar>
                        <ProgressBar variant="success" label={<span className="dist-label">25%</span>} now={25}  />
                        <ProgressBar variant="danger" label={<span className="dist-label">75%</span>} now={75}  />
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
                <td>
                    <div className="impactDot">
                        <OverlayTrigger placement="top" overlay={<Tooltip >Impact: -0.7035</Tooltip>}>
                            <span className="impactDot_fill" data-bs-toggle="tooltip"></span>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip >Impact: -0.7035</Tooltip>}>
                            <span className="impactDot_fill" data-bs-toggle="tooltip"></span>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip >Impact: -0.7035</Tooltip>}>
                            <span className="impactDot_fill" data-bs-toggle="tooltip"></span>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip >Impact: -0.7035</Tooltip>}>
                            <span className="impactDot_fill blank" data-bs-toggle="tooltip"></span>
                        </OverlayTrigger>
                    </div>
                </td>
                <td>-0.7035</td>
                <td>I receive constructive feedback from my manager that helps me improve my performance.</td>
                <td>4</td>
                <td className="text-center">
                    <ProgressBar>
                        <ProgressBar variant="warning" label={<span className="dist-label">50%</span>} now={50}  />
                        <ProgressBar variant="danger" label={<span className="dist-label">50%</span>} now={50}  />
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
                <td>
                    <div className="impactDot">
                        <OverlayTrigger placement="top" overlay={<Tooltip >Impact: -0.2247</Tooltip>}>
                            <span className="impactDot_fill" data-bs-toggle="tooltip"></span>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip >Impact: -0.2247</Tooltip>}>
                            <span className="impactDot_fill blank" data-bs-toggle="tooltip"></span>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip >Impact: -0.2247</Tooltip>}>
                            <span className="impactDot_fill blank" data-bs-toggle="tooltip"></span>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip >Impact: -0.2247</Tooltip>}>
                            <span className="impactDot_fill blank" data-bs-toggle="tooltip"></span>
                        </OverlayTrigger>
                    </div>
                </td>
                <td>-0.2247</td>
                <td>Technical support is readily available when I encounter issues with tools or equipment.</td>
                <td>3</td>
                <td className="text-center">
                    <ProgressBar>
                        <ProgressBar variant="warning" label={<span className="dist-label">25%</span>} now={25}  />
                        <ProgressBar variant="danger" label={<span className="dist-label">75%</span>} now={75}  />
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
                <td>
                    <div className="impactDot">
                        <OverlayTrigger placement="top" overlay={<Tooltip >Impact: 0.0580</Tooltip>}>
                            <span className="impactDot_fill" data-bs-toggle="tooltip"></span>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip >Impact: 0.0580</Tooltip>}>
                            <span className="impactDot_fill blank" data-bs-toggle="tooltip"></span>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip >Impact: 0.0580</Tooltip>}>
                            <span className="impactDot_fill blank" data-bs-toggle="tooltip"></span>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip >Impact: 0.0580</Tooltip>}>
                            <span className="impactDot_fill blank" data-bs-toggle="tooltip"></span>
                        </OverlayTrigger>
                    </div>
                </td>
                <td>0.0580</td>
                <td>Technical support is readily available when I encounter issues with tools or equipment.</td>
                <td>4</td>
                <td className="text-center">
                    <ProgressBar>
                        <ProgressBar variant="success" label={<span className="dist-label">100%</span>} now={100}  />
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
                <td>
                    <div className="impactDot">
                        <OverlayTrigger placement="top" overlay={<Tooltip >Impact: 0.2536</Tooltip>}>
                            <span className="impactDot_fill" data-bs-toggle="tooltip"></span>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip >Impact: 0.2536</Tooltip>}>
                            <span className="impactDot_fill" data-bs-toggle="tooltip"></span>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip >Impact: 0.2536</Tooltip>}>
                            <span className="impactDot_fill blank" data-bs-toggle="tooltip"></span>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip >Impact: 0.2536</Tooltip>}>
                            <span className="impactDot_fill blank" data-bs-toggle="tooltip"></span>
                        </OverlayTrigger>
                    </div>
                </td>
                <td>0.2536</td>
                <td>Optimization has had a positive impact on overall productivity.</td>
                <td>4</td>
                <td className="text-center">
                    <ProgressBar>
                        <ProgressBar variant="success" label={<span className="dist-label">25%</span>} now={25}  />
                        <ProgressBar variant="danger" label={<span className="dist-label">75%</span>} now={75}  />
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
        </tbody>
        </table>
    </div>
  );
};





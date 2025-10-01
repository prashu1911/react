import React from 'react';
import { Form } from 'react-bootstrap';
export default function DimensionItemControlPanelTable() {

    return (
        <div className="table-responsive datatable-wrap actionPlanTable">
            <table className="table reportTable">
                <thead>
                    <tr>
                        <th colSpan={3} className='itemsTitle'>Dimesnsion & Items</th>
                        <th colSpan={2} className='itemsTitle'>Action Items</th>
                    </tr>
                    <tr>
                        <th className='w-1'>
                            <Form.Check className='mb-0' id='dimensionItemsAll'
                                type="checkbox"
                                label={<div className="primary-color"></div>} />
                        </th>
                        <th colSpan={2}><label htmlFor="dimensionItemsAll">Select All</label></th>
                        <th className='w-1'>
                            <Form.Check className='mb-0' id='actionItemsAll'
                                type="checkbox"
                                label={<div className="primary-color"></div>} />
                        </th>
                        <th className='min-w-100'><label htmlFor="actionItemsAll">Select All</label></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className='w-1 itemsTitle'>
                            <Form.Check className='mb-0' id='engagementAll'
                                type="checkbox"
                                label={<div className="primary-color"></div>} />
                        </td>
                        <td colSpan={4} className='itemsTitle'><label htmlFor="engagementAll">Engagement</label></td>
                    </tr>
                    <tr>
                        <td className='w-1'></td>
                        <td className='w-1'>
                            <Form.Check className='mb-0' id='engagement01' type="checkbox"
                                label={<div className="primary-color"></div>} />
                        </td>
                        <td className='min-w-220'><label htmlFor="engagement01">There is open and honest two-way communication at this company.</label></td>
                        <td colSpan={2} className='w-1'>
                            <Form.Check className='mb-0' id='actionItem01' type="checkbox"
                                label={<div className="primary-color"></div>} />
                        </td>
                    </tr>
                    <tr>
                        <td className='w-1'></td>
                        <td className='w-1'>
                            <Form.Check className='mb-0' id='engagement02' type="checkbox"
                                label={<div className="primary-color"></div>} />
                        </td>
                        <td className='min-w-220'><label htmlFor="engagement02">I feel actively engaged in my work or role</label></td>
                        <td colSpan={2} className='w-1'>
                            <Form.Check className='mb-0' id='actionItem02' type="checkbox"
                                label={<div className="primary-color"></div>} />
                        </td>
                    </tr>
                    <tr>
                        <td className='w-1'></td>
                        <td className='w-1'>
                            <Form.Check className='mb-0' id='engagement03' type="checkbox"
                                label={<div className="primary-color"></div>} />
                        </td>
                        <td className='min-w-220'><label htmlFor="engagement03">I find the tasks and responsibilities in my role interesting and stimulating</label></td>
                        <td colSpan={2} className='w-1'>
                            <Form.Check className='mb-0' id='actionItem03' type="checkbox"
                                label={<div className="primary-color"></div>} />
                        </td>
                    </tr>
                    <tr>
                        <td className='w-1'></td>
                        <td className='w-1'>
                            <Form.Check className='mb-0' id='engagement04' type="checkbox"
                                label={<div className="primary-color"></div>} />
                        </td>
                        <td className='min-w-220'><label htmlFor="engagement04">I believe my work contributes meaningfully to the organization's goals.</label></td>
                        <td colSpan={2} className='w-1'>
                            <Form.Check className='mb-0' id='actionItem04' type="checkbox"
                                label={<div className="primary-color"></div>} />
                        </td>
                    </tr>
                    <tr>
                        <td className='w-1'></td>
                        <td className='w-1'>
                            <Form.Check className='mb-0' id='engagement05' type="checkbox"
                                label={<div className="primary-color"></div>} />
                        </td>
                        <td className='min-w-220'><label htmlFor="engagement05">I receive adequate feedback and recognition for my contributions.</label></td>
                        <td colSpan={2} className='w-1'>
                            <Form.Check className='mb-0' id='actionItem05' type="checkbox"
                                label={<div className="primary-color"></div>} />
                        </td>
                    </tr>
                    <tr>
                        <td className='w-1 itemsTitle'>
                            <Form.Check className='mb-0' id='equipFactorsAll'
                                type="checkbox"
                                label={<div className="primary-color"></div>} />
                        </td>
                        <td colSpan={4} className='itemsTitle'><label htmlFor="equipFactorsAll">Equip Factors</label></td>
                    </tr>
                    <tr>
                        <td className='w-1'></td>
                        <td className='w-1'>
                            <Form.Check className='mb-0' id='equipFactors01' type="checkbox"
                                label={<div className="primary-color"></div>} />
                        </td>
                        <td className='min-w-220'><label htmlFor="equipFactors01">Where I work, we set clear performance standards for product/service quality.</label></td>
                        <td colSpan={2} className='w-1'>
                            <Form.Check className='mb-0' id='actionItem06' type="checkbox"
                                label={<div className="primary-color"></div>} />
                        </td>
                    </tr>
                    <tr>
                        <td className='w-1'></td>
                        <td className='w-1'>
                            <Form.Check className='mb-0' id='equipFactors02' type="checkbox"
                                label={<div className="primary-color"></div>} />
                        </td>
                        <td className='min-w-220'><label htmlFor="equipFactors02">I have access to the necessary resources to perform my job effectively.</label></td>
                        <td colSpan={2} className='w-1'>
                            <Form.Check className='mb-0' id='actionItem07' type="checkbox"
                                label={<div className="primary-color"></div>} />
                        </td>
                    </tr>
                    <tr>
                        <td className='w-1'></td>
                        <td className='w-1'>
                            <Form.Check className='mb-0' id='equipFactors03' type="checkbox"
                                label={<div className="primary-color"></div>} />
                        </td>
                        <td className='min-w-220'><label htmlFor="equipFactors03">The tools and equipment provided are effective for accomplishing my tasks.</label></td>
                        <td colSpan={2} className='w-1'>
                            <Form.Check className='mb-0' id='actionItem08' type="checkbox"
                                label={<div className="primary-color"></div>} />
                        </td>
                    </tr>
                    <tr>
                        <td className='w-1'></td>
                        <td className='w-1'>
                            <Form.Check className='mb-0' id='equipFactors04' type="checkbox"
                                label={<div className="primary-color"></div>} />
                        </td>
                        <td className='min-w-220'><label htmlFor="equipFactors04">I receive adequate training to use the tools and resources provided.</label></td>
                        <td colSpan={2} className='w-1'>
                            <Form.Check className='mb-0' id='actionItem09' type="checkbox"
                                label={<div className="primary-color"></div>} />
                        </td>
                    </tr>
                    <tr>
                        <td className='w-1'></td>
                        <td className='w-1'>
                            <Form.Check className='mb-0' id='equipFactors05' type="checkbox"
                                label={<div className="primary-color"></div>} />
                        </td>
                        <td className='min-w-220'><label htmlFor="equipFactors05">Technical support is readily available when I encounter issues with tools or equipment.</label></td>
                        <td colSpan={2} className='w-1'>
                            <Form.Check className='mb-0' id='actionItem10' type="checkbox"
                                label={<div className="primary-color"></div>} />
                        </td>
                    </tr>
                    <tr>
                        <td className='w-1 itemsTitle'>
                            <Form.Check className='mb-0' id='productivityAll'
                                type="checkbox"
                                label={<div className="primary-color"></div>} />
                        </td>
                        <td colSpan={4} className='itemsTitle'><label htmlFor="productivityAll">Impact on Productivity</label></td>
                    </tr>
                    <tr>
                        <td className='w-1'></td>
                        <td className='w-1'>
                            <Form.Check className='mb-0' id='productivity01' type="checkbox"
                                label={<div className="primary-color"></div>} />
                        </td>
                        <td className='min-w-220'><label htmlFor="productivity01">Optimization has had a positive impact on overall productivity.</label></td>
                        <td colSpan={2} className='w-1'>
                            <Form.Check className='mb-0' id='actionItem11' type="checkbox"
                                label={<div className="primary-color"></div>} />
                        </td>
                    </tr>
                    <tr>
                        <td className='w-1 itemsTitle'>
                            <Form.Check className='mb-0' id='effectivenessAll'
                                type="checkbox"
                                label={<div className="primary-color"></div>} />
                        </td>
                        <td colSpan={4} className='itemsTitle'><label htmlFor="effectivenessAll">Manager Effectiveness</label></td>
                    </tr>
                    <tr>
                        <td className='w-1'></td>
                        <td className='w-1'>
                            <Form.Check className='mb-0' id='effectiveness01' type="checkbox"
                                label={<div className="primary-color"></div>} />
                        </td>
                        <td className='min-w-220'><label htmlFor="effectiveness01">My manager demonstrates strong leadership skills.</label></td>
                        <td colSpan={2} className='w-1'>
                            <Form.Check className='mb-0' id='actionItem12' type="checkbox"
                                label={<div className="primary-color"></div>} />
                        </td>
                    </tr>
                    <tr>
                        <td className='w-1'></td>
                        <td className='w-1'>
                            <Form.Check className='mb-0' id='effectiveness02' type="checkbox"
                                label={<div className="primary-color"></div>} />
                        </td>
                        <td className='min-w-220'><label htmlFor="effectiveness02">My manager communicates expectations and goals clearly.</label></td>
                        <td colSpan={2} className='w-1'>
                            <Form.Check className='mb-0' id='actionItem13' type="checkbox"
                                label={<div className="primary-color"></div>} />
                        </td>
                    </tr>
                    <tr>
                        <td className='w-1'></td>
                        <td className='w-1'>
                            <Form.Check className='mb-0' id='effectiveness03' type="checkbox"
                                label={<div className="primary-color"></div>} />
                        </td>
                        <td className='min-w-220'><label htmlFor="effectiveness03">My manager provides adequate support and guidance to help me succeed in my role.</label></td>
                        <td colSpan={2} className='w-1'>
                            <Form.Check className='mb-0' id='actionItem14' type="checkbox"
                                label={<div className="primary-color"></div>} />
                        </td>
                    </tr>
                    <tr>
                        <td className='w-1'></td>
                        <td className='w-1'>
                            <Form.Check className='mb-0' id='effectiveness04' type="checkbox"
                                label={<div className="primary-color"></div>} />
                        </td>
                        <td className='min-w-220'><label htmlFor="effectiveness04">	I receive constructive feedback from my manager that helps me improve my performance.</label></td>
                        <td colSpan={2} className='w-1'>
                            <Form.Check className='mb-0' id='actionItem15' type="checkbox"
                                label={<div className="primary-color"></div>} />
                        </td>
                    </tr>
                    <tr>
                        <td className='w-1 itemsTitle'>
                            <Form.Check className='mb-0' id='resourcesAll'
                                type="checkbox"
                                label={<div className="primary-color"></div>} />
                        </td>
                        <td colSpan={4} className='itemsTitle'><label htmlFor="resourcesAll">Resource management</label></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};





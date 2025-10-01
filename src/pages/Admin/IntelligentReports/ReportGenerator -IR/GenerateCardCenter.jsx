import React, { useRef, useState } from "react";
import { ImageElement, ModalComponent, Button} from '../../../../components';
import ResponseRatePieChart from './Chart/ResponseRatePieChart';
import ResponseRateLineChart from './Chart/ResponseRateLineChart';
import ResponseRateTable from './ReportDataTable/ResponseRateTable';
import DimensionItemSummaryTable from './ReportDataTable/DimensionItemSummaryTable';
import EngagementIndexChart from './Chart/EngagementIndexChart';
import EngagementIndexTable from './ReportDataTable/EngagementIndexTable';
import KeyDriversEngagementTable from './ReportDataTable/KeyDriversEngagementTable';
import EquipFactorsTable from './ReportDataTable/EquipFactorsTable';
import EquipFactorsChart from './Chart/EquipFactorsChart';
import ManagerEffectivenessChart from './Chart/ManagerEffectivenessChart';
import ManagerEffectivenessTable from './ReportDataTable/ManagerEffectivenessTable';
import BreakoutComparisonTable from './ReportDataTable/BreakoutComparisonTable';
import OpenEndedResponseList from './OpenEndedResponseList';
import SupportingDocument from './SupportingDocument';
import { Link } from "react-router-dom";
import { Col, Form, Row } from "react-bootstrap";
import ActionPlanTable from "./ReportDataTable/ActionPlanTable";

export default function GenerateCardCenter({ hasActionPlan = true }) {
    const generateCardRef = useRef(null);

    // Scroll to the top function
    const scrollToTop = () => {
        // Scroll the generateCardRef to the top
        if (generateCardRef.current) {
            generateCardRef.current.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
        // Scroll the body to the top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    //Action Plan modal
    const [showActionPlan, setShowActionPlan] = useState(false);
    const actionPlanClose = () => setShowActionPlan(false);
    const actionPlanShow = () => setShowActionPlan(true);
    return (
    <>
        <div className="generateCard_center" ref={generateCardRef}>
            <div className="generateCard_wrap">
                <div className="generateCard_center_inner">
                    <div className="d-flex align-items-center justify-content-between gap-2">
                        <h3 className="reportTitle mb-0">Logo & Report Title</h3>
                        <ul className="list-unstyled mb-0 d-flex align-items-center gap-3 lh-1 cardFilter">
                            <li><Link href="#!" className="icon"><em className="icon-sliders-horizontal"></em></Link></li>
                            <li><Link href="#!" className="icon"><em className="icon-close-circle"></em></Link></li>
                        </ul>
                    </div>
                    <Row className='my-4'>
                        <Col lg={8}>
                            <div className="d-flex align-items-center justify-content-between gap-3">
                                <ImageElement source="logo.svg" className="reportLogo"/>
                                <p className="mb-0">Data</p>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="generateCard_center_inner">
                    <div className="d-flex align-items-center justify-content-between gap-2">
                        <h3 className="reportTitle mb-0">Response Rate</h3>
                        <ul className="list-unstyled mb-0 d-flex align-items-center gap-3 lh-1 cardFilter">
                            <li><Link href="#!" className="icon"><em className="icon-sliders-horizontal"></em></Link></li>
                            <li><Link href="#!" className="icon"><em className="icon-close-circle"></em></Link></li>
                        </ul>
                    </div>
                    <Row className="mt-4">
                        <Col md={4}>
                            <p className="mb-xl-4 mb-3">Response Rate</p>
                            <ResponseRatePieChart />
                            <div className="text-center mt-4 fs-6">
                                <p className="mb-0">Responses</p>
                                <span className="fw-bold">4/4</span>
                            </div>
                        </Col>
                        <Col md={8} className="border-start">
                            <p className=" fs-6">Response Rate by Day</p>
                            <ResponseRateLineChart />
                        </Col>
                    </Row>
                </div>
                <div className="generateCard_center_inner">
                    <div className="d-flex align-items-center justify-content-between gap-2">
                        <h3 className="reportTitle mb-0">Response Rate</h3>
                        <ul className="list-unstyled mb-0 d-flex align-items-center gap-3 lh-1 cardFilter">
                            <li><Link href="#!" className="icon"><em className="icon-sliders-horizontal"></em></Link></li>
                            <li><Link href="#!" className="icon"><em className="icon-close-circle"></em></Link></li>
                        </ul>
                    </div>
                    <p className="mb-0">Breakout: Department ID</p>
                    <div className="mt-4">
                        <ResponseRateTable/>
                    </div>
                </div>
                <div className="generateCard_center_inner">
                    <div className="d-flex align-items-center justify-content-between gap-2">
                        <h3 className="reportTitle mb-0">Dimension & Item Summary</h3>
                        <ul className="list-unstyled mb-0 d-flex align-items-center gap-3 lh-1 cardFilter">
                            <li><Link href="#!" className="icon"><em className="icon-sliders-horizontal"></em></Link></li>
                            <li><Link href="#!" className="icon"><em className="icon-close-circle"></em></Link></li>
                        </ul>
                    </div>
                    <p className="mb-0">Breakout: Department ID</p>
                    <div className="mt-4">
                        <DimensionItemSummaryTable actionPlanShow={hasActionPlan ? actionPlanShow : undefined}/>
                    </div>
                </div>
                <div className="generateCard_center_inner">
                    <div className="d-flex align-items-center justify-content-between gap-2">
                        <h3 className="reportTitle mb-0">Engagement Index</h3>
                        <ul className="list-unstyled mb-0 d-flex align-items-center gap-3 lh-1 cardFilter">
                            <li><Link href="#!" className="icon"><em className="icon-sliders-horizontal"></em></Link></li>
                            <li><Link href="#!" className="icon"><em className="icon-close-circle"></em></Link></li>
                        </ul>
                    </div>
                    <Row className="mt-4">
                        <Col md={4}>
                            <p className="mb-xl-4 mb-3">Engagement Index</p>
                                <EngagementIndexChart/>
                            <div className="d-flex align-items-center justify-content-between mt-4">
                                <p className="mb-0">Overall:</p>
                                <span>42%</span>
                            </div>
                        </Col>
                        <Col md={8} className="border-start">
                            <p className="mb-3">Engagement Index</p>
                            <EngagementIndexTable/>
                        </Col>
                    </Row>
                </div>
                <div className="generateCard_center_inner">
                    <div className="d-flex align-items-center justify-content-between gap-2 mb-4">
                        <h3 className="reportTitle mb-0">Key Drivers of Engagement</h3>
                        <ul className="list-unstyled mb-0 d-flex align-items-center gap-3 lh-1 cardFilter">
                            <li><Link href="#!" className="icon"><em className="icon-sliders-horizontal"></em></Link></li>
                            <li><Link href="#!" className="icon"><em className="icon-close-circle"></em></Link></li>
                        </ul>
                    </div>
                    <KeyDriversEngagementTable actionPlanShow={hasActionPlan ? actionPlanShow : undefined}/>
                </div>
                <div className="generateCard_center_inner">
                    <div className="d-flex align-items-center justify-content-between gap-2">
                        <h3 className="reportTitle mb-0">Equip Factors</h3>
                        <ul className="list-unstyled mb-0 d-flex align-items-center gap-3 lh-1 cardFilter">
                            <li><Link href="#!" className="icon"><em className="icon-sliders-horizontal"></em></Link></li>
                            <li><Link href="#!" className="icon"><em className="icon-close-circle"></em></Link></li>
                        </ul>
                    </div>
                    <Row className="mt-4">
                        <Col md={4}>
                            <p className="mb-xl-4 mb-3">Equip Factors</p>
                                <EquipFactorsChart/>
                            <div className="d-flex align-items-center justify-content-between mt-4">
                                <p className="mb-0">Overall:</p>
                                <span>28%</span>
                            </div>
                        </Col>
                        <Col md={8} className="border-start">
                            <p className="mb-3">Equip Factors</p>
                            <EquipFactorsTable actionPlanShow={hasActionPlan ? actionPlanShow : undefined}/>
                        </Col>
                    </Row>
                </div>
                <div className="generateCard_center_inner">
                    <div className="d-flex align-items-center justify-content-between gap-2">
                        <h3 className="reportTitle mb-0">Manager Effectiveness</h3>
                        <ul className="list-unstyled mb-0 d-flex align-items-center gap-3 lh-1 cardFilter">
                            <li><Link href="#!" className="icon"><em className="icon-sliders-horizontal"></em></Link></li>
                            <li><Link href="#!" className="icon"><em className="icon-close-circle"></em></Link></li>
                        </ul>
                    </div>
                    <Row className="mt-4">
                        <Col md={4}>
                            <p className="mb-xl-4 mb-3">Manager Effectiveness</p>
                                <ManagerEffectivenessChart/>
                            <div className="d-flex align-items-center justify-content-between mt-4">
                                <p className="mb-0">Overall:</p>
                                <span>33%</span>
                            </div>
                        </Col>
                        <Col md={8} className="border-start">
                            <p className="mb-3">Manager Effectiveness</p>
                            <ManagerEffectivenessTable actionPlanShow={hasActionPlan ? actionPlanShow : undefined}/>
                        </Col>
                    </Row>
                </div>
                <div className="generateCard_center_inner">
                    <div className="d-flex align-items-center justify-content-between gap-2">
                        <h3 className="reportTitle mb-0">Breakout Comparison</h3>
                        <ul className="list-unstyled mb-0 d-flex align-items-center gap-3 lh-1 cardFilter">
                            <li><Link href="#!" className="icon"><em className="icon-sliders-horizontal"></em></Link></li>
                            <li><Link href="#!" className="icon"><em className="icon-close-circle"></em></Link></li>
                        </ul>
                    </div>
                    <p className="mb-0">Comparison: -</p>
                    <p className="mb-xl-4 mb-3">Breakout:</p>
                    <BreakoutComparisonTable/>
                </div>
                <div className="generateCard_center_inner">
                    <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
                        <h3 className="reportTitle mb-0">Word Cloud</h3>
                        <ul className="list-unstyled mb-0 d-flex align-items-center gap-3 lh-1 cardFilter">
                            <li><Link href="#!" className="icon"><em className="icon-sliders-horizontal"></em></Link></li>
                            <li><Link href="#!" className="icon"><em className="icon-close-circle"></em></Link></li>
                        </ul>
                    </div>
                    <ImageElement source="word-cloud.png" className="img-fluid"/>
                </div>
                <div className="generateCard_center_inner">
                    <div className="d-flex align-items-center justify-content-between gap-2">
                        <h3 className="reportTitle mb-0">Page Break</h3>
                        <ul className="list-unstyled mb-0 d-flex align-items-center gap-3 lh-1 cardFilter">
                            <li><Link href="#!" className="icon"><em className="icon-close-circle"></em></Link></li>
                        </ul>
                    </div>
                    <p className="my-3 fs-6 text-center">--- Page Break ---</p>
                </div>
                <div className="generateCard_center_inner">
                    <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
                        <h3 className="reportTitle mb-0">Open Ended Response</h3>
                        <ul className="list-unstyled mb-0 d-flex align-items-center gap-3 lh-1 cardFilter">
                            <li><Link href="#!" className="icon"><em className="icon-sliders-horizontal"></em></Link></li>
                            <li><Link href="#!" className="icon"><em className="icon-close-circle"></em></Link></li>
                        </ul>
                    </div>
                    <OpenEndedResponseList/>
                </div>
                <div className="generateCard_center_inner">
                    <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
                        <h3 className="reportTitle mb-0">Supporting Document</h3>
                        <ul className="list-unstyled mb-0 d-flex align-items-center gap-3 lh-1 cardFilter">
                            <li><Link href="#!" className="icon"><em className="icon-sliders-horizontal"></em></Link></li>
                            <li><Link href="#!" className="icon"><em className="icon-close-circle"></em></Link></li>
                        </ul>
                    </div>
                    <SupportingDocument/>
                </div>
                <div className="generateCard_center_inner">
                    <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
                        <h3 className="reportTitle mb-0">Action Item Planner</h3>
                        <ul className="list-unstyled mb-0 d-flex align-items-center gap-3 lh-1 cardFilter">
                            <li><Link href="#!" className="icon"><em className="icon-sliders-horizontal"></em></Link></li>
                            <li><Link href="#!" className="icon"><em className="icon-close-circle"></em></Link></li>
                        </ul>
                    </div>
                    <h4 className="reportSubTitle mb-3">Action Planner Sub-Title</h4>
                    <ActionPlanTable/>
                </div>
            </div>
            <Link to={"#!"} onClick={scrollToTop} className="moveToTop"><em className="icon-drop-down"></em></Link>
        </div>
        {/* Action plan modal */}
        <ModalComponent modalHeader="Action Plan" size={'xl'} show={showActionPlan} onHandleCancel={actionPlanClose}>
            <div className='d-flex align-items-center'><span>Notice :</span><sup className='text-danger'>*</sup> 
                <Form.Group className="form-group mb-2 ms-2" controlId="checkAll">
                    <Form.Check
                        className="me-0"
                        type="checkbox"
                        disabled
                        label={<div className="primary-color"></div>}
                    />
                </Form.Group> 
                <span>Edited Content</span>
            </div>
            <ActionPlanTable/>
            <div className="d-flex justify-content-end gap-2">
                <Button variant='primary' className='ripple-effect'>Save</Button>
                <Button variant='secondary' className='ripple-effect' onClick={actionPlanClose}>Cancel</Button>
            </div>
        </ModalComponent>
        {/* delete modal */}
    </>
    )
}
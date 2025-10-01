import { Button, Col, Collapse, Dropdown, Form, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";
import { InputField } from "../../../../../components";

export default function OpenEndedQuestion(){
    const [open, setOpen] = useState(false);
    const [showOpenEndedQuestion, setShowOpenEndedQuestion] = useState(true);
    const [showOpenQuesPrev, setShowOpenQuesPrev] = useState(false);
    const [showAddOutcomesfirst, setshowAddOutcomesfirst] = useState(false);

    const handleOpenQuesPrev = () =>{
        setShowOpenEndedQuestion(false);
        setShowOpenQuesPrev(true);
        setshowAddOutcomesfirst(true);
    }
    return(
            <div className="dataAnalyticsCol">
                <Button className='d-flex align-items-center justify-content-between' onClick={() => setOpen(!open)} aria-controls="dataanalyticscol" aria-expanded={open}>
                    <div className='d-flex align-items-center'>
                        <em className='icon-drag' /> <h2><span>1.</span> Data Analytics </h2>
                        <Link to="#!" className='p-0'>
                            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Populate colors from color palette</Tooltip>}>
                                <span className="d-inline-block">
                                    <em disabled style={{ pointerEvents: 'none' }} className="icon-info-circle ms-1" />
                                </span>
                            </OverlayTrigger>
                        </Link> 
                    </div>
                    <div className='d-flex align-items-center gap-3'> 
                        <em className='icon-table-edit' />
                        <em className='icon-delete' />
                        <em className='icon-collapse-arrow' />
                    </div>
                </Button>
                <Collapse in={open}>
                    <div id="dataanalyticscol">
                        <div className="dataAnalyticsCol_inner">
                            <Form>
                                <div className="outComes">
                                    <div className='outcomeName'>
                                        <h3 className='dataAnalyticsCol_Head'> Employee Satisfaction </h3>
                                        <p className='dataAnalyticsCol_Para'>Gauge employee satisfaction and gather insights to enhance workplace well-being and productivity.</p>
                                    </div>
                                </div>
                                <div className="ratingQuestion">
                                    {showOpenEndedQuestion && (
                                        <>
                                            <h4 className='ratingQuestion_Head'>Open-Ended Question</h4>
                                            <p className='ratingQuestion_Para mb-3'>10 Questions added so far; 90 Questions can be added.</p>
                                            <Row className='gy-3 gx-2'>
                                                <Col sm={12}>
                                                    <Form.Group className="form-group mb-0">
                                                        <div className='d-flex justify-content-between mb-2'>
                                                            <Form.Label className='mb-0'>Question <sup>*</sup></Form.Label>
                                                            <Form.Group className="form-group mb-0 flex-shrink-0" controlId="skip1">
                                                                <Form.Check className='me-0' type="checkbox"
                                                                    label={
                                                                        <div> Add Question To &quot; Resource&quot; </div>
                                                                    }
                                                                />
                                                            </Form.Group>
                                                        </div>
                                                        <InputField type="text" placeholder="Enter Question"  />
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={6}>
                                                    <Form.Group className="form-group mb-0">
                                                        <Form.Label className='mb-2'>Intentions <sup>*</sup></Form.Label>
                                                        <InputField type="text" placeholder="Work environment is conducive to productivity"  />
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={6}>
                                                    <Form.Group className="form-group mb-0">
                                                        <Form.Label className='mb-2'>Intentions Short Name <sup>*</sup>
                                                        <Link to="#!" className='p-0'>
                                                            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Populate colors from color palette</Tooltip>}>
                                                                <span className="d-inline-block">
                                                                    <em disabled style={{ pointerEvents: 'none' }} className="icon-info-circle ms-1" />
                                                                </span>
                                                            </OverlayTrigger>
                                                        </Link>
                                                        </Form.Label>
                                                        <InputField type="text" placeholder="Work Environment"  />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <div className=' mt-3 pt-1'>
                                                <Form.Group className='form-group switchaxis d-flex align-items-center'>
                                                    <Form.Label className="mb-0 me-3 w-auto">Display Skip For Now <sup>*</sup></Form.Label>
                                                    <div className="switchBtn">
                                                        <InputField type="checkbox" defaultValue="1" id="switchaxis1" className="p-0"/>
                                                        <label htmlFor="switchaxis1" />
                                                    </div>
                                                </Form.Group>
                                            </div>
                                            <div className="d-flex justify-content-end gap-2">
                                                <Button variant="secondary" className="ripple-effect" >Cancel</Button>
                                                <Button variant="primary" className="ripple-effect" onClick={handleOpenQuesPrev} >Save</Button>
                                            </div>
                                        </>
                                    ) }
                                    {showOpenQuesPrev && (
                                        <>
                                        <div className="commonQuestion">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <p>1. Do you feel that the work environment is conducive to productivity?</p>
                                                <div className='d-flex align-items-center gap-3'>
                                                    <Link to="#!">
                                                        <em className='icon-table-edit' />
                                                    </Link>
                                                    <Link to="#!">
                                                        <em className='icon-copy' />
                                                    </Link>
                                                    <Link to="#!">
                                                        <em className='icon-delete' />
                                                    </Link>
                                                </div>
                                            </div>
                                            <Form.Group className="form-group mb-0">
                                                <Form.Control as="textarea" className="form-control form-control-md" placeholder="Enter Question" />
                                            </Form.Group>
                                            <Form.Group className="form-group mb-0 d-inline-block" controlId="skip2">
                                                <Form.Check className='me-0' type="checkbox"
                                                    label={
                                                        <div className="text-danger">
                                                            Skip
                                                        </div>
                                                    }
                                                />
                                            </Form.Group>
                                        </div>
                                            <div className="addOutcomes text-center d-flex align-items-center flex-column">
                                            <div className="d-flex gap-2">
                                                <Button variant="outline-primary" className="ripple-effect">
                                                    <em className='icon-import me-2'/> Import from Question Bank
                                                </Button>
                                                <Dropdown>
                                                    <Dropdown.Toggle variant="primary">
                                                        <em className="icon-plus" />Add Outcomes
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item href="#!">Data Analytics</Dropdown.Item>
                                                        <Dropdown.Item href="#!">Information Gathering</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
                                        </div>
                                        </>
                                    )} 
                                </div>
                            </Form>
                        </div>
                    </div>
                </Collapse>
                {showAddOutcomesfirst && (
                <div className="addOutcomes mt-2 text-center d-flex align-items-center flex-column">
                    <Dropdown>
                        <Dropdown.Toggle variant="primary">
                            <em className="icon-plus" />Add Outcomes
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item href="#!">Data Analytics</Dropdown.Item>
                            <Dropdown.Item href="#!">Information Gathering</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <p className='mb-0 fw-medium mt-3'><span>Or</span> drag and drop Outcomes from the left panel</p>
                </div>
                )}
            </div> 
    )
}
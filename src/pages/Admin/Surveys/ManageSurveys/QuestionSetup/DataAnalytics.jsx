import { useState } from "react";
import { Button, Collapse, Dropdown, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function DataAnalytics(){
    const [open, setOpen] = useState(false);

    const [showAddOutcomes, setShowAddOutcomes] = useState(true);
    const [showOutComeName, setshowOutComeName] = useState(true);
    const [showDataAnalyticsCol, setShowDataAnalyticsCol] = useState(false);
    const [showOutComes, setShowOutComes] = useState(true);
    const [showAddOutcomesfirst, setShowAddOutcomesfirst] = useState(false);

    const handleDataAnalyticsClick = () => {
        setShowAddOutcomes(false);  // Hide addOutcomes
        setShowDataAnalyticsCol(true);  // Show dataAnalyticsCol
        setShowOutComes(false);  // Hide outComes div
        setShowAddOutcomesfirst(false);  // Hide addOutcomesfirst div
    };

    const handleImportQuestion = () =>{
        setshowOutComeName(false)
        setShowOutComes(true);
        setShowAddOutcomesfirst(true);
    }
    return (
        <>
            {showAddOutcomes && (
                <div className="addOutcomes text-center d-flex align-items-center flex-column">
                    <Dropdown>
                        <Dropdown.Toggle variant="primary">
                            <em className="icon-plus" />Add Outcomes
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item href="#!" onClick={handleDataAnalyticsClick}>Data Analytics</Dropdown.Item>
                            <Dropdown.Item href="#!">Information Gathering</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <p className='mb-0 fw-medium mt-3'><span>Or</span> drag and drop Outcomes from the left panel</p>
                </div>
            )}
            {showDataAnalyticsCol && (
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
                                    {showOutComeName && (
                                        <div className="outcomeName">
                                            <Form.Group className="form-group mb-3">
                                                <Form.Control as="textarea" className=" form-control form-control-md" placeholder="Outcomes Name..." />
                                            </Form.Group>
                                            <Form.Group className="form-group mb-0">
                                                <Form.Control as="textarea" className="outcomeDescription form-control form-control-md" placeholder="Enter Outcome Description " />
                                            </Form.Group>
                                            <div className="d-flex gap-2 mt-2">
                                                <Button variant="secondary" className="ripple-effect">Cancel</Button>
                                                <Button variant="primary" className="ripple-effect" onClick={handleImportQuestion}>Save</Button>
                                            </div>
                                        </div>
                                    )}
                                    {showOutComes && (
                                        <div className="outComes">
                                            <div className='outcomeName'>
                                                <h3 className='dataAnalyticsCol_Head'> Employee Satisfaction </h3>
                                                <p className='dataAnalyticsCol_Para'>Gauge employee satisfaction and gather insights to enhance workplace well-being and productivity.</p>
                                            </div>    
                                            <div className="addOutcomes text-center d-flex align-items-center flex-column">
                                                <div className="d-flex gap-2">
                                                    <Button variant="outline-primary" className="ripple-effect">
                                                        <em className='icon-import me-2'/>
                                                        Import from Question Bank
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
                                                <p className='mb-0 fw-medium mt-3'><span>Or</span> drag and drop Outcomes from the left panel</p>
                                            </div>
                                        </div>
                                    )}
                                </Form>
                            </div>
                        </div>
                    </Collapse>
                </div>
            )}
            {showAddOutcomesfirst && (
                <div className="mt-2 addOutcomes text-center d-flex align-items-center flex-column">
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
        </> 
    )
}
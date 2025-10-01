
import { Col, Collapse, Dropdown, Form, OverlayTrigger, Row, Tooltip } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useState } from "react";
import { Button, InputField, SelectField } from "../../../../../components"

export default function MultiResponse(){

    const [open, setOpen] = useState(false);

    const [showMultiPreview, setShowMultiPreview] = useState(false);
    const [showMultiResponse, setShowMultiResponse] = useState(true);

    const handleMultiPreview = () =>{
        setShowMultiPreview(true);
        setShowMultiResponse(false);
    }


    // chart type Options
    const chartTypeOptions = [
        { value: 'Line', label: 'Line' },
        { value: 'Column', label: 'Column' },
        { value: 'Bar', label: 'Bar' }  
    ]
    return (
        <>
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
                                {showMultiResponse && (
                                    <>
                                     <h4 className='ratingQuestion_Head'>Multi Response</h4>
                                     <p className='ratingQuestion_Para mb-3'>10 Questions added so far; 90 Questions can be added.</p>
                                        <Form.Group className="form-group mb-0">
                                            <div className='d-flex justify-content-between mb-2'>
                                                <Form.Label className='mb-0'>Framing Question <sup>*</sup></Form.Label>
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
                                        
                                     <div className='d-flex gap-5 mt-3 pt-1'>
                                         <Form.Group className='form-group switchaxis d-flex align-items-center'>
                                             <Form.Label className="mb-0 me-3 w-auto">Display Skip For Now <sup>*</sup></Form.Label>
                                             <div className="switchBtn">
                                                 <InputField type="checkbox" defaultValue="1" id="switchaxis1" className="p-0"/>
                                                 <label htmlFor="switchaxis1" />
                                             </div>
                                         </Form.Group>
                                        
                                     </div>
                                     <div className="d-flex justify-content-between gap-2 my-4 align-items-center">
                                        <h6 className="ratingQuestion_Subhead mb-0">Sub-Questions</h6>
                                        <Form.Group className='form-group switchaxis d-flex align-items-center mb-0'>
                                             <Form.Label className="mb-0 me-3 w-auto">Display Skip For Now <sup>*</sup></Form.Label>
                                             <div className="switchBtn">
                                                 <InputField type="checkbox" defaultValue="1" id="switchaxis1" className="p-0"/>
                                                 <label htmlFor="switchaxis1" />
                                             </div>
                                         </Form.Group>
                                    </div>
                                    <div className="scalarSec subQuestion">
                                        <div className="d-flex justify-content-between gap-2 mb-0 align-items-center">
                                            <div className="sequence title">Sl.No.</div>
                                            <div className="color title">Anchor </div>
                                            <div className="maximum title">Response </div>
                                            <div className="addeletebtn title justify-content-center">+/-</div>
                                        </div>
                                        <div className="scalarappend_list d-flex justify-content-between gap-2 align-items-center">
                                            <div className="sequence d-flex align-items-center"> <em className='icon-drag' /> 1.</div>
                                            <div className="color">
                                                <Form.Group className="form-group mb-0 d-flex align-items-center justify-content-center" controlId="anchor1">
                                                    <Form.Check className='me-0 mb-0' type="checkbox"
                                                        label={
                                                            <div />
                                                        }
                                                    />
                                                </Form.Group>
                                            </div>
                                            <Form.Group className="form-group maximum">
                                                 <InputField type="text" placeholder="Strongly Disagree" defaultValue=""/>
                                             </Form.Group>
                                            
                                            <div className="addeletebtn d-flex gap-2">
                                                <Link to="#!" className="addbtn addscaler"><span>+</span></Link>
                                            </div>
                                        </div>
                                        <div className="scalarappend_list d-flex justify-content-between gap-2 align-items-center">
                                            <div className="sequence d-flex align-items-center"> <em className='icon-drag' /> 2.</div>
                                            <div className="color">
                                                <Form.Group className="form-group mb-0 d-flex align-items-center justify-content-center" controlId="anchor2">
                                                    <Form.Check className='me-0 mb-0' type="checkbox"
                                                        label={
                                                            <div />
                                                        }
                                                    />
                                                </Form.Group>
                                            </div>
                                            <Form.Group className="form-group maximum">
                                                 <InputField type="text" placeholder="Strongly Disagree" defaultValue=""/>
                                             </Form.Group>
                                            
                                            <div className="addeletebtn d-flex gap-2">
                                                <Link to="#!" className="deletebtn deletebtnscaler">
                                                     <em className="icon-delete" />
                                                 </Link>
                                            </div>
                                        </div>
                                        <div className="scalarappend_list d-flex justify-content-between gap-2 align-items-center">
                                            <div className="sequence d-flex align-items-center"> <em className='icon-drag' /> 3.</div>
                                            <div className="color">
                                                <Form.Group className="form-group mb-0 d-flex align-items-center justify-content-center" controlId="anchor3">
                                                    <Form.Check className='me-0 mb-0' type="checkbox"
                                                        label={
                                                            <div />
                                                        }
                                                    />
                                                </Form.Group>
                                            </div>
                                            <Form.Group className="form-group maximum">
                                                 <InputField type="text" placeholder="Strongly Disagree" defaultValue=""/>
                                             </Form.Group>
                                            
                                            <div className="addeletebtn d-flex gap-2">
                                                <Link to="#!" className="deletebtn deletebtnscaler">
                                                     <em className="icon-delete" />
                                                 </Link>
                                            </div>
                                        </div>
                                        <div className="scalarappend_list d-flex justify-content-between gap-2 align-items-center">
                                            <div className="sequence d-flex align-items-center"> <em className='icon-drag' /> 4.</div>
                                            <div className="color">
                                                <Form.Group className="form-group mb-0 d-flex align-items-center justify-content-center" controlId="anchor4">
                                                    <Form.Check className='me-0 mb-0' type="checkbox"
                                                        label={
                                                            <div />
                                                        }
                                                    />
                                                </Form.Group>
                                            </div>
                                            <Form.Group className="form-group maximum">
                                                 <InputField type="text" placeholder="Strongly Disagree" defaultValue=""/>
                                             </Form.Group>
                                            
                                            <div className="addeletebtn d-flex gap-2">
                                                <Link to="#!" className="deletebtn deletebtnscaler">
                                                     <em className="icon-delete" />
                                                 </Link>
                                            </div>
                                        </div>
                                        <div className="scalarappend_list d-flex justify-content-between gap-2 align-items-center">
                                            <div className="sequence d-flex align-items-center"> <em className='icon-drag' /> 5.</div>
                                            <div className="color">
                                                <Form.Group className="form-group mb-0 d-flex align-items-center justify-content-center" controlId="anchor5">
                                                    <Form.Check className='me-0 mb-0' type="checkbox"
                                                        label={
                                                            <div />
                                                        }
                                                    />
                                                </Form.Group>
                                            </div>
                                            <Form.Group className="form-group maximum">
                                                 <InputField type="text" placeholder="Strongly Disagree" defaultValue=""/>
                                             </Form.Group>
                                            
                                            <div className="addeletebtn d-flex gap-2">
                                                <Link to="#!" className="deletebtn deletebtnscaler">
                                                     <em className="icon-delete" />
                                                 </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="multiResponse">
                                        <Row className='gx-2 gy-3'>
                                            <Col sm={12}>
                                                <Form.Group className="form-group mb-0">
                                                    <Form.Label>Defining Question <sup>*</sup></Form.Label>
                                                    <InputField type="text" placeholder="Enter Question"  />
                                                </Form.Group>
                                             </Col>
                                             <Col sm={6}>
                                                <Form.Group className="form-group mb-0">
                                                    <Form.Label>Intentions <sup>*</sup></Form.Label>
                                                    <InputField type="text" placeholder=" Work Environment Is Conducive To Productivity"  />
                                                </Form.Group>
                                             </Col>
                                             <Col sm={6}>
                                                <Form.Group className="form-group mb-0">
                                                    <Form.Label>Intentions Short Name <sup>*</sup> <Link to="#!" className='p-0'>
                                                        <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Populate colors from color palette</Tooltip>}>
                                                            <span className="d-inline-block">
                                                                <em disabled style={{ pointerEvents: 'none' }} className="icon-info-circle ms-1" />
                                                            </span>
                                                        </OverlayTrigger>
                                                    </Link> </Form.Label>
                                                    <InputField type="text" placeholder=" Work Environment Is Conducive To Productivity"  />
                                                </Form.Group>
                                             </Col>
                                            <Col sm={6}>
                                                <Form.Group className="form-group">
                                                    <Form.Label>Response Type <sup>*</sup> <Link to="#!" className='p-0'>
                                                        <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Populate colors from color palette</Tooltip>}>
                                                            <span className="d-inline-block">
                                                                <em disabled style={{ pointerEvents: 'none' }} className="icon-info-circle ms-1" />
                                                            </span>
                                                        </OverlayTrigger>
                                                    </Link> </Form.Label>
                                                    <SelectField  placeholder="Free From" options={chartTypeOptions} />
                                                </Form.Group>
                                            </Col>
                                            <Col sm={6}>
                                                <Form.Group className="form-group">
                                                    <Form.Label>Scale <sup>*</sup> </Form.Label>
                                                    <SelectField  placeholder="'5'" options={chartTypeOptions} />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <div className="scalarSec scalarappend">
                                            <div className="d-flex justify-content-between gap-2 mb-0 align-items-center">
                                                <div className="sequence title">Sl.No.</div>
                                                <div className="scalar title">Response </div>
                                                <div className="maximum title">Value </div>
                                                <div className="maximum title">Response Category </div>
                                                <div className="color title"> Oeq
                                                    <Link to="#!" className='p-0'>
                                                        <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Populate colors from color palette</Tooltip>}>
                                                            <span className="d-inline-block">
                                                                <em disabled style={{ pointerEvents: 'none' }} className="icon-info-circle ms-1" />
                                                            </span>
                                                        </OverlayTrigger>
                                                    </Link> 
                                                </div>
                                                <div className="addeletebtn title justify-content-center">+/-</div>
                                            </div>
                                            <div className="scalarappend_list d-flex justify-content-between gap-2 align-items-center">
                                                <div className="sequence"> 1.</div>
                                                <Form.Group className="form-group scalar">
                                                    <InputField type="text" placeholder="Enter Name" defaultValue="Very Low"/>
                                                </Form.Group>
                                                <Form.Group className="form-group maximum">
                                                    <InputField type="number" placeholder="1" defaultValue="1"/>
                                                </Form.Group>
                                                <Form.Group className="form-group maximum">
                                                    <SelectField  placeholder="positive" options={chartTypeOptions} />
                                                </Form.Group>
                                                <div className="color">
                                                    <Form.Group className="form-group mb-0 d-flex align-items-center justify-content-center" controlId="oeq1">
                                                        <Form.Check className='me-0 mb-0' type="checkbox"
                                                            label={
                                                                <div />
                                                            }
                                                        />
                                                    </Form.Group>
                                                </div>
                                                <div className="addeletebtn d-flex gap-2">
                                                    <Link to="#!" className="addbtn addscaler"><span>+</span></Link>
                                                </div>
                                            </div>
                                            <div className="scalarappend_list d-flex justify-content-between gap-2 align-items-center">
                                                <div className="sequence">2.</div>
                                                <Form.Group className="form-group scalar">
                                                    <InputField type="text" placeholder="Enter Name" defaultValue="Low"/>
                                                </Form.Group>
                                                <Form.Group className="form-group maximum">
                                                    <InputField type="number" placeholder="21" defaultValue="21"/>
                                                </Form.Group>
                                                <Form.Group className="form-group maximum">
                                                    <SelectField  placeholder="positive" options={chartTypeOptions} />  
                                                </Form.Group>
                                                <div className="color">
                                                    <Form.Group className="form-group mb-0 d-flex align-items-center justify-content-center" controlId="oeq2">
                                                        <Form.Check className='me-0 mb-0' type="checkbox"
                                                            label={
                                                                <div />
                                                            }
                                                        />
                                                    </Form.Group>
                                                </div>
                                                <div className="addeletebtn d-flex gap-2">
                                                    <Link to="#!" className="deletebtn deletebtnscaler">
                                                        <em className="icon-delete" />
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="scalarappend_list d-flex justify-content-between gap-2 align-items-center">
                                                <div className="sequence">3.</div>
                                                <Form.Group className="form-group scalar">
                                                    <InputField type="text" placeholder="Enter Name" defaultValue="Average"/>
                                                </Form.Group>
                                                <Form.Group className="form-group maximum">
                                                    <InputField type="number" placeholder="41" defaultValue="41"/>
                                                </Form.Group>
                                                <Form.Group className="form-group maximum">
                                                    <SelectField  placeholder="positive" options={chartTypeOptions} />
                                                </Form.Group>
                                                <div className="color">
                                                    <Form.Group className="form-group mb-0 d-flex align-items-center justify-content-center" controlId="oeq3">
                                                        <Form.Check className='me-0 mb-0' type="checkbox"
                                                            label={
                                                                <div />
                                                            }
                                                        />
                                                    </Form.Group>
                                                </div>
                                                <div className="addeletebtn d-flex gap-2">
                                                    <Link to="#!" className="deletebtn deletebtnscaler">
                                                        <em className="icon-delete" />
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="scalarappend_list d-flex justify-content-between gap-2 align-items-center">
                                                <div className="sequence">4.</div>
                                                <Form.Group className="form-group scalar">
                                                    <InputField type="text" placeholder="Enter Name" defaultValue="High"/>
                                                </Form.Group>
                                                <Form.Group className="form-group maximum">
                                                    <InputField type="number" placeholder="61" defaultValue="61"/>
                                                </Form.Group>
                                                <Form.Group className="form-group maximum">
                                                    <SelectField  placeholder="positive" options={chartTypeOptions} />
                                                </Form.Group>
                                                <div className="color">
                                                    <Form.Group className="form-group mb-0 d-flex align-items-center justify-content-center" controlId="oeq4">
                                                        <Form.Check className='me-0 mb-0' type="checkbox"
                                                            label={
                                                                <div />
                                                            }
                                                        />
                                                    </Form.Group>
                                                </div>
                                                <div className="addeletebtn d-flex gap-2">
                                                    <Link to="#!" className="deletebtn deletebtnscaler">
                                                        <em className="icon-delete" />
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="scalarappend_list d-flex justify-content-between gap-2 align-items-center">
                                                <div className="sequence">5.</div>
                                                <Form.Group className="form-group scalar">
                                                    <InputField type="text" placeholder="Enter Name" defaultValue="Very High"/>
                                                </Form.Group>
                                                <Form.Group className="form-group maximum">
                                                    <InputField type="number" placeholder="81" defaultValue="81"/>
                                                </Form.Group>
                                                <Form.Group className="form-group maximum"> 
                                                    <SelectField  placeholder="positive" options={chartTypeOptions} />
                                                </Form.Group>
                                                <div className="color">
                                                    <Form.Group className="form-group mb-0 d-flex align-items-center justify-content-center" controlId="oeq5">
                                                        <Form.Check className='me-0 mb-0' type="checkbox"
                                                            label={
                                                                <div />
                                                            }
                                                        />
                                                    </Form.Group>
                                                </div>
                                                <div className="addeletebtn d-flex gap-2">
                                                    <Link to="#!" className="deletebtn deletebtnscaler">
                                                        <em className="icon-delete" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-between gap-2">
                                        <Button variant="primary" className="ripple-effect"> <em className="icon-plus me-1" /> Add Response</Button>
                                        <div className="d-flex gap-2">
                                            <Button variant="secondary" className="ripple-effect">Cancel</Button>
                                            <Button variant="primary" className="ripple-effect" onClick={handleMultiPreview}>Save</Button>
                                        </div>
                                    </div>
                                    </>
                                )}
                               
                                {showMultiPreview && (
                                    <>
                                    <div className="assessingTable impactTable pb-2">
                                        <p className="assessingTable_head d-flex align-items-center"><em className="icon-drag" /> 1. Satisfied are you with the work-life balance provided by the company?</p>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th> <div className='w-240' /> </th>
                                                    <th colSpan="5">Analyze the broader effects of efficiency gains on business outcomes like profitability and customer satisfaction.</th>
                                                    <th />
                                                    <th colSpan="5">Analyze the broader effects of efficiency gains on business outcomes like profitability and customer satisfaction.</th>
                                                    <th />
                                                    <th colSpan="5">Analyze the broader effects of efficiency gains on business outcomes like profitability and customer satisfaction.</th>
                                                </tr>
                                                <tr>
                                                    <th />
                                                    <th>Strongly disagree</th>
                                                    <th>Disagree</th>
                                                    <th>Neutral</th>
                                                    <th>Agree</th>
                                                    <th> Strongly agree</th>
                                                    <th />
                                                    <th>Strongly disagree</th>
                                                    <th>Disagree</th>
                                                    <th>Neutral</th>
                                                    <th>Agree</th>
                                                    <th> Strongly agree</th>
                                                    <th />
                                                    <th>Strongly disagree</th>
                                                    <th>Disagree</th>
                                                    <th>Neutral</th>
                                                    <th>Agree</th>
                                                    <th> Strongly agree</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td> <div className='w-240'> 1. How have improvements in operational efficiency impacted overall business performance? </div></td>
                                                    <td>
                                                        <Form.Check
                                                            type="radio"
                                                            id="stronglydisagree11"
                                                            label=""
                                                            name="radiogroup1"
                                                        />
                                                    </td>
                                                    <td>
                                                        <Form.Check
                                                            type="radio"
                                                            id="disagree12"
                                                            label=""
                                                            name="radiogroup1"
                                                        />
                                                    </td>
                                                    <td>
                                                        <Form.Check
                                                            type="radio"
                                                            id="neutral13"
                                                            label=""
                                                            name="radiogroup1"
                                                        />
                                                    </td>
                                                    <td>
                                                        <Form.Check
                                                            type="radio"
                                                            id="agree14"
                                                            label=""
                                                            name="radiogroup1"
                                                        />
                                                    </td>
                                                    <td>
                                                        <Form.Check
                                                            type="radio"
                                                            id="stronglyagree15"
                                                            label=""
                                                            name="radiogroup1"
                                                        />
                                                    </td>
                                                    <td />
                                                    <td>
                                                        <Form.Check
                                                            type="radio"
                                                            id="stronglydisagree21"
                                                            label=""
                                                            name="radiogroup12"
                                                        />
                                                    </td>
                                                    <td>
                                                        <Form.Check
                                                            type="radio"
                                                            id="disagree22"
                                                            label=""
                                                            name="radiogroup12"
                                                        />
                                                    </td>
                                                    <td>
                                                        <Form.Check
                                                            type="radio"
                                                            id="neutral23"
                                                            label=""
                                                            name="radiogroup12"
                                                        />
                                                    </td>
                                                    <td>
                                                        <Form.Check
                                                            type="radio"
                                                            id="agree24"
                                                            label=""
                                                            name="radiogroup12"
                                                        />
                                                    </td>
                                                    <td>
                                                        <Form.Check
                                                            type="radio"
                                                            id="stronglyagree25"
                                                            label=""
                                                            name="radiogroup12"
                                                        />
                                                    </td>
                                                    <td />
                                                    <td>
                                                        <Form.Check
                                                            type="radio"
                                                            id="stronglydisagree31"
                                                            label=""
                                                            name="radiogroup13"
                                                        />
                                                    </td>
                                                    <td>
                                                        <Form.Check
                                                            type="radio"
                                                            id="disagree32"
                                                            label=""
                                                            name="radiogroup13"
                                                        />
                                                    </td>
                                                    <td>
                                                        <Form.Check
                                                            type="radio"
                                                            id="neutral33"
                                                            label=""
                                                            name="radiogroup13"
                                                        />
                                                    </td>
                                                    <td>
                                                        <Form.Check
                                                            type="radio"
                                                            id="agree34"
                                                            label=""
                                                            name="radiogroup13"
                                                        />
                                                    </td>
                                                    <td>
                                                        <Form.Check
                                                            type="radio"
                                                            id="stronglyagree35"
                                                            label=""
                                                            name="radiogroup13"
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td> <div className='w-240'> 2. What feedback have we received from employees regarding process changes?	</div></td>
                                                    <td>
                                                        <Form.Check
                                                            type="radio"
                                                            id="stronglydisagree41"
                                                            label=""
                                                            name="radiogroup21"
                                                        />
                                                    </td>
                                                    <td>
                                                        <Form.Check
                                                            type="radio"
                                                            id="disagree42"
                                                            label=""
                                                            name="radiogroup21"
                                                        />
                                                    </td>
                                                    <td>
                                                        <Form.Check
                                                            type="radio"
                                                            id="neutral43"
                                                            label=""
                                                            name="radiogroup21"
                                                        />
                                                    </td>
                                                    <td>
                                                        <Form.Check
                                                            type="radio"
                                                            id="agree44"
                                                            label=""
                                                            name="radiogroup21"
                                                        />
                                                    </td>
                                                    <td>
                                                        <Form.Check
                                                            type="radio"
                                                            id="stronglyagree45"
                                                            label=""
                                                            name="radiogroup21"
                                                        />
                                                    </td>
                                                    <td />
                                                    <td>
                                                        <Form.Check
                                                            type="radio"
                                                            id="stronglydisagree51"
                                                            label=""
                                                            name="radiogroup22"
                                                        />
                                                    </td>
                                                    <td>
                                                        <Form.Check
                                                            type="radio"
                                                            id="disagree52"
                                                            label=""
                                                            name="radiogroup22"
                                                        />
                                                    </td>
                                                    <td>
                                                        <Form.Check
                                                            type="radio"
                                                            id="neutral53"
                                                            label=""
                                                            name="radiogroup22"
                                                        />
                                                    </td>
                                                    <td>
                                                        <Form.Check
                                                            type="radio"
                                                            id="agree54"
                                                            label=""
                                                            name="radiogroup22"
                                                        />
                                                    </td>
                                                    <td>
                                                        <Form.Check
                                                            type="radio"
                                                            id="stronglyagree55"
                                                            label=""
                                                            name="radiogroup22"
                                                        />
                                                    </td>
                                                    <td />
                                                    <td>
                                                        <Form.Check
                                                            type="radio"
                                                            id="stronglydisagree61"
                                                            label=""
                                                            name="radiogroup23"
                                                        />
                                                    </td>
                                                    <td>
                                                        <Form.Check
                                                            type="radio"
                                                            id="disagree62"
                                                            label=""
                                                            name="radiogroup23"
                                                        />
                                                    </td>
                                                    <td>
                                                        <Form.Check
                                                            type="radio"
                                                            id="neutral63"
                                                            label=""
                                                            name="radiogroup23"
                                                        />
                                                    </td>
                                                    <td>
                                                        <Form.Check
                                                            type="radio"
                                                            id="agree64"
                                                            label=""
                                                            name="radiogroup23"
                                                        />
                                                    </td>
                                                    <td>
                                                        <Form.Check
                                                            type="radio"
                                                            id="stronglyagree65"
                                                            label=""
                                                            name="radiogroup23"
                                                        />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="addOutcomes text-center d-flex align-items-center flex-column mt-4">
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
                                 </>
                                )}
                            </div>
                        </Form>
                    </div>
                </div>
            </Collapse>
        </div>
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
    </>
    )
}
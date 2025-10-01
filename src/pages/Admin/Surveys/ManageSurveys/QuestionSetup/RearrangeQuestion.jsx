import {  Collapse, Form} from "react-bootstrap"
import { Button, SweetAlert } from "../../../../../components"
import { Link } from "react-router-dom"
import { useState } from "react";
import CommonInfoLink from "./CommonInfoLink";

export default function RearrangeQuestion(){

     // sweet alert
     const [isAlertVisible, setIsAlertVisible] = useState(false);
     const onConfirmAlertModal = () => {
         setIsAlertVisible(false);
         return true;
     };
     const deleteModal = () => {
         setIsAlertVisible(true);
     }
 
     // Prevent accordion from opening
     const handleDeleteClick = (event) => {
         event.stopPropagation(); 
         deleteModal(); // Trigger delete modal logic
     };

    const [open, setOpen] = useState(true);
    const [openEnded, setOpenEnded] = useState(false);
    const [openEfficiency, setOpenEfficiency] = useState(false);
       
    const [activeIndex, setActiveIndex] = useState(1); // Track the index of the active li

  //range slider active class add start
    const handleClick = (index) => {
      setActiveIndex(index); // Set the clicked li as active
    };
    const [activeIndex2, setActiveIndex2] = useState(3); // Track the index of the active li
  
    const handleClick2 = (index) => {
      setActiveIndex2(index); // Set the clicked li as active
    };
  
    const listItems = [
      {id: 1, label: 'Strongly Disagree'},
      {id: 2, label: 'Disagree'},
      {id: 3, label: 'Neutral'},
      {id: 4, label: 'Strongly Agree'},
      {id: 5, label: 'Agree'}
    ];
   

    // chart type Options
    const chartTypeOptions = [
        { value: 'Line', label: 'Line' },
        { value: 'Column', label: 'Column' },
        { value: 'Bar', label: 'Bar' }  
    ]





    return (
    <>
        <div className="dataAnalyticsCol">
            <Button className='d-flex align-items-center justify-content-between position-relative' onClick={() => setOpen(!open)} aria-controls="dataanalyticscol" aria-expanded={open}>
                <div>
                    <div className='d-flex align-items-center mb-xxl-3 mb-2 flex-wrap pe-sm-0 pe-5 me-sm-0 me-3'>
                        <em className='icon-drag d-sm-block d-none'></em> <h2 className="dataAnalyticsCol_Head dataAnalyticsCol_Head_blue mb-0">Employee Satisfaction </h2>
                    </div>
                    <p className="mb-0 dataAnalyticsCol_Para">Gauge employee satisfaction and gather insights to enhance workplace well-being and productivity.</p>
                </div>
                <div className='d-flex align-items-center gap-lg-3 gap-2 dataAnalyticsCol_actionBtn'> 
                    <Link to={'#!'}>
                        <em className='icon-table-edit'></em>
                    </Link>
                    <Link to={'#!'} onClick={handleDeleteClick}>
                        <em className='icon-delete'></em>
                    </Link>
                    <Link to={'#!'}>
                        <em className='icon-collapse-arrow'></em>
                    </Link>
                </div>
               
            </Button>
            <Collapse in={open}>
                <div id="dataanalyticscol">
                    <div className="dataAnalyticsCol_inner">
                        <Form>
                            <div className="ratingQuestion">
                                <div className="commonQuestion">
                                    <div className="d-flex align-items-center justify-content-between mb-xxl-3 mb-2 flex-wrap">
                                        <p className="d-flex align-items-center mb-2 me-2"> <em className="icon-drag d-sm-block d-none"></em>1. Is working environment good enough?</p>
                                        <div className="d-flex align-items-center gap-xxl-4 gap-lg-3 gap-2 flex-wrap">
                                        <CommonInfoLink showDataAnalytics={false} showInfoGather={true} />
                                        <div className='d-flex align-items-center gap-xxl-4 gap-lg-3 gap-2 flex-wrap'>
                                            <Link to={'#!'}>
                                                <em className='icon-table-edit'></em>
                                            </Link>
                                            <Link to={'#!'}>
                                                <em className='icon-copy'></em>
                                            </Link>
                                            <Link to={'#!'} onClick={handleDeleteClick}>
                                                <em className='icon-delete'></em>
                                            </Link>
                                        </div>
                                        </div>
                                    </div> 
                                    {['radio'].map((type) => (
                                        <div key={`inline-${type}`} className='allOptions d-flex flex-wrap gap-2'>
                                                <Form.Group className="form-group mb-0" controlId="stronglyDisagree2">
                                                    <Form.Check className='me-0'
                                                        inline
                                                        label="Yes"
                                                        name="group2"
                                                        type={type}
                                                        defaultChecked={true}
                                                        id={`inline-${type}-11`}
                                                    />
                                                </Form.Group>
                                                <Form.Group className="form-group mb-0" controlId="disagree2">
                                                    <Form.Check className='me-0'
                                                        inline
                                                        label="No"
                                                        name="group2"
                                                        type={type}
                                                        id={`inline-${type}-12`}
                                                    />
                                                </Form.Group>
                                        </div>
                                    ))}
                                    <Form.Group className="form-group mb-0 d-inline-block" controlId="skip2">
                                        <Form.Check className='me-0' type="checkbox"
                                            label={
                                                <div>
                                                    Skip For Now
                                                </div>
                                            }
                                        />
                                    </Form.Group>
                                </div>
                                <div className="commonQuestion">
                                    <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                                    <p className="d-flex align-items-center mb-2 me-2"> <em className="icon-drag d-sm-block d-none"></em>2. Does 30 minutes lunch break is enough?</p>
                                    <div className="d-flex align-items-center gap-xxl-4 gap-lg-3 gap-2 flex-wrap">
                                    <CommonInfoLink showDataAnalytics={false} showInfoGather={true} />
                                        <div className='d-flex align-items-center gap-xxl-4 gap-lg-3 gap-2 flex-wrap'>
                                            <Link to={'#!'}>
                                                <em className='icon-table-edit'></em>
                                            </Link>
                                            <Link to={'#!'}>
                                                <em className='icon-copy'></em>
                                            </Link>
                                            <Link to={'#!'} onClick={handleDeleteClick}>
                                                <em className='icon-delete'></em>
                                            </Link>
                                        </div>
                                        </div>
                                    </div> 
                                    {['radio'].map((type) => (
                                        <div key={`inline-${type}`} className='allOptions d-flex flex-wrap gap-2'>
                                                <Form.Group className="form-group mb-0" controlId="stronglyDisagree2">
                                                    <Form.Check className='me-0'
                                                        inline
                                                        label="Yes"
                                                        name="group2"
                                                        type={type}
                                                        defaultChecked={true}
                                                        id={`inline-${type}-21`}
                                                    />
                                                </Form.Group>
                                                <Form.Group className="form-group mb-0" controlId="disagree2">
                                                    <Form.Check className='me-0'
                                                        inline
                                                        label="No"
                                                        name="group2"
                                                        type={type}
                                                        id={`inline-${type}-22`}
                                                    />
                                                </Form.Group>
                                        </div>
                                    ))}
                                    <Form.Group className="form-group mb-0 d-inline-block" controlId="skip3">
                                        <Form.Check className='me-0' type="checkbox"
                                            label={
                                                <div>
                                                    Skip For Now
                                                </div>
                                            }
                                        />
                                    </Form.Group>
                                </div>
                                <div className="commonQuestion pb-2">
                                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                                    <p className="d-flex align-items-center mb-2 me-2"> <em className="icon-drag d-sm-block d-none"></em>3. Satisfied are you with the work-life balance provided by the company?</p>
                                    <div className="d-flex align-items-center gap-xxl-4 gap-lg-3 gap-2 flex-wrap">
                                    <CommonInfoLink showDataAnalytics={false} showInfoGather={true} />
                                        <div className='d-flex align-items-center gap-xxl-4 gap-lg-3 gap-2 flex-wrap'>
                                            <Link to={'#!'}>
                                                <em className='icon-table-edit'></em>
                                            </Link>
                                            <Link to={'#!'}>
                                                <em className='icon-copy'></em>
                                            </Link>
                                            <Link to={'#!'} onClick={handleDeleteClick}>
                                                <em className='icon-delete'></em>
                                            </Link>
                                        </div>
                                        </div>
                                    </div> 
                                    <div className="assessingTable impactTable ">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th> <div className='w-240'></div> </th>
                                                    <th colSpan="5">Analyze the broader effects of efficiency gains on business outcomes like profitability and customer satisfaction.</th>
                                                    <th></th>
                                                    <th colSpan="5">Analyze the broader effects of efficiency gains on business outcomes like profitability and customer satisfaction.</th>
                                                    <th></th>
                                                    <th colSpan="5">Analyze the broader effects of efficiency gains on business outcomes like profitability and customer satisfaction.</th>
                                                </tr>
                                                <tr>
                                                    <th></th>
                                                    <th>Strongly disagree</th>
                                                    <th>Disagree</th>
                                                    <th>Neutral</th>
                                                    <th>Agree</th>
                                                    <th> Strongly agree</th>
                                                    <th></th>
                                                    <th>Strongly disagree</th>
                                                    <th>Disagree</th>
                                                    <th>Neutral</th>
                                                    <th>Agree</th>
                                                    <th> Strongly agree</th>
                                                    <th></th>
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
                                                    <td></td>
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
                                                    <td></td>
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
                                                    <td></td>
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
                                                    <td></td>
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
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </Collapse>
        </div>
        <div className="dataAnalyticsCol">
            <Button className='d-flex align-items-center justify-content-between position-relative' onClick={() => setOpenEnded(!openEnded)} aria-controls="dataanalyticscol" aria-expanded={open}>
                <div>
                    <div className='d-flex align-items-center mb-xxl-3 mb-2 flex-wrap pe-sm-0 pe-5 me-sm-0 me-3'>
                        <em className='icon-drag d-sm-block d-none'></em> <h2 className="dataAnalyticsCol_Head dataAnalyticsCol_Head_red mb-0">Open-Ended At Start</h2>
                    </div>
                    <p className="mb-0 dataAnalyticsCol_Para">Gauge employee satisfaction and gather insights to enhance workplace well-being and productivity.</p>
                </div>
                <div className='d-flex align-items-center gap-lg-3 gap-2 dataAnalyticsCol_actionBtn'> 
                    <Link to={'#!'}>
                        <em className='icon-table-edit'></em>
                    </Link>
                    <Link to={'#!'} onClick={handleDeleteClick}>
                        <em className='icon-delete'></em>
                    </Link>
                    <Link to={'#!'}>
                        <em className='icon-collapse-arrow'></em>
                    </Link>
                </div>
                
            </Button>
            <Collapse in={openEnded}>
                <div id="dataanalyticscol">
                    <div className="dataAnalyticsCol_inner">
                        <Form>
                            <div className="ratingQuestion">
                                <div className="commonQuestion">
                                    <div className="d-flex align-items-center justify-content-between mb-xxl-3 mb-2 flex-wrap">
                                        <p className="d-flex align-items-center mb-2 me-2"> <em className="icon-drag d-sm-block d-none"></em>4. What aspects of your job do you find most fulfilling and why?</p>
                                        <div className="d-flex align-items-center gap-xxl-4 gap-lg-3 gap-2 flex-wrap">
                                        <CommonInfoLink showDataAnalytics={false} showInfoGather={true} />
                                        <div className='d-flex align-items-center gap-xxl-4 gap-lg-3 gap-2 flex-wrap'>
                                            <Link to={'#!'}>
                                                <em className='icon-table-edit'></em>
                                            </Link>
                                            <Link to={'#!'}>
                                                <em className='icon-copy'></em>
                                            </Link>
                                            <Link to={'#!'} onClick={handleDeleteClick}>
                                                <em className='icon-delete'></em>
                                            </Link>
                                        </div>
                                        </div>
                                    </div> 
                                    <Form.Group className="form-group mb-3">
                                            <Form.Control as="textarea" className=" form-control form-control-md" placeholder={"Outcomes Name..."} />
                                        </Form.Group>
                                </div>
                                <div className="commonQuestion pb-2">
                                    <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                                        <p className="d-flex align-items-center mb-2 me-2"> <em className="icon-drag d-sm-block d-none"></em> 5. For Assessing Impact and Outcomes</p>
                                        <div className="d-flex align-items-center gap-xxl-4 gap-lg-3 gap-2 flex-wrap">
                                        <CommonInfoLink showDataAnalytics={false} showInfoGather={true} />
                                        <div className='d-flex align-items-center gap-xxl-4 gap-lg-3 gap-2 flex-wrap'>
                                            
                                            <div className="d-flex gap-xxl-4 gap-lg-3 gap-2">
                                                <Link to={'#!'}>
                                                    <em className='icon-table-edit'></em>
                                                </Link>
                                                <Link to={'#!'}>
                                                    <em className='icon-copy'></em>
                                                </Link>
                                                <Link to={'#!'} onClick={handleDeleteClick}>
                                                    <em className='icon-delete'></em>
                                                </Link>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    <div className="assessingTable">
                                        <table>
                                            <thead>
                                            <tr>
                                                <th className='text-start'>
                                                    <div className="outcomeTable_datawidth">
                                                        Analyze The Broader Effects Of Efficiency Gains On Business Outcomes Like Profitability And Customer Satisfaction.
                                                    </div>
                                                </th>
                                                <th>Strongly Disagree</th>
                                                <th>Disagree</th>
                                                <th>Neutral</th>
                                                <th>Agree</th>
                                                <th>Strongly Agree</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td> <div className="outcomeTable_datawidth"> 1. How have improvements in operational efficiency impacted overall business performance?</div></td>
                                                <td>
                                                    <Form.Check
                                                        type="radio"
                                                        id="stronglydisagree"
                                                        label=""
                                                        name="group1"
                                                    />
                                                </td>
                                                <td>
                                                    <Form.Check 
                                                        type="radio"
                                                        id="disagree"
                                                        label=""
                                                        name="group1"
                                                    />
                                                </td>
                                                <td>
                                                    <Form.Check
                                                        type="radio"
                                                        id="neutral"
                                                        label=""
                                                        name="group1"
                                                    />
                                                </td>
                                                <td>
                                                    <Form.Check
                                                        type="radio"
                                                        id="agree"
                                                        label=""
                                                        name="group1"
                                                    />
                                                </td>
                                                <td>
                                                    <Form.Check
                                                        type="radio"
                                                        id="stronglyagree"
                                                        label=""
                                                        name="group1"
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td> <div className="outcomeTable_datawidth"> 2. What feedback have we received from employees regarding process changes? </div> </td>
                                                <td>
                                                    <Form.Check
                                                        type="radio"
                                                        id="stronglydisagree2"
                                                        label=""
                                                        name="group2"
                                                    />
                                                </td>
                                                <td>
                                                    <Form.Check
                                                        type="radio"
                                                        id="disagree2"
                                                        label=""
                                                        name="group2"
                                                    />
                                                </td>
                                                <td>
                                                    <Form.Check
                                                        type="radio"
                                                        id="neutral2"
                                                        label=""
                                                        name="group2"
                                                    />
                                                </td>
                                                <td>
                                                    <Form.Check
                                                        type="radio"
                                                        id="agree2"
                                                        label=""
                                                        name="group2"
                                                    />
                                                </td>
                                                <td>
                                                    <Form.Check
                                                        type="radio"
                                                        id="stronglyagree2"
                                                        label=""
                                                        name="group2"
                                                    />
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </Collapse>
        </div>
        <div className="dataAnalyticsCol">
            <Button className='d-flex align-items-center justify-content-between position-relative' onClick={() => setOpenEfficiency(!openEfficiency)} aria-controls="dataanalyticscol" aria-expanded={open}>
                <div>
                    <div className='d-flex align-items-center mb-xxl-3 mb-2 flex-wrap pe-sm-0 pe-5 me-sm-0 me-3'>
                        <em className='icon-drag d-sm-block d-none'></em> <h2 className="dataAnalyticsCol_Head dataAnalyticsCol_Head_pink mb-0">Operational Efficiency</h2>
                      
                    </div>
                    <p className="mb-0 dataAnalyticsCol_Para">Gauge employee satisfaction and gather insights to enhance workplace well-being and productivity.</p>
                </div>
                <div className='d-flex align-items-center gap-lg-3 gap-2 dataAnalyticsCol_actionBtn'> 
                    <Link to={'#!'}>
                        <em className='icon-table-edit'></em>
                    </Link>
                    <Link to={'#!'} onClick={handleDeleteClick}>
                        <em className='icon-delete'></em>
                    </Link>
                    <Link to={'#!'}>
                        <em className='icon-collapse-arrow'></em>
                    </Link>
                </div>
                
            </Button>
            <Collapse in={openEfficiency}>
                <div id="dataanalyticscol">
                    <div className="dataAnalyticsCol_inner">
                        <Form>
                            <div className="ratingQuestion">
                                <div className="answerBox">
                                    <ul className='answerBox_list list-unstyled'>
                                        <li>
                                        <div className="commonQuestion">
                                            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                                                <p className="d-flex align-items-center mb-2 me-2"> <em className="icon-drag d-sm-block d-none"></em>6. Identify which metrics are most relevant to measuring efficiency</p>
                                                <div className="d-flex align-items-center gap-xxl-4 gap-lg-3 gap-2 flex-wrap">
                                                <CommonInfoLink showDataAnalytics={false} showInfoGather={true} />
                                                    <div className="d-flex gap-xxl-4 gap-lg-3 gap-2">
                                                        <Link to={'#!'}>
                                                            <em className='icon-table-edit'></em>
                                                        </Link>
                                                        <Link to={'#!'}>
                                                            <em className='icon-copy'></em>
                                                        </Link>
                                                        <Link to={'#!'} onClick={handleDeleteClick}>
                                                            <em className='icon-delete'></em>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div> 
                                        </div>
                                            <div className="rangeSlider">
                                                <ul className='list-unstyled mb-0 d-flex'>
                                                    {listItems.map((item) => (
                                                        <li className={`d-flex flex-column mb-0 ${activeIndex2 === item.id ? 'active' : ''}`} key={item.id}  onClick={() => handleClick2(item.id)}>
                                                            <span className='d-inline-block'></span>
                                                            <p className='mb-0 text-center'>{item.label}</p>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="commonQuestion">
                                            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                                                <p className="d-flex align-items-center mb-2 me-2"> <em className="icon-drag d-sm-block d-none"></em>7. Evaluate whether processes are optimized and consistently applied?</p>
                                                <div className="d-flex align-items-center gap-xxl-4 gap-lg-3 gap-2 flex-wrap">
                                        <CommonInfoLink showDataAnalytics={false} showInfoGather={true} />
                                                <div className='d-flex align-items-center gap-xxl-4 gap-lg-3 gap-2 flex-wrap'>
                                                    <Link to={'#!'}>
                                                        <em className='icon-table-edit'></em>
                                                    </Link>
                                                    <Link to={'#!'}>
                                                        <em className='icon-copy'></em>
                                                    </Link>
                                                    <Link to={'#!'} onClick={handleDeleteClick}>
                                                        <em className='icon-delete'></em>
                                                    </Link>
                                                </div>
                                                </div>
                                            </div> 
                                           
                                            </div>
                                            <div className="rangeSlider">
                                                <ul className='list-unstyled mb-0 d-flex'>
                                                    {listItems.map((item) => (
                                                        <li className={`d-flex flex-column mb-0 ${activeIndex === item.id ? 'active' : ''}`} key={item.id}  onClick={() => handleClick(item.id)}>
                                                            <span className='d-inline-block'></span>
                                                            <p className='mb-0 text-center'>{item.label}</p>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </Collapse>
        </div>

        <SweetAlert
            title="Are you sure?"
            text="You want to delete this data!"
            show={isAlertVisible}
            icon="warning"
            onConfirmAlert={onConfirmAlertModal}
            showCancelButton
            cancelButtonText="Cancel"
            confirmButtonText="Yes"
            setIsAlertVisible={setIsAlertVisible}
            isConfirmedTitle="Deleted!"
            isConfirmedText="Your file has been deleted."
        />
       




    </>
    )
}
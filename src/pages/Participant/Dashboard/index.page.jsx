import React from 'react';
import { Form, Nav, Tab } from 'react-bootstrap';
import InputField from '../../../components/Input';
import {Button, SelectField } from '../../../components';


function Dashboard() {
    const companyOptions = [
        { value: '10', label: '10' },
        { value: '20', label: '20' },
        { value: '30', label: '30' }  
    ]

  return (
    <main className="main-content">
        <section className="commonBanner position-relative">
            <div className="container">
                <div className="commonBanner_inner">
                    <h1 className="mb-3">Progress <span>Dashboard</span> </h1>
                </div>
            </div>
        </section>
        <section className="cardSec">
            <div className="container">
                <div className="row g-3 g-xl-4">
                    <div className="col-sm-6 col-md-3">
                        <div className="cardSec_box text-center">
                            <span>5</span>
                            <p>Total Surveys</p>
                        </div>
                    </div>
                    <div className="col-sm-6 col-md-3">
                        <div className="cardSec_box text-center">
                            <span>5</span>
                            <p>Total Questions</p>
                        </div>
                    </div>
                    <div className="col-sm-6 col-md-3">
                        <div className="cardSec_box text-center">
                            <span>2</span>
                            <p>Questions Submitted</p>
                        </div>
                    </div>
                    <div className="col-sm-6 col-md-3">
                        <div className="cardSec_box text-center">
                            <span>3</span>
                            <p>Questions Pending</p>
                        </div>
                    </div>
                </div>
                <h2 className="cardSec_title">My Survey</h2>
                <div className="commonFilter">
                    <Tab.Container defaultActiveKey="allsurvey">
                        <div className="d-md-flex align-items-center justify-content-between commonFilter_tabs">
                            <Nav>
                                <Nav.Item>
                                    <Nav.Link eventKey="allsurvey">All Survey</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="newlyadded">Newly Added</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="inprogress">In Progress</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="completed">Completed</Nav.Link>
                                </Nav.Item>
                            </Nav>
                            <Form>
                                <div className="searchBar">
                                    <InputField  type="text" placeholder="Search" />
                                </div>
                            </Form>
                        </div>
                        <Tab.Content>
                        <Tab.Pane eventKey="allsurvey">
                            <div className="surveyCards">
                                <div className="surveyCards_inner d-flex justify-content-between">
                                    <div className="surveyCards_left">
                                        <h3>General Awareness - USA </h3>
                                        <ul className="list-unstyled mb-sm-0">
                                            <li>Company: <span>Codiant</span> </li>
                                            <li>Department: <span>Business Analysis </span> </li>
                                        </ul>
                                    </div>
                                    <div className="surveyCards_right">
                                        <p>Assigned Date: 07-10-2024</p>
                                        <span>50%</span>
                                        <p className="mb-0">Completed</p>
                                    </div>
                                </div>
                                <div className="d-sm-flex align-items-center justify-content-between">
                                    <p className="surveyCards_progress inProgress">In Progress</p>
                                    <Button variant="primary ripple-effect" className="">Continue <em className="btn-icon right icon-arrow-next" /> </Button>
                                </div>
                            </div>
                            <div className="surveyCards">
                                <div className="surveyCards_inner d-flex justify-content-between">
                                    <div className="surveyCards_left">
                                        <h3>General Awareness - USA </h3>
                                        <ul className="list-unstyled mb-sm-0">
                                            <li>Company: <span>Codiant</span> </li>
                                            <li>Department: <span>Business Analysis </span> </li>
                                        </ul>
                                    </div>
                                    <div className="surveyCards_right">
                                        <p>Assigned Date: 07-10-2024</p>
                                        <span>50%</span>
                                        <p className="mb-0">Completed</p>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                                    <div className='d-flex align-items-center'>
                                        <p className="surveyCards_progress completed">Completed</p>
                                        <Button className="ripple-effect btn btn-success ms-lg-4 ms-2">View Response <em className="btn-icon right icon-arrow-next" /> </Button>
                                    </div>
                                    <div className='d-flex gap-2 flex-wrap'>
                                        <Button variant="primary" className="ripple-effect">Detailed Report <em className="btn-icon right icon-arrow-next" /> </Button>
                                        <Button variant="primary" className="ripple-effect">Summary Report <em className="btn-icon right icon-arrow-next" /> </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="surveyCards">
                                <div className="surveyCards_inner d-flex justify-content-between">
                                    <div className="surveyCards_left">
                                        <h3>General Awareness - USA </h3>
                                        <ul className="list-unstyled mb-sm-0">
                                            <li>Company: <span>Codiant</span> </li>
                                            <li>Department: <span>Business Analysis </span> </li>
                                        </ul>
                                    </div>
                                    <div className="surveyCards_right">
                                        <p>Assigned Date: 07-10-2024</p>
                                        <span>50%</span>
                                        <p className="mb-0">Completed</p>
                                    </div>
                                </div>
                                <div className="d-sm-flex align-items-center justify-content-between">
                                    <p className="surveyCards_progress newlyAdded">Newly Added</p>
                                    <Button variant="primary" className="ripple-effect">Start Survey <em className="btn-icon right icon-arrow-next" /> </Button>
                                </div>
                            </div>
                        </Tab.Pane>
                        <Tab.Pane eventKey="newlyadded">
                            <div className="surveyCards">
                                <div className="surveyCards_inner d-flex justify-content-between">
                                    <div className="surveyCards_left">
                                        <h3>General Awareness - USA </h3>
                                        <ul className="list-unstyled mb-sm-0">
                                            <li>Company: <span>Codiant</span> </li>
                                            <li>Department: <span>Business Analysis </span> </li>
                                        </ul>
                                    </div>
                                    <div className="surveyCards_right">
                                        <p>Assigned Date: 07-10-2024</p>
                                        <span>50%</span>
                                        <p className="mb-0">Completed</p>
                                    </div>
                                </div>
                                <div className="d-sm-flex align-items-center justify-content-between">
                                    <p className="surveyCards_progress inProgress">In Progress</p>
                                    <Button variant="primary" className=" ripple-effect">Continue <em className="btn-icon right icon-arrow-next" /> </Button>
                                </div>
                            </div>
                            <div className="surveyCards">
                                <div className="surveyCards_inner d-flex justify-content-between">
                                    <div className="surveyCards_left">
                                        <h3>General Awareness - USA </h3>
                                        <ul className="list-unstyled mb-sm-0">
                                            <li>Company: <span>Codiant</span> </li>
                                            <li>Department: <span>Business Analysis </span> </li>
                                        </ul>
                                    </div>
                                    <div className="surveyCards_right">
                                        <p>Assigned Date: 07-10-2024</p>
                                        <span>50%</span>
                                        <p className="mb-0">Completed</p>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                                    <div className='d-flex align-items-center'>
                                        <p className="surveyCards_progress completed">Completed</p>
                                        <Button className="ripple-effect btn btn-success ms-lg-4 ms-2">View Response <em className="btn-icon right icon-arrow-next" /> </Button>
                                    </div>
                                    <div className='d-flex gap-2 flex-wrap'>
                                        <Button variant="primary" className="ripple-effect">Detailed Report <em className="btn-icon right icon-arrow-next" /> </Button>
                                        <Button variant="primary" className="ripple-effect">Summary Report <em className="btn-icon right icon-arrow-next" /> </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="surveyCards">
                                <div className="surveyCards_inner d-flex justify-content-between">
                                    <div className="surveyCards_left">
                                        <h3>General Awareness - USA </h3>
                                        <ul className="list-unstyled mb-sm-0">
                                            <li>Company: <span>Codiant</span> </li>
                                            <li>Department: <span>Business Analysis </span> </li>
                                        </ul>
                                    </div>
                                    <div className="surveyCards_right">
                                        <p>Assigned Date: 07-10-2024</p>
                                        <span>50%</span>
                                        <p className="mb-0">Completed</p>
                                    </div>
                                </div>
                                <div className="d-sm-flex align-items-center justify-content-between">
                                    <p className="surveyCards_progress newlyAdded">Newly Added</p>
                                    <Button variant="primary" className="ripple-effect">Start Survey <em className="btn-icon right icon-arrow-next" /> </Button>
                                </div>
                            </div>
                        </Tab.Pane>
                        <Tab.Pane eventKey="inprogress">
                            <div className="surveyCards">
                                <div className="surveyCards_inner d-flex justify-content-between">
                                    <div className="surveyCards_left">
                                        <h3>General Awareness - USA </h3>
                                        <ul className="list-unstyled mb-sm-0">
                                            <li>Company: <span>Codiant</span> </li>
                                            <li>Department: <span>Business Analysis </span> </li>
                                        </ul>
                                    </div>
                                    <div className="surveyCards_right">
                                        <p>Assigned Date: 07-10-2024</p>
                                        <span>50%</span>
                                        <p className="mb-0">Completed</p>
                                    </div>
                                </div>
                                <div className="d-sm-flex align-items-center justify-content-between">
                                    <p className="surveyCards_progress inProgress">In Progress</p>
                                    <Button variant="primary" className=" ripple-effect">Continue <em className="btn-icon right icon-arrow-next" /> </Button>
                                </div>
                            </div>
                            <div className="surveyCards">
                                <div className="surveyCards_inner d-flex justify-content-between">
                                    <div className="surveyCards_left">
                                        <h3>General Awareness - USA </h3>
                                        <ul className="list-unstyled mb-sm-0">
                                            <li>Company: <span>Codiant</span> </li>
                                            <li>Department: <span>Business Analysis </span> </li>
                                        </ul>
                                    </div>
                                    <div className="surveyCards_right">
                                        <p>Assigned Date: 07-10-2024</p>
                                        <span>50%</span>
                                        <p className="mb-0">Completed</p>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                                    <div className='d-flex align-items-center'>
                                        <p className="surveyCards_progress completed">Completed</p>
                                        <Button className="ripple-effect btn btn-success ms-lg-4 ms-2">View Response <em className="btn-icon right icon-arrow-next" /> </Button>
                                    </div>
                                    <div className='d-flex gap-2 flex-wrap'>
                                        <Button variant="primary" className="ripple-effect">Detailed Report <em className="btn-icon right icon-arrow-next" /> </Button>
                                        <Button variant="primary" className="ripple-effect">Summary Report <em className="btn-icon right icon-arrow-next" /> </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="surveyCards">
                                <div className="surveyCards_inner d-flex justify-content-between">
                                    <div className="surveyCards_left">
                                        <h3>General Awareness - USA </h3>
                                        <ul className="list-unstyled mb-sm-0">
                                            <li>Company: <span>Codiant</span> </li>
                                            <li>Department: <span>Business Analysis </span> </li>
                                        </ul>
                                    </div>
                                    <div className="surveyCards_right">
                                        <p>Assigned Date: 07-10-2024</p>
                                        <span>50%</span>
                                        <p className="mb-0">Completed</p>
                                    </div>
                                </div>
                                <div className="d-sm-flex align-items-center justify-content-between">
                                    <p className="surveyCards_progress newlyAdded">Newly Added</p>
                                    <Button variant="primary" className="ripple-effect">Start Survey <em className="btn-icon right icon-arrow-next" /> </Button>
                                </div>
                            </div>
                        </Tab.Pane>
                        <Tab.Pane eventKey="completed">
                            <div className="surveyCards">
                                <div className="surveyCards_inner d-flex justify-content-between">
                                    <div className="surveyCards_left">
                                        <h3>General Awareness - USA </h3>
                                        <ul className="list-unstyled mb-sm-0">
                                            <li>Company: <span>Codiant</span> </li>
                                            <li>Department: <span>Business Analysis </span> </li>
                                        </ul>
                                    </div>
                                    <div className="surveyCards_right">
                                        <p>Assigned Date: 07-10-2024</p>
                                        <span>50%</span>
                                        <p className="mb-0">Completed</p>
                                    </div>
                                </div>
                                <div className="d-sm-flex align-items-center justify-content-between">
                                    <p className="surveyCards_progress inProgress">In Progress</p>
                                    <Button variant="primary" className=" ripple-effect">Continue <em className="btn-icon right icon-arrow-next" /> </Button>
                                </div>
                            </div>
                            <div className="surveyCards">
                                <div className="surveyCards_inner d-flex justify-content-between">
                                    <div className="surveyCards_left">
                                        <h3>General Awareness - USA </h3>
                                        <ul className="list-unstyled mb-sm-0">
                                            <li>Company: <span>Codiant</span> </li>
                                            <li>Department: <span>Business Analysis </span> </li>
                                        </ul>
                                    </div>
                                    <div className="surveyCards_right">
                                        <p>Assigned Date: 07-10-2024</p>
                                        <span>50%</span>
                                        <p className="mb-0">Completed</p>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                                    <div className='d-flex align-items-center'>
                                        <p className="surveyCards_progress completed">Completed</p>
                                        <Button className="ripple-effect btn btn-success ms-lg-4 ms-2">View Response <em className="btn-icon right icon-arrow-next" /> </Button>
                                    </div>
                                    <div className='d-flex gap-2 flex-wrap'>
                                        <Button variant="primary" className="ripple-effect">Detailed Report <em className="btn-icon right icon-arrow-next" /> </Button>
                                        <Button variant="primary" className="ripple-effect">Summary Report <em className="btn-icon right icon-arrow-next" /> </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="surveyCards">
                                <div className="surveyCards_inner d-flex justify-content-between">
                                    <div className="surveyCards_left">
                                        <h3>General Awareness - USA </h3>
                                        <ul className="list-unstyled mb-sm-0">
                                            <li>Company: <span>Codiant</span> </li>
                                            <li>Department: <span>Business Analysis </span> </li>
                                        </ul>
                                    </div>
                                    <div className="surveyCards_right">
                                        <p>Assigned Date: 07-10-2024</p>
                                        <span>50%</span>
                                        <p className="mb-0">Completed</p>
                                    </div>
                                </div>
                                <div className="d-sm-flex align-items-center justify-content-between">
                                    <p className="surveyCards_progress newlyAdded">Newly Added</p>
                                    <Button variant="primary" className="ripple-effect">Start Survey <em className="btn-icon right icon-arrow-next" /> </Button>
                                </div>
                            </div>
                        </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                    <div className="commonFilter_sort d-flex align-items-center justify-content-sm-between justify-content-center">
                        <div className="commonFilter_sort_search d-flex align-items-center justify-content-center">
                            <p>Entries Per Page</p>
                            <SelectField id="pagination" className="mx-2 selectPicker" placeholder="10" options={companyOptions} />
                            <p>Showing 1 to 3 of 3 Entries</p>
                        </div>
                        <div className="commonFilter_sort_pagination d-flex align-items-center justify-content-center">
                            <div className="btn-group" aria-label="Basic outlined example">
                                <button type="button" className="btn btn-outline-secondary">First</button>
                                <button type="button" className="btn btn-outline-secondary">Previous</button>
                                <button type="button" className="btn btn-outline-secondary active">1</button>
                                <button type="button" className="btn btn-outline-secondary">Next</button>
                                <button type="button" className="btn btn-outline-secondary">Last</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
  );
  
}



export default Dashboard;

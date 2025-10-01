import React, { useState } from 'react';
import {  Col, Form, Nav, OverlayTrigger, Row, Tab, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Summary from './Summary';
import DetailedAnalysis from './DetailedAnalysis';
import SingleChart from './SingleChart';
import IgStatistics from './IgStatistics';
import { Breadcrumb, Button, InputField, ModalComponent, SelectField, TextEditor } from '../../../../components';

export default function RandomResponse() {

    // breadcrumb   
    const breadcrumb = [  
        {
            path: "#!",
            name: "Reports",
        },
        {
            path: "#!",
            name: "Random Response",
        },
    ]

    // company options
    const companyOptions = [
        { value: 'Codiant', label: 'Codiant' },
        { value: 'Company1', label: 'Company1' },
        { value: 'Company2', label: 'Company2' }  
    ]

     // edit modal
     const [showEditModal, setShowEditModal] = useState(false);
     const editModalClose = () => setShowEditModal(false);
     const editModalShow = () => setShowEditModal(true);
 
     // copy comment modal
     const [showCopyComment, setshowCopyComment] = useState(false);
     const copyCommentClose = () => setshowCopyComment(false);
     const copyCommentShow = () => {
         setshowCopyComment(true);
         setShowEditModal(false);
     }



    return (
        <>
            <div className='surveyAnalysis'>
                {/* head title start */}
                <section className="commonHead">
                    <h1 className='commonHead_title'>Welcome Back!</h1>
                    <Breadcrumb breadcrumb={breadcrumb} />
                </section>
                {/* head title end */}
                <div className="pageContent">
                    <div className="pageTitle">
                        <h2 className="mb-0">Random Response</h2>
                    </div>
                    <Tab.Container id="left-tabs-example" defaultActiveKey="summary">
                        <Nav variant="pills" className="commonTab">
                            <Nav.Item>
                                <Nav.Link eventKey="summary">Summary</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="detailedAnalysis">Detailed Analysis</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="singleChart">Single Chart</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="igStatistics">IG Statistics</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <Tab.Content className='mt-3'>
                            <Tab.Pane eventKey="summary"><Summary editModalShow={editModalShow}/></Tab.Pane>
                            <Tab.Pane eventKey="detailedAnalysis"><DetailedAnalysis editModalShow={editModalShow} /></Tab.Pane>
                            <Tab.Pane eventKey="singleChart"><SingleChart editModalShow={editModalShow} /></Tab.Pane>
                            <Tab.Pane eventKey="igStatistics"><IgStatistics editModalShow={editModalShow} /></Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                </div>
            </div>

            {/* edit modal */}
            <ModalComponent modalHeader="Detailed Report" show={showEditModal} onHandleCancel={editModalClose}  >
                <Form>
                    <Form.Group className="form-group">
                        <Form.Label>Report Name</Form.Label>
                        <InputField type="text"  placeholder="Report Name"  />
                    </Form.Group>
                    <div className='d-flex justify-content-end'>
                        <Link href="#!" className="copyBtn d-flex align-items-center mb-2" onClick={copyCommentShow} >
                            <OverlayTrigger overlay={<Tooltip >Copy Comment from any of the existing reports.</Tooltip>}>
                                <em  className="icon-info-circle me-1" />
                            </OverlayTrigger>
                            Copy Comments
                        </Link>
                    </div>
                    <Form.Group className="form-group">
                        <Form.Label>Opening Comment</Form.Label>
                        <TextEditor />
                    </Form.Group>
                    <Form.Group className="form-group">
                        <Form.Label>Closing Comment</Form.Label>
                        <TextEditor />
                    </Form.Group>
                    <div className="form-btn d-flex gap-2 justify-content-end">
                        <Button variant='secondary' className='ripple-effect' onClick={editModalClose}>Cancel</Button>
                        <Button variant='primary' className='ripple-effect'>Update Report</Button>
                    </div>
                </Form>
            </ModalComponent>

            {/* copy comments modal  */}
            <ModalComponent modalHeader="Copy Comments" show={showCopyComment} onHandleCancel={copyCommentClose}>
                <Form>
                    <Row className="row rowGap">
                        <Col lg={6}>
                            <Form.Group className="form-group">
                                <Form.Label>Assessment Name<sup>*</sup></Form.Label>
                                <SelectField defaultValue={companyOptions[1]} placeholder="Assessment Name" options={companyOptions} />
                            </Form.Group>
                        </Col>
                        <Col lg={6}>
                            <Form.Group className="form-group">
                                <Form.Label>Report Name<sup>*</sup></Form.Label>
                                <SelectField defaultValue={companyOptions[1]} placeholder="Report Name" options={companyOptions} />
                            </Form.Group>
                        </Col>
                        <Col sm={12}>
                            <Form.Group className="form-group">
                                <Form.Label>Opening Comment</Form.Label>
                                <TextEditor />
                            </Form.Group>
                        </Col>
                        <Col sm={12}>
                            <Form.Group className="form-group">
                                <Form.Label>Closing Comment</Form.Label>
                                <TextEditor />
                            </Form.Group>
                        </Col>
                    </Row>
                    
                    <div className="form-btn d-flex justify-content-end gap-2">
                        <Button variant='secondary' className='ripple-effect' onClick={copyCommentClose}>Cancel</Button>
                        <Button variant='primary' className='ripple-effect'>Copy to Report</Button>
                    </div>
                </Form>
            </ModalComponent>
        </>
    )
}   


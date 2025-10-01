import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {  Col, Form, Row } from 'react-bootstrap';
import { Button, InputField, SweetAlert, SelectField, Breadcrumb, DataTableComponent, ModalComponent } from "../../../components";
import EmailFilterData from './EmailFilterData.json';

export default function EmailFilter() {
    // company options
    const companyOptions = [
        { value: 'Codiant', label: 'Codiant' },
        { value: 'Company1', label: 'Company1' },
        { value: 'Company2', label: 'Company2' }  
    ]
    // add modal
    const [showAddDep, setShowAddDep] = useState(false);
    const adddepClose = () => setShowAddDep(false);
    const adddepShow = () => setShowAddDep(true);

    // edit modal
    const [showEditDep, setShowEditDep] = useState(false);
    const editdepClose = () => setShowEditDep(false);
    const editdepShow = () => setShowEditDep(true);

    const [isAlertVisible, setIsAlertVisible] = useState(false);

    const onConfirmAlertModal = () => {
        setIsAlertVisible(false);
        return true;
    };
    const deleteModal = () => {
        setIsAlertVisible(true);
    }

    // breadcrumb
    const breadcrumb = [
        {
          path: "#!",
          name: "Org Structure",
        },
        
        {
          path: "#",
          name: "Department Management",
        },
    ];

    // data table
    const columns = [
        { 
            title: '#', 
            dataKey: 'id',
            columnHeaderClassName: "no-sorting w-1 text-center",
           
        },
        { 
            title: 'Department Name', 
            dataKey: 'department',
        },
        { 
            title: 'Company Name', 
            dataKey: 'company',
        },
        { 
            title: 'Created By', 
            dataKey: 'created',
        },
        { 
            title: 'Action',
            dataKey: 'action',
            columnHeaderClassName: "w-1 text-center no-sorting",
            columnClassName:"w-1 text-center",
            render: () => {
                return (
                    <>
                    <ul className="list-inline action mb-0">
                        <li className="list-inline-item">
                            <Link to="#!" className="icon-primary" onClick={editdepShow}>
                                <em className="icon-table-edit" />
                            </Link>
                        </li>
                        <li className="list-inline-item">
                            <Link to="#!" className="icon-danger" onClick={deleteModal}>
                                <em className="icon-delete" />
                            </Link>
                        </li>
                    </ul>
                    </>
                );
            }
        },
    ]
    return (
        <>
            {/* head title start */}
            <section className="commonHead">
                <h1 className='commonHead_title'>Welcome Back!</h1>
                <Breadcrumb breadcrumb={breadcrumb} />
            </section>
            {/* head title end */}
            <div className="pageContent">
                <div className="pageTitle d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <h2 className="mb-0">Search and Add - Email Template</h2>
                    <Button variant="primary ripple-effect" onClick={adddepShow}>Add Department</Button>
                </div>
                <div className="filter d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <div className="searchBar">
                        <InputField type="text" placeholder="Search" />
                    </div>
                    <ul className="list-inline filter_action mb-0">
                        <li className="list-inline-item"><Link to="#!" className="btn-icon "><em className="icon-download" /></Link></li>
                    </ul>
                </div>
                <DataTableComponent data={EmailFilterData} columns={columns} />
            </div>
            {/* add department */}
            <ModalComponent modalHeader="Add Department" show={showAddDep} onHandleCancel={adddepClose}>
                <Form>
                    <Row className='rowGap'>
                        <Col lg={6}>
                            <Form.Group className="form-group" >
                                <Form.Label>Company Name<sup>*</sup></Form.Label>
                                <SelectField  placeholder="Company Name" options={companyOptions} />
                            </Form.Group>
                        </Col>
                        <Col lg={6}>
                            <Form.Group className="form-group" >
                                <Form.Label>Department Name<sup>*</sup></Form.Label>
                                <InputField type="text" placeholder="Department Name" />
                            </Form.Group>
                        </Col>
                        <Col>
                            <div className="form-btn d-flex gap-2 justify-content-end">
                                <Button variant='secondary' className='ripple-effect' onClick={adddepClose}>Cancel</Button>
                                <Button variant='primary' className='ripple-effect'>Add Department</Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </ModalComponent>

            {/* edit department */}
            <ModalComponent modalHeader="Edit Department" show={showEditDep} onHandleCancel={editdepClose}>
                <Form>
                    <Row className='rowGap'>
                        <Col lg={6}>
                            <Form.Group className="form-group" >
                                <Form.Label>Company Name<sup>*</sup></Form.Label>
                                <SelectField defaultValue={companyOptions[1]} placeholder="Company Name" options={companyOptions} />
                            </Form.Group>
                        </Col>
                        <Col lg={6}>
                            <Form.Group className="form-group" >
                                <Form.Label>Department Name<sup>*</sup></Form.Label>
                                <InputField type="text" placeholder="Department Name" defaultValue="Business Analysis"/>
                            </Form.Group>
                        </Col>
                        <Col>
                            <div className="form-btn d-flex gap-2 justify-content-end">
                                <Button variant='secondary' className='ripple-effect' onClick={editdepClose}>Cancel</Button>
                                <Button variant='primary' className='ripple-effect'>Update Department</Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </ModalComponent>

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
    );
}   

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Col, Row, Form, OverlayTrigger, Tooltip} from "react-bootstrap";
import {Button, Breadcrumb, DataTableComponent, SelectField, SweetAlert } from '../../../../../components';
import adminRouteMap from "../../../../../routes/Admin/adminRouteMap";
import ReviewEditDatasetData from './ReviewEditDataset.json';


export default function ReviewEditDataset() {
    // breadcrumb
    const breadcrumb = [
        {
            path: "#!",
            name: "Analytics",
        },
        {
            path: "#!",
            name: "Comparative Analysis",
        },
        {
            path: "#",
            name: "Review & Edit",
        },
    ];
    // delete alert
    const [isAlertVisible, setIsAlertVisible] = useState(false);

    const onConfirmAlertModal = () => {
        setIsAlertVisible(false);
        return true;
    };
    const deleteModal = () => {
        setIsAlertVisible(true);
    }
    // dataset Options
    const datasetOptions = [
        { value: 'HR Dataset', label: 'HR Dataset' },
        { value: 'Test01', label: 'Test01' }
    ]
    // company options
    const companyOptions = [
        { value: 'Codiant', label: 'Codiant' },
        { value: 'Company1', label: 'Company1' },
        { value: 'Company2', label: 'Company2' }
    ]
    // survey options
    const surveyOptions = [
        { value: 'Employee Survey', label: 'Employee Survey' },
        { value: 'Auditors', label: 'Auditors' },
        { value: 'June Survey', label: 'June Survey' }
    ]
    // data table
    const columns = [
        { 
            title: '#', 
            dataKey: 'id',
            columnHeaderClassName: "no-sorting w-1 text-center",
        
        },
        {
            title: 'Survey Name',
            dataKey: 'survey',
            columnHeaderClassName: "no-sorting",
        },
        {
            title: 'Company',
            dataKey: 'company',
            columnHeaderClassName: "no-sorting",
        },
        {
            title: 'Select Standard Survey ',
            dataKey: 'standardSurvey ',
            columnHeaderClassName: "no-sorting w-25",
            render: () => {
                return (
                    <ul className="list-inline action mb-0">
                        <li className="list-inline-item">
                            <Form.Group>
                                <Form.Check
                                    inline
                                    label=""
                                    name="significantTable"
                                    type="radio"
                                    className='mb-0'
                                />
                            </Form.Group>
                        </li>
                        <li className="list-inline-item">
                            <Link to="#!" className="icon-danger" onClick={deleteModal}>
                                <em className="icon-delete" />
                            </Link>
                        </li>
                    </ul>
                );
            }
        }
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
                <div className="pageTitle d-flex align-items-center">
                    <Link to={adminRouteMap.COMPARATIVEANALYSIS.path} className='backLink'><em className='icon-back' /></Link>
                    <h2 className='mb-0'>Review & Edit</h2>
                </div>
                <Form>
                    <div className="pageTitle pt-lg-2">
                        <h2>1. Select a dataset</h2>
                    </div>
                    <Row className="pt-lg-1">
                        <Col lg={4}>
                            <Form.Group className="form-group">
                                <Form.Label>Dataset <sup>*</sup></Form.Label>
                                <SelectField placeholder="--Select Dataset--" options={datasetOptions}/>
                            </Form.Group>
                        </Col>
                    </Row>
                    <div className="pageTitle d-flex align-items-center justify-content-between pt-lg-2 gap-2 flex-wrap">
                        <h2>2. Select Surveys for your combined dataset</h2>
                        <p className="link-primary fw-medium mb-0">(Minimum of 2 and Maximum of 5)</p>
                    </div>
                    <div className="d-xxl-flex align-items-end gap-2">
                        <Row className="pt-lg-2 gx-2 flex-grow-1">
                            <Col xxl={4} sm={6}>
                                <Form.Group className="form-group">
                                    <Form.Label>Company Name <sup>*</sup></Form.Label>
                                    <SelectField placeholder="--Select Company--" options={companyOptions}/>
                                </Form.Group>
                            </Col>
                            <Col xxl={4} sm={6}>
                                <Form.Group className="form-group">
                                    <Form.Label>Survey Name <sup>*</sup></Form.Label>
                                    <SelectField placeholder="--Select Survey--" options={surveyOptions}/>
                                </Form.Group>
                            </Col>
                            <Col xxl={4} md={6}>
                                <Form.Group className="form-group">
                                    <Form.Label>Assign an alternative display name (Optional)</Form.Label>
                                    <SelectField placeholder="--Survey Display Name--" options={surveyOptions}/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="form-group">
                            <Button variant="primary" className="ripple-effect">Add Survey</Button>
                        </Form.Group>
                    </div>
                </Form>
                <div className="pageTitle pt-lg-2">
                    <h2 className="d-flex align-items-md-center"><span className="me-lg-4 me-2">3. Select Survey that will be the standard for data field harmonization</span> 
                    <Link className="link-primary lh-1">
                        <OverlayTrigger overlay={<Tooltip>Lorem ipsum dolor sit amet.</Tooltip>}>
                            <em className="icon-info-circle ms-md-2" />
                        </OverlayTrigger>
                    </Link>
                    </h2>
                </div>
                <DataTableComponent showFooter={false} data={ReviewEditDatasetData} columns={columns}  />
                <div className="d-flex flex-wrap justify-content-end align-items-center gap-2 pt-xxl-3 pt-lg-2">
                    <Button variant="secondary" className="ripple-effect">Cancel</Button>
                    <Link to={adminRouteMap.COMPARATIVEANALYSISDATAHARMONIZATION.path} className="btn btn-primary ripple-effect">Save & Harmonize</Link>
                </div>
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
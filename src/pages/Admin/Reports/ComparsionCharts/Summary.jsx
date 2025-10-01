/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Col, Form, Row } from 'react-bootstrap';
import { DataTableComponent, InputField, ModalComponent, ReactDataTable, SelectField,  SweetAlert } from '../../../../components';
import SummaryData from './json/SummaryData.json';
import { statusFormatter } from '../../../../components/DataTable/TableFormatter';
import { useTable } from "../../../../customHooks/useTable";

export default function Summary({editModalShow}) {

    const [searchValue] = useState('');
    const [tableFilters] = useState({});

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

    // sweet alert
    const [isPublishVisible, setIsPublishVisible] = useState(false);
    const publishModal = () => {
        setIsPublishVisible(true);
        return false;
    };

    const [isAlertVisible, setIsAlertVisible] = useState(false);

    const onConfirmAlertModal = () => {
        setIsAlertVisible(false);
        return true;
    };
    const deleteModal = () => {
        setIsAlertVisible(true);
    }


    // This hook is not usefull when we handle search,filter,pagination from api.
    const { currentData, totalRecords, totalPages, offset, limit, sortState, setOffset, setLimit, handleSort } = useTable({
        searchValue,
        searchKeys: [''],
        tableFilters,
        initialLimit: 10,
        data: SummaryData,
    });

    const handleLimitChange = (value) => {
        setLimit(value);
        setOffset(1);
    };

    const handleOffsetChange = (value) => {
        setOffset(value);
    };

    // data table
    const columns = [
        {
            title: "#",
            dataKey: "id",
            data: "id",
            columnHeaderClassName: "no-sorting w-1 text-center",
            columnClassName:"align-top",      
        },
        {   
            title: "Report Name",
            dataKey:"name",
            data: "name",
            columnClassName:"align-top",
        },
        {   
            title: "Report Run Date",
            dataKey:"date",
            data: "date",
            columnHeaderClassName:"w-1",
            columnClassName:"align-top",
        },
        {   
            title: "Filter Values",
            dataKey:"filter",
            data:null,
            columnClassName:"align-top text-wrap",
            render: () => {
                return (
                    <>
                       
                        <p className='mb-0'><span className='fw-semibold'>Department : </span> All  </p>
                        <p className='mb-0'><span className='fw-semibold'>Participants : </span> All</p>
                        <p className='mb-0'><span className='fw-semibold'>Benchmark : </span> Benchmark user aggregate</p>
                        <p className='mb-0'><span className='fw-semibold'>Reference Date : </span> reference data aggregate user</p>
                        <p className='mb-0'><span className='fw-semibold'>Aggregate : </span> Yes </p>
                        <p className='mb-0'><span className='fw-semibold'>Demographic : </span></p>
                        <p className='mb-0'><span className='fw-semibold'>Age : </span> Under 18</p>
                    </>
                )
            }
        },
        {   
            title: "Status",
            dataKey:"status",
            data: "status",
            columnClassName:"align-top",
            render: (data,) => {
                return statusFormatter(data);
            }
        },
        {
            title: "Action",
            dataKey:"action",
            data: null,
            columnHeaderClassName: "w-1 no-sorting",
            columnClassName:"align-top",
            render: (data, ) => {
                return (
                    <>
                        <ul className="list-inline action mb-0">
                            <li className="list-inline-item"><Link href="#!" className={`icon-primary ${data}`} onClick={editModalShow}><em className="icon-table-edit" /></Link></li>
                            <li className="list-inline-item"><Link href="#!" className={`icon-success ${data}`} onClick={publishModal}><em className="icon-upload-arrow" /></Link></li>
                            <li className="list-inline-item"><Link href="#!" className="icon-primary "><em className="icon-eye" /></Link></li>
                            <li className="list-inline-item"><Link href="#!" className="icon-danger" onClick={deleteModal}><em className="icon-delete" /></Link></li>
                        </ul>
                    </>
                );
            }
        }

    ]


    // edit modal
    const [showEdit, setShowEdit] = useState(false);
    const EditClose = () => setShowEdit(false);
    const EditShow = () => setShowEdit(true);
    

    return (   
        <>
            <Form>
                <Row className='g-3'>
                    <Col lg={4} sm={6}>
                        <Form.Group className="form-group" >
                        <Form.Label>Company Name</Form.Label>
                        <SelectField  placeholder="Company Name" options={companyOptions} />
                        </Form.Group>
                    </Col>
                    <Col lg={4} sm={6}>
                        <Form.Group className="form-group" >
                        <Form.Label>Survey Name</Form.Label>
                        <SelectField  placeholder="Survey Name" options={surveyOptions} />
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
            <ReactDataTable data={currentData} columns={columns} page={offset} totalLength={totalRecords} totalPages={totalPages} sizePerPage={limit} handleLimitChange={handleLimitChange} handleOffsetChange={handleOffsetChange} searchValue={searchValue} handleSort={handleSort} sortState={sortState} />
           

            <ModalComponent modalHeader="Summary Report" size="lg" show={showEdit} onHandleCancel={EditClose}>
                <Form>
                    <Form.Group className="form-group" >
                        <Form.Label>Report Name</Form.Label>
                        <InputField type="text" placeholder="Report Name" defaultValue="User summary report - Department" />
                    </Form.Group>
                    <Form.Group className="form-group" >
                        <Form.Label>Opening Comment</Form.Label>
                    </Form.Group>
                </Form>
            </ModalComponent>

            <SweetAlert
                title="Publish"
                text="Do you want to publish this report?"
                show={isPublishVisible}
                icon="warning"
                onConfirmAlert={publishModal}
                showCancelButton
                cancelButtonText="Cancel"
                confirmButtonText="Yes"
                setIsAlertVisible={setIsPublishVisible}
            />

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
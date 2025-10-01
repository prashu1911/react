/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import { Col, Dropdown, Form, ProgressBar, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import debounce from "lodash.debounce";
import { InputField, ModalComponent, ReactDataTable, SelectField } from '../../../../components';
import IndividualAnalysisData from './json/IndividualAnalysisData.json';
import { useTable } from "../../../../customHooks/useTable";

export default function IndividualAnalysis() {
    const [searchValue, setSearchValue] = useState('');
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
    // progress bar value
    const now = 100;

    // This hook is not usefull when we handle search,filter,pagination from api.
    const { currentData, totalRecords, totalPages, offset, limit, sortState, setOffset, setLimit, handleSort } = useTable({
        searchValue,
        searchKeys: ['name', 'CompanyName', 'DepartmentName', 'SurveyName'],
        tableFilters,
        initialLimit: 10,
        data: IndividualAnalysisData,
    });

    const handleLimitChange = (value) => {
        setLimit(value);
        setOffset(1);
    };

    const handleOffsetChange = (value) => {
        setOffset(value);
    };

    // Debounced change handler for managing search optimization.
    const handleSearchChange = debounce((e) => {
        setSearchValue(e.target.value);
    }, 500);

    // view modal
    const [showViewModal, setViewModal] = useState(false);
    const viewModalClose = () => setViewModal(false);
    const viewModalShow = () => setViewModal(true);

    // data table 
    const columns = [
        {
            title: '#',
            dataKey: 'id',
            data: 'id',
            columnHeaderClassName: "no-sorting w-1 text-center",

        },
        {
            title: 'Department Name',
            dataKey: 'DepartmentName',
            data: 'DepartmentName',
            sortable: true,
        },
        {
            title: 'Name',
            dataKey: 'name',
            data: 'name',
            sortable: true,
        },
        {
            title: 'Participant Name',
            dataKey: 'ParticipantName',
            data: 'ParticipantName',
            columnHeaderClassName: "min-w-220"
        },
        {
            title: 'Email ID',
            dataKey: 'email',
            data: 'email',
            columnHeaderClassName: "min-w-220"
        },
        {
            title: 'Status',
            dataKey: 'Status',
            data: 'Status',
            columnHeaderClassName: "min-w-150",
            render: () => {
                return (
                    <>
                        <label className="progressLabel"><span>Survey</span><span>5/5</span></label>
                        <ProgressBar now={now} label={`${now}%`} />
                    </>
                );
            }
        },
        {
            title: 'Action',
            dataKey: 'action',
            data: null,
            columnHeaderClassName: "w-1 text-center no-sorting",
            columnClassName: "w-1 text-center",
            render: () => {
                return (
                    <>
                        <ul className="list-inline action mb-0">
                            <li className="list-inline-item"><Link to="#!" onClick={viewModalShow} className="icon-primary"><em className="icon-eye" /></Link></li>
                            <li className="list-inline-item">
                                <Dropdown>
                                    <Dropdown.Toggle as="a" className='icon-secondary'>
                                        <em className="icon-settings-outline" />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item href="#!"><em className="icon-summary-report" />Summary Report</Dropdown.Item>
                                        <Dropdown.Item href="#!"><em className="icon-detailed-analysis" />Detailed Report</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </li>
                        </ul>
                    </>
                );
            }
        },
    ]



    return (
        <>
            <Form>
                <Row className='g-3'>
                    <Col lg={4} sm={6}>
                        <Form.Group className="form-group" >
                            <Form.Label>Company Name</Form.Label>
                            <SelectField placeholder="Company Name" options={companyOptions} />
                        </Form.Group>
                    </Col>
                    <Col lg={4} sm={6}>
                        <Form.Group className="form-group" >
                            <Form.Label>Survey Name</Form.Label>
                            <SelectField placeholder="Survey Name" options={surveyOptions} />
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
            <div className="listInfo mt-2">
                <ul className="list-inline mb-0">
                    <li className="list-inline-item">
                        <label >Survey :</label>
                        <span>HR Assessment</span>
                    </li>
                    <li className="list-inline-item">
                        <label >Company :</label>
                        <span>Codiant</span>
                    </li>
                    <li className="list-inline-item">
                        <label >Department :</label>
                        <span>All Department</span>
                    </li>
                </ul>
            </div>
            <div className="filter d-flex align-items-center justify-content-between flex-wrap gap-2">
                <div className="d-flex align-items-center">
                    <div className="searchBar">
                        <InputField type="search" placeholder="Search" onChange={handleSearchChange} />
                    </div>
                    <div className="listInfo m-0 ms-3">
                        <ul className="list-inline mb-0">
                            <li className="list-inline-item">
                                <label >Status :</label>
                                <span>Participant Response Complete</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <ul className="list-inline filter_action d-flex mb-0">
                    <li className="list-inline-item"><Link to="#!" className="btn-icon ripple-effect" ><em className="icon-download" /></Link></li>
                </ul>
            </div>
            <ReactDataTable data={currentData} columns={columns} page={offset} totalLength={totalRecords} totalPages={totalPages} sizePerPage={limit} handleLimitChange={handleLimitChange} handleOffsetChange={handleOffsetChange} searchValue={searchValue} handleSort={handleSort} sortState={sortState} />


            {/* view modal */}
            <ModalComponent modalExtraClass="reviewEditModal" extraClassName="modal-dialog-md" extraTitleClassName="pb-0" extraBodyClassName="pt-0 text-center" show={showViewModal} onHandleCancel={viewModalClose}>
                <div className="modalHead d-inline-block mt-3 mb-2">
                    <h5 className="subtitle mb-0">Welcome to Organizational <br /> Effectiveness</h5>
                </div>
                <p className="mb-xl-4 mb-md-3 mb-2">Please Click the Start button to continue the survey</p>
                <div className="mt-3 pt-1 d-flex justify-content-center">
                    <Link to="" className="btn btn-primary ripple-effect">Start</Link>
                </div>
            </ModalComponent>
        </>
    );
}
/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import { Col, Dropdown, Form, ProgressBar, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import debounce from "lodash.debounce";
import { InputField, ReactDataTable, SelectField } from '../../../../components';
import DepartmentAnalysisData from './json/DepartmentAnalysisData.json';
import { useTable } from "../../../../customHooks/useTable";

export default function DepartmentAnalysis() {
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
    // department options
    const departmentOptions = [
        { value: 'Business Development', label: 'Business Development' },
        { value: 'Finance', label: 'Finance' },
        { value: 'Marketing', label: 'Marketing' }
    ]
    // progress bar value
    const now = 100;

    // This hook is not usefull when we handle search,filter,pagination from api.
    const { currentData, totalRecords, totalPages, offset, limit, sortState, setOffset, setLimit, handleSort } = useTable({
        searchValue,
        searchKeys: ['name', 'CompanyName', 'DepartmentName', 'SurveyName'],
        tableFilters,
        initialLimit: 10,
        data: DepartmentAnalysisData,
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
    // data table 
    const columns = [
        {
            title: '#',
            dataKey: 'id',
            data: 'id',
            columnHeaderClassName: "no-sorting w-1 text-center",

        },
        {
            title: 'Name',
            dataKey: 'name',
            data: 'name',
            sortable: true,
        },
        {
            title: 'Company Name',
            dataKey: 'CompanyName',
            data: 'CompanyName',
            sortable: true,
        },
        {
            title: 'Department Name',
            dataKey: 'DepartmentName',
            data: 'DepartmentName',
            sortable: true,
        },
        {
            title: 'Survey Name',
            dataKey: 'SurveyName',
            data: 'SurveyName',
            columnHeaderClassName: "min-w-220",
            sortable: true,
        },
        {
            title: 'Status',
            dataKey: 'Status',
            data: 'Status',
            columnHeaderClassName: "min-w-150",
            render: () => {
                return (<div>
                    <label className="progressLabel"><span>Participants</span><span>5/5</span></label>
                    <ProgressBar now={now} label={`${now}%`}/>
                </div>
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
                            <li className="list-inline-item">
                                <Dropdown>
                                    <Dropdown.Toggle as="a" className='icon-secondary'>
                                        <em className="icon-settings-outline" />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu >
                                        <Dropdown.Item href="#!"><em className="icon-summary-report" />Summary Report</Dropdown.Item>
                                        <Dropdown.Item href="#!"><em className="icon-detailed-analysis" />Detailed Analysis</Dropdown.Item>
                                        <Dropdown.Item href="#!"><em className="icon-clipboard-check" />Response</Dropdown.Item>
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
                    <Col lg={4} sm={6}>
                        <Form.Group className="form-group" >
                            <Form.Label>Department Name</Form.Label>
                            <SelectField placeholder="Department Name" options={departmentOptions} />
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
            <div className="filter d-flex align-items-center justify-content-between flex-wrap gap-2">
                <div className="searchBar">
                    <InputField type="search" placeholder="Search" onChange={handleSearchChange} />
                </div>
                <ul className="list-inline filter_action d-flex mb-0">
                    <li className="list-inline-item"><Link to="#!" className="btn-icon ripple-effect" ><em className="icon-download" /></Link></li>
                </ul>
            </div>
            <ReactDataTable data={currentData} columns={columns} page={offset} totalLength={totalRecords} totalPages={totalPages} sizePerPage={limit} handleLimitChange={handleLimitChange} handleOffsetChange={handleOffsetChange} searchValue={searchValue} handleSort={handleSort} sortState={sortState} />

        </>
    );
}
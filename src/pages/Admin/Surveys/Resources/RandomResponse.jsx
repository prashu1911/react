import React, { useState, useEffect } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import debounce from "lodash.debounce";
import { ReactDataTable, InputField, SelectField, SweetAlert, Button } from '../../../../components';
import RandomResponseData from './json/RandomResponseData.json';
import adminRouteMap from '../../../../routes/Admin/adminRouteMap';
import { useTable } from "../../../../customHooks/useTable";
import { useAuth } from "customHooks";
import { RESOURSE_MANAGEMENT } from "apiEndpoints/ResourseManagement";
import logger from "helpers/logger";
// import CsvDownloader from "react-csv-downloader";
import ExportExcel from "components/Excel";
import { commonService } from "services/common.service";
import { stripHtml } from "utils/common.util";
import {
  BasicAlert,
  ModalComponent,
} from "../../../../components";

export default function RandomResponse({ companyOptions, searchOptions, selectedCompany, onCompanyChange }) {
    const { getloginUserData } = useAuth();
    const userData = getloginUserData();
    const [searchValue, setSearchValue] = useState('');
    const [randomResponseData, setRandomResponseData] = useState([]);
    const [tableLoader, setTableLoader] = useState(false);
    const [sortDirection, setSortDirection] = useState("asc");
    const [tableFilters] = useState({});
    const [formData, setFormData] = useState({
        companyMasterID: userData?.companyMasterID || null,
        companyID: selectedCompany || null,
        searchFrom: null,
        keywords: "",
    });

    // Update formData when selectedCompany prop changes
    useEffect(() => {
        if (selectedCompany) {
            setFormData(prev => ({
                ...prev,
                companyID: selectedCompany
            }));
        }
    }, [selectedCompany]);

    // survey options
    const surveyOptions = [
        { value: 'Employee Survey', label: 'Employee Survey' },
        { value: 'Auditors', label: 'Auditors' },
        { value: 'June Survey', label: 'June Survey' }
    ]
    // department options
    const departmentOptions = [
        { value: 'Business Analysis', label: 'Business Analysis' },
        { value: 'Business Development', label: 'Business Development' },
        { value: 'Designing', label: 'Designing' }
    ]
    // delete alert
    const [isAlertVisible, setIsAlertVisible] = useState(false);

    const onConfirmAlertModal = () => {
        setIsAlertVisible(false);
        return true;
    };
    const deleteModal = () => {
        setIsAlertVisible(true);
    }

    const handleCompanyChange = (selectedOption) => {
        const value = selectedOption ? selectedOption.value : null;
        onCompanyChange(selectedOption);
        setFormData(prev => ({
            ...prev,
            companyID: value
        }));
    };

    // Debounced change handler for managing search optimization.
    const handleSearchChange = debounce((e) => {
        setSearchValue(e.target.value);
    }, 500);
    // end

    // This hook is not usefull when we handle search,filter,pagination from api.
    const { currentData, totalRecords, totalPages, offset, limit, sortState, setOffset, setLimit, handleSort } = useTable({
        searchValue,
        searchKeys: ['random surveys'],
        tableFilters,
        initialLimit: 10,
        data: RandomResponseData,
    });

    const handleLimitChange = (value) => {
        setLimit(value);
        setOffset(1);
    };

    const handleOffsetChange = (value) => {
        setOffset(value);
    };

    const columns = [
        {
            title: '#',
            dataKey: 'id',
            data: 'id',
            columnHeaderClassName: "no-sorting w-1 text-center",
        },
        {
            title: 'Random Surveys',
            dataKey: 'random surveys',
            data: 'random surveys',
            sortable: true,
        },
        {
            title: 'No. of Participants',
            dataKey: 'participants',
            data: 'participants',
        },
        {
            title: 'Action',
            dataKey: 'action',
            data: null,
            columnHeaderClassName: "w-1 text-center no-sorting",
            columnClassName: "w-1 text-center",
            render: () => {
                return (
                    <ul className="list-inline action mb-0">
                        <li className="list-inline-item">
                            <Link to="#!" className="icon-danger" onClick={deleteModal}>
                                <em className="icon-delete" />
                            </Link>
                        </li>
                        <li className="list-inline-item">
                            <Link to={adminRouteMap.CHARTING.path} className="icon-success">
                                <em className="icon-analytics-outline" />
                            </Link>
                        </li>
                    </ul>
                );
            }
        },
    ];

    return (
        <>
            <div className="noteText fw-medium">Note: This Generates Participants And Responses Randomly, To Facilitate Simulation Of The Assessment Output</div>
            <Form>
                <Row className='mb-2 align-items-end gx-2'>
                    <Col lg={4} sm={6}>
                        <Form.Group className="form-group" >
                            <Form.Label>Company<sup>*</sup></Form.Label>
                            <SelectField 
                                placeholder="Select Company" 
                                options={companyOptions || []}
                                value={companyOptions?.find(
                                    (option) => option.value === formData.companyID
                                )}
                                onChange={handleCompanyChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col lg={4} sm={6}>
                        <Form.Group className="form-group" >
                            <Form.Label>Surveys</Form.Label>
                            <SelectField placeholder="Select" options={surveyOptions} />
                        </Form.Group>
                    </Col>
                    <Col lg={4} sm={6}>
                        <Form.Group className="form-group" >
                            <Form.Label>Department</Form.Label>
                            <SelectField placeholder="Select" options={departmentOptions} />
                        </Form.Group>
                    </Col>
                    <Col lg={4} sm={6}>
                        <Form.Group className="form-group flex-grow-1">
                            <Form.Label>No. Of Random Participants</Form.Label>
                            <InputField type="number" placeholder="0" />
                        </Form.Group>
                    </Col>
                    <Col lg={4} sm={6}>
                        <Form.Group className="form-group randomRange">
                            <Form.Label>Random Response Scale Modifier</Form.Label>
                            <Form.Range className="form-range randomRange_slider" defaultValue={0} id="rangeParticipants" />
                            <div className="d-flex align-items-center justify-content-between randomRange_text">
                                <span>More Favorable</span>
                                <span>Neutral</span>
                                <span>Less Favorable</span>
                            </div>
                        </Form.Group>
                    </Col>
                    <Col lg={4} sm={6}>
                        <Form.Group className="form-group d-flex justify-content-end">
                            <Button variant='primary' className='ripple-effect searchButton'>Generate</Button>
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
        
            <SweetAlert
                title="Are you sure?"
                text="Do you want to delete Random Response?"
                show={isAlertVisible}
                icon="warning"
                onConfirmAlert={onConfirmAlertModal}
                showCancelButton
                cancelButtonText="Cancel"
                confirmButtonText="Yes"
                setIsAlertVisible={setIsAlertVisible}
                isConfirmedTitle="Deleted!"
                isConfirmedText="Random Response Deleted Successfully."
            />
        </>
    );
}
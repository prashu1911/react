import React from 'react';
import { InputField, Breadcrumb, SelectField, DataTableComponent} from '../../../../components';
import { Link } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import ViewCrosswalkData from './ViewCrosswalkData.json';

function ViewCrosswalk() {
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
    // breadcrumb
    const breadcrumb = [
        {
        path: "#!",
        name: "Surveys",
        },
        
        {
        path: "#",
        name: "View Crosswalk",
        },
    ];

    const columns = [
        { 
            title: '#', 
            dataKey: 'id',
            data:'id',
            columnHeaderClassName: "no-sorting w-1 text-center",
        
        },
        { 
            title: 'Outcomes', 
            dataKey: 'outcomes',
            data:'outcomes',
            columnHeaderClassName: "min-w-150 no-sorting",
            columnClassName:"wh-normal",
        },
        { 
            title: 'Question', 
            dataKey: 'question',
            data:'question',
            columnHeaderClassName: "no-sorting",
        },
        { 
            title: 'Sub-Question', 
            dataKey: 'sub-question',
            data:'sub-question',
            columnHeaderClassName: "no-sorting",
        },
        { 
            title: 'Intentions', 
            dataKey: 'intentions',
            data:'intentions',
            columnHeaderClassName: "min-w-220 no-sorting",
            columnClassName:"wh-normal",
        },
        { 
            title: 'Intentions Short Name', 
            dataKey: 'intentions name',
            data:'intentions name',
            columnHeaderClassName: "no-sorting",
        },
        { 
            title: 'Question', 
            dataKey: 'question2',
            data:'question2',
            columnHeaderClassName: "min-w-220 no-sorting",
            columnClassName:"wh-normal",
        },
        { 
            title: 'Jump Sequence', 
            dataKey: 'jump sequence',
            data:'jump sequence',
            columnHeaderClassName: "no-sorting",
        },
        { 
            title: 'Response - Weightage - Category - OEQ',
            dataKey: 'response-weightage',
            data:null,
            columnHeaderClassName: "no-sorting",
            render: (data, row) => {
                return (
                    <>
                    <p className="mb-0">Strongly disagree - 1.00 - Positive - No</p>
                    <p className="mb-0">Disagree - 2.00 - Positive - No</p>
                    <p className="mb-0">Neutral - 3.00 - Positive - No</p>
                    <p className="mb-0">Agree - 4.00 - Positive - No</p>
                    <p className="mb-0">Strongly agree - 5.00 - Positive - No</p>
                    </>
                );
            }
        },
    ];
    return (
        <>
        {/* head title start */}
        <section className="commonHead">
            <h1 className='commonHead_title'>Welcome Back!</h1>
            <Breadcrumb breadcrumb={breadcrumb} />
        </section>
        {/* head title end */}
        <div className="pageContent crosswalk surveyTable">
            <div className="pageTitle">
                <h2 className="mb-0">View Crosswalk</h2>
            </div>
            <Form>
                <div className='d-sm-flex align-items-center flex-sm-nowrap flex-wrap gap-2'>
                    <Form.Group className="form-group" >
                        <Form.Label>Company Name</Form.Label>
                        <SelectField  placeholder="Company Name" options={companyOptions} isDisabled/>
                    </Form.Group>
                    <Form.Group className="form-group" >
                        <Form.Label>Survey Name</Form.Label>
                        <SelectField  placeholder="Survey Name" options={surveyOptions} />
                    </Form.Group>
                </div>
            </Form>
            <h3 className="innerTitle">HR assessment</h3>
            <div className="filter d-flex align-items-center justify-content-between flex-wrap gap-2">
                <div className="searchBar">
                    <InputField type={"text"} placeholder={"Search"} />
                </div>
                <ul className="list-inline filter_action mb-0">
                    <li className="list-inline-item"><Link to="#!" className="btn-icon ripple-effect"><em className="icon-download"></em></Link></li>
                </ul>
            </div>
            <DataTableComponent data={ViewCrosswalkData} columns={columns}/>
        </div>
        </>
    );
}   

export default ViewCrosswalk
// import { render } from '@testing-library/react';
import React from 'react';
import { Nav, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { statusFormatter } from '../../../../components/DataTable/TableFormatter';
import DataTableComponent from '../../../../components/DataTable';
import PaymentsData from './PaymentsData.json';
import FailedPaymentsData from './FailedPaymentsData.json';
import { InputField } from '../../../../components';

export default function Payments() {
    // data table
    const paymentColumns = [
        {
            title:"#",
            dataKey:"id",
            data:'id',
            columnHeaderClassName: "no-sorting w-1 text-center",
        },
        {
            title: 'Invoice number',
            dataKey: 'invoice',
            data: 'invoice',    
        },
        {
            title: 'Charge Type',
            dataKey: 'chargetype',
            data: 'chargetype',    
        },
        {
            title: 'Paid Amount (US $)',
            dataKey: 'amount', 
            data: 'amount',   
        },
        {
            title: 'Date',
            dataKey: 'date',
            data: 'date',    
        }
    ]

    const failedPaymentsColumns = [
        {
            title:"#",
            dataKey:"id",
            data:'id',
            columnHeaderClassName: "no-sorting w-1 text-center",
        },
        {
            title: 'Invoice number',
            dataKey: 'invoice',  
            data: 'invoice',  
        },
        {
            title: 'Payment Type',
            dataKey: 'paymenttype',
            data: 'paymenttype',    
        },
        {
            title: 'Amount (US $)',
            dataKey: 'amount',  
            data: 'amount',  
        },
        {
            title: 'Payment Date',
            dataKey: 'date',
            data: 'date',    
        },
        {
            title: 'Status',
            dataKey: 'status',
            columnClassName:"align-top",
            data:null,
            render: (data) => {
                return statusFormatter(data);
            }
        }
    ]
    return (
        <>
            <Tab.Container defaultActiveKey="monthly">
                <div className="filter d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <div className="searchBar">
                        <InputField type="text" placeholder="Search" />
                    </div>
                    <div className="d-flex align-items-center">
                        <Nav variant="pills" className="commonTab me-2">
                            <Nav.Item>
                                <Nav.Link eventKey="monthly">Monthly</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="yearly">Yearly</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="payments">Failed Payments</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <ul className="list-inline filter_action mb-0">
                            <li className="list-inline-item"><Link to="#!" className="btn-icon ripple-effect"><em className="icon-download" /></Link></li>
                        </ul>
                    </div>
                </div>
                <Tab.Content className='mt-3'>
                    <Tab.Pane eventKey="monthly">
                        <DataTableComponent data={PaymentsData} columns={paymentColumns} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="yearly">
                        <DataTableComponent data={PaymentsData} columns={paymentColumns} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="payments">
                        <DataTableComponent data={FailedPaymentsData} columns={failedPaymentsColumns} />
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </>
    );
}
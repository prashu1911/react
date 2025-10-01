import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, Tab } from 'react-bootstrap';
import { DataTableComponent, InputField } from 'components';
import BillingData from './BillingData.json';

export default function Billing() {

    // data table
    const columns = [
        {
            title: '#',
            dataKey: 'id',  
            data: 'id',  
            columnHeaderClassName: "no-sorting w-1 text-center",
        },
        {
            title: 'Invoice number',
            dataKey: 'invoice',
            data: 'invoice',    
        },
        {
            title: 'Date',
            dataKey: 'date',
            data: 'date',    
        },
        {
            title: 'Subscription Type',
            dataKey: 'subscriptiontype',
            data: 'subscriptiontype',    
        },
        {
            title: 'Period',
            dataKey: 'period',    
            data: 'period',
        },
        {
            title: 'Charge Type',
            dataKey: 'chargetype',
            data: 'chargetype',    
        },
        {
            title: 'Amount (US $)',
            dataKey: 'amount', 
            data: 'amount',   
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
                        </Nav>
                        <ul className="list-inline filter_action mb-0">
                            <li className="list-inline-item"><Link to="#!" className="btn-icon ripple-effect"><em className="icon-download" /></Link></li>
                        </ul>
                    </div>
                </div>
                <Tab.Content className='mt-3'>
                    <Tab.Pane eventKey="monthly">
                        <DataTableComponent data={BillingData} columns={columns} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="yearly">
                        <DataTableComponent data={BillingData} columns={columns} />
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </>
    )
}
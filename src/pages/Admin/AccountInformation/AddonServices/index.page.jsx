import React from 'react';
import { DataTableComponent, InputField } from '../../../../components';
import AddonServicesData from './AddonServicesData.json';

export default function AddonServices() {
    const columns = [
        {
            title:"#",
            dataKey:"id",
            data:'id',
            columnHeaderClassName: "no-sorting w-1 text-center",
        },
        {
            title: 'Sow Number',
            dataKey: 'number',
            data: 'number',
            columnHeaderClassName: "no-sorting w-1 text-center",
        },
        {
            title: 'Add-on Services',
            dataKey: 'services',
            data: 'services',
        },
        {
            title: 'Sow Date',
            dataKey: 'date',
            data: 'date',
        },
        {
            title: 'Amount (US $)',
            dataKey: 'amount',
            data: 'amount',    
        },
    ]
    return (
        <>
            <div className="filter d-flex align-items-center justify-content-between flex-wrap gap-2">
                <div className="searchBar">
                    <InputField type="text" placeholder="Search" />
                </div>
            </div>
            <DataTableComponent data={AddonServicesData} columns={columns} />
        </>
    );
}
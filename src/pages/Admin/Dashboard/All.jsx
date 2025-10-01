import React, { useState } from 'react';
import AllData from './json/AllData.json';
import DataTableComponent from './SurveyOverviewTable';

export default function All({columns, offset,  data = AllData, sortTable, sortConfig, setSortConfig }) {


    const handleSort = (key) => {
        const index = columns.findIndex(col => col.dataKey === key);
        console.log("Sorting column:", key, "at index:", index);

        sortTable(index - 1, sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',)

        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
        }));
    };





    return (
        <DataTableComponent
            data={data}
            columns={columns}
            onSort={handleSort}
            sortConfig={sortConfig}
        />
    );
}

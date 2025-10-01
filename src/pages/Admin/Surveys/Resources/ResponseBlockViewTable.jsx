import React, { useState } from 'react'
import { Form } from 'react-bootstrap';
import { Button, ReactDataTable } from '../../../../components';
// import ResponseBlockPreviewData from './json/ResponseBlockPreviewData.json';
import { useTable } from "../../../../customHooks/useTable";

export default function ResponseBlockViewTable({ responsePreviewClose, responseBlockPreviewData, responseLoading }) {

    const [searchValue] = useState('');
    const [tableFilters] = useState({});

    // Format weightage to 2 decimal places
    const getFormattedData = (data) => {
        if (!data || !Array.isArray(data)) return [];
        
        return data.map(item => {
            // Create a copy of the item
            const newItem = {...item};
            
            // Format response weightage if exists
            if (newItem.responseWeightage !== undefined && newItem.responseWeightage !== null) {
                newItem.responseWeightage = Number(newItem.responseWeightage).toFixed(2);
            }
            
            return newItem;
        });
    };

    // This hook is not usefull when we handle search,filter,pagination from api.
    const { currentData, totalRecords, totalPages, offset, limit, sortState, setOffset, setLimit, handleSort } = useTable({
        searchValue,
        searchKeys: ['responseCategory'],
        tableFilters,
        initialLimit: 10,
        data: getFormattedData(responseBlockPreviewData),
    });


    const handleLimitChange = (value) => {
        setLimit(value);
        setOffset(1);
    };

    const handleOffsetChange = (value) => {
        setOffset(value);
    };

    const responseBlockPreviewColumns = [
        {
            title: 'Response',
            dataKey: 'responseName',
            data: 'responseName',
            columnHeaderClassName: "no-sorting",
        },
        {
            title: 'Value',
            dataKey: 'responseWeightage',
            data: 'responseWeightage',
            columnHeaderClassName: "no-sorting",
        },
        {
            title: 'Response Category',
            dataKey: 'responseCategory',
            data: 'responseCategory',
            // columnHeaderClassName: "no-sorting",
            sortable: true,
        },
        {
            title: 'OEQ',
            dataKey: 'oeq',
            data: 'oeq',
            columnHeaderClassName: "no-sorting",
        },
        {
            title: 'OEQ Question',
            dataKey: 'oeqQuestion',
            data: 'oeqQuestion',
            columnHeaderClassName: "no-sorting",
        },
    ];
    return (
        <div>
            <Form>
                <ReactDataTable data={currentData} columns={responseBlockPreviewColumns} page={offset} totalLength={totalRecords} totalPages={totalPages} sizePerPage={limit} handleLimitChange={handleLimitChange} handleOffsetChange={handleOffsetChange} searchValue={searchValue} handleSort={handleSort} sortState={sortState} isPaginate={false} isLoading={responseLoading} />
                <div className="d-flex justify-content-end">
                    <Button variant='secondary' className='ripple-effect' onClick={responsePreviewClose}>Cancel</Button>
                </div>
            </Form>
        </div>
    )
}

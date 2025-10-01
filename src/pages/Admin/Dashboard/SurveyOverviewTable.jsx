import React, { useRef } from 'react';
import 'datatables.net-rowreorder';

function DataTableComponent({ data, columns, onSort, sortConfig }) {
    const tableRef = useRef(null);

    const renderCellContent = (row, column, rowIndex) => {
        if (column.render) {
            return column.render(row, column, rowIndex);
        }
        return row[column.dataKey];
    };
    


    return (
        <div style={{borderBottom:'1px solid #EFF0F3'}} className="commonTable dataTable ">
            <table  className="table w-100 datatable-wrap" ref={tableRef}>
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className={column?.sortable?`sorting ${sortConfig?.key==column.dataKey ? sortConfig?.direction=='desc'?'sorting_desc':'sorting_asc':''}`:``}
                                style={{ cursor: column.sortable ? 'pointer' : 'default' }}
                                onClick={() => column.sortable && onSort?.(column.dataKey)}
                            >
                                {column.title}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data?.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {columns.map((column, colIndex) => (
                                <td
                                className={column?.columnClassName}
                                key={colIndex}
                                style={
                                  column.dataKey === 'assessment_name'
                                    ? { whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: '50rem' }
                                    : {}
                                }
                              >
                                {renderCellContent(row, column, rowIndex)}
                              </td>
                              
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DataTableComponent;

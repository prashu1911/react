import React, { useRef } from 'react';
import 'datatables.net-rowreorder';
// eslint-disable-next-line import/no-extraneous-dependencies


function DataTableComponent({ data, columns, }) {
    const tableRef = useRef(null);

    const renderCellContent = (row, column, index) => {
        if (column.render) {
            return column.render(row, row, index);
        }
        return row[column.dataKey] ? row[column.dataKey] : "-";
    };

    return (
        <div className="commonTable dataTable" style={{border: '1px solid #eee',}}>
            <table className="table w-100" style={{ border: '1px solid #eee', borderCollapse: 'collapse' }} ref={tableRef}>
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th style={{ border: '1px solid #eee' }} className={column?.columnHeaderClassName} data-orderable={column?.columnOrderable} key={index}>
                                {column.title}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data?.length > 0 ?
                        <>
                            {data?.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {columns.map((column, colIndex) => (
                                        <td style={{
                                            whiteSpace: 'normal',
                                            wordWrap: 'break-word',
                                            wordBreak: 'break-word',
                                            border: '1px solid #eee',
                                        }}
                                            className={column?.columnClassName} key={colIndex}>
                                            {renderCellContent(row, column, rowIndex)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </> :
                        <tr>
                            <td style={{ border: '1px solid #eee' }}
                                colSpan={columns.length} className="text-center">
                                No Records Found.
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    );
}

export default DataTableComponent;

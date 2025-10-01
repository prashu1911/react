import React from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const ExportExcel = ({ data, columns, filename }) => {
    const handleExport = async () => {
        // Resolve async function if necessary
        const resolvedData = typeof data === 'function' ? await data() : data;

        if (!Array.isArray(resolvedData)) {
            console.error('Export failed: data is not an array', resolvedData);
            return;
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(filename || 'Sheet1');

        worksheet.columns = columns.map(col => ({
            header: col.displayName,
            key: col.id,
            width: 20,
        }));

        resolvedData.forEach((row, index) => {
            const rowData = {
                sno: index + 1,
                ...row,
            };
            worksheet.addRow(rowData);
        });

        worksheet.getRow(1).font = { bold: true };

        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), `${filename || 'ExportedFile'}.xlsx`);
    };

    return (
        <li className="list-inline-item tooltip-container" data-title="Download">
            <button onClick={handleExport} className="btn-icon">
                <em className="icon-download" />
            </button>
        </li>
    );
};

export default ExportExcel;

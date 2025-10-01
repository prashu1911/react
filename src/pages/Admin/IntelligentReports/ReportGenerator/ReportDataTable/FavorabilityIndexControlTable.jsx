import React from 'react';
import { DataTableComponent } from '../../../../../components';
import FavorabilityIndexControlData from '../json/FavorabilityIndexControlData.json';
import { Link } from 'react-router-dom';

export default function FavorabilityIndexControlTable({ThemeList, favorabilityIndexSettingsShow}) {
  
    const columns = [
        { 
            title: 'S.No.', 
            dataKey: 'themeID',
            columnHeaderClassName: "no-sorting w-1 text-center",
        
        },
        { 
            title: 'Response Type', 
            dataKey: 'themeName',
            columnHeaderClassName: "no-sorting",
        },
        { 
            title: 'Theme', 
            dataKey: 'defaultTheme',
            columnHeaderClassName: "no-sorting",
        },
        { 
            title: '#', 
            dataKey: 'action',
            columnHeaderClassName: "no-sorting w-1",
            render: (data, row) => {
                return (
                    <ul className="list-inline action mb-0">
                        <li className="list-inline-item">
                            <Link onClick={(e)=>{e.preventDefault(); favorabilityIndexSettingsShow()}} className="link-primary" >
                                <em className="icon-settings"></em>
                            </Link>
                        </li>
                    </ul>
                );
            }
        }
    ];
  return (
    <DataTableComponent showFooter={false} data={ThemeList} columns={columns} />
  );
};





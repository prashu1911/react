import React from 'react';
import { DataTableComponent} from '../../../components';
import AllData from './json/AllData.json';

export default function Closed() {
    
    const columns = [
        { 
            title: '#', 
            dataKey: 'id',
            data:'id',
            columnHeaderClassName: "no-sorting w-1 text-center",
        
        },
        { 
            title: 'Surveys', 
            dataKey: 'surveys',
            data:'surveys',
        },
        { 
            title: 'Participants', 
            dataKey: 'participants',
            data:'participants',
        },
        { 
            title: 'Start',
            dataKey: 'start',
            data:'start',
        },
        { 
            title: 'Stop',
            dataKey: 'stop',
            data:'stop',
        },
        { 
            title: 'Days Remaining',
            dataKey: 'days-remaining',
            data:'days-remaining',
        },
        { 
            title: 'Auto Reminder',
            dataKey: 'auto-reminder',
            data:'auto-reminder',
        },
        { 
            title: 'Completed',
            data:null,
            dataKey: 'completed',
            render: () => {
                return (
                    `<p><span className="me-3 pe-3">75</span> 97.40%</p>`
                );
            }
        },
        { 
            title: 'Not Started',
            dataKey: 'not-started',
            data: null,
            render: () => {
                return (
                   ` <p><span className="me-3 pe-3">0 </span> 0%</p>`
                );
            }
        },
        { 
            title: 'In Progress',
            dataKey: 'in-progress',
            data: null,
            render: () => {
                return (
                    `<p><span className="me-3 pe-3">2 </span> 2.60%</p>`
                );
            }
        },
    ];
  return (
    <DataTableComponent data={AllData} columns={columns} />
  );
}
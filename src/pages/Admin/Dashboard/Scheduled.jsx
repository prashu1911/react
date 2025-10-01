import React from 'react';
import { DataTableComponent} from '../../../components';
import AllData from './json/AllData.json';

export default function Scheduled() {
    
    const columns = [
        { 
            title: '#', 
            dataKey: 'id',
            data:'id',
            columnHeaderClassName: "no-sorting w-1 text-center",
        
        },
        { 
            title: 'Surveys',
            data:'surveys', 
            dataKey: 'surveys',
        },
        { 
            title: 'Participants',
            data:'participants', 
            dataKey: 'participants',
        },
        { 
            title: 'Start',
            data:'start',
            dataKey: 'start',
        },
        { 
            title: 'Stop',
            data:'stop',
            dataKey: 'stop',
        },
        { 
            title: 'Days Remaining',
            data:'days-remaining',
            dataKey: 'days-remaining',
        },
        { 
            title: 'Auto Reminder',
            data:'auto-reminder',
            dataKey: 'auto-reminder',
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
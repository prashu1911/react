import { ProgressBar } from 'react-bootstrap';

export default function ResponseRateTable({ SectionData, responceRate=false }) {
    const distribution = SectionData?.attributeData?.widgetData?.distribution || [];
    const overall = distribution.filter(item => item?.type === 'overall');
    const department = distribution.filter(item => item?.type === 'department');
    const demographic = distribution.filter(item => item?.type === 'demographic');
    const user = distribution.filter(item => item?.type === 'user');

    // Calculate number of columns for heading colSpan
    const colCount = 1 +
        (SectionData?.attributeData?.widgetData?.displayInvited ? 1 : 0) +
        (SectionData?.attributeData?.widgetData?.displayResponse ? 1 : 0) +
        (SectionData?.attributeData?.widgetData?.responseRateDistribution ? 1 : 0);

    const renderRows = (items) => (
        items.map((item) => (
            <tr key={item?.id}>
                <td>{item?.name}</td>
                {(SectionData?.attributeData?.widgetData?.displayInvited || responceRate) &&
                    <td className='text-center'>{item?.invited}</td>
                }
                {(SectionData?.attributeData?.widgetData?.displayResponse || responceRate) &&
                    <td className='text-center'>{item?.completed}</td>
                }
                {SectionData?.attributeData?.widgetData?.responseRateDistribution &&
                    <td className="text-center">
                        <ProgressBar>
                            {item?.participationRate > 0 &&
                                <ProgressBar variant="success" label={<span className="dist-label">{item?.participationRate}</span>} now={item?.participationRate} />
                            }
                            {item?.participationRate < 100 &&
                                <ProgressBar style={{ backgroundColor: '#eee' }}  now={100 - item?.participationRate} />
                            }
                        </ProgressBar>
                    </td>
                }
            </tr>
        ))
    );

    return (
        <div className="table-responsive datatable-wrap">
            <table className="table reportTable">
                <thead>
                    <tr>
                        <th className='min-w-220 '>Name</th>
                        {(SectionData?.attributeData?.widgetData?.displayInvited || responceRate) &&
                            <th className='min-w-150 text-center'>Invited</th>
                        }
                        {(SectionData?.attributeData?.widgetData?.displayResponse || responceRate) &&
                            <th className='text-center'>Responded</th>
                        } 
                        {SectionData?.attributeData?.widgetData?.responseRateDistribution &&
                            <th className='min-w-220 text-center'>Participation Rate</th>
                        }
                    </tr>
                </thead>
                <tbody>
                    {overall.length > 0 && (
                        <tr><td colSpan={colCount}><b>Overall</b></td></tr>
                    )}
                    {renderRows(overall)}
                    {department.length > 0 && (
                        <tr><td colSpan={colCount}><b>Department</b></td></tr>
                    )}
                    {renderRows(department)}
                    {demographic.length > 0 && (
                        <tr><td colSpan={colCount}><b>Demographic</b></td></tr>
                    )}
                    {renderRows(demographic)}
                    {user.length > 0 && (
                        <tr><td colSpan={colCount}><b>User</b></td></tr>
                    )}
                    {renderRows(user)}
                </tbody>
            </table>
        </div>
    );
};





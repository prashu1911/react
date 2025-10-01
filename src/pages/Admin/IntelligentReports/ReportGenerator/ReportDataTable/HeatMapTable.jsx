import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Tooltip } from 'bootstrap'; // Bootstrap must be installed
import { ADMIN_MANAGEMENT } from 'apiEndpoints/AdminManagement/adminManagement';
import { commonService } from 'services/common.service';
import { useAuth } from 'customHooks';
import { showErrorToast } from 'helpers/toastHelper';


export default function HeatMapTable({ TemplateFlag, SectionId, HeatmapData, expandAll = false, collapsedRows, heatmapHeader }) {

    const { getloginUserData } = useAuth();
    const userData = getloginUserData();

    // Handle row click for toggling accordion

    const [collapsedNodeIDs, setCollapsedNodeIDs] = useState([]);
    const [didToggle, setDidToggle] = useState(false);

    const toggleCollapseNode = (id) => {
        if (!expandAll) {
            setCollapsedNodeIDs((prev) =>
                prev.includes(id)
                    ? prev.filter((item) => item !== id) // Remove from collapsed → now expanded
                    : [...prev, id] // Add to collapsed
            );
            setDidToggle(true);
        }else{
            showErrorToast("uncheck Expand all and save")
        }
    };

    useEffect(() => {
        if (didToggle) {
            updateAccordian();
            setDidToggle(false); // reset the flag
        }
    }, [collapsedNodeIDs]);

    // Initialize tooltips on mount
    useEffect(() => {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltipTriggerList.forEach(el => new Tooltip(el));
        setCollapsedNodeIDs(collapsedRows || [])
    }, [collapsedRows]);

    const updateAccordian = async () => {
        try {
            const response = await commonService({
                apiEndPoint: ADMIN_MANAGEMENT.updateHeatmapUpdateAccordian,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userData?.apiToken}`,
                },
                bodyData: {
                    "sectionID": SectionId,
                    "templateFlag": TemplateFlag,
                    "collapsedRows": collapsedNodeIDs
                },
            });

            if (response?.status) {
                // if (TemplateFlag) {
                //   fetchWidgetList(ReportId, 1)
                // } else {

                //   fetchReportWidgets(ReportId, 0)
                // }

                return true
            }

        } catch (error) {
            console.error("Error fetching elements:", error);
            return false
        }
    };


    return (
        <div className="commonTable dataTable mb-3">
            <div style={{border:'none'}} className="table-responsive datatable-wrap">
                <table className="table reportTable">
                    <thead style={{ border: 'none' }}>
                        <tr style={{ height: '6.5rem', backgroundColor: '#fff', border: 'none' }}>
                            <th className='min-w-250 text-center' style={{ backgroundColor: '#fff', border: 'none', }}></th>
                            {heatmapHeader?.map((item, index) => (
                                <th
                                    key={index}
                                    className="text-left align-middle"
                                    style={{ backgroundColor: '#fff', border: 'none', maxWidth: '2rem', padding: '0rem', overflowX: 'visible' }}
                                >
                                    <div
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="top"
                                        title={item?.name}

                                        style={{
                                            wordWrap: 'break-word',
                                            whiteSpace: 'normal',
                                            fontSize: '0.8rem',
                                            lineHeight: '1rem',
                                            maxWidth: '5rem',
                                            minWidth: '5.7rem',
                                            marginBottom: '1rem',
                                            transform: 'rotate(-70deg)',
                                            marginLeft: '-1.5rem',
                                            display: 'block',
                                            wordBreak: 'break-word',
                                            height: '2.2rem', // height for 2 lines of text
                                            overflow: 'hidden',
                                            fontSize: '0.7rem',
                                            lineHeight: '1rem',
                                            fontWeight: index == 0 ? 'bold' : null
                                        }}
                                    >
                                        {item?.name}
                                    </div>

                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody style={{border: "1px solid #eee",}}>
                        <tr>
                            <td className="text-center bg-light"><strong>Objects</strong></td>
                            {
                                heatmapHeader?.map((item, index) => (
                                    <td className="text-center bg-light" style={{ fontWeight: index === 0 ? 'bold' : null }}>{item?.userCount}</td>
                                ))
                            }
                        </tr>
                        {HeatmapData?.map((item) => (
                            <>
                                {item?.selected && <tr>
                                    <td colSpan={null} style={{}}>
                                        <Link onClick={(e) => { e.preventDefault(); toggleCollapseNode(item?.outcome_id); }} className={`clickIcon ${(!collapsedNodeIDs?.includes(item?.outcome_id) || expandAll) ? 'clickIcon-roate' : ''}`}>
                                            <em className="icon-drop-down"></em>
                                        </Link>
                                        <span style={{ maxWidth: '20rem', whiteSpace: 'normal', wordWrap: 'break-word', }} className="ms-2 d-inline-block">{item?.outcome_name}</span>
                                    </td>
                                    {item?.datapoints.map((datapoints) => (
                                        <td className='text-center' style={{ backgroundColor: datapoints?.color || '#fff' }}>{datapoints?.value}%</td>

                                    ))}
                                </tr>}
                                {(!collapsedNodeIDs.includes(item?.outcome_id) || expandAll || !item?.selected) && item?.intentions?.map((intention) => (
                                    <>
                                        {intention?.selected && <tr>
                                            <td >
                                                <Link style={{ marginLeft: '1rem' }} onClick={(e) => { e.preventDefault(); toggleCollapseNode(intention?.intention_id); }} className={`clickIcon ${(!collapsedNodeIDs.includes(intention?.intention_id) || expandAll) ? 'clickIcon-roate' : ''}`}>
                                                    <em className="icon-drop-down"></em>
                                                </Link>
                                                <span style={{ maxWidth: '20rem', whiteSpace: 'normal', wordWrap: 'break-word', }} className="ms-2 d-inline-block">{intention?.intention_name}</span>
                                            </td>
                                            {intention?.datapoints.map((datapoints) => (
                                                <td className='text-center' style={{ backgroundColor: datapoints?.color || '#fff' }}>{datapoints?.value}%</td>

                                            ))}
                                        </tr>}

                                        {(!collapsedNodeIDs.includes(intention?.intention_id) || expandAll || !intention?.selected) && intention?.questions?.map((question) => (
                                            <>
                                                {question?.selected && <tr>
                                                    <td >
                                                        <Link style={{ marginLeft: '1rem' }} onClick={(e) => { e.preventDefault(); }} >
                                                            {/* <em className="icon-drop-down"></em> */}
                                                        </Link>
                                                        <span style={{ maxWidth: '20rem', whiteSpace: 'normal', wordWrap: 'break-word', }} className="ms-2 d-inline-block">{question?.question}</span>
                                                    </td>
                                                    {question?.datapoints?.map((datapoints) => (
                                                        <td className='text-center' style={{ backgroundColor: datapoints?.color || '#fff' }}>{datapoints?.value}%</td>

                                                    ))}
                                                </tr>
                                                }
                                            </>

                                        ))}

                                    </>

                                ))}
                            </>

                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
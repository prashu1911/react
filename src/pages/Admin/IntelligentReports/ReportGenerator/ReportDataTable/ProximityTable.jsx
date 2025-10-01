import React, { useEffect, useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { ProgressBar } from 'react-bootstrap';
import { Tooltip } from 'bootstrap'; // Bootstrap must be installed


export default function ProximityTable({ byIntention = false, SectionData }) {

    useEffect(() => {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltipTriggerList.forEach(el => new Tooltip(el));
    }, []);


    const hasNaN = SectionData?.attributeData?.widgetData?.importanceData.some(
        item => Number.isNaN(item.correlationCoefficant)
    );

    return (
        <>
            {/* Favorability Index table with accordion */}
            <div className="table-responsive datatable-wrap">
                <table className="table reportTable">
                    <thead>
                        <tr>
                            {SectionData?.attributeData?.widgetData?.showImportance &&
                                <th className='w-1 pe-1'>Importance</th>}
                            {SectionData?.attributeData?.widgetData?.showImportanceValue &&
                                <th className='w-1 pe-4 text-center'>Value</th>}
                            <th className='min-w-220 ps-0'>Question</th>
                            {SectionData?.attributeData?.widgetData?.displayResponseCount &&
                                <th className="min-w-200 text-center">Responses</th>}
                            <th className="text-center min-w-220">Distribution</th>
                            {SectionData?.attributeData?.widgetData?.displayOverallFavorability &&
                                <th className='text-center'>Overall Favorable</th>}
                            {SectionData?.attributeData?.widgetData?.displayFavorableResponseCount &&
                                <th className='text-center'>Favorable Count</th>
                            }
                            {SectionData?.attributeData?.widgetData?.displayBenchmark && SectionData?.attributeData?.widgetData?.importanceData[0]?.benchmarks?.map((item) => (
                                <th className='text-center'>{item?.name}</th>
                            ))
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {SectionData?.attributeData?.widgetData?.importanceData?.map((item, index) => (
                            <tr>
                                {SectionData?.attributeData?.widgetData?.showImportance &&
                                    <td className="w-1 pe-1 text-center" data-bs-toggle={"tooltip"}
                                        data-bs-placement="top"
                                        title={item?.correlationCoefficant.toFixed(4)} >
                                        {item?.correlationCoefficantPercentage > 25 ? <i className="bi bi-circle-fill pe-1" /> : item?.correlationCoefficantPercentage > 12.5 ? <i className="bi bi-circle-half pe-1" /> : <i className="bi bi-circle pe-1" />}
                                        {item?.correlationCoefficantPercentage > 50 ? <i className="bi bi-circle-fill pe-1" /> : item?.correlationCoefficantPercentage > 37.5 ? <i className="bi bi-circle-half pe-1" /> : <i className="bi bi-circle pe-1" />}
                                        {item?.correlationCoefficantPercentage > 75 ? <i className="bi bi-circle-fill pe-1" /> : item?.correlationCoefficantPercentage > 62.5 ? <i className="bi bi-circle-half pe-1" /> : <i className="bi bi-circle pe-1" />}
                                        {item?.correlationCoefficantPercentage > 99 ? <i className="bi bi-circle-fill pe-1" /> : item?.correlationCoefficantPercentage > 87.5 ? <i className="bi bi-circle-half pe-1" /> : <i className="bi bi-circle pe-1" />}
                                    </td>}
                                {SectionData?.attributeData?.widgetData?.showImportanceValue &&
                                    <td className='w-1 pe-4 text-center'>{item?.correlationCoefficant.toFixed(4)}</td>}
                                <td className="ps-0 ">{item?.question}</td>
                                {SectionData?.attributeData?.widgetData?.displayResponseCount &&
                                    <td className='text-center'>{item?.totalResponse}</td>
                                }
                                <td className="text-center">
                                    <ProgressBar>
                                        {item?.favorData?.map((item) => (
                                            <ProgressBar
                                                style={{
                                                    backgroundColor: SectionData?.attributeData?.widgetData?.themeData.find(theme => theme.name === item?.favorName)?.color,   // 👈 custom color
                                                }} label={SectionData?.attributeData?.widgetData?.displayPercentage && <span className="dist-label">{item?.favorPercentage?.toFixed(SectionData?.attributeData?.widgetData?.selectedDecimalPoint || 0)}</span>} now={item?.favorPercentage} />
                                        ))}
                                    </ProgressBar>
                                </td>
                                {SectionData?.attributeData?.widgetData?.displayOverallFavorability &&
                                    <td className='text-center'>{item?.favorableResponsePercentage?.toFixed(SectionData?.attributeData?.widgetData?.selectedDecimalPoint || 0)}</td>
                                }
                                {SectionData?.attributeData?.widgetData?.displayFavorableResponseCount &&
                                    <td className='text-center'>{item?.favorableResponse}</td>
                                }
                                {item?.benchmarks?.map((item) => (

                                    <td className='text-center'>{item?.value}</td>
                                ))}

                            </tr>
                        ))
                        }
                    </tbody>
                </table>

                {hasNaN &&
                    <span style={{ fontSize: '12px' }} className="noteText fw-medium"> *NaN - Correlation calculation failed due to lack of variability in the data</span>
                }

            </div>
        </>
    );
};





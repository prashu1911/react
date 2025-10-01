import React, { useEffect, useState } from "react";
import GeneralChart from "../Chart/GeneralChart";
import OverallWithThreeUsersTable from "../ReportDataTable/OverallWithThreeUsersTable";
import ReferenceDataAggregateUserTable from "../ReportDataTable/ReferenceDataAggregateUserTable";

const GeneralChartWidget = React.memo(({ }) => {
 const collapseKey="generalChart"
 console.log("1234 General Chart");
 
    return (
        <div className="generateCard_center_inner md-4">
            {/* <div className="d-flex align-items-center justify-content-between gap-2">
                <h3 className="reportTitle mb-0">{SectionData?.attributeData?.widgetData?.title}</h3>
                <ul className="list-unstyled mb-0 d-flex align-items-center gap-3 lh-1 cardFilter">
                    {collapseKey !== "pageBreak" &&
                        <li>
                            <div style={{ cursor: 'pointer' }} onClick={() => commonToggleCollapse({ collapseKey, SectionId })} className="icon">
                                <em className="icon-sliders-horizontal" />
                            </div>
                        </li>
                    }
                    <li>
                        <div style={{ cursor: 'pointer' }} onClick={() => {
                            setDeleteSectionValue({
                                SectionName: title,
                                SectionId
                            })
                            setDeleteSectionModal(true)
                        }} className="icon">
                            <em className="icon-close-circle" />
                        </div>
                    </li>
                </ul>
            </div> */}
            {/* <div className="mt-4">
                {SectionData?.attributeData?.widgetData &&
                    <GeneralChart SectionData={SectionData} />
                }
                {(SectionData?.attributeData?.widgetData?.IRdatasetPropertiesFlag && SectionData?.attributeData?.widgetData?.IRdatasetProperties) &&
                    <OverallWithThreeUsersTable SectionData={SectionData} />
                }
                {SectionData?.attributeData?.widgetData?.referenceDataPropertiesFlag && SectionData?.attributeData?.widgetData?.referenceDataProperties?.length > 0 &&
                    <ReferenceDataAggregateUserTable SectionData={SectionData} />
                }
            </div> */}
        </div>
    );
});

export default GeneralChartWidget;

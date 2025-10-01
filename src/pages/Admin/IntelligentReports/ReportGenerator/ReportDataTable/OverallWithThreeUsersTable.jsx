import React from 'react';

export default function OverallWithThreeUsersTable({ SectionData, heading = true }) {
    return (
        <>
            {/* Overall with 3 users table */}
            {heading &&
                <h4 className='reportSubTitle mb-3 pt-2'>Dataset Properties</h4>
            }
            <h4 className='reportSubTitle mb-3 pt-2'>Name: {SectionData?.attributeData?.widgetData?.IRdatasetProperties?.dataset_name || SectionData?.attributeData?.widgetData?.datasetProperties?.dataset_name}</h4>
            <div className="table-responsive datatable-wrap">
                <table className="table reportTable withBorder">
                    <thead>
                        <tr>
                            <th className='w-1 text-center'>S.No.</th>
                            <th className='min-w-150'>Data Point</th>
                            <th className='min-w-300'>Filter</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className='text-center'>1</td>
                            <td>Department</td>
                            <td>
                                {
                                    SectionData?.attributeData?.widgetData?.IRdatasetProperties?.departments?.join(", ") ||
                                    SectionData?.attributeData?.widgetData?.datasetProperties?.departments?.join(", ") ||
                                    '-'
                                }
                            </td>
                        </tr>
                        <tr>
                            <td className='text-center'>2</td>
                            <td>Participant</td>
                            <td>
                                {
                                    SectionData?.attributeData?.widgetData?.IRdatasetProperties?.participants?.join(", ") ||
                                    SectionData?.attributeData?.widgetData?.datasetProperties?.participants?.join(", ") ||
                                    '-'
                                }
                            </td>
                        </tr>
                        <tr>
                            <td className='text-center'>3</td>
                            <td>Description</td>
                            <td>
                                {
                                    SectionData?.attributeData?.widgetData?.IRdatasetProperties?.dataset_description ||
                                    SectionData?.attributeData?.widgetData?.datasetProperties?.dataset_description ||
                                    '-'
                                }
                            </td>
                        </tr>
                        <tr>
                            <td className='text-center'>4</td>
                            <td>Demographic Filter</td>
                            <td>
                                {
                                    SectionData?.attributeData?.widgetData?.IRdatasetProperties?.demographic_filter?.length > 0
                                        ? SectionData.attributeData.widgetData.IRdatasetProperties.demographic_filter.map((item, index) => (
                                            <div key={index}>
                                                {item.questionValue}: {item.responses.map((res) => res.responseValue).join(", ")}
                                            </div>
                                        ))
                                        : SectionData?.attributeData?.widgetData?.datasetProperties?.demographic_filter?.length > 0
                                            ? SectionData.attributeData.widgetData.datasetProperties.demographic_filter.map((item, index) => (
                                                <div key={index}>
                                                    {item.questionValue}: {item.responses.map((res) => res.responseValue).join(", ")}
                                                </div>
                                            ))
                                            : '-'
                                }
                            </td>
                        </tr>
                        <tr>
                            <td className='text-center'>5</td>
                            <td>Managers</td>
                            <td>
                                {
                                    SectionData?.attributeData?.widgetData?.IRdatasetProperties?.managers?.length > 0
                                        ? SectionData.attributeData.widgetData.IRdatasetProperties.managers.map((item, index) => (
                                            <div key={index}>{item}</div>
                                        ))
                                        : SectionData?.attributeData?.widgetData?.datasetProperties?.managers?.length > 0
                                            ? SectionData.attributeData.widgetData.datasetProperties.managers.map((item, index) => (
                                                <div key={index}>{item}</div>
                                            ))
                                            : '-'
                                }
                            </td>
                        </tr>
                        <tr>
                            <td className='text-center'>6</td>
                            <td>Manager Reportees</td>
                            <td>
                                {
                                    SectionData?.attributeData?.widgetData?.datasetProperties?.manager_reportees ||
                                    SectionData?.attributeData?.widgetData?.IRdatasetProperties?.manager_reportees ||
                                    '-'
                                }
                            </td>
                        </tr>
                    </tbody>
                </table>

            </div>
        </>
    );
};





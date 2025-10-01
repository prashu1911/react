import React from 'react';

export default function ReferenceDataAggregateUserTable({SectionData}) {
  return (
    <>
        {/* Reference data aggregate user table */}
        <h4 className='reportSubTitle mb-3 pt-2'>Reference Data Properties</h4>
        <div className="table-responsive datatable-wrap">

            {SectionData?.attributeData?.widgetData?.referenceDataProperties?.map((item,)=>{
                return(
                    <>
                    <h6>{item?.dataset_name}</h6>
            <table className="table reportTable withBorder">
                <thead>
                    <tr>
                        <th className='w-1 text-center'>S.No.</th>
                        <th className='min-w-220'>Data Point</th>
                        <th className='min-w-300'>Filter</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className='text-center'>1</td>
                        <td>Department</td>
                        <td>{item?.departments?.join(", ")}</td>
                    </tr>
                    <tr>
                        <td className='text-center'>2</td>
                        <td>Participant</td>
                        <td>{item?.participants?.join(", ")}</td>
                    </tr>
                    <tr>
                        <td className='text-center'>3</td>
                        <td>Demographic Question</td>
                        <td>{item?.demographic_filter?.map((data, key) => (
    <div key={key}>
      {data.questionValue}: {data.responses.map((res) => res.responseValue).join(", ")}
    </div>
  ))}</td>
                    </tr>
                </tbody>
            </table>
                    </>
                )
            })}
        </div>
    </>
  );
};
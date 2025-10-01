import React from 'react';
import { Breadcrumb} from './../../../../../components';
import adminRouteMap from '../../../../../routes/Admin/adminRouteMap';
import GenerateCardCenter from '../GenerateCardCenter';
import { Link } from 'react-router-dom';

function ReportPreview(){

    // breadcrumb
    const breadcrumb = [
        {
        path: "#!",
        name: "Intelligent Report",
        },
        
        {
        path: `${adminRouteMap.REPORTGENERATOR.path}`,
        name: "Report Generator",
        },
        {
            path: "#",
            name: "Report Preview",
        },
    ]
    return (
        <>
           {/* head title start */}
           <section className="commonHead">
                <h1 className='commonHead_title'>Welcome Back!</h1>
                <Breadcrumb breadcrumb={breadcrumb} />
            </section>
            {/* head title end */}
            <div className="pageContent reportGenerator reportPreview">
                <div className="pageTitle d-flex align-items-center justify-content-between flex-wrap">
                    <div className="d-flex align-items-center">
                        <Link to={adminRouteMap.REPORTGENERATOR.path} className='backLink'><em className='icon-back'></em></Link>
                        <h2 className='mb-0'>Report Preview</h2>
                    </div>
                    <ul className='list-inline mb-0 filter_action '>
                        <li><Link className="btn-icon "><em className="icon-download"></em></Link></li>
                    </ul>
                </div>
                <GenerateCardCenter hasActionPlan={false}/>
            </div>
        </>
    );
}

export default ReportPreview
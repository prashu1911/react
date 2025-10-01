import React from "react";
import { Accordion} from "react-bootstrap";
import { Link } from "react-router-dom";
import { Breadcrumb, Button} from "../../../../../components";
import adminRouteMap from "../../../../../routes/Admin/adminRouteMap";
import Departments from "./Departments";
import DemographicFilterQuestions from "./DemographicFilterQuestions";
import Outcomes from "./Outcomes";
import SurveyassessmentQuestions from "./SurveyassessmentQuestions";

export default function ComparativeAnalysisDataHarmonization() {
    // breadcrumb
    const breadcrumb = [
        {
          path: "#!",
          name: "Analytics",
        },
        
        {
          path: "#!",
          name: "Comparative Analysis",
        },
        {
            path: "#",
            name: "Data Harmonization",
          },
    ];
    return (
        <>
        {/* head title start */}
        <section className="commonHead">
            <h1 className='commonHead_title'>Welcome Back!</h1>
            <Breadcrumb breadcrumb={breadcrumb} />
        </section>
        {/* head title end */}
        <div className="pageContent HarmonizationPage">
            <div className="pageTitle d-flex align-items-center">
                <Link to={adminRouteMap.COMPARATIVEANALYSIS.path} className='backLink'><em className='icon-back' /></Link>
                <h2 className='mb-0'>Comparative Analysis Data Harmonization</h2>
            </div>
            <Accordion defaultActiveKey={['0']} alwaysOpen className="dataAccordion">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>DEPARTMENTS</Accordion.Header>
                    <Accordion.Body>
                        <Departments />
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>DEMOGRAPHIC FILTER QUESTIONS</Accordion.Header>
                    <Accordion.Body>
                        <DemographicFilterQuestions/>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                    <Accordion.Header>OUTCOMES</Accordion.Header>
                    <Accordion.Body>
                        <Outcomes />
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="3" className="mb-3">
                    <Accordion.Header>SURVEY/ASSESSMENT QUESTIONS</Accordion.Header>
                    <Accordion.Body>
                        <SurveyassessmentQuestions />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            <div className="d-flex justify-content-end gap-2 pt-lg-1 flex-wrap">
                <Button variant="secondary" className="ripple-effect">Save</Button>
                <Link to={adminRouteMap.COMPARATIVEANALYSIS.path} className="btn btn-primary ripple-effect">Save and Go to Charting</Link>
            </div>
        </div>
        </>
    );
}
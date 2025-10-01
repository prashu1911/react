import React, { useEffect, useState } from 'react';
import { Form, Nav, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { commonService } from 'services/common.service';
import { Participant } from 'apiEndpoints/Participant';
import { useAuth } from 'customHooks';
import { Button, SelectField } from '../../../components';
import participantRouteMap from '../../../routes/Participant/participantRouteMap';
import InputField from '../../../components/Input';


function MySurvey() {
    const companyOptions = [
        { value: '10', label: '10' },
        { value: '20', label: '20' },
        { value: '30', label: '30' }
    ]


    const { getloginUserData } = useAuth();
    const userData = getloginUserData();

    const [mySurvey, setMySurvey] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');


    const fetchParticipantSurvey = async () => {

        try {
            const response = await commonService({
                apiEndPoint: Participant.assessmentList,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userData?.apiToken}`,
                },
            });
            if (response?.status) {
                setMySurvey(response.data);
                


            }
        } catch (error) {
            console.error("Error fetching outcomes:", error);
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filterByStatus = (surveys, status) => {
        if (!surveys) return [];
        return surveys.filter(survey => survey.completion_status === status);
    };

    const getNewlyAddedSurveys = () => {
        return filterByStatus(mySurvey?.assessment_list, 'Newly Added')
            .filter(survey => survey.assessment_name.toLowerCase().includes(searchTerm.toLowerCase()));
    };

    const getInProgressSurveys = () => {
        return filterByStatus(mySurvey?.assessment_list, 'In Progress')
            .filter(survey => survey.assessment_name.toLowerCase().includes(searchTerm.toLowerCase()));
    };

    const getCompletedSurveys = () => {
        return filterByStatus(mySurvey?.assessment_list, 'Completed')
            .filter(survey => survey.assessment_name.toLowerCase().includes(searchTerm.toLowerCase()));
    };

    const getAllSurveys = () => {
        return mySurvey?.assessment_list?.filter(survey =>
            survey.assessment_name.toLowerCase().includes(searchTerm.toLowerCase())
        ) || [];
    };

    const getSurveysByTabKey = (tabKey) => {
        switch (tabKey) {
            case 'newlyadded':
                return getNewlyAddedSurveys();
            case 'inprogress':
                return getInProgressSurveys();
            case 'completed':
                return getCompletedSurveys();
            default:
                return getAllSurveys();
        }
    };

    useEffect(() => {
        fetchParticipantSurvey();
    }, []);
    return (
        <>
            <section className="commonBanner position-relative">
                <div className="container">
                    <div className="commonBanner_inner">
                        <h1 className="mb-3">My <span>Survey</span> </h1>
                    </div>
                </div>
            </section>
            <section className="cardSec">
                <div className="container">
                    <div className="commonFilter">
                        <Tab.Container defaultActiveKey="allsurvey">
                            <div className="d-md-flex align-items-center justify-content-between commonFilter_tabs">
                                <Nav className='pb-md-0 pb-1'>
                                    <Nav.Item>
                                        <Nav.Link eventKey="allsurvey">All Survey</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="newlyadded">Newly Added</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="inprogress">In Progress</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="completed">Completed</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                                <Form>
                                    <div className="searchBar">
                                        <InputField
                                            type="text"
                                            placeholder="Search"
                                            value={searchTerm}
                                            onChange={handleSearch}
                                        />
                                    </div>
                                </Form>
                            </div>
                            <Tab.Content>
                                {['allsurvey', 'newlyadded', 'inprogress', 'completed'].map((tabKey) => (
                                    <Tab.Pane eventKey={tabKey} key={tabKey}>
                                        {getSurveysByTabKey(tabKey).map((survey, index) => (
                                            <div className="surveyCards" key={index}>
                                                <div className="surveyCards_inner d-flex justify-content-between">
                                                    <div className="surveyCards_left">
                                                        <h3>{survey.assessment_name}</h3>
                                                        <ul className="list-unstyled mb-sm-0">
                                                            <li>Company: <span>{survey.company_name}</span></li>
                                                            <li>Department: <span>{survey.department_name}</span></li>
                                                        </ul>
                                                    </div>
                                                    <div className="surveyCards_right">
                                                        <p>Assigned Date: {new Date(survey.assigned_at).toLocaleDateString()}</p>
                                                        <span>{survey.completion_percentage}%</span>
                                                        <p className="mb-0">Completed</p>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                                                    <div className='d-flex align-items-center'>
                                                        <p className={`surveyCards_progress ${survey.completion_status.toLowerCase().replace(' ', '')}`}>
                                                            {survey.completion_status}
                                                        </p>
                                                        {survey.completion_status === "In Progress" && (
                                                            <Button variant="primary ripple-effect">Continue <em className="btn-icon right icon-arrow-next" /></Button>
                                                        )}
                                                        {survey.completion_status === "Completed" && (
                                                            <Button className="ripple-effect btn btn-success ms-lg-4 ms-2">View Response <em className="btn-icon right icon-arrow-next" /></Button>
                                                        )}
                                                    </div>
                                                    {survey.completion_status === "Completed" && (
                                                        <div className='d-flex gap-2 flex-wrap'>
                                                            <Link to={participantRouteMap.DETAILEDREPORT.path} className="btn btn-primary ripple-effect">
                                                                Detailed Report <em className="btn-icon right icon-arrow-next" />
                                                            </Link>

                                                            <Link to={participantRouteMap.SUMMARYREPORT.path} className="btn btn-primary ripple-effect">
                                                                Summary Report <em className="btn-icon right icon-arrow-next" />
                                                            </Link>

                                                        </div>
                                                    )}
                                                    {survey.completion_status === "Newly Added" && (
                                                        <Link to={participantRouteMap.TAKESURVEY.path} className="ripple-effect btn btn-primary">
                                                            Start Survey <em className="btn-icon right icon-arrow-next" />
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </Tab.Pane>
                                ))}
                            </Tab.Content>
                        </Tab.Container>
                        <div className="commonFilter_sort d-flex align-items-center justify-content-sm-between justify-content-center">
                            <div className="commonFilter_sort_search d-flex align-items-center justify-content-center">
                                <p>Entries Per Page</p>
                                <SelectField id="pagination" className="mx-2 selectPicker " placeholder="10" options={companyOptions} />
                                <p>Showing 1 to 3 of 3 Entries</p>
                            </div>
                            <div className="commonFilter_sort_pagination d-flex align-items-center justify-content-center">
                                <div className="btn-group" aria-label="Basic outlined example">
                                    <button type="button" className="btn btn-outline-secondary">First</button>
                                    <button type="button" className="btn btn-outline-secondary">Previous</button>
                                    <button type="button" className="btn btn-outline-secondary active">1</button>
                                    <button type="button" className="btn btn-outline-secondary">Next</button>
                                    <button type="button" className="btn btn-outline-secondary">Last</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );

}



export default MySurvey;

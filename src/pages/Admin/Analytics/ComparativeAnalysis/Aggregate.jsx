import React, {useState } from "react";
import { Col, Collapse, Form, Row} from 'react-bootstrap';
import { Link } from "react-router-dom";
import {Button, DataTableComponent, ModalComponent, SelectField } from "../../../../components";
import DemographicsData from './json/DemographicsData.json';
import EndedStartData from './json/EndedStartData.json';
import OutcomesQuetionsData from './json/OutcomesQuetionsData.json';
import ReportOptions from "./CollapseFilterOptions/ReportOptions";
import ChartOptions from "./CollapseFilterOptions/ChartOptions";
import ReferenceDataOptions from "./CollapseFilterOptions/ReferenceDataOptions";
import CommonSelectField from "./CollapseFilterOptions/CommonSelectField";
import { departmentOptions, participantOptions, managerOptions, genderOptions, ageOptions, tenureOptions, locationOptions, roleOptions, benchmarkOptions, savedOptions, referenceOptions } from "./CollapseFilterOptions/CommonSelectFieldOptions";

export default function Aggregate() {
  // collapse
  const [aggregateCollapse, setAggregateCollapse] = useState(null);
  const toggleCollapse = (collapseId) => {
      setAggregateCollapse(aggregateCollapse === collapseId ? null : collapseId);
  };
  // create dataset modal
  const [questions, setQuestions] = useState(false);
  const questionsClose = () => setQuestions(false);
  const questionsShow = () => setQuestions(true);

  // data table
  const demographicsColumns = [
    {
        title: 'S.No.',
        dataKey: 'number',
        columnHeaderClassName: "no-sorting ",

    },
    {
        title: 'Questions',
        dataKey: 'questions',
        columnHeaderClassName: "no-sorting",
    }
  ]
  const endedStartColumns = [
    {
        title: 'S.No.',
        dataKey: 'number',
        columnHeaderClassName: "no-sorting",

    },
    {
        title: 'Questions',
        dataKey: 'questions',
        columnHeaderClassName: "no-sorting",
        columnClassName: "wh-space-normal",
    }
  ]
  const outcomesQuetionsColumns = [
    {
        title: 'S.No.',
        dataKey: 'number01',
        columnHeaderClassName: "no-sorting",

    },
    {
        title: 'Outcomes',
        dataKey: 'outcomes',
        columnHeaderClassName: "no-sorting",
    },
    {
      title: 'S.No.',
      dataKey: 'number02',
      columnHeaderClassName: "no-sorting",

    },
    {
        title: 'Questions',
        dataKey: 'questions',
        columnHeaderClassName: "no-sorting",
        columnClassName: "wh-space-normal",
    }
  ]

  return (
    <>
    <div className="d-flex align-items-center justify-content-between flex-wrap mb-4 gap-2">
      <ul className="collapseList list-inline d-flex align-items-center gap-2 mb-0 pb-lg-0 pb-1 collapseBtn">
        <li>
          <Link href="#!" aria-controls="aggregateFilter" onClick={() => toggleCollapse('aggregateFilter')} aria-expanded={aggregateCollapse === 'aggregateFilter'} className="btn btn-light gap-2 collapseArrow">
            <span>Filter</span>
            <em className="icon icon-drop-down" />
          </Link>
        </li>
        <li>
          <Link href="#!" aria-controls="quickCompare" onClick={() => toggleCollapse('quickCompare')} aria-expanded={aggregateCollapse === 'quickCompare'} className="btn btn-light gap-2 collapseArrow">
            <span>Quick Compare</span>
            <em className="icon icon-drop-down" />
          </Link>
        </li>
        <li>
          <Link href="#!" aria-controls="composite" onClick={() => toggleCollapse('composite')} aria-expanded={aggregateCollapse === 'composite'} className="btn btn-light gap-2 collapseArrow">
            <span>Composite</span>
            <em className="icon icon-drop-down" />
          </Link>
        </li>
        <li>
          <Link href="#!" aria-controls="referenceData" onClick={() => toggleCollapse('referenceData')} aria-expanded={aggregateCollapse === 'referenceData'} className="btn btn-light gap-2 collapseArrow">
            <span>Reference Data</span>
            <em className="icon icon-drop-down" />
          </Link>
        </li>
        <li>
          <Link href="#!" aria-controls="reports" onClick={() => toggleCollapse('reports')} aria-expanded={aggregateCollapse === 'reports'} className="btn btn-light gap-2 collapseArrow">
            <span>Reports</span>
            <em className="icon icon-drop-down" />
          </Link>
        </li>
      </ul>
      <ul className="list-inline d-flex align-items-center filter_action mb-0 flex-wrap collapseBtn">
        <li>
          <Link href="#!" aria-controls="chartOptions" onClick={() => toggleCollapse('chartOptions')} aria-expanded={aggregateCollapse === 'chartOptions'} className="btn btn-light gap-2 bg-toggleSky">
            <span>Chart Options</span>
            <em className="icon icon-drop-down" />
          </Link>
        </li>
        <li>
          <Link href="#!" className="btn btn-light ripple-effect" onClick={questionsShow}>Questions</Link>
        </li>
        <li>
          <Link href="#!" className=" btn-icon ripple-effect"><em className="icon-download" /></Link>
        </li>
        <li>
          <Link href="#!" className=" btn-icon ripple-effect"><em className="icon-exchange" /></Link>
        </li>
        <li>
          <Link href="#!" className=" btn-icon ripple-effect"><em className="icon-arrows-move" /></Link>
        </li>
      </ul>
    </div>
    <Collapse in={aggregateCollapse === 'chartOptions'}>
      <Form>
        <ChartOptions switchAxixButtonShow={true}/>
      </Form>
    </Collapse>
    <Collapse in={aggregateCollapse === 'aggregateFilter'}>
        <Form>
          <div className="formCard">
            <Row className="gx-2">
                <CommonSelectField
                departmentOptions={departmentOptions}
                participantOptions={participantOptions}
               
              />
              <Col xxl={3} lg={4} sm={6}>
                <Form.Group className="form-group">
                  <Form.Label>Saved Filtered Subsets</Form.Label>
                  <SelectField placeholder="Select Saved Filtered Subsets" options={savedOptions}/>
                </Form.Group>
              </Col>
              <Col xs={12} className="align-self-end mt-3">
                <Form.Group className="form-group d-flex gap-2 justify-content-end flex-wrap">
                  <Button variant="secondary" className="ripple-effect gap-2"><em className="icon-clear" /><span>Clear</span></Button>
                  <Button variant="warning" className="ripple-effect gap-2 flex-shrink-0"><em className="icon-bookmark-check" /><span>Save Filter Subset</span></Button>
                  <Button variant="primary" className="ripple-effect gap-2"><em className="icon-run" /><span>Run</span></Button>
                </Form.Group>
              </Col>
            </Row>
          </div>
        </Form>
    </Collapse>
    <Collapse in={aggregateCollapse === 'quickCompare'}>
        <Form>
          <div className="formCard">
            <Row className="gx-2">
              <Col xxl={3} lg={4} sm={6}>
                <Form.Group className="form-group">
                  <Form.Label className="d-flex align-items-center gap-2">
                    Departments
                    <Form.Check className='mb-1' type="checkbox" label={<div className="primary-color" />}/>
                  </Form.Label>
                  <SelectField placeholder="Select Department" isMulti options={departmentOptions} />
                </Form.Group>
              </Col>
              <Col xxl={3} lg={4} sm={6}>
                <Form.Group className="form-group">
                  <Form.Label className="d-flex align-items-center gap-2">
                    Participants
                    <Form.Check className='mb-1' type="checkbox" label={<div className="primary-color" />}/>
                  </Form.Label>
                  <SelectField placeholder="Select Participant" isMulti options={participantOptions}/>
                </Form.Group>
              </Col>
              <Col xxl={3} lg={4} sm={6}>
                <Form.Group className="form-group">
                  <Form.Label className="d-flex align-items-center gap-2">
                    Managers
                    <Form.Check className='mb-1' type="checkbox" label={<div className="primary-color" />}/>
                  </Form.Label>
                  <SelectField placeholder="Select Manager" isMulti options={managerOptions}/>
                </Form.Group>
              </Col>
              <Col xxl={3} lg={4} sm={6}>
                <Form.Group className="form-group">
                  <Form.Label className="d-flex align-items-center gap-2">
                    Reference Data
                    <Form.Check className='mb-1' type="checkbox" label={<div className="primary-color" />}/>
                  </Form.Label>
                  <SelectField placeholder="Select Reference Data" isMulti options={referenceOptions}/>
                </Form.Group>
              </Col>
              <Col xxl={3} lg={4} sm={6}>
                <Form.Group className="form-group">
                  <Form.Label className="d-flex align-items-center gap-2">
                    Gender
                    <Form.Check className='mb-1' type="checkbox" label={<div className="primary-color" />}/>
                  </Form.Label>
                  <SelectField placeholder="Select Gender" isMulti options={genderOptions}/>
                </Form.Group>
              </Col>
              <Col xxl={3} lg={4} sm={6}>
                <Form.Group className="form-group">
                  <Form.Label className="d-flex align-items-center gap-2">
                    Tenure
                    <Form.Check className='mb-1' type="checkbox" label={<div className="primary-color" />}/>
                  </Form.Label>
                  <SelectField placeholder="Select Tenure" isMulti options={tenureOptions}/>
                </Form.Group>
              </Col>
              <Col xxl={3} lg={4} sm={6}>
                <Form.Group className="form-group">
                  <Form.Label className="d-flex align-items-center gap-2">
                    Office Location
                    <Form.Check className='mb-1' type="checkbox" label={<div className="primary-color" />}/>
                  </Form.Label>
                  <SelectField placeholder="Select Location" isMulti options={locationOptions}/>
                </Form.Group>
              </Col>
              <Col xxl={3} lg={4} sm={6}>
                <Form.Group className="form-group">
                  <Form.Label className="d-flex align-items-center gap-2">
                    Role
                    <Form.Check className='mb-1' type="checkbox" label={<div className="primary-color" />}/>
                  </Form.Label>
                  <SelectField placeholder="Select Role" isMulti options={roleOptions}/>
                </Form.Group>
              </Col>
              <Col xxl={3} lg={4} sm={6}>
                <Form.Group className="form-group">
                  <Form.Label className="d-flex align-items-center gap-2">
                    Age
                    <Form.Check className='mb-1' type="checkbox" label={<div className="primary-color" />}/>
                  </Form.Label>
                  <SelectField placeholder="Select Age" isMulti options={ageOptions}/>
                </Form.Group>
              </Col>
              <Col xxl={3} lg={4} sm={6}>
                <Form.Group className="form-group">
                  <Form.Label className="pb-1">Saved Quick Compare View</Form.Label>
                  <SelectField placeholder="Select Saved Quick Compare View" options={savedOptions}/>
                </Form.Group>
              </Col>
              <Col xs={12} className="align-self-end mt-3">
                <Form.Group className="form-group d-flex gap-2 justify-content-end flex-wrap">
                  <Button variant="secondary" className="ripple-effect gap-2"><em className="icon-clear" /><span>Clear</span></Button>
                  <Button variant="warning" className="ripple-effect gap-2 flex-shrink-0"><em className="icon-bookmark-check" /><span>Save Filter Subset</span></Button>
                  <Button variant="primary" className="ripple-effect gap-2"><em className="icon-run" /><span>Run</span></Button>
                </Form.Group>
              </Col>
            </Row>
          </div>
        </Form>
    </Collapse>
    <Collapse in={aggregateCollapse === 'composite'}>
        <Form>
          <div className="formCard">
            <Row className="gx-2">
                <CommonSelectField
                departmentOptions={departmentOptions}
                participantOptions={participantOptions}
               
              />
              <Col xxl={3} lg={4} sm={6}>
                <Form.Group className="form-group">
                  <Form.Label>Benchmark</Form.Label>
                  <SelectField placeholder="Select Benchmark" isMulti options={benchmarkOptions}/>
                </Form.Group>
              </Col>
              <Col xxl={3} lg={4} sm={6}>
                <Form.Group className="form-group">
                  <Form.Label>Saved Composite View</Form.Label>
                  <SelectField placeholder="Select Saved Composite View " options={savedOptions}/>
                </Form.Group>
              </Col>
              <Col xs={12} className="align-self-end mt-3">
                <Form.Group className="form-group d-flex gap-2 justify-content-end flex-wrap">
                  <Button variant="secondary" className="ripple-effect gap-2"><em className="icon-clear" /><span>Clear</span></Button>
                  <Button variant="warning" className="ripple-effect gap-2 flex-shrink-0"><em className="icon-bookmark-check" /><span>Save Filter Subset</span></Button>
                  <Button variant="primary" className="ripple-effect gap-2"><em className="icon-run" /><span>Run</span></Button>
                </Form.Group>
              </Col>
            </Row>
          </div>
        </Form>
    </Collapse>
    <Collapse in={aggregateCollapse === 'referenceData'}>
        <Form>
          <ReferenceDataOptions/>
        </Form>
    </Collapse>
    <Collapse in={aggregateCollapse === 'reports'}>
        <Form>
          <ReportOptions/>
        </Form>
    </Collapse>
    {/* view All questins modal */}
    <ModalComponent modalHeader="Questions by Outcomes" extraBodyClassName = "modalBody" size="xl" show={questions} onHandleCancel={questionsClose}>
      <h4 className="h6 mb-3 fw-semibold">Demographics</h4>
      <DataTableComponent showFooter={false} data={DemographicsData} columns={demographicsColumns} />
      <h4 className="h6 mb-3 fw-semibold">Open-Ended Start</h4>
      <DataTableComponent showFooter={false} data={EndedStartData} columns={endedStartColumns} />
      <DataTableComponent showFooter={false} data={OutcomesQuetionsData} columns={outcomesQuetionsColumns} />
    </ModalComponent>
    </>
  )
};
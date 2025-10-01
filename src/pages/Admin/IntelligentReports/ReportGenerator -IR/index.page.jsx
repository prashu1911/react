import React, { useEffect, useState } from 'react';
import ResponseRate from './form/ResponseRate';
import HeatMap from './form/HeatMap';
import WordCloud from './form/WordCloud';
import SupportingDocuments from './form/SupportingDocuments';
import OpenEndResponses from './form/OpenEndedResponses';
import { Breadcrumb, Button, DataTableComponent, ModalComponent, SelectField, SweetAlert, TextEditor } from '../../../../components';
import {Form, Col, Row, Collapse, Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ReportManageDatasetData from './json/ReportManageDatasetData.json';
import ReportDatasetFilterData from './json/ReportDatasetFilterData.json';
import GenerateCardCenter from './GenerateCardCenter';
import LogoReportTitle from './form/LogoReportTitle';
import ResponseRateResponsesByDay from './form/ResponseRateResponsesByDay';
import DimensionItemSummary from './form/DimensionItemSummary';
import EngagementIndex from './form/EngagementIndex';
import KeyDriversEngagement from './form/KeyDriversEngagement';
import EquipFactors from './form/EquipFactors';
import ManagerEffectiveness from './form/ManagerEffectiveness';
import ActionItemPlanner from './form/ActionItemPlanner';
import adminRouteMap from '../../../../routes/Admin/adminRouteMap';
import DimensionItemControlPanelTable from './ReportDataTable/DimensionItemControlPanelTable';

export default function ReportGeneratorIR() {
    // breadcrumb
    const breadcrumb = [
        {
            path: "#!",
            name: "Intelligent Report",
        },
        
        {
            path: "#",
            name: "Report Generator IR",
        },
    ];
    //--collapse--
    const [open, setOpen] = useState(false);
    const [commonCollapse, setCommonCollapse] = useState(null);
    const commonToggleCollapse = (collapseId) => {
        setCommonCollapse(commonCollapse === collapseId ? null : collapseId);
        setIsCollapsed2(false);
    };

    //generatedCard collapse (left & right cards)
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isCollapsed2, setIsCollapsed2] = useState(false);

    const handleCollapse = (setter) => {
        if (window.innerWidth > 991) setter(prev => !prev);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 991) {
                setIsCollapsed(false);
                setIsCollapsed2(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    //--end collpase--

    const [CompaniesList, setCompaniesList] = useState([])
    const [SelectedCompany, setSelectedCompany] = useState(null);
    const [AssessmentList, setAssessmentList] = useState([])
    const [SelectedAssessment, setSelectedAssessment] = useState(null)

    const fetchCompanies = async () => {
        try {
          const response = await commonService({
            apiEndPoint: {
              url: "http://vysakh.metoliusapi.com/v1/Report/company?masterCompanyID=1",
              method: "GET",
            },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userData?.apiToken}`,
            },
          });
          if (response?.status) {
            console.log('compines',response.data.data);
            setCompaniesList(response.data.data.map(company => ({
                value: company.companyID, 
                label: company.comapnyName  // Fix typo: comapnyName → companyName
            })));
          }
        } catch (error) {
          console.error("Error fetching elements:", error);
        }
      };
      const fetchAssessment = async (companyID) => {
        try {
          const response = await commonService({
            apiEndPoint: {
              url: `http://vysakh.metoliusapi.com/v1/AssessmentChart?action=assessment_list&companyID=${companyID.value}`,
              method: "GET",
            },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userData?.apiToken}`,
            },
          });
          if (response?.status) {
            console.log('fetchAssessment',response.data.data);
            setAssessmentList(response.data.data.map(company => ({
              value: company.assessment_id, 
              label: company.assessment_name  
          })));
          }
        } catch (error) {
          console.error("Error fetching elements:", error);
        }
      };
    
      useEffect(() => {
        fetchCompanies()
      }, [])
      useEffect(() => {
        if (SelectedCompany) {
          setAssessmentList([])
          setSelectedAssessment(null)
          setDatasetList([])
          
          fetchAssessment(SelectedCompany)
        }
      }, [SelectedCompany])

    //--delete alert modal--
    const [isAlertVisible, setIsAlertVisible] = useState(false);
   
    const onConfirmAlertModal = () => {
        setIsAlertVisible(true);
        return true;
    };
    const deleteModal = () => {
        setIsAlertVisible(true);
    }
    // benchmark Options
    const benchmarkOptions = [
        { value: 'WSA 2024 Overall', label: 'WSA 2024 Overall' },
        { value: 'Administrative, Support, Waste Management and Remediation Services', label: 'Administrative, Support, Waste Management and Remediation Services' },
        { value: 'Agriculture, Fishing and Hunting', label: 'Agriculture, Fishing and Hunting' }, 
        { value: 'Arts, Entertainment, and Recreation', label: 'Arts, Entertainment, and Recreation' },  
        { value: 'Banking Only (No Insurance)', label: 'Banking Only (No Insurance)' }  
    ]
    // company options
    const companyOptions = [
        { value: 'Codiant Software Technologies', label: 'Codiant Software Technologies' },
        { value: 'Test', label: 'Test' },
        { value: 'Test02', label: 'Test02' }  
    ]
    //assessment Options
    const assessmentOptions = [
        { value: 'Employee Assessment', label: 'Employee Assessment' },
        { value: 'Auditors', label: 'Auditors' },
        { value: 'June Assessment', label: 'June Assessment' }  
    ]
    //template Options
    const templateOptions = [
        { value: 'test1', label: 'test1' },
        { value: 'Test24', label: 'Test24' } 
    ]
    //dataset Options
    const datasetOptions = [
        { value: 'HR Dataset', label: 'HR Dataset' }
    ]
    //template Options
    const reportOptions = [
        { value: 'Test10', label: 'Test10' },
        { value: 'Test2024', label: 'Test2024' }
    ]

    //Dimension Item Control panel modal
    const [showDimensionItemControl, setShowDimensionItemControl] = useState(false);
    const dimensionItemControlClose = () => setShowDimensionItemControl(false);
    const dimensionItemControlShow = () => setShowDimensionItemControl(true);

    //manage dataset modal
    const [showManageDataset, setShowManageDataset] = useState(false);
    const manageDatasetClose = () => setShowManageDataset(false);
    const manageDatasetShow = () => setShowManageDataset(true);

    //Benchmark Configuration modal
    const [benchmarkControl, setBenchmarkControl] = useState(false);
    const benchmarkClose = () => setBenchmarkControl(false);
    const benchmarkShow = () => setBenchmarkControl(true);

    //Move Widget modal
    const [moveWidgetControl, setMoveWidgetControl] = useState(false);
    const moveWidgetClose = () => setMoveWidgetControl(false);
    const moveWidgetShow = () => setMoveWidgetControl(true);

    // datasets filter modal
    const [showDatasetFilter, setShowDatasetFilter] = useState(false);
    const datasetFilterClose = () => {
        setShowDatasetFilter(false);
        setShowManageDataset(true);
    }
    const datasetFilterShow = () => {
        setShowDatasetFilter(true);
        setShowManageDataset(false);
    }
    //Information/Commentary/Title Block modal
    const [showInfoGraphic, setShowInfoGraphic] = useState(false);
    const infoGraphicClose = () => setShowInfoGraphic(false);
    const infoGraphicShow = () => setShowInfoGraphic(true);

    //data table
    const reportManageDatasetColumns = [
        { 
            title: 'S.No.', 
            dataKey: 'no',
            columnHeaderClassName: "no-sorting w-1 text-center",
        
        },
        { 
            title: 'Dataset Name', 
            dataKey: 'datasetName',
            columnHeaderClassName: "no-sorting",
        },
        { 
            title: 'Action', 
            dataKey: 'action',
            columnHeaderClassName: "no-sorting",
            render: (data, row) => {
                return (
                    <ul className="list-inline action mb-0">
                        <li className="list-inline-item">
                            <Link to="#!" className="icon-primary" onClick={datasetFilterShow}>
                                <em className="icon-eye"></em>
                            </Link>
                        </li>
                        <li className="list-inline-item">
                            <Link to="#!" className="icon-danger" onClick={deleteModal}>
                                <em className="icon-delete"></em>
                            </Link>
                        </li>
                    </ul>
                );
            }
        }
    ];
    const reporDatasetFilterColumns = [
        { 
            title: 'S.No.', 
            dataKey: 'number',
            columnHeaderClassName: "no-sorting w-1 text-center",
        
        },
        { 
            title: 'Data Point', 
            dataKey: 'dataPoint',
            columnHeaderClassName: "no-sorting",
        },
        { 
            title: 'Filter', 
            dataKey: 'filter',
            columnHeaderClassName: "no-sorting min-w-220",
            columnClassName:"text-wrap",
        }
    ];
    return (
        <>
        {/* head title start */}
        <section className="commonHead">
            <h1 className='commonHead_title'>Welcome Back!</h1>
            <Breadcrumb breadcrumb={breadcrumb} />
        </section>
        {/* head title end */}
        <div className="collpseFilter">
            <div className="pageTitle d-flex align-items-center justify-content-between collpseFilter_title mb-0" onClick={() => setOpen(!open)} aria-controls="reportGen-collapse" aria-expanded={open}>
                <h2 className="mb-0">Report Generator</h2>
                <em className="icon-drop-down toggleIcon"></em>
            </div>
            <Collapse in={open}>
            <div id="reportGen-collapse">
                <Form className='formCard bg-transparent m-0'>
                    <div className="d-flex align-items-end flex-wrap gap-2">
                        <Row className='g-2 flex-grow-1 w-row' xs={1} sm={2} md={3} xxl={5}>
                            <Col>
                                <Form.Group className="form-group mb-0" >
                                    <Form.Label>Company</Form.Label>
                                    <SelectField onChange={setSelectedCompany} placeholder="Select Company" options={CompaniesList}/>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="form-group mb-0" >
                                    <Form.Label>Survey</Form.Label>
                                    <SelectField onChange={setSelectedAssessment} placeholder="Select Survey" options={AssessmentList}/>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="form-group mb-0" >
                                    <Form.Label>Template</Form.Label>
                                    <SelectField  placeholder="Select Template" options={templateOptions}/>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="form-group mb-0" >
                                    <div className="d-flex flex-wrap justify-content-between">
                                        <Form.Label className='w-auto'>Dataset</Form.Label>
                                        <Link onClick={manageDatasetShow} className='link-primary'>Manage</Link>
                                    </div>
                                    <SelectField  placeholder="Select Dataset" options={datasetOptions}/>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="form-group mb-0" >
                                    <Form.Label>Report</Form.Label>
                                    <SelectField  placeholder="Select Report" options={reportOptions}/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button variant="primary ripple-effect">Create Report</Button>
                    </div>
                </Form>
                </div>
            </Collapse>
        </div>
        <div className="pageContent reportGenerator">
            <ul className="list-unstyled d-flex align-items-center justify-content-end flex-wrap gap-2">
                <li>
                    <Dropdown className="commonDropdown" align={"end"}>
                        <Dropdown.Toggle >
                            <em className="icon-settings-outline"></em>
                        </Dropdown.Toggle>
                        <Dropdown.Menu >
                            <Link className='dropdown-item' to={adminRouteMap.CONFIGUREREPORTIR.path}><em className="icon icon-tool"></em>Configuration</Link>
                            <button  className='dropdown-item' onClick={benchmarkShow} type='button'><em className="icon icon-search-text"></em>Benchmark</button>
                            <button  className='dropdown-item' onClick={moveWidgetShow} type='button'><em className="icon icon-exchange-circle"></em>Move Widget</button>
                        </Dropdown.Menu>
                    </Dropdown>
                </li>
                <li><Link className="btn btn-primary ripple-effect" to={"#!"}><em className="icon-eye me-2"></em> Preview</Link></li>
                <li><Button variant="primary ripple-effect"><em className="icon-bookmark me-2"></em> Save Report</Button></li>
            </ul>
            <div className="generateCard">
                <div className="d-flex flex-lg-row flex-column generateCard_inner">
                    <div className={`generateCard_left ${isCollapsed ? 'collapsed' : ''}`}>
                        <Link className="reportCollapse d-flex align-items-center mb-xl-4 mb-lg-3">
                            <span className="iconCollapse flex-shrink-0" onClick={() => handleCollapse(setIsCollapsed)}><em className="icon icon-prev"></em></span>
                            <div className="reportTitle mb-0">
                                <span>Add Widget</span>
                                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Lorem, ipsum dolor.</Tooltip>}>
                                    <span className="d-inline-block">
                                        <em disabled style={{ pointerEvents: 'none' }} className="icon-info-circle fs-6 link-primary ms-2"></em>
                                    </span>
                                </OverlayTrigger>
                            </div>
                        </Link>
                        <div className="addWidget">
                            <ul className="collapseList list-inline d-flex flex-lg-column gap-3 mb-0 pb-lg-0 pb-1 flex-nowrap">
                                <li className="flex-shrink-0">
                                    <Link to="#!" className="collapseList_item" aria-controls="logoAndReportTitle" onClick={() => commonToggleCollapse('logoAndReportTitle')} aria-expanded={commonCollapse === 'logoAndReportTitle'}>
                                        <em className="icon icon-drag"></em>
                                        <span>Client Logo & Report Title</span>
                                    </Link>
                                </li>
                                <li className="flex-shrink-0">
                                    <Link to="#!" className="collapseList_item" aria-controls="responseRateResponsesByDay" onClick={() => commonToggleCollapse('responseRateResponsesByDay')} aria-expanded={commonCollapse === 'responseRateResponsesByDay'}>
                                        <em className="icon icon-drag"></em>
                                        <span>Response Rate and Responses by Day</span>
                                    </Link>
                                </li>
                                <li className="flex-shrink-0">
                                    <Link to="#!" className="collapseList_item" aria-controls="responseRate" onClick={() => commonToggleCollapse('responseRate')} aria-expanded={commonCollapse === 'responseRate'}>
                                        <em className="icon icon-drag"></em>
                                        <span>Response Rate</span>
                                    </Link>
                                </li>
                                <li className="flex-shrink-0">
                                    <Link to="#!" className="collapseList_item" aria-controls="dimensionItemSummary" onClick={() => commonToggleCollapse('dimensionItemSummary')} aria-expanded={commonCollapse === 'dimensionItemSummary'}>
                                        <em className="icon icon-drag"></em>
                                        <span>Dimension & Item Summary</span>
                                    </Link>
                                </li>
                                <li className="flex-shrink-0">
                                    <Link to="#!" className="collapseList_item" aria-controls="engagementIndex" onClick={() => commonToggleCollapse('engagementIndex')} aria-expanded={commonCollapse === 'engagementIndex'}>
                                        <em className="icon icon-drag"></em>
                                        <span>Engagement Index</span>
                                    </Link>
                                </li>
                                <li className="flex-shrink-0">
                                    <Link to="#!" className="collapseList_item" aria-controls="keyDriversEngagement" onClick={() => commonToggleCollapse('keyDriversEngagement')} aria-expanded={commonCollapse === 'keyDriversEngagement'}>
                                        <em className="icon icon-drag"></em>
                                        <span>Key Drivers of Engagement</span>
                                    </Link>
                                </li>
                                <li className="flex-shrink-0">
                                    <Link to="#!" className="collapseList_item" aria-controls="equipFactors" onClick={() => commonToggleCollapse('equipFactors')} aria-expanded={commonCollapse === 'equipFactors'}>
                                        <em className="icon icon-drag"></em>
                                        <span>Equip Factors</span>
                                    </Link>
                                </li>
                                <li className="flex-shrink-0">
                                    <Link to="#!" className="collapseList_item" aria-controls="managerEffectiveness" onClick={() => commonToggleCollapse('managerEffectiveness')} aria-expanded={commonCollapse === 'managerEffectiveness'}>
                                        <em className="icon icon-drag"></em>
                                        <span>Manager Effectiveness</span>
                                    </Link>
                                </li>
                                <li className="flex-shrink-0">
                                    <Link to="#!" className="collapseList_item" aria-controls="heatMap" onClick={() => commonToggleCollapse('heatMap')} aria-expanded={commonCollapse === 'heatMap'}>
                                        <em className="icon icon-drag"></em>
                                        <span>Heat Map</span>
                                    </Link>
                                </li>
                                <li className="flex-shrink-0">
                                    <Link to="#!" className="collapseList_item" aria-controls="wordCloud" onClick={() => commonToggleCollapse('wordCloud')} aria-expanded={commonCollapse === 'wordCloud'}>
                                        <em className="icon icon-drag"></em>
                                        <span>Word Cloud</span>
                                    </Link>
                                </li>
                                <li className="flex-shrink-0">
                                    <Link to="#!" className="collapseList_item" aria-controls="pageBreak" onClick={() => commonToggleCollapse('pageBreak')} aria-expanded={commonCollapse === 'pageBreak'}>
                                        <em className="icon icon-drag"></em>
                                        <span>Page Break</span>
                                    </Link>
                                </li>
                                <li className="flex-shrink-0">
                                    <Link to="#!" className="collapseList_item" aria-controls="informationCommentaryTitleBlock" onClick={() => commonToggleCollapse('informationCommentaryTitleBlock')} aria-expanded={commonCollapse === 'informationCommentaryTitleBlock'}>
                                        <em className="icon icon-drag"></em>
                                        <span>Information/Commentary/Title Block</span>
                                    </Link>
                                </li>
                                <li className="flex-shrink-0">
                                    <Link to="#!" className="collapseList_item" aria-controls="openEndedResponses" onClick={() => commonToggleCollapse('openEndedResponses')} aria-expanded={commonCollapse === 'openEndedResponses'}>
                                        <em className="icon icon-drag"></em>
                                        <span>Open-Ended Responses</span>
                                    </Link>
                                </li>
                                <li className="flex-shrink-0">
                                    <Link to="#!" className="collapseList_item" aria-controls="supportingDocuments" onClick={() => commonToggleCollapse('supportingDocuments')} aria-expanded={commonCollapse === 'supportingDocuments'}>
                                        <em className="icon icon-drag"></em>
                                        <span>Supporting Documents</span>
                                    </Link>
                                </li>
                                <li className="flex-shrink-0">
                                    <Link to="#!" className="collapseList_item" aria-controls="actionItemPlanner" onClick={() => commonToggleCollapse('actionItemPlanner')} aria-expanded={commonCollapse === 'actionItemPlanner'}>
                                        <em className="icon icon-drag"></em>
                                        <span>Action Item Planner</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <GenerateCardCenter/>
                    <div className={`generateCard_right ${isCollapsed2 ? 'collapsed2' : ''}`}>
                        <Link className="reportCollapse float-start">
                            <span className="iconCollapse" onClick={() => handleCollapse(setIsCollapsed2)}><em className="icon icon-prev"></em></span>
                        </Link>
                        <div className='collapsedForm'>
                            <Collapse in={commonCollapse === 'logoAndReportTitle'|| !commonCollapse}>
                                <Form>
                                    <div className="reportTitle align-items-center mb-0">
                                        <span>Report Title & Logo</span>
                                    </div>
                                    <LogoReportTitle/>
                                </Form>
                            </Collapse>
                            <Collapse in={commonCollapse === 'responseRateResponsesByDay'}>
                                <Form>
                                    <div className="reportTitle align-items-center mb-0 float-right">
                                        <span>Response Rate</span>
                                    </div>
                                    <ResponseRateResponsesByDay/>
                                </Form>
                            </Collapse>
                            <Collapse in={commonCollapse === 'responseRate'}>
                                <Form>
                                    <div className="reportTitle align-items-center mb-0 float-right">
                                        <span>Response Rate</span>
                                    </div>
                                    <ResponseRate/>
                                </Form>
                            </Collapse>
                            <Collapse in={commonCollapse === 'dimensionItemSummary'}>
                                <Form>
                                    <div className="reportTitle align-items-center mb-0 float-right">
                                        <span>Dimension & Item Summary</span>
                                    </div>
                                    <DimensionItemSummary dimensionItemControlShow={dimensionItemControlShow}/>
                                </Form>
                            </Collapse>
                            <Collapse in={commonCollapse === 'engagementIndex'}>
                                <Form>
                                    <div className="reportTitle align-items-center mb-0 float-right">
                                        <span>Engagement Index</span>
                                    </div>
                                    <EngagementIndex/>
                                </Form>
                            </Collapse>
                            <Collapse in={commonCollapse === 'keyDriversEngagement'}>
                                <Form>
                                    <div className="reportTitle align-items-center mb-0 float-right">
                                        <span>Key Drivers of Engagement</span>
                                    </div>
                                    <KeyDriversEngagement/>
                                </Form>
                            </Collapse>
                            <Collapse in={commonCollapse === 'equipFactors'}>
                                <Form>
                                    <div className="reportTitle align-items-center mb-0 float-right">
                                        <span>Equip Factors</span>
                                    </div>
                                    <EquipFactors/>
                                </Form>
                            </Collapse>
                            <Collapse in={commonCollapse === 'managerEffectiveness'}>
                                <Form>
                                    <div className="reportTitle align-items-center mb-0 float-right">
                                        <span>Manager Effectiveness</span>
                                    </div>
                                    <ManagerEffectiveness/>
                                </Form>
                            </Collapse>
                            <Collapse in={commonCollapse === 'heatMap'}>
                                <Form>
                                    <div className="reportTitle align-items-center mb-0 float-right">
                                        <span>Heat Map</span>
                                    </div>
                                    <HeatMap/>
                                </Form>
                            </Collapse>
                            <Collapse in={commonCollapse === 'wordCloud'}>
                                <Form>
                                    <div className="reportTitle align-items-center mb-0 float-right">
                                        <span>Word Cloud</span>
                                    </div>
                                    <WordCloud/>
                                </Form>
                            </Collapse>
                            <Collapse in={commonCollapse === 'pageBreak'}>
                                <Form>
                                    <div className="reportTitle align-items-center mb-0 float-right">
                                        <span>Page Break</span>
                                    </div>
                                </Form>
                            </Collapse>
                            <Collapse in={commonCollapse === 'informationCommentaryTitleBlock'}>
                                <Form>
                                    <div className="reportTitle align-items-center mb-0 float-right">
                                        <span>Information/Commentary/Title Block</span>
                                    </div>
                                    <Button variant="primary ripple-effect w-100 mt-3" onClick={infoGraphicShow}>Instructions/Comments/Title</Button>
                                </Form>
                            </Collapse>
                            <Collapse in={commonCollapse === 'openEndedResponses'}>
                                <Form>
                                    <div className="reportTitle align-items-center mb-0 float-right">
                                        <span>Open End Responses</span>
                                    </div>
                                    <OpenEndResponses/>
                                </Form>
                            </Collapse>
                            <Collapse in={commonCollapse === 'supportingDocuments'}>
                                <Form>
                                    <div className="reportTitle align-items-center mb-0 float-right">
                                        <span>Support Documents</span>
                                    </div>
                                    <SupportingDocuments/>
                                </Form>
                            </Collapse>
                            <Collapse in={commonCollapse === 'actionItemPlanner'}>
                                <Form>
                                    <div className="reportTitle align-items-center mb-0 float-right">
                                        <span>Action Item Planner</span>
                                    </div>
                                    <ActionItemPlanner/>
                                </Form>
                            </Collapse>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* manage dataset modal */}
        <ModalComponent modalHeader="Manage Dataset" show={showManageDataset} onHandleCancel={manageDatasetClose}>
            <DataTableComponent showFooter={false} data={ReportManageDatasetData} columns={reportManageDatasetColumns} />
        </ModalComponent>
        {/* dataset filter modal */}
        <ModalComponent modalHeader="Manage Dataset" show={showDatasetFilter} onHandleCancel={datasetFilterClose}>
            <DataTableComponent showFooter={false} data={ReportDatasetFilterData} columns={reporDatasetFilterColumns} />
        </ModalComponent>
        {/* Benchmark Configuration modal */}
        <ModalComponent modalHeader="Benchmark Configuration" show={benchmarkControl} onHandleCancel={benchmarkClose}>
            <Form>
                <Form.Group className="form-group mb-0" >
                    <SelectField  placeholder="Select Department" defaultValue={benchmarkOptions[0]} isMulti options={benchmarkOptions} />
                </Form.Group>
                <div className="d-flex justify-content-end gap-2 mt-3">
                    <Button variant='primary' className='ripple-effect'>Save</Button>
                    <Button variant='secondary' className='ripple-effect' onClick={benchmarkClose}>Cancel</Button>
                </div>
            </Form>
        </ModalComponent>
        {/* Question Control Panel modal */}
        <ModalComponent modalHeader="Dimension & Item Control Panel Global Selection" size={'lg'} show={showDimensionItemControl} onHandleCancel={dimensionItemControlClose}>
            <DimensionItemControlPanelTable/>
            <div className="d-flex justify-content-end gap-2">
                <Button variant='primary' className='ripple-effect'>Save</Button>
                <Button variant='secondary' className='ripple-effect' onClick={dimensionItemControlClose}>Cancel</Button>
            </div>
        </ModalComponent>
        {/* information/Commentary/Title Block */}
        <ModalComponent modalHeader="Information/Commentary/Title Block" size={'lg'} show={showInfoGraphic} onHandleCancel={infoGraphicClose}>
            <Form>
                <TextEditor/>
            </Form>
            <div className="d-flex justify-content-end gap-2 mt-3">
                <Button variant='primary' className='ripple-effect'>Save</Button>
            </div>
        </ModalComponent>
        {/* Move Widget modal */}
        <ModalComponent modalHeader="Move Widget" size={'lg'} show={moveWidgetControl} onHandleCancel={moveWidgetClose}>
            <ul className='list-unstyled mb-0 widgetList'>
                <li className='widgetList_item'>
                    <Button variant='link'><em className="icon-drag"></em> 1. Client Logo & Report Title</Button>
                </li>
                <li className='widgetList_item'>
                    <Button variant='link'><em className="icon-drag"></em> 2. Response Rate and Responses by Day</Button>
                </li>
                <li className='widgetList_item'>
                    <Button variant='link'><em className="icon-drag"></em> 3. Response Rate</Button>
                </li>
                <li className='widgetList_item'>
                    <Button variant='link'><em className="icon-drag"></em> 4. Dimension & Item Summary</Button>
                </li>
                <li className='widgetList_item'>
                    <Button variant='link'><em className="icon-drag"></em> 5. Engagement Index</Button>
                </li>
                <li className='widgetList_item'>
                    <Button variant='link'><em className="icon-drag"></em> 6. Key Drivers of Engagement</Button>
                </li>
                <li className='widgetList_item'>
                    <Button variant='link'><em className="icon-drag"></em> 7. Equip Factors</Button>
                </li>
                <li className='widgetList_item'>
                    <Button variant='link'><em className="icon-drag"></em> 8. Manager Effectiveness</Button>
                </li>
                <li className='widgetList_item'>
                    <Button variant='link'><em className="icon-drag"></em> 9. Heat Map</Button>
                </li>
                <li className='widgetList_item'>
                    <Button variant='link'><em className="icon-drag"></em> 10. Word Cloud</Button>
                </li>
                <li className='widgetList_item'>
                    <Button variant='link'><em className="icon-drag"></em> 11. Page Break</Button>
                </li>
                <li className='widgetList_item'>
                    <Button variant='link'><em className="icon-drag"></em> 12. Information/Commentary/Title Block</Button>
                </li>
                <li className='widgetList_item'>
                    <Button variant='link'><em className="icon-drag"></em> 13. Open-ended Responses</Button>
                </li>
                <li className='widgetList_item'>
                    <Button variant='link'><em className="icon-drag"></em> 14. Supporting Documents</Button>
                </li>
                <li className='widgetList_item'>
                    <Button variant='link'><em className="icon-drag"></em> 15. Action Item Planner</Button>
                </li>
            </ul>
            <div className="d-flex justify-content-end gap-2 mt-3">
                <Button variant='primary' className='ripple-effect'>Save</Button>
                <Button variant='secondary' className='ripple-effect' onClick={moveWidgetClose}>Cancel</Button>
            </div>
        </ModalComponent>
        <SweetAlert
            title="Are you sure?"
            text="You won't be able to revert this"
            show={isAlertVisible}
            icon="warning"
            onConfirmAlert={onConfirmAlertModal}
            showCancelButton
            cancelButtonText="Cancel"
            confirmButtonText="Yes"
            setIsAlertVisible={setIsAlertVisible}
            isConfirmedTitle="Deleted!"
            isConfirmedText="Dataset deleted successfully."
        />
        </>
    );
}
import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { Button, InputField, } from '../../../../../components';
import DataPointModal from '../ReportDataTable/DataPointModal';
import { useDispatch } from 'react-redux';
import { updateIRReportData } from '../../../../../redux/IRReportData/index.slice';
import QuestionControlModal from '../ReportDataTable/QuestionControlModal';
import { showErrorToast } from 'helpers/toastHelper';
import { Tooltip } from 'bootstrap'; // Bootstrap must be installed
import { commonService } from 'services/common.service';
import { ADMIN_MANAGEMENT } from 'apiEndpoints/AdminManagement/adminManagement';
import { useAuth } from 'customHooks';


export default function OpenEndResponses({ updateSection, SectionId, SectionData, TemplateFlag }) {


    const [ShowDataPointModal, setShowDataPointModal] = useState(false)
    const [ShowQuestionModal, setShowQuestionModal] = useState(false)
    const { getloginUserData } = useAuth();
    const userData = getloginUserData();

    const [formData, setFormData] = useState({
        title: "",
        subTitle: "",
        selectedPalletteID: "",
        chartType: "",
        selectedChart: "",
        selectedDecimalPoint: "",
        IRdatasetPropertiesFlag: false,
        referenceDataPropertiesFlag: false,
        switchAxis: false,
        colorPalletes: {}
    });

    const dispatch = useDispatch()

    const [isChanged, setisChanged] = useState(false)

    // Initialize tooltips on mount
    useEffect(() => {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltipTriggerList.forEach(el => new Tooltip(el));
    }, []);

    const ChangesTrue = () => {
        if (!isChanged) {
            setisChanged(true)
            dispatch(updateIRReportData({
                unsavedChanges: true,
                widgetTitle: SectionData?.attributeData?.controlData?.title
            }))
        }
    }

    // ✅ Pre-fill state when `SectionData` is available
    useEffect(() => {
        if (SectionData?.attributeData?.controlData) {
            setFormData(SectionData?.attributeData?.controlData);
        }
    }, [SectionData]); // ✅ Runs only when `SectionData` changes

    const handleInputChange = (e) => {
        ChangesTrue()
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleLimitChange = (event) => {
        let newValue = Number(event.target.value);

        if (newValue > formData?.maxResponseCount) {
            newValue = formData?.maxResponseCount
        }
        ChangesTrue()

        // Ensure value stays within the range [0, 2]
        setFormData({
            ...formData,
            responseCount: parseInt(newValue, 10)
        })
    };


    const hasAtLeastOneSelected = () => {

        if (!hasAtLeastOneSelected()) {
            showErrorToast("Please select at least one data point.");
            return;
        }
        if (formData?.dataPointControlList?.overall?.selected) return true;

        for (const key in formData?.dataPointControlList) {
            if (Array.isArray(formData?.dataPointControlList[key])) {
                for (const item of formData?.dataPointControlList[key]) {
                    if (key === "demographic") {
                        if (item.responses.some(resp => resp.selected)) {
                            return true;
                        }
                    } else if (item.selected) {
                        return true;
                    }
                }
            }
        }

        return false;
    };

    const handleSubmit = async () => {
        if (!formData?.questionControlList?.some(item => item.selected)) {
            showErrorToast("Atleast one question should be selected")
            return;
        }
        if (formData?.responseCount < 1 && formData?.responseDisplayType == "limit") {
            showErrorToast("Show response should be greater then 0")
            return;
        }
        if (!formData?.title) {
            showErrorToast("Enter Title to save")
            return;
        }
        try {
            await updateSection({
                ...formData,
                sectionID: SectionId
            }) // ✅ Send all updated values
        } catch (error) {
            console.error("Error updating data:", error);
            alert("Update failed!");
        }
    };


    const getResponseCount = async (data) => {
        try {
            const response = await commonService({
                apiEndPoint: ADMIN_MANAGEMENT.updateSection,
                bodyData: {
                    sectionID: SectionId,
                    templateFlag: TemplateFlag,
                    dataPointData: data?.dataPointControlList
                },
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userData?.apiToken}`,
                },
            });
            if (response?.status) {
                if(response?.data?.data<formData?.responseCount){
                    console.log("condition true");
                    
                    setFormData({
                        ...data,
                        dataPointControlList: data?.dataPointControlList,
                        maxResponseCount: response?.data?.data,
                        responseCount: response?.data?.data,
                      });
                  }else{

                      setFormData({
                          ...data,
                          dataPointControlList: data?.dataPointControlList,
                          maxResponseCount: response?.data?.data
                        });
                  }
                
            }
        } catch (error) {
            console.error("Error fetching elements:", error);
        }finally{
            
        }
    };



    console.log("formData?.responseCount", formData?.responseCount);
    
    



    return (
        <div className="mt-xl-4 mt-3">
            {ShowDataPointModal &&
                <DataPointModal ChangesTrue={ChangesTrue} ShowDataPointModal={ShowDataPointModal} setShowDataPointModal={setShowDataPointModal} formData={formData} setFormData={getResponseCount} dataPointControlList={formData?.dataPointControlList} />
            }
            {ShowQuestionModal &&
                <QuestionControlModal ChangesTrue={ChangesTrue} ShowQuestionModal={ShowQuestionModal} setShowQuestionModal={setShowQuestionModal} formData={formData} setFormData={setFormData} questionControlList={formData?.questionControlList} />
            }
            <Form.Group className="form-group" >
                <Form.Label>Title</Form.Label>
                <InputField type="text" name="title" placeholder="Enter Title" value={formData.title} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Label>Subtitle</Form.Label>
                <InputField type="text" name="subTitle" placeholder="Enter Subtitle" value={formData.subTitle} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Label>1. Select Questions to Display</Form.Label>
                <Button variant="primary ripple-effect w-100" onClick={() => { setShowQuestionModal(true) }}>Question Control Panel</Button>
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Label>2. Select Data Points to Display</Form.Label>
                <Button variant="primary ripple-effect w-100" onClick={() => { setShowDataPointModal(true) }}>Data Point Control Panel</Button>
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Check onChange={() => {
                    setFormData({
                        ...formData,
                        responseDisplayType: "all",
                    });
                }} checked={formData?.responseDisplayType === "all"} className='me-0 form-check-sm' type="checkbox" id='check27'
                    label={<div htmlFor="check27" style={{ color: '#000' }} className="primary-color">All</div>}
                />
            </Form.Group>
            <Form.Group
                data-bs-toggle={TemplateFlag ? "tooltip" : null}
                data-bs-placement="top"
                title={TemplateFlag ? "This option is accessible within the report level" : null}
                className="form-group" >
                <Form.Check onChange={() => {
                    setFormData({
                        ...formData,
                        responseDisplayType: "limit",
                    });
                }} disabled={TemplateFlag} checked={formData?.responseDisplayType !== "all"} className='me-0 form-check-sm' type="checkbox" id='check28'
                    label={<div htmlFor="check28" style={{ color: '#000' }} className="primary-color">Select Number of Responses To Display</div>}
                />
            </Form.Group>
            {formData?.responseDisplayType !== "all" && <Form.Group className="form-group d-flex align-items-center gap-3 showResponse" >
                <span style={{ color: "#000" }}>Show</span>
                <div className="w-25">
                    <InputField type="number" min={1} max={formData?.maxResponseCount} name="responseCount" placeholder="No. of Response" value={formData.responseCount} onChange={handleLimitChange} />

                </div>
                <span style={{ color: "#000" }}>Response out of {formData?.maxResponseCount}</span>
            </Form.Group>}
            <Button onClick={handleSubmit} variant="primary ripple-effect w-100">Save</Button>
        </div>
    )
}

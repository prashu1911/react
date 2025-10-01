import React, { useEffect, useState } from 'react';
import {  Form} from 'react-bootstrap';
import {Button, InputField, SelectField } from '../../../../../components';
import QuestionControlModal from '../ReportDataTable/QuestionControlModal';
import DataPointModal from '../ReportDataTable/DataPointModal';
import { useDispatch } from 'react-redux';
import { updateIRReportData } from '../../../../../redux/IRReportData/index.slice';
import { showErrorToast } from 'helpers/toastHelper';


export default function WordCloud({updateSection, SectionId, SectionData,}) {
    // maximum Word Options

    const [ShowDataPointModal, setShowDataPointModal] = useState(false)
    const [ShowQuestionModal, setShowQuestionModal] = useState(false)
    const [WordLimitOption, setWordLimitOption] = useState([])
    const [SelectedWordLimit, setSelectedWordLimit] = useState({})
    const dispatch= useDispatch()

    const [isChanged, setisChanged] = useState(false)

    const ChangesTrue=()=>{
        if (!isChanged) {
            setisChanged(true)            
            dispatch(updateIRReportData({
                unsavedChanges:true,
                widgetTitle: SectionData?.attributeData?.controlData?.title
              }))
        }
    }

    const [formData, setFormData] = useState({
        controlTitle: "",
        title: "",
        subTitle: "",
        IRdatasetPropertiesFlag: false,
        referenceDataPropertiesFlag: false,
        dataPointControlList: {},
        questionControlList:[],
        maxWordList:[],
        selectedMaxWord:0,
        fontColor:"",
        randomColor:false

    });

    // ✅ Pre-fill state when `SectionData` is available
    useEffect(() => {
        if (SectionData?.attributeData?.controlData) {
            setWordLimitOption(SectionData?.attributeData?.controlData?.maxWordList.map(item => ({
                value: item?.value,
                label: item?.name
            })));
            setSelectedWordLimit({
                value: SectionData?.attributeData?.controlData.selectedMaxWord,
                label: SectionData?.attributeData?.controlData?.maxWordList.find(item => item.value === SectionData?.attributeData?.controlData.selectedMaxWord)?.name
            })
            setFormData(SectionData?.attributeData?.controlData);
        }
    }, [SectionData]); // ✅ Runs only when `SectionData` changes

    // ✅ Handle text & select input changes
    const handleInputChange = (e) => {
        ChangesTrue()
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleWordLimitInput = (e) => {
        ChangesTrue()
        setSelectedWordLimit({
            label: e.label,
            value: e.value
        })
        setFormData({
            ...formData,
            selectedMaxWord: e.value
        })
    };

    const hasAtLeastOneSelected = () => {
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

      const hasAtLeastOneQuestionSelected = () => {
        return formData?.questionControlList?.some(question =>question.selected );
    };

    const handleSubmit = async () => {
        try {

            if (!hasAtLeastOneSelected()) {
                showErrorToast("Please select at least one data point.");
                return;
              }
            if (!hasAtLeastOneQuestionSelected()) {
                showErrorToast("Please select at least one Question.");
                return;
              }
            if (!formData?.title) {
                showErrorToast("Enter Title to save")
                return;        
              }
          await updateSection({
            ...formData,
            sectionID: SectionId
          }) // ✅ Send all updated values
        } catch (error) {
          console.error("Error updating data:", error);
          alert("Update failed!");
        }
      };


    return (
        <div className="mt-xl-4 mt-3">
            {ShowQuestionModal &&
            <QuestionControlModal ChangesTrue={ChangesTrue} ShowQuestionModal={ShowQuestionModal} setShowQuestionModal={setShowQuestionModal} formData={formData} setFormData={setFormData} questionControlList={formData?.questionControlList}/>
            }
            {ShowDataPointModal &&
                <DataPointModal ChangesTrue={ChangesTrue} ShowDataPointModal={ShowDataPointModal} setShowDataPointModal={setShowDataPointModal} formData={formData} setFormData={setFormData} dataPointControlList={formData?.dataPointControlList} />
            }
            <Form.Group className="form-group">
                <Form.Label>Title</Form.Label>
                <InputField type="text" name="title" placeholder="Enter Title" value={formData.title} onChange={handleInputChange} />
            </Form.Group>

            <Form.Group className="form-group">
                <Form.Label>Subtitle</Form.Label>
                <InputField type="text" name="subTitle" placeholder="Enter Subtitle" value={formData.subTitle} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Label>1. Select Questions to Display</Form.Label>
                <Button variant="primary ripple-effect w-100" onClick={()=>{setShowQuestionModal(true)}}>Question Control Panel</Button>
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Label>2. Select Data Points To Display</Form.Label>
                <Button variant="primary ripple-effect w-100" onClick={()=>{setShowDataPointModal(true)}}>Data Point Control Panel</Button>
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Label>Maximum word</Form.Label>
                <SelectField placeholder="Select Maximum word" options={WordLimitOption} value={SelectedWordLimit} onChange={handleWordLimitInput}/>
            </Form.Group>
            <div className="d-flex align-items-center mb-3">
                <Form.Control
                    type="color"
                    id="exampleColorInput"
                    defaultValue="#0968AC"
                    title="Choose a color"
                    value={formData?.fontColor}
                    name='fontColor'
                    onChange={handleInputChange}
                />
                <Form.Label className='form-color-label mb-0' htmlFor="exampleColorInput">Font color</Form.Label>
            </div>
            <Form.Group className="form-group" >
                <Form.Check className='me-0 form-check-sm' type="checkbox" id='check24'
                name="randomColor" checked={formData.randomColor} onChange={handleInputChange}
                    label={<div htmlFor="check24" style={{color:'#000'}} className="primary-color">Random Color</div>}
                    />
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Check className='me-0 form-check-sm' type="checkbox" id='check25'
                name="IRdatasetPropertiesFlag" checked={formData.IRdatasetPropertiesFlag} onChange={handleInputChange}
                    label={<div htmlFor="check25" style={{color:'#000'}} className="primary-color">Display Dataset Properties</div>}
                    />
            </Form.Group>
            {/* <Form.Group className="form-group" >
                <Form.Check className='me-0 form-check-sm' type="checkbox" id='check26'
                name="referenceDataPropertiesFlag" checked={formData.referenceDataPropertiesFlag} onChange={handleInputChange}
                    label={<div htmlFor="check26" className="primary-color">Display Reference Dataset Properties</div>}
                    />
            </Form.Group> */}
            <Button onClick={handleSubmit} variant="primary ripple-effect w-100">Save</Button>
        </div>
    )
}

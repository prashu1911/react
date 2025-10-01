import React, { useEffect, useState } from 'react';
import { Form} from 'react-bootstrap';
import {Button, InputField } from '../../../../../components';
import { useDispatch } from 'react-redux';
import { updateIRReportData } from '../../../../../redux/IRReportData/index.slice';
import { showErrorToast } from 'helpers/toastHelper';

export default function DisplayDatasetProperties({updateSection, SectionId, SectionData}) {


    const [formData, setFormData] = useState({
        controlTitle: "",
        title: "",
        subTitle: "",
    });

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

    // ✅ Pre-fill state when `SectionData` is available
    useEffect(() => {
        if (SectionData?.attributeData?.controlData) {
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

    const handleSubmit = async () => {
        try {
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
            <Form.Group className="form-group">
                <Form.Label>Title</Form.Label>
                <InputField type="text" name="title" placeholder="Enter Title" value={formData.title} onChange={handleInputChange} />
            </Form.Group>

            <Form.Group className="form-group">
                <Form.Label>Subtitle</Form.Label>
                <InputField type="text" name="subTitle" placeholder="Enter Subtitle" value={formData.subTitle} onChange={handleInputChange} />
            </Form.Group>
            <Button onClick={handleSubmit} variant="primary ripple-effect w-100">Save</Button>
        </div>
    )
}

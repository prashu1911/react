import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { Button, InputField } from "../../../../../components";
import DataPointModal from "../ReportDataTable/DataPointModal";
import { useDispatch } from 'react-redux';
import { updateIRReportData } from '../../../../../redux/IRReportData/index.slice';
import { showErrorToast } from "helpers/toastHelper";

export default function DepartmentResponseRate({ updateSection, SectionId, SectionData, }) {
  // ✅ Initialize state with `controlData`
  const [formData, setFormData] = useState({
    title: "",
    subTitle: "",
    frequency: "",
    frequencyChart: "",
    aggregateChart: "",
    displayResponse: false,
    responseRateDistribution: false,
    IRdatasetPropertiesFlag: false,
    referenceDataPropertiesFlag: false,
    selectedDecimalPoint: 0
  });

  const dispatch = useDispatch()

  const [isChanged, setisChanged] = useState(false)

  const ChangesTrue = () => {
    if (!isChanged) {
      setisChanged(true)
      dispatch(updateIRReportData({
        unsavedChanges: true,
        widgetTitle: SectionData?.attributeData?.controlData?.title
      }))
    }
  }


  const [ShowDataPointModal, setShowDataPointModal] = useState(false)


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




  // ✅ Handle Save (Send to API)
  const handleSubmit = async () => {
    if (!hasAtLeastOneSelected()) {
      showErrorToast("Please select at least one data point.");
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
  console.log("formData", formData);



  // Handle value change
  const handleDecimalChange = (event) => {
    let newValue = parseFloat(event.target.value);

    ChangesTrue()
    // Ensure value stays within the range [0, 2]
    if (newValue >= SectionData?.attributeData?.controlData?.decimalOptions[0].value && newValue <= SectionData?.attributeData?.controlData?.decimalOptions[SectionData?.attributeData?.controlData?.decimalOptions?.length - 1].value) {
      setFormData({
        ...formData,
        selectedDecimalPoint: newValue
      })
    }
  };
  return (
    <div className="mt-xl-4 mt-3">
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

      <Form.Group className="form-group">
        <Form.Label>1. Select Data Points To Display</Form.Label>
        <div className="btn btn-primary ripple-effect w-100" onClick={() => { setShowDataPointModal(true) }}>
          Data Point Control Panel
        </div>
      </Form.Group>




      <Form.Group className="form-group">
        <Form.Check className="me-0 form-check-sm" type="checkbox" id="check1" name="displayResponse" checked={formData.displayResponse} onChange={handleInputChange} label={<div htmlFor="check1" style={{ color: '#000' }} className="primary-color">Display Responses</div>} />
      </Form.Group>

      <Form.Group className="form-group">
        <Form.Check className="me-0 form-check-sm" type="checkbox" id="check2" name="responseRateDistribution" checked={formData.responseRateDistribution} onChange={handleInputChange} label={<div htmlFor="check2" style={{ color: '#000' }} className="primary-color">Display Response Rate Distribution</div>} />
      </Form.Group>
      <Form.Group className="form-group">
        <Form.Check className="me-0 form-check-sm" type="checkbox" id="check4" name="displayInvited" checked={formData.displayInvited} onChange={handleInputChange} label={<div htmlFor="check2" style={{ color: '#000' }} className="primary-color">Display Invited</div>} />
      </Form.Group>

      <Form.Group className="form-group">
        <Form.Check className="me-0 form-check-sm" type="checkbox" id="check3" name="IRdatasetPropertiesFlag" checked={formData.IRdatasetPropertiesFlag} onChange={handleInputChange} label={<div htmlFor="check3" style={{ color: '#000' }} className="primary-color">Display Dataset Properties</div>} />
      </Form.Group>

      {/* <Form.Group className="form-group">
        <Form.Check className="me-0 form-check-sm" type="checkbox" id="check4" name="referenceDataPropertiesFlag" checked={formData.referenceDataPropertiesFlag} onChange={handleInputChange} label={<div htmlFor="check4" className="primary-color">Display Reference Data Properties</div>} />
      </Form.Group> */}

      <Form.Group style={{ display: 'flex', alignItems: 'center' }} className="form-group">
        <Form.Label>Decimal Places</Form.Label>
        <InputField
          type="number"
          value={formData?.selectedDecimalPoint}
          onChange={handleDecimalChange}
          min={0}
          max={3}
          step={1}
          style={{ width: "70px" }}
          extraClass="form-control-sm"
        />   </Form.Group>



      <Button variant="primary ripple-effect w-100" onClick={handleSubmit}>
        Save
      </Button>
    </div>
  );
}

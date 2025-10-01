import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { Button, InputField, SelectField } from "../../../../../components";
import DataPointModal from "../ReportDataTable/DataPointModal";
import { useDispatch } from 'react-redux';
import { updateIRReportData } from '../../../../../redux/IRReportData/index.slice';
import { showErrorToast } from "helpers/toastHelper";

export default function ResponseRate({ updateSection, SectionId, SectionData }) {
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
    selectedDecimalPoint: "",
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

  const [frequencyOptions, setfrequencyOptions] = useState([])
  const [SelectedFrequency, setSelectedFrequency] = useState({})
  const [frequencyChartOptions, setfrequencyChartOptions] = useState([])
  const [SelectedFrequencyChartOptions, setSelectedFrequencyChartOptions] = useState({})
  const [aggregateChartOptionsOptions, setAggregateChartOptions] = useState([])
  const [SelectedAggregateChartOptions, setSelectedAggregateChartOptions] = useState({})

  const [ShowDataPointModal, setShowDataPointModal] = useState(false)



  // ✅ Pre-fill state when `SectionData` is available
  useEffect(() => {
    if (SectionData?.attributeData?.controlData) {
      setfrequencyOptions(SectionData?.attributeData?.controlData?.frequencyOptions.map(item => ({
        value: item?.value,
        label: item?.name
      })));
      setSelectedFrequency({
        value: SectionData?.attributeData?.controlData.frequency,
        label: SectionData?.attributeData?.controlData?.frequencyOptions.find(item => item.value === SectionData?.attributeData?.controlData.frequency)?.name
      })
      setfrequencyChartOptions(SectionData?.attributeData?.controlData?.frequencyChartOptions.map(item => ({
        value: item?.value,
        label: item?.name
      })));
      setSelectedFrequencyChartOptions({
        value: SectionData?.attributeData?.controlData?.frequencyChart,
        label: SectionData?.attributeData?.controlData?.frequencyChartOptions.find(item => item.value === SectionData?.attributeData?.controlData.frequencyChart)?.name
      })
      setAggregateChartOptions(SectionData?.attributeData?.controlData?.aggregateChartOptions.map(item => ({
        value: item?.value,
        label: item?.name
      })));
      setSelectedAggregateChartOptions({
        value: SectionData?.attributeData?.controlData.aggregateChart,
        label: SectionData?.attributeData?.controlData?.aggregateChartOptions.find(item => item.value === SectionData?.attributeData?.controlData.aggregateChart)?.name
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
  const handleFrequencyInput = (e) => {
    setSelectedFrequency({
      label: e.label,
      value: e.value
    })
    ChangesTrue()
    setFormData({
      ...formData,
      frequency: e.value
    })
  };
  const handleFrequencyChartInput = (e) => {
    setSelectedFrequencyChartOptions({
      label: e.label,
      value: e.value
    })
    ChangesTrue()
    setFormData({
      ...formData,
      frequencyChart: e.value
    })
  };
  const handleFrequencyAggregateChartInput = (e) => {
    setSelectedAggregateChartOptions({
      label: e.label,
      value: e.value
    })
    ChangesTrue()
    setFormData({
      ...formData,
      aggregateChart: e.value
    })
  };
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
    try {

      if (!hasAtLeastOneSelected()) {
        showErrorToast("Please select at least one data point.");
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
        <Form.Label>2. Select Frequency To Display</Form.Label>
        <SelectField name="frequency" placeholder="Select Frequency" options={frequencyOptions} value={SelectedFrequency} onChange={handleFrequencyInput} />
      </Form.Group>

      <div style={{ backgroundColor: '#E5E5E6', padding: '0.5rem', paddingBottom: '1px', borderRadius: '0.5rem', marginBottom: '0.5rem' }}>
        <Form.Group className="form-group">
          <Form.Label>Configure Frequency Chart Type</Form.Label>
          <SelectField name="frequencyChart" placeholder="Select Frequency Chart Type" options={frequencyChartOptions} value={SelectedFrequencyChartOptions} onChange={handleFrequencyChartInput} />
        </Form.Group>
      </div>
      <div style={{ backgroundColor: '#E5E5E6', padding: '0.5rem', paddingBottom: '1px', borderRadius: '0.5rem', marginBottom: '0.5rem' }}>


        <Form.Group className="form-group">
          <Form.Label>Configure Aggregate Chart</Form.Label>
          <SelectField name="aggregateChart" placeholder="Select Aggregate Chart Type" options={aggregateChartOptionsOptions} value={SelectedAggregateChartOptions} onChange={handleFrequencyAggregateChartInput} />
        </Form.Group>

        <Form.Group className="form-group">
          <Form.Check className="me-0 form-check-sm" type="checkbox" id="check1" name="displayResponse" checked={formData.displayResponse} onChange={handleInputChange} label={<div style={{ color: 'black' }} htmlFor="check1" className="primary-color">Display Responses</div>} />
        </Form.Group>
      </div>

      <Form.Group className="form-group">
        <Form.Check className="me-0 form-check-sm" type="checkbox" id="check2" name="responseRateDistribution" checked={formData.responseRateDistribution} onChange={handleInputChange} label={<div style={{ color: 'black' }} htmlFor="check2" className="primary-color">Display Response Rate Distribution</div>} />
      </Form.Group>

      <Form.Group className="form-group">
        <Form.Check className="me-0 form-check-sm" type="checkbox" id="check3" name="IRdatasetPropertiesFlag" checked={formData.IRdatasetPropertiesFlag} onChange={handleInputChange} label={<div style={{ color: 'black' }} htmlFor="check3" className="primary-color">Display Dataset Properties</div>} />
      </Form.Group>

      <Form.Group style={{ display: 'flex', alignItems: 'center' }} className="form-group">
        <Form.Label>Decimal Places</Form.Label>
        <input
          type="number"
          id="numericInput"
          value={formData?.selectedDecimalPoint || 0}
          onChange={handleDecimalChange}
          min="0" // Set minimum value
          max="2" // Set maximum value
          step="1" // Increase/decrease by 1
          style={{
            width: "60px",
            textAlign: "center",
            padding: "5px",
            borderRadius: '6px',
            borderColor: "#07578F",
            borderWidth: "1px"
          }}
        />      </Form.Group>

      <Button variant="primary ripple-effect w-100" onClick={handleSubmit}>
        Save
      </Button>
    </div>
  );
}

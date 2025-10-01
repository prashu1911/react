import React, { useEffect, useState } from 'react';
import { Form, Collapse } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { Button, InputField, SelectField } from '../../../../../components';
import DataPointModal from '../ReportDataTable/DataPointModal';
import ObjectPointModal from '../ReportDataTable/ObjectPointModal';
import ColorPellatesIR from 'components/ColorPellates/ColorPallateIR';
import { useDispatch } from 'react-redux';
import { updateIRReportData } from '../../../../../redux/IRReportData/index.slice';
import { showErrorToast } from 'helpers/toastHelper';

export default function GeneralChart({ updateSection, SectionId, SectionData }) {
    const [paletteCollapse, setPaletteCollapse] = useState(false);
    const [ChartTypeOption, setChartTypeOption] = useState([])
    const [SelectedChartType, setSelectedChartType] = useState({})
    const [ShowDataPointModal, setShowDataPointModal] = useState(false)
    const [ShowObjectPointModal, setShowObjectPointModal] = useState(false)



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
            setChartTypeOption(SectionData?.attributeData?.controlData?.chartType.map(item => ({
                value: item?.value,
                label: item?.name
            })));
            setSelectedChartType({
                value: SectionData?.attributeData?.controlData.selectedChart,
                label: SectionData?.attributeData?.controlData?.chartType.find(item => item.value === SectionData?.attributeData?.controlData.selectedChart)?.name
            })
            setFormData(SectionData?.attributeData?.controlData);
        }
    }, [SectionData]); // ✅ Runs only when `SectionData` changes

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



    const handleInputChange = (e) => {
        ChangesTrue()
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };
    const handleColorPaletteSelect = (paletteId) => {
        ChangesTrue()
        setFormData({
            ...formData,
            selectedPalletteID: paletteId,
        });
    };

    const handleChartTypeInput = (e) => {
        setSelectedChartType({
            label: e.label,
            value: e.value
        })
        ChangesTrue()
        setFormData({
            ...formData,
            selectedChart: e.value
        })
    };

    const hasAtLeastOneObjectPointSelected = () => {
        return formData?.objectControlList?.some(outcome =>
          outcome.selected ||
          outcome.intentions?.some(intn =>
            intn.selected ||
            intn.questions?.some(q => q.selected)
          )
        );
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

    const handleSubmit = async () => {
        try {

            if (!hasAtLeastOneSelected()) {
                showErrorToast("Please select at least one data point.");
                return;
              }
            if (!hasAtLeastOneObjectPointSelected()) {
                showErrorToast("Please select at least one object point.");
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
            {ShowObjectPointModal &&
                <ObjectPointModal ChangesTrue={ChangesTrue} ShowObjectPointModal={ShowObjectPointModal} setShowObjectPointModal={setShowObjectPointModal} formData={formData} setFormData={setFormData} objectControlList={formData?.objectControlList} />
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
                <Form.Label>1. Select Chart Type</Form.Label>
                <SelectField placeholder="Select Chart Type" options={ChartTypeOption} value={SelectedChartType} onChange={handleChartTypeInput} />
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Label>2. Select Objects to Display</Form.Label>
                <Button variant="primary ripple-effect w-100" onClick={() => { setShowObjectPointModal(true) }}>Object Control Panel</Button>
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Label>3. Select Data Points to Display</Form.Label>
                <Button variant="primary ripple-effect w-100" onClick={() => { setShowDataPointModal(true) }}>Data Point Control Panel</Button>
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Check className='me-0 form-check-sm' type="checkbox" id='check12'
                    name="switchAxis" checked={formData.switchAxis} onChange={handleInputChange}
                    label={<div htmlFor="check12" style={{ color: '#000' }} className="primary-color">Switch Axis</div>}
                />
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Check className='me-0 form-check-sm' type="checkbox" id='check13'
                    name="IRdatasetPropertiesFlag" checked={formData.IRdatasetPropertiesFlag} onChange={handleInputChange}
                    label={<div htmlFor="check13" style={{ color: '#000' }} className="primary-color">Display Dataset Properties</div>}
                />
            </Form.Group>
            {/* <Form.Group className="form-group" >
                <Form.Check className='me-0 form-check-sm' type="checkbox" id='check14'
                name="referenceDataPropertiesFlag" checked={formData.referenceDataPropertiesFlag} onChange={handleInputChange}
                    label={<div htmlFor="check14" className="primary-color">Display Reference Data Properties</div>}
                />
            </Form.Group> */}
            <div className="d-flex align-items-center mb-3">
                <Link className='pickColor' onClick={(e) => { e.preventDefault(); setPaletteCollapse(!paletteCollapse) }} aria-controls="palette" aria-expanded={paletteCollapse}
                    style={{
                        background: `linear-gradient(135deg, ${SectionData?.attributeData?.widgetData?.selectedPaletteColors?.map(c => c.colorCode).join(', ')})`, // 🔥 your gradient colors
                        color: "#fff", // optional: makes text readable
                        padding: "8px 24px",
                        borderRadius: "5px",
                        display: "inline-block",
                        textDecoration: "none",
                    }}
                />
                <Form.Label style={{ color: '#000' }} className='form-color-label mb-0'>Color Palette</Form.Label>
            </div>
            {SectionData &&
                <Collapse in={paletteCollapse}>
                    <div><ColorPellatesIR handleColorPaletteSelect={handleColorPaletteSelect} ColorPellates={SectionData?.attributeData?.controlData?.colorPalletes} selectedPalletteID={formData?.selectedPalletteID} /></div>
                </Collapse>
            }
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
                />      </Form.Group>
            <Button onClick={handleSubmit} variant="primary ripple-effect w-100">Save</Button>
        </div>
    )
}

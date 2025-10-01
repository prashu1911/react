import React, { useEffect, useState } from 'react';
import { useAuth } from 'customHooks';
import { commonService } from 'services/common.service';
import { showErrorToast, showSuccessToast } from 'helpers/toastHelper';
import { ADMIN_MANAGEMENT } from 'apiEndpoints/AdminManagement/adminManagement';
import { Collapse, Form, OverlayTrigger, Table, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Button, DataTableComponent, SweetAlert, InputField, ModalComponent, SelectField } from '../../../../../components';
import FavorabilityIndexSettingsData from '../json/FavorabilityIndexSettingsData.json';
import FavorabilityIndexModalScalerList from '../Modal/FavorabilityIndexModalScalerList';
import DataPointModal from '../ReportDataTable/DataPointModal';
import { useDispatch } from 'react-redux';
import { updateIRReportData } from '../../../../../redux/IRReportData/index.slice';
import FavorabilityObjectPointModal from '../ReportDataTable/FavorabilityObjectPointModal';

export default function FavorabilityIndex({ConfigurationModalShow, byIntention = false, TemplateFlag, assessmentID, updateSection, SectionId, SectionData, companyID, reportID }) {

    const { getloginUserData } = useAuth();
    const userData = getloginUserData();

    const [ShowDataPointModal, setShowDataPointModal] = useState(false)
    const [ShowObjectPointModal, setShowObjectPointModal] = useState(false)
    const [ThemeList, setThemeList] = useState([])
    const [SelectedTheme, setSelectedTheme] = useState(null)
    const [ResponseType, setResponseType] = useState([])
    const [FavorList, setFavorList] = useState([])
    const [EditThemeFavourList, setEditThemeFavourList] = useState([])
    const [NewTheme, setNewTheme] = useState([])
    const [EditTheme, setEditTheme] = useState([])
    const [EditThemeName, setEditThemeName] = useState([])
    const [NewThemeName, setNewThemeName] = useState("")
    const [deleteThemeId, setdeleteThemeId] = useState()

    const [IntentionsOptions, setIntentionsOptions] = useState([])
    const [SelectedIntentions, setSelectedIntentions] = useState(null)

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

    const deleteTheme = async (themeId) => {
        try {
            const response = await commonService({
                apiEndPoint: ADMIN_MANAGEMENT.deleteTheme(themeId),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userData?.apiToken}`,
                },
            });
            if (response?.status) {
                return true
            }
        } catch (error) {
            console.error("Error fetching elements:", error);
        }
    };

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
    

    useEffect(() => {
        if (SectionData?.attributeData?.controlData) {
            setFormData(SectionData?.attributeData?.controlData);

            if (byIntention) {
                setIntentionsOptions(
                    SectionData?.attributeData?.controlData?.objectControlList
                      .filter(item => item?.intention_id && item?.intention_name)
                      .map(item => ({
                        value: item.intention_id,
                        label: item.intention_name
                      }))
                  );

                setSelectedIntentions({
                    value: SectionData?.attributeData?.controlData.selectedIntention,
                    label: SectionData?.attributeData?.controlData?.objectControlList.find(item => item.intention_id == SectionData?.attributeData?.controlData.selectedIntention)?.intention_name
                })
            }


        }
    }, [SectionData]); // ✅ Runs only when `SectionData` changes

    const handleIntentionInput = (e) => {
        ChangesTrue()
        setSelectedIntentions({
            label: e.label,
            value: e.value
        })
        setFormData({
            ...formData,
            selectedIntention: Number(e.value)
        })
    };

    const handleInputChange = (e) => {
        ChangesTrue()

        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    
    const syncOutcomeSelection = (data) => {

        return data.map(outcome => {
            return {
                ...outcome,
                selected: (formData?.showOutcomes && outcome?.intentions?.some((e)=>e.selected==true)) ? true : false
            };
        });
    };

    const hasAtLeastOneObjectPointSelected = () => {
        return formData?.objectControlList?.some(outcome =>
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

            const objectControlList = syncOutcomeSelection(formData?.objectControlList)
            if (!hasAtLeastOneSelected()) {
                showErrorToast("Please select at least one data point.");
                return;
              }
            if (!hasAtLeastOneObjectPointSelected() && !byIntention) {
                showErrorToast("Please select at least one object point.");
                return;
              }

            if (!formData?.selectedIntention && byIntention) {
                showErrorToast("Select Intention")
                return;
            }
            if (!formData?.title) {
                showErrorToast("Enter Title to save")
                return;
            }
            await updateSection({
                ...formData,
                objectControlList: objectControlList,
                sectionID: SectionId
            }) // ✅ Send all updated values
        } catch (error) {
            console.error("Error updating data:", error);
            alert("Update failed!");
        }
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
    return (
        <>
            <div className="mt-xl-4 mt-3">
                {ShowDataPointModal &&
                    <DataPointModal benchmarkLimit={3} ChangesTrue={ChangesTrue} ShowDataPointModal={ShowDataPointModal} setShowDataPointModal={setShowDataPointModal} formData={formData} setFormData={setFormData} dataPointControlList={formData?.dataPointControlList} />
                }
                {ShowObjectPointModal &&
                    <FavorabilityObjectPointModal ChangesTrue={ChangesTrue} ShowObjectPointModal={ShowObjectPointModal} setShowObjectPointModal={setShowObjectPointModal} formData={formData} setFormData={setFormData} objectControlList={formData?.objectControlList} />
                }
                <Form.Group className="form-group" >
                    <Form.Label>Title</Form.Label>
                    <InputField type={"text"} name="title" placeholder={"Enter Title"} value={formData.title} onChange={handleInputChange} />
                </Form.Group>
                <Form.Group className="form-group" >
                    <Form.Label>Subtitle</Form.Label>
                    <InputField type={"text"} name="subTitle" placeholder={"Enter Subtitle"} value={formData.subTitle} onChange={handleInputChange} />
                </Form.Group>
                {!byIntention && <Form.Group className="form-group" >
                    <Form.Label>1. Select Objects to Display</Form.Label>
                    <Button variant="primary ripple-effect w-100" onClick={() => { setShowObjectPointModal(true) }}>Object Control Panel</Button>
                </Form.Group>}
                {byIntention && <Form.Group className="form-group" >
                    <Form.Label>1. Select Intention</Form.Label>
                    <SelectField placeholder="Select Intention" options={IntentionsOptions} value={SelectedIntentions} onChange={handleIntentionInput} />
                </Form.Group>}
                <Form.Group className="form-group" >
                    <Form.Label>2. Select Data Points to Display</Form.Label>
                    <Button variant="primary ripple-effect w-100" onClick={() => { setShowDataPointModal(true) }}>Data Point Control Panel</Button>
                </Form.Group>
                <Form.Group className="form-group" >
                    <Form.Label>3. Configure Response Display
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip >Select the responses to display according to color configuration</Tooltip>}
                        >
                            <Link onClick={(e) => { e.preventDefault() }} data-bs-toggle="tooltip">
                                <em className="iconInfo icon-info-circle ms-1"></em>
                            </Link>
                        </OverlayTrigger>
                    </Form.Label>
                    <Button variant="primary ripple-effect w-100" onClick={ConfigurationModalShow}>Favorability Index Control Panel</Button>
                </Form.Group>
                <Form.Group className="form-group" >
                    <Form.Check className='me-0 form-check-sm' type="checkbox" id='check05'
                        name="displayResponseCount" checked={formData.displayResponseCount} onChange={handleInputChange}
                        label={<div htmlFor="check05" style={{ color: '#000' }} className="primary-color">Display Response Count</div>}
                    />
                </Form.Group>
                <Form.Group className="form-group" >
                    <Form.Check className='me-0 form-check-sm' type="checkbox" id='check06'
                        name="displayOverallFavorability" checked={formData.displayOverallFavorability} onChange={handleInputChange}
                        label={<div htmlFor="check06" style={{ color: '#000' }} className="primary-color">Display Overall Favorable</div>}
                    />
                </Form.Group>
                <Form.Group className="form-group" >
                    <Form.Check className='me-0 form-check-sm' type="checkbox" id='check07'
                        name="displayPercentage" checked={formData.displayPercentage} onChange={handleInputChange}
                        label={<div htmlFor="check07" style={{ color: '#000' }} className="primary-color">Display Percentage</div>}
                    />
                </Form.Group>

                <Form.Group className="form-group" >
                    <Form.Check className='me-0 form-check-sm' type="checkbox" id='check12'
                        name="displayFavorableResponseCount" checked={formData.displayFavorableResponseCount} onChange={handleInputChange}
                        label={<div htmlFor="check12" style={{ color: '#000' }} className="primary-color">Display Favorable Count</div>}
                    />
                </Form.Group>
                <Form.Group className="form-group" >
                    <Form.Check className='me-0 form-check-sm' type="checkbox" id='check08'
                        name="displayBenchmark" checked={formData.displayBenchmark} onChange={handleInputChange}
                        label={<div htmlFor="check08" style={{ color: '#000' }} className="primary-color">Display Benchmark(s)</div>}
                    />
                </Form.Group>
                <Form.Group className="form-group" >
                    <Form.Check className='me-0 form-check-sm' type="checkbox" id='check10'
                        name="IRdatasetPropertiesFlag" checked={formData.IRdatasetPropertiesFlag} onChange={handleInputChange}
                        label={<div htmlFor="check10" style={{ color: '#000' }} className="primary-color">Display Dataset Properties</div>}
                    />
                </Form.Group>
                {!byIntention && <Form.Group className="form-group" >
                    <Form.Check className='me-0 form-check-sm' type="checkbox" id='check11'
                        name="showOutcomes" checked={formData.showOutcomes} onChange={handleInputChange}
                        label={<div htmlFor="check11" style={{color:'#000'}} className="primary-color">Show Outcomes</div>}
                    />
                </Form.Group>}
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
                    />
                </Form.Group>
                <Button onClick={handleSubmit} variant="primary ripple-effect w-100">Save</Button>
            </div>

        </>
    )
}

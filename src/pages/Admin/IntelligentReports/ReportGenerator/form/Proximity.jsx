import React, { useEffect, useState } from 'react';
import { useAuth } from 'customHooks';
import { commonService } from 'services/common.service';
import { showErrorToast, showSuccessToast } from 'helpers/toastHelper';
import { Collapse, Form, OverlayTrigger, Table, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Button, SweetAlert, InputField, ModalComponent, SelectField } from '../../../../../components';
import DataPointModal from '../ReportDataTable/DataPointModal';
import { useDispatch } from 'react-redux';
import { updateIRReportData } from '../../../../../redux/IRReportData/index.slice';
import ObjectPointModalProximity from '../ReportDataTable/ObjectPointModalProximity';

export default function Proximity({ ConfigurationModalShow, TemplateFlag, assessmentID, updateSection, SectionId, SectionData, companyID, reportID }) {

    const { getloginUserData } = useAuth();
    const userData = getloginUserData();

    const [ShowDataPointModal, setShowDataPointModal] = useState(false)
    const [ShowObjectPointModal, setShowObjectPointModal] = useState(false)
    const [IntentionsOptions, setIntentionsOptions] = useState([])
    const [SelectedIntentions, setSelectedIntentions] = useState(null)
    const [SelectedSelectionOrder, setSelectedSelectionOrder] = useState({})
    const [SelectionOrderOption, setSelectionOrderOption] = useState([])
    const [MaxLimit, setMaxLimit] = useState(1)
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
            // setIntentionsOptions(SectionData?.attributeData?.controlData?.intentionList.map(item => ({
            //     value: item?.intention_id,
            //     label: item?.intention_name
            // })));
            setIntentionsOptions(
                SectionData?.attributeData?.controlData?.intentionList
                  .filter(item => item?.intention_id && item?.intention_name)
                  .map(item => ({
                    value: item.intention_id,
                    label: item.intention_name
                  }))
              );
            setSelectedIntentions({
                value: SectionData?.attributeData?.controlData.selectedIntention,
                label: SectionData?.attributeData?.controlData?.intentionList.find(item => item.intention_id == SectionData?.attributeData?.controlData.selectedIntention)?.intention_name
            })
            setSelectionOrderOption(SectionData?.attributeData?.controlData?.selectionOrder.map(item => ({
                value: item?.value,
                label: item?.name
            })));
            setSelectedSelectionOrder({
                value: SectionData?.attributeData?.controlData.selectedSelectionOrder,
                label: SectionData?.attributeData?.controlData?.selectionOrder.find(item => item.value == SectionData?.attributeData?.controlData.selectedSelectionOrder)?.name
            })

            const count=getSelectedQuestionCount(SectionData?.attributeData?.controlData?.objectControlList)
            setMaxLimit(count)
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

    const handleSelectionOrderInput = (e) => {
        ChangesTrue()
        setSelectedSelectionOrder({
            label: e.label,
            value: e.value
        })
        setFormData({
            ...formData,
            selectedSelectionOrder: e.value
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

        //     if (!hasAtLeastOneSelected() && !(('benchmark' in formData?.dataPointControlList) && Array.isArray(formData?.dataPointControlList?.benchmark) && formData?.dataPointControlList?.benchmark.length === 0) ) {
        //         showErrorToast("Please select at least one data point.");
        //         return;
        //       }
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
        }
    };



    //favorability index control panel modal
    const [showFavorabilityIndex, setShowFavorabilityIndex] = useState(false);
    const favorabilityIndexClose = () => setShowFavorabilityIndex(false);


    //favorability index New modal
    const [showFavorabilityIndexNew, setShowFavorabilityIndexNew] = useState(false);
    const favorabilityIndexNewClose = () => {
        setShowFavorabilityIndexNew(false);
        setShowFavorabilityIndex(true);
    }

    //delete alert modal
    const [isAlertVisible, setIsAlertVisible] = useState(false);






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
    const handleLimitChange = (event) => {
        let newValue = Number(event.target.value);

        if (newValue>MaxLimit) {
            newValue=MaxLimit
        }
        ChangesTrue()

        // Ensure value stays within the range [0, 2]
        setFormData({
            ...formData,
            importanceLimit: parseInt(newValue, 10)
        })
    };

    const getSelectedQuestionCount = (objectControlList) => {
        return objectControlList.reduce((total, outcome) => {
            return total + outcome.intentions.reduce((innerTotal, intention) => {
                const count = innerTotal + intention.questions.filter(q => q.selected).length;
                return count;
            }, 0);
        }, 0);
    };

    useEffect(() => {
        if (formData?.title){
            const updatedData = SectionData?.attributeData?.controlData?.objectControlList.map(outcome => ({
            ...outcome,
            // selected: true,
            intentions: outcome.intentions.map(intention => ({
              ...intention,
              // selected: true,
      
              ...(intention?.intention_id.split("~")[1]!=SelectedIntentions?.value && { questions: intention.questions.map(question => ({
                ...question,
                selected:  true
              }))
             }),              
            }))
          }));
        
          setFormData({
            ...formData,
            objectControlList: updatedData
        })
    }
    }, [SelectedIntentions])
    



    return (
        <>
            <div className="mt-xl-4 mt-3">
                {ShowDataPointModal &&
                    <DataPointModal limit={3} benchmarkValidation={true} showSelectAll={false} benchmarkLimit={3} ChangesTrue={ChangesTrue} ShowDataPointModal={ShowDataPointModal} setShowDataPointModal={setShowDataPointModal} formData={formData} setFormData={setFormData} dataPointControlList={formData?.dataPointControlList} />
                }
                {ShowObjectPointModal &&
                    <ObjectPointModalProximity setMaxLimit={setMaxLimit} getSelectedQuestionCount={getSelectedQuestionCount} SelectedIntentions={SelectedIntentions} ChangesTrue={ChangesTrue} ShowObjectPointModal={ShowObjectPointModal} setShowObjectPointModal={setShowObjectPointModal} formData={formData} setFormData={setFormData} objectControlList={formData?.objectControlList} />
                }
                <Form.Group className="form-group" >
                    <Form.Label>Title</Form.Label>
                    <InputField type={"text"} name="title" placeholder={"Enter Title"} value={formData.title} onChange={handleInputChange} />
                </Form.Group>
                <Form.Group className="form-group" >
                    <Form.Label>Subtitle</Form.Label>
                    <InputField type={"text"} name="subTitle" placeholder={"Enter Subtitle"} value={formData.subTitle} onChange={handleInputChange} />
                </Form.Group>
                <Form.Group className="form-group" >
                    <Form.Label>1. Select Intention</Form.Label>
                    <SelectField placeholder="Select Intention" options={IntentionsOptions} value={SelectedIntentions} onChange={handleIntentionInput} />
                </Form.Group>
                <Form.Group className="form-group" >
                    <Form.Label>2. Select Objects to Display</Form.Label>
                    <Button  variant="primary ripple-effect w-100" onClick={() => { 
                        if(SelectedIntentions?.value){
                            setShowObjectPointModal(true);
                        }else{
                            showErrorToast("First Select Intention")
                        }
                    }}>Object Control Panel</Button>
                </Form.Group>
                <Form.Group className="form-group" >
                    <Form.Label>3. Select Data Points to Display</Form.Label>
                    <Button variant="primary ripple-effect w-100" onClick={() => { setShowDataPointModal(true) }}>Data Point Control Panel</Button>
                </Form.Group>
                <Form.Group className="form-group" >
                    <Form.Label>4. Configure Response Display
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
                    <Form.Label>5. Selection Order</Form.Label>
                    <SelectField placeholder="Select Intention" options={SelectionOrderOption} value={SelectedSelectionOrder} onChange={handleSelectionOrderInput} />
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
                        name="displayFavorableResponseCount" checked={formData.displayFavorableResponseCount} onChange={handleInputChange}
                        label={<div htmlFor="check07" style={{ color: '#000' }} className="primary-color">Display Favorable Count</div>}
                    />
                </Form.Group>
                <Form.Group className="form-group" >
                    <Form.Check className='me-0 form-check-sm' type="checkbox" id='check08'
                        name="displayBenchmark" checked={formData.displayBenchmark} onChange={handleInputChange}
                        label={<div htmlFor="check08" style={{ color: '#000' }} className="primary-color">Display Benchmark(s)</div>}
                    />
                </Form.Group>
                {/* <Form.Group className="form-group" >
                    <Form.Check className='me-0 form-check-sm' type="checkbox" id='check09'
                        name="displayReferenceData" checked={formData.displayReferenceData} onChange={handleInputChange}
                        label={<div htmlFor="check09" style={{color:'#000'}} className="primary-color">Display Reference Data</div>}
                    />
                </Form.Group> */}
                <Form.Group className="form-group" >
                    <Form.Check className='me-0 form-check-sm' type="checkbox" id='check10'
                        name="IRdatasetPropertiesFlag" checked={formData.IRdatasetPropertiesFlag} onChange={handleInputChange}
                        label={<div htmlFor="check10" style={{ color: '#000' }} className="primary-color">Display Dataset Properties</div>}
                    />
                </Form.Group>
                <Form.Group className="form-group" >
                    <Form.Check className='me-0 form-check-sm' type="checkbox" id='check10'
                        name="showImportance" checked={formData.showImportance} onChange={handleInputChange}
                        label={<div htmlFor="check10" style={{ color: '#000' }} className="primary-color">Show Importance</div>}
                    />
                </Form.Group>
                <Form.Group className="form-group" >
                    <Form.Check className='me-0 form-check-sm' type="checkbox" id='check10'
                        name="showImportanceValue" checked={formData.showImportanceValue} onChange={handleInputChange}
                        label={<div htmlFor="check10" style={{ color: '#000' }} className="primary-color">Show Importance Value</div>}
                    />
                </Form.Group>
                <Form.Group className="form-group" >
                    <Form.Check className='me-0 form-check-sm' type="checkbox" id='check11'
                        name="displayPercentage" checked={formData.displayPercentage} onChange={handleInputChange}
                        label={<div htmlFor="check10" style={{ color: '#000' }} className="primary-color">Display Percentage</div>}
                    />
                </Form.Group>

                {/* <Form.Group className="form-group" >
                    <Form.Check className='me-0 form-check-sm' type="checkbox" id='check11'
                        name="referenceDataPropertiesFlag" checked={formData.referenceDataPropertiesFlag} onChange={handleInputChange}
                        label={<div htmlFor="check11" className="primary-color">Display Reference Data Properties</div>}
                    />
                </Form.Group> */}
                <Form.Group style={{ display: 'flex', alignItems: 'center' }} className="form-group">
                    <Form.Label>Question Limit</Form.Label>


                    <InputField
                        type="number"
                        value={Number(formData?.importanceLimit)}
                        onChange={handleLimitChange}
                        min={0} // Set minimum value
                        max={MaxLimit} // Set maximum value
                        step={1} // Increase/decrease by 1
                        style={{ width: "70px" }}
                        extraClass="form-control-sm"
                    />

                </Form.Group>
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




        </>
    )
}

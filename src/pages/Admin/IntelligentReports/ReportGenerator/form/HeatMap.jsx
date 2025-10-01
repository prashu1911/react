import React, { useEffect, useState } from 'react';
import { Button, InputField, ModalComponent, SelectField, TextEditor } from '../../../../../components';
import { Form, InputGroup } from 'react-bootstrap';
import DataPointModal from '../ReportDataTable/DataPointModal';
import { useDispatch } from 'react-redux';
import { updateIRReportData } from '../../../../../redux/IRReportData/index.slice';
import HeatmapObjectPointModal from '../ReportDataTable/HeatmapObjectPointModal';
import { showErrorToast } from 'helpers/toastHelper';
export default function HeatMap({ updateSection, SectionId, SectionData }) {
    // comparative Options


    const [HeatmapTypesOption, setHeatmapTypesOption] = useState([])
    const [SelectedHeatmapTypes, setSelectedHeatmapTypes] = useState()
    const [ComparisonTypesOption, setComparisonTypesOption] = useState([])
    const [SelectedComparisonTypes, setSelectedComparisonTypes] = useState()
    const [ShowDataPointModal, setShowDataPointModal] = useState(false)
    const [ShowObjectPointModal, setShowObjectPointModal] = useState(false)
    const [heatmapColorPallette, setheatmapColorPallette] = useState()
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
        colorPalletes: {},
        comparatives: [],
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

    const handleInstructionData = (value) => {
        setFormData({
            ...formData,
            instructionData: value,
        });
        ChangesTrue()
    }

    useEffect(() => {
        if (SectionData?.attributeData?.controlData) {
            setHeatmapTypesOption(SectionData?.attributeData?.controlData?.heatmapTypes.map(item => ({
                value: item?.value,
                label: item?.name
            })));
            setSelectedHeatmapTypes({
                value: SectionData?.attributeData?.controlData.heatmapType,
                label: SectionData?.attributeData?.controlData?.heatmapTypes.find(item => item.value === SectionData?.attributeData?.controlData.heatmapType)?.name
            })

            setFormData(SectionData?.attributeData?.controlData);
            setheatmapColorPallette(SectionData?.attributeData?.controlData?.heatmapColorPallette)
        }
    }, [SectionData]); // ✅ Runs only when `SectionData` changes

    useEffect(() => {
        

        ChangesTrue()
        if (SelectedHeatmapTypes?.value === 1) {
            const dataPointControlList = formData?.dataPointControlList || {};

            const selectedOptions = [];

            Object.entries(dataPointControlList).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    // Handle array-type categories like 'department', 'user'
                    value.forEach(item => {
                        if (item.selected) {
                            selectedOptions.push({ value: parseInt(item.id), label: item.name, id: item.id, name: item.name, type: item.dataPointType });
                        }
                    });
                } else if (value?.selected) {
                    // Handle object-type like 'overall'
                    selectedOptions.push({ value: parseInt(value.id), label: value.name, id: value.id, name: value.name, type: value.dataPointType });
                }
            });

            const comparativeType = selectedOptions.find(item => String(item.id) === String(SectionData?.attributeData?.controlData?.comparisonType?.id) && item.type === SectionData?.attributeData?.controlData?.comparisonType?.type);

            if (comparativeType) {

                setSelectedComparisonTypes({
                    label: comparativeType.label, 
                    value: comparativeType.value
                })
                setFormData({
                    ...formData,
                    comparisonType: {
                        "id": comparativeType.value,
                        "type": comparativeType.type
                    },
                    dataPointControlList: SectionData?.attributeData?.controlData?.dataPointControlList1,
                    comparatives: selectedOptions,
                    heatmapType: 1
                })
            } else {

                setSelectedComparisonTypes(null)
                setFormData({
                    ...formData,
                    comparisonType: {},
                    dataPointControlList: SectionData?.attributeData?.controlData?.dataPointControlList1,
                    comparatives: selectedOptions,
                    heatmapType: 1
                })

            }
            setComparisonTypesOption(selectedOptions);
        } else if (SelectedHeatmapTypes?.value === 2) {

            const dataPointControlList = formData?.dataPointControlList || {};

            const selectedOptions = [];

            dataPointControlList?.benchmark?.forEach(item => {
                if (item.selected) {
                    selectedOptions.push({ value: parseInt(item.id), label: item.name, id: item.id, name: item.name, type: item.dataPointType });
                }
            });

            const heatmap1Item = SectionData?.attributeData?.controlData?.comparisonTypes.find(item => item.heatmapType === SelectedHeatmapTypes?.value) || [];

            const filteredComparatives = heatmap1Item.comparatives
                .filter(comp => comp.type === "overall_favorable" || comp.type === "company_total")
                .map(comp => ({
                    value: comp.id,
                    id: comp.id,
                    label: comp.name,
                    name: comp.name,
                    type: comp.type,
                }));

            const comparisonOption = [
                ...filteredComparatives,
                ...selectedOptions
            ]
            setComparisonTypesOption(comparisonOption);

            const comparativeType = comparisonOption.find(item => String(item.id) === String(SectionData?.attributeData?.controlData?.comparisonType?.id) && item.type === SectionData?.attributeData?.controlData?.comparisonType?.type);

            if (comparativeType) {
                setSelectedComparisonTypes({
                    label: comparativeType.name,
                    value: comparativeType.id
                })

                setFormData({
                    ...formData,
                    comparisonType: {
                        "id": comparativeType.id,
                        "type": comparativeType.type
                    },
                    dataPointControlList: SectionData?.attributeData?.controlData?.dataPointControlList2,
                    comparatives: [...selectedOptions, ...filteredComparatives],
                    heatmapType: 2
                })

            } else {

                setSelectedComparisonTypes(null)
                setFormData({
                    ...formData,
                    comparisonType: {},
                    dataPointControlList: SectionData?.attributeData?.controlData?.dataPointControlList2,
                    comparatives: [...selectedOptions, ...filteredComparatives],
                    heatmapType: 2
                })
            }
        }
    }, [ SelectedHeatmapTypes])


    useEffect(() => {

        ChangesTrue()
        if (SelectedHeatmapTypes?.value === 1 && formData?.dataPointControlList) {
            const dataPointControlList = formData?.dataPointControlList || {};

            const selectedOptions = [];

            Object.entries(dataPointControlList).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    // Handle array-type categories like 'department', 'user'
                    value.forEach(item => {
                        if (item.selected) {
                            selectedOptions.push({ value: parseInt(item.id), label: item.name, id: item.id, name: item.name, type: item.dataPointType });
                        }
                    });
                } else if (value?.selected) {
                    // Handle object-type like 'overall'
                    selectedOptions.push({ value: parseInt(value.id), label: value.name, id: value.id, name: value.name, type: value.dataPointType });
                }
            });

            const comparativeType = selectedOptions.find(item => String(item.id) === String(SectionData?.attributeData?.controlData?.comparisonType?.id) && item.type === SectionData?.attributeData?.controlData?.comparisonType?.type);

            if (comparativeType) {

                setSelectedComparisonTypes({
                    label: comparativeType.label, 
                    value: comparativeType.value
                })
                setFormData({
                    ...formData,
                    comparisonType: {
                        "id": comparativeType.value,
                        "type": comparativeType.type
                    },
                    comparatives: selectedOptions,
                    heatmapType: 1
                })
            } else {

                setSelectedComparisonTypes(null)
                setFormData({
                    ...formData,
                    comparatives: selectedOptions,
                    heatmapType: 1
                })

            }
            setComparisonTypesOption(selectedOptions);
        } else if (SelectedHeatmapTypes?.value === 2 && formData?.dataPointControlList) {

            const dataPointControlList = formData?.dataPointControlList || {};

            const selectedOptions = [];

            dataPointControlList?.benchmark?.forEach(item => {
                if (item.selected) {
                    selectedOptions.push({ value: parseInt(item.id), label: item.name, id: item.id, name: item.name, type: item.dataPointType });
                }
            });

            const heatmap1Item = SectionData?.attributeData?.controlData?.comparisonTypes.find(item => item.heatmapType === SelectedHeatmapTypes?.value) || [];

            const filteredComparatives = heatmap1Item.comparatives
                .filter(comp => comp.type === "overall_favorable" || comp.type === "company_total")
                .map(comp => ({
                    value: comp.id,
                    id: comp.id,
                    label: comp.name,
                    name: comp.name,
                    type: comp.type,
                }));

            const comparisonOption = [
                ...filteredComparatives,
                ...selectedOptions
            ]
            setComparisonTypesOption(comparisonOption);

            const comparativeType = comparisonOption.find(item => String(item.id) === String(SectionData?.attributeData?.controlData?.comparisonType?.id) && item.type === SectionData?.attributeData?.controlData?.comparisonType?.type);

            if (comparativeType) {
                setSelectedComparisonTypes({
                    label: comparativeType.name,
                    value: comparativeType.id
                })

                setFormData({
                    ...formData,
                    comparisonType: {
                        "id": comparativeType.id,
                        "type": comparativeType.type
                    },
                    heatmapType: 2,
                    comparatives: [...selectedOptions, ...filteredComparatives],

                })

            } else {

                setSelectedComparisonTypes(null)
                setFormData({
                    ...formData,
                    comparisonType: {},
                    heatmapType: 2,
                    comparatives: [...selectedOptions, ...filteredComparatives],

                })
            }
        }
    }, [formData?.dataPointControlList])

    const handleComparative = (e) => {
        ChangesTrue()
        setSelectedComparisonTypes({
            label: e.label,
            value: e.value
        })
        setFormData({
            ...formData,
            comparisonType: {
                "id": e.value,
                "type": e.type || e.label
            },
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
            const hasSelectedIntention = outcome.intentions?.some(intention => intention.selected);
            return {
                ...outcome,
                selected: (hasSelectedIntention && formData?.showOutcomes) ? true : false
            };
        });
    };

    function hasInvalidPointValues(settingsArray = []) {
        for (let i = 1; i < settingsArray.length; i++) {
          const prev = parseFloat(settingsArray[i - 1]?.pointValue);
          const curr = parseFloat(settingsArray[i]?.pointValue);
      
          if (isNaN(prev) || isNaN(curr) || curr <= prev) {
            return true;
          }
        }
        return false;
      }

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

            if (!hasAtLeastOneSelected()) {
                showErrorToast("Please select at least one data point.");
                return;
              }
            if (!hasAtLeastOneObjectPointSelected()) {
                showErrorToast("Please select at least one object point.");
                return;
              }
            const objectControlList = syncOutcomeSelection(formData?.objectControlList)
            if (!formData?.title) {
                showErrorToast("Enter Title to save")
                return;
            }
            if (hasInvalidPointValues(formData.dataCoRelationSettings)) {
                showErrorToast("Enter correct point values")
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

    const [showDataCorrelation, setShowDataCorrelation] = useState(false);
    const dataCorrelationClose = () => setShowDataCorrelation(false);
    const dataCorrelationSaveClose = () => {
        if (hasInvalidPointValues(formData.dataCoRelationSettings)) {
            showErrorToast("Enter correct point values")
            return;
        }    
        setShowDataCorrelation(false)
    };
    const dataCorrelationShow = () => setShowDataCorrelation(true);
    const [heatMapControl, setHeatMapControl] = useState(false);
    const heatMapClose = () => setHeatMapControl(false);
    const heatMapShow = () => {
        setHeatMapControl(true)
        setTimeout(() => {
            setFormData({
                ...formData,
                instructionFlag: true,
            });

        }, 100);
    };

    function updateDataCoRelationSettings(color, baseSettings, type) {
        return baseSettings.map((item, index) => ({
            ...item,
            [type]: color[index],
        }));
    }

    const updatedSettings = (type, color) => {
        ChangesTrue()
        setFormData({
            ...formData,
            dataCoRelationSettings: updateDataCoRelationSettings(color, formData?.dataCoRelationSettings, type)
        })

    }


    const handleDataCoRelationChange = (index, field, value) => {
        ChangesTrue()
        setFormData((prev) => {
            const updated = [...prev.dataCoRelationSettings];

            if (field === 'pointValue') {
                const numericValue = parseInt(value);
                const prevPoint = index > 0 ? updated[index - 1].pointValue : -Infinity;

                if (numericValue <= prevPoint) {
                    alert(`Point value at index ${index} must be greater than the previous (${prevPoint})`);
                    return prev;
                }

                updated[index] = { ...updated[index], [field]: numericValue };
            } else {
                updated[index] = { ...updated[index], [field]: value };
            }

            return { ...prev, dataCoRelationSettings: updated };
        });
    };

    

    return (
        <>
            <div className="mt-xl-4 mt-3">
                {ShowDataPointModal &&
                    <DataPointModal benchmarkLimit={3} ChangesTrue={ChangesTrue} showOverall={SelectedHeatmapTypes.value === 1} ShowDataPointModal={ShowDataPointModal} setShowDataPointModal={setShowDataPointModal} formData={formData} setFormData={setFormData} dataPointControlList={formData?.dataPointControlList} />
                }
                {ShowObjectPointModal &&
                    <HeatmapObjectPointModal ChangesTrue={ChangesTrue} ShowObjectPointModal={ShowObjectPointModal} setShowObjectPointModal={setShowObjectPointModal} formData={formData} setFormData={setFormData} objectControlList={formData?.objectControlList} />
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
                    <Form.Label>1. Select Heatmap Type</Form.Label>
                    <SelectField placeholder="Select Comparative" options={HeatmapTypesOption} value={SelectedHeatmapTypes} onChange={setSelectedHeatmapTypes} />
                </Form.Group>
                <Form.Group className="form-group" >
                    <Form.Label>2. Select Data Points to Display</Form.Label>
                    <Button variant="primary ripple-effect w-100" onClick={() => { setShowDataPointModal(true) }}>Data Point Control Panel</Button>
                </Form.Group>
                <Form.Group className="form-group" >
                    <Form.Label>3. Select Comparative</Form.Label>
                    <SelectField placeholder="Select Comparative" options={ComparisonTypesOption} value={SelectedComparisonTypes} onChange={handleComparative} />
                </Form.Group>
                <Form.Group className="form-group" >
                    <Form.Label>4. Select Objects to Display</Form.Label>
                    <Button variant="primary ripple-effect w-100" onClick={() => { setShowObjectPointModal(true) }}>Object Control Panel</Button>
                </Form.Group>
                <Form.Group className="form-group" >
                    <Form.Label>5. Configure Correlation Properties</Form.Label>
                    <Button variant="primary ripple-effect w-100" onClick={dataCorrelationShow}>Data Correlation Settings</Button>
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
                <Form.Group className="form-group">
                    <Form.Check
                        className="me-0 form-check-sm"
                        type="checkbox"
                        id="check23"
                        name="instructionFlag"
                        checked={formData.instructionFlag}
                        onChange={handleInputChange}
                        label={
                            <div htmlFor="check23" style={{ color: '#000' }} className="primary-color">
                                Add Instructions{' '}
                                {formData.instructionFlag && (
                                    <em
                                        onClick={(e) => {
                                            e.stopPropagation(); // prevent checkbox toggle
                                            heatMapShow(); // trigger icon click handler
                                        }}
                                        className="icon-table-edit"
                                        style={{ color: 'blue' }}
                                    />
                                )}
                            </div>
                        }
                    />
                </Form.Group>
                <Form.Group className="form-group" >
                    <Form.Check className='me-0 form-check-sm' type="checkbox" id='check24'
                        name="expandAllFlag" checked={formData.expandAllFlag} onChange={handleInputChange}
                        label={<div htmlFor="check23" style={{ color: '#000' }} className="primary-color">Expand All </div>}
                    />
                </Form.Group>
                <Form.Group className="form-group" >
                    <Form.Check className='me-0 form-check-sm' type="checkbox" id='check24'
                        name="showOutcomes" checked={formData.showOutcomes} onChange={handleInputChange}
                        label={<div htmlFor="check23" style={{ color: '#000' }} className="primary-color">Show Outcomes </div>}
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
                    />     </Form.Group>
                <Button onClick={handleSubmit} variant="primary ripple-effect w-100">Save</Button>
            </div>

            {/* Data Correlation Settings modal */}
            <ModalComponent modalHeader="Data Correlation Settings" size={'xl'} show={showDataCorrelation} onHandleCancel={dataCorrelationClose}>
                <div className="dataCorrection d-flex flex-row align-items-center " style={{ width: '100%', justifyContent: 'space-evenly' }}>
                    <div className="dataCorrection d-flex flex-column align-items-center ">
                        <p>HEAT MAP COLOR SELECTOR</p>
                        <div style={{ width: '' }} className="d-flex align-items-center justify-content-between gap-2 mb-3 flex-sm-nowrap flex-wrap">
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <h3 className="colorPalettes_title">+</h3>
                                <div key={`inline-radio`} style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(5, 1fr)',
                                    gap: '1rem',
                                    width: '100%',
                                }}>
                                    {heatmapColorPallette?.positive.map((item) => (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                                            <div>
                                                <Form.Check className='m-0'
                                                    inline
                                                    label=""
                                                    type='radio'
                                                    onChange={() => { updatedSettings("positiveColor", item) }}
                                                    checked={formData?.dataCoRelationSettings?.every((data, index) =>
                                                        item[index] === (data.positiveColor)
                                                    )}
                                                />
                                            </div>
                                            {item.map((color) => (

                                                <div style={{ backgroundColor: color, height: '1.6rem', width: '1.6rem' }}></div>
                                            ))}
                                        </div>


                                    ))}
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderLeft: '1px solid gray', paddingLeft: '1rem', marginLeft: '0.5rem' }}>
                                <h3 className="colorPalettes_title">-</h3>
                                <div key={`inline-radio`} style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(5, 1fr)',
                                    gap: '1rem',
                                    width: '100%',

                                }}>
                                    {heatmapColorPallette?.negative.map((item) => (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                                            <div >
                                                <Form.Check className='m-0'
                                                    inline
                                                    label=""
                                                    type="radio"
                                                    onChange={() => { updatedSettings("negativeColor", item) }}
                                                    checked={formData?.dataCoRelationSettings?.every((data, index) =>
                                                        item[index] === (data.negativeColor)
                                                    )}
                                                />
                                            </div>
                                            {item.map((color) => (

                                                <div style={{ backgroundColor: color, height: '1.6rem', width: '1.6rem' }}></div>
                                            ))}
                                        </div>


                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="dataCorrection d-flex flex-column align-items-center ">
                        <p>DATA CORRELATION COEFFICIENTS</p>
                        <Form>
                            {formData?.dataCoRelationSettings?.map((item, index) => {
                                const prevValue = formData.dataCoRelationSettings?.[index - 1]?.pointValue ?? -Infinity;
                                const isInvalid = parseFloat(item.pointValue) <= parseFloat(prevValue);

                                return (
                                    <div key={index}>
                                        <div style={{marginBottom:index > 0 && isInvalid?"-0.8rem":0}} className="d-flex gap-2">
                                            <InputGroup className="mb-3 d-flex">
                                                <InputGroup.Text>+/-</InputGroup.Text>
                                                <InputField
                                                    type="number"
                                                    value={item?.pointValue}
                                                    onChange={(e) =>
                                                        handleDataCoRelationChange(index, 'pointValue', e.target.value)
                                                    }
                                                />
                                            </InputGroup>

                                            <Form.Group className="form-group mb-0">
                                                <InputField
                                                    type="color"
                                                    className="form-control-color p-1"
                                                    value={item?.positiveColor}
                                                    onChange={(e) =>
                                                        handleDataCoRelationChange(index, 'positiveColor', e.target.value)
                                                    }
                                                />
                                            </Form.Group>

                                            <Form.Group className="form-group mb-0">
                                                <InputField
                                                    type="color"
                                                    className="form-control-color p-1"
                                                    value={item?.negativeColor}
                                                    onChange={(e) =>
                                                        handleDataCoRelationChange(index, 'negativeColor', e.target.value)
                                                    }
                                                />
                                            </Form.Group>
                                        </div>

                                        {index > 0 && isInvalid && (
                                            <span style={{ fontSize: '12px', color: 'red' }} className="noteText fw-medium">
                                                * Point value should be greater than previous value
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </Form>


                    </div>
                </div>
                <div className="d-flex justify-content-end gap-2">
                    <Button variant='primary' className='ripple-effect' onClick={dataCorrelationSaveClose}>Save</Button>
                    <Button variant='secondary' className='ripple-effect' onClick={dataCorrelationClose}>cancel</Button>
                </div>
            </ModalComponent>

            {/* Heat Map Instructions modal */}
            <ModalComponent modalHeader="Heat Map Instructions" show={heatMapControl} onHandleCancel={heatMapClose}>
                <Form>
                    <Form.Group className="form-group mb-0" >
                        <TextEditor
                            placeholder="Enter Instructions"
                            value={formData?.instructionData}
                            onChange={handleInstructionData}
                        />
                    </Form.Group>
                    <div className="d-flex justify-content-end gap-2 mt-3">
                        <Button onClick={heatMapClose} variant='primary' className='ripple-effect'>Save</Button>
                    </div>
                </Form>
            </ModalComponent>
        </>
    )
}

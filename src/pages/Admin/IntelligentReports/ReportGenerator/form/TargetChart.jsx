import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Collapse, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Button, InputField, SelectField } from '../../../../../components';
import ObjectPointModal from '../ReportDataTable/ObjectPointModal';
import DataPointModal from '../ReportDataTable/DataPointModal';
import ColorPellatesIR from 'components/ColorPellates/ColorPallateIR';
import { useDispatch } from 'react-redux';
import { updateIRReportData } from '../../../../../redux/IRReportData/index.slice';
import { showErrorToast } from 'helpers/toastHelper';
import { Tooltip } from 'bootstrap'; // Bootstrap must be installed


export default function TargetChart({ updateSection, SectionId, SectionData, }) {
    const [paletteCollapse, setPaletteCollapse] = useState(false);
    const [ComparisonList, setComparisonList] = useState([])
    const [SelectedComparison, setSelectedComparison] = useState({})
    const [ShowObjectPointModal, setShowObjectPointModal] = useState(false)
    const [ShowDataPointModal, setShowDataPointModal] = useState(false)

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

    const tooltipMessage = "The drag and drop function will allow the user to move around the objects for different display orders in the chart."

    // Initialize tooltips on mount
    useEffect(() => {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltipTriggerList.forEach(el => new Tooltip(el));
    }, []);

    const [formData, setFormData] = useState({
        controlTitle: "",
        title: "",
        subTitle: "",
        comparisonList: [],
        comparisonType: "",
        responseRateDistribution: false,
        IRdatasetPropertiesFlag: false,
        referenceDataPropertiesFlag: false,
        decimalOptions: [],
        selectedDecimalPoint: "",
        dataPointControlList: {},
        colorPalletes: {},
        selectedPalletteID: "",
        objectControlList: "",
        selectedTargetDatasets: []
    });

    // ✅ Pre-fill state when `SectionData` is available
    useEffect(() => {
        if (SectionData?.attributeData?.controlData) {
            setComparisonList(SectionData?.attributeData?.controlData?.comparisonList.map(item => ({
                value: item?.value,
                label: item?.name
            })));
            setSelectedComparison({
                value: SectionData?.attributeData?.controlData.comparisonType,
                label: SectionData?.attributeData?.controlData?.comparisonList.find(item => item.value === SectionData?.attributeData?.controlData.comparisonType)?.name
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

    const handleComparisionChange = async (type) => {

        ChangesTrue()
        if (type === 'object') {
            const updatedData = formData?.objectControlList

            const selectedTargetDatasets = [];

            updatedData.forEach((outcome) => {

                if (outcome.selected) {
                    selectedTargetDatasets.push({
                        id: parseInt(outcome.outcome_id),
                        dataPointType: "outcome", // Can be changed dynamically if you track types
                        name: outcome.outcome_name,
                        targetValue: SectionData?.attributeData?.controlData?.selectedTargetDatasets?.find(item => item.id == outcome.outcome_id)?.targetValue || 0
                    });
                }

                outcome.intentions?.forEach((intention) => {
                    if (intention.selected) {

                        selectedTargetDatasets.push({
                            id: parseInt(intention?.intention_id.split("~")[1]),
                            dataPointType: "intention", // Can be changed dynamically if you track types
                            name: intention?.intention_name,
                            targetValue: SectionData?.attributeData?.controlData?.selectedTargetDatasets?.find(item => item.id == intention?.intention_id.split("~")[1])?.targetValue || 0
                        });
                    }

                    intention.questions?.forEach((question) => {
                        if (question.selected) {
                            selectedTargetDatasets.push({
                                id: parseInt(question.question_id),
                                dataPointType: "question", // Can be changed dynamically if you track types
                                name: question?.question,
                                targetValue: SectionData?.attributeData?.controlData?.selectedTargetDatasets?.find(item => item.id == question.question_id)?.targetValue || 0
                            });
                        }
                    });
                });
            });

            setFormData((prev) => ({
                ...prev,
                selectedTargetDatasets,
                comparisonType: type
            }));

        } else if (type === 'datapoint') {
            const updatedData = formData?.dataPointControlList

            const selectedTargetDatasets = [];

            if (updatedData?.overall?.selected) {
                selectedTargetDatasets.push({
                    id: updatedData?.overall.id,
                    dataPointType: "overall",
                    name: updatedData?.overall.name || "overall",
                    targetValue: SectionData?.attributeData?.controlData?.selectedTargetDatasets?.find(item => item.id === updatedData?.overall.id)?.targetValue || 0
                });
            }

            Object.entries(updatedData).forEach(([key, items]) => {
                if (Array.isArray(items) && key !== "demographic") {
                    items.forEach(item => {
                        if (item.selected) {
                            selectedTargetDatasets.push({
                                id: item.id,
                                dataPointType: key,
                                name: item.name,
                                targetValue: SectionData?.attributeData?.controlData?.selectedTargetDatasets?.find(data => data.id === item.id)?.targetValue || 0
                            });
                        }
                    });
                }
            });

            setFormData({
                ...formData,
                selectedTargetDatasets, // ✅ Store in formData or wherever needed
                comparisonType: type
            });
        }
    }

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

    const handleComparisonInput = (e) => {
        ChangesTrue()
        setSelectedComparison({
            label: e.label,
            value: e.value
        })
        // setFormData({
        //     ...formData,
        //     comparisonType: e.value
        // })
        handleComparisionChange(e.value)
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

    const handleTargetChange = (index, value) => {
        ChangesTrue()
        if (isNaN(value) || value > 100) {
            showErrorToast("Target value should be between 0 to 100")
            return
        }; // 🔴 prevent update if >= 100 or invalid

        setFormData((prev) => {
            const updatedDatasets = [...prev.selectedTargetDatasets];

            // Update the targetValue at the given index
            updatedDatasets[index] = {
                ...updatedDatasets[index],
                targetValue: parseFloat(value) || 0, // fallback to 0 if input is empty
            };

            return {
                ...prev,
                selectedTargetDatasets: updatedDatasets,
            };
        });
    };

    useEffect(() => {
        if (formData?.comparisonType === "object") {
                handleComparisionChange("object")
        }
    }, [ formData?.objectControlList])
    useEffect(() => {
        if (formData?.comparisonType === "datapoint") {
                handleComparisionChange("datapoint")

        }
    }, [formData?.dataPointControlList])


    const handleDataPointModal = (value) => {
        setShowDataPointModal(value)
    }
    const handleObjectPointModal = (value) => {
        setShowObjectPointModal(value)
    }

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(formData.selectedTargetDatasets);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        ChangesTrue()
        setFormData((prev) => ({
            ...prev,
            selectedTargetDatasets: items,
        }));
    };

    const handleColorPaletteSelect = (paletteId) => {
        ChangesTrue()
        setFormData({
            ...formData,
            selectedPalletteID: paletteId,
        });
    }




    return (
        <div className="mt-xl-4 mt-3">
            {ShowDataPointModal &&
                <DataPointModal ChangesTrue={ChangesTrue} ShowDataPointModal={ShowDataPointModal} setShowDataPointModal={handleDataPointModal} formData={formData} setFormData={setFormData} dataPointControlList={formData?.dataPointControlList} />
            }
            {ShowObjectPointModal &&
                <ObjectPointModal ChangesTrue={ChangesTrue} ShowObjectPointModal={ShowObjectPointModal} setShowObjectPointModal={handleObjectPointModal} formData={formData} setFormData={setFormData} objectControlList={formData?.objectControlList} />
            }
            <Form.Group className="form-group">
                <Form.Label>Title</Form.Label>
                <InputField type="text" name="title" placeholder="Enter Title" value={formData.title} onChange={handleInputChange} />
            </Form.Group>

            <Form.Group className="form-group">
                <Form.Label>Subtitle</Form.Label>
                <InputField type="text" name="subTitle" placeholder="Enter Subtitle" value={formData.subTitle} onChange={handleInputChange} />
            </Form.Group>




            {formData?.comparisonType === "datapoint" &&
                <>
                    <div style={{ backgroundColor: '#E5E5E6', padding: '0.5rem', paddingBottom: '1px', borderRadius: '0.5rem', marginBottom: '0.5rem' }}>

                        <Form.Group className="form-group" >
                            <Form.Label>1. Select Comparison Type</Form.Label>
                            <SelectField placeholder="Select Comparison Type" options={ComparisonList} value={SelectedComparison} onChange={handleComparisonInput} />
                        </Form.Group>

                        <Form.Group className="form-group" >
                            <Form.Label>2. Select Data Points to Display</Form.Label>
                            <Button variant="primary ripple-effect w-100" onClick={() => { setShowDataPointModal(true) }}>Data Point Control Panel</Button>

                            {formData?.selectedTargetDatasets.length > 0 && formData?.comparisonType === "datapoint" &&
                                <div className="bg-light p-3 rounded" style={{ maxWidth: "330px" }}>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <strong>Selected Data Points</strong>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <i data-bs-toggle={"tooltip"}
                                                data-bs-placement="top"
                                                title={tooltipMessage}
                                                style={{ marginRight: '0.5rem' }} className="bi bi-info-circle" /> <strong>Target Values</strong>
                                        </div>
                                    </div>

                                    <DragDropContext onDragEnd={handleDragEnd}>
                                        <Droppable droppableId="tornado-list">
                                            {(provided) => (
                                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                                    {formData?.selectedTargetDatasets?.map((item, index) => (
                                                        <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                                                            {(dragProvided) => (
                                                                <div
                                                                    key={item.id}
                                                                    ref={dragProvided.innerRef}
                                                                    {...dragProvided.draggableProps}
                                                                    {...dragProvided.dragHandleProps}
                                                                    className="d-flex align-items-center mb-2 gap-2"
                                                                >
                                                                    <span style={{ cursor: "grab" }}>☰</span>
                                                                    <div
                                                                        className="flex-grow-1 px-2 py-1 border border-danger rounded text-truncate bg-white"
                                                                        style={{ minWidth: '8rem', maxWidth: '8rem' }}
                                                                    >
                                                                        {item.name}
                                                                    </div>
                                                                    <Form.Control
                                                                        value={item.targetValue}
                                                                        onChange={(e) => handleTargetChange(index, e.target.value)}
                                                                        className="w-25"
                                                                    />
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    </DragDropContext>
                                </div>}
                        </Form.Group>
                    </div>
                    <Form.Group className="form-group" >
                        <Form.Label>3. Select Objects to Display</Form.Label>
                        <Button variant="primary ripple-effect w-100" onClick={() => { setShowObjectPointModal(true) }}>Object Control Panel </Button>

                        {formData?.selectedTargetDatasets.length > 0 && formData?.comparisonType === "object" &&
                            <div className="bg-light p-3 rounded" style={{ maxWidth: "330px", minWidth: "330px" }}>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <strong>Selected Data Points</strong>
                                    <div style={{ display: 'flex' }}>
                                        <i data-bs-toggle={"tooltip"}
                                            data-bs-placement="top"
                                            title={tooltipMessage}
                                            style={{ marginRight: '0.5rem' }} className="bi bi-info-circle" /> <strong>Target Values</strong>
                                    </div>
                                </div>

                                <DragDropContext onDragEnd={handleDragEnd}>
                                    <Droppable droppableId="tornado-list">
                                        {(provided) => (
                                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                                {formData?.selectedTargetDatasets?.map((item, index) => (
                                                    <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                                                        {(provided) => (
                                                            <div
                                                                key={item.id}
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className="d-flex align-items-center mb-2 gap-2"
                                                            >
                                                                <span style={{ cursor: "grab" }}>☰</span>
                                                                <div
                                                                    className="flex-grow-1 px-2 py-1 border border-danger rounded text-truncate bg-white"
                                                                    style={{ minWidth: '8rem', maxWidth: '8rem' }}
                                                                >
                                                                    {item.name}
                                                                </div>
                                                                <Form.Control
                                                                    value={item.targetValue}
                                                                    onChange={(e) => handleTargetChange(index, e.target.value)}
                                                                    className="w-25"
                                                                />
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            </div>}


                    </Form.Group>

                </>
            }
            {formData?.comparisonType === "object" &&
                <>
                    <div style={{ backgroundColor: '#E5E5E6', padding: '0.5rem', paddingBottom: '1px', borderRadius: '0.5rem', marginBottom: '0.5rem' }}>

                        <Form.Group className="form-group" >
                            <Form.Label>1. Select Comparison Type</Form.Label>
                            <SelectField placeholder="Select Comparison Type" options={ComparisonList} value={SelectedComparison} onChange={handleComparisonInput} />
                        </Form.Group>
                        <Form.Group className="form-group" >
                            <Form.Label>2. Select Objects to Display</Form.Label>
                            <Button variant="primary ripple-effect w-100" onClick={() => { setShowObjectPointModal(true) }}>Object Control Panel </Button>

                            {formData?.selectedTargetDatasets.length > 0 && formData?.comparisonType === "object" &&
                                <div className="bg-light p-3 rounded" style={{ maxWidth: "330px" }}>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <strong>Selected Object Points</strong>
                                        <div style={{ display: 'flex' }}>
                                            <i data-bs-toggle={"tooltip"}
                                                data-bs-placement="top"
                                                title={tooltipMessage}
                                                style={{ marginRight: '0.5rem' }} className="bi bi-info-circle" /> <strong>Target Values</strong>
                                        </div>
                                    </div>

                                    <DragDropContext onDragEnd={handleDragEnd}>
                                        <Droppable droppableId="tornado-list">
                                            {(provided) => (
                                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                                    {formData?.selectedTargetDatasets?.map((item, index) => (
                                                        <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                                                            {(provided) => (
                                                                <div
                                                                    key={item.id}
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    className="d-flex align-items-center mb-2 gap-2"
                                                                >
                                                                    <span style={{ cursor: "grab" }}>☰</span>
                                                                    <div
                                                                        className="flex-grow-1 px-2 py-1 border border-danger rounded text-truncate bg-white"
                                                                        style={{ minWidth: '8rem', maxWidth: '8rem' }}
                                                                    >
                                                                        {item.name}
                                                                    </div>
                                                                    <Form.Control
                                                                        value={item.targetValue}
                                                                        onChange={(e) => handleTargetChange(index, e.target.value)}
                                                                        className="w-25"
                                                                    />
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    </DragDropContext>
                                </div>}


                        </Form.Group>


                    </div>
                    <Form.Group className="form-group" >
                        <Form.Label>3. Select Data Points to Display</Form.Label>
                        <Button variant="primary ripple-effect w-100" onClick={() => { setShowDataPointModal(true) }}>Data Point Control Panel</Button>

                        {formData?.selectedTargetDatasets.length > 0 && formData?.comparisonType === "datapoint" &&
                            <div className="bg-light p-3 rounded" style={{ maxWidth: "330px" }}>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <strong>Selected Data Points</strong>
                                    <div style={{ display: 'flex' }}>
                                        <i data-bs-toggle={"tooltip"}
                                            data-bs-placement="top"
                                            title={tooltipMessage}
                                            style={{ marginRight: '0.5rem' }} className="bi bi-info-circle" /> <strong>Target Values</strong>
                                    </div>
                                </div>

                                <DragDropContext onDragEnd={handleDragEnd}>
                                    <Droppable droppableId="tornado-list">
                                        {(provided) => (
                                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                                {formData?.selectedTargetDatasets?.map((item, index) => (
                                                    <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                                                        {(dragProvided) => (
                                                            <div
                                                                key={item.id}
                                                                ref={dragProvided.innerRef}
                                                                {...dragProvided.draggableProps}
                                                                {...dragProvided.dragHandleProps}
                                                                className="d-flex align-items-center mb-2 gap-2"
                                                            >
                                                                <span style={{ cursor: "grab" }}>☰</span>
                                                                <div
                                                                    className="flex-grow-1 px-2 py-1 border border-danger rounded text-truncate bg-white"
                                                                    style={{ minWidth: '8rem', maxWidth: '8rem' }}
                                                                >
                                                                    {item.name}
                                                                </div>
                                                                <Form.Control
                                                                    value={item.targetValue}
                                                                    onChange={(e) => handleTargetChange(index, e.target.value)}
                                                                    className="w-25"
                                                                />
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            </div>}
                    </Form.Group>

                </>
            }



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
                />                <Form.Label style={{ color: '#000' }} className='form-color-label mb-0'>Color Palette</Form.Label>
            </div>
            <Collapse in={paletteCollapse}>
                <div><ColorPellatesIR handleColorPaletteSelect={handleColorPaletteSelect} selectedPalletteID={formData?.selectedPalletteID} ColorPellates={SectionData?.attributeData?.controlData?.colorPalletes} /></div>
            </Collapse>
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

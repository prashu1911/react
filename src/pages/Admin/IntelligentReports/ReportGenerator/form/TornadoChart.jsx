import React, { useEffect, useState } from 'react';
import { Collapse, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { showErrorToast } from 'helpers/toastHelper';
import ObjectPointModal from '../ReportDataTable/ObjectPointModal';
import DataPointModal from '../ReportDataTable/DataPointModal';
import { Button, InputField, SelectField } from '../../../../../components';
import ColorPellatesIR from 'components/ColorPellates/ColorPallateIR';
import { useDispatch } from 'react-redux';
import { updateIRReportData } from '../../../../../redux/IRReportData/index.slice';
import { Tooltip } from 'bootstrap'; // Bootstrap must be installed

export default function TornadoChart({ updateSection, SectionId, SectionData, }) {
    const [paletteCollapse, setPaletteCollapse] = useState(false);
    const [ComparisonList, setComparisonList] = useState([])
    const [SelectedComparison, setSelectedComparison] = useState({})
    const [ShowObjectPointModal, setShowObjectPointModal] = useState(false)
    const [ShowDataPointModal, setShowDataPointModal] = useState(false)

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
        objectControlList: [],
        selectedTornadoDatasets: []
    });

    const tooltipMessage="Tornado Charts are restricted to 2 comparisons"

    // Initialize tooltips on mount
    useEffect(() => {
       const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
       tooltipTriggerList.forEach(el => new Tooltip(el));
   }, []);

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
      

      const hasAtLeastOneObjectPointSelected = () => {
        return formData?.objectControlList?.some(outcome =>
          outcome.selected ||
          outcome.intentions?.some(intn =>
            intn.selected ||
            intn.questions?.some(q => q.selected)
          )
        );
    };




    const handleSubmit = async () => {
        const hasControlTrue = formData.selectedTornadoDatasets?.some(item => item.control === true);

        if (!hasAtLeastOneObjectPointSelected()) {
            showErrorToast("Please select at least one object point.");
            return;
          }

        if (!hasAtLeastOneSelected()) {
          showErrorToast("Please select at least one data point.");
          return;
        }
        if (!hasControlTrue) {
            showErrorToast("At least one selected Tornado Dataset must have control set to true.");
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
            }); // ✅ Send all updated values
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


    const handleControlChange = (selectedId) => {
        console.log("selectedId", selectedId);
        
        const updated = formData.selectedTornadoDatasets.map((item) => ({
            ...item,
            control: item.id === selectedId
        }));
        ChangesTrue()
        setFormData((prev) => ({
            ...prev,
            selectedTornadoDatasets: updated
        }));
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const reordered = Array.from(formData.selectedTornadoDatasets);
        const [movedItem] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, movedItem);
        ChangesTrue()
        setFormData((prev) => ({
            ...prev,
            selectedTornadoDatasets: reordered
        }));
    };

    function limitSelectedToTwo(dataPointControlList) {
        let selectedCounter = 0;

        // Handle overall separately
        if (dataPointControlList.overall?.selected) {
            selectedCounter += 1;
        }

        // Create a deep clone so we don't mutate the original object
        const updated = {
            ...dataPointControlList,
            overall: { ...dataPointControlList.overall },
        };

        if (updated.overall?.selected && selectedCounter > 2) {
            updated.overall.selected = false;
        }

        // Loop through all keys (excluding "overall")
        Object.keys(updated).forEach((key) => {
            if (key === "overall") return;

            if (Array.isArray(updated[key])) {
                updated[key] = updated[key].map((item) => {
                    if (item.selected) {
                        if (selectedCounter < 2) {
                            selectedCounter += 1;
                            return item; // keep selected
                        } else {
                            return { ...item, selected: false }; // reset selected
                        }
                    }
                    return item;
                });
            }
        });

        return updated;
    }


    const handleComparisionChange = async (type) => {
        if (type === 'object') {
            const updatedData = formData?.objectControlList
            let count = 0
            await formData?.objectControlList.forEach((outcome, outcomeIndex) => {
                if (outcome.selected) {
                    count += 1;
                    if (count > 2) {
                        updatedData[outcomeIndex].selected = false;
                    }
                }

                outcome.intentions?.forEach((intention, intentionIndex) => {
                    if (intention.selected) {
                        count += 1;
                        if (count > 2) {
                            updatedData[outcomeIndex].intentions[intentionIndex].selected = false;
                        }

                    }

                    intention.questions?.forEach((question, questionIndex) => {
                        if (question.selected) {
                            count += 1;
                            if (count > 2) {
                                updatedData[outcomeIndex].intentions[intentionIndex].questions[questionIndex].selected = false;
                            }
                        }
                    });
                });
            });

            const selectedTornadoDatasets = [];

            updatedData.forEach((outcome) => {

                if (outcome.selected) {
                    selectedTornadoDatasets.push({
                        id: parseInt(outcome.outcome_id),
                        dataPointType: "Outcome", // Can be changed dynamically if you track types
                        name: outcome.outcome_name,
                        control: false
                    });
                }

                outcome.intentions?.forEach((intention) => {
                    if (intention.selected) {

                        selectedTornadoDatasets.push({
                            id: intention?.intention_id.split("~")[1],
                            dataPointType: "Intention", // Can be changed dynamically if you track types
                            name: intention?.intention_name,
                            control: false
                        });
                    }

                    intention.questions?.forEach((question) => {
                        if (question.selected) {
                            selectedTornadoDatasets.push({
                                id: parseInt(question.question_id),
                                dataPointType: "Question", // Can be changed dynamically if you track types
                                name: question?.question,
                                control: false
                            });
                        }
                    });
                });
            });


            setFormData((prev) => ({
                ...prev,
                objectControlList: updatedData,
                selectedTornadoDatasets,
                comparisonType: type
            }));

        } else if (type === 'datapoint') {
            const updatedData = await limitSelectedToTwo(formData?.dataPointControlList)

            const selectedTornadoDatasets = [];

            if (updatedData?.overall?.selected) {
                selectedTornadoDatasets.push({
                    id: updatedData.overall.id,
                    dataPointType: "overall",
                    name: updatedData.overall.name || "overall",
                    control: true
                });
            }

            Object.entries(updatedData).forEach(([key, items]) => {
                if (Array.isArray(items) && key !== "demographic") {
                    items.forEach(item => {
                        if (item.selected) {
                            selectedTornadoDatasets.push({
                                id: item.id,
                                dataPointType: key,
                                name: item.name,
                                control: false
                            });
                        }
                    });
                }
            });
            setFormData({
                ...formData,
                dataPointControlList: updatedData,
                selectedTornadoDatasets, // ✅ Store in formData or wherever needed
                comparisonType: type
            });





        }
    }


    const handleComparisonInput = async (e) => {
        setFormData({
            ...formData,
            comparisonType: e.value
        })
        ChangesTrue()
        setSelectedComparison({
            label: e.label,
            value: e.value
        })
        handleComparisionChange(e.value)
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
                <DataPointModal ChangesTrue={ChangesTrue} limit={formData?.comparisonType === "datapoint" ? 2 : 0} ShowDataPointModal={ShowDataPointModal} setShowDataPointModal={setShowDataPointModal} formData={formData} setFormData={setFormData} dataPointControlList={formData?.dataPointControlList} />
            }
            {ShowObjectPointModal &&
                <ObjectPointModal ChangesTrue={ChangesTrue} limit={formData?.comparisonType === "object" ? 2 : 0} ShowObjectPointModal={ShowObjectPointModal} setShowObjectPointModal={setShowObjectPointModal} formData={formData} setFormData={setFormData} objectControlList={formData?.objectControlList} />
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

                            {formData?.selectedTornadoDatasets.length > 0 && formData?.comparisonType === "datapoint" &&
                                <div className="bg-light p-3 rounded" style={{ maxWidth: "330px" }}>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <strong>Selected Data Points</strong>
                                        <div style={{ display: 'flex' }}>
                                            <i data-bs-toggle={"tooltip"}
                                                data-bs-placement="top"
                                                title={tooltipMessage}
                                                style={{ marginRight: '0.5rem' }} className="bi bi-info-circle" /> <strong>Control</strong>
                                        </div>
                                    </div>

                                    <DragDropContext onDragEnd={handleDragEnd}>
                                        <Droppable droppableId="tornado-list">
                                            {(provided) => (
                                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                                    {formData?.selectedTornadoDatasets?.map((item, index) => (
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
                                                                        style={{ minWidth: 0 }}
                                                                    >
                                                                        {item.name}
                                                                    </div>
                                                                    <Form.Check
                                                                        className="me-0 form-check-sm"
                                                                        type="checkbox"
                                                                        id={`control-check-${item.id}`}
                                                                        checked={item.control}
                                                                        onChange={() => handleControlChange(item.id)}
                                                                        label={
                                                                            <div htmlFor={`control-check-${item.id}`} className="primary-color" />
                                                                        }
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

                        {formData?.selectedTornadoDatasets.length > 0 && formData?.comparisonType === "object" &&
                            <div className="bg-light p-3 rounded" style={{ maxWidth: "330px" }}>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <strong>Selected Data Points</strong>
                                    <div style={{ display: 'flex' }}>
                                            <i data-bs-toggle={"tooltip"}
                                                data-bs-placement="top"
                                                title={tooltipMessage}
                                                style={{ marginRight: '0.5rem' }} className="bi bi-info-circle" /> <strong>Control</strong>
                                        </div>
                                </div>

                                <DragDropContext onDragEnd={handleDragEnd}>
                                    <Droppable droppableId="tornado-list">
                                        {(provided) => (
                                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                                {formData?.selectedTornadoDatasets?.map((item, index) => (
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
                                                                    style={{ minWidth: 0 }}
                                                                >
                                                                    {item.name}
                                                                </div>
                                                                <Form.Check
                                                                    className="me-0 form-check-sm"
                                                                    type="checkbox"
                                                                    id={`control-check-${item.id}`}
                                                                    checked={item.control}
                                                                    onChange={() => handleControlChange(item.id)}
                                                                    label={
                                                                        <div htmlFor={`control-check-${item.id}`} className="primary-color" />
                                                                    }
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

                        {formData?.selectedTornadoDatasets.length > 0 && formData?.comparisonType === "object" &&
                            <div className="bg-light p-3 rounded" style={{ maxWidth: "330px" }}>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <strong>Selected Object Points</strong>
                                    <div style={{ display: 'flex' }}>
                                            <i data-bs-toggle={"tooltip"}
                                                data-bs-placement="top"
                                                title={tooltipMessage}
                                                style={{ marginRight: '0.5rem' }} className="bi bi-info-circle" /> <strong>Control</strong>
                                        </div>
                                </div>

                                <DragDropContext onDragEnd={handleDragEnd}>
                                    <Droppable droppableId="tornado-list">
                                        {(provided) => (
                                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                                {formData?.selectedTornadoDatasets?.map((item, index) => (
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
                                                                    style={{ minWidth: 0 }}
                                                                >
                                                                    {item.name}
                                                                </div>
                                                                <Form.Check
                                                                    className="me-0 form-check-sm"
                                                                    type="checkbox"
                                                                    id={`control-check-${item.id}`}
                                                                    checked={item.control}
                                                                    onChange={() => handleControlChange(item.id)}
                                                                    label={
                                                                        <div htmlFor={`control-check-${item.id}`} className="primary-color" />
                                                                    }
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

                            {formData?.selectedTornadoDatasets.length > 0 && formData?.comparisonType === "datapoint" &&
                                <div className="bg-light p-3 rounded" style={{ maxWidth: "330px" }}>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <strong>Selected Data Points</strong>
                                        <div style={{ display: 'flex' }}>
                                            <i data-bs-toggle={"tooltip"}
                                                data-bs-placement="top"
                                                title={tooltipMessage}
                                                style={{ marginRight: '0.5rem' }} className="bi bi-info-circle" /> <strong>Control</strong>
                                        </div>
                                    </div>

                                    <DragDropContext onDragEnd={handleDragEnd}>
                                        <Droppable droppableId="tornado-list">
                                            {(provided) => (
                                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                                    {formData?.selectedTornadoDatasets?.map((item, index) => (
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
                                                                        style={{ minWidth: 0 }}
                                                                    >
                                                                        {item.name}
                                                                    </div>
                                                                    <Form.Check
                                                                        className="me-0 form-check-sm"
                                                                        type="checkbox"
                                                                        id={`control-check-${item.id}`}
                                                                        checked={item.control}
                                                                        onChange={() => handleControlChange(item.id)}
                                                                        label={
                                                                            <div htmlFor={`control-check-${item.id}`} className="primary-color" />
                                                                        }
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
                    label={<div htmlFor="check13" style={{color:'#000'}} className="primary-color">Display Dataset Properties</div>}
                />
            </Form.Group>
            {/* <Form.Group className="form-group" >
                <Form.Check className='me-0 form-check-sm' type="checkbox" id='check14'
                    name="referenceDataPropertiesFlag" checked={formData.referenceDataPropertiesFlag} onChange={handleInputChange}
                    label={<div htmlFor="check14" className="primary-color">Display Reference Data Properties</div>}
                />
            </Form.Group> */}
            <div className="d-flex align-items-center mb-3">
            <Link className='pickColor' onClick={(e) => {e.preventDefault(); setPaletteCollapse(!paletteCollapse)}} aria-controls="palette" aria-expanded={paletteCollapse}
                  style={{
                    background: `linear-gradient(135deg, ${SectionData?.attributeData?.widgetData?.selectedPaletteColors?.map(c => c.colorCode).join(', ')})`, // 🔥 your gradient colors
                    color: "#fff", // optional: makes text readable
                    padding: "8px 24px",
                    borderRadius: "5px",
                    display: "inline-block",
                    textDecoration: "none",
                  }}
                  />                <Form.Label style={{color:'#000'}} className='form-color-label mb-0'>Color Palette</Form.Label>
            </div>

            {SectionData &&
                <Collapse in={paletteCollapse}>
                    <div><ColorPellatesIR handleColorPaletteSelect={handleColorPaletteSelect} selectedPalletteID={formData?.selectedPalletteID} ColorPellates={SectionData?.attributeData?.controlData?.colorPalletes} /></div>
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

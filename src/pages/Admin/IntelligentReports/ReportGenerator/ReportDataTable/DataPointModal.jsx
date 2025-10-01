import React, { useEffect, useState } from "react";
import { ModalComponent } from "components";
import { Button, Form } from "react-bootstrap";

export default function DataPointModal({benchmarkValidation=true, ChangesTrue, benchmarkLimit = false, showOverall = true, setShowDataPointModal, formData, setFormData, dataPointControlList, limit = 0 }) {
  const [selectedPoints, setSelectedPoints] = useState(putBenchmarkLast(dataPointControlList));
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [clearAllChecked, setClearAllChecked] = useState(false);


  function putBenchmarkLast(obj) {
    // Make a shallow copy to avoid mutating the original
    const newObj = {};
    // Add all keys except 'benchmark' in their order
    Object.keys(obj).forEach(key => {
      if (key !== 'benchmark') {
        newObj[key] = obj[key];
      }
    });
    // If 'benchmark' exists, add it last
    if ('benchmark' in obj) {
      newObj['benchmark'] = obj['benchmark'];
    }
    return newObj;
  }

  // Handle individual checkbox changes
  const handleCheckboxChange = (category, index, value) => {
    if (category === 'benchmark' && isBenchmarkLimitActive && value && benchmarkSelectedCount >= benchmarkLimit) {
      // Prevent selecting more than allowed in benchmark
      return;
    }
    if (value) setClearAllChecked(false);
    setSelectedPoints((prev) => {
      const updated = { ...prev };
      updated[category][index].selected = value;

      // If any checkbox is unchecked, uncheck Select All
      if (!value) setSelectAllChecked(false);

      return updated;
    });
  };

  const handleDemographicCheckboxChange = (demographicindex, index, value) => {
    if (value) setClearAllChecked(false);
    setSelectedPoints((prev) => {
      const updated = { ...prev };
      updated.demographic[demographicindex].responses[index].selected = value;

      if (!value) setSelectAllChecked(false);

      return updated;
    });
  };

  // Handle 'Select All' checkbox changes
  const handleoverall = (value) => {
    setSelectedPoints((prev) => {
      const updated = { ...prev };
      updated.overall.selected = value;
      if (!value) setSelectAllChecked(false);
      return updated;
    });
  };


  const handleSave = async () => {
    // Prepare selected options in the required format

    ChangesTrue()

    if (limit > 0) {

      const selectedTornadoDatasets = [];

      if (selectedPoints?.overall?.selected) {
        selectedTornadoDatasets.push({
          id: selectedPoints?.overall?.id,
          dataPointType: "overall",
          name: selectedPoints?.overall?.name || "overall",
          control: true
        });
      }

      Object.entries(selectedPoints).forEach(([key, items]) => {
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

      if (limit == 2) {
        setFormData({
          ...formData,
          dataPointControlList: selectedPoints,
          selectedTornadoDatasets, // ✅ Store in formData or wherever needed
        });

      } else {

        setFormData({
          ...formData,
          dataPointControlList: selectedPoints,
        });
      }
    } else {

      await setFormData({
        ...formData,
        dataPointControlList: selectedPoints,
      });

    }

    setTimeout(() => {
      setShowDataPointModal(false);
    }, 100);
  };

  const handleSelectAll = () => {

    setSelectedPoints((prev) => {
      const updatedData = { ...prev };
      if (updatedData.overall) {
        updatedData.overall.selected = true;
      }

      Object.keys(updatedData).forEach(key => {
        if (Array.isArray(updatedData[key])) {
          updatedData[key] = updatedData[key].map(item => {
            if (key === 'demographic') {
              return {
                ...item,
                responses: item.responses.map(resp => ({ ...resp, selected: true }))
              };
            } else if (key === 'benchmark' && benchmarkLimit) {
              return { ...item }
            }
            return { ...item, selected: true };
          });
        }
      });
      return updatedData;
    });
  };

  const handleClearAll = () => {
    const updatedData = { ...selectedPoints };

    if (updatedData.overall) {
      updatedData.overall.selected = false;
    }

    Object.keys(updatedData).forEach(key => {
      if (Array.isArray(updatedData[key])) {
        updatedData[key] = updatedData[key].map(item => {
          if (key === 'demographic') {
            return {
              ...item,
              responses: item.responses.map(resp => ({ ...resp, selected: false }))
            };
          } else if (key === 'benchmark' && benchmarkLimit) {
            return { ...item }
          }
          return { ...item, selected: false };
        });
      }
    });

    setSelectedPoints(updatedData);
    setSelectAllChecked(false);
    setClearAllChecked(true);
  };

  useEffect(() => {
    const allSelected = Object.entries(selectedPoints).every(([key, items]) => {
      if (key === 'overall') return items.selected;
      if (key === 'demographic') {
        return items.every(demo => demo.responses.every(resp => resp.selected));
      }
      if (key === 'benchmark' && benchmarkLimit) {
        return true
      }
      return items.every(item => item.selected);
    });

    const anySelected = Object.entries(selectedPoints).some(([key, items]) => {
      if (key === 'overall') return items.selected;
      if (Array.isArray(items)) {
        return items.some(item => {
          if (key === 'demographic') {
            return item.responses.some(resp => resp.selected);
          }
          return item.selected;
        });
      }
      return false;
    });

    setSelectAllChecked(allSelected);
    setClearAllChecked(!anySelected);
  }, [selectedPoints]);

  const maxSelectable = limit;

  // Count total selected checkboxes (excluding demographics)
  const totalSelected = Object.keys(selectedPoints)
    .filter(key => key !== 'demographic' && key !== 'overall')
    .reduce((total, key) => {
      return (
        total +
        selectedPoints[key].filter((item) => item.selected).length
      );
    }, selectedPoints?.overall?.selected ? 1 : 0); // Include overall if selected

  const isLimitReached = limit > 0 && (totalSelected >= maxSelectable);

  // Count selected in benchmark category
  const benchmarkSelectedCount = Array.isArray(selectedPoints.benchmark)
    ? selectedPoints.benchmark.filter(item => item.selected).length
    : 0;
  const isBenchmarkLimitActive = typeof benchmarkLimit === 'number' && benchmarkLimit > 0;
  const isBenchmarkLimitReached = isBenchmarkLimitActive && benchmarkSelectedCount >= benchmarkLimit;


  const objectControlClose = () => setShowDataPointModal(false);

  return (
    <ModalComponent modalHeader="Data Point Control Panel" size={"lg"} show={true} onHandleCancel={objectControlClose}>
      <div style={{ maxHeight: '550px', overflowY: 'auto' }}>
        <p className="mb-2">
          {benchmarkValidation ? "Benchmark Selection" : "Company, Department, Participant and Benchmark Selection"}
        </p>
        <p>
          <span className="noteText fw-medium">IMPORTANT NOTICE: </span>Be careful to not overload your graph with too many data points. Visualization will not render properly.
        </p>


        {
          limit === 0 &&
          // Only show Select All if selectedPoints is not empty and at least one nested array/object has items
          Object.keys(selectedPoints).length > 0 &&
          Object.keys(selectedPoints).some(key => {
            if (Array.isArray(selectedPoints[key])) {
              return selectedPoints[key].length > 0;
            }
            if (typeof selectedPoints[key] === 'object' && selectedPoints[key] !== null && key !== 'overall') {
              return Object.keys(selectedPoints[key]).length > 0;
            }
            return false;
          }) && (
            <div className="d-flex justify-content-start gap-3 mb-3">
              <Form.Check
                type="checkbox"
                checked={selectAllChecked}
                label={<div style={{ color: "#000", fontSize: '14px' }} className="primary-color">Select All</div>}
                onChange={() => {
                  if (!selectAllChecked) {
                    handleSelectAll()
                  } else {
                    handleClearAll()
                  }
                }}
              />
            </div>
          )
        }
        <div className="table-responsive datatable-wrap actionPlanTable" >
          <table className="table reportTable">
            {showOverall && selectedPoints?.overall && <thead>
              <tr
                style={{
                  cursor: (!selectedPoints?.overall?.selected && isLimitReached) ? 'not-allowed' : 'pointer',
                  opacity: (!selectedPoints?.overall?.selected && isLimitReached) ? 0.4 : 1, // Reduced opacity if disabled
                }}
                onClick={() => {
                  if (!selectedPoints?.overall?.selected && isLimitReached) return; // 🔒 Prevent click
                  handleoverall(!selectedPoints?.overall?.selected);
                }}
              >
                <th className="w-1">
                  <Form.Check
                    className='mb-0' id={`dataPointCheck-overAll-0}`} type="checkbox"
                    disabled={!selectedPoints?.overall?.selected && isLimitReached}
                    checked={selectedPoints?.overall?.selected}
                    label={<div className="primary-color"></div>}
                  />
                </th>
                <th colSpan={3}><strong>Overall</strong></th>
              </tr>
            </thead>}

            <tbody>
              {Object.keys(selectedPoints)?.map((category, categoryIndex) => (
                <>
                  {Array.isArray(selectedPoints[category]) && (
                    <>{                      <tr style={{}} key={`cat-${categoryIndex}`}>
                        <td colSpan={4}><strong>{category === 'user' ? 'PARTICIPANT' : category.toUpperCase()}</strong></td>
                      </tr>
                    }

                      {('department' === category) && Array.isArray(selectedPoints.department) && selectedPoints.department.length === 0 && (
                        <tr>
                          <td className="w-1"></td>

                          <td className='w-1'></td>

                          <td colSpan={2}><label >No Department is present</label></td>
                        </tr>
                      )}
                      {('user' === category) && Array.isArray(selectedPoints.user) && selectedPoints.user.length === 0 && (
                        <tr>
                          <td className="w-1"></td>

                          <td className='w-1'></td>

                          <td colSpan={2}><label >No Participant is present</label></td>
                        </tr>
                      )}
                      {('benchmark' === category) && Array.isArray(selectedPoints.benchmark) && selectedPoints.benchmark.length === 0 && (
                        <tr>
                          <td className="w-1"></td>

                          <td className='w-1'></td>

                          <td colSpan={2}><label >No Benchmark is present</label></td>
                        </tr>
                      )}
                      {('demographic' === category) && Array.isArray(selectedPoints.demographic) && selectedPoints.demographic.length === 0 && (
                        <tr>
                          <td className="w-1"></td>

                          <td className='w-1'></td>

                          <td colSpan={2}><label >No Demographic is present</label></td>
                        </tr>
                      )}



                      {category != "demographic" && selectedPoints[category].map((item, index) => {
                        // Benchmark limit logic
                        const isBenchmark = category === 'benchmark';
                        const disableBenchmark = isBenchmark && !item.selected && isBenchmarkLimitReached;
                        return (
                          <tr
                            style={{
                              cursor: ((isBenchmark ? (disableBenchmark || (!item.selected && isLimitReached)) : (!item.selected && isLimitReached)) || item.anonymity) ? 'not-allowed' : 'pointer',
                              opacity: ((isBenchmark ? (disableBenchmark || (!item.selected && isLimitReached)) : (!item.selected && isLimitReached)) || item.anonymity) ? 0.4 : 1, // Reduced opacity if disabled
                            }}
                            onClick={() => {
                              if (isBenchmark ? (disableBenchmark || (!item.selected && isLimitReached)) : (!item.selected && isLimitReached)) return; // 🔒 Prevent click
                              handleCheckboxChange(category, index, !item.selected);
                            }}
                            key={`${category}-${index}`}>
                            <td className="w-1"></td>

                            <td className='w-1'>
                              <Form.Check className='mb-0' id={`dataPointCheck-${category}-${index}`} type="checkbox" checked={item.selected}
                                disabled={(isBenchmark ? (disableBenchmark || (!item.selected && isLimitReached)) : (!item.selected && isLimitReached)) || item.anonymity}
                                label={<div className="primary-color"></div>} />
                            </td>
                            <td colSpan={2}><label>{item.name}</label></td>
                          </tr>
                        )
                      })}
                      {category == "demographic" && selectedPoints[category].map((item, demographicindex) => (
                        <>
                          <tr key={`${category}-${demographicindex}`}>
                            <td className="w-1"></td>

                            {/* <td className='w-1'>
                        <Form.Check className='mb-0' id='dataPointCheck01' type="checkbox" checked={item.selected}
                            label={<div className="primary-color"></div>}/>
                        </td> */}
                            <td colSpan={2}><label>{item.question}</label></td>
                          </tr>
                          {item?.responses.map((item, index) => (
                            <tr
                              style={{
                                cursor: (!item.selected && isLimitReached) ? 'not-allowed' : 'pointer',
                                opacity: (!item.selected && isLimitReached) ? 0.4 : 1, // Reduced opacity if disabled
                              }}
                              onClick={() => {
                                if (!item.selected && isLimitReached) return; // 🔒 Prevent click
                                handleDemographicCheckboxChange(demographicindex, index, !item.selected);
                              }}
                              key={`${category}-${index}`}>
                              <td className="w-1"></td>

                              <td className='w-1'>
                                <Form.Check className='mb-0' id={`dataPointCheck-${category}-${index}`} type="checkbox" checked={item.selected}
                                  disabled={!item.selected && isLimitReached}

                                  label={<div className="primary-color"></div>} />
                              </td>
                              <td colSpan={2}><label>{item.responseName}</label></td>
                            </tr>
                          ))}
                        </>
                      ))}
                    </>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>


      </div>
      <div style={{ paddingTop: '1rem' }} className="d-flex justify-content-end gap-2">
        <Button onClick={handleSave} variant="primary" className="ripple-effect">
          Save
        </Button>
        <Button variant="secondary" className="ripple-effect" onClick={() => { setShowDataPointModal(false) }}>
          Cancel
        </Button>
      </div>
    </ModalComponent>
  );
}

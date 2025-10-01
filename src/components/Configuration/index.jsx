import React, { useState } from "react";
import { Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Button } from "components";
import InputField from "../Input";
import toast from "react-hot-toast";

export default function Configuration({
  scalarConfiguration,
  onScalarChange,
  onUpdate,
  companyMasterID,
  colors,
  companyID,
  assessmentID,
}) {
  const [errors, setErrors] = useState([]);
  // window.alert()
  // console.log("scalarConfiguration", scalarConfiguration)

  // Validate fields
  const validateField = (index, field, value) => {
    const updatedErrors = [...errors];

    if (!updatedErrors[index]) {
      updatedErrors[index] = {};
    }

    updatedErrors[index][field] = "";

    
    if (field === "add_scalar_name" && !value) {
      updatedErrors[index][field] = "Scalar name is required";
      // isValid = false;
    } else if (value.length > 25) {
      updatedErrors[index][field] = "Scalar name must not exceed 25 characters";
      // isValid = false;
    }

    if (field === "add_scalar_min_value" || field === "add_scalar_max_value") {
      const numValue = Number(value);
      if (numValue < -100 || numValue > 100) {
        updatedErrors[index][field] = "Value must be between 0 and 100";
      }

      // Check for overlapping ranges
      const currentMin =
        field === "add_scalar_min_value"
          ? numValue
          : Number(scalarConfiguration[index].range_start);
      const currentMax =
        field === "add_scalar_max_value"
          ? numValue
          : Number(scalarConfiguration[index].range_end);

      scalarConfiguration.forEach((scalar, i) => {
        if (i !== index) {
          const otherMin = Number(scalar.range_start);
          const otherMax = Number(scalar.range_end);
          if (
            (currentMin >= otherMin && currentMin <= otherMax) ||
            (currentMax >= otherMin && currentMax <= otherMax)
          ) {
            updatedErrors[index][field] = "Ranges cannot overlap";
          } else if (currentMin >= currentMax) {
            updatedErrors[index][field] = "Max value should grater than Min";
          }
        }
      });
    }

    if (field === "add_scalar_color" && !/^#[0-9A-F]{6}$/i.test(value.trim())) {
      updatedErrors[index][field] = "Invalid color code";
    }

    setErrors(updatedErrors);
  };

  const validateAllFields = () => {
    const updatedErrors = [];

    scalarConfiguration.forEach((scalar, index) => {
      const errorsForItem = {};

      // Scalar Name - Required
      if (!scalar.scalar_name?.trim()) {
        errorsForItem.add_scalar_name = "Scalar name is required";
      }

      const min = Number(scalar.range_start);
      const max = Number(scalar.range_end);

      // Min Value
      // eslint-disable-next-line no-restricted-globals
      if (isNaN(min) || min < -100 || min > 100) {
        errorsForItem.add_scalar_min_value = "Value must be between 0 and 100";
      }

      // Max Value
      // eslint-disable-next-line no-restricted-globals
      if (isNaN(max) || max < -100 || max > 100) {
        errorsForItem.add_scalar_max_value = "Value must be between 0 and 100";
      }

      // Min >= Max check
      // eslint-disable-next-line no-restricted-globals
      if (!isNaN(min) && !isNaN(max) && min >= max) {
        errorsForItem.add_scalar_max_value =
          "Max value should be greater than Min";
      }

      // Check for overlapping ranges
      scalarConfiguration.forEach((otherScalar, i) => {
        if (i !== index) {
          const otherMin = Number(otherScalar.range_start);
          const otherMax = Number(otherScalar.range_end);

          if (
            // eslint-disable-next-line no-restricted-globals
            !isNaN(min) &&
            // eslint-disable-next-line no-restricted-globals
            !isNaN(max) &&
            ((min >= otherMin && min <= otherMax) ||
              (max >= otherMin && max <= otherMax))
          ) {
            errorsForItem.add_scalar_min_value = "Ranges cannot overlap";
            errorsForItem.add_scalar_max_value = "Ranges cannot overlap";
          }
        }
      });

      // Color Code Validation
      if (!/^#[0-9A-F]{6}$/i.test(scalar.color_code?.trim() || "")) {
        errorsForItem.add_scalar_color = "Invalid color code";
      }

      // Only push non-empty error objects
      if (Object.keys(errorsForItem).length > 0) {
        updatedErrors[index] = errorsForItem;
      } else {
        updatedErrors[index] = {}; // For consistency
      }
    });

    setErrors(updatedErrors);

    // Check if any actual error exists
    const hasErrors = updatedErrors.some((item) =>
      Object.values(item || {}).some((val) => val && val.length > 0)
    );

    return hasErrors;
  };

  // Handle input changes
  const handleChange = (index, field, value) => {
    const updatedConfig = [...scalarConfiguration];
    const fieldMapping = {
      add_scalar_name: "scalar_name",
      add_scalar_sequence: "scalar_sequence",
      add_scalar_min_value: "range_start",
      add_scalar_max_value: "range_end",
      add_scalar_color: "color_code",
    };
    

    // Format decimal values to 2 places
    if (field === "add_scalar_min_value" || field === "add_scalar_max_value") {
      const numValue = Number(value);
      if (!isNaN(numValue)) {
        value = numValue.toFixed(2);
      }
    }

    updatedConfig[index][fieldMapping[field] || field] = value;
    onScalarChange(updatedConfig);
    validateField(index, field, value);
  };

  // Add new row
  const addRow = () => {
    const predefinedColors = colors
    const newConfig = [...scalarConfiguration];
    const newIndex = scalarConfiguration.length;
    const newColor = predefinedColors[newIndex % predefinedColors.length]; // Cycle through colors
  
    newConfig.push({
      scalar_id: "",
      scalar_sequence: scalarConfiguration.length + 1,
      scalar_name: "",
      range_start: "",
      range_end: "",
      color_code: newColor, // Assign a color based on index
    });
    onScalarChange(newConfig);
  };

  // Delete row
  const deleteRow = (index) => {
    let updatedConfig = scalarConfiguration.filter((_, i) => i !== index);

    // Reassign colors and sequences based on new indices
    updatedConfig = updatedConfig.map((scalar, newIndex) => ({
      ...scalar,
      scalar_sequence: newIndex + 1, // Reset sequence (1, 2, 3, ...)
      color_code: colors[newIndex % colors.length], // Reassign color based on new index
    }));

    onScalarChange(updatedConfig);

    // Optionally, revalidate all fields after rearrangement
    // validateAllFields();
  };


  // Handle update button click
  const handleUpdate = () => {
    const payload = {
      companyMasterID,
      companyID,
      assessmentID,
      action: "update_scalar_configuration",
      scalarData: scalarConfiguration.map((scalar) => ({
        scalar_name: scalar.scalar_name,
        scalar_sequence: scalar.scalar_sequence.toString(),
        range_start: Number(scalar.range_start).toFixed(2),
        range_end: Number(scalar.range_end).toFixed(2),
        color_code: scalar.color_code,
      })),
    };

    const isValid = validateAllFields();
    if (!isValid) {
      onUpdate(payload);
    }
  };

  return (
    <div className="scalarSec scalarappend">
      {/* Header */}
      {/* {JSON.stringify(colors)} */}
      <div className="d-flex justify-content-between gap-2 mb-0 align-items-center">
        <div className="sequence title">Sequence</div>
        <div className="scalar title">Scalar Name</div>
        <div className="maximum title">Minimum</div>
        <div className="maximum title">Maximum</div>
        <div className="color title ">
          Color
          {/* <OverlayTrigger
            overlay={
              <Tooltip id="tooltip-disabled">
                Populate colors from color palett
              </Tooltip>
            }
          > */}
            <span className="d-inline-block tooltip-container" data-title="Populate colors from color palette">
              <em className="icon-info-circle ms-1" />
            </span>
          {/* </OverlayTrigger> */}
        </div>
        <div className="addeletebtn title justify-content-center">+/-</div>
      </div>

      {/* Scalar Configuration Rows */}
      {scalarConfiguration.map((scalar, index) => (
        <div
          className="scalarappend_list d-flex justify-content-between gap-2 align-items-start"
          key={index}
        >
<div className="sequence">{`${(index + 1).toString().padStart(2, "0")}.`}</div>

          <Form.Group className="form-group scalar">
            <InputField
              type="text"
              placeholder="Enter Name"
              value={scalar.scalar_name}
              // maxLength={25}
              onChange={(e) =>
                handleChange(index, "add_scalar_name", e.target.value)
              }
            />
            {errors[index]?.add_scalar_name && (
              <div className="error text-danger">
                {errors[index].add_scalar_name}
              </div>
            )}
          </Form.Group>

          <Form.Group className="form-group maximum">
            <InputField
              type="number"
              placeholder="Enter Minimum"
              value={Number(scalar.range_start).toFixed(0)==0&&index!==0?"":Number(scalar.range_start).toFixed(0)}
              onChange={(e) =>
                handleChange(index, "add_scalar_min_value", e.target.value)
              }
            />
            {errors[index]?.add_scalar_min_value && (
              <div className="error text-danger">
                {errors[index].add_scalar_min_value}
              </div>
            )}
          </Form.Group>

          <Form.Group className="form-group maximum">
            <InputField
              type="number"
              placeholder="Enter Maximum"
              value={Number(scalar.range_end).toFixed(0)==0?"":Number(scalar.range_end).toFixed(0)}
              onChange={(e) =>
                handleChange(index, "add_scalar_max_value", e.target.value)
              }
            />
            {errors[index]?.add_scalar_max_value && (
              <div className="error text-danger">
                {errors[index].add_scalar_max_value}
              </div>
            )}
          </Form.Group>

          <div className="color">
            <InputField
              type="color"
              className="form-control-color"
              value={scalar.color_code}
              onChange={(e) =>
                handleChange(index, "add_scalar_color", e.target.value)
              }
            />
          </div>

          <div className="addeletebtn d-flex gap-2">
            {/* Show Add button on every row except when max limit reached */}
            {scalarConfiguration.length < 9 && (
          //   <OverlayTrigger
          //   placement="top"
          //   overlay={<Tooltip id="tooltip-add">Add</Tooltip>}
          // >
            <Link
              href="#!"

              onClick={(e) => {
                e.preventDefault();
                addRow();
              }}
              className="addbtn addscaler tooltip-container" data-title="Add"
            >
              <span>+</span>
            </Link>
          // </OverlayTrigger>
            )}

            {/* Show Delete button for all rows except first row */}
            {index > 0 && (
          //    <OverlayTrigger
          //    placement="top"
          //    overlay={<Tooltip id={`tooltip-delete-${index}`}>Delete</Tooltip>}
          //  >
             <Link
               href="#!"
               onClick={(e) => {
                 e.preventDefault();
                 deleteRow(index);
               }}
               className="deletebtn deletebtnscaler tooltip-container" data-title="Delete"
             >
               <em className="icon-delete" />
             </Link>
          //  </OverlayTrigger>
            )}
          </div>
        </div>
      ))}

      <div className="d-flex justify-content-end gap-2 pt-3">
        <Button
          type="button"
          className="btn btn-primary ripple-effect"
          onClick={handleUpdate}
        >
          Update
        </Button>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { commonService } from "services/common.service";
import { Distribution } from "apiEndpoints/Distribution";
import { useAuth } from "customHooks";
import { Button, InputField, ModalComponent } from "../../../../../components";

const AddAnonymousDepartmentModal = ({ show, onHandleCancel, companyId, onSuccess }) => {
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  const [departmentName, setDepartmentName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onHandleSubmit = async () => {
    if (!departmentName.trim()) return;

    try {
      setIsSubmitting(true);
      const payload = {
        companyID: companyId,
        departmentName,
        departmentDescription: ""
      };

      const response = await commonService({
        apiEndPoint: Distribution.createAnonymousDepartment,
        bodyData: payload,
        toastType: { success: true, error: true },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        onSuccess?.();
        onHandleCancel();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalComponent
      modalHeader="Add Anonymous Department"
      show={show}
      onHandleCancel={onHandleCancel}
    >
      <Form>
        <Form.Group className="form-group">
          <Form.Label>
            Department Name<sup>*</sup>
          </Form.Label>
          <InputField 
            type="text" 
            placeholder="Enter Department Name"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
          />
        </Form.Group>
        <div className="form-btn d-flex gap-2 justify-content-end">
          <Button
            variant="secondary"
            className="ripple-effect"
            onClick={onHandleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="ripple-effect"
            onClick={onHandleSubmit}
            disabled={isSubmitting || !departmentName.trim()}
          >
            {isSubmitting ? "Adding..." : "Add Department"}
          </Button>
        </div>
      </Form>
    </ModalComponent>
  );
};

export default AddAnonymousDepartmentModal;

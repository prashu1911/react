import { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import "react-dual-listbox/lib/react-dual-listbox.css";
import DualListbox from "./DualListbox";
import toast from "react-hot-toast";
import { decodeHtmlEntities } from "utils/common.util";

const CustomDualListBox = ({
  unassignShow,
  allUsers,
  selectedDepartmentId,
  setSelected,
  onChange,
  scheduleData,
}) => {
  const [items, setItems] = useState({ leftItems: [], rightItems: [] });

  useEffect(() => {
    if (allUsers && allUsers.length > 0) {
      const transformedUsers = allUsers
        .filter((user) => selectedDepartmentId.includes(user.departmentID))
        .map((user) => ({
          value: user.userID,
          label: `${decodeHtmlEntities(user.departmentName)} - ${decodeHtmlEntities(user.firstName)} ${decodeHtmlEntities(user.lastName)}`,
          isScheduled: parseInt(user.scheduled, 10),
          isAssigned: parseInt(user.assigned, 10),
          departmentID: user.departmentID,
          surveyscheduleID: user.surveyscheduleID,
          departmentName: user.departmentName,
          name: `${user.firstName} ${user.lastName}`,
          firstName: user.firstName,
          lastName: user.lastName,
          userID: user.userID, // Ensure userID is included
        }));

      // Separate users into left and right boxes
      const leftItems = transformedUsers.filter(
        (user) => !user.isAssigned && !user.isScheduled
      );
      const rightItems = transformedUsers.filter(
        (user) => user.isAssigned || user.isScheduled
      );

      setItems({ leftItems, rightItems });
      setSelected(rightItems);
    } else {
      setItems({ leftItems: [], rightItems: [] });
      setSelected([]);
    }
  }, [allUsers , setSelected]);

  const handleChange = (newItems) => {
      setItems(newItems);
    const updatedRightItems = newItems.rightItems.map((item) => ({
      ...item,
    }));
    setSelected(updatedRightItems);

    const unscheduledDeptIds = scheduleData
      ?.filter((dept) => !dept.startDate && !dept.endDate)
      .map((dept) => dept.departmentID);

    const selectedInUnscheduledDept = updatedRightItems.filter((user) =>
      unscheduledDeptIds.includes(user.departmentID)
    );

    if (selectedInUnscheduledDept.length > 0) {
      const depts = [
        ...new Set(
          selectedInUnscheduledDept.map((user) => {
            const dept = scheduleData.find(
              (d) => d.departmentID === user.departmentID
            );
            return dept?.departmentName || user.departmentID;
          })
        ),
      ].join(", ");
       toast.error(
          `Selected participants belong to unscheduled departments: ${depts}`
        );

    }
  };

  return (
    <div>
      <Row className="mb-3 listboxHeading gx-3 gy-2">
        <Col md={6}>
          <div className="d-flex align-items-center justify-content-between">
            <h6 className="fw-semibold mb-0">Participant</h6>
            <span>
              {items.leftItems.length === 0
                ? "Empty List"
                : `Showing all ${items.leftItems.length}`}
            </span>
          </div>
        </Col>
        <Col md={6}>
          <div className="d-flex align-items-center justify-content-between">
            <h6
              className="fw-semibold mb-0 link-primary"
              // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
              role="button"
              onClick={() => unassignShow(items.rightItems)}
            >
              Unassign Participant
            </h6>
            <span>
              {items.rightItems.length === 0
                ? "Empty List"
                : `Showing all ${items.rightItems.length}`}
            </span>
          </div>
        </Col>
      </Row>

      <DualListbox
        initialLeftItems={items.leftItems}
        initialRightItems={items.rightItems}
        onItemsChange={handleChange}
      />
    </div>
  );
};

export default CustomDualListBox;

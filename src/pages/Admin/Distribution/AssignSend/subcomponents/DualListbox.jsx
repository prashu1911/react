import React, { useEffect, useMemo, useState } from "react";
import { Form } from "react-bootstrap";

const DualListbox = ({
  initialLeftItems = [],
  initialRightItems = [],
  onItemsChange,
}) => {
  const [leftSearch, setLeftSearch] = useState("");
  const [rightSearch, setRightSearch] = useState("");
  const [leftBox, setLeftBox] = useState(initialLeftItems);
  const [rightBox, setRightBox] = useState(initialRightItems);

  // Add this useEffect to handle prop changes
  useEffect(() => {
    setLeftBox(initialLeftItems);
    setRightBox(initialRightItems);
  }, [initialLeftItems, initialRightItems]);

  const filteredLeftBox = useMemo(
    () =>
      leftBox.filter((item) =>
        item.label.toLowerCase().includes(leftSearch.toLowerCase())
      ),
    [leftBox, leftSearch]
  );

  const filteredRightBox = useMemo(
    () =>
      rightBox.filter((item) =>
        item.label.toLowerCase().includes(rightSearch.toLowerCase())
      ),
    [rightBox, rightSearch]
  );

  const getItemClass = (item) => {
    if (item.isAssigned === 1) {
      return "danger locked"; // Only red and locked if actually assigned
    }
    if (item.isScheduled === 1) {
      return "success locked";
    }
    return ""; // No special class for items just being moved
  };

  const moveItem = (fromBox, setFromBox, toBox, setToBox, index) => {
    const item = fromBox[index];

    if (item.isAssigned === 1 || item.isScheduled === 1) return;

    const updatedFrom = [...fromBox];
    updatedFrom.splice(index, 1);

    const updatedTo = [...toBox, item];

    setFromBox(updatedFrom);
    setToBox(updatedTo);

    if (onItemsChange) {
      onItemsChange({
        leftItems: setFromBox === setLeftBox ? updatedFrom : updatedTo,
        rightItems: setToBox === setRightBox ? updatedTo : updatedFrom,
      });
    }
  };

  const shiftAllItems = (fromBox, setFromBox, toBox, setToBox) => {
    const movableItems = fromBox.filter(
      (item) => item.isAssigned !== 1 && item.isScheduled !== 1
    );

    if (movableItems.length === 0) return;

    const remainingItems = fromBox.filter(
      (item) => item.isAssigned === 1 || item.isScheduled === 1
    );

    const updatedTo = [...toBox, ...movableItems];

    setFromBox(remainingItems);
    setToBox(updatedTo);

    if (onItemsChange) {
      onItemsChange({
        leftItems: setFromBox === setLeftBox ? remainingItems : updatedTo,
        rightItems: setToBox === setRightBox ? updatedTo : remainingItems,
      });
    }
  };

  return (
    <div className="dualList">
      <div className="d-flex align-items-start flex-md-row flex-column justify-content-center gap-xl-4 gap-3">
        {/* LEFT BOX */}
        <div className="dualList_box">
          <Form.Group className="form-group mb-1">
            <Form.Control
              type="text"
              placeholder="Search items..."
              value={leftSearch}
              onChange={(e) => setLeftSearch(e.target.value)}
            />
          </Form.Group>

          <div className="dualList_box_wrap">
            <div className="dualList_box_header">
              <button
                onClick={() =>
                  shiftAllItems(leftBox, setLeftBox, rightBox, setRightBox)
                }
                disabled={
                  !leftBox.some(
                    (item) => item.isAssigned !== 1 && item.isScheduled !== 1
                  )
                }
              >
                <em className="icon-double-arrow iconLeft d-inline-block" />
              </button>
            </div>

            <ul className="dualList_box_list m-0">
              {filteredLeftBox.map((item, index) => (
                <li
                  key={index}
                  className={`dualList_box_item ${getItemClass(item)}`}
                  onClick={() =>
                    moveItem(
                      leftBox,
                      setLeftBox,
                      rightBox,
                      setRightBox,
                      leftBox.indexOf(item)
                    )
                  }
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT BOX */}
        <div className="dualList_box">
          <Form.Group className="form-group mb-1">
            <Form.Control
              type="text"
              placeholder="Search items..."
              value={rightSearch}
              onChange={(e) => setRightSearch(e.target.value)}
            />
          </Form.Group>

          <div className="dualList_box_wrap">
            <div className="dualList_box_header">
              <button
                onClick={() =>
                  shiftAllItems(rightBox, setRightBox, leftBox, setLeftBox)
                }
                disabled={
                  !rightBox.some(
                    (item) => item.isAssigned !== 1 && item.isScheduled !== 1
                  )
                }
              >
                <em className="icon-double-arrow iconRight d-inline-block" />
              </button>
            </div>

            <ul className="dualList_box_list m-0">
              {filteredRightBox.map((item, index) => (
                <li
                  key={index}
                  className={`dualList_box_item ${getItemClass(item)}`}
                  onClick={() =>
                    moveItem(
                      rightBox,
                      setRightBox,
                      leftBox,
                      setLeftBox,
                      rightBox.indexOf(item)
                    )
                  }
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DualListbox;

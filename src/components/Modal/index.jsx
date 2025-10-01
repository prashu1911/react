import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";

function ModalComponent({
  modalHeader,
  children,
  show,
  modalExtraClass = "",
  extraClassName = "",
  extraTitleClassName = "",
  extraBodyClassName = "",
  onHandleVisible,
  onHandleCancel,
  // closeButton = true,
  backdrop = "static",
  size,
  ...rest
}) {
  useEffect(() => {
    if (show) {
      const modalElement = document.querySelector(".modal");
      if (modalElement) {
        modalElement.removeAttribute("tabindex");
      }
    }
  }, [show]);
  return (
    <>
      <Modal
        className={`commonModal ${modalExtraClass}`}
        show={show}
        onHide={onHandleCancel}
        // onHandleShow={onHandleVisible}
        backdrop={backdrop}
        keyboard={false}
        dialogClassName={extraClassName}
        size={size}
        centered
        {...rest}
      >
        <Modal.Header
          className={`${extraTitleClassName}`}
          // closeVariant="white"
        >
          <h5 className="modal-title">{modalHeader && modalHeader}</h5>
          <button
            type="button"
            className="btn-close"
            onClick={onHandleCancel}
            aria-label="Close"
          >
            <em className="icon-close-circle" />
          </button>
        </Modal.Header>
        <Modal.Body className={`${extraBodyClassName}`}>{children}</Modal.Body>
      </Modal>
    </>
  );
}

export default ModalComponent;

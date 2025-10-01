import React, { useEffect } from "react";
import Swal from "sweetalert2";

function AssignAlert({
  show,
  onConfirmAlert,
  onCancelAlert, // 👈 add this
  loading,
  setIsAlertVisible,
  isConfirmedTitle,
  isConfirmedText,
  onAlertConfirm, // New prop
  otherErrDisplayMode,
  customClass = {},
  ...rest
}) {
  useEffect(() => {
    if (show) {
      Swal.fire({
        confirmButtonColor: "#67ce7f",
        cancelButtonColor: "#F37F73",
        customClass,
        ...rest,
        preConfirm: async (data) => {
          const res = await onConfirmAlert(data);
          if (res) {
            return true;
          } else {
            if (!otherErrDisplayMode) {
              Swal.fire({
                title: "Oops.... !",
                text: "Something went wrong",
                showConfirmButton: false,
                timer: 1500,
                icon: "error",
              });
            } else {
              Swal.close();
            }

            setIsAlertVisible(false);
          }
          return false;
        },
      }).then((result) => {
        if (result.isConfirmed) {
          onAlertConfirm?.();
          if (isConfirmedTitle && isConfirmedText) {
            Swal.fire({
              title: isConfirmedTitle,
              text: isConfirmedText,
              showConfirmButton: false,
              timer: 1500,
              icon: "success",
            });
            setIsAlertVisible(false);
          }
        } else if (result.isDismissed) {
          onCancelAlert?.(); // 👈 call the cancel handler
          setIsAlertVisible(false);
        }
      });
    }
  }, [show]);

  return <></>;
}

export default AssignAlert;

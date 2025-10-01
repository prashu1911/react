import React, { useEffect } from "react";
import Swal from "sweetalert2";

function SweetAlert({
  show,
  onConfirmAlert,
  loading,
  setIsAlertVisible,
  isConfirmedTitle,
  isConfirmedText,
  otherErrDisplayMode,
  errorMessaage="",
  customClass = {}, // Accept customClass prop
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
                text: errorMessaage || "Somrthing went wrong",
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
      })
        .then((result) => {
          if (result.isConfirmed) {
            //   toastr.clear();
            //   NioApp.Toast('User Queries deleted successfully', 'success',{position: 'top-right'});
           
              Swal.fire({
                title: isConfirmedTitle,
                text: isConfirmedText,
                showConfirmButton: false,
                timer: 1500,
                icon: "success",
              });
           
            setIsAlertVisible(false);
          } else if (result.isDismissed) {
            setIsAlertVisible(false);
          }
        })
    }
  }, [show]);

  return <></>;
}
export default SweetAlert;

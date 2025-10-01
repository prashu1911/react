import { useEffect } from "react";
import Swal from "sweetalert2";

const BasicAlert = ({
  title,
  text,
  show,
  icon,
  setIsAlertVisible,
  buttonText = "OK",
}) => {
  useEffect(() => {
    if (show) {
      Swal.fire({
        title,
        text,
        icon,
        confirmButtonText: buttonText,
        allowOutsideClick: false,
        confirmButtonColor : "#0968AC",
      }).then(() => {
        setIsAlertVisible(false); // Close the alert when OK is clicked
      });
    }
  }, [show, title, text, icon, buttonText, setIsAlertVisible]);

  return null; // This component doesn't render anything directly
};

export default BasicAlert;

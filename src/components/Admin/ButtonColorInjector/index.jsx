// components/ThemeColorInjector.js
import { useAuth } from "customHooks";
import { useEffect } from "react";

const ButtonColorInjector = () => {
  //   const colors = useSelector((state) => state.theme.colors); // e.g. { primary: "#007bff", danger: "#dc3545" }
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  const customButtonColor = [
    {
      label: "Green",
      color: "#fff",
      backgroundColor: "#5ba44c",
      borderColor: "#5ba44c",
    },
    {
      label: "light-blue",
      color: "#fff",
      backgroundColor: "#0968ac",
      borderColor: "#0968ac",
    },
    {
      label: "Purple",
      color: "#fff",
      backgroundColor: "#8f44ad",
      borderColor: "#8f44ad",
    },
    {
      label: "Orange",
      color: "#fff",
      backgroundColor: "#f5a623",
      borderColor: "#f5a623",
    },
    {
      label: "Slate",
      color: "#fff",
      backgroundColor: "#627d8b",
      borderColor: "#627d8b",
    },
    {
      label: "Red",
      color: "#fff",
      backgroundColor: "#d9534f",
      borderColor: "#d9534f",
    },
  ];

  useEffect(() => {
    if (userData && userData?.companyConfig?.button_color) {
      const customBtn = customButtonColor?.find(
        (v, i) => v.label === userData?.companyConfig?.button_color
      );
      if (customBtn?.backgroundColor) {
        const style = document.createElement("style");
        style.textContent = `
        .btn-primary {
          color:${customBtn.color} !important;
          background-color: ${customBtn.backgroundColor} !important;
          border-color: ${customBtn.borderColor} !important;
        }
        .btn-primary:hover {
          color:${customBtn.color} !important;
          background-color: ${customBtn.backgroundColor} !important;
          border-color: ${customBtn.borderColor} !important;
          opacity: 0.8;
        }
      `;
        document.head.appendChild(style);
      }
    }
  }, []);

  return null;
};

export default ButtonColorInjector;

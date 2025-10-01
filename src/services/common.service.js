import APIrequest from "helpers/request.helper";
import { toast } from "react-hot-toast";
// import { startCase } from "lodash";

export const commonService = async ({
  apiEndPoint,
  bodyData,
  isToast = true,
  toastType = { success: false, error: true },
  toastMessage = { success: "", error: "" },
  queryParams,
  extraDataKeys = [],
  headers,
  isFormData = false,
  responseType = 'json',
  filePresent= false,
  fileKey
}) => {
  try {
    const payload = {
      ...apiEndPoint,
      bodyData,
      queryParams,
      headers,
      isFormData,
      responseType,
      filePresent,
      fileKey
    };

    // if (apiEndPoint.method === "GET") {
    //   toastType.success = false;
    // }
    let data;
    let response;

    response = await APIrequest(payload);
    if (response?.data && response?.status >= 200 && response?.status < 300) {
      data = response?.data;
      if (isToast && toastType.success) {
          toast.success(toastMessage.success || data?.message || data?.Message || response.message || response.data.message, {
            id: "success",
          });
      
      }

      const extraData = extraDataKeys.length
        ? extraDataKeys.reduce((acc, key) => {
          if (response?.data?.[key]) acc[key] = response.data[key];
          return acc;
        }, {})
        : {};

      return {
        status: true,
        message: data?.data?.message,
        data,
        extraData,
        errorCode: response.status
      };
    } else if (response?.status === 204) { // this else if is added because in delete api in data we got "". and 204 is use for no content hence we returing data as empty array.
      return {
        status: true,
        data: [], errorCode: response.status
      };
    } else {
      return {
        status: false,
        data: response?.data,
        errorCode: response.status
      };
    }
  } catch (error) {
    let errorMessage = "An unknown error occurred";

    if (!error.response) {
      errorMessage =
        "Network error or CORS issue. Please check your API settings.";
    } else {
      const errorObj = JSON?.parse?.(error?.message) || {};
      errorMessage = errorObj?.data?.message || error?.message || errorMessage;
    }

    if (isToast && toastType.error) {
      toast.error(toastMessage.error || errorMessage, {
        id: "error",
      });
    }

    console.error("Error in commonService:", error);

    throw new Error(errorMessage);
  }
};

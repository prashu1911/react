import axios from "axios";
import { API_ENDPOINT_V1 } from "config";
import { toast } from "react-hot-toast";

axios.defaults.headers.post["Content-Type"] = "application/json";

const APIrequest = async ({
  method = "GET",
  url,
  baseURL = API_ENDPOINT_V1,
  queryParams = {},
  bodyData = {},
  headers = {},
  isFormData = false,
  responseType = 'json'
}) => {
  // Retrieve API token securely from store

  try {
    // Configure axios request
    let axiosConfig = {};
    if (headers?.Authorization) {
      axiosConfig = {
        method,
        url,
        baseURL,
        headers: {
          ...headers,
        },
        withCredentials: false,
        responseType
      };
    } else {
      axiosConfig = {
        method,
        url,
        baseURL,
        headers: {
          ...headers,
        },
        withCredentials: false,
      };
    }


    // Process body data based on `isFormData` flag
    if (isFormData) {
      const formData = new FormData();
      Object.entries(bodyData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          if (value?.length > 0) {
            // Append each element of the array with the same key
            value.forEach((item) => {
              formData.append(key, item);
            });
          }
        } else if (typeof value === "object" && value !== null && !(value instanceof File)) {
          // Convert non-array, non-File objects to JSON strings
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
          // Append primitive values or File directly
          formData.append(key, value);
        }
      });

      axiosConfig.data = formData;
    }
    else {
      axiosConfig.data = Object.fromEntries(
        Object.entries(bodyData)
          // .filter(([, value]) => value != null)
          .map(([key, value]) => [key, typeof value === "string" ? value.trim() : value])
      );
    }


    // Handle query params
    if (Object.keys(queryParams).length > 0) {
      axiosConfig.params = Object.fromEntries(
        Object.entries(queryParams)
          .filter(([, value]) => value != null)
          .map(([key, value]) => [
            key,
            typeof value === "string" ? value.trim() : value, // Only trim strings
          ])
      );
    }

    // Make the API request
    const response = await axios(axiosConfig);

    if (response) {
      return response;
    }
  } catch (error) {
    if (error) {
      toast.error(
        `${error?.response?.data?.message ?( (error?.response?.data?.message=="outcomeIDs must not be empty"||error?.response?.data?.message=="outcomes must not be empty")?"At least one outcome should be selected":error?.response?.data?.message) : `API request failed: ${error}`}`,
        {
          id: "error",
        }
      );
      // this condition is added for unauthorized condition. I have to add a settiomeout delay for showing the toast message.
      if (error?.response?.status === 401) {
        setTimeout(() => {
          localStorage.clear();
          let path = "/"; // Default redirection path
          if (window.location.pathname === "/sso") {
            path = "/sso"; // If on /sso page, redirect back to /sso
          }
          window.location.replace(path);
        }, [2000])
      }

      return error?.response;
    }
  }
};

export default APIrequest;

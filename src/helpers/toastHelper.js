import { toast } from 'react-hot-toast';

// Function to trigger success toast
export const showSuccessToast = (message) => {
    toast.success(message, { id: 'success' });
};

// Function to trigger warning toast
export const showWarningToast = (message) => {
    toast.warning(message, { id: 'warning' });
};

// Function to trigger error toast
export const showErrorToast = (message) => {
    toast.error(message, { id: 'error' });
};

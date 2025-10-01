import * as yup from 'yup';

export const initValuesAdd = () => {
    return {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    };
};


export const validationParticipantAdd = () => {
    return yup.object({
        currentPassword: yup.string()
            .required("Current password is required.")
            .min(6, "Current password should be at least 8 characters long."),
        newPassword: yup.string()
            .required("New password is required.")
            .min(6, "New password should be at least 8 characters long.")
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
                "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
            ),
        confirmPassword: yup.string()
            .required("Confirm password is required.")
            .oneOf([yup.ref("newPassword"), null], "Passwords must match."),
    })
};




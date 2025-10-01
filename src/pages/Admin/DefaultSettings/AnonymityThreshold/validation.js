import * as Yup from "yup";

const validationSchema = Yup.object().shape({
    dataset_threshold: Yup.number()
        .typeError("Must be a number")
        .min(0, "Minimum value is 0")
        .max(25, "Dataset threshold should be between 0 to 25")
        .required("This field is required"),

    comment: Yup.number()
        .typeError("Must be a number")
        .min(0, "Minimum value is 0")
        .max(30, "comment threshold should be between 0 to 30")
        .required("This field is required"),
});

export default validationSchema;

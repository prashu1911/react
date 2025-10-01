import * as Yup from "yup";

const validationSchema = Yup.object().shape({
    title: Yup.string()
        .required("Title is required")
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title cannot exceed 100 characters"),

    description: Yup.string()
        .required("Description is required")
        .min(10, "Description must be at least 10 characters"),
});

export default validationSchema;

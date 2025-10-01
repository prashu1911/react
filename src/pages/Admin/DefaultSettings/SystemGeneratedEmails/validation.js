import * as Yup from 'yup';

const validationSchema = Yup.object({
    preStartEmail: Yup.object({
        content1: Yup.string().required('Email Subject Line is required'),
        content2: Yup.string(),
        content3: Yup.string(),
    }),
    assignEmail: Yup.object({
        content1: Yup.string().required('Email Subject Line is required'),
        content2: Yup.string(),
        content3: Yup.string(),
        content4: Yup.string(),
    }),
    reminderEmail: Yup.object({
        content1: Yup.string().required('Email Subject Line is required'),
        content2: Yup.string(),
        content3: Yup.string(),
    }),
    thankYouEmail: Yup.object({
        content1: Yup.string().required('Email Subject Line is required'),
        content2: Yup.string(),
        content3: Yup.string(),
    }),
    emailFooter: Yup.object({
        content1: Yup.string(),
    }),
});


export const getSchema = (key) => {
    const section = validationSchema.fields[key];
    if (!section) throw new Error(`Validation schema for "${key}" not found`);
    return Yup.object(section.fields);
};
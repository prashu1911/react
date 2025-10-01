import * as yup from "yup";




export const outcomeInitialValue = () => {
  return {
    outcomeName: "",
    outcomeDescription: "",
    titleBarColor: "",
  };
};

export const outComeValidationSchema = () => {
  return yup.object({
    outcomeName: yup
      .string()
      .required("Outcome name is required")
      .min(1, "Outcome name must be at least 1 characters"),
    outcomeDescription: yup
      .string(),
    // .required("Description is required"),
    // .min(10, "Description must be at least 10 characters"),
    // titleBarColor: yup
    //   .string()
    //   .required("Please select a color for the title bar"),
  });
};

export const OEQFormInitialValue = () => {
  return {
    question: "",
    intentions: "",
    intentionsShortName: "",
    displaySkipForNow: true,
    surveyType: "",
    questionByIntetion: "",
    addQuestionToResource: false,
  };
};

export const OEQFormValidationSchema = () => {
  return yup.object({
    question: yup.string().required("Question is required"),
    intentions: yup.string().required("Intentions are required"),
    intentionsShortName: yup
      .string()
      .required("Intentions Short Name is required"),
    displaySkipForNow: yup.boolean().required("This field is required"),
  });
};

export const SingleRatingQuestionInitialValue = (questionType, isSlider) => {
  return {
    question: "",
    intentions: questionType ? "" : "IG",
    intentionsShortName: questionType ? "" : "IG",
    displaySkipForNow: true,
    responseViewOption: isSlider ? "slider" : "vertical",
    type: "Single Select Response",
    responseType: "",
    scale: "",
    surveyType: "",
    keyWord: "",
    addToResource: false,
    responseBlockName: "",
    addQuestionToResource: false,
    isScore: questionType ? 1 : 0,
    responses: [
      // {
      //   id: "1",
      //   response: "Very Low",
      //   weightage: 1,
      //   category: "Positive",
      //   hasOeq: false,
      //   openEndedQuestion: "",
      // },
    ],
  };
};

export const SingleRatingQuestionValidationSchema = (rangeStart = 1, rangeEnd = 100, questionType = false) => {



  return yup.object({
    question: yup
      .string()
      .required("Question is required")
      .max(500, "Question must be 500 characters or less"),
    intentions: yup
      .string()
      .required("Intentions are required")
      .max(200, "Intentions must be 200 characters or less"),
    intentionsShortName: yup
      .string()
      .required("Intentions short name is required")
      .max(50, "Short name must be 50 characters or less"),
    displaySkipForNow: yup.boolean(),
    responseViewOption: yup
      .string()
      .required("Response view option is required")
      .oneOf(["slider", "vertical"], "Invalid response view option"),
    type: yup
      .string()
      .required("Type is required")
      .oneOf(
        ["Single Select Response", "Multi-Select Response", "Rank Order Response"],
        "Invalid type selection"
      ),
    keyWord: yup
      .string()
      .max(20, "keyWord must be 20 characters or less"),
    responses: yup.array().of(
      yup.object().shape({
        response: yup
          .string()
          .required("Response is required")
          .min(1, "Response must be at least 2 characters"),

        weightage: yup.number().when([], {
          is: () => questionType,
          then: (schema) =>
            schema
              .required("Value is required")
              .min(rangeStart, `Value must be at least ${rangeStart}`)
              .max(rangeEnd, `Value must not exceed ${rangeEnd}`),
          otherwise: (schema) => schema.strip(),
        }),

        category: yup.string().when([], {
          is: () => !questionType,
          then: (schema) => schema.required("Category is required"),
          otherwise: (schema) => schema.strip(),
        }),
        openEndedQuestion: yup.string().when("hasOeq", {
          is: true,
          then: () =>
            yup
              .string()
              .required("Open ended question is required when OEQ is checked"),
        }),

      })
    ),
    responseType: yup.string().required("Response type is required"),
    scale: yup.string().required("Scale is required"),
    addToResource: yup.boolean(),

    responseBlockName: yup.string().when("addToResource", {
      is: true,
      then: (schema) =>
        schema
          .required("Response block name is required when adding to resource")
          .max(100, "Response block name must be 100 characters or less"),
      otherwise: (schema) => schema.optional(),
    }),
  });
};

export const SingleRatingQuestionValidationSchemaEdit = (rangeStart = 1, rangeEnd = 100, questionType = false) => {
  return yup.object({
    question: yup
      .string()
      .required("Question is required")
      .max(500, "Question must be 500 characters or less"),
    intentions: yup
      .string()
      .required("Intentions are required")
      .max(200, "Intentions must be 200 characters or less"),
    intentionsShortName: yup
      .string()
      .required("Intentions short name is required")
      .max(50, "Short name must be 50 characters or less"),
    displaySkipForNow: yup.boolean(),
    responseViewOption: yup
      .string()
      .required("Response view option is required")
      .oneOf(["slider", "vertical"], "Invalid response view option"),
    type: yup
      .string()
      .required("Type is required")
      .oneOf(
        ["Single Select Response", "Multi-Select Response", "Rank Order Response"],
        "Invalid type selection"
      ),
    keyWord: yup
      .string()
      .max(20, "keyWord must be 20 characters or less"),
    // responses: yup.array().of(
    //   yup.object().shape({
    //     response: yup
    //       .string()
    //       .required("Response is required")
    //       .min(2, "Response must be at least 2 characters"),
    //     weightage: yup
    //       .number()
    //       .required("Weightage is required")
    //       // .min(1, "Weightage must be at least 1")
    //       // .max(100, "Weightage must not exceed 100"),
    //       .min(rangeStart, `Weightage must be at least ${rangeStart}`)
    //       .max(rangeEnd, `Weightage must not exceed ${rangeEnd}`),
    //     category: yup.string().required("Category is required"),
    //     // openEndedQuestion: yup.string(),
    //     //   is: 1 ,
    //     //   then: () =>
    //     //     yup
    //     //       .string()
    //     //       .required("Open ended question is required when OEQ is checked"),
    //     // }),
    //     // openEndedQuestion: yup.string().when("hasOeq", {
    //     //   is: 1 ,
    //     //   then: () =>
    //     //     yup
    //     //       .string()
    //     //       .required("Open ended question is required when OEQ is checked"),
    //     // }),
    //   })
    // ),
    // responseType: yup.string().required("Response type is required"),

    responses: yup.array().of(
      yup.object().shape({
        response: yup
          .string()
          .required("Response is required1")
          .min(1, "Response must be at least 2 characters"),

        weightage: yup.number().when([], {
          is: () => questionType,
          then: (schema) =>
            schema
              .required("Value is required")
              .min(rangeStart, `Value must be at least ${rangeStart}`)
              .max(rangeEnd, `Value must not exceed ${rangeEnd}`),
          otherwise: (schema) => schema.strip(),
        }),

        category: yup.string().when([], {
          is: () => !questionType,
          then: (schema) => schema.required("Category is required"),
          otherwise: (schema) => schema.strip(),
        }),
        openEndedQuestion: yup.string().when("hasOeq", {
          is: true,
          then: () =>
            yup
              .string()
              .required("Open ended question is required when OEQ is checked"),
        }),

      })
    ),
    scale: yup.string().required("Scale is required"),
    addToResource: yup.boolean(),

    responseBlockName: yup.string().when("addToResource", {
      is: true,
      then: (schema) =>
        schema
          .required("Response block name is required when adding to resource")
          .max(100, "Response block name must be 100 characters or less"),
      otherwise: (schema) => schema.optional(),
    }),
  });
};


export const SingleRatingQuestionValidationSchemaIG = () => {
  return yup.object({
    question: yup
      .string()
      .required("Question is required")
      .max(500, "Question must be 500 characters or less"),
    intentions: yup
      .string()

      .max(200, "Intentions must be 200 characters or less"),
    intentionsShortName: yup
      .string()

      .max(50, "Short name must be 50 characters or less"),
    displaySkipForNow: yup.boolean(),
    responseViewOption: yup
      .string()
      .required("Response view option is required")
      .oneOf(["slider", "vertical"], "Invalid response view option"),
    type: yup
      .string()
      .required("Type is required")
      .oneOf(
        ["Single Select Response", "Multi-Select Response", "Rank Order Response"],
        "Invalid type selection"
      ),
    keyWord: yup
      .string()
      .max(20, "keyWord must be 20 characters or less"),
    responses: yup.array().of(
      yup.object().shape({
        response: yup
          .string()
          .required("Response is required")
          .min(1, "Response must be at least 2 characters"),
        weightage: yup
          .number(),

        category: yup.string(),
        // openEndedQuestion: yup.string(),
        // openEndedQuestion: yup.string().when("hasOeq", {
        //   is: true,
        //   then: () =>
        //     yup
        //       .string()
        //       .required("Open ended question is required when OEQ is checked"),
        // }),
      })
    ),
    responseType: yup.string().required("Response type is required"),
    scale: yup.string().required("Scale is required"),
    addToResource: yup.boolean(),
    responseBlockName: yup.string().when("addToResource", {
      is: true,
      then: (schema) =>
        schema
          .required("Response block name is required when adding to resource")
          .max(100, "Response block name must be 100 characters or less"),
      otherwise: (schema) => schema.optional(),
    }),
  });
};

export const SingleRatingQuestionValidationSchemaEditIG = () => {
  return yup.object({
    question: yup
      .string()
      .required("Question is required")
      .max(500, "Question must be 500 characters or less"),
    intentions: yup
      .string()

      .max(200, "Intentions must be 200 characters or less"),
    intentionsShortName: yup
      .string()

      .max(50, "Short name must be 50 characters or less"),
    displaySkipForNow: yup.boolean(),
    responseViewOption: yup
      .string()
      .required("Response view option is required")
      .oneOf(["slider", "vertical"], "Invalid response view option"),
    type: yup
      .string()
      .required("Type is required")
      .oneOf(
        ["Single Select Response", "Multi-Select Response", "Rank Order Response"],
        "Invalid type selection"
      ),
    keyWord: yup
      .string()
      .max(20, "keyWord must be 20 characters or less"),
    responses: yup.array().of(
      yup.object().shape({
        response: yup
          .string()
          .required("Response is required")
          .min(1, "Response must be at least 2 characters"),
        weightage: yup
          .number(),

        category: yup.string(),
        // openEndedQuestion: yup.string(),
        // openEndedQuestion: yup.string().when("hasOeq", {
        //   is: true,
        //   then: () =>
        //     yup
        //       .string()
        //       .required("Open ended question is required when OEQ is checked"),
        // }),
      })
    ),
    // responseType: yup.string().required("Response type is required"),
    scale: yup.string().required("Scale is required"),
    addToResource: yup.boolean(),
    responseBlockName: yup.string().when("addToResource", {
      is: true,
      then: (schema) =>
        schema
          .required("Response block name is required when adding to resource")
          .max(100, "Response block name must be 100 characters or less"),
      otherwise: (schema) => schema.optional(),
    }),
  });
};

export const NestedQuestionInitialValue = (questionType, isSlider) => {
  return {
    question: "",
    intentions: questionType ? "" : "IG",
    intentionsShortName: questionType ? "" : "IG",
    displaySkipForNow: true,
    responseViewOption: isSlider ? "slider" : "vertical",
    responseType: "",
    type: "Single Select",
    scale: "",
    surveyType: "",
    keyWord: "",
    nestedGraph: false,
    responses: [],
    randomizeQuestions: false,
    addToResource: false,
    responseBlockName: "",
    subResponses: [
      { id: 1, response: "", checked: false }, // Default Row
    ],
    isResponseAddedToResource: false
  };
};

export const NestedQuestionValidationSchema = (rangeStart = 1, rangeEnd = 100, questionType = false) => {
  return yup.object({
    question: yup
      .string()
      .required("Question is required")
      .max(500, "Question must be 500 characters or less"),
    intentions: yup
      .string()
      .required("Intentions are required")
      .max(200, "Intentions must be 200 characters or less"),
    intentionsShortName: yup
      .string()
      .required("Intentions short name is required")
      .max(50, "Short name must be 50 characters or less"),
    displaySkipForNow: yup.boolean(),
    responseType: yup.string().required("Response type is required"),
    scale: yup.string().required("Scale is required"),
    keyWord: yup
      .string()
      .max(20, "keyWord must be 20 characters or less"),
    responses: yup.array().of(
      yup.object().shape({
        response: yup
          .string()
          .required("Response is required")
          .min(1, "Response must be at least 2 characters"),
        // weightage: yup
        //   .number()
        //   .required("Weightage is required")
        //   // .min(1, "Weightage must be at least 1")
        //   // .max(100, "Weightage must not exceed 100"),
        //   .min(rangeStart, `Weightage must be at least ${rangeStart}`)
        //   .max(rangeEnd, `Weightage must not exceed ${rangeEnd}`),
        weightage: yup.number().when([], {
          is: () => questionType,
          then: (schema) =>
            schema
              .required("Value is required")
              .min(rangeStart, `Value must be at least ${rangeStart}`)
              .max(rangeEnd, `Value must not exceed ${rangeEnd}`),
          otherwise: (schema) => schema.strip(),
        }),
        category: yup.string().required("Category is required"),
        // openEndedQuestion: yup.string(),
        //   is: 1 ,
        //   then: () =>
        //     yup
        //       .string()
        //       .required("Open ended question is required when OEQ is checked"),
        // }),
        openEndedQuestion: yup
          .string()
          .nullable()
          .when("hasOeq", {
            is: (val) => val === true || val === "true",
            then: (schema) =>
              schema.required("Open ended question is required when OEQ is checked"),
            otherwise: (schema) => schema.optional(),
          }),
      })
    ),
    //   yup.object().shape({
    //     response: yup
    //       .string()
    //       .required("Response is required")
    //       .min(2, "Response must be at least 2 characters"),
    //     weightage: yup
    //       .number()
    //       .required("Weightage is required")
    //       // .min(0, "Weightage not be in minus")
    //       // .max(100, "Weightage must not exceed 100"),
    //       .min(rangeStart, `Weightage must be at least ${rangeStart}`)
    //       .max(rangeEnd, `Weightage must not exceed ${rangeEnd}`),
    //     category: yup.string().required("Category is required"),

    //     // openEndedQuestion: yup.string().when("hasOeq", {
    //     //   is: true,
    //     //   then: () =>
    //     //     yup
    //     //       .string()
    //     //       .required("Open ended question is required when OEQ is checked"),
    //     // }),
    //   })
    // ),
    responseViewOption: yup
      .string()
      .required("Response view option is required")
      .oneOf(["slider", "vertical"], "Invalid response view option"),
    randomizeQuestions: yup.boolean(),
    addToResource: yup.boolean(),
    responseBlockName: yup.string().when("addToResource", {
      is: true,
      then: (schema) =>
        schema
          .required("Response block name is required when adding to resource")
          .max(100, "Response block name must be 100 characters or less"),
      otherwise: (schema) => schema.optional(),
    }),
    subResponses: yup.array().of(
      yup.object().shape({
        response: yup.string().required("Response is required"),
      })
    ),
  });
};

export const NestedQuestionValidationSchemaIG = () => {
  return yup.object({
    question: yup
      .string()
      .required("Question is required")
      .max(500, "Question must be 500 characters or less"),
    intentions: yup
      .string()
      .max(200, "Intentions must be 200 characters or less"),
    intentionsShortName: yup
      .string()
      .max(50, "Short name must be 50 characters or less"),
    displaySkipForNow: yup.boolean(),
    nestedGraph: yup.boolean(),
    responseType: yup.string().required("Response type is required"),
    scale: yup.string().required("Scale is required"),
    keyWord: yup
      .string()
      .max(20, "keyWord must be 20 characters or less"),
    responses: yup.array().of(
      yup.object().shape({
        response: yup
          .string()
          .required("Response is required")
          .min(1, "Response must be at least 2 characters"),
      })
    ),
    // type: yup
    //   .string()
    //   .required("Type is required")
    //   .oneOf(
    //     ["Single Select", "Select All that Apply"],
    //     "Invalid type selection"
    //   ),
    responseViewOption: yup
      .string()
      .required("Response view option is required")
      .oneOf(["slider", "vertical"], "Invalid response view option"),
    randomizeQuestions: yup.boolean(),
    addToResource: yup.boolean(),
    responseBlockName: yup.string().when("addToResource", {
      is: true,
      then: (schema) =>
        schema
          .required("Response block name is required when adding to resource")
          .max(100, "Response block name must be 100 characters or less"),
      otherwise: (schema) => schema.optional(),
    }),
    subResponses: yup.array().of(
      yup.object().shape({
        response: yup.string().required("Response is required"),
      })
    ),
  });
};

export const GateQualifierInitialValue = () => {
  return {
    question: "",
    intentions: "",
    intentionsShortName: "",
    displaySkipForNow: true,
    responsesType: "Yes-No",
    addToresource: false,
    surveyType: "",
    keyWord: "",
    jumpSequence: "Yes",
    responses: [
      {
        id: "1",
        response: "Yes",
      },
      {
        id: "2",
        response: "No",
      },
    ],
  };
};



export const GateQualifierValidationSchema = () => {
  return yup.object({
    question: yup
      .string()
      .required("Question is required")
      .max(500, "Question must be 500 characters or less"),
    intentions: yup
      .string()
      .required("Intentions are required")
      .max(200, "Intentions must be 200 characters or less"),
    intentionsShortName: yup
      .string()
      .required("Intentions short name is required")
      .max(50, "Short name must be 50 characters or less"),
    displaySkipForNow: yup.boolean(),
    addToresource: yup.boolean(),
    jumpSequence: yup
      .string()
      .required("jumpSequence are required"),
    responses: yup.array().of(
      yup.object().shape({
        response: yup
          .string()
          .required("Response is required")
          .min(1, "Response must be at least 2 characters"),

      })
    ),
    responsesType: yup.string().required("Response type is required"),
  });
};

export const SingleRatingGateQulifierQuestionInitialValue = (isSlider) => {
  return {
    question: "",
    intentions: "",
    intentionsShortName: "",
    displaySkipForNow: true,
    responseViewOption: isSlider ? "slider" : "vertical",
    type: "Single Select Response",
    responseType: "",
    scale: "",
    surveyType: "",
    keyWord: "",
    addToResource: false,
    responseBlockName: "",

    addQuestionToResource: false,
    responses: [],
  };
};

export const SingleRatingGateQulifierQuestionValidationSchema = (rangeStart, rangeEnd) => {
  return yup.object({
    question: yup
      .string()
      .required("Question is required")
      .max(500, "Question must be 500 characters or less"),
    intentions: yup
      .string()
      .required("Intentions are required")
      .max(200, "Intentions must be 200 characters or less"),
    intentionsShortName: yup
      .string()
      .required("Intentions short name is required")
      .max(50, "Short name must be 50 characters or less"),
    displaySkipForNow: yup.boolean(),
    responseViewOption: yup
      .string()
      .required("Response view option is required")
      .oneOf(["slider", "vertical"], "Invalid response view option"),
    // type: yup
    //   .string()
    //   .required("Type is required")
    //   .oneOf(
    //     ["singleselect", "selectapply", "rankorder"],
    //     "Invalid type selection"
    //   ),
    keyWord: yup
      .string()
      .max(20, "keyWord must be 20 characters or less"),
    responses: yup.array().of(
      yup.object().shape({
        response: yup
          .string()
          .required("Response is required")
          .min(1, "Response must be at least 2 characters"),
        weightage: yup
          .number()
          .required("Value is required")
          .min(rangeStart, `Value must be at least ${rangeStart}`)
          .max(rangeEnd, `Value must not exceed ${rangeEnd}`),
        category: yup.string().required("Category is required"),
        // openEndedQuestion: yup.string(),
        //   is: 1 ,
        //   then: () =>
        //     yup
        //       .string()
        //       .required("Open ended question is required when OEQ is checked"),
        // }),
        // openEndedQuestion: yup.string().when("hasOeq", {
        //   is: 1 ,
        //   then: () =>
        //     yup
        //       .string()
        //       .required("Open ended question is required when OEQ is checked"),
        // }),
      })
    ),
    responseType: yup.string().required("Response type is required"),
    scale: yup.string().required("Scale is required"),
    addToResource: yup.boolean(),

    responseBlockName: yup.string().when("addToResource", {
      is: true,
      then: (schema) =>
        schema
          .required("Response block name is required when adding to resource")
          .max(100, "Response block name must be 100 characters or less"),
      otherwise: (schema) => schema.optional(),
    }),
  });
};

export const SingleRatingGateQulifierQuestionValidationSchemaIG = () => {
  return yup.object({
    question: yup
      .string()
      .required("Question is required")
      .max(500, "Question must be 500 characters or less"),
    intentions: yup
      .string()

      .max(200, "Intentions must be 200 characters or less"),
    intentionsShortName: yup
      .string()

      .max(50, "Short name must be 50 characters or less"),
    displaySkipForNow: yup.boolean(),
    responseViewOption: yup
      .string()
      .required("Response view option is required")
      .oneOf(["slider", "vertical"], "Invalid response view option"),
    type: yup
      .string()
      .required("Type is required")
      .oneOf(
        ["Single Select Response", "Multi-Select Response", "Rank Order Response"],
        "Invalid type selection"
      ),
    keyWord: yup
      .string()
      .max(20, "keyWord must be 20 characters or less"),
    responses: yup.array().of(
      yup.object().shape({
        response: yup
          .string()
          .required("Response is required")
          .min(1, "Response must be at least 2 characters"),
        weightage: yup
          .number(),

        category: yup.string(),
        // openEndedQuestion: yup.string(),
        // openEndedQuestion: yup.string().when("hasOeq", {
        //   is: true,
        //   then: () =>
        //     yup
        //       .string()
        //       .required("Open ended question is required when OEQ is checked"),
        // }),
      })
    ),
    responseType: yup.string().required("Response type is required"),
    scale: yup.string().required("Scale is required"),
    addToResource: yup.boolean(),
    responseBlockName: yup.string().when("addToResource", {
      is: true,
      then: (schema) =>
        schema
          .required("Response block name is required when adding to resource")
          .max(100, "Response block name must be 100 characters or less"),
      otherwise: (schema) => schema.optional(),
    }),
  });
};



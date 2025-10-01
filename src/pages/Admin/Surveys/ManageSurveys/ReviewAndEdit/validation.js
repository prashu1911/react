import * as yup from 'yup';

// initialvalue for add surveys
export const initValuesAdd = (data, participationTool, scalarConfiguration) => {
  return {
    companyMasterID: data,
    companyID: '1',
    assessmnet_name: "",
    outcome_default: 'single',
    assessment_language: "english",
    response_slider: "",
    question_limit: "",
    randomize_question: "",
    response_score_range: "",
    question_per_page: "",
    enable_participant_demographics: "", // not in doc
    enable_dynamic_filter: "",  // not in doc
    enable_open_ended_questions: "",  // not in doc
    colorPaletteID: {
      colorPaletteID: '',
      colors: []
    },
    summary_report_name: "",
    summary_opening_content: "",
    summary_closing_content: "",
    summary_chart_type: "line",
    summary_legend_position: 'left',
    summary_switch_axis: false,
    summary_scalar_opacity: 50,
    summary_data_label: "top",
    summary_font_size: 12,
    summary_db_color: "#000",
    detail_report_name: "",
    detail_opening_content: "",
    detail_closing_content: "",
    detail_chart_type: "bar",
    detail_legend_position: "left",
    detail_switch_axis: false,
    detail_scalar_opacity: 50,
    detail_data_label: "top",
    detail_font_size: 12,
    detail_db_color: "#000",
    pre_start_email_subject: "",
    pre_start_email_header: "",
    pre_start_email_content: "",
    assign_email_subject_line: "",
    assign_email_header_graphic: "",
    assign_email_pre_credential_content: "",
    assign_email_post_credential_content: "",
    reminder_email_subject_line: "",
    reminder_email_header_graphic: "",
    reminder_email_content: "",
    thank_you_email_subject_line: "",
    thank_you_email_header_graphic: "",
    thank_you_email_content: "",
    email_footer: "",
    introduction: "",
    // faq_title: '',
    // faq_description:'',
    // help_title: "",   // not in doc
    // help_description: "",   // not in doc
    participationTool: participationTool.map((item) => ({
      confetti_serial_no: item.confetti_serial_no,
      percentage: item?.percentage || '',
      message: item?.message || '',
      confetti: item?.confetti || '',
      time_in_sec: item?.time_in_sec || '',
      fireworks: item?.fireworks || false,
      sound: item?.sound || false,
      star: item?.star || false,
      star_color: item?.star_color || "#000000",
    })),
    scalarConfiguration: scalarConfiguration.map((item) => ({
      scalar_id: item?.scalar_id || '1',
      add_scalar_sequence: item.add_scalar_sequence,
      add_scalar_name: item.add_scalar_name || "",
      add_scalar_min_value: item.add_scalar_min_value || 0,
      add_scalar_max_value: item.add_scalar_max_value || 0,
      add_scalar_color: item.add_scalar_color || "#000000",
    })),
  };
};


// initialvalue for update surveys
export const initValuesUpdate = (selectedParticipant) => {
  return {
    userName: selectedParticipant?.userID || '',
    eMailID: selectedParticipant?.eMailID || '',
    firstName: selectedParticipant?.firstName || '',
    lastName: selectedParticipant?.lastName || '',
    aliasName: selectedParticipant?.aliasName || '',
    departmentID: selectedParticipant?.departmentID || '',
    companyMasterID: selectedParticipant?.companyMasterID || '',
    companyID: selectedParticipant?.companyID || '',
    participantID: selectedParticipant?.userID || '',
    isReportPermission: selectedParticipant?.isReportPermission || '',
  }
};

// initialvalue for add and update FAQ
export const initValuesFAQ = () => {
  return {
    faq_title: "",
    faq_description: "",
  };
};

// initialvalue for add and update Help Contact
export const initValuesHelpContent = () => {
  return {
    help_title: "",
    help_description: "",
  };
};

// initialvalue for Create From Existing Surveys
export const initValuesCreateFromExisting = () => {
  return {
    fromCompanyID: "",
    toCompanyID: "",
    fromAssessmentID: "",
    toAssessmentName: "",
    selectionConfirm: false,
  };
};
// validation for add survey
export const validationAdd = () => {
  return yup.object().shape({
    companyMasterID: yup.string().required('Company Master ID is required'),
    companyID: yup.string().required('Company ID is required'),
    assessmnet_name: yup.string().required('Assessment Name is required'),
    outcome_default: yup.string().oneOf(['single', 'multiple'], 'Invalid outcome default'),
    assessment_language: yup.string().required('Assessment language is required'),
    response_slider: yup.string().required('Response slider must be greater than or equal to 0'),
    question_limit: yup.number().required('Question limit must be at least 1'),
    randomize_question: yup.boolean().required('Randomize question field is required'),
    response_score_range: yup.string().required('Response score range is required'),
    question_per_page: yup.number().required('Question per page is required'),
    enable_participant_demographics: yup.string().required('Randomize question field is required'),
    enable_dynamic_filter: yup.boolean().required('Enamble dynamic filter is required'),
    enable_open_ended_questions: yup.string().required('Enamble open ended question field is required'),
    summary_report_name: yup.string().required('Summary report name is required'),
    summary_opening_content: yup.string().required('Summary opening report content is required'),
    summary_closing_content: yup.string().required('Summary closing report content is required'),
    summary_chart_type: yup.string().oneOf(['bar', 'line', 'pie'], 'Invalid chart type'),
    summary_legend_position: yup.string().oneOf(['left', 'right', 'top', 'bottom'], 'Invalid legend position'),
    summary_switch_axis: yup.boolean(),
    summary_scalar_opacity: yup.number()
      .min(0, 'Scalar opacity must be at least 0')
      .max(100, 'Scalar opacity cannot exceed 100'),
    summary_data_label: yup.string().required('Data label is required'),
    summary_font_size: yup.number().min(8, 'Font size must be at least 8').required('Font size is required'),
    summary_db_color: yup.string().matches(/^#([0-9A-F]{3}){1,2}$/i, 'Invalid color code'),
    detail_report_name: yup.string().required('detail report name is required'),
    detail_opening_content: yup.string().required('Detail opening report content is required'),
    detail_closing_content: yup.string().required('Detail closing report content is required'),
    // detail_closing_content: yup.string()
    //   .test(
    //     'not-empty',
    //     'Detail closing report content is required',
    //     value => value && value.trim().replace(/<[^>]+>/g, '').length > 0 // This ensures no empty or whitespace content
    //   )
    //   .required('Detail closing report content is required'),
    detail_chart_type: yup.string().oneOf(['bar', 'line', 'pie'], 'Invalid chart type'),
    detail_legend_position: yup.string().oneOf(['left', 'right', 'top', 'bottom'], 'Invalid legend position'),
    detail_switch_axis: yup.boolean(),
    detail_scalar_opacity: yup.number()
      .min(0, 'Scalar opacity must be at least 0')
      .max(100, 'Scalar opacity cannot exceed 100'),
    detail_data_label: yup.string().required('Data label is required'),
    detail_font_size: yup.number().min(8, 'Font size must be at least 8').required('Font size is required'),
    detail_db_color: yup.string().matches(/^#([0-9A-F]{3}){1,2}$/i, 'Invalid color code'),
    assign_email_subject_line: yup.string().required('Assign email subject line is required'),
    assign_email_header_graphic: yup.string().required('Assign email header graphic is required'),
    assign_email_pre_credential_content: yup.string().required('Assign email pre credential is required'),
    assign_email_post_credential_content: yup.string().required('Assign email Post credential is required'),
    reminder_email_subject_line: yup.string().required('Reminder email subject line is required'),
    reminder_email_header_graphic: yup.string().required('Reminder email header graphic is required'),
    reminder_email_content: yup.string().required('Reminder email content is required'),
    thank_you_email_subject_line: yup.string().required('Thank you email subject line is required'),
    thank_you_email_header_graphic: yup.string().required('Thank you email header graphic line is required'),
    thank_you_email_content: yup.string().required('Thank you email content line is required'),
    email_footer: yup.string().required('Footer email is required'),
    introduction: yup.string().required('Introduction is required'),
    pre_start_email_subject: yup.string().required('Email Subject Line is required'),
    pre_start_email_header: yup.string().required('Header Graphic is required'),
    pre_start_email_content: yup.string().required('Email Content is required'),
    // faq_title:yup.string().optional('Faq title is required'),
    // faq_description: yup.string().optional('Faq description is required'),
    // help_title: yup.string().optional('Help title is required'),   // not in doc
    // help_description: yup.string().optional('Help description is required'),   // not in doc
    colorPaletteID: yup.object({
      colorPaletteID: yup.string()
        .required('colorPaletteID is required')
        .matches(/^\d+$/, 'colorPaletteID must be a number represented as a string'),
      colors: yup.array()
        .of(yup.object({
          color_id: yup.string().optional('color_red is required'),
          color_palette_id: yup.string().optional('color_green is required'),
          color_name: yup.string().optional('color_blue is required'),
          color_code: yup.string().optional('color_blue is required'),
          color_red: yup.number().optional('color_blue is required'),
          color_green: yup.number().optional('color_blue is required'),
          color_blue: yup.number().optional('color_blue is required'),
        }).optional('Each color must be an object with valid properties')
        )
        .min(1, 'Colors array must have at least one color')
        .max(9, 'Colors array cannot have more than 9 colors'),
    }).required('colorPaletteID object is required'),
    participationTool: yup.array().of(
      yup.object().shape({
        confetti_serial_no: yup.string().required('Serial number is required'),
        percentage: yup.number().required('Percentage is required'),
        message: yup.string().required('Message is required'),
        confetti: yup.string().nullable(),
        time_in_sec: yup.number().min(0, 'Time must be non-negative'),
        fireworks: yup.boolean(),
        sound: yup.boolean(),
        star: yup.boolean(),
        star_color: yup.string().nullable(),
      })
    ),
    scalarConfiguration: yup.array().of(
      yup.object().shape({
        scalar_id: yup.string().required('Scalar ID is required'),
        add_scalar_sequence: yup.number().required('Scalar sequence is required'),
        add_scalar_name: yup.string().required('Scalar name is required'),
        add_scalar_min_value: yup.number().required('Minimum value is required').min(1, 'Value must be greater than zero'),
        add_scalar_max_value: yup.number().required('Maximum value is required').min(1, 'Value must be greater than zero'),
        add_scalar_color: yup.string().matches(/^#([0-9A-F]{3}){1,2}$/i, 'Invalid color code'),
      })
    ),
  });


};

// validation update Surveys
export const validationUpdate = () => {
  return yup.object().shape({
    eMailID: yup.string().email('Invalid email format').required('Email is required'),
    firstName: yup.string().required('First Name is required'),
    lastName: yup.string().required('Last Name is required'),
    aliasName: yup.string().required('Alias Name is required'),
    departmentID: yup.string().required('Department is required'),
    isReportPermission: yup.boolean().required('Report selection is required'),
  });
};

// validation FAQ
export const validationFAQ = () => {
  return yup.object().shape({
    faq_title: yup.string().required('Title is required'),
    faq_description: yup.string().required('Description is required'),
  });
};

// validation Help Content
export const validationHelpContact = () => {
  return yup.object().shape({
    help_title: yup.string().required('Title is required'),
    help_description: yup.string().required('Description is required'),
  });
};

// validation Create From Existing
export const validationCreateFromExisting = () => {
  return yup.object().shape({
    fromCompanyID: yup.string().required('From Company Name is required'),
    toCompanyID: yup.string().required('TO Company Name is required'),
    fromAssessmentID: yup.string().required('From Assessment Name is required'),
    toAssessmentName: yup.string().required('To Assessment Name is required'),
    selectionConfirm: yup.boolean().oneOf([true], 'Please check it').required('Please check it'),
  });
};

export const initValuesFindAndReplace = () => {
  return {
    findReplace: "",
    replace_with: "",
    filterQuestion: true,
    filterResponse: true
  };
};

// validation Find And Replace
export const validationfindAndReplace = () => {
  return yup.object().shape({
    findReplace: yup.string().required('Find and Replace required'),
    replace_with: yup.string().required('Replace with is required'),
  });
};


// validation Find And Replace
export const validationParticipantSearchPopup = () => {
  return yup.object({
    // surveyType: yup.string().required("Survey Type is required"),
    surveyType: yup.string().nullable(),
    keywords: yup
      .string()
      .min(3, "Keywords must be at least 3 characters")
      .notRequired()
  });
};


export const validationTextPopup = () => {
  return yup.object({
    surveyText: yup.string().required("Survey Type is required"),
  });
};


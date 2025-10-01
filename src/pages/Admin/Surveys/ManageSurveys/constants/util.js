const arrValue = [
  {
    keyValue: "acc-preStartEmail",
    fieldsArr: [
      "pre_start_email_subject_field",
      "pre_start_email_content_field",
    ],
  },
  {
    keyValue: "acc-assignEmail",
    fieldsArr: [
      "assign_email_subject_line_field",
      "assign_email_pre_credential_content_field",
      "assign_email_post_credential_content_field",
    ],
  },
  {
    keyValue: "acc-reminderEmail",
    fieldsArr: [
      "reminder_email_subject_line_field",
      "reminder_email_content_field",
    ],
  },
  {
    keyValue: "acc-thanksEmail",
    fieldsArr: [
      "thank_you_email_subject_line_field",
      "thank_you_email_content_field",
    ],
  },
];

export function getAccordianString(inputString) {
  if (inputString) {
    const valueObject = arrValue.find((ele) =>
      ele.fieldsArr.includes(inputString)
    );
    if (valueObject) {
      return valueObject.keyValue;
    } else {
      return "";
    }
  } else {
    return "";
  }
}

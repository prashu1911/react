import * as yup from 'yup';

export const initValuesAdd = () => {
  return {
    start_date: "",
    end_date: "",
    is_pre_start_days: 1,
    is_reminder: false,
    is_reminder_complete_date: new Date(),
    is_reminder_complete_days: 1,
    is_reminder_occurance_interval_type: 'Day',
  };
}
export const initValuesEdit = (initialData) => {
  return {
    surveyScheduleID: initialData?.surveyScheduleID,
    departmentID: initialData?.departmentID,
    surveyID: initialData?.surveyID,
    start_date: new Date(initialData?.startDate),
    end_date: new Date(initialData?.endDate),
    is_pre_start_email: Number(initialData?.isPreStart),
    is_pre_start_days: initialData?.preStartDays,
    is_reminder: Number(initialData?.isReminder),
    is_reminder_type: initialData?.reminderToStart,
    is_reminder_complete_date: initialData?.reminderToStartDate ? new Date(initialData?.reminderToStartDate) : new Date(),
    is_reminder_complete_days: initialData?.reminderIntervalStart ,
    is_reminder_occurance_interval_type: initialData?.reminderIntervalStartType,
  };
}


export const validationAdd = () => {
  return yup.object({
    start_date: yup.date().required("Start Date is required"),
    end_date: yup.date().required("End Date is required"),
  });
}

export const validationEdit = () => {
  return yup.object({
    start_date: yup.date().required("Start Date is required"),
    end_date: yup.date().required("End Date is required"),
  });
}
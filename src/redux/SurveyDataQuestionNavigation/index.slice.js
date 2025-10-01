import { createSlice } from "@reduxjs/toolkit";
import logger from "../../utils/logger";

const initialState = {
  surveyData: {},
};

export const authSlice = createSlice({
  name: "surveyDataOnNavigate",
  initialState,
  reducers: {
    surveyAction: (state, action) => {
      return (state = {
        ...state,
        surveyData: { ...action.payload },
      });
    },
  },
});

export const { surveyAction } = authSlice.actions;

export const surveyDataOnNavigation = (data) => async (dispatch) => {
  try {
    dispatch(surveyAction(data));
  } catch (error) {
    logger(error);
  }
};

export const selectSurveyData = (state) =>
  state.surveyDataOnNavigate.surveyData;
export default authSlice.reducer;

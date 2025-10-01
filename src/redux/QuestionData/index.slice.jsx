import { createSlice } from "@reduxjs/toolkit";
import logger from "../../utils/logger";

const initialState = {
  questionData: {},
};

export const authSlice = createSlice({
  name: "questionData",
  initialState,
  reducers: {
    questionAction: (state, action) => {
      return (state = {
        ...state,
        questionData: { ...action.payload },
      });
    },
  },
});

export const { questionAction } = authSlice.actions;

export const questionData = (data) => async (dispatch) => {
  try {
    dispatch(questionAction(data));
  } catch (error) {
    logger(error);
  }
};

export const selectQuestionData = (state) =>
  state.questionData.questionData;
export default authSlice.reducer;

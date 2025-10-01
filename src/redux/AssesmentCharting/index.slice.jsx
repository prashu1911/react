import { createSlice } from "@reduxjs/toolkit";
import logger from "../../utils/logger";

const initialState = {
  AssessmentCharting: {
    unsavedChanges: false,
    isQuickCompare: null,
    // Other keys that might be added during runtime will be removed on reset
  },
};

export const AssessmentChartingSlice = createSlice({
  name: "AssessmentCharting",
  initialState,
  reducers: {
    setAssessmentCharting: (state, action) => {
      state.AssessmentCharting = {
        ...state.AssessmentCharting,
        ...action.payload,
      };
    },

    // 🔁 Add this reducer to reset it
    resetAssessmentCharting: (state) => {
      state.AssessmentCharting = initialState.AssessmentCharting;
    },
  },
});

// Action Exports
export const { setAssessmentCharting, resetAssessmentCharting } =
  AssessmentChartingSlice.actions;

// Optional Thunk
export const updateAssessmentCharting = (data) => async (dispatch) => {
  try {
    dispatch(setAssessmentCharting(data));
  } catch (error) {
    logger(error);
  }
};

// Selector
export const getAssessmentCharting = (state) =>
  state.AssessmentCharting.AssessmentCharting;

// Reducer Export
export default AssessmentChartingSlice.reducer;

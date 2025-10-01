import { createSlice } from "@reduxjs/toolkit";
import logger from "../../utils/logger";

const initialState = {
  userData: {},
  companyData: null,
  maintainCompanySelection: false,
  previousPath: null,
  lastSelectedCompany: null
};

export const manageSurveySlice = createSlice({
  name: "manageSurvey",
  initialState,
  reducers: {
    companySelectAction: (state, action) => {
      state.companyData = action.payload;
      state.lastSelectedCompany = action.payload;
    },
    setMaintainCompanySelection: (state, action) => {
      state.maintainCompanySelection = action.payload;
    },
    clearCompanySelection: (state) => {
      state.companyData = null;
    },
    setPreviousPath: (state, action) => {
      state.previousPath = action.payload;
    },
    restoreLastSelectedCompany: (state) => {
      state.companyData = state.lastSelectedCompany;
    }
  },
});

export const { 
  companySelectAction, 
  setMaintainCompanySelection, 
  clearCompanySelection,
  setPreviousPath,
  restoreLastSelectedCompany
} = manageSurveySlice.actions;

export const selectCompany = (data) => async (dispatch) => {
  try {
    dispatch(companySelectAction(data));
  } catch (error) {
    logger(error);
  }
};

// Correct selector to access the stored company data
export const selectCompanyData = (state) => state.manageSurvey.companyData;
export const selectMaintainCompanySelection = (state) => state.manageSurvey.maintainCompanySelection;
export const selectPreviousPath = (state) => state.manageSurvey.previousPath;
export const selectLastSelectedCompany = (state) => state.manageSurvey.lastSelectedCompany;

export default manageSurveySlice.reducer;

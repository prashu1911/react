import { createSlice } from "@reduxjs/toolkit";
import logger from "../../utils/logger";

const initialState = {
  IRReportData: {
    unsavedChanges:false
  },
};

export const IRReportSlice = createSlice({
  name: "IRReportData",
  initialState,
  reducers: {
    IRReportAction: (state, action) => {
      state.IRReportData = { ...action.payload };
    },
  },
});

// Action Export
export const { IRReportAction } = IRReportSlice.actions;

// Thunk for async update (optional)
export const updateIRReportData = (data) => async (dispatch) => {
  try {
    dispatch(IRReportAction(data));
  } catch (error) {
    logger(error);
  }
};

// Selector
export const getIRReportData = (state) => state.IRReportData.IRReportData;

// Reducer Export
export default IRReportSlice.reducer;

// --- IRNavigationState persistent state logic ---
const IR_NAVIGATION_KEY = "IRNavigationState";

const getInitialIRNavigationState = () => {
  try {
    const stored = localStorage.getItem(IR_NAVIGATION_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  return { type: null };
};

const initialIRNavigationState = getInitialIRNavigationState();

export const IRNavigationSlice = createSlice({
  name: "IRNavigationState",
  initialState: initialIRNavigationState,
  reducers: {
    setIRNavigationState: (state, action) => {
      Object.assign(state, action.payload);
      try {
        localStorage.setItem(IR_NAVIGATION_KEY, JSON.stringify(state));
      } catch (e) {}
    },
  },
});

export const { setIRNavigationState } = IRNavigationSlice.actions;

export const getIRNavigationState = (state) => state.IRNavigationState;

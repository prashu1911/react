import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chartSettings: null, // Default state
};

const chartSettingsSlice = createSlice({
  name: "chartSettings",
  initialState,
  reducers: {
    setChartSettings: (state, action) => {
      state.chartSettings = action.payload;
    },
    clearChartSettings: (state) => {
      state.chartSettings = null;
    },
  },
});

export const { setChartSettings, clearChartSettings } = chartSettingsSlice.actions;

export default chartSettingsSlice.reducer;
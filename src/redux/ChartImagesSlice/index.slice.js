import { createSlice } from "@reduxjs/toolkit";
import logger from "../../utils/logger";

const initialState = {
  chartImages: {}, // Object to store sectionId -> [{ image, type }, ...] mapping
};

export const chartImagesSlice = createSlice({
  name: "chartImages",
  initialState,
  reducers: {
    setChartImage: (state, action) => {
      const { sectionId, base64Image, chartType } = action.payload;
      if (!state.chartImages[sectionId]) {
        state.chartImages[sectionId] = [];
      }
      state.chartImages[sectionId].push({
        image: base64Image,
        type: chartType,
      });
    },
    removeChartImage: (state, action) => {
      const { sectionId, imageIndex } = action.payload;
      if (state.chartImages[sectionId]) {
        state.chartImages[sectionId].splice(imageIndex, 1);
        if (state.chartImages[sectionId].length === 0) {
          delete state.chartImages[sectionId];
        }
      }
    },
    clearChartImage: (state, action) => {
      const { sectionId } = action.payload;
      delete state.chartImages[sectionId];
    },
    clearAllChartImages: (state) => {
      state.chartImages = {};
    },
  },
});

// Action Export
export const { setChartImage, removeChartImage, clearChartImage, clearAllChartImages } = chartImagesSlice.actions;

// Thunk for async update
export const updateChartImage = (sectionId, base64Image, chartType) => async (dispatch) => {
  try {
    dispatch(setChartImage({ sectionId, base64Image, chartType }));
  } catch (error) {
    logger(error);
  }
};

export const clearAllChartImage = () => async (dispatch) => {
  try {
    dispatch(clearAllChartImages({}));
  } catch (error) {
    logger(error);
  }
};

// Selectors
export const getChartImages = (state, sectionId) => state.chartImages.chartImages[sectionId] || [];
export const getChartImage = (state, sectionId, imageIndex = 0) =>
  state.chartImages.chartImages[sectionId]?.[imageIndex]?.image;
export const getChartType = (state, sectionId, imageIndex = 0) =>
  state.chartImages.chartImages[sectionId]?.[imageIndex]?.type;
export const getAllChartImages = (state) => state.chartImages.chartImages;

// Reducer Export
export default chartImagesSlice.reducer;

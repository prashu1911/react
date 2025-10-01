import { createSlice } from "@reduxjs/toolkit";
import logger from "../../utils/logger";

const initialState = {
  outComeID: null,
};

export const outComeSlice = createSlice({
  name: "outCome",
  initialState,
  reducers: {
    outComeAction: (state, action) => {
      state.outComeID = action.payload;
    },
  },
});

export const { outComeAction } = outComeSlice.actions;

export const selectedOutCome = (data) => async (dispatch) => {
  try {
    dispatch(outComeAction(data));
  } catch (error) {
    logger(error);
  }
};

export const selectedOutComeID = (state) => state.outCome.outComeID;
export default outComeSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import  logger  from "../../utils/logger";

const initialState = {
  userData: {},
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginAction: (state, action) => {
      return (state = {
        ...state,
        userData: { ...action.payload },
      });
    },
  },
});

export const { loginAction } =
  authSlice.actions;

export const login = (data) => async (dispatch) => {
  try {
    dispatch(loginAction(data));
  } catch (error) {
    logger(error);
  }
};

export const selectUserData = (state) => state.auth.userData;
export default authSlice.reducer;

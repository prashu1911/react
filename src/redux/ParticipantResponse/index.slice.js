import { createSlice } from "@reduxjs/toolkit";
import logger from "../../utils/logger";

const initialState = {
    participantResponseData: {},
};

export const participantResponseSlice = createSlice({
    name: "participantResponseData",
    initialState,
    reducers: {
        participantResponseDataAction: (state, action) => {
            return (state = {
                ...state,
                participantResponseData: { ...action.payload },
            });
        },
    },
});

export const { participantResponseDataAction } = participantResponseSlice.actions;

export const dispatchResponseData = (data) => async (dispatch) => {
    try {
        dispatch(participantResponseDataAction(data));
    } catch (error) {
        logger(error);
    }
};

export const selectResponseData = (state) =>
    state.participantResponseData.participantResponseData;

export default participantResponseSlice.reducer;

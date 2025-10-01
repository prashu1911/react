import * as ReduxToolkit from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { encryptTransform } from "redux-persist-transform-encrypt";
import logger from "../utils/logger";
import {
  authSlice,
  manageSurveySlice,
  participantResponseSlice,
  SelectedOutcomeSlice,
  SurveyDataQuestionNavigationSlice,
  QuestionDataSlice,
  IRReportSlice,
  chartSettingsReducer,
  chartImagesReducer, assessmentChartingReducer,
  IRNavigationSlice
} from "../redux/index";
import { NAME_KEY } from "../config/app.config";



const RootReducer = combineReducers({
  auth: authSlice,
  outCome: SelectedOutcomeSlice,
  surveyDataOnNavigate: SurveyDataQuestionNavigationSlice,
  participantResponseData: participantResponseSlice,
  chartSettings: chartSettingsReducer,
  questionData:QuestionDataSlice,
  IRReportData:IRReportSlice,
  manageSurvey: manageSurveySlice,
  chartImages: chartImagesReducer,
  AssessmentCharting: assessmentChartingReducer,
  IRNavigationState: IRNavigationSlice.reducer

});

const encryptor = encryptTransform({
  secretKey: `${NAME_KEY}-storage`,
  onError: (error) => {
    logger({ error });
  },
});

const persistConfig = {
  key: NAME_KEY,
  storage,
  whitelist: ["auth", "surveyDataOnNavigate", "participantResponseData", "chartSettings", "IRNavigationState"],
  transforms: [encryptor],
};

const persistedReducer = persistReducer(persistConfig, RootReducer);

const store = ReduxToolkit.configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;

export const Persistor = persistStore(store);

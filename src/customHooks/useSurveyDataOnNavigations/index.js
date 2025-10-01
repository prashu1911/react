import { useDispatch, useSelector } from "react-redux";
import {
  surveyDataOnNavigation,
  selectSurveyData,
} from "../../redux/SurveyDataQuestionNavigation/index.slice";

const useSurveyDataOnNavigations = () => {
  const dispatch = useDispatch();

  const dispatcSurveyDataOnNavigateData = (data) => {
    dispatch(surveyDataOnNavigation(data));
  };

  const getSurveyDataOnNavigate = () => {
    const surveyData = useSelector(selectSurveyData);
    return surveyData;
  };

  const dispatcClearSurveyData = () => {
    dispatch(surveyDataOnNavigation({}));
  };

  return {
    dispatcSurveyDataOnNavigateData,
    getSurveyDataOnNavigate,
    dispatcClearSurveyData,
  };
};

export default useSurveyDataOnNavigations;

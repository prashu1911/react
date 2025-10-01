import { useDispatch, useSelector } from "react-redux";
import {
  questionData,
  selectQuestionData,
} from "../../redux/QuestionData/index.slice";

const useQuestionData = () => {
  const dispatch = useDispatch();

  const dispatchQuestionData = (data) => {
    dispatch(questionData(data));
  };

  const getQuestionData = () => {
    const surveyData = useSelector(selectQuestionData);
    return surveyData;
  };

  const dispatchClearQuestionData = () => {
    dispatch(questionData({}));
  };

  return {
    dispatchQuestionData,
    getQuestionData,
    dispatchClearQuestionData,
  };
};

export default useQuestionData;

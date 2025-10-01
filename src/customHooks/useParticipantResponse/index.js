import { useDispatch, useSelector } from "react-redux";
import { dispatchResponseData, selectResponseData } from "../../redux/ParticipantResponse/index.slice";

const useParticipantResponse = () => {
  const dispatch = useDispatch();

  const dispatcParticipantResponseData = (data) => {
    dispatch(dispatchResponseData(data));
  };

  const getParticipantResponse = () => {
    const responseData = useSelector(selectResponseData);
    return responseData;
  };

  const dispatcClearParticipantResponse = () => {
    dispatch(dispatchResponseData({}));
  };

  return {
    dispatcParticipantResponseData,
    getParticipantResponse,
    dispatcClearParticipantResponse,
  };
};

export default useParticipantResponse;

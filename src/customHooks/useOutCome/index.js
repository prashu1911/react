import { useDispatch, useSelector } from "react-redux";
import {
  selectedOutCome,
  selectedOutComeID,
} from "../../redux/SelectedOutcomeSlice/index.slice";

const useOutCome = () => {
  const dispatch = useDispatch();
  const outComeID = useSelector(selectedOutComeID);

  const setOutCome = (data) => {
    dispatch(selectedOutCome(data));
  };

  return { outComeID, setOutCome };
};

export default useOutCome;

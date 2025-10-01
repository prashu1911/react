import { useDispatch, useSelector } from 'react-redux';
import { login, selectUserData } from '../../redux/AuthSlice/index.slice'; 

const useAuth = () => {
  const dispatch = useDispatch();
  
  const dispatcLoginUserData = (data) => {
    dispatch(login(data)); 
  };

  const getloginUserData = () => {
    const userData = useSelector(selectUserData);
    return userData
  };

  const dispatcLogout = () => {
    dispatch(login({})); 
  }

  return {
    getloginUserData,
    dispatcLoginUserData,
    dispatcLogout,
  };
};

export default useAuth;

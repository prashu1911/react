import { useDispatch, useSelector } from "react-redux";
import {  clearChartSettings, setChartSettings } from '../../redux/ChartSettingsSlice/index.slice'; 


export const useChartSettings = () => {
  const dispatch = useDispatch();
  const chartSettings = useSelector((state) => state.chartSettings.chartSettings);

  const saveChartSettings = (settings) => {
    dispatch(setChartSettings(settings));
  };

  const resetChartSettings = () => {
    dispatch(clearChartSettings());
  };

  return {
    chartSettings,
    saveChartSettings,
    resetChartSettings,
  };
};
import Chart from "react-apexcharts";
import { switchAxisData } from "../Constants/chartOptionsFunction";

export default function SpiderChart({legend,fontSize,labelColor,dataLabels,switchAxis,colorArr}) {
  const spiderOptions = {
    chart: {
      type: "radar",
      height: 350,
      toolbar: {
        show: true,
        tools : {
          download: true, 
          zoom: false,
          zoomin: false,
          zoomout: false,
        },
        export: {
          svg: {
            filename: 'chart-svg' 
          },
          png: {
            filename: 'chart-png'
          },
          csv: {
            filename: 'chart-data'
          }
        },
      },
      zoom: {
        enabled: false,
      },
    },

    xaxis: {
      categories:  switchAxis ? ["Outcome 1", "Outcome 2", "Outcome 3"] :  ["Overall", "User 1", "User 2"],
      tickAmount: 30,
    },
    fill: {
      opacity: 0.25,
      colors: colorArr,
    },
    colors: colorArr,
    stroke: {
      width: 2,
    },
    markers: {
      size: 4,
    },
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 5,
    },

    annotations: {
      xaxis: [],
      yaxis: [],
    },
    dataLabels: {
      position: "top",
      enabled: dataLabels !== 'none',
      style: {
        fontSize:fontSize ? `${fontSize}px` : "8px",
        colors: [labelColor] || ["#000"],
      },
    },
    legend: {
      position: legend === "hidden" ? "left" : legend,
      show: legend !== "hidden"
    },
  };
  return (
    <Chart
      id="spider11"
      options={spiderOptions}
      series={
        switchAxis
          ? switchAxisData.dataTypeTwo.data
          : switchAxisData.dataTypeOne.data
      }
      type="radar"
      height={350}
    />
  );
}

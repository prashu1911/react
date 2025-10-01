import Chart from "react-apexcharts";
import { switchAxisData } from "../Constants/chartOptionsFunction";

export default function ColumnChart({legend,fontSize,labelColor,dataLabels,switchAxis,scalarConfiguration,colorArr}) {
 const columnOptions = {
    chart: {
      type: 'bar',
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
      
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 5,
        borderRadiusApplication: 'end'
      },
    },
  
    colors:colorArr,
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: switchAxis ? ["Outcome 1", "Outcome 2", "Outcome 3"] :  ["Overall", "User 1", "User 2"],
    },
    yaxis: {
        max: 100,
      scale: {
        tickAmount: 5,
        min: 0,
        max: 100
      },
    },
    fill: {
      opacity: 1
    },
    scale: {
        tickAmount: 5,
        min: 0,
        max: 100
      },
      dataLabels: {
        position: dataLabels || "top",
        enabled: dataLabels !== "none",
        style: {
          fontSize: fontSize ? `${fontSize}px` : "8px",
          colors: [labelColor] || ["#000"],
        },
      },
   
    annotations: {
        yaxis: scalarConfiguration,
      },
      legend: {
        position: legend === "hidden" ? "left" : legend,
        horizontalAlign: "center",
        labels: {
          colors: ["#000"],
        },
        show: legend !== "hidden",
      }
  }
 return (
<Chart
      id="column11" 
      options={columnOptions}
      series={
        switchAxis
          ? switchAxisData.dataTypeTwo.data
          : switchAxisData.dataTypeOne.data
      }
      type="bar"
      height={350}
    />
 )
}
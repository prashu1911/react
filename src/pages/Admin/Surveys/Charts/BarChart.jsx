import Chart from "react-apexcharts";
import { switchAxisData } from "../Constants/chartOptionsFunction";


export default function BarChart({legend,fontSize,labelColor,dataLabels,switchAxis,scalarConfiguration,colorArr}) {

  const BarOptions = {
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
      
      stacked: false,
    },
    markers: {
      size: 16,
      shape: "circle",
      hover: {
        size: 24,
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "solid",
      opacity: 1,
    },
    plotOptions: {
      bar: {
        dataLabels: {
          position: dataLabels || "top",
        },
        horizontal: true,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    
    colors: colorArr,
    dataLabels: {
      position:  dataLabels || "top",
      enabled: dataLabels !== 'none',
      style: {
        fontSize: fontSize ? `${fontSize}px` : "8px",
        colors: [labelColor] || ["#000"],
      },
    },
    xaxis: {
      categories: switchAxis ? ["Outcome 1", "Outcome 2", "Outcome 3"] :  ["Overall", "User 1", "User 2"],
      labels: {
        style: {
          fontSize: "14px",
        },
      },
    },
    yaxis: {
      max: 100,
    
      labels: {
        style: {
          fontSize: "8px",
        },
      },
    },
    grid: {
      show: false,
    },
    annotations: {
      xaxis: scalarConfiguration ,
      yaxis: []
    },
  
    legend: {
      position: legend === "hidden" ? "left" : legend,
      horizontalAlign: "center",
      labels: {
        colors: ["#000"],
      },
      show: legend !== "hidden"
    }
  }

  return (
    <Chart
      id="bar11"
      options={BarOptions}
      series={
        switchAxis
          ? switchAxisData.dataTypeTwo.data
          : switchAxisData.dataTypeOne.data
      }
      type="bar"
      height={350}
    />
  );
}

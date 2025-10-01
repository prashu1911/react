import Chart from "react-apexcharts";

import { scatterRenderDataTypes } from "../Constants/chartOptionsFunction";

export default function ScatterChart({legend,fontSize,labelColor,dataLabels,switchAxis,scalarConfiguration,colorArr}) {
    const scatterOptions = {
        chart: {
          type: "scatter",
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
          zoom: false
        },
        xaxis: {
          categories: switchAxis ? ["Outcome 1", "Outcome 2", "Outcome 3"] :  ["Overall", "User 1", "User 2"],
       
          tickPlacement: "on",
          labels: {
            rotate: 0,
            style: {
              fontSize: "14px"
            }
          }
        },
        yaxis: {
          min: 0,
          max: 100,
          tickAmount: 5,
          
        },
        markers: {
          size: 10
        },
        tooltip: {
          shared: true,
          intersect: false
        },
      
        labels: {
            offsetX: 10,
            style: {
              fontSize: "14px"
            }
          },
          dataLabels: {
            position: dataLabels || "top",
            enabled:  dataLabels !== 'none',
            style: {
              fontSize: fontSize ? `${fontSize}px` : "8px",
              colors: [labelColor || "#000"],
            },
          },
          colors: colorArr,
        annotations: {
            yaxis: scalarConfiguration,
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
             id="scatter11"
             options={scatterOptions}
             series={
               switchAxis
                 ? scatterRenderDataTypes.dataTypeTwo : scatterRenderDataTypes.dataTypeOne
             }
             type="scatter"
             height={350}
           />
      )
}
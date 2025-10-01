import Chart from "react-apexcharts";
import { switchAxisData } from "../Constants/chartOptionsFunction";

export default function LineChart({legend,fontSize,labelColor,dataLabels,switchAxis,scalarConfiguration,colorArr}) {
    const lineOptions = {
        chart: {
          type: 'line',
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
            enabled: false
          },
          stacked: false,
          id: 'areachart-2'
        },
        // markers: {
        //   size: 16,
        //   shape: "circle",
        //   hover: {
        //     size: 24,
        //   },
        // },
        stroke: {
          curve: "straight",
          width: 2,
        },
        fill: {
          type: "solid",
          opacity: 1,
        },
        // plotOptions: {
        //   bar: {
        //     dataLabels: {
        //       position: "top",
        //     },
        //     horizontal: true,
        //     columnWidth: "55%",
        //     endingShape: "rounded",
        //   },
        // },
        colors: colorArr,
        dataLabels: {
            position:  dataLabels || "top",
            enabled: dataLabels !== 'none',
          style: {
            fontSize: fontSize ? `${fontSize}px` : "8px",
            colors: [labelColor || "#000"],
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
          min: 0,
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
           yaxis: scalarConfiguration,
        },
        legend: {
          position:legend === "hidden" ? "left" : legend,
          horizontalAlign: "center",
          labels: {
            colors: ["#000"],
          },
        },
      };

    return (
        <Chart
              id="line11"
              options={lineOptions}
              series={
                switchAxis
                  ? switchAxisData.dataTypeTwo.data
                  : switchAxisData.dataTypeOne.data
              }
              type="line"
              height={350}
            />
    )
}
import React from "react";
import Chart from 'react-apexcharts';

export default function BarChart() {

// apexchart start
  const options = {
    chart: {
      type: 'bar',
      height: 480,
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false
    },
    fill: {
      opacity: 1,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '15%',
        borderRadius: 5,
        borderRadiusApplication: 'end',
      },
    },
    tooltip: {
      custom({ series, seriesIndex, dataPointIndex}) {
          return `<div class="custom-tooltip">` +
              `<span>${  series[seriesIndex][dataPointIndex]  }</span>` +
          `</div>`
      },
    },
    xaxis: {
      categories: ['Overall'],
      crosshairs: {
        show: false 
      },
  
      labels: {
        show: true,
        style: {
          color: '#0F0F0F',
          fontSize: '14px',
          fontFamily: 'sans-serif',
          fontWeight: 600,
        },
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 5,
    },
    stroke: {
      colors: ["transparent"],
      width: 5
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
    },
  };
  const series = [
    {
        name: 'Strongly Agree',
        data: [60],
        color: '#F37F73',
        zIndex: 1
    },
    {
      name: 'Agree',
      data: [25],
      color: '#F7C758',
      zIndex: 1
  }
  ];
  // apex chart end
    return (
        <Chart options={options} series={series} type="bar" height={350} />
    )
}
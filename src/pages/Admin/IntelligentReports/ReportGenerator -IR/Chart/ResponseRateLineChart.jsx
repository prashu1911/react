import { color } from "chart.js/helpers";
import React from "react";
import ReactApexChart from "react-apexcharts";

export default function ResponseRateLineChart() {
    const series = [
        {
            name: ' Response rate',
            data: [4],
            color: "transparent",
        }, 
    ];
    const options = {
        chart: {
            height: 350,
            type: 'line',
            zoom: {
                enabled: false
            },
            toolbar: {
                show: false,
            },
        },
        dataLabels: {
            enabled: false
        },
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'],
                opacity: 0.5,
            },
        },
        xaxis: {
            categories: ['08/08/2024'],
        },
        yaxis: {
            min: 0,
            max: 4,
            tickAmount: 4,
        },
        markers: {
            size: 5,
            colors: "#0968AC",
            strokeOpacity: 1,
            strokeDashArray: 0,
            fillOpacity: 1,
            shape: "circle",
            showNullDataPoints: true,
            hover: {
              size: 2,
              colors: "transparent",
              sizeOffset: 0
            }
        },
        
    };
    return (
        <div className="resposnseRate">
            <div className="resposnseRate_chart">
                <ReactApexChart options={options} series={series} type="line" height={350} />
            </div>
        </div>
    );
}
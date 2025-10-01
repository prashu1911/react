import React from "react";
import ReactApexChart from "react-apexcharts";

export default function ManagerEffectivenessChart(){
    const series = [
        { name: "Favorable", data: 33.33 },
        { name: "Neutral", data: 33.33},
        { name: "Unfavorable", data: 33.33 },
    ];
    const options = {
        chart: {
            type: "donut",
            height: 350,
        },
        legend: {
            show: false,
        },
        labels: series.map(item => item.name),
     };
    return (
        <div>
            <ReactApexChart options={options} series={series.map(item => item.data)} type="donut" height={350} />
        </div>
    )
}
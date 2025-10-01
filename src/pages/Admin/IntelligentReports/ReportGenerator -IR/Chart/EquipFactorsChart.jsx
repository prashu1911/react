import React from "react";
import ReactApexChart from "react-apexcharts";

export default function EquipFactorsChart(){
    const series = [
        { name: "Favorable", data: 27.7 },
        { name: "Neutral", data: 16.8},
        { name: "Unfavorable", data: 55.4 },
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
import React from "react";
import ReactApexChart from "react-apexcharts";


export default function ResponseRatePieChart() {
    const series = [100];
    const options = {
        chart: {
            type: "donut",
            height: 350,
        },
        legend: {
            show: false,
        },
        colors: ["#0968AC"],
     };
    return (
        <div>
            <ReactApexChart options={options} series={series} type="donut" height={350} />
        </div>
    )
}
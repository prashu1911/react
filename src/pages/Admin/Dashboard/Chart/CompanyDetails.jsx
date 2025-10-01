import React from "react";
import Chart from 'react-apexcharts';

export default function CompanyDetails({ data }) {
  // Extract categories (company names)
  const categories = data.map(item => item.companyName);

  // Dynamically create series for each type
  const series = [
    {
      name: 'Unassign',
      data: data.map(item => item.unassign),
    },
    {
      name: 'Design',
      data: data.map(item => item.design),
    },
    {
      name: 'Closed',
      data: data.map(item => item.closed),
    },
    {
      name: 'Active',
      data: data.map(item => item.active),
    },
  ];

  // Chart options
  const options = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '25%',
      },
    },
    xaxis: {
      type: 'category',
      categories: categories,
      labels: {
        style: {
          color: "#0F0F0F",
          fontSize: '14px',
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 600,
        },
        formatter: function(value) {
          console.log("categories?.length" ,categories?.length);
          
          const maxLineLength = categories?.length>6?8:categories?.length>4?16:22;
          if (value.length <= maxLineLength) return value;
          // const firstLine = value.slice(0, maxLineLength);
          // const secondLine = value.length > maxLineLength * 2
          //   ? value.slice(maxLineLength, maxLineLength * 2 - 3) + '...'
          //   : value.slice(maxLineLength);
          return value;
        },
      },
      axisTicks: { show: false },
      crosshairs: { show: false },
      title: {
        text: "Company",
        offsetY: -5,
        style: {
          color: "#0F0F0F",
          fontSize: '14px',
          fontWeight: 600,
        },
      },
    },
    yaxis: {
      tickAmount: 5,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
    },
    fill: {
      opacity: 1,
    },
    colors: ['#0968AC', '#F49186', '#888C8F', '#FCB92C'],
    tooltip: {
      x: {
        formatter: function(value) {
          return value; // Show full company name in tooltip
        }
      }
    },
  };

  console.log("company detail", series, categories);
  

  return (
    <div className="barChart">
      <Chart className="barChart_inner xl" options={options} series={series} type="bar" height={450} />
    </div>
  );
}

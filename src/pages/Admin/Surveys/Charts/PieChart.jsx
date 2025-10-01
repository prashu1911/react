import Chart from "react-apexcharts";

export default function PieChart({xaxisLabel,series}) {
const pieChartOptions = {
    chart: {
      width:"380",
      type: 'pie',
    },
    labels: xaxisLabel,
    legend:  {
        position: 'bottom', 
        horizontalAlign: 'center',
        fontSize: '14px'
      },
    responsive: [{
     
      options: {
       
        legend: {
          position: 'bottom'
        }
      }
    }]
  }

  return (
    <Chart options={pieChartOptions} series={series} type="pie" width={500}/>
  )
}
import { useEffect } from "react";
import ApexCharts from 'apexcharts';


export default function DemographicResponses() {

     // pie chart
  const PieChart = ({ pieId, pieLabels, pieColors, pieSeries, pieClass }) => {
    useEffect(() => {
        let pieOptions = {
            chart: {
                type: "pie",
                width: '100%',
                height:485,
            },
            colors: pieColors,
            labels: pieLabels,
            series: pieSeries,
            width:20,
            dataLabels: {
                enabled: true,
                style: {
                    colors: ['#000000'],
                    fontSize: ['14px'],
                    fontWeight: ['500'],
                    fontFamily: '"Poppins", Arial, sans-serif',
                },
            },
            tooltip: {
                fillSeriesColor:true,
                theme: '#fff'
            },
            legend: {
                show: true,
                position: 'bottom',
                horizontalAlign: 'center',
                colors: '#000000',
                fontSize: '14px',
                fontWeight: 500,
                fontFamily: '"Poppins", Arial, sans-serif',
                offsetY: 0,
                offsetX: 0,
                markers: {
                    size: 6,
                    shape:"square",
                    color:"#0F0F0F"
                }
            },
            responsive: [
                {
                    breakpoint: 991,
                    options: {
                        chart: {
                            height:300,
                        },
                        dataLabels: {
                            style: {
                                fontSize: ['11px'],
                            },
                        },
                        legend: {
                            fontSize: '12px',
                        },
                    },
                },
            ]
        }
  
      // eslint-disable-next-line no-undef
      const chart = new ApexCharts(document.querySelector(pieId), pieOptions);
      chart.render();
  
      // Cleanup function to destroy the chart when the component unmounts
      return () => {
        chart.destroy();
      };
    }, [pieId, pieLabels, pieColors, pieSeries]);
  
    return <div id={pieId.substring(1)} className={pieClass} />;
  };
     // pie chart
  const PieChart2 = ({ pieId, pieLabels, pieColors, pieSeries, pieClass }) => {
    useEffect(() => {
        let pieOptions = {
            chart: {
                type: "pie",
                width: '100%',
                height:485,
            },
            colors: pieColors,
            labels: pieLabels,
            series: pieSeries,
            width:20,
            dataLabels: {
                enabled: true,
                style: {
                    colors: ['#000000'],
                    fontSize: ['14px'],
                    fontWeight: ['500'],
                    fontFamily: '"Poppins", Arial, sans-serif',
                },
            },
            tooltip: {
                fillSeriesColor:true,
                theme: '#fff'
            },
            legend: {
                show: true,
                position: 'bottom',
                horizontalAlign: 'center',
                colors: '#000000',
                fontSize: '14px',
                fontWeight: 500,
                fontFamily: '"Poppins", Arial, sans-serif',
                offsetY: 0,
                offsetX: 0,
                markers: {
                    size: 6,
                    shape:"square",
                    color:"#0F0F0F"
                }
            },
            responsive: [
                {
                    breakpoint: 991,
                    options: {
                        chart: {
                            height:350,
                        },
                        legend: {
                            fontSize: '12px',
                        },
                        dataLabels: {
                            style: {
                                fontSize: ['11px'],
                            },
                        },
                    },
                },
            ]
        }
  
      // eslint-disable-next-line no-undef
      const chart = new ApexCharts(document.querySelector(pieId), pieOptions);
      chart.render();
  
      // Cleanup function to destroy the chart when the component unmounts
      return () => {
        chart.destroy();
      };
    }, [pieId, pieLabels, pieColors, pieSeries]);
  
    return <div id={pieId.substring(1)} className={pieClass} />;
  };
    return (
        <>
            <div className="reportSec_box_chart">
                <span>Age</span>
                <PieChart pieId="#adminPie"  pieLabels={['Under 18', '18-24', '35-44', '45-54', '55-64', '65+']}
                pieColors={['#ef3d31', '#f46a2b', '#f88d23', '#fcad18', '#ffcb05', '#81b73c', '#6aa93a']}
                pieSeries={[25, 75]}
                pieClass="d-flex justify-content-center" />
            </div>

            <div className="reportSec_box_chart">
                <span>Gender</span>
                <PieChart pieId="#adminPie2"  pieLabels={['Man', 'Woman', 'Non-binary', 'Gender fluid', 'Prefer not to say']}
                pieColors={['#ef3d31', '#f46a2b', '#f88d23', '#fcad18', '#ffcb05']}
                pieSeries={[25, 50, 25]}
                pieClass="d-flex justify-content-center" />
            </div>

            <div className="reportSec_box_chart">
                <span>Industry</span>
                <PieChart2 pieId="#adminPie3"  pieLabels={['Automotive', 'Consumer Electronics', 'Consumer Packaged Goods', 'Education', 'Financial Services', 'Gaming', 'Government', 'Healthcare and Life Sciences', 'Industrial Goods', 'Internet Technology and Software', 'Logistics', 'Manufacturing', 'Media and Entertainment', 'Non-Profit', 'Pharmaceutical', 'Research', 'Retail and eCommerce', 'Telecommunications', 'Travel and Leisure; Hospitality', 'Sports', 'Utilities & Energy', 'Other']}
                pieColors={['#ef3d31', '#f46a2b', '#f88d23', '#fcad18', '#ffcb05', '#81b73c', '#6aa93a', '#519a38', '#368c36', '#ef3d31', '#f46a2b', '#f88d23', '#fcad18', '#81b73c', '#6aa93a', '#519a38', '#368c36', '#ef3d31', '#f46a2b', '#f88d23', '#fcad18']}
                pieSeries={[25, 25, 25, 25]}
                pieClass="d-flex justify-content-center" />
            </div>

            <div className="reportSec_box_chart">
                <span>Work type</span>
                <PieChart pieId="#adminPie4"  pieLabels={['Part-time', 'Full-time', 'Auxiliary/On-Call', 'Other']}
                pieColors={['#ef3d31', '#f46a2b', '#f88d23', '#fcad18']}
                pieSeries={[75, 25]}
                pieClass="d-flex justify-content-center" />
            </div>

            <div className="reportSec_box_chart">
                <span>What is your highest level of education?</span>
                <PieChart pieId="#adminPie5"  pieLabels={['Some high school', 'High school graduate', 'Some college', 'Bachelor’s degree', 'Master’s degree']}
                pieColors={['#ef3d31', '#f46a2b', '#f88d23', '#fcad18', '#ffcb05']}
                pieSeries={[25, 50, 25]}
                pieClass="d-flex justify-content-center" />
            </div>


            <div className="reportSec_box_chart">
                <span>What type of area do you live in?</span>
                <PieChart pieId="#adminPie6"  pieLabels={['Urban', 'Suburban', 'Rural']}
                pieColors={['#ef3d31', '#f46a2b', '#f88d23']}
                pieSeries={[75, 25]}
                pieClass="d-flex justify-content-center" />
            </div>
        </>
    )
}
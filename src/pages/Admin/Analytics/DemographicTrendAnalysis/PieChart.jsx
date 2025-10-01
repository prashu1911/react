import React, { useEffect } from 'react';
import ApexCharts from "apexcharts";

export default function PieChart({ pieId, pieLabels, pieColors, pieSeries, pieClass }) {

    //     // pie chart
    // eslint-disable-next-line no-shadow
    const PieChartOption = ({ pieId, pieLabels, pieColors, pieSeries, pieClass }) => {
        useEffect(() => {
            let pieOptions = {
                chart: {
                    type: "pie",
                    width: '100%',
                    height: 485,
                },
                colors: pieColors,
                labels: pieLabels,
                series: pieSeries,
                width: 20,
                dataLabels: {
                    enabled: true,
                    style: {
                        colors: ['#000000'],
                        fontSize: ['16px'],
                        fontWeight: ['600'],
                        fontFamily: '"Poppins", Arial, sans-serif',
                    },
                },
                tooltip: {
                    fillSeriesColor: true,
                    theme: '#fff'
                },
                legend: {
                    show: true,
                    position: 'bottom',
                    horizontalAlign: 'center',
                    colors: '#000000',
                    fontSize: '16px',
                    fontWeight: 500,
                    fontFamily: '"Poppins", Arial, sans-serif',
                    offsetY: 0,
                    offsetX: 0,
                    itemMargin: {
                        horizontal: 10,
                        vertical: 10
                    },
                    markers: {
                        size: 6,
                        shape: "square",
                        color: "#0F0F0F"
                    },

                },
                responsive: [
                    {
                        breakpoint: 1599,
                        options: {
                            chart: {
                                height: 420,
                            },
                            legend: {
                                fontSize: '14px',
                                itemMargin: {
                                    horizontal: 5,
                                    vertical: 3
                                },
                            },
                        },
                    },
                    {
                        breakpoint: 1199,
                        options: {
                            chart: {
                                height: 350,
                            },
                        },
                    },
                    {
                        breakpoint: 576,
                        options: {
                            chart: {
                                width: '100%',
                                height: 300
                            },
                            dataLabels: {
                                style: {
                                    fontSize: ['12px'],
                                },
                            },
                            legend: {
                                fontSize: '12px',
                                horizontalAlign: 'center',
                                itemMargin: {
                                    horizontal: 5,
                                    vertical: 3
                                },
                            }
                        }
                    }
                ]
            }

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
            <PieChartOption
                pieId={pieId}
                pieLabels={pieLabels}
                pieColors={pieColors}
                pieSeries={pieSeries}
                pieClass={pieClass}
            />
        </>
    )
}
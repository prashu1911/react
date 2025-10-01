const columnOptions = {
    chart: {
      type: 'bar',
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
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 5,
        borderRadiusApplication: 'end'
      },
    },
  
    colors:["#FF4D4D", "#FFD700", "#32CD32"],
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: ["Overall", "User 1", "User 2"],
    },
    yaxis: {
        max: 100,
      scale: {
        tickAmount: 5,
        min: 0,
        max: 100
      },
    },
    fill: {
      opacity: 1
    },
    scale: {
        tickAmount: 5,
        min: 0,
        max: 100
      },
      dataLabels: {
        position: "top",
        enabled: true,
        style: {
          fontSize: "8px",
          colors: ["#000"],
        },
      },
   
    annotations: {
        yaxis: [
          {
            y: 0,
            y2: 40,
            borderColor: "#FFECEC",
            fillColor: "#FFECEC",
            opacity: 0.1,
            label: {
              text: "Very Low",
              position: "right",
              style: {
                color: "#FF4D4D",
                background: "none",
                fontSize: "14px",
              },
            },
          },
          {
            y: 40,
            y2: 60,
            borderColor: "#FFF9E5",
            fillColor: "#FFF9E5",
            opacity: 0.1,
            label: {
              text: "Low",
              position: "right",
              style: {
                color: "#FFD700",
                background: "none",
                fontSize: "14px",
              },
            },
          },
          {
            y: 60,
            y2: 80,
            borderColor: "#F1FFE5",
            fillColor: "#F1FFE5",
            opacity: 0.1,
            label: {
              text: "Average",
              position: "right",
              style: {
                color: "#32CD32",
                background: "none",
                fontSize: "14px",
              },
            },
          },
          {
            y: 80,
            y2: 100,
            borderColor: "#E6FFCC",
            fillColor: "#E6FFCC",
            opacity: 0.1,
            label: {
              text: "High",
              position: "right",
              style: {
                color: "#228B22",
                background: "none",
                fontSize: "14px",
              },
            },
          },
        ],
      },
      legend: {
        position: "left",
        horizontalAlign: "center",
        labels: {
          colors: ["#000"],
        },
      }
  }




  const barOptions = {
    chart: {
      type: 'bar',
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
      stacked: false,
    },
    markers: {
      size: 16,
      shape: "circle",
      hover: {
        size: 24,
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "solid",
      opacity: 1,
    },
    plotOptions: {
      bar: {
        dataLabels: {
          position: "top",
        },
        horizontal: true,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    colors:["#FF4D4D", "#FFD700", "#32CD32"],
    dataLabels: {
      position: "top",
      enabled: true,
      style: {
        fontSize: "8px",
        colors: ["#000"],
      },
    },
    xaxis: {
      categories: ["Overall", "User 1", "User 2"],
      labels: {
        style: {
          fontSize: "14px",
        },
      },
    },
    yaxis: {
      max: 100,
      categories: ["Overall", "User 1", "User 2"],
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
      xaxis: [
        {
          x: 0,
          x2: 40,
          borderColor: "#FFECEC",
          fillColor: "#FFECEC",
          opacity: 0.1,
          label: {
            text: "Very Low",
            orientation: 'horizontal',
            style: {
              color: "#FF4D4D",
              background: "none",
              fontSize: "14px",
            },
          },
        },
        {
          x: 40,
          x2: 60,
          borderColor: "#FFF9E5",
          fillColor: "#FFF9E5",
          opacity: 0.1,
          label: {
            text: "Low",
            orientation: 'horizontal',
           
            style: {
              color: "#FFD700",
              background: "none",
              fontSize: "14px",
            },
          },
        },
        {
          x: 60,
          x2: 80,
          borderColor: "#F1FFE5",
          fillColor: "#F1FFE5",
          opacity: 0.1,
          label: {
            text: "Average",
            orientation: 'horizontal',
            style: {
              color: "#32CD32",
              background: "none",
              fontSize: "14px",
            },
          },
        },
        {
          x: 80,
          x2: 100,
          borderColor: "#E6FFCC",
          fillColor: "#E6FFCC",
          opacity: 0.1,
          label: {
            text: "High",
            orientation: 'horizontal',
            style: {
              color: "#228B22",
              background: "none",
              fontSize: "14px",
            },
          },
        },
      ],
      yaxis: []
    },
  
    legend: {
      position: "left",
      horizontalAlign: "center",
      labels: {
        colors: ["#000"],
      },
    }
  }

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
    colors: ["#FF4D4D", "#FFD700", "#32CD32"],
    dataLabels: {
      position: "top",
      enabled: true,
      style: {
        fontSize: "8px",
        colors: ["#000"],
      },
    },
    xaxis: {
      categories: ["Overall", "User 1", "User 2"],
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
      yaxis: [
        {
          y: 0,
          y2: 40,
          borderColor: "#FFECEC",
          fillColor: "#FFECEC",
          opacity: 0.1,
          label: {
            text: "Very Low",
            position: "right",
            style: {
              color: "#FF4D4D",
              background: "none",
              fontSize: "14px",
            },
          },
        },
        {
          y: 40,
          y2: 60,
          borderColor: "#FFF9E5",
          fillColor: "#FFF9E5",
          opacity: 0.1,
          label: {
            text: "Low",
            position: "right",
            style: {
              color: "#FFD700",
              background: "none",
              fontSize: "14px",
            },
          },
        },
        {
          y: 60,
          y2: 80,
          borderColor: "#F1FFE5",
          fillColor: "#F1FFE5",
          opacity: 0.1,
          label: {
            text: "Average",
            position: "right",
            style: {
              color: "#32CD32",
              background: "none",
              fontSize: "14px",
            },
          },
        },
        {
          y: 80,
          y2: 100,
          borderColor: "#E6FFCC",
          fillColor: "#E6FFCC",
          opacity: 0.1,
          label: {
            text: "High",
            position: "right",
            style: {
              color: "#228B22",
              background: "none",
              fontSize: "14px",
            },
          },
        },
      ],
    },
    legend: {
      position: "left",
      horizontalAlign: "center",
      labels: {
        colors: ["#000"],
      },
    },
  }

  const scatterOptions = {
    chart: {
      type: "scatter",
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
      zoom: false
    },
    xaxis: {
      categories: ["Overall", "User 1", "User 2"],
   
      tickPlacement: "on",
      labels: {
        rotate: 0,
        style: {
          fontSize: "14px"
        }
      }
    },
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 5,
      
    },
    markers: {
      size: 10
    },
    tooltip: {
      shared: true,
      intersect: false
    },
  
    labels: {
        offsetX: 10,
        style: {
          fontSize: "14px"
        }
      },
      dataLabels: {
        position: "top",
        enabled: true,
        style: {
          fontSize: "8px",
          colors: ["#000"],
        },
      },
      colors: ["#FF4D4D", "#FFD700", "#32CD32"],
    annotations: {
        yaxis: [
          {
            y: 0,
            y2: 40,
            borderColor: "#FFECEC",
            fillColor: "#FFECEC",
            opacity: 0.1,
            label: {
              text: "Very Low",
              position: "right",
              style: {
                color: "#FF4D4D",
                background: "none",
                fontSize: "14px",
              },
            },
          },
          {
            y: 40,
            y2: 60,
            borderColor: "#FFF9E5",
            fillColor: "#FFF9E5",
            opacity: 0.1,
            label: {
              text: "Low",
              position: "right",
              style: {
                color: "#FFD700",
                background: "none",
                fontSize: "14px",
              },
            },
          },
          {
            y: 60,
            y2: 80,
            borderColor: "#F1FFE5",
            fillColor: "#F1FFE5",
            opacity: 0.1,
            label: {
              text: "Average",
              position: "right",
              style: {
                color: "#32CD32",
                background: "none",
                fontSize: "14px",
              },
            },
          },
          {
            y: 80,
            y2: 100,
            borderColor: "#E6FFCC",
            fillColor: "#E6FFCC",
            opacity: 0.1,
            label: {
              text: "High",
              position: "right",
              style: {
                color: "#228B22",
                background: "none",
                fontSize: "14px",
              },
            },
          },
        ],
      },
      legend: {
        position: "left",
        horizontalAlign: "center",
        labels: {
          colors: ["#000"],
        },
      }
  }

  const spiderOptions ={
    chart: {
      type: 'radar',
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
      }
    },
  
    xaxis: {
      categories: ['Overall', 'User 1', 'User 2'],
      tickAmount: 30,
    },
    fill: {
      opacity: 0.25,
      colors:["#FF4D4D", "#FFD700", "#32CD32"]
    },
    colors: ["#FF4D4D", "#FFD700", "#32CD32"],
    stroke: {
      width: 2
    },
    markers: {
      size: 4
    },
    yaxis: {
        min: 0,
        max: 100,
        tickAmount: 5,
      },
  
    annotations: {
        xaxis: [],
        yaxis: []
    },
    dataLabels: {
      position: "top",
      enabled: true,
      style: {
        fontSize: "8px",
        colors: ["#000"],
      },
    },
    legend: {
      position: "left",
     
    }
  };

//   const comboOptions = {
//     chart: {
//       type: chartType,
//     },
//     series: ch_ser,


//     xaxis: {
//       categories: categories,
//     },

//     yaxis: {
//       tickAmount: data.scale.tickAmount,
//       min: parseInt(data.scale.min),
//       max: parseInt(data.scale.max),
//       labels: {
//         // formatter: function(value) {
//         //   return value.toFixed(1);
//         // },
//       },
//     },
//     plotOptions: {
//       bar: {
//         horizontal: false,
//         dataLabels: {
//           position: dataLabelsPosition,
//           //position: datalabelPlacement,
//         },
//       },
//     },
//     stroke: {
//       width: 10,
//     },
//     dataLabels: {
//       enabled: dataLabelsPosition,
//       offsetY: -30,
//       //offsetY: -datalabelOffset,
//       style: {
//         fontSize: fontSize,
//         colors: [dataLabelColor]
//       },
//     },
//     legend: {
//       customLegendItems: outcomes,
//       markers: {
//         fillColors:clrs
//         ,

//       },
//       onItemClick: {
//         toggleDataSeries: true
//     },
//     onItemHover: {
//         highlightDataSeries: true
//     },
//       show: true,
//       showForSingleSeries: true,
//       position: legendPosition,
//       offsetY: legendOffset,




//     },
//     fill: {
//       opacity: 1,
//     },
//     annotations: {
//       position: "back",
//       yaxis: annotate,
//     },
//     colors: data.colors,
//     grid: {
//       padding: {
//         right: 200,
//         // left: 15
//       }
//     }
//   }

export const chartsOptions = {
    barOptions,
    lineOptions,
    scatterOptions,
    spiderOptions,
    columnOptions
}
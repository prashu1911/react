import React from "react";
import Chart from 'react-apexcharts';

export default function SurveyScore({ SureveyScoreData }) {
  const categories = [];
  const seriesMap = {};

  if (Array.isArray(SureveyScoreData)) {
    SureveyScoreData.forEach(item => {
      if (item.intentions && Array.isArray(item.intentions)) {
        item.intentions.forEach((intention, idx) => {
          const name = intention.intention_name || `Intention ${idx + 1}`;
          const val = parseFloat(intention.value) || 0;
          categories.push(name);
          if (!seriesMap['Satisfaction']) seriesMap['Satisfaction'] = [];
          seriesMap['Satisfaction'].push(val);
        });
      } else if ('value' in item) {
        const name = item.info_name || `Category`;
        const val = parseFloat(item.value) || 0;
        categories.push(name);
        if (!seriesMap['Comparison']) seriesMap['Comparison'] = [];
        seriesMap['Comparison'].push(val);
      } else if (item.outcomes && Array.isArray(item.outcomes)) {
        item.outcomes.forEach((outcome, idx) => {
          const name = outcome.outcome_name || `Outcome ${idx + 1}`;
          const val = parseFloat(outcome.value) || 0;
          categories.push(name);
          if (!seriesMap['Variety']) seriesMap['Variety'] = [];
          seriesMap['Variety'].push(val);
        });
      }
    });
  }

  const series = Object.entries(seriesMap).map(([key, values]) => {
    return {
      name: key,
      data: values,
      color: '#F49186',
      zIndex: 1
    };
  });

  const calculateRoundedMax = (values) => {
    if (!values || values.length === 0) return 100;

    const maxValue = Math.max(...values);
    const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));
    const roundedMax = Math.ceil(maxValue / magnitude) * magnitude;

    return Math.ceil(roundedMax * 1);
  };

  const allValues = series.reduce((acc, curr) => [...acc, ...curr.data], []);
  const maxYValue = calculateRoundedMax(allValues);

  const options = {
    chart: {
      type: 'bar',
      height: 480,
      toolbar: { show: false }, // ✅ No download/zoom buttons
      animations: {
        enabled: false
      },
      parentHeightOffset: 0,
      offsetY: 0,
      zoom: {
        enabled: false,         // ❌ Disable zoom
      },
      selection: {
        enabled: false,         // ❌ Disable selection (drag-to-select)
      },
      pan: {
        enabled: false          // ❌ Disable panning
      },
      events: {
        mounted: (chartContext, config) => {
          chartContext.updateOptions({
            chart: {
              zoom: { enabled: false },
              selection: { enabled: false }
            }
          });
        }
      }
    },    
    dataLabels: {
      enabled: true,
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ["#0F0F0F"],
        fontWeight: 400
      },
      formatter: function (val) {
        return (val?.toFixed(2) || val)
      }
    },
    fill: { opacity: 1 },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 5,
        borderRadiusApplication: 'end',
        columnWidth: '45%',
        dataLabels: {
          position: 'top',
          hideOverflowingLabels: false
        },
        // distributed: true
      },
    },
    tooltip: {
      custom({ series, seriesIndex, dataPointIndex, w }) {
        const value = Array.isArray(series) &&
          Array.isArray(series[seriesIndex]) &&
          typeof series[seriesIndex][dataPointIndex] !== 'undefined'
            ? series[seriesIndex][dataPointIndex]
            : 'N/A';
        
        // Get the full category name
        const category = w.globals.categoryLabels[dataPointIndex];
        
        return `<div class="custom-tooltip">
          <div style="font-weight: 500; margin-bottom: 5px;">${category}</div>
          <div>Value: ${value?.toFixed(2)}</div>
        </div>`;
      }
    },
    xaxis: {
      categories,
      labels: {
        rotate: -45,
        rotateAlways: true,
        trim: true,
        hideOverlappingLabels: false,
        style: {
          fontSize: '11px',
          fontFamily: 'sans-serif',
          fontWeight: 500
        },
        // formatter: function(value) {
        //   return value?.length > 12 ? value?.slice(0, 10) + '...' : value;
        // },
        offsetY: 5,
        maxHeight: 120,
        minHeight: 30
      },
      tickPlacement: 'on',
      axisBorder: { show: false },
      axisTicks: { show: false },
      position: 'bottom'
    },
    yaxis: {
      min: 0,
      max: maxYValue,
      tickAmount: 5,
      labels: {
        formatter: (value) => Math.round(value)
      }
    },
    stroke: {
      colors: ["transparent"],
      width: 5
    },
    // legend: {
    //   showForSingleSeries: true,
    //   showForZeroSeries: true,
    //   show: true,
    //   position: "bottom",
    //   formatter: function (seriesName, opts) {
    //     console.log("Series Name", seriesName)
    //     return seriesName === "Intentions" ? "Intentions" : null;
    //   },
    //   onItemClick: {
    //     toggleDataSeries: false,
    //   },
    //   onItemHover: {
    //     highlightDataSeries: false,
    //   },
    //   markers: {
    //     fillColors: ["#F49186"], // only for Aggregate
    //   },
    // },
    grid: {
      padding: {
        left: 30,
        right: 30,
        bottom: 80
      },
      // xaxis: {
      //   lines: {
      //     show: false
      //   }
      // }
    }
  };

  return (
    <div className="barChart" style={{ padding: '20px', marginBottom: '40px' }}>
      {Array.isArray(series) && series.length > 0 && series[0].data?.length > 0 ? (
        <Chart
          className="barChart_inner"
          options={options}
          series={series}
          type="bar"
          height={350}
        />
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          {/* <p>No data available</p> */}
        </div>
      )}
    </div>
  );
}

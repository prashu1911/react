import React, { useState, useEffect } from "react";
import {
  BarChart,
  LineChart,
  ScatterChart,
  Bar,
  Line,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceArea,
  ResponsiveContainer,
  Label,
  Cell,
  LabelList,
  PieChart,

  Pie,
  ComposedChart,
  RadarChart,
  
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

export default function CommonBarChartAnnotation({
  scalarConfigurationPropData = [],
  renderChart,
  colorsChart=[],
  chartType,
  legendPosition,
  counts=[],
  labelPosition,
  fontSize,
  switchAxis,
  labelColorState,
  dynamic = false, // ← add this line
  report,
  annotationOpacity,
  showNegative,
  dynamicHeight=false,
  categories,
  values,
  aggregate,
  graphFrom = "default",
  sortOrder = "random",
}) {
  // Guard clause to prevent rendering if any required prop is missing or invalid

  const [chartData, setChartData] = useState([]);
  const [annotations, setAnnotations] = useState([]);
  console.log(categories,values,"chart data x",chartType)
  const [activeIndex, setActiveIndex] = useState(null);
  // const [sortOrder, setSortOrder] = useState("random"); // or "desc"
  // 1) State to track hovered item:
const [hoveredIndex, setHoveredIndex] = useState(null);
const resolvedFontSize = dynamic ? Number(fontSize) || 12 : 12;

// 2) Combined opacity helper:
const getOpacity = i => (hoveredIndex === i ? 1 : 0.7);

// 3) Legend hover handlers (already in your code—keep them):
const onLegendEnter = (_, idx) => setActiveIndex(idx);
const onLegendLeave = () => setActiveIndex(null);
const [sortedSeriesKeys, setSortedSeriesKeys] = useState([]);

function lightenColor(hex, percent) {
  const c = hex?.replace(/^#/, "");
  const num = parseInt(c, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
  g = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
  b = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));
  return `rgb(${r},${g},${b})`;
}
// console.log(colorsChart,"ssss")
// 2) Redefine getOpacity (same name) to return a fill‐color:
const getOpacity2 = (i, baseColor) => {
  return hoveredIndex === i
    ? lightenColor(baseColor, 30)  // brighten hovered
    : baseColor;                   // leave others unchanged
};

// 4) Tooltip loop (so you see the right name/value):
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    // show only the hovered series
    const entry = payload[hoveredIndex]||{};
    console.log(payload,hoveredIndex,"payload",counts)
    return (
      entry.name!==undefined&&<div style={{ background: '#fff', padding: 8, border: '1px solid #ccc' }}>
        <div style={{ margin: 0 }}>{`${entry.name} : ${counts?.length ?counts[hoveredIndex]:entry.value} `}</div>
      </div>
    );
  }
  return null;
};


const getLongestLegendLabelLength = (chartData = []) => {
  const keys = getDataKeys(chartData);
  if (!keys.length) return 10; // Fallback for empty keys
  let maxLen = 0;
  keys.forEach((key) => {
    if (typeof key === "string") {
      maxLen = Math.max(maxLen, key.length);
    }
  });
  return maxLen || 10; // Ensure non-zero
};
const getTotalLegendLabelCount = (chartData = []) => {
  const keys = getDataKeys(chartData);
  return Array.isArray(keys) ? keys.length : 0;
};


const maxLabelLength = Math.max(...chartData.map(item => item.name?.length));
const axisHeight = Math.min(120, 20 + maxLabelLength * 3); // safe max

  const generateSequentialColors = (count) => {
    // console.log("COUNT: ", count)
    const palette = colorsChart;

    return Array.from({ length: count }, (_, i) => palette[i % palette?.length]);
  };

  const getDataKeys = (data) => {
    const keys = new Set();
    data.forEach((item) => {
      Object.keys(item).forEach((key) => {
        if (key !== "name") keys.add(key);
      });
    });
    return Array.from(keys);
  };

  function sortByValue(data, order = "asc") {
    if (!Array.isArray(data)) return [];

    if (order === "random") return data;
    const asn = [...data].sort((a, b) => {
      const valA = parseFloat(a.value);
      const valB = parseFloat(b.value);
      return order === "asc" ? valA - valB : valB - valA;
    });
    // console.log('values',asn)
    return  ans
  }
  const [visibleKeys, setVisibleKeys] = useState(() => {
    if (chartType === "spider") {
      const metrics = new Set();
      chartData.forEach(item => {
        Object.keys(item).forEach(key => {
          if (key !== "name") metrics.add(key);
        });
      });
  
      const transformed = Array.from(metrics).map(metric => {
        const row = { name: metric };
        chartData.forEach(series => {
          row[series.name] = series[metric] ?? 0;
        });
        return row;
      });
  
      return Object.keys(transformed[0] || {}).filter(k => k !== "name");
    }
    if(chartType=="pie"||chartType=="donut"){
      return categories
    }
    return getDataKeys(chartData);
  });
  // console.log(visibleKeys,"keyss")
  useEffect(() => {
    if (chartType === "stacked bar") {
      setVisibleKeys(Object.keys(values?.[0] || {})); // Use keys from values[0] (your series)
    } else if (chartType == "pie" || chartType == "donut") {
      setVisibleKeys(categories);
    } else {
      setVisibleKeys(getDataKeys(chartData));
    }
  }, [chartData, chartType, values]); // Add 'values' to dependencies for stacked bar
  
  

  const handleLegendClick = (data) => {
    console.log(data,"lege")
    const key = data.dataKey || data.value; // recharts passes value for default
    setVisibleKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };
    
  function sortEachObjectByValues(data, order = "asc", excludeKeys = ["name"]) {
    // console.log(order,"order",values,data)
    if (!Array.isArray(data)) return [];

    return data.map((obj) => {
      const preserved = {};
      const sortableEntries = [];

      for (const [key, value] of Object.entries(obj)) {
        if (excludeKeys.includes(key)) {
          preserved[key] = value;
        } else {
          const num = parseFloat(value);
          // eslint-disable-next-line no-restricted-globals
          if (!isNaN(num)) {
            sortableEntries.push([key, num]);
          } else {
            preserved[key] = value;
          }
        }
      }
      if (order === "asc") {
        sortableEntries.sort((a, b) => a[1] - b[1]);
      } else if (order === "desc") {
        sortableEntries.sort((a, b) => b[1] - a[1]);
      } else if (order === "random") {
        // eslint-disable-next-line no-plusplus
        for (let i = sortableEntries?.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [sortableEntries[i], sortableEntries[j]] = [
            sortableEntries[j],
            sortableEntries[i],
          ];
        }
      }

      const sortedObject = { ...preserved };
      for (const [key, value] of sortableEntries) {
        sortedObject[key] = +value.toFixed(2); // keep as number
      }
      // console.log(sortableEntries,"sort",sortedObject,data)

      return sortedObject;
    });
  }

  const domain = [
    Math.min(...annotations?.map(a => a.y1)),
    Math.max(...annotations?.map(a => a.y2))
  ];
  
  const yAxisTicks = annotations?.length>0?[...annotations.map(a => a.y1), 100]:[];
  // console.log(yAxisTicks,"ticksss")

  useEffect(() => {
  let formattedData = [];
  let keys = [];
  
  // Handle Grouped Charts
  if (
    chartType === "grouppedbar" ||
    chartType === "grouppedline" ||
    chartType === "grouppedscatter" ||
    chartType === "grouppedcombo" ||
    chartType === "column" ||
    chartType === "spider"
  ) {
    // Build data objects for each category row
    formattedData = categories?.map((category, index) => ({
      name: category,
      ...values[index], // values[index] = { series1: val, series2: val, ... }
    }));

    // Save chartData as usual (sorted objects INSIDE each row)
    setChartData(
      sortOrder === "random"
        ? formattedData
        : sortEachObjectByValues(formattedData, sortOrder)
    );
        // console.log(sortEachObjectByValues(formattedData, sortOrder),"byoj",graphFrom,formattedData,categories)

    // ---- Calculate sorted keys for correct Bar/Line/Scatter rendering order ----
    if (formattedData?.length > 0) {
      // All keys except 'name'
      keys = Object.keys(formattedData[0]).filter((k) => k !== "name");

      // For asc/desc, sort keys by average (or sum) of each series across all categories
      if (sortOrder === "asc" || sortOrder === "desc") {
        keys = keys
          .map((key) => {
            // Compute average for each series key
            const avg =
              formattedData.reduce((sum, row) => sum + Number(row[key] || 0), 0) /
              formattedData?.length;
            return [key, avg];
          })
          .sort((a, b) => (sortOrder === "asc" ? a[1] - b[1] : b[1] - a[1]))
          .map(([key]) => key);
      }
      // For random, keep keys as is
      if(formattedData?.length>1){
        // const sorted = [...formattedData].sort((a, b) =>
        //   sortOrder === "asc"
        //     ? a.Aggregate_0 - b.Aggregate_0
        //     : b.Aggregate_0 - a.Aggregate_0
        // );
        // // setSortedSeriesKeys(sorted);
        // console.log(sorted,"hori",keys)
        setSortedSeriesKeys(keys);


      }
      else{
        setSortedSeriesKeys(keys);

      }
      console.log(sortedSeriesKeys,graphFrom,formattedData,switchAxis)
    }
  } 
  // Handle "rating" graphFrom (single bar/line)
  else if (graphFrom === "rating") {
    const colors = generateSequentialColors(categories?.length);

    formattedData = categories.map((category, index) => {
      const numericValue = parseFloat(values[index]);
      return {
        name: category?.id,
        subject: category?.id,
        value: numericValue,
        x: index + 1,
        y: numericValue,
        fill: colors[index],
        ratingName: category?.name,
      };
    });

    setChartData(sortByValue(formattedData, sortOrder));
    setSortedSeriesKeys([]); // Not needed for single series
  } 
  // All other charts (single bar/line/scatter/pie etc.)
  else {
    const colors = generateSequentialColors(categories?.length);

    formattedData = categories.map((category, index) => {
      const numericValue = parseFloat(values[index]);
      return {
        name: category,
        subject: category,
        value: numericValue,
        x: index + 1,
        y: numericValue,
        fill: colors[index],
      };
    });

    setChartData(sortByValue(formattedData, sortOrder));
    setSortedSeriesKeys([]); // Not needed for single series
  }

  // Always update Annotations
  const formattedAnnotations = scalarConfigurationPropData.map((item) => ({
    y1: parseFloat(item.range_start),
    y2: parseFloat(item.range_end),
    color: item.color_code,
    name: item.scalar_name,
  }));
  // console.log(formattedAnnotations)

  setAnnotations(formattedAnnotations);
}, [
  scalarConfigurationPropData?.length,
  renderChart,
  showNegative,
  values?.length,
  categories?.length,
  chartType,
  sortOrder,
]);


  // const CustomTooltip = ({ active, payload }) => {
  //   if (active && payload && payload.length) {
  //     return (
  //       <div
  //         style={{
  //           backgroundColor: "#fff",
  //           padding: "0px",
  //           border: "1px solid #ccc",
  //           borderRadius: "5px",
  //         }}
  //       >
  //         {graphFrom === "rating" &&
  //         chartType !== "grouppedbar" &&
  //         chartType !== "grouppedline" &&
  //         chartType !== "grouppedscatter" &&
  //         chartType !== "grouppedcombo" ? (
  //           <p
  //             style={{ margin: 0 }}
  //           >{`${payload[0].payload?.ratingName} : ${payload[0].payload?.value}`}</p>
  //         ) : (
  //           <p
  //             style={{ margin: 0 }}
  //           >{`${payload[0].name} : ${payload[0].value}`}</p>
  //         )}
  //       </div>
  //     );
  //   }
  //   return null;
  // };

  // Function to get proper reference area props based on axis orientation
  const getReferenceAreaProps = (item, index, type) => {
    if(type === "bar"){
      return {
        key: `annotation-${index}`,
        x1: item.y1,
        x2: item.y2,
        fill: item.color,
        fillOpacity: annotationOpacity,
        stroke: item.color,
        strokeOpacity: annotationOpacity,
        children: (
          <Label
            value={item.name}
            position="top" // Changed from "bottom" to "top"
            offset={10}
            fill={'black'}
            fontSize={resolvedFontSize}
            width={100}
          />
        ),
      }
    } else {
      return {
        key: `annotation-${index}`,
        y1: item.y1,
        y2: item.y2,
        fill: item.color,
        fillOpacity: annotationOpacity,
        stroke: item.color,
        strokeOpacity: annotationOpacity,
        children: (
          <Label
            value={item.name}
            position="right"
            width={100}
            offset={10}
            fill={'black'}
            fontSize={resolvedFontSize}
          />
        ),
      };
    }
  };

  // Handle legend hover for pie/donut charts
  const handleLegendMouseEnter = (_, index) => {
    setActiveIndex(index);
  };

  const handleLegendMouseLeave = () => {
    setActiveIndex(null);
  };

  // const getOpacity = (index) => {
  //   if (activeIndex === null) return 1;
  //   return activeIndex === index ? 1 : 0.3;
  // };
  const renderCustomLegend = (props) => {
    const { payload, layout, align, wrapperStyle } = props;
  
    let flexDirection = layout === "vertical" ? "column" : "row";
    let justifyContent = align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center";
  
    // Apply max height restriction only if position is left or right
    const conditionalWrapStyle =
      align === "left" || align === "right"
        ? {
            maxHeight: 450,
            overflowY: "auto",
            flexWrap: "wrap",
          }
        : {
            flexWrap: "wrap",
          };
  
    return (
      <ul
        style={{
          display: "flex",
          flexDirection,
          justifyContent,
          alignItems: layout === "vertical" ? "flex-start" : "center",
          margin: 0,
          padding: 0,
          marginRight:align=="left"?55:0,
          listStyle: "none",
          ...conditionalWrapStyle,
          ...wrapperStyle,
        }}
      >
        {payload.map((entry) => {
          const isVisible =(entry?.value=='Survey Aggregate')?(visibleKeys.includes('Aggregate')||visibleKeys.includes('Survey Aggregate')):visibleKeys.includes(entry.value)
          // console.log(entry,visibleKeys)
          const disable = entry?.payload?.realValue==0?true:false
          return (
            <li
              key={`legend-item-${entry.value}`}
              onClick={() => {if(!disable) handleLegendClick(entry);}}
              style={{
                marginBottom: layout === "vertical" ? 6 : 4,
                marginRight: layout === "vertical" ? 0 : 6,
                cursor: "pointer",
                opacity: (!disable&&isVisible) ? 1 : 0.6,
                userSelect: "none",
                transition: "opacity 0.2s",
                display: "flex",
                alignItems: "center",
                textTransform: "capitalize"
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 12,
                  height: 12,
                  background: entry.color,
                  marginRight: 4,
                  borderRadius: 2,
                  border: isVisible ? "2px solid #444" : "2px solid #ccc",
                  flexShrink: 0,
                }}
              ></span>
              {entry.value}
            </li>
          );
        })}
      </ul>
    );
  };
  
  
  
  // Helper to render the appropriate legend based on position
  const renderLegend = () => {
    if (legendPosition === "hidden" || legendPosition === "hide") {
      return null;
    }
  
    const legendProps = {
      layout:
        legendPosition === "left" || legendPosition === "right"
          ? "vertical"
          : "horizontal",
      verticalAlign:
        legendPosition === "bottom"
          ? "bottom"
          : legendPosition === "top"
          ? "top"
          : "middle",
      align:
        legendPosition === "top" || legendPosition === "bottom"
          ? "center"
          : legendPosition === "left"
          ? "left"
          : "right",
      wrapperStyle:
        legendPosition === "right"
          ? {
              position: "absolute",
              right:((chartType=="pie"||chartType=='donut')&&report)? "20%":0,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 1,
              backgroundColor: "#fff",
              paddingLeft: 10,
              fontSize:12,
              width:((chartType=="pie"||chartType=='donut')&&report)?220:120
            }
          : legendPosition === "left"?
          {              
            left:((chartType=="pie"||chartType=='donut')&&report)? "30%":0,
            width:((chartType=="pie"||chartType=='donut')&&report)?220:120

          }
          :
          (legendPosition === "bottom"&&(chartType!='pie'&&chartType!=='donut'))
          ? { top: `calc(95% + ${maxLines * 2}px)` ,  
          left: 0,
          right: 0,
          position: "absolute",
          textAlign: "center", 
          transform: "translateX(5%)",
          // backgroundColor:'red',// shift back by 50% of width

                      position: "absolute",
        }
          : { fontSize: 11 },
                content: renderCustomLegend,
    };
  
    return <Legend {...legendProps} />;
  };
  
  function getMaxLabelLines(labels, maxCharsPerLine) {
    return labels.reduce((maxLines, label) => {
      // 1. Split on any explicit newline characters
      const explicitLines = label.split('\n');
      // 2. For each explicit line, estimate wrapped lines by character count
      const totalLines = explicitLines.reduce((sum, line) => {
        // how many  max-width segments this line becomes
        const count = Math.ceil(line.length / maxCharsPerLine) || 1;
        return sum + count;
      }, 0);
      return Math.max(maxLines, totalLines);
    }, 0);
  }
  
  // Usage example in your component:
  const labels = chartData.map(d => d.name);
  const charsPerLine = 8;  // tune this to your chart’s width and tick style
  const maxLines = getMaxLabelLines(labels, charsPerLine);
  console.log("Max label lines:", maxLines);
  // useEffect(() => {
  //   if(aggregate){
  //     console.log("Aggregate CHART DATA: ", chartData)
  //   }
  // },[chartData])
  // useEffect(() => {
  //     console.log("All CHART DATA: ", chartData)
  // },[chartData])

  // useEffect(() => {
  //   console.log("chartType: ", chartType)
  // },[chartType])

  // useEffect(() => {
  //   console.log("ANNOTATIONS: ", annotations)
  // },[annotations])
  const longestAnnotationNameLength = annotations.reduce((maxLen, item) => {
    const name = item.name || "";
    return Math.max(maxLen, name.length);
  }, 0);
  return (
    <div className="responseBox_chart_inner">
<div
  className="chart-container"
  style={

   {height:((chartType=="pie"||chartType=='donut')&&report)?300+getLongestLegendLabelLength(chartData)+getTotalLegendLabelCount(chartData)*2: (chartType=="pie"||chartType=='donut')?300+getLongestLegendLabelLength(chartData)+getTotalLegendLabelCount(chartData)*2:chartType=="spider"?Math.max(550, 150 + visibleKeys.length * 80): 580+getLongestLegendLabelLength(chartData)+getTotalLegendLabelCount(chartData)*20+maxLines*5,
    // backgroundColor:'red'
  }
  }
>
      {/* {"hie"+getLongestLegendLabelLength(chartData)} */}
      {/* {JSON.stringify(maxLines)} */}
     <ResponsiveContainer width="100%" 
     
 height={
  (chartType=="pie"||chartType=='donut')?300+getLongestLegendLabelLength(chartData)+getTotalLegendLabelCount(chartData)*2:
  chartType === "grouppedbar"

    ? (dynamicHeight? Math.max(500, 20 * chartData.length * visibleKeys.length):550)
    : chartType=="spider"?Math.max(500, 150 + visibleKeys.length * 80): 530+getLongestLegendLabelLength(chartData)+getTotalLegendLabelCount(chartData)*10
}     >
        {chartType === "bar" && (
          <BarChart
            data={chartData}
                        margin={{ top: 30, right:legendPosition=="right"?longestAnnotationNameLength*7: legendPosition=="bottom"?longestAnnotationNameLength*8:longestAnnotationNameLength*9, left: 20, bottom: 30 }}

            layout={switchAxis ? "vertical" : "horizontal"}
          >
            {annotations.map((item, index) => (
              <ReferenceArea {...getReferenceAreaProps(item, index)} />
            ))}

            {switchAxis ? (
              <>
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 14 }}
                  domain={showNegative ? [-100, 100] : [0, 100]}
                />
                <XAxis
                  dataKey="value"
                  type="number"
                  domain={showNegative ? [-100, 100] : [0, 100]}
                  tick={{ fontSize: 12 }}
                />
              </>
            ) : (
              <>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 14 }}
                  domain={showNegative ? [-100, 100] : [0, 100]}
                />
                <YAxis
                  dataKey="value"
                  domain={showNegative ? [-100, 100] : [0, 100]}
                  tick={{ fontSize: 12 }}
                />
              </>
            )}

            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
            {renderLegend()}
            <Bar
              dataKey="value"
              // hide={!visibleKeys.includes(key) }

              name="Survey Aggregate"
              label={
                labelPosition !== "none"
                  ? {
                      position:
                        labelPosition === "bottom"
                          ? "insideBottom"
                          : labelPosition, // Adjust position for bottom
                      offset: labelPosition === "bottom" ? 10 : 0, // Add offset for bottom to avoid overlap
                      fontSize: Number(fontSize),
                      fill: labelColorState,
                    }
                  : false
              }
              isAnimationActive={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        )}

        {/* COLUMN CHART */}
        {chartType === "column" && sortOrder === "random" && (
          <BarChart
            data={chartData}
            layout={switchAxis ? "vertical" : "horizontal"}
            margin={{
              top: 30,
              right:120,
              left: 20,
              bottom: 30,
            }}
          >
            {/* annotations */}
            {annotations.map((item, index) => (
              <ReferenceArea key={index} {...getReferenceAreaProps(item, index)} />
            ))}
                

            {/* axes */}
            {switchAxis ? (
              <>
                <YAxis
                  dataKey="name"
                  type="category"
                   tick={{ fontSize: resolvedFontSize, width:'4vh',fill:'black'}}
  ticks={yAxisTicks}

                  height={axisHeight}
                  interval={0}

                />
                <XAxis
                  type="number"
                  tick={{ fontSize: resolvedFontSize, width:'4vh',fill:'black'}}
  ticks={yAxisTicks}

                  domain={showNegative ? [-100, 100] : [0, 100]}
                />
              </>
            ) : (
              <>
                <XAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: resolvedFontSize, width:'4vh',fill:'black'}}
  // ticks={yAxisTicks}

                  height={axisHeight}
                  interval={0}

                />
                <YAxis
                  type="number"
                  tick={{ fontSize: resolvedFontSize, width:'4vh',fill:'black'}}
  ticks={yAxisTicks}

                  domain={showNegative ? [-100, 100] : [0, 100]}
                />
              </>
            )}

            <Tooltip cursor={false} content={<CustomTooltip />} />
            {renderLegend()}

            {getDataKeys(chartData).map((key, seriesIndex) => (
              <Bar
                key={key}
                dataKey={key}
                hide={!visibleKeys.includes(key) }

                fill={getOpacity2(
                  seriesIndex,
                  colorsChart[seriesIndex % colorsChart.length]
                )}
                        label={
                  labelPosition !== "none"
                    ? {
                        position:
                          labelPosition === "bottom"
                            ? "insideBottom"
                            : labelPosition,
                        offset: labelPosition === "bottom" ? 10 : 0,
                        fontSize: Number(fontSize),
                        fill: labelColorState,
                      }
                    : false
                }
                isAnimationActive={false}
                onMouseEnter={() => setHoveredIndex(seriesIndex)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {chartData.map((_, categoryIndex) => (
                  <Cell
                    key={`cell-${seriesIndex}-${categoryIndex}`}
                    fill={getOpacity2(
                      seriesIndex,
                      colorsChart[seriesIndex % colorsChart.length]
                    )}           />
                ))}
              </Bar>
            ))}
          </BarChart>
        )}


{chartType === "singleline" && (
  <LineChart data={chartData} layout={switchAxis ? "vertical" : "horizontal"}>
    {annotations.map((item, index) => (
      <ReferenceArea key={index} {...getReferenceAreaProps(item, index)} />
    ))}
    {switchAxis ? (
      <>
        <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} />
        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
      </>
    ) : (
      <>
        <XAxis dataKey="name" type="category" tick={{ fontSize: 12 }} />
        <YAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
      </>
    )}
    <Tooltip content={<CustomTooltip />} />
    {renderLegend()}
    <Line
      type="monotone"
      dataKey="value"
      stroke={colorsChart[0]}
      hide={!visibleKeys.includes('value')}
      strokeWidth={2}
      dot={{ r: 4 }}
      isAnimationActive={false}
      label={
        labelPosition !== "none"
          ? {
              position: labelPosition,
              fontSize: Number(fontSize),
              fill: labelColorState,
            }
          : false
      }
    />
  </LineChart>
)}
{chartType === "singlescatter" && (
  <LineChart data={chartData} layout={switchAxis ? "vertical" : "horizontal"}>
  {annotations.map((item, index) => (
    <ReferenceArea key={index} {...getReferenceAreaProps(item, index)} />
  ))}
  {switchAxis ? (
    <>
      <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} />
      <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
    </>
  ) : (
    <>
      <XAxis dataKey="name" type="category" tick={{ fontSize: 12 }} />
      <YAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
    </>
  )}
  <Tooltip content={<CustomTooltip />} />
  {renderLegend()}
  <Line
    type="monotone"
    dataKey="value"
    stroke={colorsChart[0]}
    strokeWidth={0}
    dot={{ r: 6 }}
    isAnimationActive={false}
    label={
      labelPosition !== "none"
        ? {
            position: labelPosition,
            fontSize: Number(fontSize),
            fill: labelColorState,
          }
        : false
    }
  />
</LineChart>
)}

{chartType === "singlespider" && (
  <RadarChart outerRadius={150} width={730} height={500} data={chartData}>
    <PolarGrid />
    <PolarAngleAxis dataKey="name" tick={{ fontSize: 12, fill: 'black' }} />
    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 12, fill: labelColorState }} />
    <Radar
      name="Survey Aggregate"
      dataKey="value"
      stroke={colorsChart[0]}
      fill={colorsChart[0]}
      fillOpacity={0.6}
      isAnimationActive={false}
    />
    <Tooltip content={<CustomTooltip />} />
    {renderLegend()}
  </RadarChart>
)}


        {chartType === "column" &&
          (sortOrder === "asc" || sortOrder === "desc") && (
            <BarChart
              data={
                (() => {
                  // pick the series key you want to sort by
                  const sortKey = sortedSeriesKeys[0];
                  // make a shallow copy and sort it
                  return [...chartData].sort((a, b) => {
                    const aVal = a[sortKey] ?? 0;
                    const bVal = b[sortKey] ?? 0;
                    return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
                  });
                })()
              }
              margin={{
                top: 30,
                right:120,
                left: 20,
                bottom: 30,
              }}
              layout={switchAxis ? "vertical" : "horizontal"}
            >
              {annotations?.map((item, index) => (
                <ReferenceArea key={index} {...getReferenceAreaProps(item, index)} />
              ))}

              {switchAxis ? (
                <>
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fontSize: resolvedFontSize, width:'4vh',fill:'black'}}
  ticks={yAxisTicks}

                  />
                  <XAxis
                    type="number"
                    tick={{ fontSize: resolvedFontSize, width:'4vh',fill:'black'}}
  ticks={yAxisTicks}

                    domain={showNegative ? [-100, 100] : [0, 100]}
                  />
                </>
              ) : (
                <>
                  <XAxis
                    dataKey="name"
                    type="category"
                    tick={{ fontSize: resolvedFontSize, width:'4vh',fill:'black'}}
  ticks={yAxisTicks}

                    height={axisHeight}
                    interval={0}
  
                  />
                  <YAxis
                    type="number"
                    tick={{ fontSize: resolvedFontSize, width:'4vh',fill:'black'}}
  ticks={yAxisTicks}

                    domain={showNegative ? [-100, 100] : [0, 100]}
                  />
                </>
              )}

              <Tooltip cursor={false} content={<CustomTooltip />} />
              {renderLegend()}

              {sortedSeriesKeys.map((key, seriesIndex) => (
                <Bar
                  key={key}
                  hide={!visibleKeys.includes(key) }

                  dataKey={key}
                  onMouseEnter={() => setHoveredIndex(seriesIndex)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  fill={getOpacity2(
                    seriesIndex,
                    colorsChart[seriesIndex % colorsChart.length]
                  )}
                  label={
                    labelPosition !== "none"
                      ? {
                          position:
                            labelPosition === "bottom"
                              ? "insideBottom"
                              : labelPosition,
                          offset: labelPosition === "bottom" ? 10 : 0,
                          fontSize: Number(fontSize),
                          fill: labelColorState,
                        }
                      : false
                  }
                  isAnimationActive={false}
                >
                  {chartData.map((_, categoryIndex) => (
                    <Cell
                      key={`cell-${seriesIndex}-${categoryIndex}`}
                      fill={getOpacity2(
                        seriesIndex,
                        colorsChart[seriesIndex % colorsChart.length]
                      )}
                    />
                  ))}
                </Bar>
              ))}
            </BarChart>
        )}

{chartType === "grouppedbar" && sortOrder === "random" && (
  <BarChart
    data={chartData}
    layout={"vertical"}
    margin={{
      bottom: 30,
      right:30,
      left: 50,
      top: legendPosition === "right"
      ? longestAnnotationNameLength * 2
      : legendPosition === "bottom"
      ? longestAnnotationNameLength * 2
      : longestAnnotationNameLength * 2,
    }}
  >
    {/* annotations */}
    {annotations.map((item, index) => (
      <ReferenceArea key={index} {...getReferenceAreaProps(item, index, "bar")} />
    ))}
    {/* <ReferenceArea x1={50} x2={70} stroke="red" strokeOpacity={1} zIndex={1000000} ifOverflow="extendDomain"/> */}

    {/* axes */}
    {switchAxis ? (
      <>
        <YAxis
        type="number"
        tick={{ fontSize: resolvedFontSize, width:'4vh',fill:'black'}}
  // ticks={yAxisTicks}

        domain={showNegative ? [-100, 100] : [0, 100]}
        />
        <XAxis
        dataKey="name"
        type="category"
        tick={{ fontSize: resolvedFontSize, width:'4vh',fill:'black'}}
  // ticks={yAxisTicks}

        domain={showNegative ? [-100, 100] : [0, 100]}
        />
      </>
    ) : (
      <>
        <XAxis
        type="number"
        tick={{ fontSize: resolvedFontSize, width:'2vh',fill:'black'}}
        domain={showNegative ? [-100, 100] : [0, 100]}
        ticks={yAxisTicks}

        />
        <YAxis
        dataKey="name"
        type="category"
tick={{ fontSize: resolvedFontSize, width:'2vh',fill:"black"}}
        domain={showNegative ? [-100, 100] : [0, 100]}
        // ticks={yAxisTicks}

        />
      </>
    )}

    <Tooltip cursor={false} content={<CustomTooltip />} />
    {renderLegend()}

    {getDataKeys(chartData).map((key, seriesIndex) =>
    //  visibleKeys.includes(key) &&
     (
      <Bar
        key={key}
        dataKey={key}
        hide={!visibleKeys.includes(key) }
        fill={getOpacity2(
          seriesIndex,
          colorsChart[seriesIndex % colorsChart.length]
        )}
                label={
          labelPosition !== "none"
            ? {
                position:
                  labelPosition === "bottom"
                    ? "insideLeft"
                    : labelPosition=="top"?"right":labelPosition,
                offset: labelPosition === "bottom" ? 10 : 0,
                fontSize: Number(fontSize),
                fill: labelColorState,
              }
            : false
        }
        isAnimationActive={false}
        onMouseEnter={() => setHoveredIndex(seriesIndex)}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {chartData.map((_, categoryIndex) => (
          <Cell
            key={`cell-${seriesIndex}-${categoryIndex}`}
            fill={getOpacity2(
              seriesIndex,
              colorsChart[seriesIndex % colorsChart.length]
            )}           />
        ))}
      </Bar>
    ))}
  </BarChart>
)}

{chartType === "grouppedbar" &&
          (sortOrder === "asc" || sortOrder === "desc") && (
            <BarChart
              data={
                (() => {
                  // pick the series key you want to sort by
                  const sortKey = sortedSeriesKeys[0];
                  // make a shallow copy and sort it
                  return [...chartData].sort((a, b) => {
                    const aVal = a[sortKey] ?? 0;
                    const bVal = b[sortKey] ?? 0;
                    return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
                  });
                })()
              }
              margin={{
                bottom: 30,
                right:30,
                left: 50,
                top: legendPosition === "right"
                ? longestAnnotationNameLength * 2
                : legendPosition === "bottom"
                ? longestAnnotationNameLength * 2
                : longestAnnotationNameLength * 2,
              }}
              layout={!switchAxis ? "vertical" : "horizontal"}
            >
              {annotations?.map((item, index) => (
                <ReferenceArea key={index} {...getReferenceAreaProps(item, index,"bar")} />
              ))}

              {!switchAxis ? (
                <>
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fontSize: resolvedFontSize, width:'4vh',fill:'black'}}
  ticks={yAxisTicks}

                  />
                  <XAxis
                    type="number"
                    tick={{ fontSize: resolvedFontSize, width:'4vh',fill:'black'}}
  ticks={yAxisTicks}

                    domain={showNegative ? [-100, 100] : [0, 100]}
                  />
                </>
              ) : (
                <>
                  <XAxis
                    dataKey="name"
                    type="category"
                    tick={{ fontSize: resolvedFontSize, width:'4vh',fill:'black'}}
  ticks={yAxisTicks}

                  />
                  <YAxis
                    type="number"
                    tick={{ fontSize: resolvedFontSize, width:'4vh',fill:'black'}}
  ticks={yAxisTicks}

                    domain={showNegative ? [-100, 100] : [0, 100]}
                  />
                </>
              )}

              <Tooltip cursor={false} content={<CustomTooltip />} />
              {renderLegend()}

              {sortedSeriesKeys.map((key, seriesIndex) => (
                <Bar
                  key={key}
                  hide={!visibleKeys.includes(key) }

                  dataKey={key}
                  onMouseEnter={() => setHoveredIndex(seriesIndex)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  fill={getOpacity2(
                    seriesIndex,
                    colorsChart[seriesIndex % colorsChart.length]
                  )}
                  label={
                    labelPosition !== "none"
                      ? {
                        position:
                  labelPosition === "bottom"
                    ? "insideLeft"
                    : labelPosition=="top"?"right":labelPosition,
                          offset: labelPosition === "bottom" ? 10 : 0,
                          fontSize: Number(fontSize),
                          fill: labelColorState,
                        }
                      : false
                  }
                  isAnimationActive={false}
                >
                  {chartData.map((_, categoryIndex) => (
                    <Cell
                      key={`cell-${seriesIndex}-${categoryIndex}`}
                      fill={getOpacity2(
                        seriesIndex,
                        colorsChart[seriesIndex % colorsChart.length]
                      )}
                    />
                  ))}
                </Bar>
              ))}
            </BarChart>
        )}
{chartType === "spider" && (() => {
  let radarData = chartData;
  let seriesNames = [];

  // Case 1: [{ name: "374", "Survey Aggregate": 57.5 }, ...]
  // → series keys are in each object (like "Survey Aggregate")
  if (Array.isArray(chartData) && typeof chartData[0]?.name === "string" && isNaN(Number(chartData[0]?.SurveyAggregate))) {
    seriesNames = Object.keys(chartData[0]).filter(k => k !== "name");
  }

  // Case 2: [{ name: "Survey Aggregate", "374": 57.5, "375": 40, ... }]
  // → metric keys are inside each object, `name` is series name
  else if (Array.isArray(chartData) && typeof chartData[0]?.name === "string" && !isNaN(Number(Object.keys(chartData[0])[1]))) {
    // Convert it to the same structure as Case 1 (without mapping values, just flip keys)
    const firstRow = chartData[0];
    const keys = Object.keys(firstRow).filter(k => k !== "name");

    radarData = keys.map((metric) => ({
      name: metric,
      [firstRow.name]: firstRow[metric],
    }));

    seriesNames = [firstRow.name];
  }
  const uniqueRadarData = radarData.filter(
    (item, index, self) =>
      index === self.findIndex((t) => t.name === item.name)
  );
  
  return (
   <>
   {/* {JSON.stringify(uniqueRadarData)} */}
   <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
   <RadarChart
      outerRadius={150}
      width={730}
      height={Math.max(500, 150 + seriesNames.length * 80)} // ⬅️ dynamic height
      data={uniqueRadarData}
    >
      <PolarGrid />
      <PolarAngleAxis dataKey="name" tick={{ fontSize: 12,fill:'black' }} />
      <PolarRadiusAxis
        angle={90}
        domain={[0, 100]}
        tick={{ fontSize: 12, fill: labelColorState }}
        ticks={yAxisTicks}

      />

      {seriesNames.map((seriesName, seriesIndex) => (
        <Radar
          key={`series-${seriesIndex}`}
          name={seriesName === "Aggregate" ? "Survey Aggregate" : seriesName}
          dataKey={seriesName}
          stroke={colorsChart[seriesIndex % colorsChart.length]}
          fill={colorsChart[seriesIndex % colorsChart.length]}
          fillOpacity={0.6}
          activeDot={{onMouseOver:()=>setHoveredIndex(seriesIndex)}}
          isFront={true}
          hide={!visibleKeys.includes(seriesName)}
          isAnimationActive={false}
          onMouseEnter={()=>setHoveredIndex(seriesIndex)}
          onMouseLeave={()=>setHoveredIndex(null)}
          dot={({ cx, cy }) => (
            <circle
              cx={cx}
              cy={cy}
              r={4}
              stroke="#fff"
              strokeWidth={1}
              fill={colorsChart[seriesIndex % colorsChart.length]}
              style={{ pointerEvents: "auto", cursor: "pointer" }}
              onMouseEnter={() => setHoveredIndex(seriesIndex)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          )}
        />
      ))}

      <Tooltip content={<CustomTooltip />} />
      {renderLegend()}
    </RadarChart>
   </div>
  
    </>
  );
})()}



{/* {JSON.stringify(visibleKeys)} */}
        {chartType === "grouppedline" && (
          <LineChart
            data={chartData}
                        margin={{ top: 30, right:legendPosition=="right"?longestAnnotationNameLength*7: legendPosition=="bottom"?longestAnnotationNameLength*8:longestAnnotationNameLength*9, left: 20, bottom: 30 }}

            layout={switchAxis ? "vertical" : "horizontal"}
          >
            {/* Annotations */}
            {annotations.map((item, index) => (
              <ReferenceArea
                key={index}
                {...getReferenceAreaProps(item, index)}
              />
            ))}

            {/* Axis Handling */}
            {switchAxis ? (
              <>
                <YAxis
                  dataKey="name"
                  type="category"
                   tick={{ fontSize: resolvedFontSize, width:'4vh',fill:'black'}}

                  height={axisHeight}
                  interval={0}

                />
                <XAxis
                  type="number"
                  tick={{ fontSize: resolvedFontSize, width:'4vh',fill:'black'}}
  ticks={yAxisTicks}

                  domain={showNegative ? [-100, 100] : [0, 100]}
                />
              </>
            ) : (
              <>
                <XAxis
                  dataKey="name"
                  type="category"
                   tick={{ fontSize: resolvedFontSize, width:'4vh',fill:'black'}}

                  height={axisHeight}
                  interval={0}

                />
                <YAxis
                  type="number"
                  tick={{ fontSize: resolvedFontSize, width:'4vh',fill:'black'}}
  ticks={yAxisTicks}

                  domain={showNegative ? [-100, 100] : [0, 100]}
                />
              </>
            )}

            {/* Tooltip & Legend */}
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
            {renderLegend()}

            {/* Multiple Lines for grouped line chart */}
            {getDataKeys(chartData).map((key, index) => (
              <Line
                key={key}
                type="monotone"
                activeDot={{onMouseOver:()=>setHoveredIndex(index)}}
                hide={!visibleKeys.includes(key) }
                // onMouseLeave={}
                dataKey={key}
                stroke={colorsChart[index % colorsChart.length]}
                strokeWidth={2}
                dot={{
                  r: 4,
                  stroke: colorsChart[index % colorsChart.length],
                  fill: colorsChart[index % colorsChart.length],
                }}    
                                isAnimationActive={false}
                label={
                  labelPosition !== "none"
                    ? {
                        position:
                          labelPosition === "bottom"
                            ? "insideBottom"
                            : labelPosition, // Adjust position for bottom
                        offset: labelPosition === "bottom" ? 10 : 0, // Add offset for bottom to avoid overlap
                        fontSize: Number(fontSize),
                        fill: labelColorState,
                      }
                    : false
                }
              />
            ))}
          </LineChart>
        )}

{chartType === "grouppedscatter" && (
          <LineChart
            data={chartData}
                        margin={{ top: 30, right:legendPosition=="right"?longestAnnotationNameLength*7: legendPosition=="bottom"?longestAnnotationNameLength*8:longestAnnotationNameLength*9, left: 20, bottom: 30 }}

            layout={switchAxis ? "vertical" : "horizontal"}
          >
            {/* Annotations */}
            {annotations.map((item, index) => (
              <ReferenceArea
                key={index}
                {...getReferenceAreaProps(item, index)}
              />
            ))}

            {/* Axis Handling */}
            {switchAxis ? (
              <>
                <YAxis
                  dataKey="name"
                  type="category"
                   tick={{ fontSize: resolvedFontSize, width:'4vh',fill:'black'}}

                  height={axisHeight}
                  interval={0}

                />
                <XAxis
                  type="number"
                  tick={{ fontSize: resolvedFontSize, width:'4vh',fill:'black'}}
  ticks={yAxisTicks}

                  domain={showNegative ? [-100, 100] : [0, 100]}
                />
              </>
            ) : (
              <>
                <XAxis
                  dataKey="name"
                  type="category"
                   tick={{ fontSize: resolvedFontSize, width:'4vh',fill:'black'}}
  // ticks={yAxisTicks}

                  height={axisHeight}
                  interval={0}

                />
                <YAxis
                  type="number"
                  tick={{ fontSize: resolvedFontSize, width:'4vh',fill:'black'}}
  ticks={yAxisTicks}

                  domain={showNegative ? [-100, 100] : [0, 100]}
                />
              </>
            )}

            {/* Tooltip & Legend */}
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
            {renderLegend()}

            {/* Multiple Lines for grouped line chart */}
            {getDataKeys(chartData).map((key, index) => (
              <Line
                key={key}
                type="monotone"
                activeDot={{onMouseOver:()=>setHoveredIndex(index)}}
                hide={!visibleKeys.includes(key) }
                // onMouseLeave={}
                dataKey={key}
                stroke={colorsChart[index % colorsChart.length]}
                strokeWidth={0}
                dot={{
                  r: 4,
                  stroke: colorsChart[index % colorsChart.length],
                  fill: colorsChart[index % colorsChart.length],
                }}    
                                isAnimationActive={false}
                label={
                  labelPosition !== "none"
                    ? {
                        position:
                          labelPosition === "bottom"
                            ? "insideBottom"
                            : labelPosition, // Adjust position for bottom
                        offset: labelPosition === "bottom" ? 10 : 0, // Add offset for bottom to avoid overlap
                        fontSize: Number(fontSize),
                        fill: labelColorState,
                      }
                    : false
                }
              />
            ))}
          </LineChart>
        )}

{chartType === "stacked bar" && (() => {
  const chartRow = values?.[0] || {};
  const data = [{ name: "All", ...chartRow }];
  const categories = Object.keys(chartRow);
  // const visibleKeys = categories;
  console.log(categories,visibleKeys,"ppmmmm")
  return (
    <div style={{ position: "relative", width: "100%", height: 300 }}>
      <BarChart
        width={600}
        height={300}
        layout={switchAxis ? "vertical" : "horizontal"}
        data={data}
        margin={{ top: 30, right: 30, left: 20, bottom: 30 }}
      >
        {/* Axes */}
        {switchAxis ? (
          <>
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 14, fill: "black" }}
            />
            <XAxis
              type="number"
              tick={{ fontSize: 12, fill: "black" }}
              domain={[0, 'dataMax']}
            />
          </>
        ) : (
          <>
            <XAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 14, fill: "black" }}
            />
            <YAxis
              type="number"
              tick={{ fontSize: 12, fill: "black" }}
              domain={[0, 'dataMax']}
            />
          </>
        )}

        {/* Tooltip */}
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />

        {/* Bars */}
        {categories.map((cat, index) =>
         {
          console.log(cat,"op",visibleKeys.includes(cat),visibleKeys)
          return (

            <Bar
              key={cat}
              dataKey={cat}
              stackId="a"
              fill={colorsChart?.[index % colorsChart.length] || "#8884d8"}
              onMouseEnter={() => {setHoveredIndex(index); }}
              onMouseLeave={() => setHoveredIndex(null)}
                            isAnimationActive={false}
              hide={!visibleKeys.includes(cat)}
              label={{
                position: labelPosition=="top"?"insideTop":labelPosition=="bottom"?"insideBottom":labelPosition, // top for horizontal, right for vertical
                fontSize: 12,
                fill: "#000", // black text
              }}
            />
          )
         })}
        {renderLegend()}

      </BarChart>
    </div>
  );
})()}
{/* {JSON.stringify(visibleKeys)} */}







        {chartType === "line" && (
          <LineChart
            data={chartData}
                        margin={{ top: 30, right:legendPosition=="right"?longestAnnotationNameLength*7: legendPosition=="bottom"?longestAnnotationNameLength*8:longestAnnotationNameLength*9, left: 20, bottom: 30 }}

            layout={switchAxis ? "vertical" : "horizontal"}
          >
            {annotations.map((item, index) => (
              <ReferenceArea {...getReferenceAreaProps(item, index)} />
            ))}

            {switchAxis ? (
              <>
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 14 }}
                  domain={showNegative ? [-100, 100] : [0, 100]}
                />
                <XAxis
                  dataKey="value"
                  type="number"
                  domain={showNegative ? [-100, 100] : [0, 100]}
                  tick={{ fontSize: 12 }}
                />
              </>
            ) : (
              <>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 14 }}
                  domain={showNegative ? [-100, 100] : [0, 100]}
                />
                <YAxis
                  dataKey="value"
                  domain={showNegative ? [-100, 100] : [0, 100]}
                  tick={{ fontSize: 12 }}
                />
              </>
            )}

            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
            {renderLegend()}
            <Line
              type="monotone"
              dataKey="value"
              
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 5 }}
              isAnimationActive={false}
              label={
                labelPosition !== "none"
                  ? {
                      position:
                        labelPosition === "bottom"
                          ? "insideBottom"
                          : labelPosition, // Adjust position for bottom
                      offset: labelPosition === "bottom" ? 10 : 0, // Add offset for bottom to avoid overlap
                      fontSize: Number(fontSize),
                      fill: labelColorState,
                    }
                  : false
              }
            />
          </LineChart>
        )}

        {chartType === "scatter" && (
          <ScatterChart             margin={{ top: 30, right:legendPosition=="right"?longestAnnotationNameLength*7: legendPosition=="bottom"?longestAnnotationNameLength*8:longestAnnotationNameLength*9, left: 20, bottom: 30 }}
>
            {annotations.map((item, index) => (
              <ReferenceArea {...getReferenceAreaProps(item, index)} />
            ))}

            {switchAxis ? (
              <>
                <YAxis dataKey="name" type="category" tick={{ fontSize: 14 }} />
                <XAxis
                  dataKey="y"
                  type="number"
                  domain={showNegative ? [-100, 100] : [0, 100]}
                  tick={{ fontSize: 12 }}
                />
              </>
            ) : (
              <>
                <XAxis dataKey="name" type="category" tick={{ fontSize: 14 }} />
                <YAxis
                  dataKey="y"
                  type="number"
                  domain={showNegative ? [-100, 100] : [0, 100]}
                  tick={{ fontSize: 12 }}
                />
              </>
            )}

            <Tooltip cursor={{ fill: 'transparent' }} />
            {renderLegend()}
            <Scatter
              name="Aggregate"
              data={chartData}
              dataKey="y"
              fill="#82ca9d"
              isAnimationActive={false}
            >
              {labelPosition !== "none" && (
                <LabelList
                  dataKey={switchAxis ? "swappedX" : "y"}
                  position={labelPosition}
                  style={{ fontSize: Number(fontSize), fill: labelColorState }}
                />
              )}
            </Scatter>
          </ScatterChart>
        )}
{/* {JSON.stringify(chartData)} */}
{chartType === "pie" && (
  <PieChart>
    <Pie
      data={chartData.map(d =>
        visibleKeys.includes(d.name)
          ? d         // keep the original value
          : { ...d, value: 0 } // set value zero to hide
      )}
      
      cx="50%"
      cy="50%"
      isAnimationActive={false}
      labelLine={false}
      startAngle={90}
      endAngle={-270}
      label={({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        index,
      }) => {
        const filteredPieData = chartData.map(d =>
          visibleKeys.includes(d.name) ? d : { ...d, value: 0 }
        );
        const total = filteredPieData.reduce((sum, d) => sum + d.value, 0);
        const value = filteredPieData[index].value;
        if (!value || total === 0) return null;
      
        const percent = value / total;
        const RADIAN = Math.PI / 180;
        const radius = (innerRadius || 0) + ((outerRadius - (innerRadius || 0)) * 0.5);
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
      
        return (
          <text
            x={x}
            y={y}
            fill={labelColorState || "#0000"}
            textAnchor="middle" // ✅ FIXED
            dominantBaseline="central"
            fontSize={fontSize}
          >
            {`${(percent * 100).toFixed(0)}%`}
          </text>
        );
      }}
      
      outerRadius={120}
      fill="#8884d8"
      dataKey="value"
      nameKey="name"
    >
      {chartData.map((entry, index) => (

      <Cell
      key={`cell-${index}`}
      // hide={visibleKeys.includes(entry.name) }
      
      fill={chartData[index]?.fill}
      onMouseEnter={() => {setHoveredIndex(index); }}
      onMouseLeave={() => setHoveredIndex(null)}
      fillOpacity={
        visibleKeys.includes(entry.name) && entry.value > 0 ? getOpacity(index) : 0.2
      }
    />
      ))}
    </Pie>
    <Tooltip
  content={({ active, payload }) => {
    if (active && payload && payload.length) {
      const entry = payload[0]?.payload;
      console.log(entry)
      if (!entry) return null;
      return (
        <div style={{ background: '#fff', padding: 8, border: '1px solid #ccc' }}>
          <div>{`${entry.name} : ${ counts?.length ?counts[hoveredIndex]:entry.realValue}`}</div>
        </div>
      );
    }
    return null;
  }}
  cursor={{ fill: 'transparent' }}
/>


    {renderLegend()}
  </PieChart>
)}



        {chartType === "combo" && (
          <ComposedChart
            data={chartData}
            layout={switchAxis ? "vertical" : "horizontal"}
                        margin={{ top: 30, right:legendPosition=="right"?longestAnnotationNameLength*7: legendPosition=="bottom"?longestAnnotationNameLength*8:longestAnnotationNameLength*9, left: 20, bottom: 30 }}

            barCategoryGap={20}
            maxBarSize={75}
          >
            {annotations.map((item, index) => (
              <ReferenceArea {...getReferenceAreaProps(item, index)} />
            ))}

            {switchAxis ? (
              <>
                <YAxis dataKey="name" type="category" tick={{ fontSize: 14 }} />
                <XAxis
                  dataKey="value"
                  type="number"
                  domain={showNegative ? [-100, 100] : [0, 100]}
                  tick={{ fontSize: 12 }}
                />
              </>
            ) : (
              <>
                <XAxis dataKey="name" type="category" tick={{ fontSize: 14 }} />
                <YAxis
                  dataKey="value"
                  type="number"
                  domain={showNegative ? [-100, 100] : [0, 100]}
                  tick={{ fontSize: 12 }}
                />
              </>
            )}

            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
            {renderLegend()}

            {/* Bar layer */}
            <Bar
              dataKey="value"
              isAnimationActive={false}
              label={
                labelPosition !== "none"
                  ? {
                      position:
                        labelPosition === "bottom"
                          ? "insideBottom"
                          : labelPosition, // Adjust position for bottom
                      offset: labelPosition === "bottom" ? 10 : 0, // Add offset for bottom to avoid overlap
                      fontSize: Number(fontSize),
                      fill: labelColorState,
                    }
                  : false
              }
            >
              {chartData.map((entry, index) => (
                <Cell key={`bar-cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>

            {/* Line layer */}
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 5 }}
              isAnimationActive={false}
              label={
                labelPosition !== "none"
                  ? {
                      position:
                        labelPosition === "bottom"
                          ? "insideBottom"
                          : labelPosition, // Adjust position for bottom
                      offset: labelPosition === "bottom" ? 10 : 0, // Add offset for bottom to avoid overlap
                      fontSize: Number(fontSize),
                      fill: labelColorState,
                    }
                  : false
              }
            />
          </ComposedChart>
        )}

        {chartType === "grouppedcombo" && (
          <ComposedChart
            data={chartData}
                        margin={{ top: 30, right:legendPosition=="right"?longestAnnotationNameLength*7: legendPosition=="bottom"?longestAnnotationNameLength*8:longestAnnotationNameLength*9, left: 20, bottom: 30 }}

            layout={switchAxis ? "vertical" : "horizontal"}
          >
            {/* Annotations */}
            {annotations.map((item, index) => (
              <ReferenceArea
                key={index}
                {...getReferenceAreaProps(item, index)}
              />
            ))}

            {/* Axis Handling */}
            {switchAxis ? (
              <>
                <YAxis
                  dataKey="name"
                  type="category"
                  scale="band"
                   tick={{ fontSize: resolvedFontSize, width:'4vh'}}
                  height={axisHeight}
                  interval={0}

                />
                <XAxis
                  type="number"
                  tick={{ fontSize: resolvedFontSize, width:'4vh',fill:'black'}}
  ticks={yAxisTicks}

                  domain={showNegative ? [-100, 100] : [0, 100]}
                />
              </>
            ) : (
              <>
                <XAxis
                  dataKey="name"
                  type="category"
                  scale="band"
                   tick={{ fontSize: resolvedFontSize, width:'4vh'}}
                  height={axisHeight}
                  interval={0}

                />
                <YAxis
                  type="number"
                  tick={{ fontSize: resolvedFontSize, width:'4vh',fill:'black'}}
  ticks={yAxisTicks}

                  domain={showNegative ? [-100, 100] : [0, 100]}
                />
              </>
            )}

            {/* Tooltip & Legend */}
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
            {renderLegend()}

            {/* Bars and Lines */}
            {getDataKeys(chartData).map((key, index) => (
              <React.Fragment key={key}>
                <Bar
                  dataKey={key}
                  fill={colorsChart[index % colorsChart.length]}
                  barSize={20}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey={key}
                  stroke={colorsChart[index % colorsChart.length]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  isAnimationActive={false}
                  label={
                    labelPosition !== "none"
                      ? {
                          position:
                            labelPosition === "bottom"
                              ? "insideBottom"
                              : labelPosition, // Adjust position for bottom
                          offset: labelPosition === "bottom" ? 10 : 0, // Add offset for bottom to avoid overlap
                          fontSize: Number(fontSize),
                          fill: labelColorState,
                        }
                      : false
                  }
                />
              </React.Fragment>
            ))}
          </ComposedChart>
        )}
  {/* {JSON.stringify(chartData)} */}
        {chartType === "donut" && (
       <PieChart>
       <Pie
         data={chartData.map(d =>
           visibleKeys.includes(d.name)
             ? d // Show as usual
             : { ...d, value: 0 } // Hidden slices have value 0 (not rendered)
         )}
         cx="50%"
         cy="50%"
         isAnimationActive={false}

         innerRadius={80}     // 👈 ADD THIS LINE for donut effect
         outerRadius={120}
         labelLine={false}

         label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
          if (percent === 0) return null;
        
          const RADIAN = Math.PI / 180;
          const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
          const x = cx + radius * Math.cos(-midAngle * RADIAN);
          const y = cy + radius * Math.sin(-midAngle * RADIAN);
        
          return (
            <text

              x={x}
              y={y}
              fill={labelColorState || "#fff"}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={fontSize}
            >
              {(percent * 100).toFixed(0)}%
            </text>
          );
        }}
        

         fill="#8884d8"
         dataKey="value"
         nameKey="name"
       >
         {chartData.map((entry, index) => (
           <Cell
             key={`cell-${index}`}
             onMouseEnter={() => {setHoveredIndex(index); }}
             onMouseLeave={() => setHoveredIndex(null)}
             fill={entry.fill}
             fillOpacity={visibleKeys.includes(entry.name) ? getOpacity(index) : 0.1}
           />
         ))}
       </Pie>
       <Tooltip
  content={({ active, payload }) => {
    if (active && payload && payload.length) {
      const entry = payload[0]?.payload;
      console.log(entry)
      if (!entry) return null;
      return (
        <div style={{ background: '#fff', padding: 8, border: '1px solid #ccc' }}>
          <div>{`${entry.name} : ${ counts?.length ?counts[hoveredIndex]:entry.realValue}`}</div>
        </div>
      );
    }
    return null;
  }}
  cursor={{ fill: 'transparent' }}
/>
       {renderLegend()}
     </PieChart>
     
        )}
      </ResponsiveContainer>
     </div>
    </div>
  );
}

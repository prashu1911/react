import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Customized
} from "recharts";

export default function TargetChart({ SectionData }) {
  const targetChartDataRaw = SectionData?.attributeData?.widgetData?.targetChartData || [];
  const selectedDatasets = SectionData?.attributeData?.controlData?.selectedTargetDatasets || [];
  const palette = SectionData?.attributeData?.widgetData?.selectedPaletteColors?.length > 0 ? SectionData?.attributeData?.widgetData?.selectedPaletteColors : [
    {
      "colorID": "73",
      "colorName": "Cascara",
      "colorCode": "#ef3d31",
      "colorRed": 239,
      "colorGreen": 61,
      "colorBlue": 49
    },
    {
      "colorID": "74",
      "colorName": "Basketball",
      "colorCode": "#f46a2b",
      "colorRed": 244,
      "colorGreen": 106,
      "colorBlue": 43
    },
    {
      "colorID": "75",
      "colorName": "Flame Orange",
      "colorCode": "#f88d23",
      "colorRed": 248,
      "colorGreen": 141,
      "colorBlue": 35
    },
    {
      "colorID": "76",
      "colorName": "Tangerine Twist",
      "colorCode": "#fcad18",
      "colorRed": 252,
      "colorGreen": 173,
      "colorBlue": 24
    },
    {
      "colorID": "77",
      "colorName": "Sunflower Island",
      "colorCode": "#ffcb05",
      "colorRed": 255,
      "colorGreen": 203,
      "colorBlue": 5
    },
    {
      "colorID": "78",
      "colorName": "Young Bud",
      "colorCode": "#81b73c",
      "colorRed": 129,
      "colorGreen": 183,
      "colorBlue": 60
    },
    {
      "colorID": "79",
      "colorName": "Siren of Nature",
      "colorCode": "#6aa93a",
      "colorRed": 106,
      "colorGreen": 169,
      "colorBlue": 58
    },
    {
      "colorID": "80",
      "colorName": "Enviable",
      "colorCode": "#519a38",
      "colorRed": 81,
      "colorGreen": 154,
      "colorBlue": 56
    },
    {
      "colorID": "81",
      "colorName": "Jade of Emeralds",
      "colorCode": "#368c36",
      "colorRed": 54,
      "colorGreen": 140,
      "colorBlue": 54
    }
  ];

  const [Index, setIndex] = useState(0)

  const chartData = selectedDatasets
    .map(sel =>
      targetChartDataRaw.find(
        r =>
          String(r.id) === String(sel.id) &&
          r.type?.toLowerCase() === sel.dataPointType?.toLowerCase()
      )
    )
    .filter(Boolean);

  if (!chartData.length) return null;

  const rows = chartData.map(rec => {
    const obj = { name: rec.name, targetValue: rec.targetValue };
    (rec.objects || rec.datapoints || []).forEach(o => {
      obj[o.name] = +o.value || 0;
    });
    return obj;
  });

  const seriesKeys = [...new Set(rows.flatMap(Object.keys))].filter(
    k => k !== "name" && k !== "targetValue"
  );

  function TargetLines(props) {
    const { xAxisMap, yAxisMap, offset, data } = props;
    const xBand = xAxisMap[0].scale;
    const yLinear = yAxisMap[0].scale;
    const bandWidth = xBand.bandwidth();
    const groupWidth = 0.8;
    const lineWidth = bandWidth * groupWidth;

    return (
      <g className="target-lines">
        {data.map((row, i) => {
          if (!row.targetValue && row.targetValue !== 0) return null;
          const y = yLinear(row.targetValue);
          const xLeft = xBand(row.name) + (bandWidth - lineWidth) / 2;
          const xRight = xLeft + lineWidth;
          return (
            <line
              key={row.name}
              x1={xLeft}
              x2={xRight}
              y1={y}
              y2={y}
              stroke="#000000"
              strokeWidth={2}
            />
          );
        })}
      </g>
    );
  }
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const target = payload[0].payload?.targetValue;
      return (
        <div style={{ background: "#fff", border: "1px solid #ccc", padding: "6px", fontSize: "12px" }}>
          <strong>{label}</strong>
          <br />
          {payload.map((entry, i) => (
            <div key={i}>
              <span style={{ color: entry.color }}>●</span> {entry.name}: {entry.value?.toFixed(SectionData?.attributeData?.widgetData?.selectedDecimalPoint || 0)}
            </div>
          ))}
          {target !== undefined && <div><strong>Target: {target?.toFixed(SectionData?.attributeData?.widgetData?.selectedDecimalPoint || 0)}</strong></div>}
        </div>
      );
    }
    return null;
  };
  


  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <BarChart
          data={rows}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="name"
            interval={0}
            height={60}
            tick={({ x, y, payload }) => {
              const splitLabel = (label, maxLength = 12) => {
                const lines = [];
                for (let i = 0; i < label.length && lines.length < 2; i += maxLength) {
                  lines.push(label.slice(i, i + maxLength));
                }
                if (label.length > maxLength * 2) {
                  lines[1] = lines[1].slice(0, -3) + "..."; // add ellipsis to second line
                }
                return lines;
              };

              const lines = splitLabel(payload.value);

              return (
                <text x={x} y={y + 10} textAnchor="middle" fontSize={11} fill="#000">
                  {lines.map((line, idx) => (
                    <tspan x={x} dy={idx === 0 ? 0 : 12} key={idx}>
                      {line}
                    </tspan>
                  ))}
                </text>
              );
            }}
          />



          <YAxis domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} />


          <Legend
            formatter={(value) => (
              <span style={{ color: "#000", fontSize: "12px" }}>{value}</span>
            )}
          />


          {seriesKeys.map((key, i) => (
            <Bar
              key={key}
              dataKey={key}
              fill={palette[i % palette.length]?.colorCode || "#000"}
              onMouseLeave={() => { setIndex(null) }}
              onMouseEnter={() => { setIndex(i) }}
              isAnimationActive={false}
              label={{
                position: "top",
                content: ({ x, y, width, value, index }) => (
                  <text
                    x={x + width / 2}
                    y={y - 6}
                    fill="#000"
                    fontSize={10}
                    textAnchor="middle"
                  >
                    {value?.toFixed(SectionData?.attributeData?.widgetData?.selectedDecimalPoint || 0)}
                  </text>
                )
              }}
              
            />
          ))}

          <Tooltip cursor={false} content={<CustomTooltip />} />


          <Customized component={TargetLines} data={rows} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

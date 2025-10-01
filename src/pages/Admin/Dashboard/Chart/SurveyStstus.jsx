import React, { useState } from "react";
import { Col, Row, Dropdown } from "react-bootstrap";
import { Doughnut, PolarArea } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  CategoryScale
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  CategoryScale
);

export default function SurveyStstus({ SurveyStatus, ChartType }) {
//   const [chartType, setChartType] = useState("doughnut"); // "polarArea" | "doughnut"

  // Use dummy data if SurveyStatus is not passed?

  const status = SurveyStatus;

  const data = {
    labels: ['In Progress', 'Published', 'Closed', 'Paused', 'Design'],
    datasets: [
      {
        data: [
          Number(status?.in_progress_percentage),
          Number(status?.published_percentage),
          Number(status?.closed_percentage),
          Number(status?.paused_percentage),
          Number(status?.in_design_percentage)
        ],
        value: [
          status?.in_progress,
          status?.published,
          status?.closed,
          status?.paused,
          status?.in_design
        ],
        backgroundColor: ['#0968AC', '#FCB92C', '#F37F73', '#252549', '#FF9F51'],
      },
    ],
  };

  const options = {
    cutout: ChartType === "donut" ? 80 : undefined,
    hoverOffset: 20,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        backgroundColor: '#f5f5f5',
        bodyColor: '#000',
        displayColors: false,
        cornerRadius: 0,
        bodyFont: { size: 12,  },
        callbacks: {
          title: () => '',
          label: (tooltipItem) => {
            const { dataset, dataIndex } = tooltipItem;
            const total = dataset.data.reduce((a, b) => a + b, 0);
            const currentValue = dataset.data[dataIndex];
            const percentage = ((currentValue / total) * 100).toFixed(2);
            const label = tooltipItem.chart.data.labels[dataIndex];
            return `${label}: ${percentage}%`;
          },
        },
      },
      legend: false,
    },
  };

  const Legend = ({ datas }) => {
    return (
      <ul style={{ marginTop: '2.3rem' }} className="legend list-inline mb-0">
        {datas.labels.map((label, index) => {
          const value = datas.datasets[0].value[index];
          const percentage = datas.datasets[0].data[index];
          return (
            <li key={index}>
              <Row>
                <Col xs={6}>
                  <div className="d-flex align-items-center">
                    <span className="colorBox" style={{ backgroundColor: datas.datasets[0].backgroundColor[index] }} />
                    <span className="listText">{label}</span>
                  </div>
                </Col>
                <Col xs={3} className="text-center">
                  <span className="listText">{percentage}%</span>
                </Col>
                <Col xs={3} className="text-end">
                  <span className="listText">{value}</span>
                </Col>
              </Row>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <>

      <div style={{ height: '230px' }}>
        {ChartType === "donut" ? (
          <Doughnut data={data} options={options} />
        ) : (
          <PolarArea data={data} options={options} />
        )}
      </div>

      <Legend datas={data} />
    </>
  );
}

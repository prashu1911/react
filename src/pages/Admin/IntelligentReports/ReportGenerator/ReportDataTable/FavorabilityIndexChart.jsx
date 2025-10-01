import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Col, Row, Dropdown } from "react-bootstrap";
import { Tooltip } from "bootstrap"; // Bootstrap must be installed
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart as ChartJS, ArcElement, Tooltip as cTooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, cTooltip, Legend, ChartDataLabels);

export default function FavorabilityIndexChart({ byIntention = false, SectionData }) {
  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach((el) => new Tooltip(el));
  }, []);

  const data = {
    labels: SectionData?.attributeData?.widgetData?.favorabilityData?.favorData?.map((item) => item.favorName),
    datasets: [
      {
        data: SectionData?.attributeData?.widgetData?.favorabilityData?.favorData?.map((item) => item.favorPercentage),
        value: SectionData?.attributeData?.widgetData?.favorabilityData?.favorData?.map((item) => item.responseCount),
        backgroundColor: SectionData?.attributeData?.widgetData?.themeData.map((item) => item.color),
      },
    ],
  };

  const options = {
    cutout: "70%",
    hoverOffset: 20,
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      tooltip: {
        backgroundColor: "#f5f5f5",
        bodyColor: "#000",
        displayColors: false,
        cornerRadius: 0,
        bodyFont: { size: 12 },
        callbacks: {
          title: () => "",
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
      datalabels: {
        color: "#fff",
        font: {
          size: 10,
          weight: "bold",
        },
        formatter: function (value, context) {
          console.log("context", context);

          const count = context.chart.data.datasets[0].data[context.dataIndex];
          return count; // You can also return `${value}%` or combine both
        },
      },
    },
  };

  const Legend = ({ datas }) => {
    return (
      <ul style={{ marginTop: "2.3rem", position: "relative", listStyleType: "none" }}>
        {datas.labels.map((label, index) => {
          const value = datas.datasets[0].value[index];
          const percentage = datas.datasets[0].data[index];
          return (
            <li key={index}>
              <Row className="align-items-center">
                <Col xs={6} className="text-start">
                  <div
                    data-bs-toggle={"tooltip"}
                    data-bs-placement="top"
                    title={label}
                    className="d-flex align-items-center"
                  >
                    <span
                      className="colorBox"
                      style={{
                        backgroundColor: datas.datasets[0].backgroundColor[index],
                        borderRadius: "1rem",
                        marginRight: "0.5rem",
                        width: "0.6rem",
                        height: "0.6rem",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      className="listText"
                      style={{
                        maxWidth: "8rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        display: "inline-block",
                      }}
                    >
                      {label}
                    </span>
                  </div>
                </Col>
                <Col xs={3} className="text-start">
                  <span className="listText">{percentage}%</span>
                </Col>
              </Row>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div style={{ minWidth: "16rem", flex: "0 0 16rem", marginRight: "1rem", marginTop: "2.5rem" }}>
      <div style={{ height: "180px" }}>
        <Doughnut data={data} options={options} />
      </div>
      {SectionData?.attributeData?.widgetData?.displayPercentage &&
        <Legend datas={data} />
      }
    </div>
  );
}

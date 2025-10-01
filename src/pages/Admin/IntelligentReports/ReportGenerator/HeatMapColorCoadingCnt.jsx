import React, { useRef, useEffect } from "react";
import { Col, Form, InputGroup, Row } from "react-bootstrap";
import { InputField } from "../../../../components";
import { useDispatch } from "react-redux";
import { updateChartImage } from "../../../../redux/ChartImagesSlice/index.slice";
import html2canvas from "html2canvas";

export default function HeatMapColorCoadingCnt({ SectionData,sectionId,aggregateChart }) {
    const containerRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const captureHeatMap = async () => {
      if (containerRef.current && sectionId) {
        try {
          const canvas = await html2canvas(containerRef.current, {
            backgroundColor: null,
            scale: 2,
            logging: false,
            useCORS: true,
          });

          const base64Image = canvas.toDataURL("image/png");
          if (base64Image) {
            dispatch(updateChartImage(sectionId, base64Image, aggregateChart || "heatmap"));
          }
        } catch (error) {
          console.error("Error capturing heat map:", error);
        }
      }
    };

    // Wait for content to render
    setTimeout(captureHeatMap, 1000);
  }, [SectionData, sectionId, dispatch, aggregateChart]);

  function decodeHtml(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  const safeHtml = decodeHtml(SectionData?.instructionData || "");

  return (
    <>
      <style>
        {`
          .instruction-html table {
            border-collapse: collapse;
            width: 100%;
          }
          .instruction-html table td,
          .instruction-html table th {
            border: 1px solid #ccc;
            padding: 8px;
            text-align: left;
          }
        `}
      </style>
       <div ref={containerRef}>

    
      <div
        className="instruction-html"
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      />
         </div>
    </>
  );
}

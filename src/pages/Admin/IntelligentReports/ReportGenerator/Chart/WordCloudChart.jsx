import React, { useEffect, useRef } from "react";
import WordCloud from "react-wordcloud";

export default function WordCloudChart({ SectionData, sectionId }) {
  const chartRef = useRef(null);
  const hasCaptured = useRef(false);

  const wordCloudData = SectionData?.attributeData?.widgetData?.wordCloudData || {};

  const words = Object.entries(wordCloudData).map(([key, value]) => ({
    text: key,
    value: parseInt(value, 10),
  }));

  const options = {
    fontFamily: "Impact",
    rotations: 0,
    rotationAngles: [0, 0],
    fontSizes: [20, 60],
    deterministic: true,
    spiral: "rectangular",
    transitionDuration: 0,
    ...(SectionData?.attributeData?.widgetData?.randomColor
      ? {}
      : { colors: [SectionData?.attributeData?.widgetData?.fontColor] }),
  
    tooltipOptions: {
      // ✅ These are native Tippy.js props
      theme: 'light-border',
      placement: 'top',
      animation: 'shift-away',
      arrow: true,
    },
  
    callbacks: {
      getWordTooltip: word => `${word.text}: ${word.value}`,
    },
  };
  
  

  if (!words.length) return null;

  return (
    <div ref={chartRef} style={{ height: 400, width: "100%" }}>
      <WordCloud words={words} options={options} />
    </div>
  );
}

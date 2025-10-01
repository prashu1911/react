import React, { useState } from "react";
import { Range } from "react-range";

const ResponseSliderTwo = ({ questionResponse, questionData }) => {
  const STEP = 1;
  const MIN = 0;
  const [sliderValues, setSliderValues] = useState({});
  const handleSliderClick = () => {};

  return (
    <>
      {Array.isArray(questionResponse) && questionResponse.length > 0 && (
        <div style={{ width: "100%" }}>
          <div
            style={{
              padding: "0.5rem",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                position: "relative",
                width: `${Math.min(
                  100,
                  Math.max(100, questionResponse?.length * 15)
                )}%`,
                padding: "0 25px",
              }}
            >
              <Range
                step={STEP}
                min={0}
                max={questionResponse?.length - 1}
                values={[
                  // sliderValues[questionData?.question_id] !== undefined ||
                  sliderValues[questionData?.question_id] >= 0
                    ? sliderValues[questionData?.question_id]
                    : 0,
                ]}
                disabled={true}
                onChange={(newValues) => {
                  setSliderValues((prev) => ({
                    ...prev,
                    [questionData.question_id]: newValues[0],
                  }));
                }}
                onFinalChange={(newValues) => {
                  const index = newValues[0];
                  if (questionResponse && questionResponse[index]) {
                    handleSliderClick(
                      questionData.question_id,
                      questionResponse[index].response_id,
                      index
                    );
                  }
                }}
                renderTrack={({ props, children }) => {
                  const percentage =
                    (((sliderValues[questionData.question_id] || 0) - MIN) /
                      (questionResponse.length - 1 - MIN)) *
                    100;
                  const { key, ...trackProps } = props;

                  return (
                    <div
                      key={key}
                      {...trackProps}
                      // {...props}
                      style={{
                        // ...props.style,
                        ...trackProps.style,
                        height: "6px",
                        width: "100%",
                        backgroundColor: "#ccc",
                        borderRadius: "3px",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          height: "100%",
                          backgroundColor: "#ccc",
                          width: `${percentage}%`,
                          borderRadius: "3px",
                          zIndex: 1,
                        }}
                      />
                      {questionResponse.map((_, index) => (
                        <div
                          key={index}
                          style={{
                            position: "absolute",
                            left: `${
                              (index / (questionResponse.length - 1)) * 100
                            }%`,
                            top: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "5px",
                            height: "15px",
                            backgroundColor: "#ccc",
                            zIndex: 2,
                          }}
                        />
                      ))}
                      {children}
                    </div>
                  );
                }}
                renderThumb={({ props }) => {
                  const { key, ...thumbProps } = props;

                  return (
                    <div
                      // {...props}
                      key={key}
                      {...thumbProps}
                      style={{
                        // ...props.style,
                        ...thumbProps.style,
                        height: "22px",
                        width: "22px",
                        backgroundColor: "#fff",
                        borderRadius: "10%",
                        zIndex: 3,
                        boxShadow: "rgb(170, 170, 170) 0px 2px 6px",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          border: "6px solid",
                          borderColor:
                            sliderValues[questionData.question_id] >= 0
                              ? "#0968AC"
                              : "#ccc",
                          opacity: 1,
                        }}
                      ></div>
                    </div>
                  );
                }}
              />
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  marginTop: "1.5em",
                  gap: "8px",
                }}
              >
                {questionResponse.map((label, index) => {
                  const width = `${100 / (questionResponse.length - 1)}%`;
                const halfWidth = `${(100 / (questionResponse.length - 1)) / 2}%`
                  return (
                    <div
                      style={{
                        width:
                          index === 0
                            ? halfWidth
                            : index === questionResponse.length - 1
                            ? halfWidth
                            : width,
                        display: "flex",
                        justifyContent:
                          index === 0
                            ? "flex-start"
                            : index === questionResponse.length - 1
                            ? "flex-end"
                            : "center",
                      }}
                    >
                      <div
                        key={label.response_id}
                        style={{
                          cursor: "pointer",
                          textAlign: index === 0
                            ? "start"
                            : index === questionResponse.length - 1
                            ? "end"
                            : "center",
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                          overflowWrap: "break-word",
                          fontSize: "15px",
                          fontWeight:
                            sliderValues[questionData.question_id] === index
                              ? "600"
                              : "500",
                          color:
                            sliderValues[questionData.question_id] === index
                              ? "#0968AC"
                              : "#555",
                          // flex: 1,
                          opacity: 0.5,
                          minWidth: 0,
                          width: "100%",
                          padding: "0 4px",
                          boxSizing: "border-box",
                          // display: "flex",
                          // alignItems: "center",
                          flexWrap: "wrap",
                        }}
                        onClick={() => {
                          handleSliderClick(
                            questionData.question_id,
                            label.response_id,
                            index
                          );
                        }}
                      >
                        {label.response}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResponseSliderTwo;

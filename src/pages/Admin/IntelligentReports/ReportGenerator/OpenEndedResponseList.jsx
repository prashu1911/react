import React from "react";

export default function OpenEndedResponseList({ SectionData }) {
  return (
    <>
      {SectionData?.attributeData?.widgetData?.oeqQuestionData?.map(
        (questionItem, i) => (
          <React.Fragment key={i}>
            <h2 style={{ fontSize: "1.2rem" }} className="reportSubTitle">
              {questionItem?.question}
            </h2>
            {questionItem.responses.map((response, j) => (
              <p className="mb-3" key={j}>
                {j + 1}. {response}
              </p>
            ))}
          </React.Fragment>
        )
      )}
    </>
  );
}

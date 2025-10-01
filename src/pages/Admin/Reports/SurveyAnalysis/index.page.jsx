import React from "react";
import { Breadcrumb } from "../../../../components";
import ParticipantResponse from "./ParticipantResponse";

function SurveyAnalysis() {
  // breadcrumb
  const breadcrumb = [
    {
      path: "#!",
      name: "Reports",
    },

    {
      path: "#",
      name: "Participant Response",
    },
  ];
  return (
    <>
      <div className="surveyAnalysis">
        {/* head title start */}
        <section className="commonHead">
          <h1 className="commonHead_title">Welcome Back!</h1>
          <Breadcrumb breadcrumb={breadcrumb} />
        </section>
        {/* head title end */}
        <div className="pageContent">
          <div className="pageTitle">
            <h2 className="mb-0">Participant Response</h2>
          </div>
          <ParticipantResponse />
        </div>
      </div>
    </>
  );
}

export default SurveyAnalysis;

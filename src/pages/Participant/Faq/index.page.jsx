import { Participant } from "apiEndpoints/Participant";
import { useAuth } from "customHooks";
import React, { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { commonService } from "services/common.service";

function Faq({ initialCallParticipant }) {
  const [searchParams] = useSearchParams();
  const assessmentID = searchParams.get("assessment");
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();

  const [faqData, setFaqData] = useState([]);

  const fetchSurvey = async () => {
    let obj = {};
    obj.companyMasterID = userData.companyMasterID;
    obj.companyID = userData.companyID;

    if (assessmentID || userData?.surveyID) {
      obj.assessmentID = assessmentID || userData?.surveyID;
    }
    const response = await commonService({
      apiEndPoint: Participant.fetchFaq,
      queryParams: obj,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });
    if (response?.status) {
      setFaqData(response?.data?.faq_data || []);
    }
  };

  useEffect(() => {
    if (initialCallParticipant) {
      fetchSurvey();
    }
  }, [initialCallParticipant]);

  return (
    <div className="faq">
      <section className="position-relative">
        <div className="container" style={{ padding: "1rem" }}>
          <div>
            {/* <h1 className="mb-1">
              <span>FAQ&apos;s</span>{" "}
            </h1> */}
            <p>Answers to frequently asked questions.</p>
          </div>
        </div>
      </section>
      {Array.isArray(faqData) && faqData.length > 0 && (
        <section className="faqSec position-relative" style={{ marginTop: "0" }}>
          <div className="container" style={{ padding: "1rem" }}>
            <div className="faqSec_box bg-white" style={{ padding: "10px" }}>
              <Accordion defaultActiveKey="0">
                {faqData.map((faq, index) => (
                  <Accordion.Item key={index} eventKey={index.toString()}>
                    <Accordion.Header>{`${faq.title}`}</Accordion.Header>
                    <Accordion.Body>{faq.description}</Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default Faq;

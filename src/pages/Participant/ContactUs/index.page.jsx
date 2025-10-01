import React, { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import { commonService } from "services/common.service";
import { useAuth } from "customHooks";
import { Participant } from "apiEndpoints/Participant";
import { Button, InputField } from "../../../components";

function ContactUs() {
  const [searchParams] = useSearchParams();
  const assessmentID = searchParams.get("assessment");
  const [contactData, setContactData] = useState({
    success: false,
    contact_data: [],
  });

  const { getloginUserData } = useAuth();
  const userData = getloginUserData();

  const fetchContacts = async () => {
    try {
      let obj = {};
      obj.companyMasterID = userData.companyMasterID;
      obj.companyID = userData.companyID;

      if (assessmentID || userData?.surveyID) {
        obj.assessmentID = assessmentID || userData?.surveyID;
      }
      const response = await commonService({
        apiEndPoint: Participant.fetchContact,
        queryParams: obj,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        setContactData(response.data);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="contactUs">
      <section className="position-relative">
        <div className="container" style={{ padding: "1rem" }}>
          <div className="commonBanner_inner">
            {/* <h1 className="mb-2 mb-lg-3">
              <span>Contact Us</span>{" "}
            </h1> */}
            <p className="mb-0 mb-md-3">
              Have a question? We have answers. Whether you need <br className="d-none d-lg-block" /> technical support,
              want to learn more about
            </p>
          </div>
        </div>
      </section>
      <section className="faqSec position-relative" style={{ marginTop: "0" }}>
        <div className="container" style={{ padding: "1rem" }}>
          <div className="faqSec_box bg-white" style={{ padding: "10px" }}>
            <Accordion defaultActiveKey="0">
              {contactData.contact_data.map((contact, index) => (
                <Accordion.Item key={index} eventKey={index.toString()}>
                  <Accordion.Header>{`${(index + 1).toString().padStart(2, "0")}. ${contact.title}`}</Accordion.Header>
                  <Accordion.Body>{contact.description}</Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
      {/* {Array.isArray(contactData.contact_data) && contactData.contact_data.length > 0 && (
       
      )} */}
      <section className="contactSec">
        <div className="container" style={{ padding: "1rem" }}>
          <div className="row ">
            <div>
              <div className="contactSec_left">
                {/* {contactData &&
                  Array.isArray(contactData.contact_data) &&
                  contactData.contact_data.length > 0 &&
                  contactData.contact_data.map((contact, index) => (
                    <div key={index}>
                      <h2>{contact.title}</h2>
                      <p className="mb-0">{contact.description}</p>
                    </div>
                  ))} */}

                {/* <div className="contactSec_info d-flex align-items-center">
                  <div className="contactSec_info_left">
                    <em className="icon-mail" />
                  </div>
                  <div>
                    <span className="d-block">Contact Us</span>
                    <Link to="mailto:info@metoliusaa.com">info@metoliusaa.com</Link>
                  </div>
                </div> */}
              </div>
            </div>
            {/* <div className="col-md-6 col-lg-6">
              <div className="contactSec_form">
                <Form>
                  <Form.Group className="form-group">
                    <Form.Label>Name</Form.Label>
                    <InputField
                      id="subject"
                      className="form-control form-control-md"
                      type="text"
                      placeholder="Enter Name"
                      defaultValue="Back Bryan"
                      disabled
                    />
                  </Form.Group>
                  <Form.Group className="form-group">
                    <Form.Label>Email</Form.Label>
                    <InputField
                      id="email"
                      className="form-control form-control-md"
                      type="email"
                      placeholder="Enter Email"
                      defaultValue="backbryan@gmail.com"
                      disabled
                    />
                  </Form.Group>
                  <Form.Group className="form-group">
                    <Form.Label>Subject</Form.Label>
                    <InputField
                      id="subject"
                      className="form-control form-control-md"
                      type="text"
                      placeholder="Enter Subject"
                    />
                  </Form.Group>

                  <Form.Group className="form-group">
                    <Form.Label>Your Request</Form.Label>
                    <Form.Control
                      as="textarea"
                      className="textArea form-control form-control-md"
                      rows={3}
                      placeholder="Enter Your Request"
                    />
                  </Form.Group>
                  <div className="text-end">
                    <Button variant="primary ripple-effect btn-md d-inline-flex">
                      Submit <em className="btn-icon right icon-arrow-next" />{" "}
                    </Button>
                  </div>
                </Form>
              </div>
            </div> */}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactUs;

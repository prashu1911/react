import React from "react";
import { Button, ModalComponent } from "components";
import { sectionArray, sectionType } from "./constants";
import "./styles.css";


const TermsOfUseConditionComp = () => {
  const openModel = true
  return (
    <ModalComponent
      modalHeader="Terms of Use"
      size="lg"
      show={openModel}
      onHandleCancel={() => window.history.back()}
    >
      <div>
        {Array.isArray(sectionArray) &&
          sectionArray.map((ele) => (
            <div key={ele.type} className="d-flex flex-column">
              <div>
                <p className="mainSectionHeading">
                  <span className="mainSectionHeadingspan">{ele.secName}</span>
                </p>
              </div>
              {Array.isArray(ele.sectionList) &&
                ele.sectionList.map((subEle) => {
                  switch (subEle.sectionType) {
                    case sectionType.SECTION:
                      return (
                        <p className="sectionText">{subEle.sectionText}</p>
                      );
                    case sectionType.LIST:
                      return (
                        <ul>
                          {subEle.sectionListArr.map((item, i) => (
                            <li key={i + 1} className="sectionText">
                              {item}
                            </li>
                          ))}
                        </ul>
                      );
                    case sectionType.SECTION_LIST:
                      return (
                        <div>
                          {subEle.sectionText.map((el, idx) => (
                            <p key={idx + 1}>
                              <ul>
                                <li>{el.listHeading}</li>
                              </ul>
                              <p className="ps-3 sectionText">{el.listText}</p>
                            </p>
                          ))}
                        </div>
                      );
                    default:
                      break;
                  }
                })}
            </div>
          ))}
      </div>
      <div className="d-flex align-items-center justify-content-end">
        <Button
          variant="secondary"
          className="ripple-effect"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
      </div>
    </ModalComponent>
  );
};

export default TermsOfUseConditionComp;

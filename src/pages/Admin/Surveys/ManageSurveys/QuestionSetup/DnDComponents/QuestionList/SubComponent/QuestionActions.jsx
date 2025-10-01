import React from "react";
import { Link } from "react-router-dom";

const QuestionActions = ({
  onDeleteClick,
  onEditClick,
  questionID,
  isScore,
  questionType,
  questionData,
}) => {
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDeleteClick(questionID);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEditClick();
  };

  const getSubType = (qData) => {
    let subtext = null;

    switch (qData.questionType) {
      case "D":
        if (qData.isBranchFilter) {
          subtext = "Branch Filter";
        } else if (!qData.isBranchFilter) {
          // subtext = "Single Rating";
        }

        break;

      case "G":
        subtext = "Gate Qualifier";

        break;

      case "R":
        if (qData.isScore === 0) {
          if (qData.responseSelectedType === "Single Select Response") {
            subtext = "Rating - Single Select";
          } else if (qData.responseSelectedType === "Multi-Select Response") {
            subtext = "Rating - Multi Select";
          } else if (qData.responseSelectedType === "Rank Order Response") {
            subtext = "Rating - Rank Order";
          }
        } else if (qData.isScore === 1) {
          subtext = "Rating";
        }
        break;

      case "N":
      case "MR":
        if (qData.isScore === 0) {
          if (qData.responseSelectedType === "Single Select") {
            subtext = `${
              qData.questionType === "N" ? "Nested - " : "Multi response - "
            } Single Select`;
          } else if (qData.responseSelectedType === "Select All that Apply") {
            subtext = `${
              qData.questionType === "N" ? "Nested - " : "Multi response - "
            } Multi Select`;
          }
        } else if (qData.isScore === 1) {
          subtext = `${
            qData.questionType === "N" ? "Nested" : "Multi response"
          }`;
        }
        break;

      default:
        break;
    }

    return subtext;
  };

  return (
    <div className="d-flex align-items-center gap-xxl-4 gap-lg-3 gap-2 flex-wrap dataAnalyticsCol_actionBtn">
      <div className="d-flex align-items-center gap-xl-3 gap-2 flex-wrap">
        {questionType === "D" ? (
          <div className="d-flex flex-column">
            <Link className="commonInfoLink commonInfoLink_blue mt-0 Data Analytics">
              {questionData?.isPreLoad ? "Demographic Upload" : "Demographic"}
            </Link>
            {!questionData?.isPreLoad && (
              <span style={{ fontSize: "10px", color: "#0968AC" }}>
                {getSubType(questionData)}
              </span>
            )}
          </div>
        ) : isScore === 1 ? (
          <div className="d-flex flex-column">
            <Link className="commonInfoLink commonInfoLink_blue mt-0 Data Analytics">
              Data Analytics
            </Link>
            <span style={{ fontSize: "10px", color: "#0968AC" }}>
              {getSubType(questionData)}
            </span>
          </div>
        ) : questionType === "O" ? (
          <Link className="commonInfoLink commonInfoLink_blue mt-0 Data Analytics">
            OEQ
          </Link>
        ) : (
          <div className="d-flex flex-column">
            <Link className="commonInfoLink commonInfoLink_blue mt-0 Data Analytics">
              Information Gathering
            </Link>
            <span style={{ fontSize: "10px", color: "#0968AC" }}>
              {getSubType(questionData)}
            </span>
          </div>
        )}
      </div>
      <div className="d-flex gap-lg-3 gap-2 align-items-center">
        <Link aria-label="Edit icon" onClick={handleEditClick}>
          <em className="icon-table-edit" />
        </Link>
        <Link aria-label="Delete icon" onClick={handleDeleteClick}>
          <em className="icon-delete" />
        </Link>
        <Link aria-label="collapse-arrow icon">
          <em className="icon-collapse-arrow" />
        </Link>
      </div>
    </div>
  );
};

export default QuestionActions;

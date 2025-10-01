import { Collapse } from "react-bootstrap";
// eslint-disable-next-line import/no-extraneous-dependencies
import adminRouteMap from "routes/Admin/adminRouteMap";
import { BasicAlert, Button } from "components";
import { useEffect, useState } from "react";
import { Link, useResolvedPath } from "react-router-dom";
import {
  useOutCome,
  useSurveyDataOnNavigations,
} from "../../../../../../customHooks";
import { toast } from "react-hot-toast";

const Sidebar = ({
  menuCollapsed,
  handleDragStart,
  handleQuestionSelect,
  activeForm,
  currentOutcomeValue
}) => {
  const { outComeID } = useOutCome();
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const { getSurveyDataOnNavigate } = useSurveyDataOnNavigations();
  const surevyData = getSurveyDataOnNavigate();

  const { pathname } = useResolvedPath();
  const questionTypes = [
    {
      id: "rating",
      label: "Rating",
    },
    {
      id: "nested",
      label: "Nested Rating",
    },
    {
      id: "oeq",
      label: "OEQ",
    },
    {
      id: "multi",
      label: "Multi-Response",
    },
    {
      id: "gate",
      label: "Gate Qualifier",
    },
  ];

  const Demographic = [
    {
      id: "vdemographic",
      label: "Demographic",
    },
    {
      id: "dupload",
      label: "Demographic Upload",
    },
  ];

  const handleDoubleClick = (item) => {
    if (!outComeID) {
      setIsAlertVisible(true);
    } else {
      handleQuestionSelect(item, outComeID);
    }
  };

  const [collapseState, setCollapseState] = useState({
    orgstructure: false,
    surveys: false,
  });

  const toggleCollapse = (collapseName) => {
    setCollapseState((prevState) => ({
      [collapseName]: !prevState[collapseName],
    }));
  };

  useEffect(() => {
    const collapseMapping = {
      orgstructure: [
        adminRouteMap.DEPARTMENTMANAGEMENT.path,
        adminRouteMap.PARTICIPANTMANAGEMENT.path,
        adminRouteMap.COMPANYMANAGEMENT.path,
        adminRouteMap.LOGIN.path,
      ],
      surveys: [
        adminRouteMap.MANAGESURVEY.path,
        adminRouteMap.VIEWCROSSWALK.path,
        adminRouteMap.RESOURCES.path,
      ],
    };

    for (const [key, paths] of Object.entries(collapseMapping)) {
      if (paths.includes(pathname)) {
        setCollapseState((prevState) => ({
          ...prevState,
          [key]: true,
        }));
      }
    }
  }, [pathname]);

  const TOAST_ID = "error001";

  const handleDragToast = (e, id) => {
    if (surevyData?.status !== "Design" && surevyData?.status) {
      toast.dismiss(TOAST_ID);
      toast.error(`Question in ${surevyData?.status} status cannot be added`, {
        id: TOAST_ID,
      });
      return;
    }

    if (surevyData?.isExceed) {
      toast.dismiss(TOAST_ID);
      toast.error(
        `Question should not exceed Maxlimit ${surevyData?.maxQuestionList}`,
        {
          id: TOAST_ID,
        }
      );
      return;
    }

    if (Array.isArray(activeForm) && activeForm.length > 0) {
      const outcomeId = activeForm[0]?.outcomeId;
      const outComeName = currentOutcomeValue.find(ele => ele.id === outcomeId);
      let filteredOutcomeName = "";
      if (outComeName) {
        filteredOutcomeName = `in ${outComeName.outcomeName}`
      }
      toast.dismiss(TOAST_ID);
      toast.error(`There is an active question ${filteredOutcomeName}`, {
        id: TOAST_ID,
      });
      return;
    }

    handleDragStart(e, id);
  };

  return (
    <>
      <aside className={`sidebar ${menuCollapsed ? "menuCollapse" : ""}`}>
        <div className="sidebar_head d-flex align-item-center ">
          <Link to={adminRouteMap.MANAGESURVEY.path}>
            <em className="icon-back" />
          </Link>
          <span>Question Setup</span>
        </div>
        {/* <div className="sidebar_questionType">
          <div className="sidebar_title d-flex align-item-center">
            <h4>
              <Link
                className="d-flex align-item-center"
                onClick={scrollToAddOutcomes}
              >
                Add Outcomes
                <OverlayTrigger
                  overlay={
                    <Tooltip id="tooltip-disabled">
                      Choose Single Outcomes for a simple assessment with one
                      outcome. Multi-Outcomes requires a minimum of 3 outcomes.
                    </Tooltip>
                  }
                >
                  <span className="d-flex ms-2">
                    <em
                      disabled
                      style={{ pointerEvents: "none" }}
                      className="icon-info-circle sideBar_icon"
                    />
                  </span>
                </OverlayTrigger>
              </Link>
            </h4>
          </div>
        </div> */}

        <div className="sidebar_questionType">
          <ul className="list-unstyled mb-xxl-3 mb-2">
            <li>
              <Button
                type="button"
                className={`toggleMenu ${
                  collapseState.orgstructure ? "active" : ""
                }`}
                onClick={() => toggleCollapse("orgstructure")}
              >
                <span>Demographic Question </span>
              </Button>
              <Collapse in={collapseState.orgstructure}>
                <ul className="submenu list-unstyled" id="toggleMenu">
                  {Demographic.map(({ id, label }) => (
                    <li key={id}>
                      <Link
                        draggable
                        onDragStart={(e) => handleDragToast(e, id)}
                        onDoubleClick={() => handleDoubleClick(id)}
                        onClick={(e) => e.preventDefault()}
                      >
                        <em className="icon-drag" />
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Collapse>
            </li>
          </ul>
        </div>

        <div className="sidebar_questionType">
          <ul className="list-unstyled mb-xxl-3 mb-2">
            <li>
              <Button
                type="button"
                className={`toggleMenu ${
                  collapseState.surveys ? "active" : ""
                }`}
                onClick={() => toggleCollapse("surveys")}
              >
                <span>Questions</span>
              </Button>
              <Collapse in={collapseState.surveys}>
                <ul className="submenu" id="toggleMenu">
                  {questionTypes.map(({ id, label }) => (
                    <li key={id}>
                      <Link
                        draggable
                        onDragStart={(e) => handleDragToast(e, id)}
                        onDoubleClick={() => handleDoubleClick(id)}
                        onClick={(e) => e.preventDefault()}
                      >
                        <em className="icon-drag" />
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Collapse>
            </li>
          </ul>
        </div>
      </aside>

      <BasicAlert
        title="Target outcome not selected?"
        text="Please select the outcome where you want to add a question!"
        show={isAlertVisible}
        icon="warning"
        setIsAlertVisible={setIsAlertVisible}
        buttonText="OK"
      />
    </>
  );
};

export default Sidebar;

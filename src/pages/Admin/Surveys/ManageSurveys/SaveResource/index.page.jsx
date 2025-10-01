import { RESOURSE_MANAGEMENT } from "apiEndpoints/ResourseManagement";
import SaveResourceFormComponent from "components/ResourceForm/SaveResourceFormComponent";
import { useAuth } from "customHooks";
import logger from "helpers/logger";
import { useEffect, useState } from "react";
import { commonService } from "services/common.service";
import { decodeHtmlEntities } from "utils/common.util";
import { Breadcrumb } from "../../../../../components";
import adminRouteMap from "../../../../../routes/Admin/adminRouteMap";

function SaveResources() {
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  const [loading, setLoading] = useState(false);
  const [surveyTypeData, setSurveyTypeData] = useState([]);
  // breadcrumb
  const breadcrumb = [
    {
      path: "#!",
      name: "Surveys",
    },
    {
      path: `${adminRouteMap.MANAGESURVEY.path}`,
      name: "Manage Surveys",
    },
    {
      path: "#",
      name: "Save Resources",
    },
  ];
  const getSurveyTypeData = async () => {
    setLoading(true);
    try {
      const response = await commonService({
        apiEndPoint: RESOURSE_MANAGEMENT.getQuesSurveyTypeData,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        setSurveyTypeData(
          Object?.values(response?.data?.data?.surveyType)?.map((company) => ({
            value: company?.libraryElementID,
            label: decodeHtmlEntities(company?.value),
          }))
        );
      }
    } catch (error) {
      logger(error);
    }
    setLoading(false);
  };
  // resources options
  const resourcesOptions = [
    { value: "97", label: "My Resources" },
    { value: "98", label: "Customer Company" },
  ];
  // checkbox
  const emailCheckbox = [
    { id: "isPreStartRequired", label: "Pre Start Email" },
    { id: "isAssignEmailRequired", label: "Assign Email" },
    { id: "isRemainderMailRequired", label: "Reminder Email" },
    { id: "isThankYouMailRequired", label: "Thank You Email" },
    { id: "isEmailFooterRequired", label: "Email Footer" },
  ];
  const participantCheckbox = [
    { id: "isIntroductionRequired", label: "Introduction" },
    { id: "isFaqRequired", label: "FAQ" },
    { id: "isHelpContactRequired", label: "Help Contact" },
    { id: "isProgressBarRequired", label: "Progress bar" },
  ];
  const summeryCheckbox = [
    { id: "isSummaryReportRequired", label: "User Summary Report" },
    { id: "isDetailedReportRequired", label: "User Detailed Report" },
  ];

  useEffect(() => {
    getSurveyTypeData();
  }, []);
  return (
    <>
      <div className="saveResources">
        {/* head title start */}
        <section className="commonHead">
          <h1 className="commonHead_title">Welcome Back!</h1>
          <Breadcrumb breadcrumb={breadcrumb} />
        </section>
        {/* head title end */}
        <div className="pageContent">
          <div className="pageTitle d-flex align-items-center justify-content-between">
            <h2>Save Resources</h2>
          </div>
          <SaveResourceFormComponent
            surveyTypeOptions={surveyTypeData}
            resourcesOptions={resourcesOptions}
            emailCheckbox={emailCheckbox}
            participantCheckbox={participantCheckbox}
            summeryCheckbox={summeryCheckbox}
            surveyLoading={loading}
          />
        </div>
      </div>
    </>
  );
}

export default SaveResources;

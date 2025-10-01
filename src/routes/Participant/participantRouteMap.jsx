import { baseRoutes } from "../../helpers/baseRoutes";

const participantRouteMap = {
  STARTSURVEY: { path: `${baseRoutes.participantBaseRoutes}/home` },
  THANKYOU: { path: `${baseRoutes.participantBaseRoutes}/thankyou` },
  PLOGIN: { path: `${baseRoutes.participantBaseRoutes}/p-login` },
  ALOGIN: { path: `${baseRoutes.participantBaseRoutes}/a-login` },
  TAKESURVEY: { path: `${baseRoutes.participantBaseRoutes}/take-survey` },
  PROGRESSDASHBOARD: { path: `${baseRoutes.participantBaseRoutes}/survey-dashboard` },
  MYSURVEY: { path: `${baseRoutes.participantBaseRoutes}/my-survey` },
  FAQ: { path: `${baseRoutes.participantBaseRoutes}/faq` },
  CONTACTUS: { path: `${baseRoutes.participantBaseRoutes}/contact` },
  SUMMARYREPORT: { path: `${baseRoutes.participantBaseRoutes}/summary-report` },
  DETAILEDREPORT: { path: `${baseRoutes.participantBaseRoutes}/detailed-report` },
  JUMPSEQUENCE: { path: `${baseRoutes.participantBaseRoutes}/jumpSequence` },
  VIEWRESPONSE: { path: `${baseRoutes.participantBaseRoutes}/viewResponse` },
  VIEWRESPONSESURVEY: { path: `${baseRoutes.participantBaseRoutes}/view-response` },
};
export default participantRouteMap;

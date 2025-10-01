import participantRouteMap from "./participantRouteMap";
import {
  StartSurvey,
  TakeSurvey,
  MySurvey,
  Faq,
  ContactUs,
  ProgressDashboard,
  SummaryReport,
  DetailedReport,
  JumpSequnce,
  ThankYou,
  ViewResponse,
} from "../../pages/Participant";

export default function route() {
  return [
    {
      path: participantRouteMap.STARTSURVEY.path,
      name: "StartSurvey",
      element: <StartSurvey />,
      private: true,
    },
    {
      path: participantRouteMap.THANKYOU.path,
      name: "ThankYou",
      element: <ThankYou />,
      private: true,
    },
    {
      path: participantRouteMap.JUMPSEQUENCE.path,
      name: "JumpSequnce",
      element: <JumpSequnce />,
      private: true,
    },
    {
      path: participantRouteMap.TAKESURVEY.path,
      name: "TakeSurvey",
      element: <TakeSurvey />,
      private: true,
    },
    {
      path: participantRouteMap.PROGRESSDASHBOARD.path,
      name: "Progress Dashboard",
      element: <ProgressDashboard />,
      private: true,
    },
    {
      path: participantRouteMap.MYSURVEY.path,
      name: "MySurvey",
      element: <MySurvey />,
      private: true,
    },
    {
      path: participantRouteMap.FAQ.path,
      name: "Faq",
      private: true,
      element: <Faq />,
    },
    {
      path: participantRouteMap.CONTACTUS.path,
      name: "ContactUs",
      private: true,
      element: <ContactUs />,
    },
    {
      path: participantRouteMap.SUMMARYREPORT.path,
      name: "Summary Report ",
      private: true,
      element: <SummaryReport />,
    },
    {
      path: participantRouteMap.DETAILEDREPORT.path,
      name: "Detailed Report",
      private: true,
      element: <DetailedReport />,
    },
 {
      path: participantRouteMap.VIEWRESPONSE.path,
      name: "View Response",
      private: true,
      element: <ViewResponse />,
    },
  ];
}

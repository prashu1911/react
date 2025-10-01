import TermsOfUseConditionComp from "components/TermsModal";
import AnonymousSurvey from "pages/Admin/Anonymoussurvey/index.page";
import ParticipantSurvey from "pages/Admin/Participantsurvey/index.page";
import adminRouteMap from "./adminRouteMap";
import Preview from "pages/Admin/Analytics/DemographicTrendAnalysis/Preview/index.page";
import DDChartReportPreview from "pages/Admin/Reports/Previews/DDChartReportPreview";

import {
  AdminLogin,
  QuestionSetup,
  AdminConfirmPassword,
  VerifyEmail,
  PageNotFound,
  Unauthorized,
  SurveyNotAvailable,
  AdminForgotPassword,
  SummaryReportPreview,
  SingleChartReportPreview,
  DetailChartReportPreview,
  IGChartReportPreview,
} from "../../pages";
import SSOLogin from "pages/Admin/SSOLogin/index.page";
import ReportPreview from "pages/Admin/IntelligentReports/ReportGenerator/ReportPreview/index.page";

export default function route() {
  return [
    {
      path: adminRouteMap?.LOGIN?.path,
      name: "Admin Login",
      commonRoute: true,
      private: false,
      element: <AdminLogin />,
    },
      {
      path: adminRouteMap?.LOGINREDIRECT?.path,
      name: "Admin Login",
      commonRoute: true,
      private: false,
      element: <AdminLogin />,
    },
    {
      path: adminRouteMap?.SSOLOGIN?.path,
      name: "SSO Login",
      commonRoute: true,
      private: false,
      element: <SSOLogin />,
    },
    {
      path: adminRouteMap?.FORGOTPASSWORD?.path,
      name: "Admin ForgotPassword",
      commonRoute: true,
      private: false,
      element: <AdminForgotPassword />,
    },
    {
      path: adminRouteMap?.CONFIRMPASSWORD?.path,
      name: "Admin Confirm Password",
      commonRoute: true,
      private: false,
      element: <AdminConfirmPassword />,
    },
    {
      path: adminRouteMap?.VERIFYEMAIL?.path,
      name: "Verify Email",
      commonRoute: true,
      private: false,
      element: <VerifyEmail />,
    },
    {
      path: adminRouteMap?.QUESTIONSETUP?.path,
      name: "question-setup",
      commonRoute: true,
      private: false,
      element: <QuestionSetup />,
    },
    {
      path: adminRouteMap?.PAGENOTFOUND?.path,
      name: "Page Not Found",
      commonRoute: true,
      private: false,
      element: <PageNotFound />,
    },
    {
      path: adminRouteMap?.UNAUTHORIZED?.path,
      name: "Unauthorized",
      commonRoute: true,
      private: false,
      element: <Unauthorized />,
    },
    {
      path: adminRouteMap?.TERMS?.path,
      name: "Terms Of Use",
      commonRoute: true,
      private: false,
      element: <TermsOfUseConditionComp />,
    },
    {
      path: adminRouteMap?.ANONYMOUSSURVEY?.path,
      name: "annoymous-survey",
      private: false,
      element: <AnonymousSurvey />,
    },
    {
      path: adminRouteMap?.PARTICIPANTSURVEY?.path,
      name: "participant-survey",
      private: false,
      element: <ParticipantSurvey />,
    },
    {
      path: adminRouteMap?.PREVIEWDEMOGRAPHICTRENDANALYSYS?.path,
      name: "Preview Demographic trend analysys",
      commonRoute: true,
      private: false,
      element: <Preview />,
    },
    {
      path: adminRouteMap.SURVEYNOTAVAILABLE.path,
      name: "Survey Not Available",
      commonRoute: true,
      private: false,
      element: <SurveyNotAvailable />,
    },
    {
      path: adminRouteMap?.SUMMARYREPORTPREVIEW?.path,
      name: "Preview Summary Report",
      commonRoute: true,
      private: false,
      element: <SummaryReportPreview />,
    },
    {
      path: adminRouteMap?.SINGLECHARTREPORTPREVIEW?.path,
      name: "Preview Single Chart Report",
      commonRoute: true,
      private: false,
      element: <SingleChartReportPreview />,
    },
    {
      path: adminRouteMap?.DETAILCHARTREPORT?.path,
      name: "Preview Detail Chart Report",
      commonRoute: true,
      private: false,
      element: <DetailChartReportPreview />,
    },
    {
      path: adminRouteMap?.IGCHARTREPORT?.path,
      name: "Preview IG Chart Report",
      commonRoute: true,
      private: false,
      element: <IGChartReportPreview />,
    },
    {
      path: adminRouteMap?.DDCHARTREPORTPREVIEW?.path,
      name: "Preview DD Chart Report",
      commonRoute: true,
      private: false,
      element: <DDChartReportPreview />,
    },
    {
      path: adminRouteMap?.REPORTPREVIEW?.path,
      name: "Preview DD Chart Report",
      commonRoute: true,
      private: false,
      element: <ReportPreview />,
    },
  ];
}

import { AnonymousLogin, ParticipantLogin, SurveyNotAvailable } from "pages";
import participantRouteMap from "./participantRouteMap";

export default function route() {
  return [
    {
      path: participantRouteMap.PLOGIN.path,
      name: "PLogin",
      private: false,
      element: <ParticipantLogin />,
    },
    {
      path: `${participantRouteMap.ALOGIN.path}`,
      name: "AnonymousLogin",
      private: false,
      element: <AnonymousLogin />,
    },
  ];
}

import { ParticipantPrivateLayout, ParticipantPublicLayout } from "../../layouts";
import publicRoutes from "./public.route";
import privateRoutes from "./private.route";

export const participantRoutes = () => {
  return [
    {
      element: <ParticipantPublicLayout />,
      children: [...publicRoutes()],
    },
    {
      element: <ParticipantPrivateLayout />,
      children: [...privateRoutes()],
    },
  ];
};

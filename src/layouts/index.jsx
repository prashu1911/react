import React from "react";

export const AdminLayout = React.lazy(() => import("./Admin/index.layout"));
export const AdminPublicLayout = React.lazy(() => import("./Admin/public.layout"));
export const AdminPrivateLayout = React.lazy(() => import("./Admin/private.layout"));

export const ParticipantLayout = React.lazy(() => import("./Participant/index.layout"));
export const ParticipantPublicLayout = React.lazy(() => import("./Participant/public.layout"));
export const ParticipantPrivateLayout = React.lazy(() => import("./Participant/private.layout"));

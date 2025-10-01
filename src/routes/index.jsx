import React from 'react';
import { AdminLayout, ParticipantLayout } from '../layouts';
import { adminRoutes } from './Admin';
import { participantRoutes } from './Participant';


export const routes = () => {
  return [
    {
      element: <AdminLayout />,
      children: [...adminRoutes()],
    },
    {
      element: <ParticipantLayout />,
      children: [...participantRoutes()],
    },
    // {
    //   path: "*",
    //   element: <NotFound />,
    // },
  ];
};

export const routesList = () => {
  const [userRoutesConfig, participantRoutesConfig] = [adminRoutes(), participantRoutes()];
 //  Concatenate the children arrays from both user and participant routes

  const routeArr = [
    ...userRoutesConfig[0].children,
    ...userRoutesConfig[1].children,
    ...participantRoutesConfig[0].children,
    ...participantRoutesConfig[1].children,
  ];

  return routeArr;
};

export const moduleRoutesList = () => {
  let routeArr = {
    participant: [...participantRoutes()[0].children, ...participantRoutes()[1].children],
    admin: [...adminRoutes()[0].children, ...adminRoutes()[1].children],
  };
  return routeArr;
};
export const getCompletePathList = () => {
  return routesList().reduce((prev, curr) => {
    prev.push(curr);
    if (curr.children) {
      prev.push(...curr.children);
    }
    return prev;
  }, []);
};
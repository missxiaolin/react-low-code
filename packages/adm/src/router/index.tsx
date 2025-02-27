import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazyLoad } from "./LazyLoad";
import ErrorBoundary from "./ErrorBoundary";
import { AppstoreOutlined } from "@ant-design/icons";
import Root from "./Root";

export const admRouter = [
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorBoundary />,
    meat: {
      title: "Dashboard",
      hideInMenu: false,
      icon: <AppstoreOutlined />,
    },
    children: [
      {
        path: "/dashboard",
        element: lazyLoad(React.lazy(() => import("../pages/welcome/Welcome"))),
        meat: {
          title: "Dashboard",
          hideInMenu: false,
          icon: "",
        },
      },
    ],
  },
];

export const router = [
  {
    path: "/",
    element: <Navigate to="/dashboard" />,
  },
  {
    path: "/login",
    element: lazyLoad(React.lazy(() => import("../pages/login/Login"))),
  },
].concat(admRouter);

export default createBrowserRouter(router);

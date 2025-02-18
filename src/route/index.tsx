import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { lazyLoad } from './LazyLoad';

export const router = [
    {
        path: '/',
        element: lazyLoad(React.lazy(() => import('../pages/welcome/Welcome'))),
    },
    {
        path: '/login',
        element: lazyLoad(React.lazy(() => import('../pages/login/Login'))),
    }
]

export default createBrowserRouter(router);
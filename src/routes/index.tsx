import MainLayout from '@/layouts';
import AuthLayout from '@/layouts/AuthLayout/AuthLayout';
import { LoginPage } from '@/pages/Auth/Login/loadable';
import { HomePage } from '@/pages/HomePage/loadable';
import { RewardHistoryPage } from '@/pages/RewardHistoryPage/loadable';
import { RewardPage } from '@/pages/RewardPage/loadable';
import { RewardVipPage } from '@/pages/RewardVip/loadable';
import { Navigate, useRoutes } from 'react-router-dom';

const RouterList = () => {
  return useRoutes([
    {
      element: <AuthLayout />,
      children: [{ path: '/login', element: <LoginPage /> }],
    },
    {
      element: <MainLayout />,
      children: [
        {
          path: '/',
          element: <HomePage />,
          index: true,
        },
        {
          path: '/rewards',
          element: <RewardPage />,
          children: [],
        },
        {
          path: '/reward-history',
          element: <RewardHistoryPage />,
          children: [],
        },
        {
          path: '/reward-vip',
          element: <RewardVipPage />,
          children: [],
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/" />,
    },
  ]);
};

export default RouterList;

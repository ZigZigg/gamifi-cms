import MainLayout from '@/layouts';
import AuthLayout from '@/layouts/AuthLayout/AuthLayout';
import { LoginPage } from '@/pages/Auth/Login/loadable';
import { HomePage } from '@/pages/HomePage/loadable';
import { RewardPage } from '@/pages/RewardPage/loadable';
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
      ],
    },
    {
      path: '*',
      element: <Navigate to="/" />,
    },
  ]);
};

export default RouterList;

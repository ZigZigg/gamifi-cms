import { ThemeContext } from '@/providers/ThemeContext';
import { useAppSelector } from '@/stores';
import { Layout } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import clsx from 'clsx';
import { useContext, useEffect, useMemo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import HeaderLayout from './Header';
import SideBar from './Sidebar';
import styles from './index.module.scss';
import { useTranslation } from 'react-i18next';

const MainLayout = () => {
  const { theme } = useContext(ThemeContext);
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const { t } = useTranslation(['progress']);

  useEffect(() => {
    if (isLoggedIn) {
    } else navigate('/login');
  }, [isLoggedIn, navigate]);

  const isDarkTheme = useMemo(() => theme === 'dark', [theme]);
  return (
    <Layout className={clsx(styles.main, isDarkTheme ? 'dark' : 'light')}>
      <Header className="flex h-16 w-full items-center border-b-[1px] border-solid border-gray-20 bg-white">
        <HeaderLayout />
      </Header>
      <Layout>
        <SideBar />
        <Layout
          id="layout"
          className="block h-[calc(100vh-64px)] overflow-auto bg-light-20 px-8 py-6"
        >
          <Content className="h-full">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MainLayout;

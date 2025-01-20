import clsx from 'clsx';
import classes from './index.module.scss';
import { useEffect, useState } from 'react';
import { Menu, MenuProps } from 'antd';
import {
  UnorderedListOutlined,
  TeamOutlined,
  ScheduleOutlined,
  CarryOutOutlined,
  ExceptionOutlined,
} from '@ant-design/icons';
import Sider from 'antd/es/layout/Sider';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { IRoute, systemFlattenRoutes, systemRoutes } from '@/utils/helpers';
import { useAppSelector } from '@/stores';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const rootSubmenuKeys = [
  'human_resource_mgt',
  'progress_mgt',
  'break_mgt',
  'completion_mgt',
];

const MenuSymbols: any = {
  human_resource_mgt: <TeamOutlined />,
  progress_mgt: <UnorderedListOutlined />,
  break_mgt: <ScheduleOutlined />,
  completion_mgt: <CarryOutOutlined />,
  reporting_material: <ExceptionOutlined />,
};

const SideBar = () => {
  const { t } = useTranslation(['common']);
  const [openKeys, setOpenKeys] = useState(['']);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { accessMenu } = useAppSelector((state) => state.auth);

  const generateMenu = (routes: IRoute[]) => {
    return routes.map((route) => {
      const menuItem = getItem(
        route.breadcrumbName,
        route.key,
        MenuSymbols[route.key] ?? undefined,
        route.children ? generateMenu(route.children) : undefined
      );

      return menuItem;
    });
  };

  const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const onSelectMenuItem = ({ key }: { key: string }) => {
    const route = systemFlattenRoutes.find((item) => item.key === key);
    if (route) navigate(route.path ?? '/');
  };

  const onGetSelectedKeys = () => {
    return systemFlattenRoutes
      .filter((route) => route.path && location.pathname.includes(route.path))
      .map((item) => item.key);
  };

  useEffect(() => {
    setOpenKeys(onGetSelectedKeys());
  }, [location, collapsed]);

  return (
    <Sider
      className="bg-white"
      width={240}
      trigger={null}
      collapsible
      collapsed={collapsed}
    >
      <div className={clsx(classes.sidebar)}>
        <Menu
          mode="inline"
          openKeys={openKeys}
          selectedKeys={onGetSelectedKeys()}
          onOpenChange={onOpenChange}
          items={generateMenu(systemRoutes)}
          onSelect={onSelectMenuItem}
        />
        <div
          className={clsx(
            'absolute bottom-0 left-1/2 flex w-full translate-x-[-50%] justify-center hover:cursor-pointer',
            !collapsed ? 'rotate-180' : ''
          )}
          onClick={() => setCollapsed(!collapsed)}
        >
          <img src="/images/collapse.svg" alt="" />
        </div>
      </div>
    </Sider>
  );
};

export default SideBar;

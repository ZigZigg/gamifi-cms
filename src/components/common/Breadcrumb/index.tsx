import { Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { IRoute, systemRoutes } from '@/utils/helpers';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const BreadcrumbComponent = () => {
  const location = useLocation();
  const { t } = useTranslation(['common']);
  const navigate = useNavigate();

  const [items, setItems] = useState([
    {
      title: <HomeOutlined onClick={() => navigate('/')} />,
    },
  ]);

  useEffect(() => {
    const addItems: any = [];
    const paths = location.pathname.split('/').filter((path) => path);
    if (!paths?.length) return;
    const getMatchPaths = (routes: IRoute[], pathIndex: number) => {
      const route = routes.find(
        (route) => route.path && route.path.includes(paths[pathIndex])
      );
      if (!route) return;

      addItems.push({
        title: (
          <span
            onClick={() => {
              if (!route.children?.length) navigate(route.path!);
            }}
          >
            {t(route.breadcrumbName)}
          </span>
        ),
      });
      if (route?.children?.length) getMatchPaths(route.children, pathIndex + 1);
    };

    getMatchPaths(systemRoutes, 0);

    setItems([
      {
        title: <HomeOutlined onClick={() => navigate('/')} />,
      },
      ...addItems,
    ]);
  }, [location.pathname]);

  return <Breadcrumb items={items} />;
};

export default BreadcrumbComponent;

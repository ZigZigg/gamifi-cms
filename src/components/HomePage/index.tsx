import { useAppSelector } from '@/stores';
import { AccessMenu } from '@/types/common';
import { IRoute, systemRoutes } from '@/utils/helpers';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePageComponent = () => {
  const { accessMenu } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const goToPath = (route: IRoute) => {
      if (!route.children?.length) {
        navigate(`${route.path}`);
      } else goToPath(route.children[0]);
    };
    const firstTrueKey = Object.keys(accessMenu).find(
      (key) => accessMenu[key as keyof AccessMenu]
    );
    const defaultRouter = systemRoutes.find(
      (item) => item.accessMenu === firstTrueKey
    );
    if (!defaultRouter) return;
    goToPath(defaultRouter);
  }, [accessMenu, navigate]);

  return <></>;
};

export default HomePageComponent;

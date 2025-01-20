import { useAppSelector } from '@/stores';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const AuthLayout = () => {
  const { isLoggedIn, user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      if (!user?.isFirstLogin) navigate('/');
      else navigate('/change-temporary-password');
    }
  }, [isLoggedIn, navigate, user?.isFirstLogin]);
  return (
    <div className="min-h-screen w-full bg-auth-gradient">
      <div className="grid h-screen w-full grid-cols-12 items-center gap-2 text-center">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;

import { Avatar, Dropdown, MenuProps } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/stores';
import BreadcrumbComponent from '@/components/common/Breadcrumb';
import Logout from '@/components/Auth/Logout';

const Header = () => {
  const [showLogout, setShowLogout] = useState(false);
  const { t } = useTranslation(['authentication', 'common']);
  const { user } = useAppSelector((state) => state.auth);

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: <div onClick={() => setShowLogout(true)}>{t('sign_out')}</div>,
    },
  ];

  return (
    <>
      <div className="flex h-full w-full items-center justify-between py-2">
        <img src="/images/logo.svg" className="h-full w-auto" alt="" />
        <div className="ml-20 flex-1">
          <BreadcrumbComponent />
        </div>
        <div className="flex h-full items-center gap-2">
          <Dropdown
            menu={{ items }}
            placement="bottomRight"
            trigger={['click']}
          >
            <Avatar
              size="large"
              icon={<UserOutlined />}
              className="bg-auth-gradient hover:cursor-pointer"
            />
          </Dropdown>

          <div className="flex flex-col gap-1 leading-none">
            <div>
              {user?.firstName} {user?.lastName}
            </div>
            <div className="text-center text-sm font-semibold">
              ({user?.department?.name})
            </div>
          </div>
        </div>
      </div>
      {showLogout && (
        <Logout open={showLogout} onCancel={() => setShowLogout(false)} />
      )}
    </>
  );
};

export default Header;

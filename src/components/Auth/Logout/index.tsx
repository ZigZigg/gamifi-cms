import { useAppDispatch } from '@/stores';
import { authActions } from '@/stores/slices/auth';
import { Button, Modal } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface LogoutProps {
  open: boolean;
  onCancel: () => void;
}

const Logout = ({ open, onCancel: onCancelCallback }: LogoutProps) => {
  const [isModalOpen, setIsModalOpen] = useState(open);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['authentication', 'common']);

  const onOk = () => {
    setIsModalOpen(false);
    dispatch(authActions.logout());
    navigate('/login');
  };

  const onCancel = () => {
    setIsModalOpen(false);
    onCancelCallback();
  };

  return (
    <Modal
      title=""
      centered
      closeIcon={null}
      open={isModalOpen}
      footer={null}
      width={400}
    >
      <div className="text-center text-base text-gray-30">
        {t('sign_out_confirm')}
      </div>
      <div className="flex w-full justify-between gap-2 pt-10">
        <Button size="large" onClick={onCancel} className="basis-1/2">
          {t('cancel', { ns: 'common' })}
        </Button>
        <Button
          size="large"
          type="primary"
          onClick={onOk}
          className="basis-1/2"
        >
          {t('confirm', { ns: 'common' })}
        </Button>
      </div>
    </Modal>
  );
};

export default Logout;

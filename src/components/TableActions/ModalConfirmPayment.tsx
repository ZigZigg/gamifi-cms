import { Button, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import styles from './ModalConfirmPayment.module.scss';
import { formatNumber } from '@/utils/number';

type Props = {
  open: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  loading?: boolean;
  refFee: number;
};
const ModalConfirmPayment = (props: Props) => {
  const { open, onConfirm, onCancel, loading, refFee } = props;
  const { t } = useTranslation(['common', 'progress']);
  const { t: tP } = useTranslation(['progress']);

  return (
    <Modal open={open} closable={false} footer={null} centered width={674}>
      <div className={styles.modal__content}>
        {`${tP('modal.payment_start')} "${formatNumber(refFee)}" ${tP(
          'modal.payment_end'
        )}`}
      </div>
      <div className={styles.modal__buttons}>
        <Button
          className="w-full"
          htmlType="submit"
          size="large"
          type="default"
          onClick={onCancel}
        >
          {t('cancel')}
        </Button>
        <Button
          className="w-full"
          htmlType="submit"
          size="large"
          loading={loading}
          type="primary"
          onClick={onConfirm}
        >
          {t('confirm')}
        </Button>
      </div>
    </Modal>
  );
};

export default ModalConfirmPayment;

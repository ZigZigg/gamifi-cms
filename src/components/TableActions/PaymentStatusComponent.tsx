import { PaymentStatus, IPaymentStatusObject } from '@/types/progress';
import classes from './PaymentStatus.module.scss';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { DATE_FORMAT } from '@/constants';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@/utils/date';

interface IProps {
  paymentStatus?: IPaymentStatusObject;
}

const PaymentStatusComponent = ({ paymentStatus }: IProps) => {
  const { t } = useTranslation(['progress']);

  const getStatus = (status: PaymentStatus) => {
    return {
      [PaymentStatus.SENT]: {
        text: t('payment_status.sent'),
        className: 'status__pending',
      },
      [PaymentStatus.SUCCESSFUL]: {
        text: t('payment_status.success'),
        className: 'status__successful',
      },
      [PaymentStatus.CANCEL]: {
        text: t('payment_status.cancel'),
        className: 'status__cancel',
      },
      [PaymentStatus.REFUND]: {
        text: t('payment_status.refund'),
        className: 'status__refund',
      },
    }[status as PaymentStatus];
  };

  const date = useMemo(
    () =>
      paymentStatus &&
      formatDate(
        dayjs.unix(+paymentStatus.lastDatetime).toString(),
        DATE_FORMAT.DATE_DMY_Hms
      ),
    [paymentStatus]
  );

  if (!paymentStatus) return <></>;

  return (
    <div
      className={clsx(
        classes.status,
        classes[getStatus(paymentStatus?.status).className]
      )}
    >
      {`${getStatus(paymentStatus?.status).text} (${date})`}
    </div>
  );
};

export default PaymentStatusComponent;

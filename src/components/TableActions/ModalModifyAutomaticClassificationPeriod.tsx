import ModalSAC from '@/atomics/ModalSAC/ModalSAC';
import { useTranslation } from 'react-i18next';
import styles from './ModalModifyAutomaticClassificationPeriod.module.scss';
import { Input } from 'antd';
import { useEffect, useState } from 'react';
import { isNaN } from 'lodash';
import { useModifyPeriodMutation } from '@/stores/api/progress';
import { IParamsUpdatePeriod } from '@/types/progress';

interface IProps {
  open: boolean;
  handleClose?: () => void;
}

const ModalModifyAutomaticClassificationPeriod = (props: IProps) => {
  const { handleClose } = props;
  const { t } = useTranslation(['progress']);
  const [value, setValue] = useState(35); //default value is 35 days
  const [modifyPeriod, modifyPeriodMutation] = useModifyPeriodMutation();

  useEffect(() => {
    if (modifyPeriodMutation.isSuccess) {
      handleClose?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modifyPeriodMutation.isSuccess]);

  const handleConfirm = () => {
    const params: IParamsUpdatePeriod = {
      period: value,
    };
    modifyPeriod(params);
  };

  return (
    <ModalSAC
      {...props}
      title={t('modal.modify_automatic')}
      onCancel={handleClose}
      width={1200}
      onConfirm={handleConfirm}
      loading={modifyPeriodMutation.isLoading}
      disabledConfirm={!value}
    >
      <div className={styles.main}>
        <div className={styles.contract}>{t('modal.contrac_failure')}</div>
        <div className={styles.content}>
          {t('modal.if')}
          <Input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (!isNaN(Number(e.target.value))) {
                setValue(Number(e.target.value));
              }
            }}
            value={value}
          />
          {t('modal.if_description')}
        </div>
      </div>
    </ModalSAC>
  );
};

export default ModalModifyAutomaticClassificationPeriod;

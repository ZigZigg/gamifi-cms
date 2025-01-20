import React from 'react';
import { Button, Modal, ModalProps } from 'antd';
import classes from './ModalSAC.module.scss';
import { useTranslation } from 'react-i18next';
import CloseIcon from '../SvgIcons/CloseIcon';
import clsx from 'clsx';
type Props = {
  open: boolean;
  title?: React.ReactNode;
  txtCancel?: string;
  txtConfirm?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  children?: React.ReactNode;
  loading?: boolean;
  showFooter?: boolean;
  classWrapContent?: string;
  disabledConfirm?: boolean;
  disabledCancel?: boolean;
  isIconClose?: boolean;
};

const ModalSAC: React.FC<Props & ModalProps> = ({
  open,
  title,
  txtCancel,
  txtConfirm,
  onConfirm,
  onCancel,
  children,
  loading = false,
  showFooter = true,
  classWrapContent,
  disabledConfirm = false,
  disabledCancel = false,
  isIconClose = true,
  ...props
}) => {
  const { t } = useTranslation(['common']);

  return (
    <Modal
      open={open}
      closable={false}
      footer={null}
      className={classes.modal}
      centered
      width={820}
      {...props}
    >
      <div className={classes.modal__top}>
        <p className={classes.modal__title}>{title}</p>
        {isIconClose && (
          <div className="flex hover:cursor-pointer" onClick={onCancel}>
            <CloseIcon />
          </div>
        )}
      </div>
      <div className={showFooter ? classes.modal__content : classWrapContent}>
        {children}
      </div>
      {showFooter && (
        <div className={classes.modal__buttons}>
          <Button
            className="w-full"
            htmlType="submit"
            size="large"
            type="default"
            onClick={onCancel}
            disabled={disabledCancel}
          >
            {txtCancel ?? t('cancel')}
          </Button>
          <Button
            className={clsx(
              { ['cursor-not-allowed']: disabledConfirm && loading },
              'w-full'
            )}
            htmlType="submit"
            size="large"
            loading={loading}
            type="primary"
            onClick={onConfirm}
            disabled={disabledConfirm && !loading}
          >
            {txtConfirm ?? t('confirm')}
          </Button>
        </div>
      )}
    </Modal>
  );
};

export default ModalSAC;

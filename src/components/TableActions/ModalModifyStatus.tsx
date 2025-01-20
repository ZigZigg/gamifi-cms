import ModalSAC from '@/atomics/ModalSAC/ModalSAC';
import SelectSAC from '@/atomics/Select/SelectSAC';
import { Form, Input, Radio, RadioChangeEvent } from 'antd';
import { Key, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ModalModifyStatus.module.scss';
import {
  IParamsUpdateProgressStatus,
  StatusContractType,
} from '@/types/progress';
import { useModifyStatusMutation } from '@/stores/api/progress';

interface IProps {
  open: boolean;
  handleClose?: () => void;
  selectedRowKeys?: Key[];
  handleResetSelectedRows?: () => void;
}

const ModalModifyStatus = (props: IProps) => {
  const { handleClose, selectedRowKeys, handleResetSelectedRows } = props;
  const { t } = useTranslation(['progress']);
  const [value, setValue] = useState(true);
  const [showNote, setShowNote] = useState(false);
  const [form] = Form.useForm();
  const [modifyStatus, modifyStatusMutation] = useModifyStatusMutation();

  const optsCompany = [
    {
      label: t('modal.new_company'),
      value: StatusContractType.NEW_BUSINESS,
    },
    {
      label: t('modal.bookkeeping_company'),
      value: StatusContractType.BOOKKEEPING,
    },
  ];
  const optsContractStatus = [
    {
      label: t('modal.select'),
      value: StatusContractType.SELECT,
    },
    {
      label: t('modal.contract_failure'),
      value: StatusContractType.CONTRACT_FAILURE,
    },
    {
      label: t('modal.withdrawal_of_application'),
      value: StatusContractType.APP_WITHDRAWAL,
    },
  ];

  useEffect(() => {
    if (modifyStatusMutation.isSuccess) {
      handleClose?.();
      handleResetSelectedRows?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modifyStatusMutation.isSuccess]);

  useEffect(() => {
    form.setFieldsValue({
      type: value ? StatusContractType.NEW_BUSINESS : StatusContractType.SELECT,
    });
  }, [value, form]);

  const handleConfirm = async () => {
    try {
      await form.validateFields();
      const fields = form.getFieldsValue();

      // if (!value) {
      //   const contractCOmpletion = selectedRows.find(
      //     (item) => !!item.completion
      //   );
      //   const confCompltDate = selectedRows.find(
      //     (item) => !!item.test_document?.confCompltDate
      //   );
      //   if (
      //     contractCOmpletion ||
      //     (confCompltDate &&
      //       fields.type === StatusContractType.CONTRACT_FAILURE)
      //   ) {
      //     onNotification(t('error.MODIFY_CONTRACT_STT', { ns: 'common' }));
      //     return;
      //   }
      // }

      if (fields.type !== StatusContractType.SELECT) {
        const params: IParamsUpdateProgressStatus = {
          ids: selectedRowKeys,
          ...fields,
        };
        if (!params?.noteContent) {
          params.noteContent = '';
        }
        modifyStatus(params);
      } else {
        handleClose?.();
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const onChange = (e: RadioChangeEvent) => {
    form.resetFields();
    setValue(e.target.value);
  };

  const onChangeStt = (val: string | number) => {
    if (val === StatusContractType.APP_WITHDRAWAL) {
      setShowNote(true);
    } else {
      setShowNote(false);
    }
  };

  return (
    <ModalSAC
      {...props}
      title={t('modal.modify_contract')}
      onCancel={handleClose}
      onConfirm={handleConfirm}
      width={570}
      loading={modifyStatusMutation.isLoading}
    >
      <>
        <Radio.Group onChange={onChange} value={value} size="large">
          <Radio value={true} className="mr-6 text-[#5A5B5E]">
            {t('modal.progress_list_screen')}
          </Radio>
          <Radio value={false} className="text-[#5A5B5E]">
            {t('modal.contract_status')}
          </Radio>
        </Radio.Group>
        <Form form={form}>
          {value ? (
            <div className="mb-[126px] mt-8 grid grid-cols-2">
              <div className={`${styles.box} border-r-0`}>
                {t('modal.progress_list_screen')}
              </div>
              <div className={styles.box}>
                <Form.Item name="type">
                  <SelectSAC
                    options={optsCompany || []}
                    style={{ width: 220, height: 32 }}
                    placeholder={t('modal.select')}
                    defaultValue={StatusContractType.NEW_BUSINESS}
                  />
                </Form.Item>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-8 grid grid-cols-2">
                <div className={`${styles.box} border-r-0`}>
                  {t('modal.contract_status')}
                </div>
                <div className={styles.box}>
                  <Form.Item name="type">
                    <SelectSAC
                      options={optsContractStatus || []}
                      style={{ width: 220, height: 32 }}
                      placeholder={t('modal.select')}
                      onChange={onChangeStt}
                    />
                  </Form.Item>
                </div>
              </div>
              {showNote && (
                <div className={styles.note}>
                  {t('modal.note')}
                  <Form.Item
                    name="noteContent"
                    rules={[
                      {
                        required: true,
                        message: t('modal.required_note'),
                      },
                    ]}
                  >
                    <Input
                      maxLength={50}
                      placeholder={t('modal.note')}
                      size="large"
                    />
                  </Form.Item>
                </div>
              )}
            </>
          )}
        </Form>
      </>
    </ModalSAC>
  );
};

export default ModalModifyStatus;

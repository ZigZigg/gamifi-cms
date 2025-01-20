import { IParamsExportProgress } from '@/types/progress';
import { Button } from 'antd';
import { Key, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SelectSAC from '@/atomics/Select/SelectSAC';
import { PageSizeOptions } from '@/constants';
import {
  ContractStatus,
  SCREEN,
  TableFunction,
} from '@/types/contact';
import { IconType } from 'antd/es/notification/interface';
import NotificationContext from '@/providers/NotificationContext';

interface IProps {
  selectedRowKeys: Key[];
  limitPageSize: string;
  onChangeSizePage: (val: number | string) => void;
  handleResetSelectedRows: () => void;
  functionList?: TableFunction[];
  contractStatus?: ContractStatus;
  screen: SCREEN;
}

const TableAction = (props: IProps) => {
  const { t } = useTranslation(['progress', 'common']);
  const {
    selectedRowKeys,
    limitPageSize,
    onChangeSizePage,
    functionList = [
      TableFunction.SYNC_DATA,
      TableFunction.MODIFY_CLASSIFICATION,
      TableFunction.MODIFY_STATUS,
      TableFunction.FULL_DOWNLOAD,
      TableFunction.SINGLE_DOWNLOAD,
      TableFunction.CHANGE_PAGINATION,
      TableFunction.IMPORT,
      TableFunction.DOWNLOAD_TEMPLATE_EDIT,
    ],
  } = props;



  const [isLoadingExportFull, setIsLoadingExportFull] = useState(false);
  const [isLoadingExport, setIsLoadingExport] = useState(false);
  const [isLoadingExportTemplate, setIsLoadingExportTemplate] = useState(false);
  const { api } = useContext(NotificationContext);

  const onNotification = (description: string, type: IconType = 'success') => {
    api!.open({
      message: '',
      description,
      duration: 2,
      closeIcon: false,
      type: type,
    });
  };



  const onExportFull = async () => {
    try {
      setIsLoadingExportFull(true);
    } catch (error) {
      console.log('error', error);
      onNotification(
        t(`${t('error.NETWORK_ERROR')}`, { ns: 'common' }),
        'error'
      );
    } finally {
      setIsLoadingExportFull(false);
    }
  };

  const exportTemplate = async (_: IParamsExportProgress) => {
    try {

    } catch (error) {
      onNotification(
        t(`${t('error.NETWORK_ERROR')}`, { ns: 'common' }),
        'error'
      );
    }
  };

  const onExportTemplateForEdit = async () => {
    try {
      setIsLoadingExportTemplate(true);
      const params: IParamsExportProgress = {
        ids: selectedRowKeys,
      };
      exportTemplate(params);
    } catch (error) {
      console.log('error', error);
      onNotification(
        t(`${t('error.NETWORK_ERROR')}`, { ns: 'common' }),
        'error'
      );
    } finally {
      setIsLoadingExportTemplate(false);
    }
  };

  const onImport = () => {
  };

  const onExport = async () => {
    try {
      if (selectedRowKeys.length > 0) {
        setIsLoadingExport(true);
      }
    } catch (error) {
      onNotification(
        t(`${t('error.NETWORK_ERROR')}`, { ns: 'common' }),
        'error'
      );
    } finally {
      setIsLoadingExport(false);
    }
  };

  return (
    <div className="flex flex-wrap justify-end gap-4">
      {functionList.includes(TableFunction.IMPORT) && (
        <Button
          size="large"
          type="default"
          onClick={onImport}
          className="max-w-fit"
        >
          {t('table.import')}
        </Button>
      )}

      {functionList.includes(TableFunction.DOWNLOAD_TEMPLATE_EDIT) && (
        <Button
          size="large"
          type="default"
          onClick={onExportTemplateForEdit}
          className="max-w-fit"
          loading={isLoadingExportTemplate}
          disabled={!selectedRowKeys.length}
        >
          {t('table.download_template')}
        </Button>
      )}

      {functionList.includes(TableFunction.SYNC_DATA) && (
        <Button
          size="large"
          type="default"
          onClick={() => {}}
          className="max-w-fit"
        >
          {t('table.sync_data')}
        </Button>
      )}


      {functionList.includes(TableFunction.FULL_DOWNLOAD) && (
        <Button
          size="large"
          type="default"
          onClick={onExportFull}
          className="max-w-fit"
          loading={isLoadingExportFull}
        >
          {t('table.excel_download')}
        </Button>
      )}

      {functionList.includes(TableFunction.SINGLE_DOWNLOAD) && (
        <Button
          size="large"
          type="default"
          onClick={onExport}
          loading={isLoadingExport}
          className="max-w-fit"
          disabled={!selectedRowKeys.length}
        >
          {t('table.single_download')}
        </Button>
      )}

      {functionList.includes(TableFunction.CHANGE_PAGINATION) && (
        <SelectSAC
          options={PageSizeOptions.map((item) => ({
            value: item,
            label: `${t('table.items', {
              option: item,
              ns: 'common',
            })}`,
          }))}
          style={{ width: 120 }}
          size="large"
          value={limitPageSize || '5'}
          onChange={(value) => onChangeSizePage(value)}
        ></SelectSAC>
      )}

    </div>
  );
};

export default TableAction;

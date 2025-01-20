import ProgressService from '@/services/progress.service';
import { IParamsExportProgress, TYPE_SCREEN_FAIL } from '@/types/progress';
import { exportFileExcel } from '@/utils/export';
import { Button } from 'antd';
import { Key, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ModalModifyStatus from './ModalModifyStatus';
import ModalModifyAutomaticClassificationPeriod from './ModalModifyAutomaticClassificationPeriod';
import SelectSAC from '@/atomics/Select/SelectSAC';
import { PageSizeOptions } from '@/constants';
import dayjs from 'dayjs';
import { useAppSelector } from '@/stores';
import {
  ContractStatus,
  DepartmentCode,
  SCREEN,
  TableFunction,
} from '@/types/contact';
import { IconType } from 'antd/es/notification/interface';
import NotificationContext from '@/providers/NotificationContext';
import CompletionService from '@/services/completion.service';
import ModalUploadFile from './ModalUploadFile';

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
    handleResetSelectedRows,
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
    screen = SCREEN.PROGRESS,
  } = props;

  const { user } = useAppSelector((state) => state.auth);
  const checkPermissionShowModifyStt =
    user?.department?.code === DepartmentCode.MASTER ||
    user?.department?.code === DepartmentCode.GENERAL_TEAM;

  const checkPermissionShowModifyAutomatic =
    user?.department?.code === DepartmentCode.MASTER;

  const [isLoadingExportFull, setIsLoadingExportFull] = useState(false);
  const [isLoadingExport, setIsLoadingExport] = useState(false);
  const [isLoadingExportTemplate, setIsLoadingExportTemplate] = useState(false);
  const [showModalModifyAutomatic, setShowModalModifyAutomatic] =
    useState(false);
  const [showModalModifyStatus, setShowModalModifyStatus] = useState(false);
  const [showModalUpload, setShowModalUpload] = useState(false);
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

  const handleCloseModalModifyAutomatic = () => {
    setShowModalModifyAutomatic(false);
  };
  const handleCloseModalModifyStatus = () => {
    setShowModalModifyStatus(false);
  };
  const handleCloseModalUpload = () => {
    setShowModalUpload(false);
  };

  const exportFuncByStatus = async (
    screen: SCREEN,
    params: IParamsExportProgress
  ) => {
    try {
      let res = null;
      let fileName;
      switch (screen) {
        case SCREEN.PROGRESS:
          res = await ProgressService.exportProgress(params);
          fileName = t('filename_export.new_business', { ns: 'common' });
          break;
        case SCREEN.BOOKKEEPING:
          res = await ProgressService.exportProgressBookkeeping(params);
          fileName = t('filename_export.bookkeeping', { ns: 'common' });
          break;
        case SCREEN.FAILURES:
          res = await ProgressService.exportBreakList({
            ...params,
            type: TYPE_SCREEN_FAIL.CONTRACT_FAILURE,
          });
          fileName = t('filename_export.contract_failured', { ns: 'common' });
          break;
        case SCREEN.WITHDRAWAL:
          res = await ProgressService.exportBreakList({
            ...params,
            type: TYPE_SCREEN_FAIL.APP_WITHDRAWAL,
          });
          fileName = t('filename_export.withdrawl', { ns: 'common' });
          break;
        case SCREEN.COMPLETION:
          res = await CompletionService.exportCompletion(params);
          fileName = t('filename_export.completion', { ns: 'common' });
          break;

        default:
          break;
      }
      exportFileExcel(res, `${fileName}_${dayjs().format('_YYYYMMDD_hhmmss')}`);
    } catch (error) {
      onNotification(
        t(`${t('error.NETWORK_ERROR')}`, { ns: 'common' }),
        'error'
      );
    }
  };

  const onExportFull = async () => {
    try {
      setIsLoadingExportFull(true);
      const params: IParamsExportProgress = {
        ids: [],
      };
      exportFuncByStatus(screen, params);
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

  const exportTemplate = async (params: IParamsExportProgress) => {
    try {
      const res = await CompletionService.exportTemplate(params);
      const fileName = t('filename_export.export_template', { ns: 'common' });

      exportFileExcel(res, `${fileName}_${dayjs().format('_YYYYMMDD_hhmmss')}`);
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
    setShowModalUpload(true);
  };

  const onExport = async () => {
    try {
      if (selectedRowKeys.length > 0) {
        setIsLoadingExport(true);
        const params: IParamsExportProgress = {
          ids: selectedRowKeys,
        };
        exportFuncByStatus(screen, params);
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

      {functionList.includes(TableFunction.MODIFY_CLASSIFICATION) &&
        checkPermissionShowModifyAutomatic && (
          <Button
            size="large"
            type="default"
            onClick={() => {
              setShowModalModifyAutomatic(true);
            }}
            className="max-w-fit"
          >
            {t('table.modify_automatic_class_period')}
          </Button>
        )}
      {functionList.includes(TableFunction.MODIFY_STATUS) &&
        checkPermissionShowModifyStt && (
          <Button
            size="large"
            type="default"
            onClick={() => {
              setShowModalModifyStatus(true);
            }}
            className="max-w-fit"
            disabled={!selectedRowKeys.length}
          >
            {t('table.modify_status')}
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

      {showModalModifyAutomatic && (
        <ModalModifyAutomaticClassificationPeriod
          open={showModalModifyAutomatic}
          handleClose={handleCloseModalModifyAutomatic}
        />
      )}
      {showModalModifyStatus && (
        <ModalModifyStatus
          open={showModalModifyStatus}
          handleClose={handleCloseModalModifyStatus}
          selectedRowKeys={selectedRowKeys}
          handleResetSelectedRows={handleResetSelectedRows}
        />
      )}
      {showModalUpload && (
        <ModalUploadFile
          open={showModalUpload}
          handleClose={handleCloseModalUpload}
        />
      )}
    </div>
  );
};

export default TableAction;

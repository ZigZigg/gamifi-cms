import ModalSAC from '@/atomics/ModalSAC/ModalSAC';
import UploadIcon from '@/atomics/SvgIcons/UploadIcon';
import { ERROR_CODE } from '@/constants';
import { useTableManagement } from '@/hooks/useTableManagement';
import NotificationContext from '@/providers/NotificationContext';
import CompletionService from '@/services/completion.service';
import { useAppDispatch } from '@/stores';
import { apiSlice } from '@/stores/api';
import { useGetCompletionListQuery } from '@/stores/api/completion';
import { ICompletionResponse } from '@/types/completion';
import { Button } from 'antd';
import { IconType } from 'antd/es/notification/interface';
import clsx from 'clsx';
import {
  Fragment,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
interface IProps {
  open: boolean;
  handleClose?: () => void;
}

const ModalUploadFile = (props: IProps) => {
  const { t } = useTranslation(['common']);

  const { handleClose } = props;
  const { api } = useContext(NotificationContext);
  const inputRef = useRef<any>(null);
  const [files, setFiles] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const dispatch = useAppDispatch();
  const [isSceenPopupError, setIsScreenPopupError] = useState(false);

  const [txtErr, setTxtError] = useState('');

  const { refetch } = useTableManagement<any, ICompletionResponse>(
    useGetCompletionListQuery,
    {
      limit: 5,
      offset: 0,
    }
  );

  const onNotification = (description: string, type: IconType = 'success') => {
    api!.open({
      message: '',
      description,
      duration: 2,
      closeIcon: false,
      type: type,
    });
  };

  const resetField = () => {
    inputRef.current.value = null;
  };

  const handleErr = (msg: string) => {
    onNotification(t(`${msg}`, { ns: 'common' }), 'error');
    resetField();
  };

  const handleUploadFile = async (files: any) => {
    setFiles(files);
    // Check if the selected file is a xlsx
    if (
      files.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      /\.xlsx$/.test(files.name)
    ) {
      try {
        // a
      } catch (error) {
        setTxtError(t('error.NETWORK_ERROR'));
      }
    } else {
      setTxtError(t('upload.wrong_file_type'));
    }
  };

  const handleChange = async (event: any) => {
    try {
      event.preventDefault();
      const files = event.target.files[0];
      if (files) {
        setTxtError('');
        handleUploadFile(files);
      }
    } catch (error) {
      handleErr('');
      console.log('error', error);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('file', files);

      await CompletionService.importSettlement(formData);
      onUploadSucess();
    } catch (error: any) {
      if (error?.errorCode === ERROR_CODE.INVALID_FILE_XLSX) {
        setIsScreenPopupError(true);
        setErrors(error?.data);
        return;
      } else if (error?.errorCode === ERROR_CODE.INVALID_FILE_XLSX_FORMAT) {
        setTxtError(t('upload.error_template'));
        return;
      }
      setTxtError(t('error.NETWORK_ERROR'));
    } finally {
      setIsLoading(false);
    }
  };

  const onUploadSucess = () => {
    refetch();
    dispatch(apiSlice.util.invalidateTags(['SAC_Table_Histories_List']));
    setFiles(null);
    resetField();
    handleClose?.();
  };

  const onUpload = () => {
    inputRef.current.click();
  };

  const title = useMemo(
    () => (isSceenPopupError ? t('upload.title_popup_err') : t('upload.title')),
    [isSceenPopupError, t]
  );

  useEffect(() => {
    return () => {
      setErrors([]);
      setIsScreenPopupError(false);
    };
  }, []);

  const onCopy = () => {
    const errorMessages = errors
      .map((err: any) =>
        t('upload.item_error', {
          field: err.field,
          contract_id: err.contractId,
        })
      )
      .join('\n');

    navigator.clipboard.writeText(errorMessages);
  };

  return (
    <Fragment>
      <ModalSAC
        {...props}
        title={title}
        onCancel={() => {
          handleClose?.();
        }}
        isIconClose={false}
        loading={isLoading}
        showFooter={isSceenPopupError ? false : true}
        onConfirm={handleSubmit}
        width={748}
        disabledCancel={isLoading}
        disabledConfirm={isLoading || !!txtErr || !files}
      >
        {isSceenPopupError ? (
          <div className="mt-6">
            <div className="h-[250px] overflow-x-auto rounded bg-[#EFEFEF] px-3 py-6 text-[#5A5B5E]">
              {errors.map((err: any, index) => {
                return (
                  <div className="text-base" key={index}>
                    {t('upload.item_error', {
                      field: err.field,
                      contract_id: err.contractId,
                    })}
                  </div>
                );
              })}
            </div>

            <div
              className={clsx(
                isLoading && 'cursor-not-allowed',
                'mt-4 flex justify-end gap-4'
              )}
            >
              <Button
                className="w-[145px]"
                htmlType="submit"
                size="large"
                type="default"
                onClick={onCopy}
              >
                {t('upload.copy')}
              </Button>
              <Button
                className="w-[145px]"
                htmlType="submit"
                size="large"
                type="primary"
                onClick={handleClose}
              >
                {t('confirm')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="m-auto flex min-h-[150px] w-[460px] flex-col items-center justify-center rounded-lg border border-dashed border-[#A3A3A3] p-4">
            {files ? (
              // truncate
              <p className="max-w-[300px] text-center text-lg font-medium text-[#0000FF] underline">
                {files?.name}
              </p>
            ) : (
              <p className="block text-lg font-medium text-[#5A5B5E]">
                {t('upload.file_here')}
              </p>
            )}

            {txtErr && <span className="mb-4 text-[#EA5455]">{txtErr}</span>}
            <Button
              htmlType="submit"
              size="large"
              type="primary"
              onClick={onUpload}
              disabled={isLoading}
            >
              <div className="flex items-center justify-center">
                <UploadIcon />
                <span className="ml-2">{t('upload.title')}</span>
              </div>
            </Button>

            <input
              className="hidden"
              ref={inputRef}
              type="file"
              id="input-file-upload"
              accept=".xlsx"
              onChange={handleChange}
            />
          </div>
        )}
      </ModalSAC>
    </Fragment>
  );
};

export default ModalUploadFile;

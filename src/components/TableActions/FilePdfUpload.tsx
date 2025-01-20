import NotificationContext from '@/providers/NotificationContext';
import ProgressService from '@/services/progress.service';
import { IParamsUploadFile } from '@/types/progress';
import { IconType } from 'antd/es/notification/interface';
import { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface IProps {
  handleUpdateList: (e: string) => void;
  handleSetLoadingUploadReceipt: (e: boolean) => void;
  bucketName: string;
}

const FilePdfUpload = (props: IProps) => {
  const { handleUpdateList, handleSetLoadingUploadReceipt, bucketName } = props;
  const { t } = useTranslation(['progress']);
  const fileInputRef = useRef<any>(null);
  const [type, setType] = useState('');

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

  useEffect(() => {
    setType(bucketName);
  }, [bucketName]);

  const resetField = () => {
    fileInputRef.current.value = null;
  };
  const handleErr = (msg: string) => {
    handleSetLoadingUploadReceipt(false);
    onNotification(t(`${msg}`, { ns: 'common' }), 'error');
    resetField();
  };

  const handleFileChange = async (event: any) => {
    try {
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        handleSetLoadingUploadReceipt(true);
        // Check if the selected file is a PDF
        if (
          selectedFile.type === 'application/pdf' ||
          /\.pdf$/.test(selectedFile.name)
        ) {
          // Check if the file size is less than 5MB
          if (selectedFile.size <= 5 * 1024 * 1024) {
            const params: IParamsUploadFile = {
              name: selectedFile.name.replace(/\s/g, '_'), // Replace spaces with underscores
              bucketName: type,
            };
            const rs = await ProgressService.getInfoUploadFilePdf(params);
            const link = rs.presignUrl;
            try {
              const response = await fetch(link, {
                method: 'PUT',
                body: selectedFile,
                headers: {
                  'Content-Type': 'application/pdf',
                  Accept: '*/*',
                },
              });
              if (response.ok) {
                resetField();
                handleUpdateList(rs.accessPoint);
              }
            } catch (error) {
              handleErr(t('upload.network_err'));
            }
          } else {
            handleErr(t('upload.file_size'));
          }
        } else {
          handleErr(t('upload.wrong_file_type'));
        }
      }
    } catch (error) {
      handleErr('');
      console.log('error', error);
    }
  };

  return (
    <>
      <input
        id="input-upload-file"
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept=".pdf"
      />
    </>
  );
};

export default FilePdfUpload;

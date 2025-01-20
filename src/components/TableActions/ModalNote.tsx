import CommonTable from '@/atomics/CommonTable/CommonTable';
import ModalSAC from '@/atomics/ModalSAC/ModalSAC';
import { DATE_FORMAT } from '@/constants';
import { useTableManagement } from '@/hooks/useTableManagement';
import { useAddNoteMutation, useGetNoteListQuery } from '@/stores/api/progress';
import { SCREEN_NOTE } from '@/types/common';
import {
  ICreateNoteRequest,
  INote,
  INoteListRequest,
  INoteListResponse,
  NoteType,
} from '@/types/progress';
import { formatDate } from '@/utils/date';
import { Button, Input } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface IProps {
  open: boolean;
  handleClose?: () => void;
  notePopup: boolean;
  handleCloseChanges?: (total: number) => void;
  isShowAddNote?: boolean;
  screen?: SCREEN_NOTE;
  contractId: number | undefined;
  externalContractId: string | undefined;
}

const ModalNote = (props: IProps) => {
  const { t } = useTranslation(['progress']);
  const {
    handleClose,
    notePopup,
    handleCloseChanges,
    contractId,
    externalContractId,
    isShowAddNote = true,
    screen = SCREEN_NOTE.PROGRESS,
  } = props;

  const [value, setValue] = useState<string>('');
  const [addNote, addNoteMutation] = useAddNoteMutation();

  const paramsId =
    screen === SCREEN_NOTE.PROGRESS
      ? { progressListId: Number(contractId) }
      : { settlementListId: Number(contractId) };

  const filters = {
    limit: 5,
    offset: 0,
    type: notePopup ? NoteType.NOTE : NoteType.REMARK,
    externalContractId,
  };

  const { handleChangePagination, data, queryParams, isLoading, isFetching } =
    useTableManagement<INoteListRequest, INoteListResponse>(
      useGetNoteListQuery,
      filters,
      true
    );

  useEffect(() => {
    if (addNoteMutation.isSuccess) {
      handleCloseChanges?.(data?.total || 0);
      handleClose?.();
      setValue('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addNoteMutation.isSuccess]);

  const columns: ColumnsType<INote> = [
    {
      title: t('note.registrant'),
      dataIndex: 'registrant',
      key: 'registrant',
      width: 165,
      align: 'center',
      render: (_, { registrant }) => (
        <div className="text-left text-[#B9B9C3]">{`${registrant.name}`}</div>
      ),
    },
    {
      title: t('note.email'),
      dataIndex: 'email',
      key: 'email',
      width: 165,
      align: 'center',
      render: (_, { registrant }) => (
        <div className=" text-left text-[#B9B9C3]">{registrant.email}</div>
      ),
    },
    {
      title: t('note.content'),
      dataIndex: 'content',
      key: 'content',
      width: 375,
      align: 'center',
      render: (content) => (
        <div className="text-left text-[#5A5B5E]">{content}</div>
      ),
    },
    {
      title: t('note.registration_date'),
      dataIndex: 'registrationDate',
      key: 'registrationDate',
      width: 140,
      align: 'center',
      render: (_, { createdAt }) => (
        <div className="text-left text-[#B9B9C3]">
          {formatDate(createdAt, DATE_FORMAT.YMD)}
        </div>
      ),
    },
  ];

  const handleAddNote = () => {
    try {
      if (externalContractId) {
        const param: ICreateNoteRequest = {
          content: value.trim(),
          type: notePopup ? NoteType.NOTE : NoteType.REMARK,
          externalContractId,
          ...paramsId,
        };
        addNote(param);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <ModalSAC
      {...props}
      title={notePopup ? t('note.title') : t('note.titleRemark')}
      onCancel={() => {
        handleCloseChanges?.(data?.total || 0);
        handleClose?.();
      }}
      showFooter={false}
      width={950}
      classWrapContent="mt-14"
    >
      <div>
        <CommonTable<INote>
          rowKey="id"
          loading={isLoading || isFetching}
          columns={columns}
          dataSource={data?.records || []}
          pagination={{
            total: data?.total || 0,
            pageSize: queryParams.limit,
            current: Math.floor(queryParams.offset / queryParams.limit) + 1,
          }}
          onChangePagination={handleChangePagination}
        />

        {isShowAddNote && (
          <div className="pt-14">
            <div className="text-lg font-medium text-[#5A5B5E]">
              {notePopup
                ? t('note.register_special_matters')
                : t('note.register_special_matters_remark')}
            </div>
            <div className="flex gap-2 pt-2">
              <Input
                placeholder={t('note.information_placeholder')}
                maxLength={200}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setValue(e.target.value);
                }}
                value={value}
                size="large"
              />
              <Button
                className="w-[180px] font-bold"
                disabled={!value.trim().length}
                size="large"
                onClick={handleAddNote}
                loading={addNoteMutation.isLoading}
              >
                {t('note.registration')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </ModalSAC>
  );
};

export default ModalNote;

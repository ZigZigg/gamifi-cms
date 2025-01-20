import CommonTable from '@/atomics/CommonTable/CommonTable';
import ModalSAC from '@/atomics/ModalSAC/ModalSAC';
import { useTableManagement } from '@/hooks/useTableManagement';
import { useGetHistoryListQuery } from '@/stores/api/progress';
import { IHistoryType } from '@/types';
import {
  IHistory,
  IHistoryListRequest,
  IHistoryListResponse,
  ReasonNonCompletionStatus,
} from '@/types/progress';
import { ColumnsType } from 'antd/es/table';
import { DATE_FORMAT } from '@/constants';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@/utils/date';
import { formatCurrency } from '@/utils/number';
import { PayoutType } from '@/types/completion';

interface IProps {
  open: boolean;
  handleClose?: () => void;
  contractId: number | undefined;
  type?: IHistoryType;
}

const ModalHistory = ({ type = IHistoryType.COMPANY, ...props }: IProps) => {
  const { t } = useTranslation(['progress', 'completion']);
  const { handleClose, contractId } = props;

  const filters = {
    limit: 5,
    offset: 0,
    type: IHistoryType.COMPANY,
    key: 'recordId',
    value: contractId,
  };

  const { handleChangePagination, data, queryParams, isLoading, isFetching } =
    useTableManagement<IHistoryListRequest, IHistoryListResponse>(
      useGetHistoryListQuery,
      filters,
      true
    );

  const reasonOpts = [
    {
      label: t('reason_status.default'),
      value: ReasonNonCompletionStatus.DEFAULT,
    },
    {
      label: t('reason_status.arrears'),
      value: ReasonNonCompletionStatus.ARREARS,
    },
    {
      label: t('reason_status.transfer_process'),
      value: ReasonNonCompletionStatus.TRANSFER_PROCESSING,
    },
  ];

  const columns: ColumnsType<IHistory> = [
    {
      title: t('history.editorName'),
      dataIndex: 'name',
      key: 'name',
      width: 155,
      align: 'center',
      render: (_value, record) => (
        <div className="text-left">
          {!record.userId ? t('history.system') : record.detail.name}
        </div>
      ),
    },
    {
      title: t('history.email'),
      dataIndex: 'email',
      key: 'email',
      width: 170,
      align: 'center',
      render: (_value, record) => (
        <div className="text-left">{record.detail.email}</div>
      ),
    },
    {
      title: t('history.content'),
      dataIndex: 'field',
      key: 'field',
      width: 600,
      align: 'center',
      render: (_value, record) => {
        let content = '';
        if (record.detail?.isFileDeleted) {
          content = `${t(`table.${record.detail.field}`)} ${t(
            'history.file_remove'
          )}`;
        } else if (record.detail?.isFileUpload) {
          content = `${t(`table.${record.detail.field}`)} ${t(
            'history.file_updated'
          )}`;
        } else if (
          record.detail?.currentAmount &&
          record.detail.field === 'payment_status'
        ) {
          content = `${t('history.payment_stt_start')} "${formatCurrency(
            record.detail?.currentAmount
          )} ${t('history.payment_stt_content')} ${t(
            `history.payment_stt_${record.detail?.currentValue}`
          )} (${formatDate(
            record.detail?.changeDate,
            DATE_FORMAT.DATE_DMY_Hms
          )})"${t('history.payment_stt_end')}`;
        } else if (
          record.detail?.field === 'deposit_amount' &&
          type === IHistoryType.SETTLE
        ) {
          content = `${t(`table.deposit_amount_completion`)} ${t(
            'history.field_change_start'
          )} "${record.detail.currentValue}" ${t('history.field_change_end')}`;
        } else {
          let value = '';
          switch (record.detail.currentValue) {
            case true:
              value = t('history.true');
              break;
            case false:
              value = t('history.false');
              break;
            case null:
              value = '';
              break;
            case 'YES':
              value = t('history.yes');
              break;
            case 'NO':
              value = t('history.no');
              break;
            case PayoutType.CHOICE:
              value = t('payout_type.choice', { ns: 'completion' });
              break;
            case PayoutType.BILL:
              value = t('payout_type.bill', { ns: 'completion' });
              break;
            default:
              if (record.detail?.field === 'reason_non_completion') {
                value =
                  reasonOpts.find(
                    (item) => item.value === record?.detail?.currentValue
                  )?.label || '';
              } else {
                value = record.detail.currentValue.toString();
              }
              break;
          }
          content = `${t(`table.${record.detail.field}`)} ${t(
            'history.field_change_start'
          )} "${value}" ${t('history.field_change_end')}`;
        }
        return <div>{content}</div>;
      },
    },
    {
      title: t('history.editsDate'),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 220,
      align: 'center',
      render: (value) => (
        <div>
          {`${formatDate(value, DATE_FORMAT.YMD)} ${formatDate(
            value,
            DATE_FORMAT.HHMMSS
          )}`}
        </div>
      ),
    },
  ];

  return (
    <ModalSAC
      {...props}
      title={t('history.editHistory')}
      onCancel={handleClose}
      showFooter={false}
      width={1150}
      classWrapContent="mt-14"
    >
      <div>
        <CommonTable<IHistory>
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
      </div>
    </ModalSAC>
  );
};

export default ModalHistory;

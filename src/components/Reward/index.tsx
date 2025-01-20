import { useTableManagement } from '@/hooks/useTableManagement';
// import { useNotice } from '@/providers/NoticeProvider';
import { useGetRewardListQuery } from '@/stores/api/rewards';
import { CustomColumnsType } from '@/types/progress';
import { formatDateUTC } from '@/utils/date';
import {
  IReward,
  IRewardListRequest,
  IRewardListResponse,
  RewardStatus,
  TurnType,
} from '@/types/reward';
import {  useEffect, useState } from 'react';
import { DATE_FORMAT } from '@/constants';
import BoxFilter from '@/atomics/BoxFilter/BoxFilter';
import CommonTable from '@/atomics/CommonTable/CommonTable';
import classes from './Reward.module.scss';
const RewardComponent = () => {
  const initFilters = {
    limit: 5,
    offset: 0,
    type: TurnType.FREE,
  };
  const [filters, setFilters] = useState<IRewardListRequest>(initFilters);
  // const { openModal, closeModal } = useNotice();

  const {
    handleChangePagination,
    onFiltering,
    data,
    queryParams,
    isLoading,
    isFetching,
    refetch,
  } = useTableManagement<any, IRewardListResponse>(
    useGetRewardListQuery,
    filters
  );
  const paginationInfo = {
    total: data?.total || 0,
    pageSize: queryParams.limit,
    current: Math.floor(queryParams.offset / queryParams.limit) + 1,
  };

  // const resetPagination = () => {
  //   setFilters({ ...filters, offset: 0 });
  //   onFiltering({ ...filters, offset: 0 });
  // };

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (data?.records.length === 0) {
      setFilters({ ...filters, offset: 0 });
      onFiltering({ ...filters, offset: 0 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.records]);
  // const onChangeSizePage = (pageSize: number | string) => {
  //   setFilters({ ...filters, limit: Number(pageSize) });
  //   onFiltering({ ...filters, limit: Number(pageSize) });
  // };

  // const onDelete = useCallback(
  //   (event: React.MouseEvent<HTMLInputElement>, id: string) => {
  //     event.stopPropagation();
  //     openModal({
  //       description: 'Bạn có muốn xóa phần quà này?',
  //       width: 482,
  //       onOk: () => {
  //         closeModal();
  //       },
  //       onCancel: closeModal,
  //     });
  //   },
  //   [closeModal, openModal]
  // );

  const columns: CustomColumnsType<IReward> = [
    {
      title: 'STT',
      dataIndex: 'id',
      key: 'id',
      width: 63,
      align: 'center',
      fixed: 'left',
      render: (_value, _record, index) => {
        return <div>{queryParams.offset + index + 1}</div>;
      },
    },
    {
      title: 'Loại quà',
      dataIndex: 'turntype',
      key: 'turntype',
      width: 237,
      align: 'center',
      render: (value) => {
        return <div>{value.name}</div>;
      },
    },
    {
      title: 'Giá trị quà',
      dataIndex: 'value',
      key: 'value',
      width: 162,
      align: 'center',
      render: (value) => {
        return <div>{value}</div>;
      },
    },
    {
      title: 'Tổng số lượng',
      dataIndex: 'initial_quantity',
      key: 'initial_quantity',
      width: 100,
      align: 'center',
      render: (value) => {
        return <div>{value}</div>;
      },
    },
    {
      title: 'Tỉ lệ ra quà (%)',
      dataIndex: 'winning_rate',
      key: 'winning_rate',
      width: 100,
      align: 'center',
      render: (value) => {
        return <div>{value}</div>;
      },
    },
    {
      title: 'Số lượng hold',
      dataIndex: 'hold_quantity',
      key: 'hold_quantity',
      width: 100,
      align: 'center',
      render: (value) => {
        return <div>{value}</div>;
      },
    },
    {
      title: 'Số lượng tồn kho',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      align: 'center',
      render: (value) => {
        return <div>{value}</div>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      align: 'center',
      render: (value) => {
        return (
          <div>{value === RewardStatus.ACTIVE ? 'Kích hoạt' : 'Đang hold'}</div>
        );
      },
    },
    {
      title: 'Thời gian tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 100,
      align: 'center',
      render: (value) => (
        <div>{formatDateUTC(value, DATE_FORMAT.DATE_DMY_Hms)}</div>
      ),
    },
    {
      title: 'Thời gian cập nhật',
      dataIndex: 'updated_at',
      key: 'updated_at',
      width: 100,
      align: 'center',
      render: (value) => (
        <div>{formatDateUTC(value, DATE_FORMAT.DATE_DMY_Hms)}</div>
      ),
    },
  ];

  return (
    <div className="relative flex flex-col gap-5">
      <BoxFilter className="px-0 py-8">
        <div>
          <CommonTable<IReward>
            rowKey={(record) => record.id}
            columns={columns}
            dataSource={data?.records || []}
            pagination={paginationInfo}
            loading={isLoading || isFetching}
            onChangePagination={handleChangePagination}
            className={classes.table}
          />
        </div>
      </BoxFilter>
    </div>
  );
};

export default RewardComponent;

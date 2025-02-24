import { useTableManagement } from '@/hooks/useTableManagement';
// import { useNotice } from '@/providers/NoticeProvider';
import { CustomColumnsType } from '@/types/progress';
import { formatDateUTC } from '@/utils/date';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DATE_FORMAT } from '@/constants';
import BoxFilter from '@/atomics/BoxFilter/BoxFilter';
import CommonTable from '@/atomics/CommonTable/CommonTable';
import classes from './Reward.module.scss';
import { Button } from 'antd';
import DeleteIcon from '@/atomics/SvgIcons/DeleteIcon';
import EditIcon from '@/atomics/SvgIcons/EditIcon';
import { IconType } from 'antd/es/notification/interface';

import { useAppDispatch } from '@/stores';
import { getListAllReward } from '@/stores/slices/common/common.slices';
import { useNotice } from '@/providers/NoticeProvider';
import NotificationContext from '@/providers/NotificationContext';
import { IRewardVip, IRewardVipListRequest, IRewardVipListResponse, RewardVipStatus } from '@/types/rewardVip';
import { useDeleteRewardVipMutation, useGetRewardListVipQuery } from '@/stores/api/rewardVip';
import ModalModifyRewardVip from './components/ModalModifyReward';
const RewardVipComponent = () => {
  const initFilters = {
    limit: 10,
    offset: 0,
  };
  const [filters, setFilters] = useState<IRewardVipListRequest>(initFilters);
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [rewardEdit, setRewardEdit] = useState<IRewardVip | undefined>(undefined);
  const onAddNew = () => {
    setOpenAdd(true);
  };
  const resetRewardEdit = () => {
    setRewardEdit(undefined)
  }
  const dispatch = useAppDispatch();
  const { openModal, closeModal } = useNotice();
  const [deleteReward, { isSuccess: isSuccessDeleteReward }] = useDeleteRewardVipMutation()

  const {
    handleChangePagination,
    onFiltering,
    data,
    queryParams,
    isLoading,
    isFetching,
    refetch,
  } = useTableManagement<any, IRewardVipListResponse>(
    useGetRewardListVipQuery,
    filters
  );

  const paginationInfo = {
    total: data?.total || 0,
    pageSize: queryParams.limit,
    current: Math.floor(queryParams.offset / queryParams.limit) + 1,
  };
  const { api } = useContext(NotificationContext);

  const onNotification = (description: string, type: IconType = 'error') => {
    api!.open({
      message: '',
      description,
      duration: 2,
      closeIcon: false,
      type: type,
    });
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

  const onDelete = useCallback(
    (event: React.MouseEvent<HTMLInputElement>, id: string) => {
      event.stopPropagation();
      openModal({
        description: 'Bạn có muốn xóa dữ liệu này?',
        width: 482,
        onOk: () => {
          deleteReward({ id: Number(id) });
          closeModal();
        },
        onCancel: closeModal,
      });
    },
    [closeModal, openModal, deleteReward]
  );
  useEffect(() => {
    if (isSuccessDeleteReward) {
      onNotification('Xóa thành công!', 'success');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessDeleteReward]);

  const onOpenEdit = (record: IRewardVip) => {
    setRewardEdit(record);
    setOpenAdd(true);
  }
  const columns: CustomColumnsType<IRewardVip> = [
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
      title: 'Thuê bao',
      dataIndex: 'phone_number',
      key: 'phone_number',
      width: 237,
      align: 'center',
      render: (value) => {
        return <div>{value}</div>;
      },
    },
    {
      title: 'Thông tin quà',
      dataIndex: 'value',
      key: 'value',
      width: 162,
      align: 'center',
      render: (_value, record) => {
        return <div>{`${record?.reward.id} - ${record?.turntype?.name} - Giá trị: ${record?.reward.value} - ${record?.reward.type}`}</div>;
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
          <div>{value === RewardVipStatus.PENDING ? 'Chờ nhận quà' : 'Đã nhận quà'}</div>
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
    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_value, record) => {
        if(record.status === RewardVipStatus.REDEEMED) return null;
        return <div className="flex justify-center gap-2 hover:cursor-pointer">
          <div
            className={'cursor-pointer'}
            onClick={(event: React.MouseEvent<HTMLInputElement>) => {
              onDelete(event, record.id + '')
            }
            }
          >
            <DeleteIcon />
          </div>
          <div
            className={'cursor-pointer'}
            onClick={() => {
              onOpenEdit(record);
            }
            }
          >
            <EditIcon />
          </div>
        </div>

      }
    },
  ];

  useEffect(() => {
    const getListRewards = async () => {
      await dispatch(getListAllReward());
    };
    getListRewards();
  }, []);

  const currentData = useMemo(() => {
    const result = data?.records;
    return result
  },[data?.records])

  return (
    <div className="relative flex flex-col gap-5">
      <BoxFilter className="px-0 py-8">
        <div className='flex items-center justify-between px-6 pb-5 gap-4'>
          <Button
            size="large"
            type='primary'
            onClick={() => {
              onAddNew();
            }}
            className="max-w-fit"
          >
            Thêm mới
          </Button>
        </div>
        <div>
          <CommonTable<IRewardVip>
            rowKey={(record) => record.id}
            columns={columns}
            dataSource={currentData || []}
            pagination={paginationInfo}
            loading={isLoading || isFetching}
            onChangePagination={handleChangePagination}
            className={classes.table}
          />
        </div>
        <ModalModifyRewardVip open={openAdd} rewardEdit={rewardEdit} resetRewardEdit={resetRewardEdit} handleClose={() => setOpenAdd(!openAdd)} />
      </BoxFilter>
    </div>
  );
};

export default RewardVipComponent;

import { useTableManagement } from '@/hooks/useTableManagement';
// import { useNotice } from '@/providers/NoticeProvider';
import { useDeleteRewardMutation, useGetRewardListQuery } from '@/stores/api/rewards';
import { CustomColumnsType } from '@/types/progress';
import { formatDateUTC } from '@/utils/date';
import {
  IReward,
  IRewardListRequest,
  IRewardListResponse,
  RewardStatus,
  TurnType,
} from '@/types/reward';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DATE_FORMAT } from '@/constants';
import BoxFilter from '@/atomics/BoxFilter/BoxFilter';
import CommonTable from '@/atomics/CommonTable/CommonTable';
import classes from './Reward.module.scss';
import { Button } from 'antd';
import DeleteIcon from '@/atomics/SvgIcons/DeleteIcon';
import EditIcon from '@/atomics/SvgIcons/EditIcon';
import { IconType } from 'antd/es/notification/interface';

import ModalModifyReward from './components/ModalModifyReward';
import { useAppDispatch } from '@/stores';
import { getActiveCampaign, getListMasterData } from '@/stores/slices/common/common.slices';
import { useNotice } from '@/providers/NoticeProvider';
import NotificationContext from '@/providers/NotificationContext';
import Campaign from './components/Campaign';
const RewardComponent = () => {
  const initFilters = {
    limit: 10,
    offset: 0,
    type: TurnType.PAID,
  };
  const [filters, setFilters] = useState<IRewardListRequest>(initFilters);
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [rewardEdit, setRewardEdit] = useState<IReward | undefined>(undefined);
  const onAddNew = () => {
    setOpenAdd(true);
  };
  const resetRewardEdit = () => {
    setRewardEdit(undefined)
  }
  const dispatch = useAppDispatch();
  const { openModal, closeModal } = useNotice();
  const [deleteReward, { isSuccess: isSuccessDeleteReward }] = useDeleteRewardMutation()

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
  const { type } = queryParams

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
        description: 'Bạn có muốn xóa phần quà này?',
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
      onNotification('Xóa phần quà thành công!', 'success');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessDeleteReward]);
  const onChangeTab = (type: TurnType) => {
    onFiltering({ ...initFilters, type });
  }

  const onOpenEdit = (record: IReward) => {
    setRewardEdit(record);
    setOpenAdd(true);
  }
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
        return <div>{(value === '0' || !value) ? '-' : value}</div>;
      },
    },
    {
      title: 'Tổng số lượng',
      dataIndex: 'initial_quantity',
      key: 'initial_quantity',
      width: 100,
      align: 'center',
      render: (value) => {
        return <div>{(value === '0' || !value) ? '-' : value}</div>;
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
    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_value, record) => {
        if(record.turntype.value === 'GOOD_LUCK'){
          return null
        }
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
    const getMasterData = async () => {
      await dispatch(getListMasterData());
    };
    getMasterData();
  }, []);

  useEffect(() => {
    const getCampaign = async () => {
      await dispatch(getActiveCampaign());
    };
    getCampaign();
  }, []);

  const currentData = useMemo(() => {
    const result = data?.records?.filter((item) => !['AIRPOD_DEVICE', 'IPHONE_DEVICE'].includes(item.turntype.value));
    return result
  },[data?.records])

  return (
    <div className="relative flex flex-col gap-5">
      <Campaign />
      <BoxFilter className="px-0 py-8">
        <div className='flex items-center justify-between px-6 pb-5 gap-4'>
          <div className='flex items-center gap-4'>
            <Button
              size="large"
              type={type === TurnType.PAID ? 'primary' : 'default'}
              onClick={() => {
                onChangeTab(TurnType.PAID);
              }}
              className="max-w-fit"
            >
              Lượt chơi mất phí
            </Button>
            <Button
              size="large"
              type={type === TurnType.FREE ? 'primary' : 'default'}
              onClick={() => {
                onChangeTab(TurnType.FREE);
              }}
              className="max-w-fit"
            >
              Lượt chơi miễn phí
            </Button>
          </div>
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
          <CommonTable<IReward>
            rowKey={(record) => record.id}
            columns={columns}
            dataSource={currentData || []}
            pagination={paginationInfo}
            loading={isLoading || isFetching}
            onChangePagination={handleChangePagination}
            className={classes.table}
          />
        </div>
        <ModalModifyReward open={openAdd} rewardEdit={rewardEdit} resetRewardEdit={resetRewardEdit} handleClose={() => setOpenAdd(!openAdd)} />
      </BoxFilter>
    </div>
  );
};

export default RewardComponent;

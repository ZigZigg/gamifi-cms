import { useTableManagement } from '@/hooks/useTableManagement';
// import { useNotice } from '@/providers/NoticeProvider';
import { CustomColumnsType } from '@/types/progress';
import { formatDateUTC } from '@/utils/date';
import { useContext, useEffect, useState } from 'react';
import { DATE_FORMAT } from '@/constants';
import BoxFilter from '@/atomics/BoxFilter/BoxFilter';
import CommonTable from '@/atomics/CommonTable/CommonTable';
import classes from './RewardHistory.module.scss';
import { Button, Form } from 'antd';

import { IRewardHistory, IRewardHistoryListRequest, IRewardHistoryListResponse } from '@/types/rewardHistory';
import { useGetRewardHistoryListQuery } from '@/stores/api/rewardHistory';
import RewardHistoryFilter from './components/RewardHistoryFilter';
import { useAppDispatch } from '@/stores';
import { getListMasterData } from '@/stores/slices/common/common.slices';
import { IconType } from 'antd/es/notification/interface';
import NotificationContext from '@/providers/NotificationContext';
import CommonService from '@/services/common.service';
import { exportFileExcel } from '@/utils/export';
import dayjs from 'dayjs';
const RewardHistoryComponent = () => {
  const initFilters = {
    limit: 10,
    offset: 0,
  };
  const [filters, setFilters] = useState<IRewardHistoryListRequest>(initFilters);
  const dispatch = useAppDispatch();
  const [formFilter] = Form.useForm();

  const {
    handleChangePagination,
    onFiltering,
    data,
    queryParams,
    isLoading,
    isFetching,
    refetch,
  } = useTableManagement<any, IRewardHistoryListResponse>(
    useGetRewardHistoryListQuery,
    filters
  );

  const paginationInfo = {
    total: data?.total || 0,
    pageSize: queryParams.limit,
    current: Math.floor(queryParams.offset / queryParams.limit) + 1,
  };
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


  const columns: CustomColumnsType<IRewardHistory> = [
    {
      title: 'Số điện thoại',
      dataIndex: 'user',
      key: 'phoneNumber',
      width: 242,
      align: 'center',
      render: (value) => {
        return <div>{value.phoneNumber}</div>;
      },
    },
    {
      title: 'Họ và tên',
      dataIndex: 'user',
      key: 'fullName',
      width: 242,
      align: 'center',
      render: (value) => {
        return <div>{value.fullName}</div>;
      },
    },
    {
      title: 'Loại quà',
      dataIndex: 'turntype',
      key: 'rewardType',
      width: 242,
      align: 'center',
      render: (value) => {
        return <div>{value.name}</div>;
      },
    },
    {
      title: 'Giá trị quà',
      dataIndex: 'reward',
      key: 'rewardValue',
      width: 242,
      align: 'center',
      render: (value) => {
        return <div>{(value.value === '0' || !value.value) ? '-' : value.value}</div>;
      },
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      width: 320,
      align: 'center',
      render: (value) => {
        console.log("🚀 ~ RewardHistoryComponent ~ value:", value)
        return <div>{(value === '0' || !value) ? '-' : value}</div>;
      },
    },
    {
      title: 'Thời gian nhận quà',
      dataIndex: 'receive_date',
      key: 'receive_date',
      width: 167,
      align: 'center',
      render: (value) => (
        <div>{formatDateUTC(value, DATE_FORMAT.DATE_DMY_Hms)}</div>
      ),
    },
  ];

  const handleFilter = (values: any) => {
    console.log("🚀 ~ handleFilter ~ values:", values)
    // Remove all empty fields
    // Object.keys(values).forEach((key) => {
    //   if (!values[key]) {
    //     delete values[key];
    //   }
    // });

    const payload = {
      offset: 0,
      ...values,
    };
    onFiltering(payload);
  }
  
  const exportRewardHistory = async () => {
    console.log('queryParams', queryParams)
    try {
      const res = await CommonService.exportRewardHistory(
        {
          ...queryParams,
          rewardType: queryParams.rewardType ? Number(queryParams.rewardType) : '',
        }
      )
      exportFileExcel(
        res,
        `${'rewarHistory'}_${dayjs().format(
          '_YYYYMMDD_hhmmss'
        )}`
      );
    } catch (error) {
      onNotification(
        'Có lỗi xảy ra khi xuất dữ liệu, vui lòng thử lại sau',
        'error'
      );
    }
  }

  useEffect(() => {
    const getMasterData = async () => {
      await dispatch(getListMasterData());
    };
    getMasterData();
  }, []);

  return (
    <div className="relative flex flex-col gap-5">
      <RewardHistoryFilter
        form={formFilter}
        onSearch={handleFilter}
        initFormFilter={queryParams}
      />
      <BoxFilter className="px-0 py-8">
      <div className='flex items-center justify-between px-6 pb-5 gap-4'>
          <div className='flex items-center gap-4'>
            <Button
              size="large"
              type={'primary'}
              onClick={() => {
                exportRewardHistory()
              }}
              className="max-w-fit"
            >
              Xuất dữ liệu
            </Button>
          </div>
        </div>
        <div>
          <CommonTable<IRewardHistory>
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

export default RewardHistoryComponent;

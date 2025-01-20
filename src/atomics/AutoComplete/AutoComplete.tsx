import { useEffect, useState } from 'react';
import SelectSAC from '../Select/SelectSAC';
import { IUser } from '@/types/auth';
import { SearchOutlined, LoadingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { Form } from 'antd';
import { useTableManagement } from '@/hooks/useTableManagement';
import { useGetUsersQuery } from '@/stores/api/contactList';
import {
  IUserAutocompleteRequest,
  IUserAutocompleteResponse,
} from '@/types/contact';
import { debounce, get } from 'lodash';

const AutoComplete = () => {
  const { t } = useTranslation(['contact', 'common']);

  const [users, setUsers] = useState<IUser[] | []>([]);
  const [isCanLoadMore, setIsCanLoadMore] = useState(true);

  const paramsDefault = {
    offset: 0,
    limit: 10,
    key: 'name',
    value: '',
  };

  const { data, isLoading, onFiltering, queryParams, refetch } =
    useTableManagement<IUserAutocompleteRequest, IUserAutocompleteResponse>(
      useGetUsersQuery,
      paramsDefault,
      true
    );

  const onSearchOpts = debounce(async (value: string) => {
    await onFiltering({
      ...paramsDefault,
      value,
    });
  }, 500);

  useEffect(() => {
    setIsCanLoadMore(
      Number(queryParams.offset || 0) + Number(queryParams.limit) <
        Number(get(data, 'total'))
    );
  }, [data, queryParams.limit, queryParams.offset]);

  const onScroll = (event: any) => {
    const target = event.target;

    if (!isCanLoadMore) return;

    if (
      !isLoading &&
      target.scrollTop + target.offsetHeight === target.scrollHeight
    ) {
      const currentOffset = (Number(queryParams.offset) || 0) + 10;
      onFiltering({ offset: currentOffset });
    }
  };

  useEffect(() => {
    if (queryParams.offset > 0 && !isLoading) {
      setUsers((prevUser) => {
        const newUsers = data?.records;
        const arrMerge = [...prevUser, ...newUsers];
        return arrMerge;
      });
    } else {
      setUsers(data?.records);
    }
  }, [data?.records]);

  return (
    <Form.Item name="id" label={t('name')}>
      <SelectSAC
        placeholder={t('placeholder_name')}
        size="large"
        filterOption={false}
        listHeight={150}
        style={{ width: 300 }}
        onPopupScroll={onScroll}
        showSearch
        onSearch={onSearchOpts}
        onClear={() => onFiltering(paramsDefault)}
        onBlur={() => onFiltering(paramsDefault)}
        onDropdownVisibleChange={(open) => {
          if (open) refetch();
        }}
        suffixIcon={
          isLoading ? (
            <LoadingOutlined spin style={{ fontSize: 14 }} />
          ) : (
            <SearchOutlined style={{ fontSize: 14 }} />
          )
        }
        notFoundContent={
          <div className="flex h-[150px] items-center justify-center">
            <p className="text-xl">{t('no_data')}</p>
          </div>
        }
        allowClear
        options={
          (users &&
            users.length > 0 &&
            users.map((item) => {
              return {
                value: item.id,
                label: item.name + '  [' + item.email + ']',
              };
            })) ||
          []
        }
      />
    </Form.Item>
  );
};

export default AutoComplete;

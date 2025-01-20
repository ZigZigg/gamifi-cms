import { Pagination, PaginationProps, Table, TableProps } from 'antd';
import classes from './CommonTable.module.scss';
import { ColumnType } from 'antd/es/table';
import clsx from 'clsx';
import { TablePagination } from '@/types';
import EmptyIcon from '../SvgIcons/EmptyIcon';
import { useTranslation } from 'react-i18next';
interface Props<T> {
  columns: ColumnType<T>;
  dataSource: T[];
  expandable?: TableProps<T>['expandable']; // Define the expandable prop type
  onClickRow?: (record: T) => void;
  onChangePagination?: (
    prevPagination: TablePagination,
    currentPage: number
  ) => void;
}

export const NoData = () => {
  const { t } = useTranslation(['common']);

  return (
    <div className={classes.empty}>
      <EmptyIcon />
      <div className="text-center text-2xl font-semibold text-[#5A5B5E]">
        {t('no_data')}
      </div>
    </div>
  );
};

const CommonTable = <T extends object>({
  columns,
  dataSource,
  onClickRow,
  onChangePagination,
  pagination,
  ...props
}: Props<T> & TableProps<T>) => {
  const handleChangePagination = (page: number) => {
    !!pagination && onChangePagination?.(pagination as TablePagination, page);
  };

  const CustomFooterPagination = (props: PaginationProps) => {
    return <Pagination {...props} />;
  };

  return (
    <div>
      <Table
        bordered={true}
        dataSource={dataSource}
        columns={columns.map((column) => ({
          ...column,
        }))}
        scroll={{ x: 'fit-content' }}
        {...props}
        pagination={false}
        locale={{
          emptyText: () => <NoData />,
        }}
        onRow={(record) => {
          return {
            onClick: (event) => {
              event.preventDefault();
              onClickRow?.(record);
            }, // click row
          };
        }}
        className={clsx(classes.table, props.className)}
      />
      {!dataSource?.length || !pagination ? (
        <></>
      ) : (
        <CustomFooterPagination
          showSizeChanger={false}
          current={pagination.current}
          total={pagination.total}
          pageSize={pagination.pageSize}
          onChange={handleChangePagination}
          className={clsx(classes.pagination, 'mr-4 mt-4 flex justify-end')}
        />
      )}
    </div>
  );
};

export default CommonTable;

import { Pagination, PaginationProps } from 'antd';

// import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
interface IProps extends PaginationProps {}

const CustomFooterPagination = (props: IProps) => {
  return (
    <div>
      <Pagination {...props} />
    </div>
  );
};

export { CustomFooterPagination };

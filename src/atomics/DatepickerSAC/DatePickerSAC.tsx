import { DatePicker } from 'antd';
import { DatePickerProps } from 'antd/lib';

const DatePickerSAC = ({ ...rest }: DatePickerProps) => {
  return <DatePicker {...rest} />;
};

export default DatePickerSAC;

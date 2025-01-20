import { DatePicker } from 'antd';
import locale from 'antd/es/date-picker/locale/ko_KR';
import { DatePickerProps } from 'antd/lib';
import 'dayjs/locale/ko';

const DatePickerSAC = ({ ...rest }: DatePickerProps) => {
  return <DatePicker {...rest} locale={locale} />;
};

export default DatePickerSAC;

import { DATE_FORMAT } from '@/constants';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'; // Import the 'utc' plugin
dayjs.locale('en');
dayjs.extend(utc);

export function formatDate(
  date?: string | undefined,
  dateFormat = DATE_FORMAT.DEFAULT
) {
  if (!date) return;
  if (dayjs(date).isValid()) {
    return dayjs(date).format(dateFormat);
  }
  return date;
}

export function formatDateUTC(
  date?: string | undefined,
  dateFormat = DATE_FORMAT.DEFAULT
) {
  if (!date) return;
  if (dayjs(date).isValid()) {
    return dayjs(date).utc().format(dateFormat);
  }
  return date;
}

export function hasNoUpdatesFor60Days(
  dateReceipt?: string | number,
  isCompletion = false
) {
  if (!dateReceipt || isCompletion) return false;
  const receiptDate = dayjs(dateReceipt);
  const currentDate = dayjs();
  const isExpired = receiptDate.add(60, 'day').isBefore(currentDate);

  return isExpired;
}

export function isContractPastNotificationDate(
  noticeDate?: string | number,
  isCompletion?: boolean
) {
  if (!noticeDate || isCompletion) return false;

  const currentDate = dayjs();
  const notificationDate = dayjs(noticeDate);

  return currentDate.diff(notificationDate, 'day') >= 6;
}

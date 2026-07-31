import dayjs from 'dayjs';
export const dateHelper = {
  format: (date, formatStr = 'YYYY-MM-DD') => dayjs(date).format(formatStr),
};
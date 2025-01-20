export const transformNumber = (number: string) => {
  const cleanedNumber = number.replace(/\D/g, '');

  switch (cleanedNumber.length) {
    case 9:
      return cleanedNumber.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3');
    case 10:
      return cleanedNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    case 11:
      return cleanedNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    default:
      return cleanedNumber;
  }
};

export const transformBusinessNumber = (number: number | string) => {
  if (!number) return '';
  const cleanedNumber = number.toString().replace(/\D/g, '');

  switch (cleanedNumber.length) {
    case 10:
      return cleanedNumber.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3');
    default:
      return cleanedNumber;
  }
};

export function formatCurrency(value: number): string {
  // const formatter = new Intl.NumberFormat('ko-KR', {
  //   style: 'currency',
  //   currency: 'KRW',
  //   minimumFractionDigits: decimalPlaces,
  //   maximumFractionDigits: 4,
  // });

  // return formatter.format(value);
  return new Intl.NumberFormat('ko-KR').format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('ko-KR').format(value);
}

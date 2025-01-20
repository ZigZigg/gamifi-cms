import { formatCurrency } from '@/utils/number';

interface IProps {
  value: number | string | undefined;
}

const Amount = ({ value }: IProps) => {
  if (value !== 0 && !value) return <div></div>;
  return <div>{formatCurrency(+value)}</div>;
};

export default Amount;

import clsx from 'clsx';

interface IProps {
  children?: React.ReactNode;
  className?: string;
}
const BoxFilter = ({ children, ...props }: IProps) => {
  return (
    <div className={clsx('rounded-lg bg-white p-8', props?.className)}>
      {children}
    </div>
  );
};

export default BoxFilter;

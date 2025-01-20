import { Button, ButtonProps } from 'antd';
import classes from './CommonButton.module.scss';
import clsx from 'clsx';

interface IProps extends ButtonProps {
  ctype: 'default' | 'primary' | 'outline';
  status?: 'default' | 'disabled';
  fontStyle?: 'light' | 'bold';
  text: string;
  loading?: boolean;
  csize?: 'lg' | 'md' | 'sm';
  isCustom?: boolean;
  disableCustomColor?: boolean;
}

const CommonButton = (props: IProps) => {
  const {
    text,
    ctype = 'primary',
    csize = 'md',
    loading,
    className,
    fontStyle = 'bold',
  } = props;

  const customClass = clsx(
    className,
    classes.button,
    classes[`button__${csize}`],
    classes[`button__${ctype}`],
    classes[`button__${fontStyle}`]
  );
  return (
    <Button {...props} className={customClass} loading={loading} type="primary">
      <div className={classes.content}>
        <span>{text}</span>
      </div>
    </Button>
  );
};

export default CommonButton;

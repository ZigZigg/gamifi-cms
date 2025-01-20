import React from 'react';
import { Select, SelectProps } from 'antd';
import clsx from 'clsx';

const { Option } = Select;

export interface OptionType {
  value: string | number;
  label: string;
}

interface SelectSACProps extends SelectProps<string> {
  options: OptionType[];
  onChange?: (value: string | number) => void;
}

const SelectSAC: React.FC<SelectSACProps> = ({
  options,
  onChange,
  ...restProps
}) => {
  const handleSelectChange = (value: string) => {
    onChange?.(value);
  };

  return (
    <Select
      {...restProps}
      className={clsx(restProps?.className)}
      onChange={handleSelectChange}
    >
      {options.map((option) => (
        <Option key={option.value} value={option.value}>
          {option.label}
        </Option>
      ))}
    </Select>
  );
};

export default SelectSAC;

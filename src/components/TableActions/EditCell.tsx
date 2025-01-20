import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Form, FormInstance } from 'antd';
import { formatDate } from '@/utils/date';
import { DATE_FORMAT } from '@/constants';
import { useUpdateProgressListMutation } from '@/stores/api/progress';
import { IconType } from 'antd/es/notification/interface';
import NotificationContext from '@/providers/NotificationContext';
import { get } from 'lodash';
import { useNotice } from '@/providers/NoticeProvider';
import { useTranslation } from 'react-i18next';
import { TYPE_DATA } from '@/types/progress';
type TypeEditale = 'date' | 'checkbox' | 'select' | 'input' | 'autocomplete';
type TypeParentField =
  | 'fields'
  | 'testiDocument'
  | 'checkData'
  | 'followUp'
  | '';
interface EditableCellProps {
  value: any;
  form: FormInstance;
  field: string;
  record: any;
  recordId?: number;
  children?: React.ReactNode;
  maxLength?: number; // input
  minLength?: number; // input
  onChange?: () => void; // input
  suffix?: React.ReactNode; // input
  options?: any; // select
  type?: TypeEditale;
  parentField?: TypeParentField;
  keyword?: string; //
  typeAutocomplete?: TYPE_DATA;
}

const withEditableCell = (WrappedComponent: React.ComponentType<any>) => {
  const EditableCell: React.FC<EditableCellProps> = ({
    value,
    form,
    field,
    children,
    record,
    type = 'input',
    parentField = 'fields',
    ...rest
  }) => {
    const fieldName = `${field}-${record.id}`;
    const { api } = useContext(NotificationContext);

    const [editing, setEditing] = useState(false);
    const { openModal, closeModal } = useNotice();
    const { t } = useTranslation(['progress', 'common']);

    const onNotification = (
      description: string,
      type: IconType = 'success'
    ) => {
      api!.open({
        message: '',
        description,
        duration: 2,
        closeIcon: false,
        type: type,
      });
    };

    const [updateProgressList, { isError, error, isSuccess }] =
      useUpdateProgressListMutation();

    const handleCellDoubleClick = (event: any) => {
      form.setFieldValue(fieldName, value);
      setEditing(true);
      event.preventDefault();
      event.stopPropagation();
    };

    useEffect(() => {
      if (isError) {
        onNotification(
          get(error, 'message') || get(error, 'data.message') || '',
          'error'
        );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error, isError]);

    useEffect(() => {
      if (isSuccess) {
        setEditing(false);
      }
    }, [isSuccess]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const transformFieldValue = (fieldName: any) => {
      const value = form.getFieldValue(fieldName);
      let fieldValue = value;
      switch (type) {
        case 'input':
          fieldValue =
            typeof fieldValue === 'string' ? fieldValue.trim() : fieldValue;
          break;
        case 'date':
          fieldValue = fieldValue
            ? formatDate(fieldValue, DATE_FORMAT.YMD)
            : null;
          break;
        case 'checkbox':
          fieldValue = value?.target?.checked;
          break;
        case 'autocomplete':
          fieldValue = value || null;
          break;
        default:
          break;
      }
      return fieldValue;
    };

    const save = async () => {
      try {
        if (field === 'completion') return;
        await form.validateFields();
        const val = transformFieldValue(fieldName);
        if (
          type === 'autocomplete' &&
          field === 'sale' &&
          val === record?.sale_data?.name
        ) {
          setEditing(false);
          return;
        }

        if (
          type === 'autocomplete' &&
          field === 'manager' &&
          val === record?.manager_data?.name
        ) {
          setEditing(false);
          return;
        }

        if (val === value) {
          setEditing(false);
          return;
        }

        const payload = parentField
          ? {
              id: record.id,
              [parentField]: {
                [field]: val,
              },
            }
          : { id: record.id, [field]: val };
        updateProgressList(payload);
      } catch (error) {
        console.log('Save error:', error);
      }
    };

    const handleCompleteContract = (checked: boolean) => {
      form.setFieldValue(fieldName, checked);
      openModal({
        description: checked ? t('check_complete') : t('uncheck_complete'),
        width: 482,
        onOk: () => {
          updateProgressList({
            id: record.id,
            [parentField]: {
              [field]: checked,
            },
          });
          closeModal();
        },
        onCancel: () => {
          closeModal();
        },
      });
    };

    const handleClick = (event: any) => {
      if (type === 'checkbox') {
        event.stopPropagation();
        const checked = event?.target?.checked;

        if (field === 'completion') {
          handleCompleteContract(checked);
        }
      }
    };

    const renderFormComponent = useMemo(() => {
      if (editing) {
        return (
          <Form.Item name={fieldName} initialValue={value} className="m-0">
            <WrappedComponent
              onBlur={save}
              autoFocus
              {...rest}
              onClick={(event: any) => {
                handleClick(event);
              }}
            />
          </Form.Item>
        );
      } else {
        return (
          <div onDoubleClick={(event) => handleCellDoubleClick(event)}>
            {children ? children : value}
          </div>
        );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fieldName, save, rest, children, value]);

    return <>{renderFormComponent}</>;
  };

  EditableCell.displayName = `withEditableCell(${getDisplayName(
    WrappedComponent
  )})`;

  return EditableCell;
};

// Helper function to get the display name of a component
const getDisplayName = (WrappedComponent: React.ComponentType<any>) => {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};

export default withEditableCell;

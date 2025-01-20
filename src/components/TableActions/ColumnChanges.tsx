import SelectSAC from '@/atomics/Select/SelectSAC';
import { ChangesType } from '@/types/progress';
import { getChangesValue } from '@/utils/helpers';
import { Form } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface IProps {
  form: any;
  value: ChangesType;
  record: any;
  field: string;
}
const ColumnChanges = ({ ...props }: IProps) => {
  const { value, form, field, record } = props;
  const fieldName = `${field}-${record.id}`;

  const { t } = useTranslation(['progress', 'common']);
  const [editChanges, setEditChanges] = useState(false);
  const [showModalNote, setShowModalNote] = useState(false);


  const changesOpts = useMemo(
    () => [
      {
        label: t('changes.yes'),
        value: ChangesType.YES,
      },
      {
        label: t('changes.no'),
        value: ChangesType.NO,
      },
    ],
    [t]
  );



  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChange = (value: any) => {
    form.setFieldValue(fieldName, value);
    if (value === ChangesType.YES) {
      setShowModalNote(true);
    } else {}
  };

  const renderNote = useMemo(
    () => (
      <>
        <Form.Item name={fieldName} initialValue={value} className="m-0">
          <SelectSAC options={changesOpts} onChange={handleChange} />
        </Form.Item>
      </>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [changesOpts, fieldName, handleChange, record?.id, showModalNote, value]
  );
  return (
    <>
      <div>
        {editChanges ? (
          <>{renderNote}</>
        ) : (
          <div
            onDoubleClick={() => {
              form.setFieldValue(fieldName, value);
              setEditChanges(!editChanges);
            }}
          >
            {getChangesValue(value as ChangesType)}
          </div>
        )}
      </div>
    </>
  );
};

export default ColumnChanges;

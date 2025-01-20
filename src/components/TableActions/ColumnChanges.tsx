import SelectSAC from '@/atomics/Select/SelectSAC';
import { ChangesType } from '@/types/progress';
import { getChangesValue } from '@/utils/helpers';
import { Form } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ModalNote from './ModalNote';
import { useUpdateProgressListMutation } from '@/stores/api/progress';

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

  const [updateProgressList, { isSuccess }] = useUpdateProgressListMutation();

  const handleCloseModalNote = () => {
    setShowModalNote(false);
  };

  const handleSaveChanges = useCallback(async (value: ChangesType) => {
    try {
      const payload = {
        id: record.id,
        fields: {
          [field]: value,
        },
      };
      updateProgressList(payload);
    } catch (error) {
      console.log('Save error:', error);
    }
  }, []);

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

  useEffect(() => {
    if (isSuccess) {
      setEditChanges(false);
    }
  }, [isSuccess]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChange = (value: any) => {
    form.setFieldValue(fieldName, value);
    if (value === ChangesType.YES) {
      setShowModalNote(true);
    } else {
      handleSaveChanges(ChangesType.NO);
    }
  };

  const handleCloseChanges = (total: number) => {
    handleSaveChanges(total > 0 ? ChangesType.YES : ChangesType.NO);
  };

  const renderNote = useMemo(
    () => (
      <>
        <Form.Item name={fieldName} initialValue={value} className="m-0">
          <SelectSAC options={changesOpts} onChange={handleChange} />
        </Form.Item>
        <ModalNote
          open={showModalNote}
          handleClose={handleCloseModalNote}
          contractId={record?.id}
          notePopup={false}
          externalContractId={record?.external_contract_id}
          handleCloseChanges={(total: number) => handleCloseChanges(total)}
        />
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

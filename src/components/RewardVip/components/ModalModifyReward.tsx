import { useNotice } from '@/providers/NoticeProvider';
import { useEffect, useMemo } from 'react'
import { Form, Input } from 'antd';
import ModalSAC from '@/atomics/ModalSAC/ModalSAC';
import { useAppSelector } from '@/stores';
import SelectSAC from '@/atomics/Select/SelectSAC';
import { removeEmpty, trimValues } from '@/utils/helpers';
import { useAddNewRewardVipMutation, useEditRewardVipMutation } from '@/stores/api/rewardVip';
import { IRewardVip } from '@/types/rewardVip';
interface IProps {
    open: boolean;
    rewardEdit?: IRewardVip;
    resetRewardEdit?: () => void
    handleClose?: () => void;
}
const initialValues = {
    phoneNumber: '',
    rewardId: 0,
}
const ModalModifyRewardVip = (props: IProps) => {
    const { handleClose, rewardEdit, resetRewardEdit} = props
    const { closeModal } = useNotice();
    const [form] = Form.useForm();
    const { listReward } = useAppSelector((state) => state.common);
    const [addNewReward, {isSuccess}] = useAddNewRewardVipMutation()
    const [editReward, {isSuccess: isSuccessEdit}] = useEditRewardVipMutation()
    const handleSubmit = async () => {
        try {
            form.submit();
            await form.validateFields();
            const values = form.getFieldsValue();
      
            const payload = {
                ...values,
                rewardId: +values?.rewardId,
            };
            const currentPayload = removeEmpty(trimValues(payload));
            if(rewardEdit){
                editReward({id: rewardEdit.id, ...currentPayload})
            }else{
                addNewReward(currentPayload)
            }
          } catch (error) {
            console.log('error', error);
          }
    };
    const onCancelAdd = () => {
        form.resetFields();
        resetRewardEdit?.();
        handleClose?.();
        closeModal();
    };

    useEffect(() => {
        if (isSuccess || isSuccessEdit) {
          form.resetFields();
          handleClose?.();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [isSuccess, isSuccessEdit]);

    const rewardTypeOpt = useMemo(() => {
        if (!listReward?.length) return [];
        const currentRewards = listReward.map((item) => {
            const currentLablel = `${item?.id} - ${item?.turnType?.name} - Giá trị: ${item?.value} - ${item?.type}`;
            return {
                value: item?.id,
                label: currentLablel,
            };
        });
        return currentRewards;
    }, [listReward]);

    useEffect(() => {
        form.setFieldsValue(initialValues);
    }, [form]);
    useEffect(() => {
        if(rewardEdit){
            const formValues = {
                phoneNumber:  rewardEdit.phone_number,
                rewardId: rewardEdit.reward.id,
            }
            form.setFieldsValue(formValues);
        }
    },[rewardEdit])
    return (
        <ModalSAC
            {...props}
            title={'Chỉnh sửa quà VIP'}
            onConfirm={handleSubmit}
            onCancel={onCancelAdd}
        >
            <Form
                form={form}
                layout="vertical"
                name="modify-reward-vip"
                autoComplete="off"
                initialValues={initialValues}
            >
                <div className="grid grid-cols-2 gap-x-6">
                    <Form.Item label={'Quà được ấn định'} name="rewardId">
                        <SelectSAC options={rewardTypeOpt || []} />
                    </Form.Item>
                    <Form.Item label={'Số điện thoại'} name="phoneNumber">
                        <Input maxLength={100} />
                    </Form.Item>
                </div>
            </Form>
        </ModalSAC>
    )
}

export default ModalModifyRewardVip
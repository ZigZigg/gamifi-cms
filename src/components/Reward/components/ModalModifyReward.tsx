import { useNotice } from '@/providers/NoticeProvider';
import { useEffect, useMemo } from 'react'
import { Form, Input } from 'antd';
import ModalSAC from '@/atomics/ModalSAC/ModalSAC';
import { useAppSelector } from '@/stores';
import SelectSAC from '@/atomics/Select/SelectSAC';
import { trimValues, validateAndSanitizeValue } from '@/utils/helpers';
import { REGEX } from '@/constants';
import { useAddNewRewardMutation, useEditRewardMutation } from '@/stores/api/rewards';
import { IReward } from '@/types/reward';
interface IProps {
    open: boolean;
    rewardEdit?: IReward;
    resetRewardEdit?: () => void
    handleClose?: () => void;
}
const initialValues = {
    turnTypeId: 1,
    type: 'FREE',
    value: '',
    quantity: 0,
    holdQuantity: 0,
    winningRate: 0,
    campaignId: 0,
}
const ModalModifyReward = (props: IProps) => {
    const { handleClose, rewardEdit, resetRewardEdit} = props
    const { closeModal } = useNotice();
    const [form] = Form.useForm();
    const { masterData, activeCampaign } = useAppSelector((state) => state.common);
    const [addNewReward, {isSuccess}] = useAddNewRewardMutation();
    const [editReward, {isSuccess: isSuccessEdit}] = useEditRewardMutation();
    const handleSubmit = async () => {
        try {
            form.submit();
            await form.validateFields();
            const values = form.getFieldsValue();
      
            const payload = {
                ...values,
                quantity: +values?.quantity,
                holdQuantity: +values?.holdQuantity,
                winningRate: +values?.winningRate,
                turnType: values?.turnTypeId,
                campaign: activeCampaign?.id,
            };
            const currentPayload = trimValues(payload);
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
        // openModal({
        //     description: 'Bạn có chắc chắn muốn hủy bỏ không?',
        //     onOk: () => {
        //         form.resetFields();
        //         resetRewardEdit?.();
        //         handleClose?.();
        //         closeModal();
        //     },
        //     onCancel: () => {
        //         closeModal();
        //     },
        // });
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
        if (!masterData?.length) return [];
        const currentIndustries = masterData.map((item) => {
            return {
                value: item?.id,
                label: item?.name,
            };
        });
        return currentIndustries;
    }, [masterData]);
    const rewardTurnTypeOpt = useMemo(() => {
        return [
            {
                value: 'FREE',
                label: 'Miễn phí',
            },
            {
                value: 'PAID',
                label: 'Trả phí',
            }
        ]
    }, []);
    useEffect(() => {
        form.setFieldsValue(initialValues);
    }, [form]);
    useEffect(() => {
        if(rewardEdit){
            const formValues = {
                turnTypeId: rewardEdit.turnTypeId,
                type: rewardEdit.type,
                value: rewardEdit.value,
                quantity: rewardEdit.quantity,
                holdQuantity: rewardEdit.hold_quantity,
                winningRate: rewardEdit.winning_rate,
                campaignId: 0,
            }
            form.setFieldsValue(formValues);
        }
    },[rewardEdit])
    return (
        <ModalSAC
            {...props}
            title={'Thêm mới phần quà'}
            onConfirm={handleSubmit}
            onCancel={onCancelAdd}
        >
            <Form
                form={form}
                layout="vertical"
                name="modify-reward"
                autoComplete="off"
                initialValues={initialValues}
            >
                <div className="grid grid-cols-2 gap-x-6">
                    <Form.Item label={'Loại quà'} name="turnTypeId">
                        <SelectSAC options={rewardTypeOpt || []} />
                    </Form.Item>
                    <Form.Item label={'Giá trị quà'} name="value">
                        <Input maxLength={100} />
                    </Form.Item>
                    <Form.Item label={'Số lượng'} name="quantity">
                        <Input
                            maxLength={100}
                            onChange={() => {
                                form &&
                                    validateAndSanitizeValue(
                                        form,
                                        'quantity',
                                        REGEX.PHONENUMBER_TEST,
                                        REGEX.PHONENUMBER_SANITIZED
                                    );
                            }}
                        />
                    </Form.Item>
                    <Form.Item label={'Số lượng hold'} name="holdQuantity">
                        <Input
                            maxLength={100}
                            onChange={() => {
                                form &&
                                    validateAndSanitizeValue(
                                        form,
                                        'holdQuantity',
                                        REGEX.PHONENUMBER_TEST,
                                        REGEX.PHONENUMBER_SANITIZED
                                    );
                            }}
                        />
                    </Form.Item>
                    <Form.Item label={'Tỉ lệ ra quà (%)'} name="winningRate">
                        <Input
                            maxLength={100}
                            onChange={() => {
                                form &&
                                    validateAndSanitizeValue(
                                        form,
                                        'winningRate',
                                        REGEX.RATE_TEST,
                                        REGEX.RATE_SANITIZED
                                    );
                            }}
                        />
                    </Form.Item>
                    <Form.Item label={'Loại lượt chơi'} name="type">
                        <SelectSAC options={rewardTurnTypeOpt || []} />
                    </Form.Item>
                </div>
            </Form>
        </ModalSAC>
    )
}

export default ModalModifyReward
import BoxFilter from '@/atomics/BoxFilter/BoxFilter'
import DatePickerSAC from '@/atomics/DatepickerSAC/DatePickerSAC';
import SelectSAC from '@/atomics/Select/SelectSAC'
import { DATE_FORMAT } from '@/constants';
import { Button, Form, Input } from 'antd'
import React, { useContext, useEffect, useMemo } from 'react'
import classes from './Campaign.module.scss'
import { useAppSelector } from '@/stores';
import dayjs from 'dayjs';
import EditIcon from '@/atomics/SvgIcons/EditIcon';
import UploadIcon from '@/atomics/SvgIcons/UploadIcon';
import CommonService from '@/services/common.service';
import { IconType } from 'antd/es/notification/interface';
import NotificationContext from '@/providers/NotificationContext';


const initialValues = {
    name: '',
    startDate: '',
    endDate: '',
    startDateHold: '',
    endDateHold: '',
    status: 'ACTIVE'
}

const Campaign = () => {
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = React.useState(false);
    const { activeCampaign } = useAppSelector((state) => state.common);
    const endDateValue = Form.useWatch('endDate', form);
    const startDateValue = Form.useWatch('startDate', form);
    const endDateHoldValue = Form.useWatch('endDateHold', form);
    const startDateHoldValue = Form.useWatch('startDateHold', form);
    const { api } = useContext(NotificationContext);

    const onNotification = (description: string, type: IconType = 'error') => {
        api!.open({
            message: '',
            description,
            duration: 2,
            closeIcon: false,
            type: type,
        });
    };
    const handleSubmit = async () => {
        if (!activeCampaign?.id) return
        try {
            form.submit();
            await form.validateFields();
            const values = form.getFieldsValue();

            const payload = {
                ...values,
                id: activeCampaign?.id,
                startDate: dayjs(values.startDate).format(),
                endDate: dayjs(values.endDate).format(),
                startDateHold: dayjs(values.startDateHold).format(),
                endDateHold: dayjs(values.endDateHold).format(),
            }
            console.log("🚀 ~ handleSubmit ~ payload:", payload)
            const result = await CommonService.updateCampaign(payload);
            if (result.code === 200) {
                onNotification('Cập nhật chương trình thành công', 'success')
                setIsEditing(false)
            } else {
                onNotification('Có lỗi xảy ra', 'error')

            }
        } catch (error) {
            console.log('error', error);
            onNotification('Có lỗi xảy ra', 'error')

        }
    };

    const statusOpt = useMemo(() => {
        return [
            {
                value: 'ACTIVE',
                label: 'Kích hoạt',
            },
            {
                value: 'INACTIVE',
                label: 'Không kích hoạt',
            }
        ]
    }, []);

    const actionButtons = () => {
        if (isEditing) {
            return <>
                <Button
                    size='middle'
                    type='primary'
                    onClick={() => {
                        handleSubmit()
                    }}
                    className="max-w-fit flex items-center gap-2 flex-row"
                >
                    <span>Lưu chỉnh sửa</span>
                    <UploadIcon />
                </Button>
                <Button
                    size='middle'
                    type='default'
                    onClick={() => {
                        setIsEditing(false)
                    }}
                    className="max-w-fit flex items-center gap-2 flex-row"
                >
                    <span>Hủy chỉnh sửa</span>
                </Button>
            </>
        }
        return <>
            <Button
                size='middle'
                type='default'
                onClick={() => {
                    setIsEditing(true)
                }}
                className="max-w-fit flex items-center gap-2 flex-row"
            >
                <span>Sửa</span>
                <EditIcon />
            </Button>
        </>
    }

    const handleStartDateChange = (selectedDate: any) => {
        if (endDateValue && selectedDate) {
            const endDate = dayjs(endDateValue);
            const startDate = dayjs(selectedDate);

            if (endDate.isBefore(startDate, 'day')) {
                form.setFieldsValue({ endDate: null });
            }
        }
    }

    const handleEndDateChange = (selectedDate: any) => {
        if (startDateValue && selectedDate) {
            const startDate = dayjs(startDateValue);
            const endDate = dayjs(selectedDate);

            if (endDate.isBefore(startDate, 'day')) {
                form.setFieldsValue({ endDate: null });
            }
        }
    }

    const handleEndDateChangeHold = (selectedDate: any) => {
        if (startDateHoldValue && selectedDate) {
            const startDateHold = dayjs(startDateHoldValue);
            const endDateHold = dayjs(selectedDate);

            if (endDateHold.isBefore(startDateHold, 'day')) {
                form.setFieldsValue({ endDateHold: null });
            }
        }
    }

    const handleStartDateChangeHold = (selectedDate: any) => {
        if (endDateHoldValue && selectedDate) {
            const endDateHold = dayjs(endDateHoldValue);
            const startDateHold = dayjs(selectedDate);

            if (endDateHold.isBefore(startDateHold, 'day')) {
                form.setFieldsValue({ endDateHold: null });
            }
        }
    }
    const formatPayloadCampaign = (activeCampaign: any) => {
        return {
            ...activeCampaign,
            startDate: activeCampaign.startDate ? dayjs(activeCampaign.startDate) : '',
            endDate: activeCampaign.endDate ? dayjs(activeCampaign.endDate) : '',
            startDateHold: activeCampaign.startDateHold ? dayjs(activeCampaign.startDateHold) : '',
            endDateHold: activeCampaign.endDateHold ? dayjs(activeCampaign.endDateHold) : '',
        }
    }
    useEffect(() => {
        if (activeCampaign) {
            const campaign = formatPayloadCampaign(activeCampaign);
            form.setFieldsValue(campaign);
        }
    }, [activeCampaign])

    return (
        <BoxFilter className="px-8 py-8 mb-4">
            <div className='flex items-center flex-row gap-4'>
                <h1 style={{ margin: 0 }} className={classes.header}>Thông tin chung</h1>
                {actionButtons()}
            </div>

            <Form
                form={form}
                layout="vertical"
                name="campaign-form"
                autoComplete="off"
                initialValues={initialValues}
            >
                <div className='grid grid-cols-2 gap-x-6'>
                    <Form.Item label='Tên chương trình' name="name">
                        <Input maxLength={100} style={{ width: 518 }} disabled={!isEditing} />
                    </Form.Item>
                    <Form.Item label={'Trạng thái'} name="status">
                        <SelectSAC options={statusOpt || []} style={{ width: 518 }} disabled={true} />
                    </Form.Item>
                    <div className="flex flex-col">
                        <span className="ml-[2px] mr-2">Thời gian diễn ra:</span>
                        <div className="flex items-center gap-[6px]">
                            <Form.Item name="startDate" className="m-0" rules={[
                                { required: true, message: 'Vui lòng nhâp ngày bắt đầu' },
                            ]}>
                                <DatePickerSAC
                                    format={DATE_FORMAT.DATE_DMY_Hm}
                                    size="large"
                                    style={{ width: 250 }}
                                    placeholder=""
                                    showTime
                                    disabled={!isEditing}
                                    onChange={handleStartDateChange}

                                />
                            </Form.Item>
                            <span>-</span>
                            <Form.Item name="endDate" className="m-0" rules={[
                                { required: true, message: 'Vui lòng nhâp ngày kết thúc' },
                            ]}>
                                <DatePickerSAC
                                    format={DATE_FORMAT.DATE_DMY_Hm}
                                    size="large"
                                    style={{ width: 250 }}
                                    placeholder=""
                                    showTime
                                    disabled={!isEditing}
                                    onChange={handleEndDateChange}
                                />
                            </Form.Item>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="ml-[2px] mr-2">Thời gian hold quà:</span>
                        <div className="flex items-center gap-[6px]">
                            <Form.Item name="startDateHold" className="m-0" rules={[
                                { required: true, message: 'Vui lòng nhâp ngày bắt đầu' },
                            ]}>
                                <DatePickerSAC
                                    format={DATE_FORMAT.DATE_DMY_Hm}
                                    size="large"
                                    style={{ width: 250 }}
                                    placeholder=""
                                    showTime
                                    disabled={!isEditing}
                                    onChange={handleStartDateChangeHold}
                                />
                            </Form.Item>
                            <span>-</span>
                            <Form.Item name="endDateHold" className="m-0" rules={[
                                { required: true, message: 'Vui lòng nhâp ngày kết thúc' },
                            ]}>
                                <DatePickerSAC
                                    format={DATE_FORMAT.DATE_DMY_Hm}
                                    size="large"
                                    style={{ width: 250 }}
                                    placeholder=""
                                    showTime
                                    disabled={!isEditing}
                                    onChange={handleEndDateChangeHold}
                                />
                            </Form.Item>
                        </div>
                    </div>
                </div>
            </Form>

        </BoxFilter>
    )
}

export default Campaign
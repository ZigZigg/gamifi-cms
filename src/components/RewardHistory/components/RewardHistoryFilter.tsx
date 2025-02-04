import BoxFilter from '@/atomics/BoxFilter/BoxFilter'
import DatePickerSAC from '@/atomics/DatepickerSAC/DatePickerSAC';
import SelectSAC from '@/atomics/Select/SelectSAC'
import { DATE_FORMAT } from '@/constants';
import { Button, Form, Input } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import classes from './RewardHistoryFilter.module.scss'
import { useAppSelector } from '@/stores';
import dayjs from 'dayjs';
import { FormInstance } from 'antd/lib';

interface Props {
    onSearch?: (values: any) => void;
    form: FormInstance;
    initFormFilter?: any;
}

const initialValues = {
    phoneNumber: '',
    fullName: '',
    rewardType: '',
    startDate: '',
    endDate: '',
}

const RewardHistoryFilter = (props: Props) => {
    const { onSearch, initFormFilter, form } = props
    const { masterData } = useAppSelector((state) => state.common);
    const [initValues, setInitValues] = useState(initialValues);
    const endDateValue = Form.useWatch('endDate', form);
    const startDateValue = Form.useWatch('startDate', form);
    const rewardTypeOpt = useMemo(() => {
        if (!masterData?.length) return [];
        const currentData = masterData.map((item) => {
            return {
                value: item?.id,
                label: item?.name,
            };
        });
        return currentData;
    }, [masterData]);
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
    const handleFinish = (values: any) => {
        const payload = values;
        if (payload.startDate) {
            payload.startDate = dayjs(payload.startDate)
                .format(DATE_FORMAT.DATE_DMY_Hms);
        }
        if (payload.endDate) {
            payload.endDate = dayjs(payload.endDate)
                .format(DATE_FORMAT.DATE_DMY_Hms);
        }

        setInitValues((prev) => ({
            ...prev,
            payload,
        }));

        onSearch?.(payload);
    };
    useEffect(() => {
        let tmp = { ...initFormFilter, rewardType: Number(initFormFilter.rewardType) };
        if (tmp.filter) tmp = { ...tmp, ...tmp.filter };
        if (tmp.startDate) {
            tmp.startDate = dayjs(tmp.startDate);
        }
        if (tmp.endDate) {
            tmp.endDate = dayjs(tmp.endDate);
        }

        form.setFieldsValue({ ...tmp });
    }, [form, initFormFilter]);
    return (
        <BoxFilter className="px-8 py-8 mb-4">
            <div className='flex items-center flex-row gap-4'>
                <h1 className={classes.header}>Tìm kiếm</h1>
            </div>

            <Form
                form={form}
                layout="vertical"
                name="search-history-form"
                autoComplete="off"
                initialValues={initValues}
                onFinish={handleFinish}
            >
                <div className='grid grid-cols-2 gap-x-6'>
                    <Form.Item label='Số điện thoại' name="phoneNumber">
                        <Input maxLength={100} style={{ width: 518 }} />
                    </Form.Item>
                    <Form.Item label='Họ và tên' name="fullName">
                        <Input maxLength={200} style={{ width: 518 }} />
                    </Form.Item>
                    <Form.Item label={'Loại quà'} name="rewardType">
                        <SelectSAC options={rewardTypeOpt || []} style={{ width: 518 }} />
                    </Form.Item>
                    <div className="flex flex-col">
                        <span className="ml-[2px] mr-2">Thời gian nhận quà:</span>
                        <div className="flex items-center gap-[6px]">
                            <Form.Item name="startDate" className="m-0">
                                <DatePickerSAC
                                    format={DATE_FORMAT.DATE_DMY_Hm}
                                    size="large"
                                    style={{ width: 250 }}
                                    placeholder=""
                                    showTime
                                    onChange={handleStartDateChange}

                                />
                            </Form.Item>
                            <span>-</span>
                            <Form.Item name="endDate" className="m-0">
                                <DatePickerSAC
                                    format={DATE_FORMAT.DATE_DMY_Hm}
                                    size="large"
                                    style={{ width: 250 }}
                                    placeholder=""
                                    showTime
                                    onChange={handleEndDateChange}
                                />
                            </Form.Item>
                        </div>
                    </div>

                </div>
                <div className="flex justify-start gap-3 ">
                    <Button
                        htmlType="submit"
                        size="middle"
                        type="primary"
                        onClick={() => form.submit()}
                        className="font-semibold"
                    >
                        Tìm kiếm
                    </Button>
                </div>
            </Form>

        </BoxFilter>
    )
}

export default RewardHistoryFilter
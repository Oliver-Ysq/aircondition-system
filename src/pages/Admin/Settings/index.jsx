import React from "react";
import { Form, Input, Button, Select } from "antd";
import instance from "../../../axios";
import { SetParams } from "../../../axios/interface";
import Qs from "qs";
import { AccountStore } from "../../../store/store";
import { renderResult } from "../../../helper/util";
import { observer } from "mobx-react";
const Settings = observer(() => {
    const [form] = Form.useForm();

    const handlSubmmit = async (values) => {
        console.log(values);
        const res = await instance.post(
            SetParams,
            Qs.stringify({
                env_temp: parseFloat(values.temp),
                sp_mode: parseInt(values.speed),
                work_mode: parseInt(values.mode),
                cold_sup: parseFloat(values.coldMax),
                cold_sub: parseFloat(values.coldMin),
                hot_sup: parseFloat(values.hotMax),
                hot_sub: parseFloat(values.hotMin),
                fee: parseFloat(values.cost),
                max_run: parseInt(values.serve),
            })
        );
        console.log(res);
    };

    const onSpeedChange = (e) => {
        form.setFieldsValue({
            speed: e,
        });
    };
    const onModeChange = (e) => {
        form.setFieldsValue({
            mode: e,
        });
    };

    return AccountStore.hasLogin ? (
        <>
            <Form
                style={{ marginTop: "5vh" }}
                labelCol={{ span: 5, offset: 3 }}
                wrapperCol={{ span: 7, offset: 1 }}
                layout="horizontal"
                initialValues={{ size: "large", speed: "0", mode: "0" }}
                onFinish={handlSubmmit}
                form={form}
            >
                <Form.Item label="默认温度" name="temp">
                    <Input />
                </Form.Item>
                <Form.Item label="默认风速" name="speed">
                    <Select onChange={onSpeedChange}>
                        <Select.Option value="0">低速</Select.Option>
                        <Select.Option value="1">中速</Select.Option>
                        <Select.Option value="2">高速</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="默认模式" name="mode">
                    <Select onChange={onModeChange}>
                        <Select.Option value="0">制冷</Select.Option>
                        <Select.Option value="1">制热</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="制冷最高温度" name="coldMax">
                    <Input />
                </Form.Item>
                <Form.Item label="制冷最低温度" name="coldMin">
                    <Input />
                </Form.Item>
                <Form.Item label="制热最高温度" name="hotMax">
                    <Input />
                </Form.Item>
                <Form.Item label="制热最低温度" name="hotMin">
                    <Input />
                </Form.Item>
                <Form.Item label="设置默认费率" name="cost">
                    <Input />
                </Form.Item>
                <Form.Item label="设置最大同时服务房间数" name="serve">
                    <Input />
                </Form.Item>
                <Form.Item label="提交修改">
                    <Button type="primary" htmlType="submit">
                        {" "}
                        Submit{" "}
                    </Button>
                </Form.Item>
            </Form>
        </>
    ) : (
        renderResult()
    );
});
export default Settings;

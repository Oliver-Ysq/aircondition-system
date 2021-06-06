import React from "react";
import { Form, Input, Button, Result, notification } from "antd";
import "./style.css";
import Qs from "qs";
import instance from "../../../axios";
import { CheckIn } from "../../../axios/interface";
import { AccountStore } from "../../../store/store";
import { withRouter } from "react-router";
import { renderResult } from "../../../helper/util";

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};
const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16,
    },
};
const Checkin = (props) => {
    const onFinish = async (values) => {
        console.log("Success:", values);
        try {
            const res = await instance.post(
                CheckIn,
                Qs.stringify({
                    c_name: values.username,
                    phone_num: values.phonenumber,
                    r_id: values.roomid,
                })
            );
            console.log(res);
            if (res.data.code == 1) {
                notification.success({
                    message: "入住成功",
                    description: "跳转至入住详情",
                });
                setTimeout(() => {
                    props.history.push("/front-end-check-info");
                }, 500);
            } else if (res.data.code == 0) {
                notification.error({
                    message: "入住失败",
                    description: res.code.message,
                });
            }
        } catch (err) {
            console.log(err);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
        window.alert("输入失败，请重试");
    };

    const renderForm = () => (
        <Form
            {...layout}
            name="basic"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            className="pc-checkin"
        >
            <Form.Item
                label="用户姓名"
                name="username"
                rules={[
                    {
                        required: true,
                        message: "请输入用户名！",
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="用户手机号"
                name="phonenumber"
                rules={[
                    {
                        required: true,
                        message: "请输入手机号！",
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="用户房间号"
                name="roomid"
                rules={[
                    {
                        required: true,
                        message: "请输入房间号！",
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                    提交入住
                </Button>
            </Form.Item>
        </Form>
    );

    return AccountStore.hasLogin ? renderForm() : renderResult();
};
export default withRouter(Checkin);

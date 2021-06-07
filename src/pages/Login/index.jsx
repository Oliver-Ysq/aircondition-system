import React from "react";
import { AccountStore } from "../../store/store";
import { Form, Input, Button, Result, Modal } from "antd";
import "./style.css";
import instance from "../../axios";
import { SysLogin } from "../../axios/interface";
import { reset } from "../../helper/util";
import Qs from "qs";
import { CHARACTOR_ENUM } from "../../helper/const";
import { observer } from "mobx-react";
import { withRouter } from "react-router";

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

const Login = observer((props) => {
    const onFinish = async (values) => {
        console.log("Success:", values);
        const res = await instance.post(
            SysLogin,
            Qs.stringify({
                email: values.username,
                password: values.phonenumber,
                "Sign In": "Sign In",
            })
        );
        console.log(res);
        if (
            res.data.code == 1 &&
            AccountStore.charactor === CHARACTOR_ENUM.ADMINISTRATOR
        ) {
            AccountStore.setLogin(true); // 登陆成功
            setTimeout(() => {
                props.history.push("/administrator-default-settings");
            }, 500);
        } else if (
            res.data.code == 0 &&
            AccountStore.charactor === CHARACTOR_ENUM.FRONTEND
        ) {
            AccountStore.setLogin(true); // 登陆成功
            setTimeout(() => {
                props.history.push("/front-end-checkin");
            }, 500);
        } else if (
            res.data.code == 2 &&
            AccountStore.charactor === CHARACTOR_ENUM.HOTELMANAGER
        ) {
            AccountStore.setLogin(true); // 登陆成功
            setTimeout(() => {
                props.history.push("/hotel-manager-get-daily-report");
            }, 500);
        } else {
            Modal.error({
                title: "登陆失败",
                content: "error: 请检查账号信息后重新登陆!",
            });
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
        window.alert("输入失败，请重试");
    };

    const renderResult = () => (
        <Result
            style={{ marginTop: 24 }}
            status="success"
            subTitle="登陆成功"
            title="welcome!"
            extra={[
                <Button type="primary" key="console" onClick={reset}>
                    Quit
                </Button>,
            ]}
        />
    );

    const renderForm = () => (
        <Form
            {...layout}
            name="basic"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            className="pc-login"
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
                label="密码"
                name="phonenumber"
                rules={[
                    {
                        required: true,
                        message: "请输入密码！",
                    },
                ]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item {...tailLayout}>
                <Button
                    type="primary"
                    htmlType="submit"
                    style={{ marginRight: 12 }}
                >
                    提交
                </Button>
                <Button type="primary" htmlType="button" onClick={reset}>
                    重置身份
                </Button>
            </Form.Item>
        </Form>
    );
    return AccountStore.hasLogin ? renderResult() : renderForm();
});
export default withRouter(Login);

import React, { useEffect } from "react";
import { Form, Input, Button, Result, Modal } from "antd";
import "./style.css";
import instance from "../../../axios";
import { Verify, DefaultParams } from "../../../axios/interface";
import Qs from "qs";
import { UserStore } from "../../../store/store";
import { withRouter } from "react-router";
import { observer } from "mobx-react";
import { reset } from "../../../helper/util";

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

const Check = observer((props) => {
    useEffect(() => {
        // 初始化默认值
        instance.get(DefaultParams).then((res) => {
            const {
                cold_sub,
                cold_sup,
                goal_temp,
                hot_sub,
                hot_sup,
                sp_mode,
                work_mode,
            } = res.data.data;
            UserStore.setMode(work_mode);
            UserStore.setTarget(goal_temp);
            UserStore.setSpeed(sp_mode);
            UserStore.setRange(cold_sub, cold_sup, hot_sub, hot_sup);
        });
    }, []);

    const onFinish = (values) => {
        console.log("Success:", values);
        instance
            .post(
                Verify,
                Qs.stringify({
                    room_id: parseInt(values.roomId),
                    phone_num: parseInt(values.phoneNum),
                })
            )
            .then((res) => {
                if (res.data.code == 200) {
                    // AccountStore.setLogin(true);
                    UserStore.setRoomId(parseInt(values.roomId));
                    UserStore.setPhoneNum(parseInt(values.phoneNum));
                    UserStore.setTemp(res.data.data.env_temp);
                    setTimeout(() => {
                        props.history.push("/user-controller");
                    }, 500);
                } else {
                    Modal.error({
                        title: "This is a error message",
                        content: `信息错误，请重试`,
                    });
                }
            });
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
        window.alert("输入失败，请重试");
    };

    const renderResult = () => (
        <Result
            style={{ marginTop: 24 }}
            status="success"
            subTitle="进入房间成功"
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
                label="房间号"
                name="roomId"
                rules={[
                    {
                        required: true,
                        message: "请输入房间号!",
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="手机号"
                name="phoneNum"
                rules={[
                    {
                        required: true,
                        message: "请输入手机号!",
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

    return UserStore.roomId ? renderResult() : renderForm();
});
export default withRouter(Check);

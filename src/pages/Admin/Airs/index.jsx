import { useEffect, useState } from "react";
import instance from "../../../axios";
import { CheckInfo } from "../../../axios/interface";
import { Table, Button, Form, Input, Menu } from "antd";
import Qs from "qs";
import { AccountStore, AdminStore } from "../../../store/store";
import { observer } from "mobx-react";
import "./style.css";
import { renderResult } from "../../../helper/util";

let checkInterval = null;

const Airs = observer(() => {
    const [fresh, setFresh] = useState(0);
    const [current, setCurrent] = useState("single");
    const [roomId, setRoomId] = useState(0);

    useEffect(() => {
        checkInterval = setInterval(() => {
            instance.post(CheckInfo, Qs.stringify({})).then((res) => {
                const list = JSON.parse(res.data.all_data);
                AdminStore.setAirList(
                    list.map((v, idx) => {
                        v.fields.key = idx;
                        v.fields.roomid = v.pk;
                        v.fields.is_on = String(v.fields.is_on);
                        return v.fields;
                    }),
                    () => {
                        setFresh(fresh + 1);
                    }
                );
            });
        }, 3000);
        return () => {
            clearInterval(checkInterval);
        };
    }, []);
    const [form] = Form.useForm();

    const columns = [
        {
            title: "房间号",
            dataIndex: "roomid",
            key: "roomid",
        },
        {
            title: "空调状态（开/关）",
            dataIndex: "is_on",
            key: "is_on",
        },
        {
            title: "目标温度",
            dataIndex: "goal_temp",
            key: "goal_temp",
        },
        {
            title: "当前温度",
            dataIndex: "curr_temp",
            key: "curr_temp",
        },
        {
            title: "空调风速",
            dataIndex: "sp_mode",
            key: "sp_mode",
        },
        {
            title: "空调模式",
            dataIndex: "work_mode",
            key: "work_mode",
        },
        {
            title: "当前花费",
            dataIndex: "total_cost",
            key: "total_cost",
        },
    ];
    const onFinish = (values) => {
        console.log("Finish:", values);
    };
    const handleCheckRoom = (values) => {
        console.log(values);
        setRoomId(values.roomid);
    };
    const handleChangeTab = (e) => {
        setCurrent(e.key);
    };

    const renderForm = () => (
        <>
            <Form
                form={form}
                name="horizontal_login"
                layout="inline"
                onFinish={handleCheckRoom}
                className="form"
            >
                <Form.Item
                    name="roomid"
                    rules={[
                        {
                            required: true,
                            message: "请输入查询的房间号!",
                        },
                    ]}
                >
                    <Input placeholder="RoomId" />
                </Form.Item>
                <Form.Item shouldUpdate>
                    <Button type="primary" htmlType="submit">
                        查找
                    </Button>
                </Form.Item>
            </Form>
            {!!roomId && (
                <Table
                    pagination={false}
                    style={{ margin: 12 }}
                    columns={columns}
                    dataSource={AdminStore.airList.filter((v) => {
                        return v.roomid === roomId;
                    })}
                />
            )}
        </>
    );

    return AccountStore.hasLogin ? (
        <>
            <Menu
                onClick={handleChangeTab}
                selectedKeys={[current]}
                mode="horizontal"
            >
                <Menu.Item key="single">查询单个房间</Menu.Item>
                <Menu.Item key="all">房间情况总览</Menu.Item>
            </Menu>
            {current === "single" ? (
                renderForm()
            ) : (
                <Table
                    style={{ margin: 12 }}
                    columns={columns}
                    dataSource={AdminStore.airList}
                />
            )}
        </>
    ) : (
        renderResult()
    );
});
export default Airs;

import React, { useEffect, useState } from "react";
import { Table, Button, Drawer, Descriptions } from "antd";
import "./style.css";
import { AccountStore, FrontEndStore } from "../../../store/store";
import instance from "../../../axios";
import { CheckOut, NowCustomers } from "../../../axios/interface";
import Qs from "qs";
import { observer } from "mobx-react";
import { getDate, renderResult } from "../../../helper/util";
const CheckInfo = observer(() => {
    const [fresh, setFresh] = useState(0);
    const [visible, setVisible] = useState(false);
    const [bill, setBill] = useState({});

    useEffect(() => {
        flush();
    }, [fresh]);

    const flush = () => {
        instance.post(NowCustomers, Qs.stringify({})).then((res) => {
            let list = res.data.cust_list.map((item, idx) => {
                item.fields.key = idx;
                item.fields.CheckinDate = getDate(item.fields.CheckinDate);
                return item.fields;
            });
            console.log(list);
            FrontEndStore.setCustomerList(list);
        });
    };

    const checkout = async (record) => {
        console.log(record);
        const res = await instance.get(CheckOut, {
            params: {
                room_id: record.RoomId,
                phone_num: record.PhoneNum,
                checkin_date: record.CheckinDate,
            },
        });
        console.log(res.data);
        setBill(res.data.bill);
        setFresh(fresh + 1);
        setVisible(true);
    };

    const columns = [
        {
            title: "房间号",
            dataIndex: "RoomId",
            key: "RoomId",
        },
        {
            title: "用户姓名",
            dataIndex: "Name",
            key: "Name",
        },
        {
            title: "手机号",
            dataIndex: "PhoneNum",
            key: "PhoneNum",
        },
        {
            title: "入住时间",
            dataIndex: "CheckinDate",
            key: "CheckinDate",
        },
        {
            title: "操作",
            key: "action",
            render: (text, record) => (
                <Button type="primary" onClick={() => checkout(record)}>
                    {" "}
                    退房{" "}
                </Button>
            ),
        },
    ];
    const renderForm = () => (
        <>
            <Table
                columns={columns}
                dataSource={FrontEndStore.customerList}
                className="table"
                pagination={false}
            />
            <Button
                type="primary"
                shape="circle"
                size="large"
                style={{ float: "right", margin: 12 }}
                onClick={flush}
            >
                <span style={{ fontSize: 12 }}>刷新</span>
            </Button>
            <Drawer
                title="详单"
                placement={"bottom"}
                onClose={() => setVisible(false)}
                closable
                visible={visible}
                key={"bottom"}
            >
                <div className="left">
                    <Descriptions
                        bordered
                        title="消费账单"
                        size={"middle"}
                        column={1}
                    >
                        <Descriptions.Item label="房间号">
                            {bill.room_id}
                        </Descriptions.Item>
                        <Descriptions.Item label="手机号">
                            {bill.phone_num}
                        </Descriptions.Item>
                        <Descriptions.Item label="入住时间">
                            {bill.checkin_date && getDate(bill.checkin_date)}
                        </Descriptions.Item>
                        <Descriptions.Item label="退房时间">
                            {bill.checkout_date && getDate(bill.checkout_date)}
                        </Descriptions.Item>
                        <Descriptions.Item label="空调使用总时间">
                            {bill.total_use}
                        </Descriptions.Item>
                        <Descriptions.Item label="总消费金额">
                            {bill.total_cost}
                        </Descriptions.Item>
                    </Descriptions>
                </div>
                <div className="right"></div>
            </Drawer>
        </>
    );
    return AccountStore.hasLogin ? renderForm() : renderResult();
});
export default CheckInfo;

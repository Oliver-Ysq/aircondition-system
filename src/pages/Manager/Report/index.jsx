import React, { useRef, useState } from "react";
import { DatePicker, Button, Radio, Table } from "antd";
import "./style.css";
import { openDownloadDialog, renderResult, reportDateFormat, sheet2blob } from "../../../helper/util";
import { AccountStore, ManagerStore } from "../../../store/store";
import instance from "../../../axios";
import { GetReport } from "../../../axios/interface";
import Qs from "qs";
import { observer } from "mobx-react";
const XLSX = require("xlsx");
const columns = [
    {
        title: "房间号",
        dataIndex: "room_id",
        key: "room_id",
    },
    {
        title: "使用次数",
        dataIndex: "oc_count",
        key: "oc_count",
    },
    {
        title: "最常使用温度",
        dataIndex: "common_temp",
        key: "common_temp",
    },
    {
        title: "最常使用风速",
        dataIndex: "common_spd",
        key: "common_spd",
    },
    {
        title: "达到目标温度次数",
        dataIndex: "achieve_count",
        key: "achieve_count",
    },
    {
        title: "被调度次数",
        dataIndex: "schedule_count",
        key: "schedule_count",
    },
    {
        title: "详单次数",
        dataIndex: "ticket_count",
        key: "ticket_count",
    },
    {
        title: "消费总数",
        dataIndex: "total_cost",
        key: "total_cost",
        render: (text) => <>{parseFloat(text).toFixed(1)}</>,
    },
];

const Report = observer(() => {
    const [mode, setMode] = useState("y");
    const dateFrom = useRef("");

    const onChange = (e) => {
        dateFrom.current = reportDateFormat("mm/dd/YYYY", e._d);
    };
    const onModeChange = (e) => {
        setMode(e.target.value);
    };
    const CheckForm = async () => {
        const res = await instance.post(
            GetReport,
            Qs.stringify({
                date_from: dateFrom.current,
                r_type: mode,
            })
        );
        let list = JSON.parse(res.data.data);
        list = list.map((v, idx) => {
            v.fields.key = idx;
            return v.fields;
        });
        ManagerStore.setFormList(list);
    };

    const exportForm = async () => {
        await CheckForm();
        var aoa = [
            [
                "房间号",
                "使用次数",
                "最常使用温度",
                "最常使用风速",
                "达到目标温度次数",
                "被调度次数",
                "详单次数",
                "消费总数",
            ],
        ];
        ManagerStore.formList.forEach((e) =>
            aoa.push([
                e.room_id,
                e.oc_count,
                e.common_temp,
                e.common_spd,
                e.achieve_count,
                e.schedule_count,
                e.ticket_count,
                parseFloat(e.total_cost).toFixed(1),
            ])
        );
        console.log(aoa);
        var sheet = XLSX.utils.aoa_to_sheet(aoa);
        openDownloadDialog(sheet2blob(sheet), "报表.xlsx");
    };
    return AccountStore.hasLogin ? (
        <>
            {" "}
            <div className="top">
                <div style={{ marginBottom: 16, fontWeight: "bold" }}>
                    <span style={{ marginRight: 16 }}>选择起始时间：</span>
                    <DatePicker onChange={onChange} />
                </div>

                <div>
                    <div style={{ marginBottom: 16, fontWeight: "bold" }}>
                        <span style={{ marginRight: 16 }}>选择时间范围：</span>
                        <Radio.Group onChange={onModeChange} value={mode}>
                            <Radio value={"y"}>年</Radio>
                            <Radio value={"m"}>月</Radio>
                            <Radio value={"w"}>周</Radio>
                            <Radio value={"d"}>日</Radio>
                        </Radio.Group>
                    </div>

                    <div>
                        <Button onClick={CheckForm} style={{ marginRight: 12 }}>
                            查看报表
                        </Button>
                        <Button onClick={exportForm}>导出报表</Button>
                    </div>
                </div>
            </div>
            <Table
                style={{ margin: 16 }}
                columns={columns}
                dataSource={ManagerStore.formList}
            />
        </>
    ) : (
        renderResult()
    );
});
export default Report;

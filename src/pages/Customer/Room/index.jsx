import "./style.css";
import { Button, Select, Switch, Descriptions, Modal } from "antd";
import { useCallback, useEffect } from "react";
import { UserStore } from "../../../store/store";
import instance from "../../../axios";
import {
    ChangeMode,
    ChangeSpeed,
    ChangeTarget,
    DefaultParams,
    OffRate,
    Pause,
    Poll,
    PowerOff,
    PowerOn,
    ReStart,
} from "../../../axios/interface";
import { observer } from "mobx-react";
import Qs from "qs";

const { Option } = Select;
const speedMap = { 0: "低", 1: "中", 2: "高" };
const modeMap = { 0: "制冷", 1: "制热" };
const isWorkMap = { 0: "等待调度中", 1: "送风中", 2: "待机中" };
const INTERVAL = 2000;
const MAX_TEMP = 30;
let pollingInterval = null;

const Room = observer(() => {
    const {
        mode,
        target,
        speed,
        temp,
        cost,
        power,
        roomId,
        phoneNum,
        isWork,
        range,
    } = UserStore;

    // 更新状态（打开时）
    const updateStateOn = useCallback(async () => {
        // 到达温度，停止送风
        const res = await instance.post(
            Poll,
            Qs.stringify({
                room_id: roomId,
                phone_num: phoneNum,
            })
        );
        if (res.data.code == 200) {
            const { is_work, curr_temp, total_cost } = res.data.data;
            UserStore.setCost(total_cost);
            UserStore.setTemp(curr_temp);
            UserStore.setIsWork(is_work);

            // 到达温度，停止送风
            if (curr_temp == UserStore.target && is_work == 1) {
                const res = await instance.post(
                    Pause,
                    Qs.stringify({
                        room_id: roomId,
                        phone_num: phoneNum,
                    })
                );
                if (res.data.code == 200) console.log("停止送风");
            }

            // 温度过高/低，重新送风
            if (Math.abs(curr_temp - UserStore.target) >= 1 && is_work == 2) {
                instance.post(
                    ReStart,
                    Qs.stringify({
                        room_id: roomId,
                        phone_num: phoneNum,
                        sp_mode: parseInt(speed),
                    })
                );
            }
        }
    }, [phoneNum, roomId, speed]);

    // 更新状态（关闭时）
    const updateStateOff = async () => {
        const res = await instance.post(
            OffRate,
            Qs.stringify({
                room_id: roomId,
                phone_num: phoneNum,
            })
        );
        if (res.data.code == 200) {
            UserStore.setTemp(res.data.data.curr_temp);
            if (res.data.data.curr_temp >= MAX_TEMP) {
                clearInterval(pollingInterval);
            }
        }
    };

    useEffect(() => {
        if (UserStore.roomId) {
            // 已登录
            if (power) {
                // 如果已经开了
                pollingInterval = setInterval(() => {
                    updateStateOn(); // 轮询
                }, INTERVAL);
            }
        } else {
            // 未登录，设定默认值并显示
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
        }
        return () => {
            clearInterval(pollingInterval);
        };
    }, [power, updateStateOn]);
    // 切换开关
    const handlePowerOn = async (e) => {
        if (!roomId) {
            window.alert("请先前往首页验证");
            return;
        }
        UserStore.setPower(e);
        if (e === true) {
            //打开开关
            const formdata = {
                room_id: parseInt(roomId),
                phone_num: parseInt(phoneNum),
                goal_temp: target,
                sp_mode: speed,
                work_mode: mode,
                curr_temp: temp,
            };
            let res = await instance.post(PowerOn, Qs.stringify(formdata));
            const { total_cost, is_work } = res.data.data;
            UserStore.setIsWork(is_work);
            UserStore.setCost(total_cost);

            if (temp == target) {
                const res = await instance.post(
                    Pause,
                    Qs.stringify({
                        room_id: roomId,
                        phone_num: phoneNum,
                    })
                );
                if (res.data.code == 200) console.log("停止送风");
            }

            clearInterval(pollingInterval);
            pollingInterval = setInterval(() => {
                updateStateOn();
            }, INTERVAL);
        } else {
            await instance.post(
                PowerOff,
                Qs.stringify({
                    room_id: roomId,
                    phone_num: phoneNum,
                })
            );
            console.log("关闭空调");
            UserStore.setIsWork(2);

            clearInterval(pollingInterval);
            pollingInterval = setInterval(() => {
                updateStateOff();
            }, INTERVAL);
        }
    };
    // 切换模式
    const handleChangeMode = async (e) => {
        if (e == 0) {
            if (target > range[0][1]) {
                // 超过制冷的最大度数
                Modal.warning({
                    title: "This is a warning message",
                    content: `制冷范围为：${range[0][0]}℃ ~ ${range[0][1]}℃，请降低温度后重试`,
                });
                return;
            }
            if (!power) {
                UserStore.setMode(0);
                return;
            }
            const res = await instance.post(
                ChangeMode,
                Qs.stringify({
                    room_id: roomId,
                    work_mode: 0,
                })
            );
            if (res.data.code == 200) {
                UserStore.setMode(0);
            }
        } else {
            if (target < range[1][0]) {
                // 小于制热的最小温度
                Modal.warning({
                    title: "This is a warning message",
                    content: `制冷范围为：${range[1][0]}℃ ~ ${range[1][1]}℃，请提高温度后重试`,
                });
                return;
            }
            if (!power) {
                UserStore.setMode(1);
                return;
            }
            const res = await instance.post(
                ChangeMode,
                Qs.stringify({
                    room_id: roomId,
                    work_mode: 1,
                })
            );
            if (res.data.code == 200) {
                UserStore.setMode(1);
            }
        }
    };
    // 切换风速
    const handleChangeSpeed = async (e) => {
        if (!power) {
            UserStore.setSpeed(e);
            return;
        }
        const res = await instance.post(
            ChangeSpeed,
            Qs.stringify({ room_id: roomId, phone_num: phoneNum, sp_mode: e })
        );
        if (res.data.code == 200) {
            console.log(res);
            UserStore.setSpeed(e);
        }
    };
    // 目标温度↑
    const handleTmpAdd = async () => {
        if (target >= range[mode][1]) {
            // 当前为制冷的最大度数
            Modal.warning({
                title: "This is a warning message",
                content: `${modeMap[mode]}范围为：${range[mode][0]}℃ ~ ${range[mode][1]}℃`,
            });
            return;
        }
        if (!power) {
            UserStore.setTarget(target + 1);
            return;
        }
        console.log("target:::", target);
        const res = await instance.post(
            ChangeTarget,
            Qs.stringify({
                room_id: roomId,
                goal_temp: target + 1,
            })
        );
        console.log(res.data);
        if (res.data.code == 200) {
            UserStore.setTarget(target + 1);
        }
    };
    // 目标温度↓
    const handleTmpMinus = async () => {
        if (target <= range[mode][0]) {
            // 当前为制冷的最大度数
            Modal.warning({
                title: "This is a warning message",
                content: `${modeMap[mode]}范围为：${range[mode][0]}℃ ~ ${range[mode][1]}℃`,
            });
            return;
        }
        if (!power) {
            UserStore.setTarget(target - 1);
            return;
        }
        const res = await instance.post(
            ChangeTarget,
            Qs.stringify({
                room_id: roomId,
                goal_temp: target - 1,
            })
        );
        if (res.data.code == 200) {
            console.log(res);
            UserStore.setTarget(target - 1);
        }
    };
    return (
        <div className="pc-room">
            <div className="room-id">
                <span style={{ marginRight: 12 }}>room id:</span>{" "}
                {!roomId ? "请前往首页验证" : roomId}
            </div>
            <div className="pc-room-left">
                <Descriptions
                    bordered
                    title="控制面板"
                    size="middle"
                    column={1}
                    className="des"
                >
                    <Descriptions.Item label="模式">
                        {modeMap[mode]}
                    </Descriptions.Item>
                    <Descriptions.Item label="目标温度">
                        {parseFloat(target).toFixed(2)}
                    </Descriptions.Item>
                    <Descriptions.Item label="风速">
                        {speedMap[speed]}
                    </Descriptions.Item>
                </Descriptions>

                <div style={{ height: 20 }}></div>

                <Descriptions
                    bordered
                    title="状态面板"
                    size="middle"
                    column={1}
                    className="des"
                >
                    <Descriptions.Item label="室内温度">
                        {parseFloat(temp).toFixed(2)}
                    </Descriptions.Item>
                    <Descriptions.Item label="费用">
                        {parseFloat(cost).toFixed(2)}
                    </Descriptions.Item>
                    <Descriptions.Item label="工作状态">
                        {isWorkMap[isWork]}
                    </Descriptions.Item>
                </Descriptions>
            </div>

            <div className="pc-room-right">
                <div className="wrapper">
                    <span>开关：</span>
                    <div className="wrapper-right">
                        <Switch
                            defaultChecked={false}
                            checked={power}
                            onChange={handlePowerOn}
                        />
                    </div>
                </div>
                <div className="wrapper">
                    <span>模式：</span>
                    <Select
                        className="wrapper-right"
                        value={modeMap[mode]}
                        onChange={handleChangeMode}
                    >
                        <Option value="1">制热</Option>
                        <Option value="0">制冷</Option>
                    </Select>
                </div>
                <div className="wrapper">
                    <span>风速：</span>
                    <Select
                        className="wrapper-right"
                        value={"" + speed}
                        onChange={handleChangeSpeed}
                    >
                        <Option value="0">低速</Option>
                        <Option value="1">中速</Option>
                        <Option value="2">高速</Option>
                    </Select>
                </div>
                <div className="wrapper">
                    <span>温度：</span>
                    <Button onClick={handleTmpAdd} size="middle" shape="circle">
                        ↑
                    </Button>
                    <Button
                        onClick={handleTmpMinus}
                        size="middle"
                        shape="circle"
                        style={{ marginLeft: 6 }}
                    >
                        ↓
                    </Button>
                </div>
            </div>
        </div>
    );
});
export default Room;

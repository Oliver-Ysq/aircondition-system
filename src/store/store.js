import { makeAutoObservable } from "mobx";

export const AccountStore = makeAutoObservable({
    charactor: "null",
    setCharactor(charactor) {
        this.charactor = charactor;
        window.localStorage["charactor"] = charactor;
    },
    get initCharactor() {
        this.charactor = window.localStorage["charactor"] || null;
        return this.charactor;
    },

    hasLogin: false,
    setLogin(flag) {
        this.hasLogin = flag;
    },

    refresh() {
        // 清空数据
        this.setCharactor(null);
        this.setLogin(false);
    },
});

export const UserStore = makeAutoObservable({
    refresh() {
        // 清空数据
        this.setRoomId(null);
        this.setPhoneNum(null);
        this.setRange([
            [0, 0],
            [0, 0],
        ]);
        this.setMode(0);
        this.setTarget(0);
        this.setSpeed(0);
        this.setTemp(0);
        this.setCost(0);
        this.setIsWork(2);
        this.setPower(false);
    },

    roomId: null,
    setRoomId(id) {
        this.roomId = id;
    },
    phoneNum: null,
    setPhoneNum(id) {
        this.phoneNum = id;
    },

    range: [
        [0, 0],
        [0, 0],
    ], // 温控范围
    setRange(a, b, c, d) {
        this.range = [
            [a, b],
            [c, d],
        ];
    },

    // 0 制冷 1制热
    mode: 0,
    setMode(flag) {
        this.mode = flag;
    },

    // 目标温度
    target: 0,
    setTarget(target) {
        this.target = target;
    },

    // 0 1 2 低中高
    speed: 0,
    setSpeed(speed) {
        this.speed = speed;
    },

    // 室内温度
    temp: 0,
    setTemp(temp) {
        this.temp = temp;
    },

    // 花费
    cost: 0,
    setCost(cost) {
        this.cost = cost;
    },

    // 0等待调度  1送风中  2待机中（关机）
    isWork: 2,
    setIsWork(flg) {
        this.isWork = flg;
    },

    // 空调开关
    power: false,
    setPower(power) {
        this.power = power;
    },
});

export const FrontEndStore = makeAutoObservable({
    customerList: [],
    setCustomerList(list) {
        this.customerList = list;
    },
});

export const AdminStore = makeAutoObservable({
    airList: [],
    setAirList(list, refresh) {
        this.airList = list;
        refresh();
    },
});

export const ManagerStore = makeAutoObservable({
    formList: [],
    setFormList(list) {
        this.formList = list;
    },
});

class MenuItem {
    constructor(title, aka) {
        this.title = title;
        this.aka = aka;
    }
}

export const homepageOptions = {
    user: [new MenuItem("房间面板", "user-controller")],
    frontEnd: [
        new MenuItem("入住办理", "front-end-checkin"),
        new MenuItem("入住详情", "front-end-check-info"),
    ],
    administrator: [
        new MenuItem("设定缺省值", "administrator-default-settings"),
        new MenuItem("房间操作", "administrator-get-room-info"),
    ],
    hotelManager: [new MenuItem("生成报表", "hotel-manager-get-daily-report")],
};

export const charactorMap = {
    user: "住户",
    administrator: "管理员",
    frontEnd: "前台",
    hotelManager: "酒店经理",
};

export const CHARACTOR_ENUM = {
    UNKNOWN: "null",
    USER: "user",
    ADMINISTRATOR: "administrator",
    FRONTEND: "frontEnd",
    HOTELMANAGER: "hotelManager",
};

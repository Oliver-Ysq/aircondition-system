class MenuItem {
    constructor(title, aka) {
        this.title = title;
        this.aka = aka;
    }
}

export const homepageOptions = {
    user: [
        new MenuItem("控制面板", "user-controller"),
        new MenuItem("房间状态", "user-room-state"),
    ],
    frontEnd: [
        new MenuItem("账号管理", "front-end-account-management"),
        new MenuItem("入住办理", "front-end-checkin"),
        new MenuItem("退房详单", "front-end-checkout-detail"),
    ],
    administrator: [
        new MenuItem("账号管理", "administrator-account-management"),
        new MenuItem("设定缺省值", "administrator-default-settings"),
        new MenuItem("查询房间数据", "administrator-get-room-info"),
    ],
    hotelManager: [
        new MenuItem("账号管理", "hotel-manager-account-management"),
        new MenuItem("生成日报表", "hotel-manager-get-daily-report"),
    ],
};

export const charactorMap = {
    user: "住户",
    administrator: "管理员",
    frontEnd: "前台",
    hotelManager: "酒店经理",
};

export const CHARACTOR_ENUM = {
    UNKNOWN: null,
    USER: "user",
    ADMINISTRATOR: "administrator",
    FRONTEND: "frontEnd",
    HOTELMANAGER: "hotelManager",
};

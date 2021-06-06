import { AccountStore, UserStore } from "../store/store";
import { Result } from "antd";
const XLSX = require("xlsx");

export const reset = () => {
    AccountStore.refresh();
    UserStore.refresh();
};

export const initUtils = () => {
    Date.prototype.pattern = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "H+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            S: this.getMilliseconds(), //毫秒
        };
        var week = {
            0: "\u65e5",
            1: "\u4e00",
            2: "\u4e8c",
            3: "\u4e09",
            4: "\u56db",
            5: "\u4e94",
            6: "\u516d",
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                (this.getFullYear() + "").substr(4 - RegExp.$1.length)
            );
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                (RegExp.$1.length > 1
                    ? RegExp.$1.length > 2
                        ? "\u661f\u671f"
                        : "\u5468"
                    : "") + week[this.getDay() + ""]
            );
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(
                    RegExp.$1,
                    RegExp.$1.length == 1
                        ? o[k]
                        : ("00" + o[k]).substr(("" + o[k]).length)
                );
            }
        }
        return fmt;
    };
};

export const getDate = (str) => {
    return new Date(str.replace("T", " ")).pattern("yyyy-MM-dd hh:mm:ss");
};

export const reportDateFormat = (fmt, date) => {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(), // 年
        "m+": (date.getMonth() + 1).toString(), // 月
        "d+": date.getDate().toString(), // 日
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(
                ret[1],
                ret[1].length == 1
                    ? opt[k]
                    : opt[k].padStart(ret[1].length, "0")
            );
        }
    }
    return fmt;
};

export const renderResult = () => (
    <Result
        style={{ marginTop: "10vh" }}
        status="warning"
        subTitle="请登录后查看"
        title="Warning!"
    ></Result>
);

export function sheet2blob(sheet, sheetName) {
    sheetName = sheetName || "sheet1";
    var workbook = {
        SheetNames: [sheetName],
        Sheets: {},
    };
    workbook.Sheets[sheetName] = sheet;
    // 生成excel的配置项
    var wopts = {
        bookType: "xlsx", // 要生成的文件类型
        bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
        type: "binary",
    };
    var wbout = XLSX.write(workbook, wopts);
    var blob = new Blob([s2ab(wbout)], {
        type: "application/octet-stream",
    });
    // 字符串转ArrayBuffer
    function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
        return buf;
    }
    return blob;
}
export function openDownloadDialog(url, saveName) {
    if (typeof url == "object" && url instanceof Blob) {
        url = URL.createObjectURL(url); // 创建blob地址
    }
    var aLink = document.createElement("a");
    aLink.href = url;
    aLink.download = saveName || ""; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
    var event;
    if (window.MouseEvent) event = new MouseEvent("click");
    else {
        event = document.createEvent("MouseEvents");
        event.initMouseEvent(
            "click",
            true,
            false,
            window,
            0,
            0,
            0,
            0,
            0,
            false,
            false,
            false,
            false,
            0,
            null
        );
    }
    aLink.dispatchEvent(event);
}

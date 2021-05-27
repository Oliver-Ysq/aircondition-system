import React from "react";
import "./style.css";
import { Button } from "antd";
import { AccountStore } from "../../store/store";
import { charactorMap, CHARACTOR_ENUM } from "../../helper/const";
const ChooseCharactor = () => {
    const handleButtonClick = (charactor) => {
        AccountStore.setCharactor(charactor);
        if (charactor === CHARACTOR_ENUM.USER) {
            AccountStore.setCharactor(true); //用户免登陆
        }
    };
    return (
        <div className="p-choose-charactor-layout">
            <div className="p-choose-charactor-layout-title">
                请选择你的身份
            </div>
            <div className="p-choose-charactor-layout-content">
                {Object.keys(charactorMap).map((v) => {
                    return (
                        <Button
                            shape="circle"
                            size="large"
                            onClick={() => handleButtonClick(v)}
                        >
                            {charactorMap[v]}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
};
export default ChooseCharactor;

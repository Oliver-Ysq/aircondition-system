import React from "react";
import "./style.css";
import { Button } from "antd";
import { AccountStore } from "../../store/store";
import { charactorMap } from "../../helper/const";
const ChooseCharactor = () => {
    const handleButtonClick = (charactor) => {
        AccountStore.setCharactor(charactor);
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
                            key={v}
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

import React from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import { homepageOptions } from "../../helper/const";

const { Sider } = Layout;
const MySider = (props) => {
    const { keyword, charactor } = props;
    return (
        <Sider trigger={null} collapsible={false}>
            <div className="c-layout-logo"> 空调管理系统 </div>
            <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={["welcome"]}
                selectedKeys={[keyword]}
            >
                <Menu.Item key="welcome">
                    <Link to="/">首页</Link>
                </Menu.Item>
                {homepageOptions[charactor].map((item) => {
                    return (
                        <Menu.Item key={item.aka}>
                            <Link to={"/" + item.aka}>{item.title}</Link>
                        </Menu.Item>
                    );
                })}
            </Menu>
        </Sider>
    );
};
export default MySider;

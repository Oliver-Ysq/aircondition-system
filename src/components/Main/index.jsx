import React from "react";
import { CHARACTOR_ENUM, homepageOptions } from "../../helper/const";
import { Layout } from "antd";
import { Switch, Route } from "react-router-dom";
import Checkin from "../../pages/Front/Checkin";
import CheckInfo from "../../pages/Front/CheckInfo";
import Login from "../../pages/Login";
import Check from "../../pages/Customer/Check";
import Room from "../../pages/Customer/Room";
import Airs from "../../pages/Admin/Airs";
import Settings from "../../pages/Admin/Settings";
import Report from "../../pages/Manager/Report";
const { Content } = Layout;
const pageMapping = {
    "user-controller": Room,

    "front-end-checkin": Checkin,
    "front-end-check-info": CheckInfo,

    "administrator-get-room-info": Airs,
    "administrator-default-settings": Settings,

    "hotel-manager-get-daily-report": Report,
};

const Main = (props) => {
    const { charactor } = props;
    console.log(homepageOptions, charactor);
    return (
        <Layout className="site-layout">
            <Content className="site-layout-background">
                <Switch>
                    {homepageOptions[charactor].map((item) => {
                        return (
                            <Route
                                path={`/${item.aka}`}
                                key={item.aka}
                                component={pageMapping[item.aka]}
                            >
                                {/* <div>{item.title}</div> */}
                            </Route>
                        );
                    })}
                    <Route path="/">
                        {charactor === CHARACTOR_ENUM.USER ? (
                            <Check />
                        ) : (
                            <Login />
                        )}
                    </Route>
                </Switch>
            </Content>
        </Layout>
    );
};

export default Main;

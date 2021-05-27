import React from "react";
import { homepageOptions } from "../../helper/const";
import { Layout } from "antd";
import { Switch, Route } from "react-router-dom";
const { Content } = Layout;

const Main = (props) => {
    const { charactor } = props;
    return (
        <Layout className="site-layout">
            <Content className="site-layout-background">
                <Switch>
                    {homepageOptions[charactor].map((item) => {
                        return (
                            <Route path={`/${item.aka}`} key={item.aka}>
                                <div>{item.title}</div>
                            </Route>
                        );
                    })}
                    <Route path="/">欢迎你！</Route>
                </Switch>
            </Content>
        </Layout>
    );
};

export default Main;

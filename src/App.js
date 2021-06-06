import "./App.css";
import React from "react";
import { Layout } from "antd";
import { withRouter } from "react-router-dom";
import { observer } from "mobx-react";
import MySider from "./components/MySider/index";
import Main from "./components/Main/index";
import ChooseCharactor from "./pages/ChooseCharactor/index";
import { AccountStore } from "./store/store";
import { CHARACTOR_ENUM } from "./helper/const";
import { initUtils } from "./helper/util";

const App = observer((props) => {
    const { initCharactor } = AccountStore;
    initUtils();
    const keyword =
        props.location.pathname === "/"
            ? "welcome"
            : props.location.pathname.slice(1);

    return (
        <>
            {initCharactor === CHARACTOR_ENUM.UNKNOWN ? (
                <ChooseCharactor />
            ) : (
                <Layout className="c-layout">
                    <MySider keyword={keyword} charactor={initCharactor} />
                    <Main charactor={initCharactor} />
                </Layout>
            )}
        </>
    );
});
export default withRouter(App);

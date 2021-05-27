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

const App = observer((props) => {
    const { charactor } = AccountStore;
    console.log(charactor);
    const keyword =
        props.location.pathname === "/"
            ? "welcome"
            : props.location.pathname.slice(1);

    return (
        <>
            {charactor === CHARACTOR_ENUM.UNKNOWN ? (
                <ChooseCharactor />
            ) : (
                <Layout className="c-layout">
                    <MySider keyword={keyword} charactor={charactor} />
                    <Main charactor={charactor} />
                </Layout>
            )}
        </>
    );
});
export default withRouter(App);

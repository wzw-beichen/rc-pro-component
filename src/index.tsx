import React from "react";
import ReactDOM from "react-dom";
import dayjs from "dayjs";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import App from "./App";
import styles from "./index.module.less";
import "dayjs/locale/zh-cn";

import "./index.less";
// import "./index.css";

dayjs.locale("en");

const Index = () => {
  const name: string = "Hello111!!!";

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: "3dad6a",
        },
      }}
    >
      <div className="app_main">
        <h1 className="app_main_name">{name}</h1>
        <h2 className={styles.app_main_text}>
          Welcome to your First React App..!!!!!!
        </h2>
        <App />
      </div>
    </ConfigProvider>
  );
};

ReactDOM.render(<Index />, document.getElementById("root"));

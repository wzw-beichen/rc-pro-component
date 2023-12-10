import React from "react";
import TrimmedInput from "@components/Input/TrimmedInput";
import { testA } from "@constants";
import { testTime } from "@constants/time";
import styles from "./index.module.less";

const App = () => {
  const name: string = "Hello App";
  return (
    <div>
      <TrimmedInput />
      {testA}
      {testTime}
      <h1 className="app_main_name">{name}</h1>
      <h2 className={styles.app_main_text}>Welcome to your App..!!!!!!</h2>
    </div>
  );
};

export default App;

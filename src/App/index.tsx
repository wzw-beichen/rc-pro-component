import React from "react";
import { testA } from "@constants";
import { testTime } from "@constants/time";
import BasicSelect from "@pages/Select";
import BasicDatePicker from "@pages/DatePicker";
import { TrimmedInput } from "@components/Input";
import { BasicCascader } from "@components/Cascader";
import { Button, Form } from "antd";
import styles from "./index.module.less";

const App = () => {
  const name: string = "Hello App";
  const [form] = Form.useForm();
  return (
    <div>
      <Form
        form={form}
        initialValues={{
          datepicker: ["2023-11-22", "2023-12-15"],
          cascader: "zhonghuamen",
        }}
      >
        <Form.Item name="input">
          <TrimmedInput />
        </Form.Item>
        <Form.Item name="select">
          <BasicSelect />
        </Form.Item>
        <Form.Item name="datepicker">
          <BasicDatePicker valueType="string" />
        </Form.Item>
        <Form.Item name="cascader">
          <BasicCascader valueType="string" />
        </Form.Item>
      </Form>
      <Button
        onClick={() => {
          const values = form.getFieldsValue();
          console.log("values", values);
        }}
      >
        获取
      </Button>
      {testA}
      {testTime}
      <h1 className="app_main_name">{name}</h1>
      <h2 className={styles.app_main_text}>Welcome to your App..!!!!!!</h2>
    </div>
  );
};

export default App;

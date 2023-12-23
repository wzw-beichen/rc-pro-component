import React, { useRef } from "react";
import { testA } from "@constants";
import { testTime } from "@constants/time";
import BasicSelect from "@pages/Select";
import BasicDatePicker from "@pages/DatePicker";
import { TrimmedInput } from "@components/Input";
import { BasicCascader } from "@components/Cascader";
import { RangeInputNumber } from "@components/InputNumber";
import { FormItemShouldUpdate } from "@components/Form";
import { ActionModal, ActionModalRef } from "@components/Modal";
import { Button, Form, Space } from "antd";
import styles from "./index.module.less";

const App = () => {
  const name: string = "Hello App";
  const [form] = Form.useForm();

  const ref = useRef<ActionModalRef>();
  return (
    <div>
      <Space>
        <ActionModal
          btn={
            <Button
              onClick={() => {
                console.log("点击了ActionModal11");
              }}
            >
              ActionModal1
            </Button>
          }
          titleBold
          modalProps={{
            title: "111",
          }}
        >
          <Button>ActionModal1</Button>
        </ActionModal>
        <ActionModal btn={"ActionModal22"} component={Button}>
          <Button>ActionModal22</Button>
        </ActionModal>
        <ActionModal>
          <Button>ActionModal33</Button>
        </ActionModal>
      </Space>
      <Form
        form={form}
        initialValues={{
          datepicker: ["2023-11-22", "2023-12-15"],
          cascader: "zhonghuamen",
          users: [{}, {}, {}],
        }}
      >
        <Form.Item name="input">
          <TrimmedInput />
        </Form.Item>
        <Form.Item name="inputWithSelect">
          <TrimmedInput.WithSelect
            fieldsProps={{
              defaultValue: 1,
              options: [1, 2, 3].map((item) => ({ label: item, value: item })),
            }}
          />
        </Form.Item>
        <Form.Item name="inputNumber">
          <RangeInputNumber />
        </Form.Item>
        <Form.Item name="select">
          <BasicSelect />
        </Form.Item>
        <Form.Item name="datePicker">
          <BasicDatePicker valueType="string" />
        </Form.Item>
        <Form.Item name="cascader">
          <BasicCascader valueType="string" />
        </Form.Item>
        <Form.List name="users">
          {(fields) =>
            fields.map((field) => (
              <React.Fragment key={field.key}>
                <Form.Item label={field.name} name={[field.name, "name"]}>
                  <TrimmedInput />
                </Form.Item>
                <Form.Item label={field.name} name={[field.name, "age"]}>
                  <TrimmedInput />
                </Form.Item>
              </React.Fragment>
            ))
          }
        </Form.List>
        <FormItemShouldUpdate
          relatedKey={["input", "inputNumber", ["users", 0, "name"]]}
        >
          {(changedValue: Record<string, any>) => {
            console.log("FormItemShouldUpdate", changedValue);
            return <TrimmedInput />;
          }}
        </FormItemShouldUpdate>
        {/* <Form.Item shouldUpdate>
          {(form) => {
            console.log("Form.Item", form);
            return <TrimmedInput />;
          }}
        </Form.Item> */}
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

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
import { Text } from "@components/Text";
import { Button, Form, Space } from "antd";
import styles from "./index.module.less";
import "./index.less";

const App = () => {
  const name: string = "Hello App";
  const [form] = Form.useForm();

  const ref = useRef<ActionModalRef>();
  return (
    <div>
      <div
        style={{ display: "flex", justifyContent: "center", marginBottom: 200 }}
      >
        <div style={{ width: "40%", background: "red" }}>2222</div>

        <Text.MiddleEllipsis commonStyle={{ background: "orange" }}>
          孩童时期的孩童时期孩童时期AAAAAAAA111111AA1png
        </Text.MiddleEllipsis>

        <div style={{ width: "24%", background: "blue" }}>3333</div>
      </div>

      {/* <div
        style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}
      >
        <div style={{ width: "40%", background: "red" }}>1111</div>
        <Text.Copy style={{ padding: "0 10px" }}>
          孩童时期的亚索经常把村里人对他的评价信以为真：好听的时候，他的出生是一次判断失误；不好听的时候，他是个永远无法挽回的过错。
          和大多数痛苦一样，这些话语也包含着些许真相。他的母亲原本是一位抚养着独生子的寡妇，而那个本应作为亚索父亲的人则如同金秋的微风般吹进了她的生活。随后他不等艾欧尼亚的寒冬降临到这个家庭，
        </Text.Copy>
        <div style={{ width: "24%", background: "blue" }}>1111</div>
      </div> */}

      <div
        style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}
      >
        <div style={{ width: "40%", background: "red" }}>1111</div>
        <Text.Copy style={{ padding: "0 10px" }} ellipsis={{ rows: 2 }}>
          孩童时期的亚索经常把村里人对他的评价信以为真：好听的时候，他的出生是一次判断失误；不好听的时候，他是个永远无法挽回的过错。
          和大多数痛苦一样，这些话语也包含着些许真相。他的母亲原本是一位抚养着独生子的寡妇，而那个本应作为亚索父亲的人则如同金秋的微风般吹进了她的生活。随后他不等艾欧尼亚的寒冬降临到这个家庭，
        </Text.Copy>
        <div style={{ width: "24%", background: "blue" }}>1111</div>
      </div>

      <div
        style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}
      >
        <div style={{ width: "40%", background: "red" }}>1111</div>
        <Text.Copy style={{ padding: "0 10px" }} ellipsis={{ rows: 2 }}>
          AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA111111
        </Text.Copy>
        <div style={{ width: "24%", background: "blue" }}>1111</div>
      </div>

      <Space>
        {/* <ActionModal
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
            width: 550,
          }}
        >
          <ActionModal
            btn={
              <Button
                onClick={() => {
                  console.log("点击了ActionModal11");
                }}
              >
                ActionModal22
              </Button>
            }
            titleBold
            dragable
            modalProps={{
              title: "111",
              width: 550,
              centered: true,
            }}
          >
            <ActionModal
              dragable
              btn={
                <Button
                  onClick={() => {
                    console.log("点击了ActionModal11");
                  }}
                >
                  ActionModal33
                </Button>
              }
            >
              <Button>ActionModal33</Button>
            </ActionModal>
          </ActionModal>
        </ActionModal> */}
        <ActionModal
          btn={"ActionModal22"}
          modalProps={{
            title: "111",
            width: 550,
            centered: true,
          }}
          dragable
          ref={ref}
          component={Button}
        >
          <Button
            onClick={() => {
              console.log("ref", ref.current);
            }}
          >
            ActionModal22
          </Button>
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

import React, { useEffect, useState } from "react";
import { Data } from "@components/Data";
import { Button, Card, Col, Input, Row, Space } from "antd";
import CloneTransmit from "@components/CloneTransmit";
import { TrimmedInput } from "@components/Input";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";

const ChildItem = (props: any) => {
  console.log("ChildItem", props);
  return <Input style={{ width: 300 }} {...props} />;
};

const TrimmedInputChildItem = (props: any) => {
  console.log("TrimmedInputChildItem", props);
  return <TrimmedInput style={{ width: 300 }} {...props} />;
};

const DataDemo = () => {
  const [toggle, setToggle] = useState(true);
  const [numToggle, setNumToggle] = useState(true);

  const [data] = Data.useData();
  // console.log("data", data.getFieldsValue(true));

  useEffect(() => {}, []);

  return (
    <>
      <Card title="切换：toggle">
        <CloneTransmit
          component={Row}
          commonProps={{ span: 24 }}
          componentProps={{
            gutter: [16, 16],
          }}
        >
          <Col>
            <Space size={12}>
              <Button
                type="primary"
                onClick={() => {
                  setToggle(!toggle);
                }}
              >
                切换toggle
              </Button>
              <Button
                type="primary"
                danger
                onClick={() => {
                  setNumToggle(!numToggle);
                }}
              >
                name切换toggle
              </Button>
            </Space>
          </Col>
        </CloneTransmit>
      </Card>
      {toggle && (
        <Data.DataProvider
          onDataChange={(...rest) => {
            console.log("onDataChange", rest);
          }}
        >
          <Data
            name="name1"
            data={data}
            initialValues={{
              name: "name",
              age: "age",
              AAAAAA: "AAAAAA",
              ASHOW: true,
              FFSHOW: true,
              // C: "CCCAAA",
            }}
            onValuesChange={(...rest) => {
              // console.log("onValuesChange", rest);
            }}
            preserve={false}
          >
            <CloneTransmit
              component={Row}
              commonProps={{ span: 24 }}
              componentProps={{
                style: {
                  margin: "20px 0",
                },
                gutter: [16, 16],
              }}
            >
              <Col>
                <Card title="List：Data.List">
                  <CloneTransmit
                    component={Row}
                    commonProps={{ span: 24 }}
                    componentProps={{
                      gutter: [16, 16],
                    }}
                  >
                    <Col>
                      <Space>
                        <Button
                          type="primary"
                          onClick={() => {
                            console.log("values", data.getFieldsValue());
                          }}
                        >
                          获取值
                        </Button>
                        <Button
                          type="primary"
                          danger
                          onClick={() => {
                            console.log(
                              "values",
                              data.getFieldValue(["List", 1])
                            );
                          }}
                        >
                          获取值
                        </Button>
                        <Button
                          type="dashed"
                          onClick={() => {
                            data.setFieldValue(["List", 1, "age"], "333");
                          }}
                        >
                          设置值
                        </Button>
                      </Space>
                    </Col>
                    <Col>
                      <Data.List
                        name="List"
                        initialValue={[{ age: "111" }, { age: "222" }]}
                      >
                        {(fields, { add, remove }) => {
                          return fields.map((field, index) => (
                            <Space size={8} style={{ marginBottom: 10 }}>
                              <Data.Item name={[field.name, "age"]}>
                                <TrimmedInputChildItem />
                              </Data.Item>
                              <Data.Item
                                name={[field.name, "name"]}
                                initialValue={"222"}
                              >
                                <TrimmedInputChildItem />
                              </Data.Item>
                              <PlusCircleOutlined
                                onClick={() =>
                                  add(
                                    { age: Math.ceil(Math.random() * 100) },
                                    0
                                  )
                                }
                              />
                              <MinusCircleOutlined
                                onClick={() => remove(index)}
                              />
                            </Space>
                          ));
                        }}
                      </Data.List>
                    </Col>
                  </CloneTransmit>
                </Card>
              </Col>
              {/* <Col>
                <Card title="获取值：getFieldValues">
                  <CloneTransmit.Item
                    component={Row}
                    commonProps={{ span: 24 }}
                    componentProps={{
                      gutter: [16, 16],
                    }}
                  >
                    <Col>
                      <Space size={12}>
                        <Button
                          type="primary"
                          onClick={() => {
                            console.log("values", data.getFieldsValue());
                          }}
                        >
                          获取带name的Field的store
                        </Button>
                        <Button
                          type="primary"
                          danger
                          onClick={() => {
                            console.log("values", data.getFieldsValue(true));
                          }}
                        >
                          获取全部store
                        </Button>
                        <Button
                          type="dashed"
                          onClick={() => {
                            const values = data.getFieldsValue(true, (meta) => {
                              // console.log("meta", meta);
                              return meta?.touched;
                            });
                            console.log("values", values);
                          }}
                        >
                          使用filterFunc取部分store
                        </Button>
                      </Space>
                    </Col>

                    <Col>
                      <Space size={12}>
                        <Button
                          type="primary"
                          onClick={() => {
                            data.setFieldValue("name", "王大陆");
                          }}
                        >
                          设置值setFieldValue
                        </Button>
                        <Button
                          danger
                          type="primary"
                          onClick={() => {
                            data.setFields([
                              {
                                name: "name",
                                value: "孙🉐️飙",
                              },
                              {
                                name: "num",
                                value: Math.random().toString(36).substring(4),
                              },
                            ]);
                          }}
                        >
                          设置值setFieldsValue
                        </Button>
                        <Button
                          type="dashed"
                          onClick={() => {
                            data.setFieldsValue({
                              name: "萧辰",
                              age: Math.round(Math.random() * 100),
                            });
                          }}
                        >
                          设置值setFields
                        </Button>
                      </Space>
                    </Col>

                    <Col>
                      <Data.Item
                        name={"name"}
                        getValueFromEvent={(e) => e.target.value}
                        initialValue={"name_111"}
                      >
                        <ChildItem data-key="name" />
                      </Data.Item>
                    </Col>
                    <Col>
                      <Data.Item
                        name={"age"}
                        getValueFromEvent={(e) => e.target.value}
                        initialValue={"age_222"}
                      >
                        <ChildItem data-key="age" />
                      </Data.Item>
                    </Col>
                    <Col>
                      {numToggle && (
                        <Data.Item
                          name={"num"}
                          getValueFromEvent={(e) => e.target.value}
                        >
                          <ChildItem data-key="num" />
                        </Data.Item>
                      )}
                    </Col>
                  </CloneTransmit.Item>
                </Card>
              </Col>
              <Col>
                <Card title="重置：resetFields">
                  <CloneTransmit.Item
                    component={Row}
                    commonProps={{ span: 24 }}
                    componentProps={{
                      gutter: [16, 16],
                    }}
                  >
                    <Col>
                      <Space size={12}>
                        <Button
                          type="primary"
                          onClick={() => {
                            data.setFieldValue("A", "AAAA");
                          }}
                        >
                          setFieldValue赋值A
                        </Button>
                        <Button
                          type="primary"
                          danger
                          onClick={() => {
                            data.setFieldsValue({
                              A: "A6A6A6",
                            });
                          }}
                        >
                          setFieldsValue赋值A
                        </Button>
                        <Button
                          type="dashed"
                          onClick={() => {
                            data.setFields([
                              {
                                name: "A",
                                value: "aaa",
                              },
                              {
                                name: "B",
                                value: "bbb",
                              },
                            ]);
                          }}
                        >
                          setField赋值A、B
                        </Button>
                      </Space>
                    </Col>
                    <Col>
                      <Space>
                        <Button
                          type="primary"
                          onClick={() => {
                            data.resetFields();
                          }}
                        >
                          重置全部Fields
                        </Button>
                        <Button
                          type="primary"
                          danger
                          onClick={() => {
                            data.resetFields(["A"]);
                          }}
                        >
                          重置A
                        </Button>
                        <Button
                          type="dashed"
                          onClick={() => {
                            data.resetFields(["A", "B"]);
                          }}
                        >
                          重置A、B
                        </Button>
                        <Button
                          type="dashed"
                          danger
                          onClick={() => {
                            data.resetFields(["A", "B", "C"]);
                          }}
                        >
                          重置A、B、C
                        </Button>
                      </Space>
                    </Col>
                    <Col>
                      <Data.Item
                        name="A"
                        getValueFromEvent={(e) => e.target.value}
                        initialValue={"11"}
                        // onMetaChange={(meta, oldMeta) => {
                        //   console.log("A____onMetaChange", meta, oldMeta);
                        // }}
                      >
                        <ChildItem />
                      </Data.Item>
                    </Col>
                    <Col>
                      <Data.Item
                        name="A"
                        initialValue={"11"}
                        getValueFromEvent={(e) => e.target.value}
                      >
                        <ChildItem />
                      </Data.Item>
                    </Col>
                    <Col>
                      <Data.Item
                        name="A"
                        initialValue={"11"}
                        getValueFromEvent={(e) => e.target.value}
                      >
                        <ChildItem />
                      </Data.Item>
                    </Col>
                    <Col>
                      <Data.Item
                        name="B"
                        getValueFromEvent={(e) => e.target.value}
                        onReset={() => {
                          console.log("reset____BBBBBB");
                        }}
                      >
                        <ChildItem />
                      </Data.Item>
                    </Col>
                    <Col>
                      <Data.Item
                        shouldUpdate={(prevValue, nextValue, info) => {
                          console.log(
                            "shouldUpdate",
                            prevValue,
                            nextValue,
                            info
                          );
                          return prevValue.A !== nextValue.A;
                        }}
                      >
                        <Data.Item
                          initialValue={"CCCBBB"}
                          name="C"
                          getValueFromEvent={(e) => e.target.value}
                        >
                          <ChildItem data-key="C" />
                        </Data.Item>
                      </Data.Item>
                    </Col>
                    <Col>
                      <Data.Item getValueFromEvent={(e) => e.target.value}>
                        <ChildItem data-key="D" />
                      </Data.Item>
                    </Col>
                  </CloneTransmit.Item>
                </Card>
              </Col>
              <Card title="依赖：dependencies">
                <CloneTransmit
                  component={Row}
                  commonProps={{ span: 24 }}
                  componentProps={{
                    gutter: [16, 16],
                  }}
                >
                  <Col>
                    AA {"---->"} BB {"---->"} CC {"---->"} DD
                  </Col>
                  <Col>AA {"---->"} FF</Col>
                  <Col>
                    <Space>
                      <Button
                        type="primary"
                        onClick={() => {
                          data.setFieldsValue({
                            ASHOW: !data.getFieldValue("ASHOW"),
                          });
                        }}
                      >
                        toggle A show hide
                      </Button>
                      <Button
                        type="primary"
                        danger
                        onClick={() => {
                          data.setFieldsValue({
                            FFSHOW: !data.getFieldValue("FFSHOW"),
                          });
                        }}
                      >
                        toggle FF show hide
                      </Button>
                    </Space>
                  </Col>
                  <Col>
                    <Data.Item shouldUpdate>
                      {(event, meta, dataInstance) => {
                        const { getFieldValue } = dataInstance;
                        const ASHOW = getFieldValue("ASHOW");
                        if (!ASHOW) {
                          return <></>;
                        }
                        return (
                          <Data.Item name="AA">
                            <TrimmedInputChildItem data-key="AA" />
                          </Data.Item>
                        );
                      }}
                    </Data.Item>
                  </Col>
                  <Col>
                    <Data.Item name="BB" dependencies={["AA"]}>
                      <TrimmedInputChildItem data-key="BB" />
                    </Data.Item>
                  </Col>
                  <Col>
                    <Data.Item name="CC" dependencies={["BB"]}>
                      <TrimmedInputChildItem data-key="CC" />
                    </Data.Item>
                  </Col>
                  <Col>
                    <Data.Item name="CC" dependencies={["BB"]}>
                      <TrimmedInputChildItem data-key="CC" />
                    </Data.Item>
                  </Col>
                  <Col>
                    <Data.Item name="DD" dependencies={[["CC"]]}>
                      <TrimmedInputChildItem data-key="FF" data={data} />
                    </Data.Item>
                  </Col>

                  <Col>
                    <Data.Item shouldUpdate>
                      {(event, meta, dataInstance) => {
                        const { getFieldValue } = dataInstance;
                        const FFSHOW = getFieldValue("FFSHOW");
                        if (!FFSHOW) {
                          return <></>;
                        }
                        return (
                          <Data.Item name="FF" dependencies={["AA"]}>
                            <TrimmedInputChildItem data-key="FF" />
                          </Data.Item>
                        );
                      }}
                    </Data.Item>
                  </Col>
                </CloneTransmit>
              </Card> */}
            </CloneTransmit>
          </Data>
        </Data.DataProvider>
      )}
    </>
  );
};

export default DataDemo;

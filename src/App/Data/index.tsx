import React, { useState } from "react";
import { Data } from "@components/Data";
import { Button, Col, Input, Row, Space } from "antd";
import CloneTransmit from "@components/CloneTransmit";
import { TrimmedInput } from "@components/Input";

const ChildItem = (props: any) => {
  console.log("ChildItem", props);
  return <Input style={{ width: 300 }} {...props} />;
};

const DataDemo = () => {
  const [toggle, setToggle] = useState(true);
  const [numToggle, setNumToggle] = useState(true);
  const [data] = Data.useData();
  console.log("data", data);

  return (
    <>
      <Row gutter={[24, 12]}>
        <Col span={24}>
          <Space size={12}>
            <div>获取：</div>
            <Button
              type="primary"
              onClick={() => {
                console.log("values", data.getFieldsValue());
              }}
            >
              获取
            </Button>
          </Space>
        </Col>
        <Col span={24}>
          <Space>
            <div>设置值：</div>
            <Button
              onClick={() => {
                data.setFieldValue("name", "王大陆");
              }}
            >
              设置值setFieldValue
            </Button>
            <Button
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
        <Col span={24}>
          <Space size={12}>
            <div>操作：</div>
            <Button
              onClick={() => {
                setToggle(!toggle);
              }}
            >
              切换toggle
            </Button>
            <Button
              onClick={() => {
                setNumToggle(!numToggle);
              }}
            >
              name切换toggle
            </Button>
          </Space>
        </Col>
      </Row>
      {toggle && (
        <Data
          data={data}
          initialValues={{
            name: "name",
            age: "age",
          }}
          onValuesChange={(...rest) => {
            console.log("onValuesChange", rest);
          }}
          preserve
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
            <Col span={24}>
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
            <Row style={{ width: "100%" }}>
              <Col span={24}>
                <Space>
                  <Button
                    onClick={() => {
                      data.setFieldValue("A", "AAAA");
                    }}
                  >
                    setFieldValue赋值A
                  </Button>
                  <Button
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
                  <Button
                    onClick={() => {
                      data.setFieldsValue({
                        A: "A6A6A6",
                      });
                    }}
                  >
                    setFieldsValue赋值A
                  </Button>
                </Space>
              </Col>
              <Col span={24}>
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
                    onClick={() => {
                      data.resetFields(["A"]);
                    }}
                  >
                    重置A
                  </Button>
                  <Button
                    onClick={() => {
                      data.resetFields(["A", "B"]);
                    }}
                  >
                    重置A、B
                  </Button>
                  <Button
                    onClick={() => {
                      data.resetFields(["A", "B", "C"]);
                    }}
                  >
                    重置A、B、C
                  </Button>
                </Space>
              </Col>
            </Row>
            <Col>
              <Data.Item
                name="A"
                getValueFromEvent={(e) => e.target.value}
                initialValue={"11"}
                onMetaChange={(meta, oldMeta) => {
                  console.log("A____onMetaChange", meta, oldMeta);
                }}
              >
                <ChildItem />
              </Data.Item>
              <Data.Item
                name="A"
                initialValue={"11"}
                getValueFromEvent={(e) => e.target.value}
              >
                <ChildItem />
              </Data.Item>
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
                  console.log("shouldUpdate", prevValue, nextValue, info);
                  return prevValue.A !== nextValue.A;
                }}
              >
                <Data.Item name="C" getValueFromEvent={(e) => e.target.value}>
                  <ChildItem data-key="C" />
                </Data.Item>
              </Data.Item>
            </Col>
            <Col>
              <Data.Item getValueFromEvent={(e) => e.target.value}>
                <ChildItem data-key="D" />
              </Data.Item>
            </Col>
          </CloneTransmit>
        </Data>
      )}
    </>
  );
};

export default DataDemo;

import { InputNumberProps } from "antd";

const [defaultMinValue, defaultMaxValue] = [0, 999999];

export const defaultConfig: InputNumberProps<number> = {
  min: defaultMinValue,
  max: defaultMaxValue,
  precision: 2,
  placeholder: "请输入",
};

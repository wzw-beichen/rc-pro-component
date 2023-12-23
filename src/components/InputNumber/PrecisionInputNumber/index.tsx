import React from "react";
import { InputNumber, InputNumberProps } from "antd";
import { defaultConfig } from "../constants";

const PrecisionInputNumber = (props: InputNumberProps<number>) => {
  const { ...others } = props;

  return (
    <InputNumber<number>
      {...defaultConfig}
      formatter={(
        value: number | undefined,
        info: {
          userTyping: boolean;
          input: string;
        }
      ) => {
        return `${value}`;
      }}
      {...others}
    />
  );
};

export default PrecisionInputNumber;

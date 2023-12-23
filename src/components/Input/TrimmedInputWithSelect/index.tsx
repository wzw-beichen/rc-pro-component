import React, { ChangeEvent } from "react";
import { Select, SelectProps } from "antd";
import { Merge } from "c-fn-utils";
import TrimmedInput, { TrimmedInputProps } from "../TrimmedInput";

export type TrimmedInputWithSelectProps = Merge<
  TrimmedInputProps,
  {
    value?: Record<string, string | number>;
    onChange?: (
      value?: Record<string, string | number>,
      e?: ChangeEvent<HTMLInputElement>
    ) => void;
    fieldsProps?: SelectProps;
    fieldNames?: Record<string, string>;
    position?: string[];
  }
>;

const TrimmedInputWithSelect = (props: TrimmedInputWithSelectProps) => {
  const { onChange, value, fieldsProps, fieldNames, ...others } = props;
  const { inputKey = "inputValue", selectKey = "selectValue" } =
    fieldNames || {};

  const inputValue = value?.[inputKey];
  const selectValue = value?.[selectKey];

  const triggerChange = (val: Record<string, string | number>) => {
    onChange?.(val);
  };

  const handleChange = (val: string, type: "input" | "select" = "input") => {
    const changeKey = type === "input" ? inputKey : selectKey;
    triggerChange?.({
      ...value,
      [changeKey]: val,
    });
  };

  const selectAfter = (
    <Select
      value={selectValue}
      onChange={(val) => handleChange(val, "select")}
      {...fieldsProps}
    />
  );

  return (
    <TrimmedInput
      value={inputValue}
      addonAfter={selectAfter}
      onChange={(value) => handleChange(value as string, "input")}
      {...others}
    />
  );
};

export default TrimmedInputWithSelect;

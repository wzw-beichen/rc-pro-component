import React, { ChangeEvent, FocusEvent, Ref } from "react";
import { Input, InputProps, InputRef } from "antd";
import { Merge } from "c-fn-utils";
import TrimmedTextArea from "../TrimmedTextArea";

export type TrimmedInputProps = Merge<
  InputProps,
  {
    onChange?: (value?: string, e?: ChangeEvent<HTMLInputElement>) => void;
    inputRef?: Ref<InputRef>;
  }
>;

const TrimmedInput = (props: TrimmedInputProps) => {
  const { onChange, onBlur, inputRef, ...others } = props;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange?.(value, e);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newValue = value?.trim();
    onChange?.(newValue);
    onBlur?.(e);
  };

  return (
    <Input
      {...others}
      ref={inputRef}
      onBlur={handleBlur}
      onChange={handleChange}
      allowClear
      placeholder="请输入"
    />
  );
};

TrimmedInput.TextArea = TrimmedTextArea;
export default TrimmedInput;

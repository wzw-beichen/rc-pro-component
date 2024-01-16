import React, { ChangeEvent, FocusEvent, Ref } from "react";
import { Input } from "antd";
import { Merge } from "c-fn-utils";
import { TextAreaProps } from "antd/es/input";
import { TextAreaRef } from "antd/es/input/TextArea";

const { TextArea } = Input;

export type TrimmedTextAreaProps = Merge<
  TextAreaProps,
  {
    onChange?: (value?: string, e?: ChangeEvent<HTMLTextAreaElement>) => void;
    textAreaRef?: Ref<TextAreaRef>;
  }
>;

const TrimmedTextArea = (props: TrimmedTextAreaProps) => {
  const { onChange, onBlur, textAreaRef, ...others } = props;

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    onChange?.(value, e);
  };

  const handleBlur = (e: FocusEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const newValue = value?.trim();
    if (value !== newValue) {
      onChange?.(newValue);
    }

    onBlur?.(e);
  };

  return (
    <TextArea
      {...others}
      ref={textAreaRef}
      onBlur={handleBlur}
      onChange={handleChange}
      maxLength={500}
      placeholder="请输入"
    />
  );
};

export default TrimmedTextArea;

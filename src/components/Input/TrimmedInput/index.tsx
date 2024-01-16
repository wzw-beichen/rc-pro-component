import React, { ChangeEvent, FocusEvent, Ref } from "react";
import { Input, InputProps, InputRef } from "antd";
import { Merge } from "c-fn-utils";
import classNames from "classnames";
import styles from "./index.module.less";

export type TrimmedInputProps = Merge<
  InputProps,
  {
    onChange?: (value?: string, e?: ChangeEvent<HTMLInputElement>) => void;
    inputRef?: Ref<InputRef>;
    /** 聚焦显示清除图标 */
    focusClear?: boolean;
  }
>;

const TrimmedInput = (props: TrimmedInputProps) => {
  const {
    onChange,
    onBlur,
    focusClear = true,
    inputRef,
    className,
    ...others
  } = props;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange?.(value, e);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newValue = value?.trim();
    if (newValue !== value) {
      onChange?.(newValue);
    }
    onBlur?.(e);
  };

  return (
    <Input
      className={classNames(
        {
          [styles.input_focus_clear]: focusClear,
        },
        className
      )}
      ref={inputRef}
      placeholder="请输入"
      allowClear
      {...others}
      onBlur={handleBlur}
      onChange={handleChange}
    />
  );
};

export default TrimmedInput;

import React, { cloneElement, isValidElement } from "react";
import { Form } from "antd";
import { composeProps } from "./utils";
import { RichFormItemProps, MyFormItemChildrenProps } from "./type";

const MyFormItemChildren = (props: MyFormItemChildrenProps) => {
  const { render, children, ...others } = props;
  // composeProps 合并执行 Form.Item 传的 onChange 及组件本身的方法
  const _children = cloneElement(
    children,
    composeProps(children.props, others, true)
  );
  if (render) {
    return render(_children);
  }
  return _children;
};

/**
 * Form.Item 的 children 增加 before、after
 * @param props
 * @returns FormItem
 */
const RichFormItem = (props: RichFormItemProps) => {
  const { render, children, ...others } = props;

  return (
    <Form.Item {...others}>
      {isValidElement(children) ? (
        <MyFormItemChildren render={render}>{children}</MyFormItemChildren>
      ) : (
        children
      )}
    </Form.Item>
  );
};

export default RichFormItem;

import React, {
  Children,
  ComponentClass,
  FC,
  cloneElement,
  isValidElement,
} from "react";
import { Space } from "antd";
import { Merge } from "c-fn-utils";
import Item, { ItemProps } from "./Item";
import { TransmitContext } from "./Context";

export type CloneTransmitProps = Merge<
  ItemProps,
  {
    /** 包裹的组件，默认div */
    component?: string | FC<any> | ComponentClass<any>;
  }
>;

const CloneTransmit = (props: CloneTransmitProps) => {
  const {
    commonProps,
    children,
    component: Component = Space,
    componentProps,
  } = props;

  const cloneChildren = () => {
    return Children.map(children, (child) => {
      if (isValidElement(child) && !isValidElement(child.props?.children)) {
        return cloneElement(child, {
          ...commonProps,
          ...child?.props,
        });
      }
      return child;
    });
  };
  return (
    <TransmitContext.Provider value={commonProps}>
      <Component {...componentProps}>{cloneChildren()}</Component>
    </TransmitContext.Provider>
  );
};

CloneTransmit.Item = Item;
export default CloneTransmit;

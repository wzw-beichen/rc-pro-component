import React, {
  Children,
  ReactNode,
  cloneElement,
  isValidElement,
  useContext,
  Fragment,
  useMemo,
  ComponentClass,
  FC,
} from "react";
import { TransmitContext } from "./Context";

export type ItemProps = {
  commonProps?: Record<string, any>;
  children?: ReactNode;
  /** 不穿或者false代表不需要被包裹 */
  component?: false | string | FC<any> | ComponentClass<any>;
  componentProps?: Record<string, any>;
};

const Item = (props: ItemProps) => {
  const { children, commonProps, component: Component, componentProps } = props;
  const contextProps = useContext(TransmitContext);

  const mergeCommonProps = useMemo(
    () => ({
      ...contextProps,
      ...commonProps,
    }),
    [contextProps, commonProps]
  );

  const cloneChildren = () => {
    return Children.map(children, (child) => {
      if (isValidElement(child) && typeof child.type !== "string") {
        return cloneElement(child, {
          ...mergeCommonProps,
          ...child?.props,
        });
      }
      return child;
    });
  };
  let ItemComponent = Component ? Component : Fragment;

  return <ItemComponent {...componentProps}>{cloneChildren()}</ItemComponent>;
};

export default Item;

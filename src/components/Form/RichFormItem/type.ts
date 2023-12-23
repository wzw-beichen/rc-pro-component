import { FormItemProps } from "antd";

export interface RichFormItemProps extends FormItemProps {
  render?: (children: React.ReactNode) => React.ReactElement;
}

export type MyFormItemChildrenProps = {
  render?: RichFormItemProps["render"];
  children: React.ReactElement;
};

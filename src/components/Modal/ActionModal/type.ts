import { ComponentClass, FC, ReactNode } from "react";
import { ModalProps } from "antd";
import { Merge } from "c-fn-utils";

export type NewModalProps = Merge<
  ModalProps,
  {
    onOk?: (
      e?: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      closeModal?: () => void
    ) => void;
  }
>;

export type ActionModalProps = {
  children?: ReactNode;
  beforeOpen?: () => boolean;
  modalProps?: NewModalProps;
  triggerChange?: (open: boolean) => void;
  onInit?: () => void;
  btn?: ReactNode;
  /** 包裹的组件，默认span */
  component?: string | FC<any> | ComponentClass<any>;
  titleBold?: boolean;
};

export type ActionModalRef = {
  triggerOpen: (visible: boolean) => void;
};

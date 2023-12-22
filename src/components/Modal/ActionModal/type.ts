import { ReactNode } from "react";
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
  btnClick?: (e?: React.MouseEvent<HTMLSpanElement>) => void;
  titleBold?: boolean;
};

import React, { Fragment, useState } from "react";
import { Modal } from "antd";
import classnames from "classnames";
import { ActionModalProps } from "./type";
import styles from "./index.module.less";

/**
 * 基于Antd Modal封装的弹窗组件
 * 自动维护 open
 */
const ActionModal = (props: ActionModalProps) => {
  const {
    children,
    triggerChange,
    onInit,
    btn,
    btnClick,
    beforeOpen,
    modalProps,
    titleBold,
  } = props;

  const { onOk, onCancel, className, ...others } = modalProps || {};

  const [open, setOpen] = useState(false);

  const triggerOpen = (visible: boolean) => {
    triggerChange?.(visible);
    setOpen(visible);
    // 执行初始化条件
    visible && onInit?.();
  };

  const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    btnClick?.(e);
    const isOpen = beforeOpen?.() ?? true;
    if (isOpen) {
      triggerOpen(true);
    }
  };

  const handleOk = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (onOk) {
      onOk(e, () => triggerOpen(false));
      return;
    }
    triggerOpen(false);
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    onCancel?.(e);
    triggerOpen(false);
  };

  return (
    <Fragment>
      <span onClick={handleClick}>{btn}</span>
      <Modal
        open={open}
        {...others}
        className={classnames(className, {
          [styles.modal_title_bold]: titleBold,
        })}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {children}
      </Modal>
    </Fragment>
  );
};

export default ActionModal;

import React, {
  Fragment,
  isValidElement,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Modal } from "antd";
import classnames from "classnames";
import { ActionModalRef, ActionModalProps } from "./type";
import styles from "./index.module.less";

/**
 * 基于Antd Modal封装的弹窗组件
 * 自动维护 open
 */
const ActionModal = forwardRef<ActionModalRef, ActionModalProps>(
  (props, ref) => {
    const {
      children,
      triggerChange,
      onInit,
      btn,
      beforeOpen,
      modalProps,
      titleBold,
      component: Component = "span",
    } = props;

    const { onOk, onCancel, className, ...others } = modalProps || {};

    const [open, setOpen] = useState(false);

    useImperativeHandle(ref, () => ({
      triggerOpen,
    }));

    const triggerOpen = (visible: boolean) => {
      triggerChange?.(visible);
      setOpen(visible);
      // 执行初始化条件
      visible && onInit?.();
    };

    const handleClick = (e: React.MouseEvent) => {
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

    const handleCancel = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      onCancel?.(e);
      triggerOpen(false);
    };

    const renderBtn = () => {
      if (isValidElement(btn)) {
        const { props } = btn;
        /** 不添加多的无用的span或者div包裹标签 */
        return React.cloneElement<Record<string, any>>(btn, {
          onClick: (e: React.MouseEvent) => {
            handleClick(e);
            props?.onClick?.(e);
          },
        });
      }
      if (btn === null || btn === undefined) {
        return false;
      }
      return <Component onClick={handleClick}>{btn}</Component>;
    };

    return (
      <Fragment>
        {renderBtn()}
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
  }
);

export default ActionModal;

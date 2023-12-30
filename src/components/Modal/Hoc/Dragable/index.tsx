import React, { Component, ForwardedRef, ReactNode } from "react";
import { uuid } from "c-fn-utils";
import classnames from "classnames";
import { ActionModalProps, ActionModalRef } from "@components/Modal";

export type DragableProps = ActionModalProps & {
  triggleChange?: (visible: boolean) => void;
  children?: ReactNode;
  /** 是否可拖动，默认false */
  dragable?: boolean;
  /** 是否限制不能移出屏幕，默认true */
  limit?: boolean;
  forwardedRef?: ForwardedRef<ActionModalRef>;
};

type DragableState = {
  simpleClass: string;
  init: boolean;
};

const modalClass = {
  prefix: "dragable_",
  header: "ant-modal-header",
  icon: "modal_dragable_icon",
};

const DragableHoc = (WrappedComponent: any) => {
  class Dragable extends Component<DragableProps, DragableState> {
    state = {
      simpleClass: "",
      init: false,
    };

    contain: HTMLElement | null = null;
    content: HTMLElement | null = null;

    componentDidMount() {
      const uuidClass = uuid();
      this.setState({
        simpleClass: `${modalClass.prefix}${uuidClass}`,
      });
    }

    querySelector = (className?: string, element?: Element) => {
      if (!className) return null;
      const bodyElement = element ? element : document;
      return bodyElement.querySelector("." + className);
    };

    move = (event: MouseEvent) => {
      const { movementX, movementY } = event;
      const { top, right, bottom, left, width, height } =
        this.contain.getBoundingClientRect();

      const { limit = true } = this.props;
      this.contain.style.top = top + movementY + "px";
      this.contain.style.left = left + movementX + "px";

      if (limit) {
        if (bottom + movementY > window.innerHeight) {
          this.contain.style.top = window.innerHeight - height + "px";
        }
        if (top + movementY < 0) {
          this.contain.style.top = "0px";
        }
        if (right + movementX > window.innerWidth) {
          this.contain.style.left = window.innerWidth - width + "px";
        }
        if (left + movementX < 0) {
          this.contain.style.left = "0px";
        }
      }
    };

    removeMove = () => {
      window.removeEventListener("mousemove", this.move, false);
    };

    removeUp = () => {
      document.body.onselectstart = () => true;
      this.removeMove();
    };

    create = (isOpen: boolean) => {
      if (!isOpen) return;
      const { simpleClass } = this.state;
      const { modalProps, dragable } = this.props;
      const { title, centered } = modalProps || {};
      if (title && dragable && isOpen) {
        setTimeout(() => {
          const element = this.querySelector(simpleClass) as HTMLElement;
          const contentElement = element.parentNode.parentNode as HTMLElement;
          this.content = contentElement;
          this.contain = contentElement.parentNode as HTMLElement;
          const dragableElement = this.querySelector(
            modalClass.header,
            this.contain
          ) as HTMLElement;

          this.contain.style.overflow = "visible";
          dragableElement.style.cursor = "all-scroll";

          const { width, height } = this.contain.getBoundingClientRect();

          this.contain.style.top = centered
            ? `calc(50% - ${height / 2}px)`
            : "100px";
          this.contain.style.left = `calc(50% - ${width / 2}px)`;
          this.contain.style.paddingBottom = "0px";

          dragableElement.onmousedown = () => {
            document.body.onselectstart = () => false;
            window.addEventListener("mousemove", this.move, false);
          };
          window.addEventListener("mouseup", this.removeUp, false);
        });
      }
    };

    componentWillUnmount() {
      window.removeEventListener("mouseup", this.removeUp, false);
    }

    handleTriggleChange = (isOpen: boolean) => {
      const { triggleChange } = this.props;
      this.create(isOpen);
      triggleChange?.(isOpen);
    };

    render() {
      const {
        triggleChange,
        children,
        modalProps,
        dragable,
        forwardedRef,
        ...others
      } = this.props;
      const { style, centered, wrapClassName, title } = modalProps || {};
      const { simpleClass } = this.state;

      return (
        <WrappedComponent
          ref={forwardedRef}
          modalProps={{
            ...modalProps,
            wrapClassName: classnames({
              wrapClassName,
              ["dragable_index"]: dragable,
            }),
            style: {
              ...(dragable && title
                ? {
                    display: "inline-block",
                  }
                : {}),
              ...style,
            },
            centered: dragable ? false : centered,
          }}
          triggerChange={this.handleTriggleChange}
          {...others}
        >
          <div className={simpleClass}>{children}</div>
        </WrappedComponent>
      );
    }
  }
  // 注意 React.forwardRef 回调的第二个参数 “ref”。
  // 我们可以将其作为常规 prop 属性传递给 Dragable “forwardedRef”
  // 然后它就可以被挂载到被 Dragable 包裹的子组件上。
  return React.forwardRef<ActionModalRef, DragableProps>((props, ref) => {
    return <Dragable {...props} forwardedRef={ref} />;
  });
};

export default DragableHoc;

import React, {
  ForwardRefExoticComponent,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { CopyOutlined, CheckOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { isObject } from "c-fn-utils";

export type CopyIconProps = {
  className?: string;
  copyable?:
    | boolean
    | {
        // 自定义拷贝图标：[默认图标, 拷贝后的图标], 默认[<CopyOutlined />, ]
        icon?: [ReactNode, ReactNode];
        // 自定义提示文案，为 false 时隐藏文案，默认[复制, 复制成功]
        tooltips?: [ReactNode, ReactNode];
      };
  onClick?: (callback: (result: boolean) => void) => void;
};

const CopyIcon = (props: CopyIconProps) => {
  const [toggle, setToggle] = useState(0);
  const { copyable, onClick, ...others } = props;

  if (!copyable) return null;

  useEffect(() => {
    if (toggle && copyable) {
      setTimeout(() => {
        setToggle(0);
      }, 3000);
    }
  }, [toggle]);

  const handleClick = () => {
    onClick?.((isSuccess) => {
      if (isSuccess) {
        setToggle(Number(!toggle));
      }
    });
  };

  const {
    icon = [CopyOutlined, CheckOutlined],
    tooltips = ["复制", "复制成功"],
  } = isObject(copyable) ? copyable : {};

  const IconComponent = icon[toggle] as ForwardRefExoticComponent<
    Record<string, any>
  >;
  const title = tooltips[toggle];

  return (
    <Tooltip title={title}>
      <IconComponent {...others} onClick={handleClick} />
    </Tooltip>
  );
};

export default CopyIcon;

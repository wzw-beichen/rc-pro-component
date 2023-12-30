import React, { CSSProperties, Fragment } from "react";
import classnames from "classnames";
import CopyIcon, { CopyIconProps } from "./CopyIcon";
import styles from "./index.module.less";

export type CopyTextProps = CopyIconProps & {
  ellipsis?: {
    // 最多显示的行数
    rows?: number;
    // 显示最后几位数
    count?: number;
  };
  style?: CSSProperties;
  onCopy?: (isSuccess: boolean) => void;
  children?: string;
};

const CopyText = (props: CopyTextProps) => {
  const {
    copyable = true,
    ellipsis,
    className,
    style,
    onCopy,
    children,
  } = props;
  const { rows = 1, count } = ellipsis || {};

  const handleCopy = (callback: (result: boolean) => void) => {
    /* 复制内容到文本域 */
    navigator.clipboard
      .writeText(children)
      .then(() => {
        onCopy?.(true);
        callback(true);
      })
      .catch(() => {
        onCopy?.(false);
        callback(false);
      });
  };

  const commonProps = {
    copyable,
    onClick: handleCopy,
  };

  const renderNode = (str: string) => {
    if (rows === 1) return str;

    return (
      <Fragment>
        <CopyIcon
          {...commonProps}
          className={classnames(styles.copy_icon, styles.before_copy_icon)}
        />
        {str}
        <CopyIcon
          {...commonProps}
          className={classnames(styles.copy_icon, styles.after_copy_icon)}
        />
      </Fragment>
    );
  };

  return (
    // width: 0 或者 minWidth: 0 或者 overflow: "hidden"
    <div
      className={classnames(className, styles.copy_text)}
      style={{ flex: 1, width: 0, ...style }}
    >
      <div
        className={classnames(styles.text_ellipsis, {
          [styles.single_ellipsis]: rows === 1,
          [styles.multLine_ellipsis]: rows > 1,
        })}
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          ...(rows > 1 ? { lineClamp: rows, WebkitLineClamp: rows } : {}),
        }}
        title={children}
      >
        {renderNode(children)}
      </div>
      {copyable && rows === 1 && (
        <CopyIcon {...commonProps} className={styles.copy_icon} />
      )}
    </div>
  );
};

export default CopyText;

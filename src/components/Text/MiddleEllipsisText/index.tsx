import React, { CSSProperties } from "react";
import classname from "classnames";
import styles from "./index.module.less";

type Props = {
  className?: string;
  children?: string;
  suffix?: string;
  suffixCount?: number;
  commonStyle?: CSSProperties;
  wrapStyle?: CSSProperties;
  titleStyle?: CSSProperties;
};

const MiddleEllipsisText = (props: Props) => {
  const {
    children,
    suffixCount = 3,
    suffix,
    className,
    commonStyle,
    wrapStyle,
    titleStyle,
  } = props;

  const dataTitle = suffix ? suffix : children.slice(-suffixCount);
  return (
    <div className={classname(styles.text_wrap, className)}>
      <div className={styles.text} style={{ ...commonStyle, ...wrapStyle }}>
        {children}
      </div>
      <div
        className={styles.text_title}
        data-title={dataTitle}
        title={children}
        style={{ ...commonStyle, ...titleStyle }}
      >
        {children}
      </div>
    </div>
  );
};

export default MiddleEllipsisText;

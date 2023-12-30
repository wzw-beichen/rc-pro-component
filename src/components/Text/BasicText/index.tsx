import React, { ReactNode } from "react";
import CopyText from "../CopyText";
import MiddleEllipsisText from "../MiddleEllipsisText";

type TextProps = {
  children?: ReactNode;
};

const Text = (props: TextProps) => {
  const { children } = props;

  return <React.Fragment>{children}</React.Fragment>;
};

Text.Copy = CopyText;
Text.MiddleEllipsis = MiddleEllipsisText;

export default Text;

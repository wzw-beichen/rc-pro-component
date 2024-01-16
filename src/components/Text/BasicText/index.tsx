import React, { ReactNode } from "react";

type TextProps = {
  children?: ReactNode;
};

const Text = (props: TextProps) => {
  const { children } = props;

  return <React.Fragment>{children}</React.Fragment>;
};

export default Text;

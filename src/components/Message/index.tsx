import { message } from "antd";
import { ArgsProps, NoticeType } from "antd/es/message/interface";

export type NewArgsProps = Omit<ArgsProps, "type"> | React.ReactNode;

/**
 * 二次封装message
 * 方便后续居中，同样的提示只显示一个，不显示多个
 */
const MsgType = (type: NoticeType, config: NewArgsProps, destroy?: boolean) => {
  destroy && message.destroy();
  message[type](config);
};

const MsgWarn = (config: NewArgsProps, destroy = true) => {
  MsgType("warning", config, destroy);
};

const MsgSuccess = (config: NewArgsProps, destroy = true) => {
  MsgType("success", config, destroy);
};

const MsgInfo = (config: NewArgsProps, destroy = true) => {
  MsgType("info", config, destroy);
};

const MsgError = (config: NewArgsProps, destroy = true) => {
  MsgType("error", config, destroy);
};

const MsgLoading = (config: NewArgsProps, destroy = true) => {
  MsgType("loading", config, destroy);
};

export { MsgWarn, MsgSuccess, MsgInfo, MsgError, MsgLoading };

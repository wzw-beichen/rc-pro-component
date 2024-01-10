import { CommonRecord, TRequestConfig } from "../type";

export type InitRequestType<T = any> = TRequestConfig<T> & {
  renderItem?: (dataList: T[]) => React.ReactNode;
  /** 初始化是否请求，默认为true，下拉搜索框第一次不用请求 */
  initRequest?: boolean;
};

export type InitRequestRef<T = any> = {
  onRequest: (dataList?: CommonRecord) => void;
  setDataList: React.Dispatch<React.SetStateAction<T[]>>;
};

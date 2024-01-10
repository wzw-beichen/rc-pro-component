import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { pickObjectField } from "c-fn-utils";
import { InitRequestRef, InitRequestType } from "./type";
import { CommonRecord } from "../type";

/** @name 数据请求InitRequest, 可能组件类型不同，例如下拉框、checkBox */
const InitRequest = forwardRef<InitRequestRef, InitRequestType>(
  (props, ref) => {
    const { requestConfig, renderItem, initRequest } = props;
    const {
      resRename,
      beforeData,
      request,
      extraParams,
      onBeforeRequest,
      onRequestFinally,
    } = requestConfig || {};
    const { listStr } = resRename || {};
    const { beforeListData } = beforeData || {};

    const [dataList, setDataList] = useState<any[]>([]);
    /** 每次request请求顺序，先请求，值越小，为了处理请求竞态问题哦 */
    const requestMaxOrder = useRef(1);

    useImperativeHandle(ref, () => ({
      setDataList,
      onRequest: handleRequest,
    }));

    useEffect(() => {
      if (initRequest) return;
      handleRequest();
    }, []);

    const handleRequest = async (params?: CommonRecord) => {
      /** currentOrder 当前本次请求顺序值 */
      const currentOrder = requestMaxOrder.current + 1;
      /** 更新请求顺序最大值 */
      requestMaxOrder.current = currentOrder;
      const newParams = {
        ...params,
        ...extraParams,
      };
      request && onBeforeRequest?.();
      request?.(newParams)
        .then((data) => {
          /** 不是最后一次请求，不用set覆盖掉前面的值 */
          if (requestMaxOrder.current !== currentOrder) return;
          const dataList =
            listStr && data ? pickObjectField(data, listStr) : data || [];
          let list = beforeListData ? beforeListData(dataList) : dataList;
          const arrayList = Array.isArray(list) ? list : [];
          setDataList(arrayList);
        })
        .finally(() => {
          onRequestFinally?.();
        });
    };

    return renderItem?.(dataList);
  }
);

export default InitRequest;

export type CommonRecord = Record<string, any>;

/** 请求配置 */
export type TRequestConfig<T> = {
  requestConfig?: {
    /** request 请求在组件外面，数据解析在组件内部，兼容性大大提高 */
    request?: (data?: CommonRecord) => Promise<any>;
    /** 额外参数 */
    extraParams?: Record<string, any>;
    /** 重命名响应参数, 默认使用data.pageData, data.totalRecords */
    resRename?: {
      listStr?: string;
      totalStr?: string;
    };
    /** 数据处理 */
    beforeData?: {
      /* 数据获取前，对查询参数进行处理 */
      beforeSearchData?: (data: Record<string, any>) => Record<string, any>;
      /* 请求后，对返回数据进行处理 */
      beforeListData?: (data: T[]) => T[];
    };
    /** 请求之前，可以设置loading之类的 */
    onBeforeRequest?: () => void;
    /** 请求finally后触发 */
    onRequestFinally?: () => void;
  };
};

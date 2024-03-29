import { Callbacks } from "../Data/type";
import { FieldData, FieldEntity, InternalFieldData, Meta } from "../Field/type";
import { InternalNamePath, NamePath, Store, StoreValue } from "../type";

export type DataInstance<Values = any> = {
  // Origin Data API
  getFieldValue: (name: NamePath) => StoreValue;
  getFieldsValue: (() => Values) &
    ((nameList: NamePath[] | true, filterFunc?: FilterFunc) => any) &
    ((config: GetFieldsValueConfig) => any);
  resetFields: (fields?: NamePath[]) => void;
  setFields: (fields: FieldData[]) => void;
  setFieldValue: (name: NamePath, values: any) => void;
  setFieldsValue: (store: Store) => void;
};

export type InternalDataInstance = DataInstance & {
  /**
   * Passed by field context props
   */
  prefixName?: InternalNamePath;

  /**
   * Data component should register some content into store.
   * We pass the `HOOK_MARK` as key to avoid user call the function.
   */
  getInternalHooks: (secret: string) => InternalHooks | null;

  /** @private Internal usage. Do not use it in your production */
  _init?: boolean;
};

export type InternalHooks = {
  dispatch: (action: ReducerAction) => void;
  /** 初始化实体值(EntityValue), Field用nitialValue去更新store中的值 */
  initEntityValue: (entity: FieldEntity) => void;
  registerField: (entity: FieldEntity) => () => void;
  useSubscribe: (subscribable: boolean) => void;
  setInitialValues: (value: Store, init: boolean) => void;
  destoryData: () => void;
  setCallbacks: (callbacks: Callbacks) => void;
  getFields: () => InternalFieldData[];
  setPreserve: (preserve?: boolean) => void;
  getInitialValue: (namePath: InternalNamePath) => StoreValue;
  registerWatch: (callback: WatchCallBack) => () => void;
};

export type WatchCallBackType =
  | "register"
  | "unRegister"
  | SetFieldInfo["type"]
  | ValueUpdateInfo["type"]
  | ResetInfo["type"];

export type WatchCallBack = (
  value: Store,
  allValue: Store,
  // [["user", 0, "name"], ["user", 0, "age"]]
  namePathList: InternalNamePath[],
  type?: WatchCallBackType
) => void;

export type FilterFunc = (meta: Meta) => boolean;

export type GetFieldsValueConfig = { strict?: boolean; filter?: FilterFunc };

export type UpdateAction = {
  type: "updateValue";
  namePath: InternalNamePath;
  value: StoreValue;
};

export type ReducerAction = UpdateAction;

export type ValueUpdateInfo = {
  type: "valueUpdate";
  // internal 里面的 onChange
  // external 外部的 setFieldsValue
  source: "internal" | "external" | "register";
};

export type SetFieldInfo = {
  type: "setField";
  data: FieldData;
};

export type RemoveInfo = {
  type: "remove";
};

export type ResetInfo = {
  type: "reset";
};

export type DependenciesUpdateInfo = {
  type: "dependenciesUpdate";
  /**
   * Contains all the related `InternalNamePath[]`.
   * a <- b <- c : change `a`
   * relatedFields=[a, b, c]
   */
  relatedFields: InternalNamePath[];
};

export type NotifyInfo =
  | ValueUpdateInfo
  | RemoveInfo
  | SetFieldInfo
  | ResetInfo
  | DependenciesUpdateInfo;
